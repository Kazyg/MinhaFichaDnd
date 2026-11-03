import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { User } from '@supabase/supabase-js';
import AccessibleDialog from '../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../areaMestre/modelos';
import { EscolhaSala, prepararPublicacao } from './compartilhamento';
import { ConfigSala, lerConfig, lerMembros, lerSala, linkConvite, Membro, observarSala, publicarSala, rpc, Sala, salaConfigurada } from './cliente';
import { provisionarSala } from './provisionamento';
import VisaoJogadores from './VisaoJogadores';
import './salaOnline.css';

const escolhaVazia: EscolhaSala = { jogadores: [], combateId: null, monstros: [] };
const mensagem = (e: unknown) => e instanceof Error ? e.message : 'Não foi possível concluir. Tente novamente.';

export default function SalaMestre({ dados, pronto, aberto, onFechar }: { dados: DadosCampanha; pronto: boolean; aberto: boolean; onFechar: () => void }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [aviso, setAviso] = useState(''); const [erro, setErro] = useState('');
  const [sala, setSala] = useState<Sala | null>(null); const [config, setConfig] = useState<ConfigSala | null>(null);
  const pedidosNotificados = useRef(new Set<string>());
  const [membros, setMembros] = useState<Membro[]>([]);
  const [escolha, setEscolha] = useState<EscolhaSala>(escolhaVazia); const [rascunho, setRascunho] = useState<EscolhaSala>(escolhaVazia);
  const [ocupado, setOcupado] = useState(false); const [previa, setPrevia] = useState(false); const [tentativa, setTentativa] = useState(0);
  const [iniciar, setIniciar] = useState(false);
  useEffect(() => { if (pronto) setIniciar(true); }, [pronto]);
  const [inicializando, setInicializando] = useState(false);
  const [repetirInicio, setRepetirInicio] = useState(0);
  const nomeCampanha = useRef(dados.campanha.nome); nomeCampanha.current = dados.campanha.nome;
  const [sincronizando, setSincronizando] = useState(false);
  const salaRef = useRef<Sala | null>(null); const montado = useRef(true); const enviando = useRef(false);
  const proximo = useRef<{ dados: DadosCampanha; escolha: EscolhaSala } | null>(null);
  const ultimoEnvio = useRef(''); const campanhaId = dados.campanha.id;
  const revisaoPublicacao = useRef<number | null>(null); const envioPausado = useRef(false);
  useEffect(() => { montado.current = true; return () => { montado.current = false; proximo.current = null; }; }, []);
  const receberSala = useCallback((valor: Sala | null) => {
    if (!montado.current) return;
    if (valor && salaRef.current && valor.revisao < salaRef.current.revisao) return;
    salaRef.current = valor; setSala(valor);
  }, []);
  const carregar = useCallback(async (id: string, opcoes = false) => {
    const [nova, pessoas, c] = await Promise.all([lerSala(id), lerMembros(id), lerConfig(id)]);
    if (!montado.current) return;
    if (!nova) { receberSala(null); setConfig(null); throw new Error('Sala indisponível. Tente novamente.'); }
    receberSala(nova); setMembros(pessoas);
    for (const pessoa of pessoas) {
      if (pessoa.estado === 'pendente' && !pedidosNotificados.current.has(pessoa.usuario)) {
        pedidosNotificados.current.add(pessoa.usuario);
        toast.info(pessoa.nome + ' solicitou entrada na sala. Abra Sala online para aprovar.', { toastId: 'sala-pedido-' + id + '-' + pessoa.usuario, autoClose: 8000 });
      }
    }
    if (opcoes) {
      revisaoPublicacao.current = nova?.revisao ?? null; envioPausado.current = false;
      setConfig(c); setEscolha(c.escolha); setRascunho(c.escolha);
    } else {
      // Outra aba pode renovar o convite sem alterar a seleção em edição aqui.
      setConfig(atual => atual && atual.convite !== c.convite ? { ...atual, convite: c.convite } : atual);
    }
  }, [receberSala]);
  useEffect(() => {
    if (!salaConfigurada() || !iniciar || salaRef.current) return;
    let ativo = true;
    setInicializando(true); setErro('');
    void provisionarSala(campanhaId, nomeCampanha.current).then(async ({ id, usuario: dono }) => {
      if (!ativo) return;
      await carregar(id, true);
      if (ativo) setUsuario(dono);
    }).catch(e => { if (ativo) setErro(mensagem(e)); })
      .finally(() => { if (ativo) setInicializando(false); });
    return () => { ativo = false; };
  }, [campanhaId, iniciar, carregar, repetirInicio]);
  const salaId = sala?.id;
  useEffect(() => {
    if (!salaId) return;
    let lendo = false;
    const atualizar = () => {
      if (lendo) return; lendo = true;
      void carregar(salaId).catch(e => { if (montado.current) setErro(mensagem(e)); }).finally(() => { lendo = false; });
    };
    const parar = observarSala(salaId, atualizar);
    const bater = () => { void rpc('sala_presenca', { p_sala: salaId }).catch(() => {}); };
    bater(); const timer = setInterval(bater, 20000);
    return () => { parar(); clearInterval(timer); };
  }, [salaId, carregar]);

  useEffect(() => {
    if (!salaId || !sala?.aberta || !config || !pronto || !usuario || envioPausado.current) { proximo.current = null; return; }
    proximo.current = { dados, escolha };
    const timer = setTimeout(() => {
      if (enviando.current) return;
      const executar = async () => {
        enviando.current = true; setSincronizando(true);
        try {
          while (proximo.current && montado.current && salaRef.current?.aberta) {
            const alvo = proximo.current; proximo.current = null;
            const publicacao = prepararPublicacao(alvo.dados, alvo.escolha);
            // IDs não mudam com o PV; o cliente reutiliza arquivos pelo hash do conteúdo.
            const assinatura = JSON.stringify([publicacao.visao, alvo.escolha, alvo.dados.campanha.revisao, tentativa]);
            if (assinatura === ultimoEnvio.current) continue;
            const atual = salaRef.current;
            const revisao = await publicarSala({ ...atual, revisao: revisaoPublicacao.current ?? atual.revisao }, publicacao, alvo.escolha);
            revisaoPublicacao.current = revisao;
            ultimoEnvio.current = assinatura;
            if (montado.current) { salaRef.current = { ...atual, revisao }; await carregar(atual.id); setErro(''); }
          }
        } catch (e) { proximo.current = null; envioPausado.current = true; if (montado.current) setErro(mensagem(e)); }
        finally { enviando.current = false; if (montado.current) setSincronizando(false); }
      };
      void executar();
    }, 700);
    return () => clearTimeout(timer);
  }, [dados, escolha, pronto, salaId, sala?.aberta, config, usuario, tentativa, carregar]);

  const agir = async (acao: () => Promise<void>) => {
    setOcupado(true); setErro(''); setAviso('');
    try { await acao(); } catch (e) { setErro(mensagem(e)); } finally { if (montado.current) setOcupado(false); }
  };
  const comando = (acao: string, pessoa?: string) => agir(async () => {
    if (!sala) return;
    await rpc('sala_comando', { p_sala: sala.id, p_acao: acao, p_usuario: pessoa ?? null });
    await carregar(sala.id);
    if (['encerrar','reabrir'].includes(acao)) {
      revisaoPublicacao.current = salaRef.current?.revisao ?? null;
      ultimoEnvio.current = ''; envioPausado.current = false;
    }
    if (['renovar','encerrar','reabrir'].includes(acao)) setConfig(await lerConfig(sala.id));
  });
  const combate = dados.combates.find(c => c.id === rascunho.combateId);
  const monstros = dados.instancias.filter(i => i.categoria === 'monstro' && dados.participantes.some(p => p.combateId === combate?.id && p.instanciaId === i.id));
  const marcar = (campo: 'jogadores' | 'monstros', id: string, sim: boolean) => setRascunho(atual => ({ ...atual, [campo]: sim ? [...atual[campo], id] : atual[campo].filter(v => v !== id) }));
  const preview = previa ? prepararPublicacao(dados, rascunho) : null;
  const copiar = () => agir(async () => {
    if (!config || !sala?.aberta) return;
    await navigator.clipboard.writeText(linkConvite(config.convite)); setAviso('Link copiado.');
  });
  const tentarInicio = <button disabled={inicializando || !pronto} onClick={() => { salaRef.current = null; receberSala(null); setConfig(null); setRepetirInicio(t => t + 1); }}>Tentar novamente</button>;
  return <>
    {!aberto && membros.some(m => m.estado === 'pendente') && <p className="sala-alerta-pedidos" role="status">{membros.filter(m => m.estado === 'pendente').length} pedido(s) de entrada aguardando aprovação em Sala online.</p>}
    {!aberto && erro && <p className="am-erro" role="alert">Sala online: {erro} Abra Sala online para tentar novamente.</p>}
    {aberto && <div className="sala-overlay"><AccessibleDialog className="sala-dialog sala-painel-mestre" aria-label="Sala online" onClose={onFechar}>
      <header className="sala-painel-cabecalho"><div><span className="sala-eyebrow">ÁREA DO MESTRE</span><h2>Sala online</h2><p>{dados.campanha.nome}</p></div><button onClick={onFechar}>Fechar painel</button></header>
      {!salaConfigurada() ? <p>As salas online ainda não foram ativadas neste site. Sua campanha continua funcionando normalmente.</p> : <>
        {!sala ? <p role="status">{inicializando ? 'Preparando convite…' : erro ? 'Sala indisponível no momento.' : 'Aguardando salvar a campanha…'}</p> : <>
          <p className="sala-estado" role="status">{sala.aberta ? sincronizando ? 'Atualizando a sala…' : 'Sala aberta' : 'Sala encerrada'}{!pronto ? ' · aguardando salvar a campanha' : ''}</p>
          {sala.aberta && config && <section className="sala-card" aria-label="Convite e acesso"><h3>Convide seu grupo</h3><p>Envie o link e aprove os jogadores quando chegarem.</p><label>Link de convite<input readOnly value={linkConvite(config.convite)} onFocus={e => e.target.select()} /></label>
            <div className="sala-acoes"><button disabled={ocupado || sala.bloqueada} onClick={() => void copiar()}>Copiar link</button>
              <button disabled={ocupado || sincronizando} onClick={() => void comando(sala.bloqueada ? 'desbloquear' : 'bloquear')}>{sala.bloqueada ? 'Permitir novas entradas' : 'Bloquear novas entradas'}</button>
              <button disabled={ocupado || sincronizando} onClick={() => void comando('renovar')}>Renovar convite</button></div>
            <p>Renovar invalida o link anterior e recusa as solicitações pendentes. Quem já foi aprovado continua na sala.</p>
          </section>}
          <fieldset disabled={ocupado || sincronizando || !sala.aberta}><legend>Visão dos jogadores</legend>
            <div className="sala-grupo-resumo"><strong>Grupo sempre visível</strong><p>Todos os jogadores da campanha aparecem automaticamente, com suas fichas e pontos de vida.</p>
              <div className="sala-chips">{dados.instancias.filter(i => i.categoria === 'jogador').map(i => <span key={i.id}>{i.nome}</span>)}</div>
              {!dados.instancias.some(i => i.categoria === 'jogador') && <p>Adicione as fichas dos jogadores à campanha.</p>}
              <small>Para fichas JSON antigas, abra a ficha uma vez na campanha para gerar o PDF.</small>
            </div>
            <label>Combate exibido<select value={rascunho.combateId ?? ''} onChange={e => setRascunho(v => ({ ...v, combateId: e.target.value || null, monstros: [] }))}><option value="">Nenhum</option>{dados.combates.filter(c => c.estado !== 'encerrado').map((c, i) => <option key={c.id} value={c.id}>{c.nome || `Combate ${i + 1}`} ({c.estado})</option>)}</select></label>
            {monstros.map(i => <label className="sala-check" key={i.id}><input type="checkbox" checked={rascunho.monstros.includes(i.id)} onChange={e => marcar('monstros', i.id, e.target.checked)} />Revelar retrato: {i.nome}</label>)}
            <p>As imagens selecionadas aparecem quando esse combate é iniciado e somem ao encerrá-lo. A roda mostra os jogadores participantes e somente os monstros revelados. Sem retrato separado, aparece um símbolo neutro.</p>
            <button onClick={() => { setEscolha(rascunho); setTentativa(t => t + 1); }}>Aplicar compartilhamento</button>
          </fieldset>
          <button onClick={() => setPrevia(v => !v)}>{previa ? 'Fechar prévia' : 'Prévia da seleção para jogadores'}</button>
          {preview && <VisaoJogadores visao={preview.visao} carregar={async arquivo => { const blob = preview.arquivos.get(arquivo.id); if (!blob) throw new Error('Arquivo indisponível'); return blob; }} />}
          <section className="sala-card" aria-label="Participantes"><h3>Participantes <span className="sala-badge">{membros.filter(m => m.estado === 'pendente').length} pendentes</span></h3><ul className="sala-membros">{[...membros].sort((a, b) => Number(b.estado === 'pendente') - Number(a.estado === 'pendente')).map(m => <li className={'sala-membro sala-membro-' + m.estado} key={m.usuario}><span><strong>{m.nome}</strong> · {m.estado} · {Date.now() - Date.parse(m.visto_em) < 60000 ? 'conectado' : 'ausente'}</span>
            {m.estado === 'pendente' && <><button disabled={ocupado || !sala.aberta} onClick={() => void comando('aprovar', m.usuario)}>Aprovar {m.nome}</button><button disabled={ocupado} onClick={() => void comando('recusar', m.usuario)}>Recusar</button></>}
            {m.estado === 'aprovado' && <button disabled={ocupado} onClick={() => void comando('revogar', m.usuario)}>Remover {m.nome}</button>}
            {['revogado','recusado'].includes(m.estado) && <button disabled={ocupado || !sala.aberta} onClick={() => void comando('aprovar', m.usuario)}>Autorizar retorno de {m.nome}</button>}
          </li>)}</ul>{!membros.length && <p>Nenhuma solicitação ainda. Compartilhe o convite para reunir o grupo.</p>}</section>
          <div className="sala-acoes sala-rodape"><button disabled={ocupado || sincronizando || !pronto || !sala.aberta} onClick={() => { envioPausado.current = false; setTentativa(t => t + 1); }}>Sincronizar agora</button>
            <button disabled={ocupado || sincronizando} onClick={() => void agir(async () => { await carregar(sala.id, true); ultimoEnvio.current = ''; setTentativa(t => t + 1); })}>Recarregar opções salvas da sala</button>
            <button disabled={ocupado || sincronizando} onClick={() => void comando(sala.aberta ? 'encerrar' : 'reabrir')}>{sala.aberta ? 'Encerrar acesso de todos' : 'Reabrir com novo convite'}</button></div>
        </>}
      </>}
      {aviso && <p role="status">{aviso}</p>}{erro && <div role="alert">{erro} {!config && tentarInicio}</div>}
    </AccessibleDialog></div>}
  </>;
}
