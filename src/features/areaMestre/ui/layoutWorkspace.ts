import { Layout, verticalCompactor } from 'react-grid-layout';
import { LayoutCampanha, PainelLayout } from '../modelos';

export const nomesPaineis = { monstros: 'Monstros', jogadores: 'Jogadores', roteiro: 'Roteiro', pv: 'Pontos de vida' };
export function criarLayoutPadrao(campanhaId: string): LayoutCampanha {
  return { campanhaId, versao: 1, sidebarRecolhida: false, larguraSidebar: 260, larguraPV: 320, paineis: ['monstros', 'jogadores', 'roteiro'].map((tipo, i) => ({
    id: tipo, tipo: tipo as PainelLayout['tipo'], x: i * 4, y: 0, largura: 4, altura: 10, recolhido: false, fechado: false,
  })) };
}
const inteiro = (valor: number, minimo: number, maximo: number) => Math.max(minimo, Math.min(maximo, Number.isFinite(valor) ? Math.round(valor) : minimo));
export function completarLayout(layout: LayoutCampanha): LayoutCampanha {
  const padrao = criarLayoutPadrao(layout.campanhaId);
  const paineis = [...layout.paineis];
  padrao.paineis.forEach(base => {
    if (paineis.some(p => p.tipo === base.tipo)) return;
    let id = base.id;
    let sufixo = 1;
    const usados = new Set(paineis.map(p => p.id));
    while (usados.has(id)) id = `${base.id}-${sufixo++}`;
    paineis.push({ ...base, id });
  });
  return { ...layout, larguraSidebar: inteiro(layout.larguraSidebar ?? 260, 200, 400), larguraPV: inteiro(layout.larguraPV ?? 320, 240, 440), paineis: paineis.map(salvo => {
    const base = padrao.paineis.find(p => p.tipo === salvo.tipo) ?? { ...salvo, x: 0, y: 0, largura: 4, altura: 10 };

    if (salvo.largura > 12 || salvo.altura > 60 || salvo.x > 12 || salvo.y > 60) return { ...salvo, x: base.x, y: base.y, largura: base.largura, altura: base.altura };
    const largura = inteiro(salvo.largura, 3, 12);
    const altura = inteiro(salvo.altura, 3, 20);
    return { ...salvo, largura, altura, x: inteiro(salvo.x, 0, 12 - largura), y: inteiro(salvo.y, 0, 60 - altura) };
  }) };
}
export function paraGrade(layout: LayoutCampanha, cols = 12): Layout {
  return verticalCompactor.compact(layout.paineis.filter(p => !p.fechado).map(p => ({
    i: p.id, x: Math.min(cols - Math.min(cols, p.largura), p.x), y: p.y,
    w: Math.min(cols, p.largura), h: p.recolhido ? 2 : p.altura,
    minW: 3, minH: p.recolhido ? 2 : 3, maxH: 20, maxW: cols,
    isResizable: !p.recolhido,
  })), cols);
}
export function aplicarGrade(layout: LayoutCampanha, grade: Layout): LayoutCampanha {
  return completarLayout({ ...layout, paineis: layout.paineis.map(p => {
    const item = grade.find(g => g.i === p.id);
    return item ? { ...p, x: item.x, y: item.y, largura: item.w, altura: p.recolhido ? p.altura : item.h } : p;
  }) });
}

