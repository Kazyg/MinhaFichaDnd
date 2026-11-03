import { RepositorioCampanhas } from './contratos';
import { ErroPersistencia } from './erros';
import { CondicaoCombate, DadosCampanha } from './modelos';
import { validarDadosCampanha } from './validacao';
import { normalizarRoteirosCampanha } from './roteiros';
import { migrarExecucaoLegada, migrarOrigemSnapshot } from './execucaoCombate';

export const VERSAO_BACKUP_MESTRE = 6;
export const LIMITES_BACKUP = { arquivo: 64 * 1024 * 1024, total: 128 * 1024 * 1024, anexo: 20 * 1024 * 1024, manifesto: 4 * 1024 * 1024, entradas: 2048 } as const;
const FORMATO = 'MinhaFichaDnd/areaMestre';
const invalido = (mensagem = 'Backup inválido, incompleto ou corrompido.') => new ErroPersistencia('backup-invalido', mensagem);
const grande = () => new ErroPersistencia('arquivo-grande', 'O backup excede os limites de tamanho suportados.');

async function bytes(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === 'function') {
    try { return new Uint8Array(await blob.arrayBuffer()); }
    catch { throw invalido('Não foi possível ler o arquivo.'); }
  }
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(invalido('Não foi possível ler o arquivo.'));
    leitor.onabort = () => reject(invalido('A leitura do arquivo foi interrompida.'));
    leitor.onload = () => resolve(new Uint8Array(leitor.result as ArrayBuffer));
    leitor.readAsArrayBuffer(blob);
  });
}
async function hash(conteudo: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new ErroPersistencia('indisponivel', 'A verificação de integridade exige WebCrypto em contexto seguro.');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', conteudo);
  return Array.from(new Uint8Array(digest), v => v.toString(16).padStart(2, '0')).join('');
}


interface EntradaZip { tamanho: number; inicio: number; compactado: number; metodo: number; crc: number }
function inspecionarZip(conteudo: Uint8Array): Map<string, EntradaZip> {
  const v = new DataView(conteudo.buffer, conteudo.byteOffset, conteudo.byteLength);
  const n = conteudo.length;
  if (n < 22 || v.getUint32(n - 22, true) !== 0x06054b50) throw invalido();
  const fim = n - 22;
  if (v.getUint16(fim + 4, true) || v.getUint16(fim + 6, true) || v.getUint16(fim + 20, true)) throw invalido();
  const quantidade = v.getUint16(fim + 10, true);
  if (quantidade !== v.getUint16(fim + 8, true) || quantidade < 1) throw invalido();
  if (quantidade > LIMITES_BACKUP.entradas) throw grande();
  let pos = v.getUint32(fim + 16, true);
  if (pos + v.getUint32(fim + 12, true) !== fim) throw invalido();
  const inicioCentral = pos;
  const entradas = new Map<string, EntradaZip>();
  let total = 0;
  let fimLocal = 0;
  for (let i = 0; i < quantidade; i++) {
    if (pos + 46 > fim || v.getUint32(pos, true) !== 0x02014b50) throw invalido();
    const flags = v.getUint16(pos + 8, true), metodo = v.getUint16(pos + 10, true);
    const compactado = v.getUint32(pos + 20, true), tamanho = v.getUint32(pos + 24, true);
    const nomeTam = v.getUint16(pos + 28, true), extra = v.getUint16(pos + 30, true), comentario = v.getUint16(pos + 32, true);
    const local = v.getUint32(pos + 42, true);
    if ((flags & ~0x800) !== 0 || (metodo !== 0 && metodo !== 8) || v.getUint16(pos + 34, true) || extra || comentario || pos + 46 + nomeTam > fim) throw invalido();
    const nome = String.fromCharCode(...conteudo.subarray(pos + 46, pos + 46 + nomeTam));
    if (!(nome === 'manifesto.json' || /^anexos\/(0|[1-9]\d*)\.bin$/.test(nome)) || entradas.has(nome)) throw invalido();
    const limite = nome === 'manifesto.json' ? LIMITES_BACKUP.manifesto : LIMITES_BACKUP.anexo;
    total += tamanho;
    if (tamanho > limite || total > LIMITES_BACKUP.total) throw grande();
    if (local !== fimLocal || local + 30 > inicioCentral || v.getUint32(local, true) !== 0x04034b50) throw invalido();
    const nomeLocalTam = v.getUint16(local + 26, true), extraLocal = v.getUint16(local + 28, true);
    if (extraLocal || nomeLocalTam !== nomeTam || v.getUint16(local + 6, true) !== flags || v.getUint16(local + 8, true) !== metodo || v.getUint32(local + 18, true) !== compactado || v.getUint32(local + 22, true) !== tamanho || v.getUint32(local + 14, true) !== v.getUint32(pos + 16, true)) throw invalido();
    for (let j = 0; j < nomeTam; j++) if (conteudo[local + 30 + j] !== conteudo[pos + 46 + j]) throw invalido();
    fimLocal = local + 30 + nomeTam + compactado;
    if (fimLocal > inicioCentral) throw invalido();
    entradas.set(nome, { tamanho, inicio: local + 30 + nomeTam, compactado, metodo, crc: v.getUint32(pos + 16, true) });
    pos += 46 + nomeTam;
  }
  if (pos !== fim || fimLocal !== inicioCentral || !entradas.has('manifesto.json')) throw invalido();
  return entradas;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export async function exportarBackup(dados: DadosCampanha): Promise<Blob> {
  validarDadosCampanha(dados);

  dados = { ...JSON.parse(JSON.stringify(dados)), anexos: dados.anexos.map(a => ({ ...a })) };
  if (dados.anexos.length + 1 > LIMITES_BACKUP.entradas) throw grande();
  const { zipSync, strToU8 } = await import('fflate');
  const arquivos: Record<string, Uint8Array> = {};
  let total = 0;
  const anexos = [];
  for (let i = 0; i < dados.anexos.length; i++) {
    const { arquivo, ...metadados } = dados.anexos[i];
    if (arquivo.size > LIMITES_BACKUP.anexo) throw grande();
    total += arquivo.size;
    if (total > LIMITES_BACKUP.total) throw grande();
    const conteudo = await bytes(arquivo);
    const caminho = `anexos/${i}.bin`;
    arquivos[caminho] = conteudo;
    anexos.push({ ...metadados, caminho, tipoBinario: arquivo.type, sha256: await hash(conteudo) });
  }
  arquivos['manifesto.json'] = strToU8(JSON.stringify({ formato: FORMATO, versao: VERSAO_BACKUP_MESTRE, dados: { ...dados, anexos } }));
  if (arquivos['manifesto.json'].length > LIMITES_BACKUP.manifesto || total + arquivos['manifesto.json'].length > LIMITES_BACKUP.total) throw grande();
  const zip = zipSync(arquivos, { level: 0 });
  if (zip.length > LIMITES_BACKUP.arquivo) throw grande();
  return new Blob([zip], { type: 'application/zip' });
}

export async function lerBackup(arquivo: Blob): Promise<DadosCampanha> {
  try {
    if (!(arquivo instanceof Blob)) throw invalido();
    if (arquivo.size > LIMITES_BACKUP.arquivo) throw grande();
    const conteudo = await bytes(arquivo);
    const entradas = inspecionarZip(conteudo);
    const { Inflate, strFromU8 } = await import('fflate');
    const arquivos: Record<string, Uint8Array> = {};
    for (const [nome, entrada] of Array.from(entradas)) {
      const saida = new Uint8Array(entrada.tamanho);
      let escrito = 0;
      const receber = (parte: Uint8Array) => {
        if (escrito + parte.length > saida.length) throw invalido();
        saida.set(parte, escrito);
        escrito += parte.length;
      };
      const compactado = conteudo.subarray(entrada.inicio, entrada.inicio + entrada.compactado);
      if (entrada.metodo === 0) receber(compactado);
      else {

        const inflater = new Inflate(receber);
        for (let p = 0; p < compactado.length; p += 256) inflater.push(compactado.subarray(p, p + 256), p + 256 >= compactado.length);
      }
      if (escrito !== entrada.tamanho || crc32(saida) !== entrada.crc) throw invalido();
      arquivos[nome] = saida;
    }
    const manifesto = JSON.parse(strFromU8(arquivos['manifesto.json']));
    if (!manifesto || manifesto.formato !== FORMATO) throw invalido();
    if (![1, 2, 3, 4, 5, VERSAO_BACKUP_MESTRE].includes(manifesto.versao)) throw new ErroPersistencia('backup-incompativel', 'Versão de backup não suportada.');
    if (Object.keys(manifesto).sort().join(',') !== 'dados,formato,versao' || !manifesto.dados || !Array.isArray(manifesto.dados.anexos)) throw invalido();
    const usados = new Set(['manifesto.json']);
    const anexos = [];
    for (const anexo of manifesto.dados.anexos) {
      if (!anexo || typeof anexo !== 'object') throw invalido();
      const { caminho, sha256, tipoBinario, ...metadados } = anexo;
      if (typeof tipoBinario !== 'string' || tipoBinario.length > 255 || /[^\x20-\x7e]/.test(tipoBinario)) throw invalido();
      if (typeof caminho !== 'string' || !/^anexos\/(0|[1-9]\d*)\.bin$/.test(caminho) || usados.has(caminho) || !entradas.has(caminho) || typeof sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(sha256) || metadados.tamanho !== entradas.get(caminho)!.tamanho) throw invalido();
      const conteudoAnexo = arquivos[caminho];
      if (!conteudoAnexo || conteudoAnexo.length !== metadados.tamanho || await hash(conteudoAnexo) !== sha256) throw invalido();
      usados.add(caminho);
      anexos.push({ ...metadados, arquivo: new Blob([conteudoAnexo], { type: tipoBinario }) });
    }
    if (usados.size !== entradas.size) throw invalido();
    const dados: unknown = { ...manifesto.dados, anexos };
    validarDadosCampanha(dados);
    const normalizados = { ...dados, campanha: normalizarRoteirosCampanha(dados.campanha),
      combates: dados.combates.map(c => manifesto.versao < 4 ? migrarOrigemSnapshot(migrarExecucaoLegada(c, dados.participantes)) : c) };
    validarDadosCampanha(normalizados);
    return normalizados;
  } catch (erro) {
    if (erro instanceof ErroPersistencia && ['backup-invalido', 'backup-incompativel', 'arquivo-grande', 'indisponivel'].includes(erro.codigo)) throw erro;
    throw invalido();
  }
}


export async function restaurarBackup(arquivo: Blob, repositorio: Pick<RepositorioCampanhas, 'criar'>, gerarId: () => string = gerarIdSeguro): Promise<DadosCampanha> {
  const dados = await lerBackup(arquivo);
  const usados = new Set<string>();
  const idsInstancias = Array.from(new Set([...dados.instancias.map(i => i.id), ...dados.participantes.map(p => p.instanciaId)]));
  const idsFichas = Array.from(new Set([...dados.fichas.map(f => f.id), ...dados.combates.flatMap(c => c.historico?.participantes.flatMap(p => p.fichaOriginalId ? [p.fichaOriginalId] : []) ?? [])]));
  const idsCondicoes = Array.from(new Set(dados.combates.flatMap(c => [...(c.condicoes ?? []), ...(c.historico?.condicoes ?? [])].map(e => e.id))));
  const originais = new Set([...idsCondicoes, dados.campanha.id, ...(dados.campanha.roteiros ?? []).map(r => r.id), ...dados.anexos.map(a => a.id), ...idsFichas, ...idsInstancias, ...dados.combates.map(c => c.id), ...dados.participantes.map(p => p.id), ...dados.layout.paineis.map(p => p.id)]);
  const novo = () => {
    const id = gerarId();
    if (typeof id !== 'string' || !id.trim() || id.length > 200 || usados.has(id) || originais.has(id)) throw new ErroPersistencia('conflito', 'O gerador de identificadores produziu uma colisão.');
    usados.add(id);
    return id;
  };
  const mapa = (ids: string[]) => new Map(ids.map(id => [id, novo()]));
  const campanhaId = novo();
  const anexos = mapa(dados.anexos.map(a => a.id)), fichas = mapa(idsFichas), instancias = mapa(idsInstancias), combates = mapa(dados.combates.map(c => c.id)), participantes = mapa(dados.participantes.map(p => p.id));
  const condicoes = mapa(idsCondicoes);
  const remapearCondicoes = (lista: CondicaoCombate[]) => lista.map(e => ({ ...e, id: condicoes.get(e.id)!, campanhaId, combateId: combates.get(e.combateId)!, participanteId: participantes.get(e.participanteId)! }));
  const restaurados: DadosCampanha = {
    campanha: { ...dados.campanha, id: campanhaId, revisao: 0, ...(dados.campanha.roteiros === undefined ? {} : { roteiros: dados.campanha.roteiros.map(roteiro => ({ ...roteiro, id: novo() })) }) },
    anexos: dados.anexos.map(a => ({ ...a, id: anexos.get(a.id)!, campanhaId })),
    fichas: dados.fichas.map(f => ({ ...f, id: fichas.get(f.id)!, campanhaId, anexoId: anexos.get(f.anexoId)!, ...(f.pdfAnexoId === undefined ? {} : { pdfAnexoId: anexos.get(f.pdfAnexoId)! }), ...(f.imagemAnexoId === undefined ? {} : { imagemAnexoId: anexos.get(f.imagemAnexoId)! }) })),
    instancias: dados.instancias.map(i => ({ ...i, id: instancias.get(i.id)!, campanhaId, fichaOriginalId: i.fichaOriginalId === null ? null : fichas.get(i.fichaOriginalId)! })),
    combates: dados.combates.map(c => ({ ...c, id: combates.get(c.id)!, campanhaId, participanteAtivoId: c.participanteAtivoId === null ? null : participantes.get(c.participanteAtivoId)!,
      ...(c.condicoes === undefined ? {} : { condicoes: remapearCondicoes(c.condicoes) }),
      ...(c.historico ? { historico: { ...c.historico, ...(c.historico.condicoes === undefined ? {} : { condicoes: remapearCondicoes(c.historico.condicoes) }), participantes: c.historico.participantes.map(p => ({ ...p,
        participanteId: participantes.get(p.participanteId)!, instanciaId: instancias.get(p.instanciaId)!,
        fichaOriginalId: p.fichaOriginalId === null ? null : fichas.get(p.fichaOriginalId)! })) } } : {}),
      ...(c.execucao ? { execucao: { ...c.execucao, visitados: c.execucao.visitados.map(id => participantes.get(id)!),
        pvAtivacao: c.execucao.pvAtivacao.map(s => ({ ...s, participanteId: participantes.get(s.participanteId)!, instanciaId: instancias.get(s.instanciaId)! })) } } : {}) })),
    participantes: dados.participantes.map(p => ({ ...p, id: participantes.get(p.id)!, combateId: combates.get(p.combateId)!, instanciaId: instancias.get(p.instanciaId)! })),
    layout: { ...dados.layout, campanhaId, paineis: dados.layout.paineis.map(p => ({ ...p, id: novo() })) },
  };
  validarDadosCampanha(restaurados);
  await repositorio.criar(restaurados);
  return restaurados;
}

function gerarIdSeguro(): string {
  if (typeof globalThis.crypto?.randomUUID !== 'function') throw new ErroPersistencia('indisponivel', 'O navegador não oferece geração segura de identificadores.');
  return globalThis.crypto.randomUUID();
}

