import { avaliarMulticlasse, requisitosMulticlasse } from './progressao';

const atributos = (valor = 13) => Object.fromEntries(['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map(a => [a, valor]));
test.each(Object.keys(requisitosMulticlasse))('%s respeita limite 12/13 e informa requisitos por classe', classe => {
  const negado = avaliarMulticlasse([classe === 'mago' ? 'bardo' : 'mago'], classe, atributos(12), 'DND_2024');
  expect(negado.permitido).toBe(false);
  expect(negado.ausentes.length).toBeGreaterThan(0);
  expect(avaliarMulticlasse([classe === 'bardo' ? 'mago' : 'bardo'], classe, atributos(), 'DND_2024').permitido).toBe(true);
});
test('valida todas as classes antes de adicionar uma quarta', () => {
  const valores = { ...atributos(), sabedoria: 12 };
  const resultado = avaliarMulticlasse(['mago', 'druida', 'bardo'], 'ladino', valores, 'DND_2024');
  expect(resultado.permitido).toBe(false);
  expect(resultado.ausentes.map(r => r.classe)).toEqual(['druida']);
  expect(resultado.atendidos.map(r => r.classe)).toEqual(['mago', 'bardo', 'ladino']);
  valores.sabedoria = 13;
  expect(avaliarMulticlasse(['mago', 'druida', 'bardo'], 'ladino', valores, 'DND_2024').permitido).toBe(true);
});
test.each(['DND_2014', 'DND_2024'])('primeira classe e classe existente dispensam requisitos: %s', edicao => {
  expect(avaliarMulticlasse([], 'mago', atributos(8), edicao).permitido).toBe(true);
  expect(avaliarMulticlasse(['mago', 'bardo'], 'bardo', atributos(8), edicao).permitido).toBe(true);
});
