import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { lerMembros, lerSala, observarSala, obterCliente, rpc, Sala, salaConfigurada } from './cliente';
import { garantirIdentidade } from './provisionamento';
import VisaoJogadores from './VisaoJogadores';
import './salaOnline.css';

export default function SalaJogador() {
  const [convite] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('convite') || '');
  const [nome, setNome] = useState('');
  const [id, setId] = useState(() => sessionStorage.getItem(`sala-convite-${convite}`) || '');
  const [sala, setSala] = useState<Sala | null>(null);
  const [estado, setEstado] = useState(''); const [erro, setErro] = useState(''); const [ocupado, setOcupado] = useState(false);
  const [conectado, setConectado] = useState(false);
  useEffect(() => {
    if (!id || !salaConfigurada()) return;
    let ativo = true; let lendo = false;
    const limparAcesso = () => {
      sessionStorage.removeItem(`sala-convite-${convite}`);
      setSala(null); setId(''); setNome(''); setEstado(''); setConectado(false);
      setErro('Seu acesso foi encerrado. Informe seu nome para solicitar entrada novamente.');
    };
    const atualizar = async () => {
      if (lendo) return; lendo = true;
      try {
        const { data: { user }, error } = await obterCliente().auth.getUser();
        if (error || !user) {
          if (!user && (!error || [401,403].includes(error.status ?? 0))) {
            if (ativo) limparAcesso();
            return;
          }
          throw new Error('Não foi possível confirmar sua identificação. Verifique a conexão ou entre novamente pelo convite.');
        }
        const membros = await lerMembros(id);
        const membro = membros.find(m => m.usuario === user.id);
        if (!ativo) return;
        const atual = membro?.estado ?? 'revogado';
        if (atual === 'revogado' || atual === 'recusado') { limparAcesso(); return; }
        setEstado(atual);
        if (atual !== 'aprovado') setSala(null);
        else {
          const nova = await lerSala(id);
          if (!ativo) return;
          if (!nova || !nova.aberta) { limparAcesso(); return; }
          else setSala(anterior => anterior && JSON.stringify(anterior) === JSON.stringify(nova) ? anterior : nova);
        }
        if (ativo) { setConectado(true); setErro(''); }
      } catch (causa) { if (ativo) { setConectado(false); setErro(causa instanceof Error ? causa.message : 'Reconectando…'); } }
      finally { lendo = false; }
    };
    void atualizar();
    const parar = observarSala(id, () => void atualizar());
    const presenca = setInterval(() => { void rpc('sala_presenca', { p_sala: id }).catch(() => {}); }, 20000);
    const offline = () => { setConectado(false); setErro('Sem conexão. Exibindo a última atualização recebida.'); };
    window.addEventListener('offline', offline);
    return () => { ativo = false; parar(); clearInterval(presenca); window.removeEventListener('offline', offline); };
  }, [id, convite]);
  const entrar = async () => {
    setOcupado(true); setErro('');
    try {
      await garantirIdentidade();
      const salaId = await rpc<string>('sala_pedir_entrada', { p_convite: convite, p_nome: nome.trim() });
      sessionStorage.setItem(`sala-convite-${convite}`, salaId); setId(salaId); setEstado('pendente');
    } catch (causa) { setErro(causa instanceof Error ? causa.message : 'Não foi possível entrar.'); }
    finally { setOcupado(false); }
  };
  return <main className="sala-pagina"><header><Link to="/">MinhaFichaDnd</Link><h1>Sala do grupo</h1></header>
    {!salaConfigurada() ? <p role="status">As salas online ainda não estão disponíveis neste site.</p> : !convite ? <p>Abra o link de convite enviado pelo mestre.</p> : <>
      {!id && <form className="sala-entrada" onSubmit={e => { e.preventDefault(); void entrar(); }}>
        <h2>Como você se chama?</h2><p>O mestre precisa aprovar sua entrada. Você poderá consultar as fichas e vidas do grupo.</p>
        <label>Seu nome<input value={nome} onChange={e => setNome(e.target.value)} maxLength={60} autoComplete="nickname" required /></label>
        <button disabled={ocupado || !nome.trim()}>{ocupado ? 'Solicitando…' : 'Solicitar entrada'}</button>
      </form>}
      {id && estado === 'pendente' && <p role="status">Aguardando a aprovação do mestre…</p>}
      {erro && <p role="alert">{erro}</p>}
      {sala && <><p role="status">{conectado ? 'Conectado' : 'Reconectando · dados podem estar desatualizados'} · Última atualização: {new Date(sala.atualizada_em).toLocaleTimeString('pt-BR')}</p>
        {Date.now() - Date.parse(sala.mestre_visto_em) > 60000 && <p>O mestre está desconectado. Você está vendo o último estado compartilhado.</p>}
        <VisaoJogadores visao={sala.visao} />
      </>}
    </>}
  </main>;
}
