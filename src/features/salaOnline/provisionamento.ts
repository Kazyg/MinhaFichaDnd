import { obterCliente, rpc } from './cliente';
import { User } from '@supabase/supabase-js';

let identificando: Promise<User> | null = null;

/** Reutiliza inclusive contas antigas; falha de rede nunca troca a identidade. */
export function garantirIdentidade(): Promise<User> {
  if (!identificando) {
    const identificar = async () => {
      const auth = obterCliente().auth;
      const existente = await auth.getSession();
      if (existente.error) throw new Error('Não foi possível recuperar sua sessão. Tente novamente.');
      if (existente.data.session) return existente.data.session.user;
      const nova = await auth.signInAnonymously();
      if (nova.error || !nova.data.user || !nova.data.session) {
        throw new Error('Não foi possível preparar seu acesso à sala. Verifique a conexão e tente novamente.');
      }
      return nova.data.user;
    };
    // Serializa a primeira identificação também entre abas do mesmo navegador.
    identificando = (navigator.locks
      ? navigator.locks.request('minhafichadnd-identidade-sala', identificar)
      : identificar()).finally(() => { identificando = null; });
  }
  return identificando;
}

export async function provisionarSala(campanha: string, nome: string) {
  const usuario = await garantirIdentidade();
  const id = await rpc<string>('sala_criar', { p_campanha: campanha, p_nome: nome });
  return { id, usuario };
}
