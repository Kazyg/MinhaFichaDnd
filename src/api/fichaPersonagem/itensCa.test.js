import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { selecionarArma, selecionarCA } from './fichaSeletores';
import { calcularBonusMagiaPorClasse, calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { exportFicha, parseImport, hydrateFicha, serializeCollection } from './fichaStorage';
import AbaItens from '../../pages/components/components_inventario/AbaItens';
import InformacoesPersonagem from '../../pages/components/InformacoesPersonagem';

let mockFicha;
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn(), refreshKey: 0 }) }));
const arma = { id: 'espada', nome: 'Espada', categoria: 'Armas Marciais', dano_atributo: ['Força'], dano: { dano_1: '1d8', dano_2: '' } };
const efeito = dados => Object.assign(new Efeitos(), dados);
const item = (id, dados = {}) => ({ id, nome: id, descricao: '', sintonizavel: false, ...dados });
const ficha = () => new Ficha({ id: 'teste', nomePersonagem: 'Teste', levelTotal: 1, atributosPersonagem: new Atributos(14, 16, 14, 14, 14, 14) });
const reabrir = f => parseImport(exportFicha(f));

test('ataque +1 descrito: equipar, reequipar, JSON, armazenamento local, desequipar e excluir', () => {
  let f = ficha(); const i = item('luvas', { descricao: 'Você ganha um bônus de +1 nas jogadas de ataque com arma.' });
  f.setItemMochila(i);
  const base = selecionarArma(f, arma).ataque;
  f.setEquiparItem(i); f.setEquiparItem(i);
  expect(selecionarArma(f, arma).ataque).toBe(base + 1);
  f = reabrir(f);
  f = hydrateFicha(JSON.parse(serializeCollection([f], f.id)).data[0]);
  expect(selecionarArma(f, arma).ataque).toBe(base + 1);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(0);
  f.setDesequiparItem(i.id); expect(selecionarArma(f, arma).ataque).toBe(base);
  f.setEquiparItem(f.itensMochila[0]); f.excluirItem(i.id);
  expect(selecionarArma(f, arma).ataque).toBe(base);
});

test('bônus explícitos respeitam arma, categoria e classe de magia após importar', () => {
  let f = ficha(); const i = item('foco', { efeitosExplicitos: [
    efeito({ tipoEfeito: 'ataque_arma', bonus: 1, armaId: 'espada' }),
    efeito({ tipoEfeito: 'dano_arma', bonus: 2, armaCategoria: 'Armas Marciais' }),
    efeito({ tipoEfeito: 'ataque_magia', bonus: 1, classeNome: 'mago' }),
    efeito({ tipoEfeito: 'cd_magia', bonus: 2, classeNome: 'mago' }),
  ] });
  f.setItemMochila(i); f.setEquiparItem(i); f = reabrir(f);
  expect(selecionarArma(f, arma)).toMatchObject({ ataque: 3, formula: '1d8 +4' });
  expect(selecionarArma(f, { ...arma, id: 'adaga', categoria: 'Armas Simples' })).toMatchObject({ ataque: 2, formula: '1d8 +2' });
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(1);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'mago')).toBe(2);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'bruxo')).toBe(0);
});

test('sintonização, contador, limite, dessintonizar e desequipar', () => {
  let f = ficha();
  const itens = Array.from({ length: 4 }, (_, n) => item(`anel${n}`, { sintonizavel: true, descricao: 'Você ganha +2 em Força' }));
  itens.forEach(i => { f.setItemMochila(i); f.setEquiparItem(i); });
  expect(f.getItensSintonizadosEquipados()).toHaveLength(0);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(14);
  itens.slice(0, 3).forEach(i => expect(f.setSintonizarItem(i.id, true)).toBe(true));
  expect(f.setSintonizarItem(itens[3].id, true)).toBe(false);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(20);
  f = reabrir(f); expect(calcularValorAtributoFinal(f, 'forca')).toBe(20);
  f.setSintonizarItem(itens[0].id, false);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(18);
  expect(f.itensEquipados).toHaveLength(4);
  f.setDesequiparItem(itens[1].id);
  expect(f.getItensSintonizadosEquipados()).toHaveLength(1);
  f.setEquiparItem(f.itensMochila[1]);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(16);
});

test.each([
  ['Acolchoada', 'Armadura Leve', 11, 16, 18, 'Acolchoada 11 + 3 + 4'],
  ['Peitoral', 'Armadura Média', 14, 16, 20, 'Peitoral 14 + 2 + 4'],
  ['Placas', 'Armadura Pesada', 18, 16, 22, 'Placas 18 + 4'],
  ['Couro', 'Armadura Leve', 11, 8, 14, 'Couro 11 - 1 + 4'],
])('CA %s usa as mesmas parcelas na expressão e no total', (nome, categoria, ac, destreza, total, expressao) => {
  const f = ficha(); f.atributosPersonagem.destreza.valor = destreza;
  f.ArmaduraEquipada = { id: 'armadura', nome, categoria, ac };
  f.escudoEquipado = { id: 'escudo', nome: 'Escudo', categoria: 'Escudos', ac: 2 };
  f.setEfeitos(efeito({ tipoEfeito: 'estilo_defesa', bonus: 1 }));
  const i = item('Proteção', { descricao: 'Você recebe um bônus de +1 na CA.' });
  f.setItemMochila(i); f.setEquiparItem(i);
  expect(selecionarCA(f)).toMatchObject({ total, expressao });
  expect(selecionarCA(f).tooltip).toContain('Armadura equipada');
  f.setDesequiparItem(i.id); expect(selecionarCA(f).total).toBe(total - 1);
});

test('CA sem armadura e manual, sem parcelas zero', () => {
  const f = ficha(); f.atributosPersonagem.destreza.valor = 10;
  expect(selecionarCA(f)).toMatchObject({ total: 10, expressao: 'Sem armadura 10' });
  f.classeArmadura = 17;
  expect(selecionarCA(f)).toMatchObject({ total: 17, expressao: 'CA manual 17' });
});

test('UI alterna os estados do botão e apresenta CA compacta com tooltip', () => {
  mockFicha = ficha(); const i = item('anel', { sintonizavel: true }); mockFicha.setItemMochila(i);
  const view = render(<><AbaItens setModalItemAberto={() => {}} /><InformacoesPersonagem /></>);
  fireEvent.click(screen.getByRole('button', { name: 'Equipar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Sintonizar' }));
  view.rerender(<><AbaItens setModalItemAberto={() => {}} /><InformacoesPersonagem /></>);
  expect(screen.getByRole('button', { name: 'Dessintonizar' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Sintonizados: 1/3')).toBeInTheDocument();
  expect(screen.getByText('Sem armadura 10 + 3')).toHaveAttribute('title', expect.stringContaining('Destreza (+3)'));
  fireEvent.click(screen.getByRole('button', { name: 'Dessintonizar' }));
  view.rerender(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.getByRole('button', { name: 'Sintonizar' })).toHaveAttribute('aria-pressed', 'false');
});


test('atualizar a descricao recalcula o efeito sem acumular valores antigos', () => {
  let f = ficha(); const i = item('luvas', { descricao: 'Bonus de +1 nas jogadas de ataque com arma.' });
  f.setItemMochila(i); f.setEquiparItem(i); f = reabrir(f);
  f.itensMochila[0].descricao = 'Bonus de +2 nas jogadas de ataque com arma.';
  f.setEquiparItem(f.itensMochila[0]);
  expect(selecionarArma(f, arma).ataque).toBe(4);
  expect(f.efeitos.filter(e => e.origemTipo === 'item')).toHaveLength(1);
});


test('ataque e dano compartilhados na descricao afetam somente armas', () => {
  const f = ficha(); const i = item('luvas', { descricao: 'Bonus de +1 nas jogadas de ataque e de dano com armas.' });
  f.setItemMochila(i); f.setEquiparItem(i);
  expect(selecionarArma(f, arma)).toMatchObject({ ataque: 3, formula: '1d8 +3' });
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(0);
});

test('descricao de ataque e CD de magia compartilhados respeita a classe', () => {
  const f = ficha(); const i = item('foco', { descricao: 'Bonus de +1 nas jogadas de ataque com feiticos e nas CDs dos testes de resistencia de seus feiticos de mago.' });
  f.setItemMochila(i); f.setEquiparItem(i);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(1);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'mago')).toBe(1);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'bruxo')).toBe(0);
});
