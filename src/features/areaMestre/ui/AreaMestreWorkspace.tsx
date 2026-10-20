import { useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { CategoriaFicha, DadosCampanha, FichaOriginal, PainelLayout, RoteiroCampanha } from '../modelos';
import { incorporarImportacao, removerFichaCampanha } from '../fichasCampanha';
import { criarInstanciaAdicional } from '../instancias';
import { validarDadosCampanha } from '../validacao';
import { RetornoUseCampanhas } from '../useCampanhas';
import WorkspaceGrid from './GridWorkspace';
import { criarLayoutPadrao } from './layoutWorkspace';
import MiniaturaFicha from './MiniaturaFicha';
import ColecaoFichas from './ColecaoFichas';
import EditarFichaImportada from './EditarFichaImportada';
import ImportarFicha from './ImportarFicha';
import VisualizadorFicha from './VisualizadorFicha';
import PainelPV from './PainelPV';
import BackupCampanha from './BackupCampanha';
import EditorRoteiro, { idRascunhoRoteiro } from './EditorRoteiro';
import PaineisLaterais from './PaineisLaterais';
import PrepararCombate from './PrepararCombate';
import ResumoCombatePreparado from './ResumoCombatePreparado';
import BarraIniciativa from './BarraIniciativa';
import ParticipanteEmCombate from './ParticipanteEmCombate';
import GerenciadorCombates from './GerenciadorCombates';
import EncerrarCombate from './EncerrarCombate';
import HistoricoCombate from './HistoricoCombate';
import CondicoesCombate from './CondicoesCombate';
import { AcaoCondicao } from '../condicoes';
import { nomeCombate } from '../encerramentoCombate';
import './areaMestreWorkspace.css';

const titulos = { monstros: 'Monstros', jogadores: 'Jogadores', roteiro: 'Roteiro', pv: 'Pontos de vida' };
const icones = { monstros: '♞', jogadores: '♜', roteiro: '▤', pv: '♥' };
const gerarId = () => globalThis.crypto?.randomUUID?.() ?? `roteiro-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function EncerramentoRevisionado({ dados, combateId, onFechar, onConfirmar, erro }: {
  dados: DadosCampanha; combateId: string; onFechar: () => void; erro: string | null;
  onConfirmar: (decisao: 'manter' | 'restaurar', revisao: number) => Promise<boolean>;
}) {
  const [preview] = useState(dados);
  return <EncerrarCombate dados={preview} combateId={combateId} erro={erro} onFechar={onFechar} onConfirmar={decisao => onConfirmar(decisao, preview.campanha.revisao ?? 0)} />;
}

function CondicoesRevisionadas({ dados, combateId, participanteId, condicaoId, listar, onFechar, onSalvar, erro }: {
  dados: DadosCampanha; combateId: string; participanteId: string; condicaoId?: string; listar?: boolean;
  onFechar: () => void; onSalvar: (acao: AcaoCondicao, revisao: number) => Promise<boolean>; erro: string | null;
}) {
  const [preview] = useState(dados);
  return <CondicoesCombate dados={preview} combateId={combateId} participanteId={participanteId} condicaoId={condicaoId} listar={listar} erro={erro} onFechar={onFechar} onSalvar={acao => onSalvar(acao, preview.campanha.revisao ?? 0)} />;
}

export function AreaMestreWorkspace({ estado, onSair }: { estado: RetornoUseCampanhas; onSair: () => void | Promise<void> }) {
  const { dados, campanhas, carregando, salvando, pendente, erro, conflito, atualizar } = estado;
  const [gerenciador, setGerenciador] = useState(true);
  const [editarNome, setEditarNome] = useState(false);
  const [nome, setNome] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [menu, setMenu] = useState(false);
  const [confirmarRecarga, setConfirmarRecarga] = useState(false);
  const [editor, setEditor] = useState<{ roteiro: RoteiroCampanha | null; id: string } | null>(null);
  const [excluirRoteiro, setExcluirRoteiro] = useState<RoteiroCampanha | null>(null);
  const [erroExclusao, setErroExclusao] = useState('');
  const [importar, setImportar] = useState<CategoriaFicha | null>(null);
  const [colecao, setColecao] = useState<CategoriaFicha | null>(null);
  const [editarFicha, setEditarFicha] = useState<string | null>(null);
  const [visualizar, setVisualizar] = useState<string | null>(null);
  const [excluirFicha, setExcluirFicha] = useState<FichaOriginal | null>(null);
  const [erroFicha, setErroFicha] = useState('');
  const [backup, setBackup] = useState<'exportar' | 'restaurar' | null>(null);
  const [preparacao, setPreparacao] = useState<{ id: string } | null>(null);
  const [resumoCombate, setResumoCombate] = useState<string | null>(null);
  const [combateSelecionado, setCombateSelecionado] = useState<{ campanhaId: string; combateId: string } | null>(null);
  const [participanteAberto, setParticipanteAberto] = useState<string | null>(null);
  const [erroInicio, setErroInicio] = useState('');
  const [gestaoCombates, setGestaoCombates] = useState(false);
  const [encerramento, setEncerramento] = useState<string | null>(null);
  const [historico, setHistorico] = useState<string | null>(null);
  const [escolhaNovoCombate, setEscolhaNovoCombate] = useState(false);
  const [combateParaFinalizar, setCombateParaFinalizar] = useState('');
  const [condicoes, setCondicoes] = useState<{ combateId: string; participanteId: string; condicaoId?: string; listar?: boolean } | null>(null);
  const combateExibido = dados && combateSelecionado?.campanhaId === dados.campanha.id
    ? dados.combates.find(c => c.id === combateSelecionado.combateId && c.estado === 'ativo') : undefined;
  const retomarCombate = (id: string) => {
    if (!dados) return;
    setParticipanteAberto(null); setGestaoCombates(false);
    setCombateSelecionado({ campanhaId: dados.campanha.id, combateId: id });
  };
  const abrirEncerramento = async (id: string) => {
    if (!await estado.salvarAgora()) return;
    setGestaoCombates(false); setEscolhaNovoCombate(false); setEncerramento(id);
  };
  const abrirGestaoCombates = async () => {
    setMenu(false);
    if (await estado.salvarAgora()) setGestaoCombates(true);
  };
  const abrirCondicoes = async (combateId: string, participanteId: string, condicaoId?: string, listar = false) => {
    if (!await estado.salvarAgora()) return;
    setCondicoes({ combateId, participanteId, condicaoId, listar });
  };
  const solicitarCombate = () => {
    const ativos = dados?.combates.filter(c => c.estado === 'ativo') ?? [];
    if (!ativos.length) { setPreparacao({ id: gerarId() }); return; }
    setCombateParaFinalizar(combateExibido?.id ?? (ativos.length === 1 ? ativos[0].id : ''));
    setEscolhaNovoCombate(true);
  };
  const iniciarEncontro = async (combateId: string) => {
    if (!dados) return;
    setErroInicio('');
    if (await estado.executarCombate(combateId, 'iniciar')) {
      setCombateSelecionado({ campanhaId: dados.campanha.id, combateId });
      setResumoCombate(null);
    } else setErroInicio('Não foi possível iniciar o encontro. Confira o aviso da campanha antes de tentar novamente.');
  };
  const confirmarAlteracao = async (alterar: (atual: DadosCampanha) => DadosCampanha) => {
    atualizar(atual => { const proximo = alterar(atual); validarDadosCampanha(proximo); return proximo; });
    return estado.salvarAgora();
  };
  const novaInstancia = async (fichaId: string) => {
    setErroFicha('');
    const id = gerarId();
    try { await confirmarAlteracao(atual => criarInstanciaAdicional(atual, fichaId, id)); }
    catch (causa) { setErroFicha(causa instanceof Error ? causa.message : 'Não foi possível adicionar a instância.'); }
  };
  const menuRef = useRef<HTMLButtonElement>(null);
  const alterarPainel = (id: string, alteracao: Partial<PainelLayout>) => atualizar(atual => ({ ...atual, layout: {
    ...atual.layout, paineis: atual.layout.paineis.map(p => p.id === id ? { ...p, ...alteracao } : p),
  } }));
  const abrirGerenciador = async () => {
    setMenu(false);
    if (await estado.salvarAgora()) { await estado.listar(); setGerenciador(true); }
  };
  const novoRoteiro = () => setEditor({ roteiro: null, id: (dados && idRascunhoRoteiro(dados.campanha.id)) || gerarId() });
  const salvarRoteiro = async (titulo: string, conteudo: string) => {
    if (!editor) return false;
    const agora = new Date().toISOString();
    const existente = dados?.campanha.roteiros?.find(r => r.id === editor.id);
    const roteiro: RoteiroCampanha = { id: editor.id, titulo, conteudo, criadoEm: existente?.criadoEm ?? editor.roteiro?.criadoEm ?? agora, atualizadoEm: agora };
    atualizar(atual => ({ ...atual, campanha: { ...atual.campanha,
      roteiros: (atual.campanha.roteiros ?? []).some(r => r.id === roteiro.id)
        ? (atual.campanha.roteiros ?? []).map(r => r.id === roteiro.id ? roteiro : r)
        : [...(atual.campanha.roteiros ?? []), roteiro],
    } }));
    return estado.salvarAgora();
  };
  const conteudo = (painel: PainelLayout) => {
    if (painel.tipo === 'roteiro') return <>
      {dados?.campanha.roteiros?.length ? <ul className="am-roteiros">
        {dados.campanha.roteiros.map(roteiro => <li key={roteiro.id}>
          <button className="am-card-roteiro" aria-label={`Abrir roteiro ${roteiro.titulo}`} onClick={() => setEditor({ roteiro, id: roteiro.id })}>
            <span className="am-doc-icon" aria-hidden="true">▤</span>
            <strong title={roteiro.titulo}>{roteiro.titulo}</strong>
          </button>
          <button className="am-excluir-roteiro" aria-label={`Excluir roteiro ${roteiro.titulo}`} onClick={() => { setErroExclusao(''); setExcluirRoteiro(roteiro); }}><svg aria-hidden="true" width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor"><path d="M1 4h14M5 4V1h6v3M3 4l1 13h8l1-13M6 7v7M10 7v7" /></svg></button>
        </li>)}
      </ul> : <p className="am-vazio">Nenhum roteiro nesta campanha. Organize suas sessões em documentos independentes.</p>}
    </>;
    if (painel.tipo === 'pv') return dados && <PainelPV dados={dados} onAtualizar={confirmarAlteracao} onAbrirFicha={setVisualizar} />;
    const fichas = dados?.fichas.filter(f => f.categoria === (painel.tipo === 'monstros' ? 'monstro' : 'jogador')) ?? [];
    return <button className="am-previa-colecao" aria-label={`Abrir coleção de ${painel.tipo}`} onClick={() => setColecao(painel.tipo === 'monstros' ? 'monstro' : 'jogador')}>
      {fichas.length ? <span className="am-miniaturas-colecao">{fichas.map(ficha => <span className="am-previa-ficha" key={ficha.id}>
        <MiniaturaFicha ficha={ficha} anexos={dados?.anexos ?? []} /><span title={ficha.nome}>{ficha.nome}</span>
      </span>)}</span> : <span className="am-vazio">Nenhuma ficha de {painel.tipo === 'monstros' ? 'monstro' : 'jogador'} nesta campanha.</span>}
    </button>;
  };
  const renderPainel = (painel: PainelLayout) => <section className={`am-painel${painel.recolhido ? ' am-painel-compacto' : ''}`} aria-label={titulos[painel.tipo]}>
    <header className="am-painel-cabecalho" role="presentation">
      <span className="mestre-drag-handle am-arrastar" tabIndex={0} role="button" data-panelid={painel.id}
        aria-label={`Mover ou redimensionar ${titulos[painel.tipo]}`} aria-describedby="mestre-grid-teclado" title="Arraste para mover. Setas movem; Shift + setas redimensionam.">⠿</span>
      <button className="am-titulo-painel" aria-expanded={!painel.recolhido} aria-label={`${painel.recolhido ? 'Expandir' : 'Recolher'} ${titulos[painel.tipo]}`}
        onClick={() => alterarPainel(painel.id, { recolhido: !painel.recolhido })}>
        <span aria-hidden="true">{icones[painel.tipo]}</span><strong>{titulos[painel.tipo]}</strong><span aria-hidden="true">{painel.recolhido ? '▾' : '▴'}</span>
      </button>
      <button className="am-fechar" aria-label={`Ocultar ${titulos[painel.tipo]}`} title="Ocultar quadro sem excluir dados"
        onClick={() => { alterarPainel(painel.id, { fechado: true }); menuRef.current?.focus(); }}>×</button>
    </header>
    {!painel.recolhido && <div className="am-painel-conteudo">{conteudo(painel)}</div>}
  </section>;
  const sidebar = <nav className="am-sidebar" aria-label="Ações da campanha">
    <button className="am-toggle-sidebar" aria-label={dados?.layout.sidebarRecolhida ? 'Expandir navegação' : 'Recolher navegação'}
      aria-expanded={!dados?.layout.sidebarRecolhida} title={dados?.layout.sidebarRecolhida ? 'Expandir navegação' : 'Recolher navegação'}
      onClick={() => atualizar(atual => ({ ...atual, layout: { ...atual.layout, sidebarRecolhida: !atual.layout.sidebarRecolhida } }))}>
      <span aria-hidden="true">☰</span><span className="am-sidebar-texto">Navegação</span>
    </button>
    {[{ icone: '♞', categoria: 'monstro' as const }, { icone: '♜', categoria: 'jogador' as const }].map(item => <button key={item.categoria} disabled={carregando} aria-label={`Adicionar ficha de ${item.categoria}`} title={`Adicionar ficha de ${item.categoria}`} onClick={() => setImportar(item.categoria)}>
      <span aria-hidden="true">{item.icone}</span><span className="am-sidebar-texto">Adicionar ficha de {item.categoria}</span>
    </button>)}
    <button onClick={novoRoteiro} title="Adicionar roteiro" aria-label="Adicionar roteiro"><span aria-hidden="true">▤</span><span className="am-sidebar-texto">Adicionar roteiro</span></button>
    <button disabled={carregando || salvando || conflito} aria-label="Iniciar combate" title="Preparar um encontro" onClick={solicitarCombate}><span aria-hidden="true">⚔</span><span className="am-sidebar-texto">Iniciar combate</span></button>
    <button disabled={carregando || salvando} aria-label="Gerenciar combates" title="Gerenciar combates e histórico" onClick={() => void abrirGestaoCombates()}><span aria-hidden="true">☷</span><span className="am-sidebar-texto">Combates e histórico</span></button>
    {!!dados?.combates.some(c => c.estado === 'preparado') && <section aria-label="Encontros preparados">
      <h3 className="am-sidebar-texto">Encontros preparados</h3>
      {dados.combates.filter(c => c.estado === 'preparado').map((c, indice) => <button key={c.id} aria-label={`Ver encontro preparado ${indice+1}`} title={`Encontro preparado ${indice+1}`} onClick={() => setResumoCombate(c.id)}>
        <span aria-hidden="true">⚑</span><span className="am-sidebar-texto">{nomeCombate(dados, c)}</span>
      </button>)}
    </section>}
    {!!dados?.combates.some(c => c.estado === 'ativo') && <section aria-label="Combates em andamento">
      <h3 className="am-sidebar-texto">Em andamento</h3>
      {dados.combates.filter(c => c.estado === 'ativo').map((c, indice) => <button key={c.id} disabled={carregando || salvando} aria-label={`Retomar combate ${indice+1}`} aria-pressed={combateExibido?.id === c.id} title={`Combate ${indice+1} — Rodada ${c.rodada}`} onClick={() => { setParticipanteAberto(null); setCombateSelecionado({ campanhaId: dados.campanha.id, combateId: c.id }); }}>
        <span aria-hidden="true">⚔</span><span className="am-sidebar-texto">{nomeCombate(dados, c)}</span>
      </button>)}
    </section>}
  </nav>;
  return <div className="master-area am-workspace">
    <header className="master-header am-cabecalho" aria-label="Cabeçalho da campanha">
      <div className="am-header-esquerda">
        <div className="master-menu" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMenu(false); }} onKeyDown={e => {
          if (e.key === 'Escape') { setMenu(false); menuRef.current?.focus(); }
        }}>
          <button ref={menuRef} disabled={carregando} className="am-menu-toggle" aria-label="Menu do mestre" aria-expanded={menu} aria-controls="am-menu" onClick={() => setMenu(!menu)}>☰</button>
          {menu && <div id="am-menu">
            <button onClick={abrirGerenciador}>Campanhas</button>
            <button disabled={carregando} onClick={() => { setMenu(false); setBackup('restaurar'); }}>Restaurar backup</button>
            {dados && <>
              <button disabled={carregando || salvando} onClick={() => void abrirGestaoCombates()}>Combates e histórico</button>
              <button disabled={carregando} onClick={() => { setMenu(false); setBackup('exportar'); }}>Exportar backup da campanha</button>
              <button disabled={carregando} onClick={() => { setNovoNome(dados.campanha.nome); setMenu(false); setEditarNome(true); }}>Editar nome da campanha</button>
              <button disabled={carregando} onClick={() => { atualizar(atual => ({ ...atual, layout: criarLayoutPadrao(atual.campanha.id) })); setMenu(false); }}>Restaurar layout padrão</button>
              {dados.layout.paineis.filter(p => p.fechado).map(p => <button key={p.id} onClick={() => { alterarPainel(p.id, { fechado: false }); setMenu(false); }}>Reexibir {titulos[p.tipo]}</button>)}
            </>}
            <button onClick={() => { setMenu(false); void onSair(); }}>Sair</button>
          </div>}
        </div>
        <h1 title={dados?.campanha.nome}>{dados?.campanha.nome ?? 'Campanhas'}</h1>
      </div>
      <span className="am-marca">minhafichadnd</span>
    </header>
    {(carregando || salvando || pendente) && <span className="am-sr" role="status">{carregando ? 'Carregando campanhas…' : salvando ? 'Salvando alterações…' : 'Alterações pendentes'}</span>}
    {erro && <div className="am-erro" role="alert"><p>{erro}</p>
      {dados && <button onClick={() => void estado.salvarAgora()} disabled={conflito || salvando}>Tentar salvar novamente</button>}
      <button onClick={() => dados ? setConfirmarRecarga(true) : void estado.listar()}>{dados ? 'Recarregar versão salva' : 'Tentar carregar novamente'}</button>
    </div>}
    {erroFicha && <div className="am-erro" role="alert">{erroFicha}<button onClick={() => setErroFicha('')}>Fechar aviso</button></div>}
    {dados && combateSelecionado?.campanhaId === dados.campanha.id && !combateExibido && <div className="am-erro" role="status">O combate selecionado foi encerrado ou não está disponível. <button onClick={() => void abrirGestaoCombates()}>Escolher outro combate</button></div>}
    {dados && combateExibido && <BarraIniciativa key={combateExibido.id} dados={dados} combateId={combateExibido.id} ocupado={carregando || salvando || conflito} onAdicionarCondicao={id => void abrirCondicoes(combateExibido.id, id)} onEditarCondicao={(id, condicaoId) => void abrirCondicoes(combateExibido.id, id, condicaoId, !condicaoId)} onEncerrar={() => void abrirEncerramento(combateExibido.id)} onAvancar={() => estado.executarCombate(combateExibido.id, 'avancar')} onReordenar={ordem => estado.executarCombate(combateExibido.id, { ordem })} onAbrirParticipante={setParticipanteAberto} />}
    {dados ? <PaineisLaterais layout={dados.layout} onChange={layout => atualizar(atual => ({ ...atual, layout }))} carregando={carregando} sidebar={sidebar}
      pv={<aside className="am-pv" aria-label="Pontos de vida"><PainelPV dados={dados} onAtualizar={confirmarAlteracao} onAbrirFicha={setVisualizar} /></aside>}>
      <WorkspaceGrid layout={dados.layout} editarLayout={!carregando} onChange={layout => atualizar(atual => ({ ...atual, layout }))} renderPainel={renderPainel} />
    </PaineisLaterais> : <main className="am-sem-campanha"><h2>Prepare sua próxima aventura</h2><p>Crie uma campanha para organizar fichas, roteiros e quadros.</p><button onClick={() => setGerenciador(true)}>Abrir gerenciador de campanhas</button></main>}
    {gerenciador && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Gerenciador de Campanhas" onClose={() => setGerenciador(false)}>
      <h2>Gerenciador de Campanhas</h2><p>Selecione uma aventura ou crie uma nova campanha.</p>
      {carregando && <p role="status">Carregando campanhas…</p>}{erro && <p role="alert">{erro}</p>}
      {!carregando && !campanhas.length && <p className="am-vazio">Você ainda não tem campanhas salvas.</p>}
      <ul className="am-campanhas">{campanhas.map(campanha => <li key={campanha.id}><button disabled={carregando || salvando} aria-label={`Abrir campanha ${campanha.nome}`} onClick={async () => { if (await estado.selecionar(campanha.id)) setGerenciador(false); }}>
        <strong>{campanha.nome}</strong><small>{campanha.id === dados?.campanha.id ? 'Campanha aberta' : 'Abrir campanha'}</small>
      </button></li>)}</ul>
      <form onSubmit={async e => { e.preventDefault(); if (nome.trim() && await estado.criar(nome.trim())) { setNome(''); setGerenciador(false); } }}>
        <label htmlFor="am-nova-campanha">Nome da nova campanha</label><input id="am-nova-campanha" value={nome} maxLength={200} required onChange={e => setNome(e.target.value)} placeholder="Ex.: As minas esquecidas" />
        <button className="am-primario" disabled={!nome.trim() || carregando || salvando}>Criar campanha</button>
      </form>
      <div className="am-dialog-acoes"><button onClick={() => { setGerenciador(false); setBackup('restaurar'); }}>Restaurar backup</button><button onClick={() => void estado.listar()} disabled={carregando}>Atualizar lista</button><button onClick={() => setGerenciador(false)}>Fechar</button></div>
    </AccessibleDialog></div>}
    {editarNome && dados && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Editar nome da campanha" onClose={() => setEditarNome(false)}>
      <h2>Editar nome da campanha</h2><form onSubmit={e => { e.preventDefault(); if (novoNome.trim()) { atualizar(atual => ({ ...atual, campanha: { ...atual.campanha, nome: novoNome.trim() } })); setEditarNome(false); } }}>
        <label htmlFor="am-nome">Nome da campanha</label><input id="am-nome" value={novoNome} maxLength={200} required onChange={e => setNovoNome(e.target.value)} />
        <div className="am-dialog-acoes"><button disabled={!novoNome.trim()}>Salvar nome</button><button type="button" onClick={() => setEditarNome(false)}>Cancelar</button></div>
      </form>
    </AccessibleDialog></div>}
    {editor && dados && <EditorRoteiro key={editor.id} idRoteiro={editor.id} campanhaId={dados.campanha.id} roteiro={editor.roteiro} onSalvar={salvarRoteiro} onClose={() => setEditor(null)} />}
    {importar && dados && <ImportarFicha categoria={importar} campanhaId={dados.campanha.id} onFechar={() => setImportar(null)} onConfirmar={resultado => confirmarAlteracao(atual => incorporarImportacao(atual, resultado))} />}
    {backup && <BackupCampanha modo={backup} dados={dados} onPrepararExportacao={estado.salvarAgora} onRestaurar={estado.restaurar} onFechar={() => setBackup(null)} />}
    {preparacao && dados && <PrepararCombate dados={dados} erroConfirmacao={erro} onFechar={() => setPreparacao(null)} onConfirmar={async rascunho => {
      if (!await estado.confirmarCombate(rascunho, preparacao.id)) return false;
      setResumoCombate(preparacao.id); setPreparacao(null); return true;
    }} />}
    {resumoCombate && dados && <ResumoCombatePreparado dados={dados} combateId={resumoCombate} ocupado={carregando || salvando} erro={erro || erroInicio} onIniciar={conflito ? undefined : () => void iniciarEncontro(resumoCombate)} onFechar={() => { setResumoCombate(null); setErroInicio(''); }} />}
    {gestaoCombates && dados && <GerenciadorCombates dados={dados} erro={erro} onAdicionar={(id, entrada) => estado.executarCombate(id, { adicionar: entrada })} ocupado={carregando || salvando || conflito} onFechar={() => setGestaoCombates(false)} onPreparado={id => { setGestaoCombates(false); setErroInicio(''); setResumoCombate(id); }} onRetomar={retomarCombate} onEncerrar={id => void abrirEncerramento(id)} onHistorico={id => { setGestaoCombates(false); setHistorico(id); }} />}
    {encerramento && dados && <EncerramentoRevisionado key={`encerramento:${encerramento}`} dados={dados} combateId={encerramento} erro={erro} onFechar={() => setEncerramento(null)} onConfirmar={async (decisao, revisao) => {
      if (!await estado.encerrarCombate(encerramento, decisao, revisao)) return false;
      if (combateSelecionado?.combateId === encerramento) { setCombateSelecionado(null); setParticipanteAberto(null); }
      setEncerramento(null); setHistorico(encerramento); return true;
    }} />}
    {condicoes && dados && <CondicoesRevisionadas key={`condicoes:${condicoes.combateId}:${condicoes.participanteId}`} dados={dados} {...condicoes} erro={erro} onFechar={() => setCondicoes(null)} onSalvar={async (acao, revisao) => {
      if (!await estado.alterarCondicao(condicoes.combateId, condicoes.participanteId, acao, revisao)) return false;
      setCondicoes(null); return true;
    }} />}
    {historico && dados && !visualizar && <HistoricoCombate dados={dados} combateId={historico} onFechar={() => setHistorico(null)} onAbrirFicha={setVisualizar} />}
    {escolhaNovoCombate && dados && <div className="am-overlay"><AccessibleDialog className="am-dialog am-escolha-combate" aria-label="Combate em andamento" onClose={() => setEscolhaNovoCombate(false)}>
      <h2>Já existe combate em andamento</h2><p>Crie outro encontro preservando os atuais ou escolha qual deseja finalizar.</p>
      <label>Combate a finalizar<select value={combateParaFinalizar} onChange={e => setCombateParaFinalizar(e.target.value)}><option value="">Selecione um combate</option>{dados.combates.filter(c => c.estado === 'ativo').map(c => <option key={c.id} value={c.id}>{nomeCombate(dados, c)} — Rodada {c.rodada}</option>)}</select></label>
      <div className="am-dialog-acoes"><button onClick={() => setEscolhaNovoCombate(false)}>Cancelar</button><button onClick={() => { setEscolhaNovoCombate(false); setPreparacao({ id: gerarId() }); }}>Criar outro combate</button><button disabled={!combateParaFinalizar || conflito} onClick={() => void abrirEncerramento(combateParaFinalizar)}>Finalizar combate atual</button></div>
    </AccessibleDialog></div>}
    {participanteAberto && dados && !visualizar && <ParticipanteEmCombate key={participanteAberto} dados={dados} instanciaId={participanteAberto} onAtualizar={confirmarAlteracao} onFechar={() => setParticipanteAberto(null)} onAbrirFicha={id => { setParticipanteAberto(null); setVisualizar(id); }} />}
    {colecao && dados && !visualizar && !excluirFicha && !editarFicha && <ColecaoFichas categoria={colecao} dados={dados} onFechar={() => setColecao(null)}
      onAbrir={setVisualizar} onAdicionar={id => void novaInstancia(id)} onEditar={setEditarFicha}
      onExcluir={id => { setErroExclusao(''); setExcluirFicha(dados.fichas.find(f => f.id === id) ?? null); }} />}
    {editarFicha && dados && dados.fichas.find(f => f.id === editarFicha) && <EditarFichaImportada ficha={dados.fichas.find(f => f.id === editarFicha)!} anexos={dados.anexos}
      onFechar={() => setEditarFicha(null)} onSalvar={resultado => confirmarAlteracao(atual => ({ ...atual,
        fichas: atual.fichas.map(f => f.id === resultado.ficha.id ? resultado.ficha : f),
        anexos: [...atual.anexos, ...resultado.anexos.filter(anexo => !atual.anexos.some(a => a.id === anexo.id))],
      }))} />}
    {visualizar && dados && dados.fichas.find(f => f.id === visualizar) && <VisualizadorFicha ficha={dados.fichas.find(f => f.id === visualizar)!} anexos={dados.anexos} onGerarPdf={() => estado.garantirPdfFicha(visualizar)} onFechar={() => setVisualizar(null)} />}
    {excluirFicha && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Excluir ficha" onClose={() => setExcluirFicha(null)}>
      <h2>Excluir ficha {excluirFicha.nome}?</h2><p>As instâncias dependentes precisam ser removidas antes, abrindo a barra de vida de cada instância. Os arquivos anexados serão preservados.</p>
      {erroExclusao && <p role="alert">{erroExclusao}</p>}
      <div className="am-dialog-acoes"><button onClick={() => setExcluirFicha(null)}>Cancelar</button><button disabled={salvando} onClick={async () => {
        try { if (await confirmarAlteracao(atual => removerFichaCampanha(atual, excluirFicha.id))) setExcluirFicha(null); else setErroExclusao('Não foi possível confirmar a exclusão no armazenamento.'); }
        catch (causa) { setErroExclusao(causa instanceof Error ? causa.message : 'Não foi possível excluir.'); }
      }}>Confirmar exclusão da ficha</button></div>
    </AccessibleDialog></div>}
    {excluirRoteiro && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Excluir roteiro" onClose={() => setExcluirRoteiro(null)}>
      <h2>Excluir roteiro?</h2><p>Excluir “{excluirRoteiro.titulo}”? Os demais roteiros serão preservados.</p>{erroExclusao && <p role="alert">{erroExclusao}</p>}
      <div className="am-dialog-acoes"><button onClick={() => setExcluirRoteiro(null)}>Cancelar</button><button disabled={salvando} onClick={async () => {
        atualizar(atual => ({ ...atual, campanha: { ...atual.campanha, roteiros: (atual.campanha.roteiros ?? []).filter(r => r.id !== excluirRoteiro.id) } }));
        if (await estado.salvarAgora()) setExcluirRoteiro(null); else setErroExclusao('Não foi possível confirmar a exclusão no armazenamento.');
      }}>Confirmar exclusão</button></div>
    </AccessibleDialog></div>}
    {confirmarRecarga && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Recarregar versão salva" onClose={() => setConfirmarRecarga(false)}>
      <h2>Recarregar versão salva?</h2><p>As alterações locais ainda não salvas serão descartadas. Será recuperada a versão mais recente do IndexedDB.</p>
      <div className="am-dialog-acoes"><button onClick={async () => { if (await estado.recarregar()) setConfirmarRecarga(false); }}>Descartar alterações e recarregar</button><button onClick={() => setConfirmarRecarga(false)}>Continuar editando</button></div>
    </AccessibleDialog></div>}
  </div>;
}
export default AreaMestreWorkspace;
