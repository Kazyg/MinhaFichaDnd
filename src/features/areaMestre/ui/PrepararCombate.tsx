import { useEffect, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha, InstanciaFicha, FichaOriginal } from '../modelos';
import { ParticipantePreparacao, RascunhoPreparacaoCombate, ordenarParticipantesPreparacao } from '../preparacaoCombate';
import MiniaturaFicha from './MiniaturaFicha';
import { nomeCombate } from '../encerramentoCombate';
import './prepararCombate.css';

type Props = { dados: DadosCampanha; onConfirmar: (rascunho: RascunhoPreparacaoCombate) => Promise<boolean>; onFechar: () => void; erroConfirmacao?: string | null };
type Edicao = { participanteId?: string; instancia: InstanciaFicha; nome: string; atuais: string; maximos: string; iniciativa: string; quantidade: string; avulso: boolean; minion: boolean; ficha?: FichaOriginal };
const inteiro = (valor: string, minimo = Number.MIN_SAFE_INTEGER) => valor.trim() !== '' && Number.isSafeInteger(Number(valor)) && Number(valor) >= minimo;
const novoId = () => crypto.randomUUID();

export default function PrepararCombate({ dados, onConfirmar, onFechar, erroConfirmacao }: Props) {
  const [participantes, setParticipantes] = useState<ParticipantePreparacao[]>([]);
  const [nome, setNome] = useState('');
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [edicaoAlterada, setEdicaoAlterada] = useState(false);
  const [cancelarEdicao, setCancelarEdicao] = useState(false);
  const [descartar, setDescartar] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [alterado, setAlterado] = useState(false);
  const [painel, setPainel] = useState('disponiveis');
  const [avulsoHover, setAvulsoHover] = useState(false);
  const [avulsoFoco, setAvulsoFoco] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia?.('(max-width:650px)').matches ?? false);
  useEffect(() => {
    const consulta = window.matchMedia?.('(max-width:650px)');
    if (!consulta) return;
    const atualizar = () => setMobile(consulta.matches);
    atualizar();
    consulta.addEventListener('change', atualizar);
    return () => consulta.removeEventListener('change', atualizar);
  }, []);
  useEffect(() => {
    const proteger = (e: BeforeUnloadEvent) => { if (alterado || edicaoAlterada) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', proteger);
    return () => window.removeEventListener('beforeunload', proteger);
  }, [alterado, edicaoAlterada]);
  const fechar = () => { if (!salvando) { if (alterado) setDescartar(true); else onFechar(); } };
  const ocupadas = new Map(dados.participantes.filter(p => dados.combates.some(c => c.id === p.combateId && c.estado === 'ativo')).map(p => [p.instanciaId, nomeCombate(dados, dados.combates.find(c => c.id === p.combateId)!)]));
  const selecionadas = new Set(participantes.map(p => p.instancia.id));
  const jogadoresSemInstancia = dados.fichas.filter(f => f.categoria === 'jogador' && !dados.instancias.some(i => i.fichaOriginalId === f.id));
  const configurar = (instancia: InstanciaFicha, participante?: ParticipantePreparacao, avulso = false) => {
    setErro(''); setEdicaoAlterada(false);
    setEdicao({ participanteId: participante?.id, instancia: { ...instancia, pv: { ...instancia.pv } }, nome: instancia.nome, atuais: String(instancia.pv.atuais), maximos: String(instancia.pv.maximos), iniciativa: String(participante?.iniciativa ?? 0), quantidade: '1', avulso, minion: false, ficha: dados.fichas.find(f => f.id === instancia.fichaOriginalId) });
  };
  const novaInstancia = (ficha?: FichaOriginal) => {
    let nome = '';
    if (ficha?.categoria === 'jogador') nome = ficha.nome;
    else if (ficha) {
      const nomes = new Set([...dados.instancias, ...participantes.map(p => p.instancia)].map(i => i.nome));
      let numero = 1;
      do { nome = `${ficha.nome.slice(0, 190)} ${numero++}`; } while (nomes.has(nome));
    }
    configurar({ id: novoId(), campanhaId: dados.campanha.id, fichaOriginalId: ficha?.id ?? null, categoria: ficha?.categoria ?? 'monstro', nome, pv: { ...(ficha?.pvIniciais ?? { atuais: 1, maximos: 1 }) } }, undefined, !ficha);
  };
  const incluir = () => {
    if (!edicao) return;
    if (!edicao.nome.trim() || edicao.nome.trim().length > 200) { setErro('Informe um nome de até 200 caracteres.'); return; }
    if (!inteiro(edicao.iniciativa)) { setErro('A iniciativa deve ser um número inteiro, incluindo zero ou negativos.'); return; }
    if (!inteiro(edicao.maximos, 0) || !inteiro(edicao.atuais, 0) || Number(edicao.atuais) > Number(edicao.maximos)) { setErro('Informe PV inteiros não negativos; os atuais não podem ultrapassar os máximos.'); return; }
    if (!inteiro(edicao.quantidade, 1) || Number(edicao.quantidade) > 100) { setErro('Informe uma quantidade entre 1 e 100.'); return; }
    const quantidade = edicao.avulso && !edicao.participanteId ? Number(edicao.quantidade) : 1;
    const novos = Array.from({ length: quantidade }, (_, i): ParticipantePreparacao => ({
      id: edicao.participanteId ?? novoId(), iniciativa: Number(edicao.iniciativa),
      instancia: { ...edicao.instancia, id: i === 0 ? edicao.instancia.id : novoId(), nome: `${edicao.nome.trim().slice(0, quantidade > 1 ? 195 : 200)}${quantidade > 1 ? ` ${i + 1}` : ''}`, pv: { atuais: Number(edicao.atuais), maximos: Number(edicao.maximos) } },
    }));
    if (participantes.some(p => p.id !== edicao.participanteId && p.instancia.id === edicao.instancia.id)) { setErro('Esta instância já está selecionada.'); return; }
    setParticipantes(anteriores => edicao.participanteId ? anteriores.map(p => p.id === edicao.participanteId ? novos[0] : p) : [...anteriores, ...novos]);
    setAlterado(true); setEdicao(null); setEdicaoAlterada(false); setErro('');
  };
  const confirmar = async () => {
    if (participantes.length < 2) { setErro('Selecione pelo menos dois participantes.'); return; }
    setSalvando(true); setErro('');
    try { if (await onConfirmar({ participantes, ...(nome.trim() ? { nome: nome.trim() } : {}) })) onFechar(); else setErro('Não foi possível preparar o combate. O rascunho foi mantido; verifique o erro de armazenamento e tente novamente.'); }
    catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível preparar o combate. O rascunho foi mantido.'); }
    finally { setSalvando(false); }
  };
  const retrato = (instancia: InstanciaFicha) => {
    const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId);
    return ficha ? <MiniaturaFicha ficha={ficha} anexos={dados.anexos} /> : <span aria-hidden="true" className="am-miniatura am-miniatura-vazia">◆</span>;
  };
  const resumoJogador = (instancia: InstanciaFicha) => {
    const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId);
    return ficha ? ` · ${ficha.formato.toUpperCase()}${ficha.origemJson ? ` · ${ficha.origemJson.versaoRegras === 'DND_2024' ? 'D&D 2024' : 'D&D 2014'}` : ''}` : '';
  };
  if (descartar) return <div className="am-overlay"><AccessibleDialog key="descartar" className="am-dialog" aria-label="Descartar preparação de combate" onClose={() => setDescartar(false)}>
    <h2>Descartar preparação de combate?</h2><p>As seleções e configurações ainda não foram salvas. A campanha e seus PV serão preservados.</p>
    <div className="am-dialog-acoes"><button onClick={() => setDescartar(false)}>Continuar preparando</button><button onClick={onFechar}>Descartar preparação</button></div>
  </AccessibleDialog></div>;
  const voltarConfiguracao = () => { if (edicaoAlterada) setCancelarEdicao(true); else { setEdicao(null); setErro(''); } };
  if (cancelarEdicao) return <div className="am-overlay"><AccessibleDialog key="cancelar-configuracao" className="am-dialog" aria-label="Descartar configuração do combatente" onClose={() => setCancelarEdicao(false)}><h2>Descartar configuração do combatente?</h2><p>Os ajustes desta configuração ainda não foram incluídos na preparação.</p><div className="am-dialog-acoes"><button onClick={() => setCancelarEdicao(false)}>Continuar configurando</button><button onClick={() => { setCancelarEdicao(false); setEdicaoAlterada(false); setEdicao(null); setErro(''); }}>Descartar configuração</button></div></AccessibleDialog></div>;
  if (edicao) return <div className="am-overlay"><AccessibleDialog key="configurar" className="am-dialog am-configurar-combatente" aria-label="Configurar combatente" onClose={voltarConfiguracao}>
    <h2>Configurar combatente</h2>
    <p>Os ajustes só alteram a campanha ao confirmar toda a preparação.</p>
    <form onChange={() => setEdicaoAlterada(true)} onSubmit={e => { e.preventDefault(); incluir(); }}>
      {edicao.ficha?.categoria === 'monstro' && !edicao.participanteId && <label>Instância do monstro<select value={dados.instancias.some(i => i.id === edicao.instancia.id) ? edicao.instancia.id : 'nova'} onChange={e => {
        const existente = dados.instancias.find(i => i.id === e.target.value);
        if (existente) configurar(existente); else novaInstancia(edicao.ficha);
      }}><option value="nova">Criar nova instância</option>{dados.instancias.filter(i => i.fichaOriginalId === edicao.ficha?.id).map(i => <option key={i.id} value={i.id} disabled={selecionadas.has(i.id) || ocupadas.has(i.id)}>{i.nome} — {i.pv.atuais}/{i.pv.maximos} PV{selecionadas.has(i.id) ? ' — já selecionado' : ocupadas.has(i.id) ? ` — em ${ocupadas.get(i.id)}` : ''}</option>)}</select></label>}
      <label>Nome do combatente<input maxLength={200} value={edicao.nome} onChange={e => setEdicao({ ...edicao, nome: e.target.value })} /></label>
      {edicao.avulso && <label>Tipo do combatente<select value={edicao.instancia.categoria} onChange={e => setEdicao({ ...edicao, instancia: { ...edicao.instancia, categoria: e.target.value as 'jogador' | 'monstro' } })}><option value="monstro">Monstro</option><option value="jogador">Jogador</option></select></label>}
      <label>Iniciativa<input type="number" step="1" value={edicao.iniciativa} onChange={e => setEdicao({ ...edicao, iniciativa: e.target.value })} /></label>
      <label>PV máximos<input type="number" min="0" step="1" value={edicao.maximos} onChange={e => setEdicao({ ...edicao, maximos: e.target.value })} /></label>
      <label>PV atuais<input type="number" min="0" step="1" value={edicao.atuais} onChange={e => setEdicao({ ...edicao, atuais: e.target.value })} /></label>
      {edicao.maximos === '0' && <p role="status">PV não definidos. Confira os valores antes de incluir.</p>}
      {edicao.avulso && !edicao.participanteId && <><label><input type="checkbox" checked={edicao.minion} onChange={e => setEdicao({ ...edicao, minion: e.target.checked, ...(e.target.checked ? { atuais: '1', maximos: '1' } : {}) })} />Minion rápido (1 PV, editável)</label><label>Quantidade<input type="number" min="1" max="100" step="1" value={edicao.quantidade} onChange={e => setEdicao({ ...edicao, quantidade: e.target.value })} /></label></>}
      {erro && <p role="alert">{erro}</p>}
      <div className="am-dialog-acoes"><button type="button" onClick={voltarConfiguracao}>Cancelar configuração</button><button className="am-primario">{edicao.participanteId ? 'Salvar configuração' : 'Incluir participante'}</button></div>
    </form>
  </AccessibleDialog></div>;
  return <div className="am-overlay"><AccessibleDialog key="preparar" className="am-dialog am-preparar-combate am-preparacao-modal" aria-label="Preparar combate" onClose={fechar}>
    <header className="am-preparacao-cabecalho"><h2>Preparar combate</h2><button aria-label="Fechar preparação" disabled={salvando} onClick={fechar}><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6" /></svg></button></header>
    <fieldset disabled={salvando} className="am-preparacao-conteudo" data-painel={painel}>
      <label className="am-nome-combate">Nome do combate (opcional)<input maxLength={200} value={nome} placeholder={`Combate ${dados.combates.length + 1}`} onChange={e => { setNome(e.target.value); setAlterado(true); }} /></label>
      <nav hidden={!mobile} className="am-preparacao-navegacao" aria-label="Painéis da preparação"><button aria-pressed={painel === 'disponiveis'} aria-controls="am-combatentes-disponiveis" onClick={() => setPainel('disponiveis')}>Disponíveis</button><button aria-pressed={painel === 'selecionados'} aria-controls="am-participantes-selecionados" onClick={() => setPainel('selecionados')}>Selecionados ({participantes.length})</button></nav>
      <div className="am-preparacao-regioes">
      <section hidden={mobile && painel !== 'disponiveis'} id="am-combatentes-disponiveis" aria-label="Combatentes disponíveis"><header className="am-preparacao-painel-cabecalho"><h3>Combatentes disponíveis</h3><span className="am-preparacao-adicionar"><button className="am-primario" aria-label="Adicionar combatente avulso" aria-describedby={avulsoHover || avulsoFoco ? 'am-dica-avulso' : undefined} onMouseEnter={() => setAvulsoHover(true)} onMouseLeave={() => setAvulsoHover(false)} onFocus={() => setAvulsoFoco(true)} onBlur={() => setAvulsoFoco(false)} onClick={() => { setAvulsoHover(false); setAvulsoFoco(false); novaInstancia(); }}><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg></button>{(avulsoHover || avulsoFoco) && <span id="am-dica-avulso" role="tooltip">Adicionar combatente avulso</span>}</span></header><div className="am-preparacao-lista" tabIndex={0} role="region" aria-label="Lista de combatentes disponíveis"><h4>Jogadores</h4>
        {!dados.instancias.some(i => i.categoria === 'jogador') && !jogadoresSemInstancia.length && <p>Nenhum jogador cadastrado.</p>}
        <ul>{dados.instancias.filter(i => i.categoria === 'jogador').map(i => <li key={i.id}>{retrato(i)}<div><strong>{i.nome}</strong><small>{i.pv.atuais}/{i.pv.maximos} PV{resumoJogador(i)}</small><button disabled={selecionadas.has(i.id) || ocupadas.has(i.id)} onClick={() => configurar(i)} aria-label={`Selecionar jogador ${i.nome}`}>{selecionadas.has(i.id) ? 'Já selecionado' : ocupadas.has(i.id) ? `Em ${ocupadas.get(i.id)}` : 'Selecionar'}</button></div></li>)}</ul>
        <ul>{jogadoresSemInstancia.map(f => <li key={f.id}><MiniaturaFicha ficha={f} anexos={dados.anexos} /><div><strong>{f.nome}</strong><small>{f.pvIniciais.atuais}/{f.pvIniciais.maximos} PV de referência · Sem instância</small><button disabled={participantes.some(p => p.instancia.fichaOriginalId === f.id)} aria-label={`Selecionar jogador ${f.nome}`} onClick={() => novaInstancia(f)}>{participantes.some(p => p.instancia.fichaOriginalId === f.id) ? 'Já selecionado' : 'Selecionar'}</button></div></li>)}</ul>
        <h4>Monstros</h4>{!dados.fichas.some(f => f.categoria === 'monstro') && <p>Nenhuma ficha de monstro cadastrada.</p>}
        <ul>{dados.fichas.filter(f => f.categoria === 'monstro').map(f => <li key={f.id}><MiniaturaFicha ficha={f} anexos={dados.anexos} /><div><strong>{f.nome}</strong><small>{f.pvIniciais.atuais}/{f.pvIniciais.maximos} PV · {dados.instancias.filter(i => i.fichaOriginalId === f.id).length} instâncias</small><button onClick={() => novaInstancia(f)} aria-label={`Selecionar monstro ${f.nome}`}>Selecionar</button></div></li>)}</ul>
        {dados.instancias.filter(i => i.categoria === 'monstro' && i.fichaOriginalId === null).map(i => <div className="am-avulso-existente" key={i.id}><span>{i.nome} · {i.pv.atuais}/{i.pv.maximos} PV</span><button disabled={selecionadas.has(i.id) || ocupadas.has(i.id)} onClick={() => configurar(i)} aria-label={`Selecionar avulso ${i.nome}`}>{selecionadas.has(i.id) ? 'Já selecionado' : ocupadas.has(i.id) ? `Em ${ocupadas.get(i.id)}` : 'Selecionar'}</button></div>)}
      </div></section>
      <section hidden={mobile && painel !== 'selecionados'} id="am-participantes-selecionados" aria-label="Participantes selecionados"><header className="am-preparacao-painel-cabecalho"><h3>Participantes selecionados ({participantes.length})</h3></header><div className="am-preparacao-lista" tabIndex={0} role="region" aria-label="Lista de participantes selecionados">{!participantes.length && <p>Selecione pelo menos dois participantes.</p>}
        <ol>{ordenarParticipantesPreparacao(participantes).map(p => <li key={p.id}>{retrato(p.instancia)}<div><strong>{p.instancia.nome}</strong><small>{p.instancia.categoria === 'jogador' ? 'Jogador' : 'Monstro'} · {p.instancia.pv.atuais}/{p.instancia.pv.maximos} PV · Iniciativa {p.iniciativa}</small><div className="am-preparacao-acoes-item"><button aria-label={`Editar participante ${p.instancia.nome}`} onClick={() => configurar(p.instancia, p)}>Editar</button><button aria-label={`Remover participante ${p.instancia.nome}`} onClick={() => { setParticipantes(anteriores => anteriores.filter(item => item.id !== p.id)); setAlterado(true); }}>Remover</button></div></div></li>)}</ol>
      </div></section>
      </div>
      <footer className="am-preparacao-rodape">{erro && <p role="alert">{erro}{erroConfirmacao ? ` ${erroConfirmacao}` : ''}</p>}<div className="am-dialog-acoes"><button onClick={fechar}>Cancelar</button><button className="am-primario" onClick={() => void confirmar()}>{salvando ? 'Preparando…' : 'Confirmar preparação'}</button></div></footer>
    </fieldset>
  </AccessibleDialog></div>;
}
