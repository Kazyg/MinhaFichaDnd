import { useEffect, useState } from 'react';
import BarraIniciativa from '../areaMestre/ui/BarraIniciativa';
import { DadosCampanha } from '../areaMestre/modelos';
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
function ImagemAmpliada({ arquivo, carregar, fechar }: { arquivo: ArquivoPublico; carregar: CarregarArquivo; fechar: () => void }) {
  const [url, setUrl] = useState(''); const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true; let objeto = '';
    void carregar(arquivo).then(blob => { if (ativo) { objeto = URL.createObjectURL(blob); setUrl(objeto); } }).catch(() => { if (ativo) setErro('Não foi possível carregar o retrato.'); });
    return () => { ativo = false; if (objeto) URL.revokeObjectURL(objeto); };
  }, [arquivo, carregar]);
  return <div className="sala-overlay sala-imagem-overlay" data-testid="retrato-fundo" onClick={e => { if (e.target === e.currentTarget) fechar(); }}>
    <AccessibleDialog className="sala-dialog sala-imagem-ampliada" aria-label="Retrato do monstro" onClose={fechar}>
      <button className="sala-fechar-x" aria-label="Fechar retrato" onClick={fechar}>×</button>
      {erro ? <p role="alert">{erro}</p> : url ? <img src={url} alt="Retrato do monstro ampliado" /> : <p role="status">Carregando retrato…</p>}
    </AccessibleDialog>
  </div>;
}

// Adapta exclusivamente a projeção pública para o mesmo componente visual do mestre.
function dadosDaRoda(visao: VisaoSala): DadosCampanha {
  const roda = visao.combate!.roda!;
  return {
    campanha: { id: 'publica', nome: visao.nome, schemaVersion: 1, roteiro: '', criadoEm: '', atualizadoEm: '' },
    instancias: [
      ...visao.jogadores.map(j => ({ id: j.id, campanhaId: 'publica', fichaOriginalId: null, categoria: 'jogador' as const, nome: j.nome, pv: j.pv })),
      ...visao.combate!.imagens.map(m => ({ id: m.id, campanhaId: 'publica', fichaOriginalId: null, categoria: 'monstro' as const, nome: 'Monstro revelado', pv: { atuais: 1, maximos: 1 } })),
    ],
    combates: [{ id: 'combate', campanhaId: 'publica', nome: 'Combate', estado: 'ativo', rodada: roda.rodada, participanteAtivoId: roda.ativo, iniciadoEm: '', encerradoEm: null }],
    participantes: roda.ordem.map((id, ordem) => ({ id, combateId: 'combate', instanciaId: id, iniciativa: 0, ordem, pvInicio: { atuais: 1, maximos: 1 } })),
    fichas: [], anexos: [], layout: { campanhaId: 'publica', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}

export default function VisaoJogadores({ visao, carregar = carregarArquivoRemoto }: { visao: VisaoSala; carregar?: CarregarArquivo }) {
  const [aberto, setAberto] = useState<ArquivoPublico | null>(null);
  const [retratoAberto, setRetratoAberto] = useState<ArquivoPublico | null>(null);
  const retratoPermitido = retratoAberto && visao.combate?.imagens.some(m => m.retrato?.id === retratoAberto.id);
  useEffect(() => { if (!retratoPermitido) setRetratoAberto(null); }, [retratoPermitido]);
  const permitido = aberto && visao.jogadores.some(j => j.ficha?.id === aberto.id);
  return <div className="sala-visao">
    <h2 className="sala-titulo-campanha">{visao.nome}</h2>
    <div className="sala-grupo">{visao.jogadores.map(j => <article className="sala-personagem" key={j.id}>
      <Retrato arquivo={j.retrato} carregar={carregar} /><h3>{j.nome}</h3>
      <p className="sala-vida" aria-label={`Vida de ${j.nome}: ${j.pv.atuais} de ${j.pv.maximos}`}><strong>{j.pv.atuais}</strong> / {j.pv.maximos} PV</p>
      <meter min={0} max={Math.max(1, j.pv.maximos)} value={j.pv.atuais} aria-label={`Pontos de vida de ${j.nome}`} />
      <button disabled={!j.ficha} onClick={() => setAberto(j.ficha)}>{j.ficha ? 'Abrir ficha' : 'Ficha ainda não compartilhada'}</button>
    </article>)}</div>
    {!visao.jogadores.length && <p>Ainda não há jogadores nesta campanha.</p>}
    {visao.combate && <section className="sala-combate-publico" aria-label="Roda do combate">
      {visao.combate.roda && <BarraIniciativa dados={dadosDaRoda(visao)} combateId="combate" ocupado={false} somenteLeitura
        onAvancar={async () => false} onReordenar={async () => false}
        onAbrirParticipante={id => { const retrato = visao.combate?.imagens.find(m => m.id === id)?.retrato; if (retrato) setRetratoAberto(retrato); }}
        renderRetrato={id => <Retrato arquivo={visao.jogadores.find(j => j.id === id)?.retrato ?? visao.combate?.imagens.find(m => m.id === id)?.retrato ?? null} carregar={carregar} />} />}
      {visao.combate.roda?.ativo === null && <p role="status">Aguardando o próximo turno visível.</p>}
      <div className="sala-monstros">{visao.combate.imagens.map((m, indice) => <button key={m.id} className="sala-retrato-abrir" disabled={!m.retrato} aria-label={'Ampliar retrato do monstro ' + (indice + 1)} onClick={() => setRetratoAberto(m.retrato)}><Retrato arquivo={m.retrato} carregar={carregar} /></button>)}</div>
    </section>}
    {retratoAberto && retratoPermitido && <ImagemAmpliada key={retratoAberto.id} arquivo={retratoAberto} carregar={carregar} fechar={() => setRetratoAberto(null)} />}
    {aberto && permitido && <Documento arquivo={aberto} carregar={carregar} fechar={() => setAberto(null)} />}
  </div>;
}
