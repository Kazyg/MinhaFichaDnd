// Tables: SRD 5.1 / 5.2.1 and PHB arcane subclasses. See docs/auditoria-2026-10-06/F6-conjuracao.md.
export type EdicaoMagia = 'DND_2014' | 'DND_2024';
const completos = [
  [], [2], [3], [4,2], [4,3], [4,3,2], [4,3,3], [4,3,3,1], [4,3,3,2],
  [4,3,3,3,1], [4,3,3,3,2], [4,3,3,3,2,1], [4,3,3,3,2,1],
  [4,3,3,3,2,1,1], [4,3,3,3,2,1,1], [4,3,3,3,2,1,1,1], [4,3,3,3,2,1,1,1],
  [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1],
];
export const espacosCompletos = (nivel: number) => [...(completos[nivel] ?? [])];
export type ProgressaoMagia = 'completa' | 'meia' | 'terco' | 'pacto';
export function espacosDaFonte(nivel: number, progressao: ProgressaoMagia, edicao: EdicaoMagia): number[] {
  if (nivel < 1 || nivel > 20) return [];
  if (progressao === 'pacto') {
    const circulo = Math.min(5, Math.ceil(nivel / 2));
    return Array.from({ length: circulo }, (_, i) => i + 1 === circulo ? (nivel === 1 ? 1 : nivel < 11 ? 2 : nivel < 17 ? 3 : 4) : 0);
  }
  if (progressao === 'meia') return nivel === 1 && edicao === 'DND_2014' ? [] : espacosCompletos(Math.ceil(nivel / 2));
  if (progressao === 'terco') return nivel < 3 ? [] : espacosCompletos(Math.ceil(nivel / 3));
  return espacosCompletos(nivel);
}
const preparadas2024 = [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
const mago2024 = [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25];
const meia2024 = [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];
const pacto = [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];
const terco = [0,0,3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,11,12,13];
const bardo2014 = [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22];
const feiticeiro2014 = [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15];
export function limitesDaFonte(chave: string, nivel: number, edicao: EdicaoMagia, mod: number) {
  const arcana = ['guerreiro', 'ladino'].includes(chave);
  const meia = ['paladino', 'patrulheiro'].includes(chave);
  const baseTruques = ({ bardo: 2, bruxo: 2, clerigo: 3, druida: 2, feiticeiro: 4, mago: 3, guerreiro: 2, ladino: 3 } as Record<string, number>)[chave] ?? 0;
  const truques = baseTruques + (baseTruques && nivel >= 10 ? 1 : 0) + (baseTruques && !arcana && nivel >= 4 ? 1 : 0);
  let magias = 0;
  if (arcana) magias = terco[nivel - 1];
  else if (chave === 'bruxo') magias = pacto[nivel - 1];
  else if (edicao === 'DND_2024') magias = (meia ? meia2024 : chave === 'mago' ? mago2024 : preparadas2024)[nivel - 1];
  else if (chave === 'bardo') magias = bardo2014[nivel - 1];
  else if (chave === 'feiticeiro') magias = feiticeiro2014[nivel - 1];
  else if (chave === 'patrulheiro') magias = nivel < 2 ? 0 : Math.ceil(nivel / 2) + 1;
  else magias = Math.max(1, mod + (chave === 'paladino' ? Math.floor(nivel / 2) : nivel));
  if (edicao === 'DND_2024' && chave === 'feiticeiro' && nivel < 3) magias = nivel * 2;
  return { truques, magias, livroPorProgressao: chave === 'mago' ? 6 + 2 * (nivel - 1) : 0 };
}
