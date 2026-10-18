import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';
import MiniaturaFicha from './MiniaturaFicha';
import { nomeCombate } from '../encerramentoCombate';
import './prepararCombate.css';

export default function ResumoCombatePreparado({ dados, combateId, onFechar, onIniciar, ocupado = false, erro }: {
  dados: DadosCampanha; combateId: string; onFechar: () => void; onIniciar?: () => void; ocupado?: boolean; erro?: string | null;
}) {
  const combate = dados.combates.find(c => c.id === combateId && c.estado === 'preparado');
  const participantes = dados.participantes.filter(p => p.combateId === combateId).sort((a,b) => a.ordem - b.ordem);
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-preparar-combate am-encontro-preparado" aria-label="Encontro preparado" onClose={() => { if (!ocupado) onFechar(); }}>
    <h2>Encontro preparado</h2>
    {combate ? <>
      <h3>{nomeCombate(dados, combate)}</h3>
      <p role="status">Preparação salva. Os participantes e suas iniciativas estão confirmados; o encontro ainda não está em execução.</p>
      <ol className="am-resumo-combate">{participantes.map(p => {
        const instancia = dados.instancias.find(i => i.id === p.instanciaId)!;
        const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId);
        return <li key={p.id}>{ficha && <MiniaturaFicha ficha={ficha} anexos={dados.anexos} />}
          <div><strong>{instancia.nome}</strong><small>{instancia.categoria === 'jogador' ? 'Jogador' : 'Monstro'} · Iniciativa {p.iniciativa}</small>
            <small>PV da preparação: {p.pvInicio.atuais}/{p.pvInicio.maximos}</small>
            {(instancia.pv.atuais !== p.pvInicio.atuais || instancia.pv.maximos !== p.pvInicio.maximos) && <small>PV atuais da instância: {instancia.pv.atuais}/{instancia.pv.maximos}</small>}
          </div>
        </li>;
      })}</ol>
    </> : <p role="alert">O encontro preparado não está disponível. Recarregue a campanha.</p>}
    {erro && <p role="alert">{erro}</p>}
    <div className="am-dialog-acoes"><button disabled={ocupado} onClick={onFechar}>Fechar resumo</button>{combate && onIniciar && <button className="am-primario am-iniciar-encontro" disabled={ocupado} onClick={onIniciar}>{ocupado ? 'Iniciando…' : 'Iniciar combate'}</button>}</div>
  </AccessibleDialog></div>;
}
