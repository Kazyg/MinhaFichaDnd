export function estadosSlots(slots: Record<string, number>, chave: string, total: number): boolean[] {
  const usados = Math.max(0, slots[chave] ?? 0);
  const prefixo = `${chave}:icone:`;
  const indices = Object.keys(slots).filter(k => k.startsWith(prefixo)).map(k => Number(k.slice(prefixo.length))).filter(n => Number.isInteger(n) && n >= 0);
  const tamanho = Math.max(total, usados, ...indices.map(n => n + 1));
  const marcados = Array.from({ length: tamanho }, (_, i) => slots[`${prefixo}${i}`] === 1);
  return marcados.filter(Boolean).length === usados ? marcados : marcados.map((_, i) => i < usados);
}

export function alternarSlot(slots: Record<string, number>, chave: string, total: number, indice: number) {
  if (indice < 0 || indice >= total) return;
  const estados = estadosSlots(slots, chave, total);
  slots[chave] = Math.max(0, (slots[chave] ?? 0) + (estados[indice] ? -1 : 1));
  estados[indice] = !estados[indice];
  estados.forEach((gasto, i) => { slots[`${chave}:icone:${i}`] = gasto ? 1 : 0; });
}
