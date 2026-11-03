import { MAX_INPUT_BYTES, parseJSON, validateFicha } from '../../api/fichaPersonagem/fichaStorage';
import { selecionarNiveis, selecionarVida } from '../../api/fichaPersonagem/fichaSeletores';
import { ErroAreaMestre, validarId } from './dominio';
import { AnexoCampanha, AvisoImportacao, CategoriaFicha, FichaOriginal, FormatoFicha, PontosVida } from './modelos';

export const MAX_ANEXO_BYTES = 20 * 1024 * 1024;
const tipos: Record<string, { formato: FormatoFicha; mime: string }> = {
  json: { formato: 'json', mime: 'application/json' },
  pdf: { formato: 'pdf', mime: 'application/pdf' },
  png: { formato: 'imagem', mime: 'image/png' },
  jpg: { formato: 'imagem', mime: 'image/jpeg' },
  jpeg: { formato: 'imagem', mime: 'image/jpeg' },
  webp: { formato: 'imagem', mime: 'image/webp' },
  gif: { formato: 'imagem', mime: 'image/gif' },
};
const objeto = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const pvValido = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;

export interface MetadadosJson {
  nome: string | null;
  pv: PontosVida;
  origemPV: FichaOriginal['origemPV'];
  origem: NonNullable<FichaOriginal['origemJson']>;
  avisos: AvisoImportacao[];
}


export function interpretarFichaJson(texto: string): MetadadosJson {
  try {
    const valor: unknown = parseJSON(texto);
    let dados: unknown = valor;
    const envelope = objeto(valor) && ('format' in valor || 'version' in valor);
    if (envelope) {
      if (valor.format !== 'minhafichadnd' || valor.version !== 1 || valor.kind !== 'ficha') throw new Error('Envelope não suportado.');
      dados = valor.data;
    }
    validateFicha(dados);
    const avisos: AvisoImportacao[] = [];
    const nome = typeof dados.nomePersonagem === 'string' && dados.nomePersonagem.trim() ? dados.nomePersonagem.trim() : null;
    if (!nome) avisos.push('nome-ausente');
    let pv: PontosVida = { atuais: 0, maximos: 0 };
    let origemPV: FichaOriginal['origemPV'] = 'manual-pendente';
    let maximo = pvValido(dados.vidaTotal) ? dados.vidaTotal : null;


    if (dados.vidaTotal == null && Number.isSafeInteger(dados.levelTotal) && dados.levelTotal! >= 1 && dados.levelTotal! <= 20 &&
      Number.isSafeInteger(dados.atributosPersonagem?.constituicao?.valor) && dados.atributosPersonagem!.constituicao.valor >= 1 && dados.atributosPersonagem!.constituicao.valor <= 30) {
      const niveis = selecionarNiveis(dados);
      if (niveis.length && niveis.every(n => [6,8,10,12].includes(n.classe?.dadosVida ?? 0))) {

        const snapshot = { ...dados, versaoRegras: dados.versaoRegras ?? 'DND_2014' } as typeof dados;
        const calculado = selecionarVida(snapshot);
        if (!calculado.ausentes.length && pvValido(calculado.total)) maximo = calculado.total;
      }
    }
    if (maximo !== null) {
      origemPV = 'json';
      const atuais = pvValido(dados.vidaAtual) && dados.vidaAtual <= maximo ? dados.vidaAtual : 0;
      pv = { atuais, maximos: maximo };
      if (atuais !== dados.vidaAtual) avisos.push('pv-atuais-nao-identificados');
    } else avisos.push('pv-nao-identificados');
    return { nome, pv, origemPV, avisos, origem: { id: dados.id, versaoRegras: dados.versaoRegras ?? 'DND_2014', envelope } };
  } catch {
    throw new ErroAreaMestre('json-invalido', 'JSON inválido ou incompatível com uma ficha do MinhaFichaDnd.');
  }
}

export interface ContextoImportacao {
  campanhaId: string;
  fichaId: string;
  anexoId: string;
  categoria: CategoriaFicha;
  importadoEm: string;
}
export interface ResultadoImportacao { ficha: FichaOriginal; anexo: AnexoCampanha }

function ler(arquivo: Blob, modo: 'texto'): Promise<string>;
function ler(arquivo: Blob, modo: 'bytes'): Promise<ArrayBuffer>;
function ler(arquivo: Blob, modo: 'texto' | 'bytes'): Promise<string | ArrayBuffer> {

  const falha = () => { throw new ErroAreaMestre('leitura-falhou', 'Não foi possível ler o arquivo.'); };
  if (modo === 'texto' && typeof arquivo.text === 'function') return arquivo.text().catch(falha);
  if (modo === 'bytes' && typeof arquivo.arrayBuffer === 'function') return arquivo.arrayBuffer().catch(falha);
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = leitor.onabort = () => reject(new ErroAreaMestre('leitura-falhou', 'Não foi possível ler o arquivo.'));
    leitor.onload = () => {
      if (leitor.result === null) reject(new ErroAreaMestre('leitura-falhou', 'Arquivo sem conteúdo legível.'));
      else resolve(leitor.result);
    };
    if (modo === 'texto') leitor.readAsText(arquivo);
    else leitor.readAsArrayBuffer(arquivo);
  });
}

function conferirAssinatura(bytes: Uint8Array, mime: string): boolean {
  const comeca = (...valores: number[]) => valores.every((v, i) => bytes[i] === v);
  const trecho = (inicio: number, fim: number) => String.fromCharCode(...Array.from(bytes.slice(inicio, fim)));
  switch (mime) {
    case 'application/pdf': return trecho(0, 5) === '%PDF-';
    case 'image/png': return comeca(137, 80, 78, 71, 13, 10, 26, 10);
    case 'image/jpeg': return comeca(255, 216, 255);
    case 'image/gif': return ['GIF87a', 'GIF89a'].includes(trecho(0, 6));
    case 'image/webp': return trecho(0, 4) === 'RIFF' && trecho(8, 12) === 'WEBP';
    default: return false;
  }
}


export async function prepararImportacao(arquivo: File, contexto: ContextoImportacao): Promise<ResultadoImportacao> {
  [contexto.campanhaId, contexto.fichaId, contexto.anexoId].forEach(validarId);
  if (!['jogador', 'monstro'].includes(contexto.categoria) || !Number.isFinite(Date.parse(contexto.importadoEm))) {
    throw new ErroAreaMestre('dados-invalidos', 'Categoria ou data de importação inválida.');
  }
  const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? '';
  const tipo = Object.prototype.hasOwnProperty.call(tipos, extensao) ? tipos[extensao] : undefined;
  if (!tipo || (tipo.formato === 'json' && contexto.categoria !== 'jogador') ||
    (arquivo.type && arquivo.type !== tipo.mime && arquivo.type !== 'application/octet-stream')) {
    throw new ErroAreaMestre('formato-nao-suportado', 'Use PDF ou imagem (PNG, JPEG, GIF, WebP); jogadores também aceitam JSON.');
  }
  if (!arquivo.size) throw new ErroAreaMestre('arquivo-vazio', 'O arquivo está vazio.');
  const limite = tipo.formato === 'json' ? MAX_INPUT_BYTES : MAX_ANEXO_BYTES;
  if (arquivo.size > limite) throw new ErroAreaMestre('arquivo-grande', `O arquivo excede o limite de ${limite / 1024 / 1024} MiB.`);
  let metadados: MetadadosJson | undefined;
  if (tipo.formato === 'json') metadados = interpretarFichaJson(await ler(arquivo, 'texto'));
  else if (!conferirAssinatura(new Uint8Array(await ler(arquivo.slice(0, 12), 'bytes')), tipo.mime)) {
    throw new ErroAreaMestre('formato-nao-suportado', 'O conteúdo não corresponde ao formato do arquivo.');
  }
  return {
    ficha: {
      id: contexto.fichaId, campanhaId: contexto.campanhaId, categoria: contexto.categoria,
      formato: tipo.formato, anexoId: contexto.anexoId,
      ...(tipo.formato === 'imagem' ? { imagemAnexoId: contexto.anexoId } : {}),
      nome: metadados?.nome ?? arquivo.name.replace(/\.[^.]+$/, ''),
      pvIniciais: metadados?.pv ?? { atuais: 0, maximos: 0 },
      origemPV: metadados?.origemPV ?? 'manual-pendente',
      ...(metadados ? { origemJson: metadados.origem } : {}),
      avisos: metadados?.avisos ?? ['pv-nao-identificados', 'extracao-manual'],
      importadoEm: contexto.importadoEm,
    },
    anexo: { id: contexto.anexoId, campanhaId: contexto.campanhaId, nome: arquivo.name, mime: tipo.mime, tamanho: arquivo.size, arquivo },
  };
}
