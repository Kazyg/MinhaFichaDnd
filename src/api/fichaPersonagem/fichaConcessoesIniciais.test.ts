import { Ficha } from './FichaPersonagem';
import { Acolito } from '../backGroundsFilhos/Acolito.class';
import { Eremita } from '../backGroundsFilhos/Eremita.class';
import { Itens } from '../../bibliotecas/Itens';
import { BackGround } from '../classesPrincipais/BackGrounds.class';
import { getRulesetData } from '../rulesets/getRulesetData';
import { exportFicha, parseImport } from './fichaStorage';
import { Anao } from '../classesFilhos/Anao.class';
import { Efeitos } from '../classesPrincipais/Efeitos';

const roundtrip = (f: Ficha) => parseImport(exportFicha(f));

test.each(['ferramentas de ferreiro', 'suprimentos de cervejeiro', 'ferramentas de pedreiro'])('proficiência do Anão não concede %s', ferramenta => {
  const f = new Ficha();
  f.setRacaPrincipal(new Anao());
  const e = new Efeitos();
  e.setProeficienciasRaca([ferramenta]);
  f.setEfeitos(e);
  expect(f.itensMochila ?? []).toHaveLength(0);
  expect(f.ouro).toBe(0);
});

test('Acólito: equipamentos, cinco incensos e 15 PO sem recipiente; seleção e JSON idempotentes', () => {
  let f = new Ficha();
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(15);
  expect(f.itensMochila?.filter(i => i.nome.toLowerCase() === 'varetas de incenso')).toHaveLength(5);
  expect(f.itensMochila?.some(i => /algibeira/i.test(i.nome))).toBe(false);
  expect(f.itensMochila?.some(i => /15.*po/i.test(i.nome))).toBe(false);
  expect(f.itensMochila).toHaveLength(9);
  expect(f.itensMochila?.map(i => i.nome.toLowerCase())).toEqual(expect.arrayContaining([
    'símbolo sagrado', 'livro de preces', 'vestimentas', 'conjunto de roupas comuns',
  ]));
  const ids = f.itensMochila?.map(i => i.id);
  f = roundtrip(f);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(15);
  expect(f.itensMochila?.map(i => i.id)).toEqual(ids);
});

test('troca remove somente instâncias concedidas e preserva progressão', () => {
  const f = new Ficha({ levelTotal: 7, talentos: ['teste'] });
  const manual = new Itens('livro de preces', 'comum', 0, 0, 'common', false, '');
  f.setItemMochila(manual);
  f.setBackGround(new Acolito());
  const antigo = f.concessoesIniciais!.instancias.map(i => i.id);
  f.setBackGround(new Eremita());
  expect(f.itensMochila?.some(i => i.id === manual.id)).toBe(true);
  expect(f.itensMochila?.some(i => antigo.includes(i.id))).toBe(false);
  expect(f.ouro).toBe(5);
  expect(f.levelTotal).toBe(7);
  expect(f.talentos).toEqual(['teste']);
});

test('gastos não são recuperados alternando backgrounds; receitas manuais persistem', () => {
  let f = new Ficha({ ouro: 100 });
  f.setBackGround(new Acolito());
  f.adicionarOuro(-12);
  f.adicionarOuro(8);
  f = roundtrip(f);
  f.setBackGround(new Eremita());
  expect(f.ouro).toBe(108);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(111);
  f.setBackGround(new Eremita());
  expect(f.ouro).toBe(108);
});

test('saldo de concessão já creditada sem histórico não é sobrescrito', () => {
  const f = new Ficha();
  f.setBackGround(new Acolito());
  f.ouro = 2;
  f.setBackGround(new Eremita());
  expect(f.ouro).toBe(2);
  expect(f.concessoesIniciais?.revisao).toBeTruthy();
});

test('seleção explícita de Acólito salvo credita 15 PO uma vez, preservando saldo e itens', () => {
  const manual = new Itens('Algibeira', 'comum', 0, 0, 'common', false, '');
  let f = roundtrip(new Ficha({ backGround: new Acolito(), ouro: 9, itensMochila: [manual] }));
  expect(f.ouro).toBe(9);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(24);
  expect(f.itensMochila?.map(i => i.id)).toEqual([manual.id]);
  f = roundtrip(f);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(24);
  f.adicionarOuro(-12);
  f.setBackGround(new Eremita());
  expect(f.ouro).toBe(9);
});

test('registro legado bloqueado pela implementação anterior recebe crédito na próxima seleção', () => {
  let f = new Ficha({ backGround: new Acolito(), concessoesIniciais: {
    origem: 'background:DND_2014:acolito', assinatura: '', instancias: [],
    restante: { ouro: 0, prata: 0, cobre: 0 }, gasto: { ouro: 0, prata: 0, cobre: 0 }, saldo: { ouro: 0, prata: 0, cobre: 0 },
    revisao: 'Ficha antiga sem origem das concessões. Inventário e moedas anteriores preservados; revise com a mesa.',
  } });
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(15);
  expect(f.concessoesIniciais?.revisao).toBeUndefined();
  f = roundtrip(f);
  f.setBackGround(new Acolito());
  expect(f.ouro).toBe(15);
});

test('2024 concede sua lista ou 50 PO, nunca as duas alternativas', () => {
  const b = getRulesetData('DND_2024').backgroundsOuOrigens.find(b => b.nome === 'Acólito')!;
  const f = new Ficha({ versaoRegras: 'DND_2024' });
  f.setBackGround(b);
  expect(f.ouro).toBe(8);
  expect(f.itensMochila?.some(i => /incenso/i.test(i.nome))).toBe(false);
  f.setBackGround(Object.assign(Object.create(Object.getPrototypeOf(b)), b, { escolhaEquipamento: 'dinheiro' }));
  expect(f.ouro).toBe(50);
  expect(f.itensMochila).toHaveLength(0);
  f.setBackGround(f.backGround);
  expect(f.ouro).toBe(50);
});

test('armas e armaduras usam modelos e instâncias distintas; outras moedas são estruturadas', () => {
  const b = new BackGround('teste', [], 0, ['2 Adagas', 'Acolchoada', '3 PP', '4 PC'], [], { nome: '', descricao: '' });
  const f = new Ficha();
  f.setBackGround(b);
  expect(f.ArmasMochila).toHaveLength(2);
  expect(new Set(f.ArmasMochila?.map(a => a.id)).size).toBe(2);
  expect(f.ArmasMochila?.[0].dano).toBeDefined();
  expect(f.ArmadurasMochila?.[0].ac).toBe(11);
  expect(f.prata).toBe(3);
  expect(f.cobre).toBe(4);
  f.adicionarPrata(-2);
  f.setBackGround(null);
  expect(f.prata).toBe(0);
  expect(f.cobre).toBe(0);
});

test('remover item concedido e reselecionar não restaura objetos consumidos', () => {
  const f = new Ficha();
  f.setBackGround(new Acolito());
  f.excluirItem(f.itensMochila![0].id);
  const ids = f.itensMochila?.map(i => i.id);
  f.setBackGround(new Acolito());
  expect(f.itensMochila?.map(i => i.id)).toEqual(ids);
});

test('troca preserva saldo negativo preexistente sem apagar operações manuais', () => {
  const f = new Ficha();
  f.setBackGround(new Acolito());
  f.adicionarOuro(-20);
  f.setBackGround(new Eremita());
  expect(f.ouro).toBe(-5);
  expect(f.concessoesIniciais?.revisao).toBeTruthy();
});

test('importação rejeita quantidade excessiva e moeda negativa em concessões', () => {
  const f = new Ficha();
  f.setBackGround(new Acolito());
  f.backGround!.equipamentoInicial!.itens[0].quantidade = 100000;
  expect(() => roundtrip(f)).toThrow();
  f.backGround!.equipamentoInicial!.itens[0].quantidade = 1;
  f.backGround!.equipamentoInicial!.moedas.ouro = -1;
  expect(() => roundtrip(f)).toThrow();
});
