import { useEffect, useRef, useState } from 'react';
import { AnexoCampanha } from '../modelos';
import { abrirPdf, DocumentoPdf, lerBlob } from '../pdf';
import { lerFichaSomenteLeitura } from '../leituraFichaJson';
import './visualizadorFicha.css';

function Valor({ valor }: { valor: unknown }) {
  if (valor === undefined || valor === null) return <span>Não informado</span>;
  if (typeof valor !== 'object') return <span>{String(valor)}</span>;
  if (Array.isArray(valor)) return valor.length ? <ul>{valor.map((v, i) => <li key={i}><Valor valor={v} /></li>)}</ul> : <span>Nenhum registro</span>;
  return <dl>{Object.entries(valor).map(([k, v]) => <div key={k}><dt>{k}</dt><dd><Valor valor={v} /></dd></div>)}</dl>;
}
const campos: [string, string[]][] = [
  ['Identidade', ['nomePersonagem', 'versaoRegras', 'racaPrincipal', 'subRaca', 'backGround']],
  ['Classes e níveis', ['classePrincipal', 'levelTotal', 'multiclasses', 'subClasse']],
  ['Atributos', ['atributosPersonagem']],
  ['Defesas e PV históricos', ['vidaAtual', 'vidaTotal', 'classeArmadura', 'cA', 'iniciativa', 'speed']],
  ['Perícias e proficiências', ['pericias', 'proeficiencia', 'idiomas']],
  ['Características e recursos', ['efeitos', 'talentos', 'recursos', 'magiasConjuracao', 'estiloLuta']],
  ['Equipamentos', ['ArmaduraEquipada', 'escudoEquipado', 'ArmaEquipada', 'itensEquipados', 'itensMochila']],
];
const rotulos: Record<string, string> = {
  nomePersonagem: 'Nome', versaoRegras: 'Edição', racaPrincipal: 'Raça / espécie', subRaca: 'Sub-raça', backGround: 'Antecedente',
  classePrincipal: 'Classe principal', levelTotal: 'Nível total', multiclasses: 'Multiclasses', subClasse: 'Subclasses',
  atributosPersonagem: 'Valores dos atributos', vidaAtual: 'PV atuais na importação', vidaTotal: 'PV máximos na importação',
  classeArmadura: 'Classe de armadura', cA: 'CA registrada', iniciativa: 'Iniciativa', speed: 'Deslocamento', pericias: 'Perícias',
  proeficiencia: 'Proficiência', idiomas: 'Idiomas', efeitos: 'Características e efeitos', talentos: 'Talentos', recursos: 'Recursos',
  magiasConjuracao: 'Magias', estiloLuta: 'Estilos de luta', ArmaduraEquipada: 'Armadura equipada', escudoEquipado: 'Escudo equipado',
  ArmaEquipada: 'Armas equipadas', itensEquipados: 'Itens equipados', itensMochila: 'Mochila',
};
export const MAX_PIXELS_PDF = 16_000_000;
export const MAX_LADO_PDF = 8192;

export default function VisualizadorDocumento({ anexo }: { anexo: AnexoCampanha }) {
  const [url, setUrl] = useState('');
  const [pdf, setPdf] = useState<DocumentoPdf | null>(null);
  const [json, setJson] = useState<Record<string, unknown> | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [zoom, setZoom] = useState(1);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fonte = useRef(anexo);
  fonte.current = anexo;
  const imagem = anexo.mime.startsWith('image/');
  useEffect(() => {
    let ativo = true;
    let documento: DocumentoPdf | null = null;
    const original = fonte.current;
    const local = URL.createObjectURL(original.arquivo.slice(0, original.arquivo.size, original.mime));
    setUrl(local); setErro(''); setJson(null); setPdf(null); setPagina(1); setZoom(1); setCarregando(true);
    const carregar = async () => {
      try {
        if (original.mime === 'application/pdf') {
          documento = await abrirPdf(original.arquivo);
          if (ativo) setPdf(documento); else await documento.destroy();
        } else if (original.mime === 'application/json') {
          const dados = lerFichaSomenteLeitura(await lerBlob(original.arquivo, true) as string);
          if (ativo) setJson(dados);
        }
      } catch { if (ativo) setErro('Não foi possível visualizar este arquivo. Você pode abrir ou baixar o original.'); }
      finally { if (ativo && !imagem) setCarregando(false); }
    };
    void carregar();
    return () => { ativo = false; URL.revokeObjectURL(local); if (documento) void documento.destroy(); };
  // IDs identificam anexos imutáveis. Salvar PV devolve novos Blobs do IndexedDB,
  // mas não deve recarregar o documento aberto nem perder página/zoom.
  }, [anexo.id, anexo.campanhaId, anexo.mime, imagem]);
  useEffect(() => {
    if (!pdf) return;
    const elemento = canvas.current;
    let ativo = true;
    let tarefa: { promise: Promise<void>; cancel(): void } | undefined;
    setCarregando(true); setErro('');
    const renderizar = async () => {
      try {
        const folha = await pdf.getPage(pagina);
        if (!ativo || !canvas.current) return;
        const natural = folha.getViewport({ scale: 1 });
        if (!Number.isFinite(natural.width) || !Number.isFinite(natural.height) || natural.width <= 0 || natural.height <= 0) throw new Error('Dimensões inválidas');
        const disponivel = canvas.current.parentElement?.clientWidth || natural.width;
        const escala = Math.min(1, disponivel / natural.width) * zoom;
        const limite = Math.min(Math.sqrt(MAX_PIXELS_PDF / natural.width / natural.height), MAX_LADO_PDF / natural.width, MAX_LADO_PDF / natural.height);
        const viewport = folha.getViewport({ scale: Math.min(escala, limite) });
        const contexto = canvas.current.getContext('2d');
        if (!contexto) throw new Error('Canvas indisponível');
        canvas.current.width = viewport.width; canvas.current.height = viewport.height;
        tarefa = folha.render({ canvasContext: contexto, viewport });
        await tarefa.promise;
      } catch { if (ativo) setErro('Não foi possível renderizar a página do PDF. Abra ou baixe o original.'); }
      finally { if (ativo) setCarregando(false); }
    };
    void renderizar();
    return () => { ativo = false; tarefa?.cancel(); if (elemento) { elemento.width = 0; elemento.height = 0; } };
  }, [pdf, pagina, zoom]);
  return <section className="am-documento" aria-label={`Documento ${anexo.nome}`}>
    <div className="am-documento-acoes">
      {url && <><a href={url} target="_blank" rel="noopener noreferrer">Abrir original</a><a href={url} download={anexo.nome}>Baixar original</a></>}
      {(imagem || pdf) && <label>Zoom <select value={zoom} onChange={e => setZoom(Number(e.target.value))}>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(n => <option key={n} value={n}>{Math.round(n * 100)}%</option>)}
      </select></label>}
      {pdf && <><button type="button" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>Página anterior</button><span aria-live="polite">Página {pagina} de {pdf.numPages}</span><button type="button" disabled={pagina >= pdf.numPages} onClick={() => setPagina(p => p + 1)}>Próxima página</button></>}
    </div>
    {carregando && <p role="status">Carregando documento…</p>}
    {erro && <p role="alert">{erro}</p>}
    <div className="am-documento-pagina">
      {imagem && url && <img src={url} alt={`Ficha original: ${anexo.nome}`} style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? '100%' : 'none' }} onLoad={() => setCarregando(false)} onError={() => { setCarregando(false); setErro('Não foi possível carregar a imagem. Abra ou baixe o original.'); }} />}
      {pdf && <canvas ref={canvas} role="img" aria-label={`Página ${pagina} do PDF ${anexo.nome}`} />}
      {json && <><p>Snapshot original somente leitura. Os PV abaixo são históricos; os PV de cada instância são independentes.</p>{campos.map(([titulo, chaves]) => {
        const presentes = chaves.filter(chave => json[chave] !== undefined && json[chave] !== null);
        return presentes.length ? <section className="am-json-grupo" key={titulo}><h3>{titulo}</h3><dl>{presentes.map(chave => <div key={chave}><dt>{rotulos[chave] ?? chave}</dt><dd><Valor valor={json[chave]} /></dd></div>)}</dl></section> : null;
      })}<details><summary>Todos os campos do JSON original</summary><pre>{JSON.stringify(json, null, 2)}</pre></details></>}
    </div>
  </section>;
}
