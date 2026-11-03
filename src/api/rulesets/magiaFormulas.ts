import type { FormulaMagia, MagiaConteudo } from './types';

export function calcularFormulaMagia(dados: FormulaMagia, nivelMagia: number, circulo: number, nivelPersonagem: number, modificador?: number) {
  if (!Number.isInteger(circulo) || circulo < nivelMagia || circulo > 9 || (dados.modificador && modificador === undefined)) return null;
  const quantidade = dados.dadosBase + (nivelMagia === 0 ? (dados.niveisPersonagem ?? []).filter(n => nivelPersonagem >= n).length
    : Math.floor((circulo - nivelMagia) / (dados.intervaloCirculos ?? 1)) * (dados.dadosPorCirculo ?? 0));
  const bonus = (dados.bonusFixo ?? 0) + (dados.modificador ? modificador ?? 0 : 0);
  return `${quantidade}d${dados.dado}${bonus ? ` ${bonus >= 0 ? '+' : '−'} ${Math.abs(bonus)}` : ''}`;
}

export function calcularAlvosMagia(magia: MagiaConteudo, circulo: number, nivelPersonagem: number) {
  const alvos = magia.combate?.alvos;
  return alvos ? alvos.base + Math.max(0, circulo - magia.nivel) * (alvos.porCirculo ?? 0)
    + (alvos.niveisPersonagem ?? []).filter(n => nivelPersonagem >= n).length : null;
}
