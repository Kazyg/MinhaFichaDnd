import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EscolhaSala, PublicacaoSala, VisaoSala } from './compartilhamento';

let cliente: SupabaseClient | null = null;
export const salaConfigurada = () => Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY);
export function obterCliente(): SupabaseClient {
  if (!salaConfigurada()) throw new Error('A sala online ainda não foi configurada neste site.');
  if (!cliente) cliente = createClient(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_ANON_KEY!, {
    auth: { storageKey: 'minhafichadnd-sala-auth', detectSessionInUrl: true },
  });
  return cliente;
}
export interface Sala {
  id: string; aberta: boolean; bloqueada: boolean; revisao: number; visao: VisaoSala;
  atualizada_em: string; mestre_visto_em: string;
}
export interface Membro { usuario: string; nome: string; estado: 'pendente' | 'aprovado' | 'recusado' | 'revogado'; visto_em: string }
export interface ConfigSala { convite: string; escolha: EscolhaSala }
export async function rpc<T>(nome: string, parametros: Record<string, unknown>): Promise<T> {
  const { data, error } = await obterCliente().rpc(nome, parametros);
  if (error) throw new Error(error.message);
  return data as T;
}
export async function lerSala(id: string): Promise<Sala | null> {
  const { data, error } = await obterCliente().from('salas').select('id,aberta,bloqueada,revisao,visao,atualizada_em,mestre_visto_em').eq('id', id).maybeSingle();
  if (error) throw new Error('Não foi possível atualizar a sala. Verifique sua conexão.');
  return data;
}
export async function lerConfig(id: string): Promise<ConfigSala> {
  const { data, error } = await obterCliente().from('sala_config').select('convite,escolha').eq('sala', id).single();
  if (error) throw new Error('Não foi possível carregar as opções da sala.');
  return data;
}
export async function lerMembros(id: string): Promise<Membro[]> {
  const { data, error } = await obterCliente().from('sala_membros').select('usuario,nome,estado,visto_em').eq('sala', id).order('nome');
  if (error) throw new Error('Não foi possível atualizar os participantes.');
  return data ?? [];
}
export function observarSala(id: string, atualizar: () => void): () => void {
  const api = obterCliente();
  const canal = api.channel(`sala-${id}-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'salas', filter: `id=eq.${id}` }, atualizar)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sala_membros', filter: `sala=eq.${id}` }, atualizar)
    .subscribe(status => { if (status === 'SUBSCRIBED') atualizar(); });
  // Releitura periódica detecta revogação mesmo quando RLS suprime o evento.
  const timer = setInterval(atualizar, 5000);
  window.addEventListener('online', atualizar);
  return () => { clearInterval(timer); window.removeEventListener('online', atualizar); void api.removeChannel(canal); };
}

const imagensLimpas = new WeakMap<Blob, Promise<Blob>>();
const arquivosEnviados = new Set<string>();
async function limparImagem(blob: Blob): Promise<Blob> {
  if (!imagensLimpas.has(blob)) imagensLimpas.set(blob, (async () => {
    const bitmap = await createImageBitmap(blob);
    try {
      if (bitmap.width * bitmap.height > 50_000_000) throw new Error('Imagem muito grande para compartilhar.');
      const canvas = document.createElement('canvas');
      const escala = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * escala)); canvas.height = Math.max(1, Math.round(bitmap.height * escala));
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Não foi possível preparar o retrato.');
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Falha ao preparar retrato.')), 'image/png'));
    } finally { bitmap.close(); }
  })());
  return imagensLimpas.get(blob)!;
}

/** Publica arquivos imutáveis antes do estado. Nenhum link assinado/publicamente acessível. */
export async function publicarSala(sala: Sala, publicacao: PublicacaoSala, escolha: EscolhaSala): Promise<number> {
  const visao: VisaoSala = JSON.parse(JSON.stringify(publicacao.visao));
  const refs = [...visao.jogadores.flatMap(j => [j.ficha, j.retrato]), ...(visao.combate?.imagens.map(m => m.retrato) ?? [])].filter(Boolean);
  let total = 0;
  for (const ref of refs) {
    if (!ref) continue;
    const original = publicacao.arquivos.get(ref.id);
    if (!original) throw new Error('Arquivo compartilhado não encontrado.');
    const blob = ref.nome === 'Retrato' ? await limparImagem(original) : original;
    total += blob.size;
    if (total > 100 * 1024 * 1024) throw new Error('Os arquivos selecionados excedem 100 MiB. Reduza o tamanho das fichas.');
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer()))).map(b => b.toString(16).padStart(2, '0')).join('');
    const caminho = `${sala.id}/${hash}`;
    if (!arquivosEnviados.has(caminho)) {
      const { error } = await obterCliente().storage.from('sala-arquivos').upload(caminho, blob, { contentType: blob.type || ref.mime, upsert: false });
      if (error && !(['409', '400'].includes(String((error as { statusCode?: string }).statusCode)) && /already exists|duplicate/i.test(error.message))) throw new Error('Não foi possível enviar um arquivo da sala.');
      arquivosEnviados.add(caminho);
    }
    ref.id = caminho; ref.mime = blob.type || ref.mime;
  }
  return rpc<number>('sala_publicar', { p_sala: sala.id, p_revisao: sala.revisao, p_visao: visao, p_escolha: escolha });
}

export function linkConvite(token: string): string { return `${window.location.origin}/sala#convite=${token}`; }
