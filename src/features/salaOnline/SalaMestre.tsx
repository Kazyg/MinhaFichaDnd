import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import AccessibleDialog from '../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../areaMestre/modelos';
import { EscolhaSala, prepararPublicacao } from './compartilhamento';
import { ConfigSala, lerConfig, lerMembros, lerSala, linkConvite, Membro, observarSala, obterCliente, publicarSala, rpc, Sala, salaConfigurada } from './cliente';
import VisaoJogadores from './VisaoJogadores';
import './salaOnline.css';

const escolhaVazia: EscolhaSala = { jogadores: [], combateId: null, monstros: [] };
const mensagem = (e: unknown) => e instanceof Error ? e.message : 'Não foi possível concluir. Tente novamente.';

export default function SalaMestre({ dados, pronto, aberto, onFechar }: { dados: DadosCampanha; pronto: boolean; aberto: boolean; onFechar: () => void }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [email, setEmail] = useState(''); const [aviso, setAviso] = useState(''); const [erro, setErro] = useState('');
  const [sala, setSala] = useState<Sala | null>(null); const [config, setConfig] = useState<ConfigSala | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [escolha, setEscolha] = useState<EscolhaSala>(escolhaVazia); const [rascunho, setRascunho] = useState<EscolhaSala>(escolhaVazia);
  const [ocupado, setOcupado] = useState(false); const [previa, setPrevia] = useState(false); const [tentativa, setTentativa] = useState(0);
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
    const [nova, pessoas] = await Promise.all([lerSala(id), lerMembros(id)]);
    if (!montado.current) return;
    receberSala(nova); setMembros(pessoas);
    if (opcoes) {
      const c = await lerConfig(id); if (!montado.current) return;
      revisaoPublicacao.current = nova?.revisao ?? null; envioPausado.current = false;
      setConfig(c); setEscolha(c.escolha); setRascunho(c.escolha);
    }
  }, [receberSala]);
  useEffect(() => {
    if (!salaConfigurada()) return;
    const api = obterCliente(); let ativo = true;
    void api.auth.getUser().then(({ data }) => { if (ativo) setUsuario(data.user); });
    const { data } = api.auth.onAuthStateChange((_evento, sessao) => { if (ativo) setUsuario(sessao?.user ?? null); });
    return () => { ativo = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!usuario || usuario.is_anonymous) { receberSala(null); return; }
    let ativo = true;
    void (async () => {
      const { data, error } = await obterCliente().from('salas').select('id').eq('campanha_local', campanhaId).eq('dono', usuario.id).maybeSingle();
      if (error) throw new Error('Não foi possível localizar a sala. Confira a configuração do serviço.');
      if (ativo && data) await carregar(data.id, true);
    })().catch(e => { if (ativo) setErro(mensagem(e)); });
    return () => { ativo = false; };
  }, [usuario, campanhaId, carregar, receberSala]);
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
    if (!salaId || !sala?.aberta || !config || !pronto || !usuario || usuario.is_anonymous || envioPausado.current) { proximo.current = null; return; }
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
  return <>
    {!aberto && erro && <p className="am-erro" role="alert">Sala online: {erro} Abra “Sala online” no menu do mestre para tentar novamente.</p>}
    {aberto && <div className="sala-overlay"><AccessibleDialog className="sala-dialog" aria-label="Sala online" onClose={onFechar}>
      <h2>Sala online</h2><button className="sala-fechar" onClick={onFechar}>Fechar painel</button>
      {!salaConfigurada() ? <p>As salas online ainda não foram ativadas neste site. Sua campanha continua funcionando normalmente.</p> : <>
        {(!usuario || usuario.is_anonymous) ? <form onSubmit={e => { e.preventDefault(); void agir(async () => {
          const { error } = await obterCliente().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/mestre` } });
          if (error) throw new Error('Não foi possível enviar o link. Confira o e-mail ou tente novamente em alguns instantes.');
          setAviso('Enviamos um link de acesso ao seu e-mail. Abra-o neste navegador e selecione esta campanha novamente.');
        }); }}><p>Identifique-se como mestre para administrar sua sala. Os jogadores entram somente com nome e aprovação.</p>
          <label>Seu e-mail<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><button disabled={ocupado}>Receber link de acesso</button>
        </form> : !sala ? <><p>Compartilhe somente as fichas do grupo e os retratos revelados. A campanha completa permanece neste navegador.</p>
          <button disabled={ocupado || !pronto} onClick={() => void agir(async () => { const id = await rpc<string>('sala_criar', { p_campanha: campanhaId, p_nome: dados.campanha.nome }); await carregar(id, true); })}>Criar sala desta campanha</button>
        </> : <>
          <p role="status">{sala.aberta ? sincronizando ? 'Atualizando a sala…' : 'Sala aberta' : 'Sala encerrada'}{!pronto ? ' · aguardando salvar a campanha' : ''}</p>
          {sala.aberta && config && <><label>Link de convite<input readOnly value={linkConvite(config.convite)} onFocus={e => e.target.select()} /></label>
            <div className="sala-acoes"><button onClick={() => void agir(async () => { await navigator.clipboard.writeText(linkConvite(config.convite)); setAviso('Link copiado.'); })}>Copiar link</button>
              <button disabled={ocupado || sincronizando} onClick={() => void comando(sala.bloqueada ? 'desbloquear' : 'bloquear')}>{sala.bloqueada ? 'Permitir novas entradas' : 'Bloquear novas entradas'}</button>
              <button disabled={ocupado || sincronizando} onClick={() => void comando('renovar')}>Renovar convite</button></div>
            <p>Renovar invalida o link anterior e recusa as solicitações pendentes. Quem já foi aprovado continua na sala.</p>
          </>}
          <fieldset disabled={ocupado || sincronizando || !sala.aberta}><legend>Personagens compartilhados</legend>
            {dados.instancias.filter(i => i.categoria === 'jogador').map(i => <label className="sala-check" key={i.id}><input type="checkbox" checked={rascunho.jogadores.includes(i.id)} onChange={e => marcar('jogadores', i.id, e.target.checked)} />{i.nome}</label>)}
            {!dados.instancias.some(i => i.categoria === 'jogador') && <p>Importe as fichas dos jogadores na campanha primeiro.</p>}
            <p>Todos poderão ler as fichas selecionadas. Para fichas JSON antigas, abra a ficha na campanha uma vez para gerar seu PDF antes de compartilhar.</p>
            <label>Combate exibido<select value={rascunho.combateId ?? ''} onChange={e => setRascunho(v => ({ ...v, combateId: e.target.value || null, monstros: [] }))}><option value="">Nenhum</option>{dados.combates.filter(c => c.estado !== 'encerrado').map((c, i) => <option key={c.id} value={c.id}>{c.nome || `Combate ${i + 1}`} ({c.estado})</option>)}</select></label>
            {monstros.map(i => <label className="sala-check" key={i.id}><input type="checkbox" checked={rascunho.monstros.includes(i.id)} onChange={e => marcar('monstros', i.id, e.target.checked)} />Revelar retrato: {i.nome}</label>)}
            <p>As imagens selecionadas aparecem quando esse combate é iniciado e somem ao encerrá-lo. Sem retrato separado, aparece um símbolo neutro.</p>
            <button onClick={() => { setEscolha(rascunho); setTentativa(t => t + 1); }}>Aplicar compartilhamento</button>
          </fieldset>
          <button onClick={() => setPrevia(v => !v)}>{previa ? 'Fechar prévia' : 'Prévia da seleção para jogadores'}</button>
          {preview && <VisaoJogadores visao={preview.visao} carregar={async arquivo => { const blob = preview.arquivos.get(arquivo.id); if (!blob) throw new Error('Arquivo indisponível'); return blob; }} />}
          <h3>Participantes</h3><ul className="sala-membros">{membros.map(m => <li key={m.usuario}><span><strong>{m.nome}</strong> · {m.estado} · {Date.now() - Date.parse(m.visto_em) < 60000 ? 'conectado' : 'ausente'}</span>
            {m.estado === 'pendente' && <><button disabled={ocupado || !sala.aberta} onClick={() => void comando('aprovar', m.usuario)}>Aprovar {m.nome}</button><button disabled={ocupado} onClick={() => void comando('recusar', m.usuario)}>Recusar</button></>}
            {m.estado === 'aprovado' && <button disabled={ocupado} onClick={() => void comando('revogar', m.usuario)}>Remover {m.nome}</button>}
            {['revogado','recusado'].includes(m.estado) && <button disabled={ocupado || !sala.aberta} onClick={() => void comando('aprovar', m.usuario)}>Autorizar retorno de {m.nome}</button>}
          </li>)}</ul>{!membros.length && <p>Nenhuma solicitação de entrada.</p>}
          <div className="sala-acoes"><button disabled={ocupado || sincronizando || !pronto || !sala.aberta} onClick={() => { envioPausado.current = false; setTentativa(t => t + 1); }}>Sincronizar agora</button>
            <button disabled={ocupado || sincronizando} onClick={() => void agir(async () => { await carregar(sala.id, true); ultimoEnvio.current = ''; setTentativa(t => t + 1); })}>Recarregar opções salvas da sala</button>
            <button disabled={ocupado || sincronizando} onClick={() => void comando(sala.aberta ? 'encerrar' : 'reabrir')}>{sala.aberta ? 'Encerrar acesso de todos' : 'Reabrir com novo convite'}</button></div>
        </>}
      </>}
      {aviso && <p role="status">{aviso}</p>}{erro && <p role="alert">{erro}</p>}
    </AccessibleDialog></div>}
  </>;
}
