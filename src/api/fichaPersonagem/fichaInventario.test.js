import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { exportFicha, parseImport, hydrateFicha, persist, serializeCollection, STORAGE_KEY } from './fichaStorage';
import { extrairEfeitosDoItem, calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { recuperarEspacos } from './fichaRecursos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { chaveClasse } from '../rulesets/progressao';
import { selecionarPoolsMagia } from './fichaConjuracao';
import AbaMagias from '../../pages/components/components_inventario/AbaMagias';
import InformacoesPersonagem from '../../pages/components/InformacoesPersonagem';
import AbaItens from '../../pages/components/components_inventario/AbaItens';

let mockFicha;
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn(), refreshKey: 0 }) }));
const roundtrip = f => parseImport(exportFicha(f));
const arma = (id, propriedades = '') => ({ id, nome: id, propriedades, dano: { dano_1: '1d6', dano_2: '' } });
const armadura = (id, categoria = 'Escudos') => ({ id, nome: id, categoria, ac: 2 });
const item = (id, descricao = 'Your strength score increases by 2') => ({ id, nome: id, descricao, sintonizavel: true });

test.each(['DND_2014', 'DND_2024'])('equipar, trocar, excluir e reabrir %s', versaoRegras => {
  let f = new Ficha({ versaoRegras });
  const a = arma('espada'), b = arma('arco', 'Duas Mãos');
  const s1 = armadura('escudo1'), s2 = armadura('escudo2'), c = armadura('couro', 'Armadura Leve');
  f.setArmaMochila(a); f.setArmaMochila(b);
  [s1, s2, c].forEach(e => f.setArmaduraMochila(e));
  expect(f.setEquiparArma(a)).toBe(true);
  expect(f.setEscudoEquipado(s1)).toBe(true);
  expect(f.setEscudoEquipado(s2)).toBe(true);
  expect(f.getMaosOcupadas()).toBe(2);
  expect(f.setEquiparArma(b)).toBe(false);
  f.setArmaduraEquipada(c);
  f = roundtrip(f);
  expect(f.escudoEquipado.id).toBe(s2.id);
  expect(f.getMaosOcupadas()).toBe(2);
  f.excluirArmaduraMochila(s2.id); f.excluirArmaMochila(a.id); f.excluirArmaduraMochila(c.id);
  f = roundtrip(f);
  expect(f.ArmaEquipada).toEqual([]); expect(f.escudoEquipado).toBeNull(); expect(f.ArmaduraEquipada).toBeNull();
  expect(f.getMaosOcupadas()).toBe(0);
  expect(f.setEquiparArma(f.ArmasMochila[0])).toBe(true);
  expect(f.getMaosOcupadas()).toBe(2);
});

test('cópias do catálogo têm IDs locais distintos e estáveis', () => {
  const f = new Ficha(); const a = arma('catalogo');
  f.setArmaMochila(a); f.setArmaMochila(a);
  expect(new Set(f.ArmasMochila.map(i => i.id)).size).toBe(2);
  expect(a.id).toBe('catalogo');
  expect(roundtrip(f).ArmasMochila.map(i => i.id)).toEqual(f.ArmasMochila.map(i => i.id));
});

test('sintonizar é independente de equipar e sobrevive ao JSON', () => {
  let f = new Ficha(); const i = item('anel'); f.setItemMochila(i); f.setEquiparItem(i);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(10);
  f = roundtrip(f); expect(f.itensSintonizados).toEqual([]);
  expect(f.setSintonizarItem(i.id, true)).toBe(true);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(12);
  f.setDesequiparItem(i.id); expect(f.itensSintonizados).toEqual([i.id]);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(10);
  f = roundtrip(f); f.setEquiparItem(f.itensMochila[0]);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(12);
  f.setSintonizarItem(i.id, false); expect(calcularValorAtributoFinal(f, 'forca')).toBe(10);
  f.excluirItem(i.id); expect(f.itensSintonizados).toEqual([]); expect(f.itensEquipados).toEqual([]);
});

test('migração conserva originais, remove órfãos e não repete', () => {
  const i = item('anel'); const a = arma('espada');
  const raw = { id: 'legado', nomePersonagem: 'Legado', versaoRegras: 'DND_2024', itensMochila: [i], itensEquipados: [i], ArmasMochila: [a, a], ArmaEquipada: [a, arma('ausente')], maosOcupadas: 9 };
  const f = hydrateFicha(raw);
  expect(f.inventarioAnterior.ArmaEquipada).toHaveLength(2);
  expect(f.ArmaEquipada).toHaveLength(1); expect(f.maosOcupadas).toBe(1);
  expect(f.itensSintonizados).toEqual(['anel']);
  expect(roundtrip(f).inventarioAnterior).toEqual(f.inventarioAnterior);
  expect(roundtrip(f).versaoRegras).toBe('DND_2024');
});

test('backup F8 não verificado impede sobrescrever coleção', () => {
  const raw = JSON.stringify([{ id: 'f', nomePersonagem: 'F', maosOcupadas: 4 }]);
  const next = serializeCollection([hydrateFicha(JSON.parse(raw)[0])], 'f');
  const storage = { getItem: jest.fn(key => key === STORAGE_KEY ? raw : null), setItem: jest.fn() };
  expect(() => persist(storage, raw, next)).toThrow(/backup F8/);
  expect(storage.setItem).not.toHaveBeenCalledWith(STORAGE_KEY, next);
});

test.each(['Your strength score increases by 2', 'Você ganha +2 em Força', 'bônus de +2 na força'])('parser: %s', descricao => {
  expect(extrairEfeitosDoItem(item('i', descricao))).toEqual(expect.arrayContaining([expect.objectContaining({ atributo: 'forca', bonus: 2 })]));
});
test.each(['Your intelligence score is 19', 'Seu valor de Inteligência muda para 19'])('atributo fixo: %s', descricao => {
  expect(extrairEfeitosDoItem(item('i', descricao))).toEqual(expect.arrayContaining([expect.objectContaining({ atributo: 'inteligencia', valorFixo: 19 })]));
});
test('nomes e ataques locais não viram benefícios globais; explícitos prevalecem', () => {
  expect(extrairEfeitosDoItem(item('+3 weapon', 'bônus de +3 nas jogadas de ataque e de dano'))).toEqual([]);
  expect(extrairEfeitosDoItem(item('+2 armor', ''))).toEqual([]);
  expect(extrairEfeitosDoItem({ ...item('i'), efeitosExplicitos: [] })).toEqual([]);
});

function conjurador(edicao) {
  const f = new Ficha({ versaoRegras: edicao, levelTotal: 4 });
  f.multiclasses = ['mago', 'bruxo'].map((key, i) => ({ id: key, classe: getRulesetData(edicao).classes.find(c => chaveClasse(c) === key), nivelClasse: 2, nivelEscolhido: [i * 2 + 1, i * 2 + 2] }));
  f.classePrincipal = f.multiclasses[0].classe;
  return f;
}
test.each(['DND_2014', 'DND_2024'])('consumo persistente e recuperação específica %s', edicao => {
  let f = conjurador(edicao);
  const pacto = selecionarPoolsMagia(f).find(p => p.id.startsWith('pacto:')).id;
  f.recursos.slots = { 'conjuracao:0': 2, [pacto]: 1, desconhecido: 8 };
  f.recursos.morte = { sucessos: 1, falhas: 2 }; f.vidaAtual = 3; f.vidaTemporaria = 7;
  f.levelTotal = 1; f = roundtrip(f); f.levelTotal = 4;
  expect(f.recursos.slots[pacto]).toBe(1);
  f.multiclasses[1].nivelEscolhido.push(5); f.multiclasses[1].nivelClasse = 3; f.levelTotal = 5;
  f = roundtrip(f);
  expect(selecionarPoolsMagia(f).find(p => p.id === pacto).espacos[1]).toBe(2);
  expect(f.recursos.slots[pacto]).toBe(1);
  recuperarEspacos(f, 'curto');
  expect(f.recursos.slots).toEqual({ 'conjuracao:0': 2, [pacto]: 0, desconhecido: 8 });
  expect(f.vidaAtual).toBe(3); expect(f.vidaTemporaria).toBe(7);
  recuperarEspacos(f, 'longo'); expect(f.recursos.slots['conjuracao:0']).toBe(0);
  expect(f.recursos.morte).toEqual({ sucessos: 1, falhas: 2 });
});
test('abas de slots e morte conservam marcações após desmontar e importar', () => {
  mockFicha = conjurador('DND_2024');
  let view = render(<AbaMagias />);
  const label = 'Conjuração, círculo 1, espaço 1';
  fireEvent.click(screen.getByRole('button', { name: label })); view.unmount();
  mockFicha = roundtrip(mockFicha); view = render(<AbaMagias />);
  expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true'); view.unmount();
  view = render(<InformacoesPersonagem />);
  fireEvent.click(screen.getByRole('button', { name: 'Falha de morte 2' })); view.unmount();
  mockFicha = roundtrip(mockFicha); view = render(<InformacoesPersonagem />);
  expect(screen.getByRole('button', { name: 'Falha de morte 2' })).toHaveAttribute('aria-pressed', 'true');
});
test('interface permite sintonizar sem equipar', () => {
  mockFicha = new Ficha(); mockFicha.setItemMochila(item('anel'));
  const view = render(<AbaItens setModalItemAberto={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Sintonizar' }));
  view.rerender(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.getByRole('button', { name: 'Encerrar sintonização' })).toBeInTheDocument();
  expect(mockFicha.itensEquipados).toBeNull();
});

test('Restaurar Vida não recupera slots nem outros recursos', () => {
  mockFicha = conjurador('DND_2014'); mockFicha.vidaAtual = 1; mockFicha.vidaTotal = 20;
  mockFicha.recursos.slots['conjuracao:0'] = 2;
  mockFicha.vidaTemporaria = 5;
  render(<InformacoesPersonagem />);
  fireEvent.click(screen.getByRole('button', { name: 'Ajustar vida' }));
  fireEvent.click(screen.getByRole('button', { name: 'Restaurar Vida' }));
  expect(mockFicha.vidaAtual).toBe(20);
  expect(mockFicha.recursos.slots['conjuracao:0']).toBe(2);
  expect(mockFicha.vidaTemporaria).toBe(5);
});
test('recursos inválidos são rejeitados antes de importar', () => {
  expect(() => hydrateFicha({ id: 'f', nomePersonagem: 'F', recursos: { slots: { x: -1 }, morte: { sucessos: 0, falhas: 0 } } })).toThrow(/recursos/);
});
