import { buscarMagiaConteudo, resolverConteudo, referenciaConteudo } from './conteudo';
import { calcularFormulaMagia, calcularAlvosMagia } from './magiaFormulas';
import type { RulesetVersion } from './types';

test.each<RulesetVersion>(['DND_2014','DND_2024'])('Mísseis Mágicos %s: dano por dardo, acerto automático e escalonamento', edicao => {
  const magia = buscarMagiaConteudo(edicao,'Mísseis Mágicos')!;
  expect(magia.combate?.ataque).toBeUndefined();
  expect(magia.combate?.resistencia).toBeUndefined();
  expect(magia.combate?.propriedades).toContain('Acerto automático');
  expect(calcularFormulaMagia(magia.combate!.dano!,1,1,4,5)).toBe('1d4 + 1');
  expect(calcularFormulaMagia(magia.combate!.dano!,1,9,20,-2)).toBe('1d4 + 1');
  expect(calcularAlvosMagia(magia,1,4)).toBe(3);
  expect(calcularAlvosMagia(magia,3,4)).toBe(5);
});

test.each<RulesetVersion>(['DND_2014','DND_2024'])('Rajada Mística %s aumenta feixes, sem multiplicar o dano de cada feixe', edicao => {
  const m = buscarMagiaConteudo(edicao,edicao === 'DND_2014' ? 'Rajada Mística' : 'Raio Místico')!;
  for (const [nivel,feixes] of [[1,1],[5,2],[11,3],[17,4]]) {
    expect(calcularFormulaMagia(m.combate!.dano!,0,0,nivel,4)).toBe('1d10');
    expect(calcularAlvosMagia(m,0,nivel)).toBe(feixes);
  }
});

test('diferenças de dado, ataque, resistência e concentração entre edições', () => {
  const antiga = buscarMagiaConteudo('DND_2014','Toque Arrepiante')!;
  const nova = buscarMagiaConteudo('DND_2024','Toque Necrótico')!;
  expect(antiga.combate).toMatchObject({ ataque:'distancia', dano:{ dado:8 } });
  expect(nova.combate).toMatchObject({ ataque:'corpo-a-corpo', dano:{ dado:10 } });
  expect(buscarMagiaConteudo('DND_2014','Rajada de Veneno')!.combate).toMatchObject({ resistencia:'Constituição' });
  expect(buscarMagiaConteudo('DND_2024','Rajada de Veneno')!.combate).toMatchObject({ ataque:'distancia' });
  expect(buscarMagiaConteudo('DND_2024','Rajada de Veneno')!.combate?.resistencia).toBeUndefined();
  expect(buscarMagiaConteudo('DND_2014','Arma Espiritual')!.concentracao).toBe(false);
  expect(buscarMagiaConteudo('DND_2024','Arma Espiritual')!.concentracao).toBe(true);
  expect(buscarMagiaConteudo('DND_2014','Círculo da Morte')!.combate?.dano?.dado).toBe(6);
  expect(buscarMagiaConteudo('DND_2024','Círculo da Morte')!.combate?.dano?.dado).toBe(8);
});

test.each<RulesetVersion>(['DND_2014','DND_2024'])('cura e escalonamento intervalado %s usam apenas os modificadores permitidos', edicao => {
  const cura = buscarMagiaConteudo(edicao,'Palavra Curativa')!;
  expect(calcularFormulaMagia(cura.combate!.cura!,1,2,4,3)).toBe(edicao === 'DND_2014' ? '2d4 + 3' : '4d4 + 3');
  expect(calcularFormulaMagia(cura.combate!.cura!,1,1,4)).toBeNull();
  const arma = buscarMagiaConteudo(edicao,'Arma Espiritual')!;
  expect(calcularFormulaMagia(arma.combate!.dano!,2,3,6,3)).toBe(edicao === 'DND_2014' ? '1d8 + 3' : '2d8 + 3');
  const bola = buscarMagiaConteudo(edicao,'Bola de Fogo')!;
  expect(calcularFormulaMagia(bola.combate!.dano!,3,5,9,10)).toBe('10d6');
});

test('lacunas ambíguas não são oferecidas; dados históricos e referências desconhecidas são preservados', () => {
  expect(buscarMagiaConteudo('DND_2014','Lago')!.selecionavel).toBe(false);
  expect(buscarMagiaConteudo('DND_2014','Ralo de osso')!.selecionavel).toBe(false);
  expect(buscarMagiaConteudo('DND_2024','Lago')).toBeUndefined();
  const m = buscarMagiaConteudo('DND_2014','Mísseis Mágicos')!;
  expect(resolverConteudo({ ...referenciaConteudo(m), revisao:'futura' })).toBeUndefined();
  expect(resolverConteudo({ ...referenciaConteudo(m), revisao:'legado-local-1' })).toBeDefined();
  expect(buscarMagiaConteudo('DND_2014','Amizade animal')!.descricao).not.toBe('Descrição legada indisponível.');
});
