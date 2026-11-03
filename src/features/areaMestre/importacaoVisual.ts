import { AnexoCampanha, FichaOriginal } from './modelos';
import { prepararImportacao } from './importacao';

export interface ImportacaoConfirmada { ficha: FichaOriginal; anexos: AnexoCampanha[] }


export function detectarPvTexto(texto: string): number | null {
  if ((texto.match(/(?:pontos\s+de\s+vida|hit\s+points|pv\s+m[aá]ximos)/gi) ?? []).length !== 1) return null;
  const encontrados = Array.from(texto.matchAll(/(?:pontos\s+de\s+vida|hit\s+points|pv\s+m[aá]ximos)\s*[:：]?\s*(\d+)\b(?![\d.,/]|\s*\/)/gi));
  if (encontrados.length !== 1) return null;
  const valor = Number(encontrados[0][1]);
  return Number.isSafeInteger(valor) && valor >= 0 ? valor : null;
}

export function detectarNomeTexto(texto: string): string | null {
  const encontrados = Array.from(texto.matchAll(/(?:^|\n)\s*(?:nome|name)\s*[:：]\s*([^\r\n]{1,200})/gi));
  if (encontrados.length !== 1) return null;
  const nome = encontrados[0][1].trim();
  return nome && !Array.from(nome).some(letra => letra.charCodeAt(0) < 32) ? nome : null;
}

export function confirmarMetadados(resultado: ImportacaoConfirmada, nome: string, maximos: string, atuais: string): ImportacaoConfirmada {
  if (!nome.trim()) throw new Error('Informe o nome da ficha.');
  const inteiro = (texto: string) => /^\d+$/.test(texto) && Number.isSafeInteger(Number(texto));
  if (!inteiro(maximos) || !inteiro(atuais)) throw new Error('Informe PV inteiros não negativos dentro do limite numérico.');
  if (Number(atuais) > Number(maximos)) throw new Error('Os PV atuais não podem superar os máximos.');
  return { ...resultado, ficha: { ...resultado.ficha, nome: nome.trim(), pvIniciais: { atuais: Number(atuais), maximos: Number(maximos) } } };
}

export async function prepararRetrato(arquivo: File, campanhaId: string): Promise<AnexoCampanha> {
  const resultado = await prepararImportacao(arquivo, {
    campanhaId, fichaId: crypto.randomUUID(), anexoId: crypto.randomUUID(), categoria: 'monstro', importadoEm: new Date().toISOString(),
  });
  if (resultado.ficha.formato !== 'imagem') throw new Error('O retrato deve ser uma imagem PNG, JPEG, GIF ou WebP.');
  return resultado.anexo;
}
