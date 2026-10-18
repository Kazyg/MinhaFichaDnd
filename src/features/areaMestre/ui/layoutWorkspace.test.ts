import { aplicarGrade, completarLayout, criarLayoutPadrao, paraGrade } from './layoutWorkspace';

test('completa layout vazio e recupera coordenadas antigas em pixels', () => {
  const original = criarLayoutPadrao('campanha');
  original.paineis[0] = { ...original.paineis[0], x: 300, largura: 400, fechado: true };
  original.paineis.splice(1);
  const completo = completarLayout(original);
  expect(completo.paineis).toHaveLength(3);
  expect(completo.paineis[0]).toMatchObject({ x: 0, largura: 4, fechado: true });
});

test('preserva painéis extras, IDs antigos e cria IDs novos sem colisão', () => {
  const original = criarLayoutPadrao('a');
  original.paineis = [{ ...original.paineis[0], id: 'jogadores' }, { ...original.paineis[0], id: 'extra', tipo: 'pv' }, { ...original.paineis[0], id: 'repetido' }];
  const resultado = completarLayout(original);
  expect(resultado.paineis.map(p => p.id)).toEqual(['jogadores', 'extra', 'repetido', 'jogadores-1', 'roteiro']);
  expect(resultado.paineis[1].tipo).toBe('pv');
});

test('grade menor não modifica layout persistido e preserva altura recolhida', () => {
  const original = criarLayoutPadrao('campanha');
  original.paineis[0].recolhido = true;
  const antes = JSON.stringify(original);
  expect(paraGrade(original, 6).every(p => p.x + p.w <= 6)).toBe(true);
  expect(JSON.stringify(original)).toBe(antes);
  const atualizado = aplicarGrade(original, paraGrade(original));
  expect(atualizado.paineis[0].altura).toBe(10);
});

test('normaliza coordenadas malformadas e evita sobreposição pela biblioteca', () => {
  const original = criarLayoutPadrao('campanha');
  original.paineis.forEach(p => { p.x = -10; p.y = NaN; });
  const grade = paraGrade(completarLayout(original));
  expect(grade.map(p => p.y)).toEqual([0, 10, 20]);
  expect(grade.every(p => p.x >= 0 && Number.isFinite(p.y))).toBe(true);
});

test('normaliza larguras laterais ausentes e respeita limites', () => {
  const layout = criarLayoutPadrao('a');
  expect(layout).toMatchObject({ larguraSidebar: 260, larguraPV: 320 });
  delete layout.larguraSidebar;
  delete layout.larguraPV;
  expect(completarLayout(layout)).toMatchObject({ larguraSidebar: 260, larguraPV: 320 });
  expect(completarLayout({ ...layout, larguraSidebar: 1, larguraPV: 900 })).toMatchObject({ larguraSidebar: 200, larguraPV: 440 });
});
