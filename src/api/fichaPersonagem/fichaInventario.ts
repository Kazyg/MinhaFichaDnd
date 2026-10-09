import type { Ficha } from './FichaPersonagem';

// Keep the original graph in the exported document for recoverable legacy repair.
export function migrarInventario(ficha: Ficha, sintonizacaoLegada: boolean) {
  if (ficha.migracoes?.includes('F8-inventario-v1')) return;
  if (!ficha.ArmasMochila?.length && !ficha.ArmadurasMochila?.length && !ficha.itensMochila?.length && !ficha.ArmaEquipada?.length && !ficha.ArmaduraEquipada && !ficha.escudoEquipado && !ficha.itensEquipados?.length && !ficha.maosOcupadas) return;
  ficha.inventarioAnterior = JSON.parse(JSON.stringify({
    ArmasMochila: ficha.ArmasMochila, ArmadurasMochila: ficha.ArmadurasMochila,
    itensMochila: ficha.itensMochila, ArmaEquipada: ficha.ArmaEquipada,
    ArmaduraEquipada: ficha.ArmaduraEquipada, escudoEquipado: ficha.escudoEquipado,
    itensEquipados: ficha.itensEquipados, maosOcupadas: ficha.maosOcupadas,
    efeitos: ficha.efeitos, itensSintonizados: ficha.itensSintonizados,
  }));
  const repair = <T extends { id: string }>(items: T[] | null): T[] | null => {
    const ids = new Set<string>();
    return items?.map(item => {
      const next = { ...item };
      while (ids.has(next.id)) next.id = ficha.gerarIdUnico();
      ids.add(next.id); return next;
    }) ?? null;
  };
  ficha.ArmasMochila = repair(ficha.ArmasMochila);
  ficha.ArmadurasMochila = repair(ficha.ArmadurasMochila);
  ficha.itensMochila = repair(ficha.itensMochila);
  ficha.ArmaEquipada = ficha.ArmaEquipada?.map(a => ficha.ArmasMochila?.find(i => i.id === a.id)).filter((a, i, all) => a && all.indexOf(a) === i) as Ficha['ArmaEquipada'];
  ficha.ArmaEquipada ??= null;
  ficha.ArmaduraEquipada = ficha.ArmadurasMochila?.find(i => i.id === ficha.ArmaduraEquipada?.id) ?? null;
  ficha.escudoEquipado = ficha.ArmadurasMochila?.find(i => i.id === ficha.escudoEquipado?.id) ?? null;
  ficha.itensEquipados = ficha.itensEquipados?.map(a => ficha.itensMochila?.find(i => i.id === a.id)).filter((a, i, all) => a && all.indexOf(a) === i) as Ficha['itensEquipados'];
  ficha.itensEquipados ??= null;
  // Legacy Equipar also meant attunement; preserve that choice once.
  ficha.itensSintonizados = Array.from(new Set([...(ficha.itensSintonizados ?? []), ...(sintonizacaoLegada ? (ficha.itensEquipados ?? []).filter(i => i.sintonizavel).map(i => i.id) : [])]));
  ficha.itensSintonizados = ficha.itensSintonizados.filter(id => ficha.itensMochila?.some(i => i.id === id && i.sintonizavel));
  ficha.efeitos = ficha.efeitos?.filter(e => e.origemTipo !== 'item' || ficha.itensEquipados?.some(i => i.id === e.origemId)) ?? null;
  let maos = ficha.escudoEquipado ? 1 : 0;
  ficha.ArmaEquipada = ficha.ArmaEquipada?.filter(a => {
    const custo = ficha.maosDaArma(a);
    if (maos + custo > 2) return false;
    maos += custo; return true;
  }) ?? null;
  ficha.atualizarMaos();
  ficha.migracoes = [...(ficha.migracoes ?? []), 'F8-inventario-v1'];
}
