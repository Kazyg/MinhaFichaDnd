import { useEffect, useState } from 'react';
import AccessibleDialog from '../../pages/components/AccessibleDialog';
import VisualizadorDocumento from '../areaMestre/ui/VisualizadorDocumento';
import { ArquivoPublico, VisaoSala } from './compartilhamento';
import { obterCliente } from './cliente';
import './salaOnline.css';

export type CarregarArquivo = (arquivo: ArquivoPublico) => Promise<Blob>;
export const carregarArquivoRemoto: CarregarArquivo = async arquivo => {
  const { data, error } = await obterCliente().storage.from('sala-arquivos').download(arquivo.id);
  if (error || !data) throw new Error('Arquivo indisponível ou acesso encerrado.');
  return data;
};
function Retrato({ arquivo, carregar }: { arquivo: ArquivoPublico | null; carregar: CarregarArquivo }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let ativo = true; let objeto = ''; setUrl('');
    if (arquivo) void carregar(arquivo).then(blob => { if (ativo) { objeto = URL.createObjectURL(blob); setUrl(objeto); } }).catch(() => {});
    return () => { ativo = false; if (objeto) URL.revokeObjectURL(objeto); };
  }, [arquivo, carregar]);
  return url ? <img className="sala-retrato" src={url} alt="Retrato compartilhado" /> : <span className="sala-retrato sala-sem-retrato" aria-label="Sem retrato">◆</span>;
}
function Documento({ arquivo, carregar, fechar }: { arquivo: ArquivoPublico; carregar: CarregarArquivo; fechar: () => void }) {
  const [blob, setBlob] = useState<Blob | null>(null); const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true;
    void carregar(arquivo).then(b => { if (ativo) setBlob(b); }).catch(() => { if (ativo) setErro('Não foi possível abrir a ficha. Verifique sua conexão ou reabra a sala.'); });
    return () => { ativo = false; };
  }, [arquivo, carregar]);
  return <div className="sala-overlay"><AccessibleDialog className="sala-dialog sala-documento" aria-label="Ficha compartilhada" onClose={fechar}>
    <h2>Ficha do grupo</h2><p>A vida atual está no painel da sala; o documento corresponde à ficha importada.</p><button onClick={fechar}>Fechar ficha</button>
    {erro && <p role="alert">{erro}</p>}
    {blob ? <VisualizadorDocumento anexo={{ id: arquivo.id, campanhaId: 'sala', nome: 'Ficha do grupo', mime: arquivo.mime, tamanho: blob.size, arquivo: blob }} /> : !erro && <p role="status">Carregando ficha…</p>}
  </AccessibleDialog></div>;
}
export default function VisaoJogadores({ visao, carregar = carregarArquivoRemoto }: { visao: VisaoSala; carregar?: CarregarArquivo }) {
  const [aberto, setAberto] = useState<ArquivoPublico | null>(null);
  const permitido = aberto && visao.jogadores.some(j => j.ficha?.id === aberto.id);
  return <div className="sala-visao">
    <h2>{visao.nome}</h2><p>Fichas e vidas do grupo · alterações feitas pelo mestre</p>
    <div className="sala-grupo">{visao.jogadores.map(j => <article className="sala-personagem" key={j.id}>
      <Retrato arquivo={j.retrato} carregar={carregar} /><h3>{j.nome}</h3>
      <p className="sala-vida" aria-label={`Vida de ${j.nome}: ${j.pv.atuais} de ${j.pv.maximos}`}><strong>{j.pv.atuais}</strong> / {j.pv.maximos} PV</p>
      <meter min={0} max={Math.max(1, j.pv.maximos)} value={j.pv.atuais} aria-label={`Pontos de vida de ${j.nome}`} />
      <button disabled={!j.ficha} onClick={() => setAberto(j.ficha)}>{j.ficha ? 'Abrir ficha' : 'Ficha ainda não compartilhada'}</button>
    </article>)}</div>
    {!visao.jogadores.length && <p>Ainda não há jogadores nesta campanha.</p>}
    {visao.combate && <section className="sala-combate-publico" aria-label="Roda do combate">
      <header><h2>Roda do combate</h2>{visao.combate.roda && <span className="sala-badge">Rodada {visao.combate.roda.rodada}</span>}</header>
      {visao.combate.roda ? <>
        <ol className="sala-roda" aria-label="Ordem dos turnos">{visao.combate.roda.ordem.map(id => {
          const jogador = visao.jogadores.find(j => j.id === id);
          const monstro = visao.combate!.imagens.find(m => m.id === id);
          if (!jogador && !monstro) return null;
          const atual = visao.combate!.roda!.ativo === id;
          return <li key={id} aria-current={atual ? 'step' : undefined} className={atual ? 'sala-turno sala-turno-atual' : 'sala-turno'}>
            <Retrato arquivo={jogador?.retrato ?? monstro?.retrato ?? null} carregar={carregar} />
            <strong>{jogador?.nome ?? 'Monstro revelado'}</strong>{atual && <span>Sua vez</span>}
          </li>;
        })}</ol>
        {!visao.combate.roda.ordem.length && <p>Aguardando participantes visíveis no combate.</p>}
        {visao.combate.roda.ativo === null && <p role="status">Aguardando o próximo turno visível.</p>}
      </> : <div className="sala-monstros">{visao.combate.imagens.map(m => <figure key={m.id}><Retrato arquivo={m.retrato} carregar={carregar} /></figure>)}</div>}
    </section>}
    {aberto && permitido && <Documento arquivo={aberto} carregar={carregar} fechar={() => setAberto(null)} />}
  </div>;
}
