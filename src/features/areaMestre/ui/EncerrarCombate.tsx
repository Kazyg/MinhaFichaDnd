import { useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';
import { nomeCombate, podeRestaurarPV } from '../encerramentoCombate';
import './combates.css';

export default function EncerrarCombate({ dados, combateId, onFechar, onConfirmar, erro }: {
  dados: DadosCampanha; combateId: string; onFechar: () => void;
  onConfirmar: (decisao: 'manter' | 'restaurar') => Promise<boolean>; erro?: string | null;
}) {
  const [decisao, setDecisao] = useState<'manter' | 'restaurar' | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [falha, setFalha] = useState('');
  const enviando = useRef(false);
  const combate = dados.combates.find(c => c.id === combateId);
  const ativo = combate?.estado === 'ativo';
  const restauravel = !!combate && podeRestaurarPV(combate);
  const participantes = dados.participantes.filter(p => p.combateId === combateId).sort((a, b) => a.ordem - b.ordem);
  async function confirmar() {
    if (!ativo || !decisao || enviando.current || (decisao === 'restaurar' && !restauravel)) return;
    enviando.current = true; setOcupado(true); setFalha('');
    try { if (await onConfirmar(decisao)) onFechar(); else setFalha('Não foi possível encerrar. Revise a mensagem e tente novamente após atualizar a campanha.'); }
    catch { setFalha('Não foi possível encerrar o combate. Nenhuma confirmação foi recebida. Atualize a campanha antes de tentar novamente.'); }
    finally { enviando.current = false; setOcupado(false); }
  }
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-encerrar-combate" aria-label="Encerrar combate" onClose={() => { if (!enviando.current) onFechar(); }}>
    <h2>Encerrar combate</h2>
    {combate && <p><strong>{nomeCombate(dados, combate)}</strong> · Rodada {combate.rodada} · {participantes.length} participantes</p>}
    {!ativo ? <p role="alert">Este combate não está mais em andamento. Atualize a campanha.</p> : <>
      <fieldset disabled={ocupado} className="am-decisao-pv"><legend>Como tratar os pontos de vida?</legend>
        <label><input type="radio" name="decisao-pv" checked={decisao === 'manter'} onChange={() => setDecisao('manter')} />Manter PV atuais<span>Preservar os valores observados ao final do encontro.</span></label>
        <label><input type="radio" name="decisao-pv" checked={decisao === 'restaurar'} disabled={!restauravel} onChange={() => setDecisao('restaurar')} />Restaurar PV anteriores<span>Recuperar os PV atuais e máximos registrados ao iniciar, sem preencher automaticamente a vida máxima.</span></label>
      </fieldset>
      {!restauravel && <p role="status">Snapshot inicial válido indisponível neste combate antigo. É possível encerrar mantendo os PV atuais.</p>}
      <div className="am-combate-tabela" role="region" aria-label="Prévia dos pontos de vida" tabIndex={0}><table><caption>Prévia do encerramento</caption><thead><tr><th>Combatente</th><th>PV atuais</th><th>PV após encerrar</th></tr></thead><tbody>{participantes.map(p => {
        const instancia = dados.instancias.find(i => i.id === p.instanciaId);
        const inicial = combate?.execucao?.pvAtivacao.find(s => s.participanteId === p.id && s.instanciaId === p.instanciaId)?.pv;
        const depois = decisao === 'restaurar' ? inicial : decisao === 'manter' ? instancia?.pv : null;
        return <tr key={p.id}><th scope="row">{instancia?.nome ?? 'Instância indisponível'}</th><td>{instancia ? `${instancia.pv.atuais}/${instancia.pv.maximos}` : 'Indisponível'}</td><td>{depois ? `${depois.atuais}/${depois.maximos}` : 'Escolha uma opção'}</td></tr>;
      })}</tbody></table></div>
    </>}
    {(erro || falha) && <p role="alert">{erro || falha}</p>}
    <footer className="am-dialog-acoes am-encerramento-acoes"><button disabled={ocupado} onClick={onFechar}>Cancelar</button><button className="am-primario" disabled={!ativo || !decisao || ocupado || (decisao === 'restaurar' && !restauravel)} onClick={() => void confirmar()}>{ocupado ? 'Encerrando…' : 'Confirmar encerramento'}</button></footer>
  </AccessibleDialog></div>;
}
