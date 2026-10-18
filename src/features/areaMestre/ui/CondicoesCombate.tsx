import { useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';
import { AcaoCondicao } from '../condicoes';
import { CATALOGO_CONDICOES, CATEGORIAS_CONDICOES, nomeCondicao, obterCondicao } from '../catalogoCondicoes';
import IconeCondicao from './IconeCondicao';
import './condicoes.css';

export interface PropsCondicoesCombate {
  dados: DadosCampanha; combateId: string; participanteId: string; condicaoId?: string; listar?: boolean;
  onFechar: () => void; onSalvar: (acao: AcaoCondicao) => Promise<boolean>; erro?: string | null;
}
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export default function CondicoesCombate({ dados, combateId, participanteId, condicaoId, listar, onFechar, onSalvar, erro }: PropsCondicoesCombate) {
  const combate = dados.combates.find(c => c.id === combateId);
  const efeitos = (combate?.condicoes ?? []).filter(c => c.participanteId === participanteId);
  const [edicao, setEdicao] = useState(condicaoId);
  const [lista, setLista] = useState(!!listar);
  const atual = efeitos.find(c => c.id === edicao);
  const [tipo, setTipo] = useState(atual?.tipo ?? '');
  const [categoria, setCategoria] = useState(obterCondicao(atual?.tipo ?? '')?.categoria ?? 'oficiais');
  const [busca, setBusca] = useState('');
  const [manual, setManual] = useState(atual?.duracao === 'manual');
  const [restantes, setRestantes] = useState(String(atual?.restantes ?? 3));
  const [momento, setMomento] = useState<'inicio' | 'final'>(atual?.momento ?? 'final');
  const [nome, setNome] = useState(atual?.nomePersonalizado ?? '');
  const [nivel, setNivel] = useState(String(atual?.nivel ?? 1));
  const [observacao, setObservacao] = useState(atual?.observacao ?? '');
  const [pendente, setPendente] = useState(false);
  const [falha, setFalha] = useState('');
  const trava = useRef(false);
  const participante = dados.participantes.find(p => p.id === participanteId && p.combateId === combateId);
  const alvo = dados.instancias.find(i => i.id === participante?.instanciaId)?.nome ?? 'Participante';
  const valido = !!obterCondicao(tipo) && (manual || (/^\d+$/.test(restantes) && Number.isSafeInteger(Number(restantes)) && Number(restantes) > 0)) && (tipo !== 'personalizado' || !!nome.trim()) && (tipo !== 'exaustao' || (/^[0-6]$/.test(nivel))) && combate?.estado === 'ativo' && !!participante && (!edicao || !!atual);
  function editar(id: string) {
    const condicao = efeitos.find(c => c.id === id)!;
    setEdicao(id); setLista(false); setTipo(condicao.tipo); setCategoria(obterCondicao(condicao.tipo)?.categoria ?? 'oficiais'); setBusca('');
    setManual(condicao.duracao === 'manual'); setRestantes(String(condicao.restantes ?? 3)); setMomento(condicao.momento); setNome(condicao.nomePersonalizado ?? ''); setNivel(String(condicao.nivel ?? 1)); setObservacao(condicao.observacao ?? '');
  }
  async function salvar(excluir = false) {
    if (trava.current || (!excluir && !valido) || (excluir && !atual)) return;
    trava.current = true; setPendente(true); setFalha('');
    try {
      const id = edicao ?? (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join(''));
      const acao: AcaoCondicao = excluir ? { tipo: 'excluir', id: atual!.id } : { tipo: edicao ? 'editar' : 'adicionar', id, dados: { tipo, duracao: manual ? 'manual' : 'turnos', restantes: manual ? null : Number(restantes), momento, ...(tipo === 'personalizado' ? { nomePersonalizado: nome.trim() } : {}), ...(tipo === 'exaustao' ? { nivel: Number(nivel) } : {}), ...(observacao.trim() ? { observacao: observacao.trim() } : {}) } };
      if (await onSalvar(acao)) onFechar(); else setFalha('Não foi possível salvar a condição. Revise a campanha e tente novamente.');
    }
    catch { setFalha('Não foi possível salvar a condição. Tente novamente.'); }
    finally { trava.current = false; setPendente(false); }
  }
  const opcoes = CATALOGO_CONDICOES.filter(c => c.categoria === categoria && normalizar([c.nome, ...(c.aliases ?? [])].join(' ')).includes(normalizar(busca)));
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-condicoes-dialog" aria-label={`${lista ? 'Condições' : edicao ? 'Editar condição' : 'Adicionar condição'} — ${alvo}`} onClose={() => { if (!pendente) onFechar(); }}>
    <h2>{lista ? 'Condições' : edicao ? 'Editar condição' : 'Adicionar condição'} — {alvo}</h2>
    {lista ? <><ul className="am-condicoes-lista-aplicada">{efeitos.map(c => <li key={c.id}><button onClick={() => editar(c.id)}><IconeCondicao icone={obterCondicao(c.tipo)?.icone} /><span>{nomeCondicao(c)}<small>{c.duracao === 'manual' ? '∞ · Até remoção manual' : `${c.restantes} turnos · ${c.momento === 'inicio' ? 'Início' : 'Final'} do turno`}{c.observacao ? ` · ${c.observacao}` : ''}</small></span><span aria-hidden="true">✎</span></button></li>)}</ul>{!efeitos.length && <p>Nenhuma condição ativa neste participante.</p>}<footer className="am-dialog-acoes"><button onClick={onFechar}>Fechar</button><button className="am-primario" onClick={() => { setEdicao(undefined); setTipo(''); setLista(false); }}>+ Adicionar efeito</button></footer></> : <form onSubmit={e => { e.preventDefault(); void salvar(); }}>
      <label className="am-condicoes-busca"><span className="am-sr">Buscar condição ou efeito</span><span aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg></span><input placeholder="Buscar condição ou efeito..." value={busca} onChange={e => setBusca(e.target.value)} disabled={pendente} /></label>
      <label className="am-condicoes-categoria"><span>Categoria</span><select value={categoria} onChange={e => setCategoria(e.target.value as typeof categoria)} disabled={pendente}>{CATEGORIAS_CONDICOES.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>
      <div className="am-condicoes-catalogo" role="group" aria-label="Condições e efeitos">{opcoes.map(c => <button key={c.id} type="button" aria-label={c.nome} aria-pressed={tipo === c.id} disabled={pendente} className={`am-condicao-opcao am-condicao-${c.categoria}`} onClick={() => setTipo(c.id)}><IconeCondicao icone={c.icone} /><span>{c.nome}<small>{CATEGORIAS_CONDICOES.find(grupo => grupo.id === c.categoria)?.nome}</small></span>{tipo === c.id && <span aria-hidden="true">✓</span>}</button>)}{!opcoes.length && <p>Nenhum efeito encontrado. Tente outro nome ou categoria.</p>}</div>
      {tipo && <p className="am-condicao-selecionada">Selecionado: {obterCondicao(tipo)?.nome}</p>}
      {tipo === 'personalizado' && <label>Nome do efeito<input value={nome} maxLength={100} onChange={e => setNome(e.target.value)} disabled={pendente} required /></label>}
      {tipo === 'exaustao' && <label>Nível de exaustão (0 a 6)<input type="number" min="0" max="6" step="1" value={nivel} onChange={e => setNivel(e.target.value)} disabled={pendente} /></label>}
      <label className="am-condicoes-checkbox"><input type="checkbox" checked={manual} onChange={e => setManual(e.target.checked)} disabled={pendente} />Duração ilimitada ou até remoção manual</label>
      {!manual && <label>Quantidade de turnos do alvo<input type="number" min="1" step="1" value={restantes} onChange={e => setRestantes(e.target.value)} disabled={pendente} required /></label>}
      <fieldset className="am-condicoes-momento"><legend>Momento de encerramento</legend>{(['inicio', 'final'] as const).map(m => <label key={m}><input type="radio" name="momento-condicao" value={m} checked={momento === m} onChange={() => setMomento(m)} disabled={pendente} />{m === 'inicio' ? 'Início do turno' : 'Final do turno'}</label>)}</fieldset>
      <label>Observação opcional<textarea value={observacao} maxLength={300} onChange={e => setObservacao(e.target.value)} disabled={pendente} rows={2} /></label>
      {(falha || erro) && <p role="alert">{erro || falha}</p>}
      <footer className="am-dialog-acoes">{edicao && <button type="button" className="am-condicao-excluir" disabled={pendente || !atual} onClick={() => void salvar(true)}>Excluir condição</button>}<button type="button" disabled={pendente} onClick={onFechar}>Cancelar</button><button className="am-primario" type="submit" disabled={pendente || !valido}>{pendente ? 'Salvando…' : edicao ? 'Salvar' : '+ Adicionar efeito'}</button></footer>
    </form>}
  </AccessibleDialog></div>;
}
