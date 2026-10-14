import { getRulesetData } from './getRulesetData';
import { equipamentoBackground } from './equipamentoBackground';
import { estruturarEquipamentos } from '../classesPrincipais/concessoesEquipamento';
import { Ficha } from '../fichaPersonagem/FichaPersonagem';
import { exportFicha, parseImport } from '../fichaPersonagem/fichaStorage';
import { Acolito } from '../backGroundsFilhos/Acolito.class';
import { Itens } from '../../bibliotecas/Itens';

const ouro2014 = [10, 15, 15, 15, 0, 15, 15, 5, 20, 10, 25, 20, 10, 10, 0, 10];
const ouro2024 = [8, 16, 32, 11, 15, 16, 16, 23, 30, 12, 3, 20, 22, 29, 8, 14];

test.each(['DND_2014', 'DND_2024'] as const)('todos os backgrounds %s têm dados estruturados independentes', versao => {
  const backgrounds = getRulesetData(versao).backgroundsOuOrigens;
  expect(backgrounds).toHaveLength(16);
  const valores = versao === 'DND_2014' ? ouro2014 : ouro2024;
  backgrounds.forEach((b, index) => {
    const dados = equipamentoBackground(versao, b.nome)!;
    expect(dados).toBeDefined();
    expect(b.equipamentoInicial).toEqual(dados);
    expect(dados.moedas).toEqual({ ouro: valores[index], prata: 0, cobre: 0 });
    expect(dados.itens.some(i => /(?:contendo|com).*\b(?:po|moedas)\b/i.test(i.nome))).toBe(false);
    const f = new Ficha({ versaoRegras: versao });
    f.setBackGround(b);
    expect(f.ouro).toBe(valores[index]);
  });
});

test.each(getRulesetData('DND_2014').backgroundsOuOrigens)('$nome 2014 não oferece alternativa em dinheiro nem recipiente de moedas', b => {
  const dados = equipamentoBackground('DND_2014', b.nome)!;
  const f = new Ficha({ versaoRegras: 'DND_2014' });
  f.setBackGround(b);
  expect(dados.alternativa).toBeUndefined();
  expect(f.itensMochila?.some(i => /algibeira/i.test(i.nome)) ?? false).toBe(false);
});

test.each(getRulesetData('DND_2024').backgroundsOuOrigens)('$nome 2024 permite trocar equipamento por 50 peças de ouro', b => {
  const dados = equipamentoBackground('DND_2024', b.nome)!;
  const f = new Ficha({ versaoRegras: 'DND_2024' });
  f.setBackGround(b);
  expect(dados.alternativa).toEqual({ ouro: 50, prata: 0, cobre: 0 });
  f.setBackGround({ ...b, escolhaEquipamento: 'dinheiro' });
  expect(f.ouro).toBe(50);
  expect(f.itensMochila ?? []).toHaveLength(0);
  expect(f.ArmasMochila ?? []).toHaveLength(0);
});

test.each([
  ['Algibeira contendo 15 po', { ouro: 15, prata: 0, cobre: 0 }],
  ['Bolsa com 10 peças de ouro', { ouro: 10, prata: 0, cobre: 0 }],
  ['Uma algibeira contendo moedas', { ouro: 0, prata: 0, cobre: 0 }],
  ['Uma bolsa contendo 7 peças de prata', { ouro: 0, prata: 7, cobre: 0 }],
  ['algibeira com 4 pc', { ouro: 0, prata: 0, cobre: 4 }],
] as const)('adaptador separa dinheiro e recipiente: %s', (descricao, moedas) => {
  expect(estruturarEquipamentos([descricao])).toEqual({ itens: [], moedas });
});

test('recipientes independentes e recipientes com outros objetos continuam físicos', () => {
  const dados = estruturarEquipamentos(['Bolsa', 'Mochila', '2 Algibeiras', 'Bolsa com pedras', 'Algibeira contendo 15 PO']);
  expect(dados.itens).toEqual([
    { nome: 'Bolsa', quantidade: 1 }, { nome: 'Mochila', quantidade: 1 },
    { nome: 'Algibeiras', quantidade: 2 }, { nome: 'Bolsa com pedras', quantidade: 1 },
  ]);
  expect(dados.moedas.ouro).toBe(15);
});

test.each(['Andarilho', 'Artesão', 'Criminoso', 'Mercador'])('%s 2024 mantém duas algibeiras físicas', nome => {
  const b = getRulesetData('DND_2024').backgroundsOuOrigens.find(b => b.nome === nome)!;
  let f = new Ficha({ versaoRegras: 'DND_2024' });
  f.setBackGround(b);
  expect(f.itensMochila?.filter(i => /algibeira/i.test(i.nome))).toHaveLength(2);
  const ids = f.itensMochila?.map(i => i.id);
  f = parseImport(exportFicha(f));
  f.setBackGround(b);
  expect(f.itensMochila?.map(i => i.id)).toEqual(ids);
});

test('quantidades e comprimentos são preservados sem inventar valores ambíguos', () => {
  expect(equipamentoBackground('DND_2014', 'Pirata Bêbado')!.itens[0].quantidade).toBe(2);
  expect(equipamentoBackground('DND_2014', 'marinheiro')!.itens[1]).toEqual({ nome: '15 metros de corda de seda', quantidade: 1 });
  expect(equipamentoBackground('DND_2024', 'Acólito')!.itens.find(i => i.nome === 'Pergaminho')!.quantidade).toBe(10);
  expect(equipamentoBackground('DND_2024', 'Eremita')!.itens.find(i => i.nome === 'Óleo')!.quantidade).toBe(3);
  expect(equipamentoBackground('DND_2014', 'Membro da Guilda dos Ladrões das Sombras')!.itens.find(i => /5 a 9/.test(i.nome))).toBeDefined();
});

test('reabrir concessão anterior preserva recipientes; nova seleção remove apenas o automático', () => {
  const anterior = new Acolito();
  anterior.equipamentoInicial!.itens.push({ nome: 'Algibeira', quantidade: 1 });
  let f = new Ficha();
  const manual = new Itens('Algibeira', 'comum', 0, 0, 'common', false, '');
  f.setItemMochila(manual);
  f.setBackGround(anterior);
  f.adicionarOuro(-4);
  f = parseImport(exportFicha(f));
  expect(f.itensMochila?.filter(i => /algibeira/i.test(i.nome))).toHaveLength(2);
  f.setBackGround(new Acolito());
  expect(f.itensMochila?.filter(i => /algibeira/i.test(i.nome))).toHaveLength(1);
  expect(f.itensMochila?.some(i => i.id === manual.id)).toBe(true);
  expect(f.ouro).toBe(11);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(11);
});
