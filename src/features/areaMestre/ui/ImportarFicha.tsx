import { useEffect, useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { prepararImportacaoComPdf } from '../pdfFichaJson';
import { confirmarMetadados, ImportacaoConfirmada, prepararRetrato } from '../importacaoVisual';
import { AnexoCampanha, CategoriaFicha } from '../modelos';
import VisualizadorDocumento from './VisualizadorDocumento';
import RecortarRetrato from './RecortarRetrato';
import './importarFicha.css';

type Props = {
  categoria: CategoriaFicha;
  campanhaId: string;
  onConfirmar: (resultado: ImportacaoConfirmada) => Promise<boolean>;
  onFechar: () => void;
};

export default function ImportarFicha({ categoria, campanhaId, onConfirmar, onFechar }: Props) {
  const [resultado, setResultado] = useState<ImportacaoConfirmada | null>(null);
  const [retrato, setRetrato] = useState<AnexoCampanha | null>(null);
  const [nome, setNome] = useState('');
  const [maximos, setMaximos] = useState('0');
  const [atuais, setAtuais] = useState('0');
  const [ocupado, setOcupado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [confirmacaoIniciada, setConfirmacaoIniciada] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [reconhecendo, setReconhecendo] = useState(false);
  const [progresso, setProgresso] = useState('');
  const controle = useRef<AbortController | null>(null);
  const manual = useRef({ nome: false, maximos: false, atuais: false });
  const sequencia = useRef(0);
  const arquivoSelecionado = useRef<File | null>(null);
  useEffect(() => () => { sequencia.current += 1; controle.current?.abort(); }, []);
  const selecionar = async (arquivo?: File) => {
    arquivoSelecionado.current = arquivo ?? null;
    const atual = ++sequencia.current;
    controle.current?.abort(); manual.current = { nome: false, maximos: false, atuais: false }; setReconhecendo(false);
    setResultado(null); setRetrato(null); setErro(''); setAviso('');
    if (!arquivo) return;
    setOcupado(true);
    try {
      const preparado = await prepararImportacaoComPdf(arquivo, { campanhaId, categoria, fichaId: crypto.randomUUID(), anexoId: crypto.randomUUID(), importadoEm: new Date().toISOString() });
      const pv = preparado.ficha.pvIniciais;
      if (atual !== sequencia.current) return;
      setResultado(preparado);
      setNome(preparado.ficha.nome); setMaximos(String(pv.maximos)); setAtuais(String(pv.atuais));
      if (preparado.ficha.avisos.length) setAviso(pv.maximos ? 'Revise os dados detectados antes de importar.' : 'PV não identificados. Informe os valores manualmente ou mantenha 0 como indefinido.');
      if (preparado.ficha.formato !== 'json') {
        const abortar = new AbortController(); controle.current = abortar; setReconhecendo(true);
        void import('../reconhecimento').then(h => h.reconhecerArquivo(preparado.anexos[0], categoria, mensagem => { if (atual === sequencia.current && !abortar.signal.aborted) setProgresso(mensagem); }, abortar.signal)).then(r => {
          if (atual !== sequencia.current || abortar.signal.aborted) return;
          if (r.nome && !manual.current.nome) setNome(r.nome);
          if (r.pv) { if (!manual.current.maximos) setMaximos(String(r.pv.maximos)); if (!manual.current.atuais) setAtuais(String(r.pv.atuais)); }
          setAviso([...r.avisos, 'Revise os dados reconhecidos antes de incluir.'].join(' '));
        }).catch(() => { if (atual === sequencia.current && !abortar.signal.aborted) setAviso('Não foi possível reconhecer a ficha. Informe nome e PV manualmente.'); }).finally(() => { if (atual === sequencia.current) setReconhecendo(false); });
      }
    } catch (e) { if (atual === sequencia.current) setErro(e instanceof Error ? e.message : 'Não foi possível ler o arquivo.'); }
    finally { if (atual === sequencia.current) setOcupado(false); }
  };
  const selecionarRetrato = async (arquivo?: File) => {
    setErro(''); setRetrato(null);
    if (!arquivo) return;
    const atual = sequencia.current;
    setOcupado(true);
    try { const anexo = await prepararRetrato(arquivo, campanhaId); if (atual === sequencia.current) setRetrato(anexo); }
    catch (e) { if (atual === sequencia.current) setErro(e instanceof Error ? e.message : 'Retrato inválido.'); }
    finally { if (atual === sequencia.current) setOcupado(false); }
  };
  const confirmar = async () => {
    if (!resultado || ocupado || salvando || reconhecendo) return;
    setErro('');
    try {
      const revisado = confirmarMetadados(resultado, nome, maximos, atuais);
      if (retrato) { revisado.ficha = { ...revisado.ficha, imagemAnexoId: retrato.id }; revisado.anexos = [...revisado.anexos, retrato]; }
      setConfirmacaoIniciada(true);
      setSalvando(true);
      if (await onConfirmar(revisado)) onFechar();
      else setErro('Não foi possível salvar. Sua importação permanece disponível nesta janela e pode estar pendente na campanha; verifique o erro de armazenamento e tente novamente.');
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível importar.'); }
    finally { setSalvando(false); }
  };
  const fechar = () => { if (!salvando) onFechar(); };
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-importar-ficha" aria-label={`Importar ficha de ${categoria}`} onClose={fechar}>
    <h2>Importar ficha de {categoria}</h2>
    <form onSubmit={e => { e.preventDefault(); void confirmar(); }}>
      <label htmlFor="am-importar-arquivo">Arquivo da ficha (até 20 MiB; JSON até 5 MiB)</label>
      <input id="am-importar-arquivo" type="file" accept={categoria === 'jogador' ? '.pdf,.png,.jpg,.jpeg,.gif,.webp,.json' : '.pdf,.png,.jpg,.jpeg,.gif,.webp'} disabled={ocupado || salvando || confirmacaoIniciada} onChange={e => void selecionar(e.target.files?.[0])} />
      {ocupado && <p role="status">Preparando arquivo e PDF da ficha…</p>}
      {reconhecendo && <div><p role="status">{progresso || 'Reconhecendo nome e PV…'}</p><button type="button" onClick={() => { controle.current?.abort(); setReconhecendo(false); setAviso('Reconhecimento cancelado. Revise os campos manualmente.'); }}>Parar reconhecimento e preencher manualmente</button></div>}
      {resultado && <>
        <p>Formato: {resultado.ficha.formato.toUpperCase()}{resultado.ficha.origemJson ? ` · ${resultado.ficha.origemJson.versaoRegras.replace('_', ' ')}` : ''}</p>
        <p>Arquivo: {resultado.anexos[0].nome}</p>
        {resultado.ficha.formato !== 'json' && <VisualizadorDocumento anexo={resultado.anexos[0]} />}
        {aviso && <p role="status">{aviso}</p>}
        <label htmlFor="am-importar-nome">Nome da ficha</label>
        <input id="am-importar-nome" value={nome} maxLength={200} disabled={salvando} onChange={e => { manual.current.nome = true; setNome(e.target.value); }} />
        <div className="am-importar-pv"><label>PV máximos<input type="number" min="0" step="1" value={maximos} disabled={salvando} onChange={e => { manual.current.maximos=true; setMaximos(e.target.value); }} /></label><label>PV atuais<input type="number" min="0" step="1" value={atuais} disabled={salvando} onChange={e => { manual.current.atuais=true; setAtuais(e.target.value); }} /></label></div>
        {resultado.ficha.formato !== 'json' && <RecortarRetrato anexo={resultado.anexos[0]} onRetrato={setRetrato} disabled={salvando || ocupado || reconhecendo} />}
        <label htmlFor="am-importar-retrato">Retrato opcional</label><input id="am-importar-retrato" type="file" accept=".png,.jpg,.jpeg,.gif,.webp" disabled={ocupado || salvando} onChange={e => void selecionarRetrato(e.target.files?.[0])} />{retrato && <><VisualizadorDocumento anexo={retrato} /><button type="button" onClick={() => setRetrato(null)}>Remover retrato</button></>}
      </>}
      {erro && <p role="alert">{erro}</p>}
      {erro && !resultado && arquivoSelecionado.current && <button type="button" disabled={ocupado} onClick={() => void selecionar(arquivoSelecionado.current ?? undefined)}>Tentar preparar arquivo novamente</button>}
      <div className="am-dialog-acoes am-importar-acoes"><button type="button" onClick={fechar} disabled={salvando}>Cancelar</button><button className="am-primario" disabled={!resultado || ocupado || salvando || reconhecendo}>{salvando ? 'Incluindo…' : 'Incluir'}</button></div>
    </form>
  </AccessibleDialog></div>;
}
