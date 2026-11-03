import { useState } from 'react';
import { DadosCampanha } from '../modelos';
import { EntradaCombatente } from '../execucaoCombate';

export default function AdicionarCombatente({ dados, ocupado, erro, onAdicionar, onCancelar }: {
  dados: DadosCampanha; ocupado: boolean; erro?: string | null;
  onAdicionar: (entrada: EntradaCombatente) => Promise<boolean>; onCancelar: () => void;
}) {
  const [selecao, setSelecao] = useState('');
  const [nome, setNome] = useState('');
  const [pv, setPV] = useState('1');
  const [iniciativa, setIniciativa] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [falha, setFalha] = useState('');
  const ativas = new Set(dados.combates.filter(c => c.estado === 'ativo').map(c => c.id));
  const ocupadas = new Set(dados.participantes.filter(p => ativas.has(p.combateId)).map(p => p.instanciaId));
  const bloqueado = ocupado || salvando;
  return <form className="am-adicionar-combatente" aria-label="Adicionar combatente" onSubmit={async e => {
    e.preventDefault();
    if (bloqueado) return;
    setFalha('');
    if (iniciativa.trim() && !Number.isSafeInteger(Number(iniciativa))) { setFalha('Informe uma iniciativa inteira.'); return; }
    if (selecao === 'minion' && (!nome.trim() || !pv.trim() || !Number.isSafeInteger(Number(pv)) || Number(pv) < 1)) { setFalha('Informe o nome e PV inteiros maiores que zero.'); return; }
    const instancia = selecao === 'minion' ? { id: crypto.randomUUID(), campanhaId: dados.campanha.id,
      fichaOriginalId: null, categoria: 'monstro' as const, nome: nome.trim(), pv: { atuais: Number(pv), maximos: Number(pv) } }
      : dados.instancias.find(i => i.id === selecao);
    if (!instancia) { setFalha('Selecione um combatente.'); return; }
    setSalvando(true);
    try {
      if (await onAdicionar({ id: crypto.randomUUID(), instancia, ...(iniciativa.trim() ? { iniciativa: Number(iniciativa) } : {}) })) onCancelar();
    } catch (causa) { setFalha(causa instanceof Error ? causa.message : 'Não foi possível adicionar o combatente.'); }
    finally { setSalvando(false); }
  }}>
    <h4>Adicionar combatente</h4>
    <fieldset disabled={bloqueado}>
      <label>Combatente<select required value={selecao} onChange={e => setSelecao(e.target.value)}>
        <option value="">Selecione um jogador ou monstro</option>
        {(['jogador', 'monstro'] as const).map(categoria => <optgroup key={categoria} label={categoria === 'jogador' ? 'Jogadores' : 'Monstros'}>
          {dados.instancias.filter(i => i.categoria === categoria).map(i => <option key={i.id} value={i.id} disabled={ocupadas.has(i.id)}>{i.nome}{ocupadas.has(i.id) ? ' (em combate)' : ''}</option>)}
        </optgroup>)}
        <option value="minion">Novo minion</option>
      </select></label>
      {selecao === 'minion' && <><label>Nome do minion<input required maxLength={200} value={nome} onChange={e => setNome(e.target.value)} /></label>
        <label>PV do minion<input type="number" required min="1" step="1" value={pv} onChange={e => setPV(e.target.value)} /></label></>}
      <label>Iniciativa (opcional)<input type="number" step="1" value={iniciativa} onChange={e => setIniciativa(e.target.value)} /></label>
      <p>Sem iniciativa, o combatente será o próximo a jogar após o turno atual. Com iniciativa, ele entra na posição correspondente da ordem.</p>
      {(falha || erro) && <p role="alert">{falha || erro}</p>}
      <div className="am-dialog-acoes"><button type="submit" disabled={!selecao}>Confirmar combatente</button><button type="button" onClick={onCancelar}>Cancelar inclusão</button></div>
    </fieldset>
  </form>;
}
