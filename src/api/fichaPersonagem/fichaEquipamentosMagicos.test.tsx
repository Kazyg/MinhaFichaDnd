import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { armas } from '../equipamentos/Armas';
import { armaduras_equip } from '../equipamentos/Armaduras';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { Itens, itens } from '../../bibliotecas/Itens';
import { selecionarArma, selecionarCA } from './fichaSeletores';
import { exportFicha, parseImport, serializeCollection, parseCollection, hydrateFicha } from './fichaStorage';
import { itemEstaEquipado, itemMagicoVinculado, nomeEquipamentoMagico, restaurarEquipamentosMagicos } from './fichaEquipamentosMagicos';
import AbaArmas from '../../pages/components/components_inventario/AbaArmas';
import AbaArmaduras from '../../pages/components/components_inventario/AbaArmaduras';
import AbaItens from '../../pages/components/components_inventario/AbaItens';

let mockFicha: Ficha;
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn(), refreshKey: 0 }) }));
const ficha = (versaoRegras: 'DND_2014' | 'DND_2024' = 'DND_2014') => new Ficha({ id: 'teste', nomePersonagem: 'Teste', versaoRegras, levelTotal: 1, atributosPersonagem: new Atributos(14, 16, 14, 14, 14, 14) });
const arma = (f: Ficha, nome = 'Adaga') => { f.setArmaMochila(armas.find(a => a.nome === nome)!); return f.ArmasMochila!.slice(-1)[0]; };
const armadura = (f: Ficha, nome = 'Couro') => { f.setArmaduraMochila(armaduras_equip.find(a => a.nome === nome)!); return f.ArmadurasMochila!.slice(-1)[0]; };
const item = (f: Ficha, nome = '+1 Weapon') => { f.setItemMochila(itens.find(i => i.nomeIngles === nome)!); return f.itensMochila!.slice(-1)[0]; };
const reabrir = (f: Ficha) => parseImport(exportFicha(f));

test.each(['DND_2014', 'DND_2024'] as const)('Adaga +1 tem ataque e dano locais; nome não muda a base em %s', edicao => {
  const f = ficha(edicao), adaga = arma(f), espada = arma(f, 'Espada Longa'), melhoria = item(f);
  const antes = selecionarArma(f, adaga), outra = selecionarArma(f, espada);
  expect(melhoria.sintonizavel).toBe(false);
  expect(f.vincularItemMagico(melhoria.id, 'arma', adaga.id)).toBe(true);
  expect(nomeEquipamentoMagico(f, 'arma', adaga)).toBe('Adaga +1');
  expect(adaga.nome).toBe('Adaga');
  expect(selecionarArma(f, adaga)).toMatchObject({ ataque: antes.ataque + 1, formula: '1d4 +4' });
  expect(selecionarArma(f, espada)).toEqual(outra);
  expect(f.desvincularItemMagico(melhoria.id)).toBe(true);
  expect(selecionarArma(f, adaga)).toEqual(antes);
});

test('instâncias iguais são distintas; não reutiliza item nem acumula melhorias', () => {
  const f = ficha(), adaga = arma(f), espada = arma(f, 'Espada Longa');
  const a = item(f), b = item(f);
  expect(a.id).not.toBe(b.id);
  expect(f.vincularItemMagico(a.id, 'arma', adaga.id)).toBe(true);
  expect(f.vincularItemMagico(a.id, 'arma', espada.id)).toBe(false);
  expect(f.vincularItemMagico(b.id, 'arma', adaga.id)).toBe(false);
  expect(f.vincularItemMagico(b.id, 'arma', espada.id)).toBe(true);
  expect(selecionarArma(f, adaga).ataque).toBe(4);
  expect(selecionarArma(f, espada).ataque).toBe(3);
  f.desvincularItemMagico(a.id); f.desvincularItemMagico(b.id);
  expect(f.vincularItemMagico(a.id, 'arma', espada.id)).toBe(true);
});

test('equipar/desequipar pelas duas abas usa o estado do equipamento e mantém o vínculo', () => {
  const f = ficha(), a = arma(f), i = item(f);
  f.vincularItemMagico(i.id, 'arma', a.id);
  expect(f.setEquiparArma(a)).toBe(true);
  expect(itemEstaEquipado(f, i)).toBe(true);
  expect(f.itensEquipados?.map(i => i.id)).toEqual([i.id]);
  f.setDesequiparItem(i.id);
  expect(f.ArmaEquipada).toEqual([]);
  expect(i.vinculoEquipamento?.id).toBe(a.id);
  expect(f.setEquiparItem(i)).toBe(true);
  expect(f.ArmaEquipada?.map(a => a.id)).toEqual([a.id]);
  f.setDesequiparArma(a.id);
  expect(f.itensEquipados).toEqual([]);
  expect(i.vinculoEquipamento?.id).toBe(a.id);
});

test('item sem vínculo não concede bônus; mãos ocupadas não permitem estado contraditório', () => {
  const f = ficha(), a = arma(f, 'Espada Longa'), b = arma(f, 'Arco Longo'), i = item(f);
  const antes = selecionarArma(f, a);
  expect(f.setEquiparItem(i)).toBe(false);
  expect(selecionarArma(f, a)).toEqual(antes);
  f.vincularItemMagico(i.id, 'arma', a.id); f.setEquiparArma(b);
  expect(f.setEquiparItem(i)).toBe(false);
  expect(itemEstaEquipado(f, i)).toBe(false);
});

test('Sword of Answering cria exatamente uma representação permanente baseada na espada longa', () => {
  let f = ficha(); const i = item(f, 'Sword of Answering');
  const a = f.ArmasMochila![0], base = armas.find(a => a.nome === 'Espada Longa')!;
  expect(a).toMatchObject({ nome: i.nome, dano: base.dano, propriedades: base.propriedades, categoria: base.categoria });
  const id = a.id;
  expect(i.vinculoEquipamento).toEqual({ tipo: 'arma', id });
  const melhoria = item(f);
  expect(f.vincularItemMagico(melhoria.id, 'arma', a.id)).toBe(false);
  expect(f.desvincularItemMagico(i.id)).toBe(false);
  for (let n = 0; n < 3; n++) {
    f.setEquiparItem(f.itensMochila![0]); f = reabrir(f); restaurarEquipamentosMagicos(f);
    expect(f.ArmasMochila).toHaveLength(1);
    expect(f.ArmasMochila![0].id).toBe(id);
  }
});

test('Sword of Answering aplica +3 equipada e sintonizada sem bloquear requisitos narrativos', () => {
  const f = ficha(), i = item(f, 'Sword of Answering'), a = f.ArmasMochila![0];
  const base = selecionarArma(f, a);
  f.setEquiparItem(i);
  expect(selecionarArma(f, a)).toEqual(base);
  expect(f.setSintonizarItem(i.id, true)).toBe(true);
  expect(selecionarArma(f, a)).toMatchObject({ ataque: base.ataque + 3, formula: '1d8 +5' });
  f.setSintonizarItem(i.id, false);
  expect(selecionarArma(f, a)).toEqual(base);
  f.setSintonizarItem(i.id, true);
  f.setDesequiparArma(a.id);
  expect(f.itensSintonizados).toEqual([]);
  expect(selecionarArma(f, a)).toEqual(base);
  expect(i.vinculoEquipamento?.id).toBe(a.id);
});

test.each([1, 2, 3])('Armadura +%s aplica somente CA na armadura associada', bonus => {
  const f = ficha(), a = armadura(f), outra = armadura(f, 'Placas'), i = item(f, `+${bonus} Armor`), adaga = arma(f);
  const ataque = selecionarArma(f, adaga);
  expect(f.vincularItemMagico(i.id, 'arma', adaga.id)).toBe(false);
  expect(f.vincularItemMagico(i.id, 'armadura', a.id)).toBe(true);
  f.setArmaduraEquipada(a);
  expect(selecionarCA(f).total).toBe(14 + bonus);
  expect(selecionarCA(f).tooltip).toContain(i.nome);
  expect(selecionarArma(f, adaga)).toEqual(ataque);
  f.setArmaduraEquipada(outra);
  expect(selecionarCA(f).total).toBe(18);
  expect(itemEstaEquipado(f, i)).toBe(false);
  f.setEquiparItem(i);
  expect(f.ArmaduraEquipada?.id).toBe(a.id);
});

test.each(['DND_2014', 'DND_2024'] as const)('escudo mágico mantém o bônus normal e exige treino em 2024 (%s)', edicao => {
  const f = ficha(edicao), s = armadura(f, 'Escudo'), couro = armadura(f), i = item(f, '+1 Shield (*)');
  expect(f.vincularItemMagico(i.id, 'armadura', couro.id)).toBe(false);
  expect(f.vincularItemMagico(i.id, 'armadura', s.id)).toBe(true);
  f.setEscudoEquipado(s);
  expect(selecionarCA(f).total).toBe(edicao === 'DND_2014' ? 16 : 13);
  f.setEfeitos(Object.assign(new Efeitos(), { proeficienciasClasse: ['Escudos'] }));
  expect(selecionarCA(f).total).toBe(16);
  f.setDesequiparItem(i.id); expect(f.escudoEquipado).toBeNull();
});

test('excluir item remove só sua melhoria; excluir arma comum conserva item genérico', () => {
  const f = ficha(), a = arma(f), i = item(f);
  f.vincularItemMagico(i.id, 'arma', a.id); f.setEquiparArma(a);
  f.excluirItem(i.id);
  expect(f.ArmasMochila).toHaveLength(1);
  expect(nomeEquipamentoMagico(f, 'arma', a)).toBe('Adaga');
  const b = item(f); f.vincularItemMagico(b.id, 'arma', a.id); f.excluirArmaMochila(a.id);
  expect(f.itensMochila).toHaveLength(1);
  expect(b.vinculoEquipamento).toBeUndefined(); expect(f.itensEquipados).toEqual([]);
});

test.each(['item', 'arma'])('excluir %s da arma especial não deixa representação órfã', origem => {
  const f = ficha(), i = item(f, 'Sword of Answering'), a = f.ArmasMochila![0];
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  if (origem === 'item') f.excluirItem(i.id); else f.excluirArmaMochila(a.id);
  expect(f.ArmasMochila).toEqual([]); expect(f.itensMochila).toEqual([]);
  expect(f.ArmaEquipada).toEqual([]); expect(f.itensSintonizados).toEqual([]);
});

test('JSON e armazenamento preservam IDs e vínculos sem duplicar efeitos', () => {
  let f = ficha(), a = arma(f), i = item(f), s = item(f, 'Sword of Answering');
  f.vincularItemMagico(i.id, 'arma', a.id); f.setEquiparArma(a);
  f.setEquiparItem(s); f.setSintonizarItem(s.id, true);
  const ids = f.ArmasMochila!.map(a => a.id);
  for (let n = 0; n < 3; n++) {
    f = reabrir(f); f = parseCollection(serializeCollection([f], f.id)).fichas[0];
    expect(f.ArmasMochila!.map(a => a.id)).toEqual(ids);
    expect(selecionarArma(f, f.ArmasMochila![0]).ataque).toBe(4);
    expect(selecionarArma(f, f.ArmasMochila![1]).ataque).toBe(5);
    expect(f.efeitos?.filter(e => ['ataque_arma', 'dano_arma'].includes(e.tipoEfeito)) ?? []).toEqual([]);
  }
});

test('modelo reutilizável admite arma especial sem bônus numérico e bloqueia melhoria', () => {
  const f = ficha();
  f.setItemMochila(new Itens('Adaga do luar', 'Arma', 0, 1, 'rare', false, '', undefined, { tipo: 'arma', modo: 'especifico', baseNome: 'Adaga', exigeSintonizacao: false, propriedadesEspeciais: ['Emite luz.'] }));
  const a = f.ArmasMochila![0], i = item(f);
  f.setEquiparArma(a);
  expect(selecionarArma(f, a).ataque).toBe(3);
  expect(f.vincularItemMagico(i.id, 'arma', a.id)).toBe(false);
  const comum = arma(f); comum.magica = true;
  expect(f.vincularItemMagico(i.id, 'arma', comum.id)).toBe(false);
});

test('legado recebe metadados; importação limpa vínculos duplicados e preserva equipamentos', () => {
  const f = ficha(), a = arma(f), i = item(f), j = item(f);
  const raw = JSON.parse(exportFicha(f)).data;
  delete raw.itensMochila[0].equipamentoMagico;
  raw.itensMochila.forEach((i: Itens) => { i.vinculoEquipamento = { tipo: 'arma', id: a.id }; });
  const restored = hydrateFicha(raw);
  expect(restored.itensMochila![0].equipamentoMagico?.bonusAtaque).toBe(1);
  expect(restored.itensMochila!.filter(i => i.vinculoEquipamento)).toHaveLength(1);
  expect(restored.ArmasMochila).toHaveLength(1);
  expect(itemMagicoVinculado(restored, 'arma', a.id)?.id).toBe(i.id);
  expect(restored.itensMochila!.find(i => i.id === j.id)?.vinculoEquipamento).toBeUndefined();
});

test('interface associa e remove melhoria, sincroniza abas e não mostra controles sem itens', () => {
  mockFicha = ficha(); const a = arma(mockFicha);
  const view = render(<AbaArmas setModalAberto={() => {}} />);
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  const i = item(mockFicha);
  view.rerender(<AbaArmas setModalAberto={() => {}} />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Melhoria mágica para Adaga' }), { target: { value: i.id } });
  view.rerender(<AbaArmas setModalAberto={() => {}} />);
  expect(screen.getByRole('heading', { name: 'Adaga +1' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Equipar' }));
  view.rerender(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.getByText('Vinculado a Adaga')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Desequipar' }));
  expect(mockFicha.ArmaEquipada).toEqual([]);
  view.rerender(<AbaArmas setModalAberto={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Remover melhoria' }));
  expect(nomeEquipamentoMagico(mockFicha, 'arma', a)).toBe('Adaga');
});

test('interface oferece melhorias de armadura e requisito de sintonização para arma especial', () => {
  mockFicha = ficha(); armadura(mockFicha); const i = item(mockFicha, '+1 Armor');
  const view = render(<AbaArmaduras setModalEquipamentoAberto={() => {}} />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Melhoria mágica para Couro' }), { target: { value: i.id } });
  expect(i.vinculoEquipamento).toBeDefined();
  const s = item(mockFicha, 'Sword of Answering');
  view.rerender(<AbaItens setModalItemAberto={() => {}} />);
  const linha = screen.getAllByRole('listitem').find(l => within(l).queryByRole('heading', { name: s.nome }))!;
  expect(within(linha).getByRole('button', { name: 'Sintonizar' })).toBeEnabled();
  expect(within(linha).queryByRole('checkbox')).not.toBeInTheDocument();
  fireEvent.click(within(linha).getByRole('button', { name: 'Equipar' }));
  fireEvent.click(within(linha).getByRole('button', { name: 'Sintonizar' }));
  expect(mockFicha.itensSintonizados).toContain(s.id);
});

test('duas cópias da arma especial conservam duas representações e IDs diferentes', () => {
  let f = ficha(); const a = item(f, 'Sword of Answering'), b = item(f, 'Sword of Answering');
  expect(a.id).not.toBe(b.id);
  expect(a.vinculoEquipamento?.id).not.toBe(b.vinculoEquipamento?.id);
  f = reabrir(f);
  expect(f.ArmasMochila).toHaveLength(2);
  expect(new Set(f.ArmasMochila!.map(a => a.id)).size).toBe(2);
});

test('remover armadura desfaz vínculo e mantém o item de melhoria', () => {
  const f = ficha(), a = armadura(f), i = item(f, '+1 Armor');
  f.vincularItemMagico(i.id, 'armadura', a.id); f.setEquiparItem(i); f.excluirArmaduraMochila(a.id);
  expect(f.ArmadurasMochila).toEqual([]);
  expect(i.vinculoEquipamento).toBeUndefined();
  expect(f.itensMochila).toHaveLength(1);
  expect(itemEstaEquipado(f, i)).toBe(false);
  expect(selecionarCA(f).total).toBe(13);
});

test('metadados persistidos prevalecem sobre nomes e não duplicam bônus de efeitos legados', () => {
  let f = ficha(); const a = arma(f), i = item(f);
  i.nome = 'Relíquia'; i.nomeIngles = 'Relic';
  i.efeitosExplicitos = [Object.assign(new Efeitos(), { tipoEfeito: 'ataque_arma', bonus: 1 }), Object.assign(new Efeitos(), { tipoEfeito: 'dano_arma', bonus: 1 })];
  f.vincularItemMagico(i.id, 'arma', a.id); f.setEquiparItem(i); f = reabrir(f);
  expect(selecionarArma(f, f.ArmasMochila![0])).toMatchObject({ ataque: 4, formula: '1d4 +4' });
  expect(f.efeitos?.filter(e => e.origemTipo === 'item') ?? []).toEqual([]);
});

test('importação descarta estado equipado contraditório e vínculos a IDs inexistentes', () => {
  const f = ficha(), a = arma(f), i = item(f);
  f.vincularItemMagico(i.id, 'arma', a.id);
  const raw = JSON.parse(exportFicha(f)).data;
  raw.itensEquipados = [raw.itensMochila[0]];
  const restaurada = hydrateFicha(raw);
  expect(restaurada.itensEquipados).toEqual([]);
  raw.itensMochila[0].vinculoEquipamento.id = 'ausente';
  const semAlvo = hydrateFicha(raw);
  expect(semAlvo.itensMochila![0].vinculoEquipamento).toBeUndefined();
  expect(selecionarArma(semAlvo, semAlvo.ArmasMochila![0]).ataque).toBe(3);
});
