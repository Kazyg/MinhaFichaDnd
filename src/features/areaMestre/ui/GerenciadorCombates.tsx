import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';
import { nomeCombate } from '../encerramentoCombate';
import './combates.css';

export function dataCombate(valor: string | null | undefined): string {
  if (!valor || !Number.isFinite(Date.parse(valor))) return 'Data indisponível';
  return new Date(valor).toLocaleString('pt-BR');
}

export default function GerenciadorCombates({ dados, onFechar, onPreparado, onRetomar, onEncerrar, onHistorico, ocupado = false }: {
  dados: DadosCampanha; onFechar: () => void; onPreparado: (id: string) => void;
  onRetomar: (id: string) => void; onEncerrar: (id: string) => void; onHistorico: (id: string) => void; ocupado?: boolean;
}) {
  const grupos = [{ estado: 'preparado', titulo: 'Preparados' }, { estado: 'ativo', titulo: 'Em andamento' }, { estado: 'encerrado', titulo: 'Encerrados' }] as const;
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-gestao-combates" aria-label="Gerenciar combates" onClose={() => { if (!ocupado) onFechar(); }}>
    <h2>Gerenciar combates</h2>
    {grupos.map(grupo => {
      const combates = dados.combates.filter(c => c.estado === grupo.estado);
      if (grupo.estado === 'encerrado') combates.sort((a, b) => (Date.parse(b.encerradoEm ?? '') || 0) - (Date.parse(a.encerradoEm ?? '') || 0));
      return <section key={grupo.estado} aria-label={grupo.titulo}><h3>{grupo.titulo}</h3>
        {!combates.length && <p>Nenhum combate neste estado.</p>}
        <ul className="am-combates-lista">{combates.map(combate => <li key={combate.id}>
          <div><strong>{nomeCombate(dados, combate)}</strong><span>{grupo.titulo} · {combate.historico?.participantes.length ?? dados.participantes.filter(p => p.combateId === combate.id).length} participantes</span>
            {combate.rodada > 0 && <span>{combate.estado === 'encerrado' ? 'Rodada final' : 'Rodada'} {combate.rodada}</span>}
            <span>{combate.estado === 'encerrado' ? 'Encerrado em' : combate.estado === 'preparado' ? 'Preparado em' : 'Iniciado em'} {dataCombate(combate.estado === 'encerrado' ? combate.encerradoEm : combate.execucao?.ativadoEm ?? combate.iniciadoEm)}</span>
          </div>
          <div className="am-combate-acoes">
            {combate.estado === 'preparado' && <><button disabled={ocupado} onClick={() => onPreparado(combate.id)}>Visualizar informações</button><button disabled={ocupado} onClick={() => onPreparado(combate.id)}>Iniciar execução</button></>}
            {combate.estado === 'ativo' && <><button disabled={ocupado} onClick={() => onRetomar(combate.id)}>Retomar combate</button><details><summary>Consultar participantes</summary><ul>{dados.participantes.filter(p => p.combateId === combate.id).sort((a, b) => a.ordem - b.ordem).map(p => { const instancia = dados.instancias.find(i => i.id === p.instanciaId); return <li key={p.id}>{instancia?.nome ?? 'Instância indisponível'} · Iniciativa {p.iniciativa} · PV {instancia ? `${instancia.pv.atuais}/${instancia.pv.maximos}` : 'indisponíveis'}</li>; })}</ul></details><button disabled={ocupado} onClick={() => onEncerrar(combate.id)}>Encerrar combate</button></>}
            {combate.estado === 'encerrado' && <button disabled={ocupado} onClick={() => onHistorico(combate.id)}>Consultar histórico</button>}
          </div>
        </li>)}</ul>
      </section>;
    })}
    <footer className="am-dialog-acoes"><button disabled={ocupado} onClick={onFechar}>Fechar gerenciamento</button></footer>
  </AccessibleDialog></div>;
}
