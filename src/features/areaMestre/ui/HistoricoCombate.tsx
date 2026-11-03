import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';
import { nomeCombate } from '../encerramentoCombate';
import { dataCombate } from './GerenciadorCombates';
import { nomeCondicao, obterCondicao } from '../catalogoCondicoes';
import IconeCondicao from './IconeCondicao';
import './combates.css';

export default function HistoricoCombate({ dados, combateId, onFechar, onAbrirFicha }: {
  dados: DadosCampanha; combateId: string; onFechar: () => void; onAbrirFicha: (id: string) => void;
}) {
  const combate = dados.combates.find(c => c.id === combateId && c.estado === 'encerrado');
  const historico = combate?.historico;
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-historico-combate" aria-label="Histórico do combate" onClose={onFechar}>
    <h2>{combate ? nomeCombate(dados, combate) : 'Histórico do combate'}</h2>
    {!combate ? <p role="alert">O combate encerrado não está disponível. Atualize a campanha.</p> : <>
      <p>Encerrado · Rodada final {combate.rodada} · {historico?.participantes.length ?? dados.participantes.filter(p => p.combateId === combateId).length} participantes</p>
      <dl className="am-historico-datas"><dt>Início</dt><dd>{dataCombate(historico?.iniciadoEm ?? combate.execucao?.ativadoEm ?? combate.iniciadoEm)}</dd><dt>Encerramento</dt><dd>{dataCombate(combate.encerradoEm)}</dd><dt>Tratamento dos PV</dt><dd>{historico ? historico.decisaoPV === 'restaurar' ? 'Restaurar PV anteriores' : 'Manter PV atuais' : 'Não registrado'}</dd></dl>
      {!historico ? <p role="status">Este combate antigo não possui resultados históricos completos. Os PV finais e a decisão de encerramento não foram registrados.</p> : <div className="am-combate-tabela" role="region" aria-label="Resultados do combate" tabIndex={0}><table><caption>Participantes e resultados registrados no encerramento</caption><thead><tr><th>Ordem final</th><th>Combatente</th><th>Iniciativa</th><th>PV iniciais</th><th>PV finais</th><th>Ficha</th></tr></thead><tbody>{[...historico.participantes].sort((a, b) => a.ordem - b.ordem).map(p => <tr key={p.participanteId}><td>{p.ordem + 1}</td><th scope="row">{p.nome}<small>{p.categoria === 'jogador' ? 'Jogador' : 'Monstro'}</small></th><td>{p.iniciativa}</td><td>{p.pvInicial ? `${p.pvInicial.atuais}/${p.pvInicial.maximos}` : 'Indisponíveis'}</td><td>{p.pvFinal.atuais}/{p.pvFinal.maximos}</td><td>{p.fichaOriginalId && dados.fichas.some(f => f.id === p.fichaOriginalId) ? <button onClick={() => onAbrirFicha(p.fichaOriginalId!)}>Consultar ficha de {p.nome}</button> : 'Indisponível'}</td></tr>)}</tbody></table></div>}
      <p className="am-historico-nota">Os PV finais representam o término do encontro, antes de uma eventual restauração. Esta consulta é somente leitura.</p>
      {!!historico?.condicoes?.length && <section aria-label="Condições no encerramento"><h3>Condições no encerramento</h3><ul>{historico.condicoes.map(c => <li key={c.id}><IconeCondicao icone={obterCondicao(c.tipo)?.icone} /> {historico.participantes.find(p => p.participanteId === c.participanteId)?.nome ?? 'Participante'} — {nomeCondicao(c)}{c.tipo === 'exaustao' ? ` · nível ${c.nivel}` : ''} · {c.duracao === 'manual' ? '∞ · Até remoção manual' : `${c.restantes} turnos restantes · ${c.momento === 'inicio' ? 'Início' : 'Final'} do turno`}{c.observacao ? ` · ${c.observacao}` : ''}</li>)}</ul></section>}
    </>}
    <footer className="am-dialog-acoes"><button onClick={onFechar}>Fechar histórico</button></footer>
  </AccessibleDialog></div>;
}
