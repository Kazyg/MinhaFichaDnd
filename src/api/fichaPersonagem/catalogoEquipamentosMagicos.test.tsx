import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { Druida } from '../classesClassesFilhos/Druida.class';
import { armas } from '../equipamentos/Armas';
import { itens } from '../../bibliotecas/Itens';
import { itensIngles } from '../../bibliotecas/ItensIngles';
import registros from '../../bibliotecas/equipamentosMagicosCatalogo.json';
import { selecionarArma, selecionarCA } from './fichaSeletores';
import { calcularBonusMagiaPorClasse } from './fichaEfeitosUtils';
import { itemEstaEquipado } from './fichaEquipamentosMagicos';
import { exportFicha, parseImport } from './fichaStorage';
import AbaItens from '../../pages/components/components_inventario/AbaItens';
import AbaArmas from '../../pages/components/components_inventario/AbaArmas';
import AbaArmaduras from '../../pages/components/components_inventario/AbaArmaduras';

let mockFicha: Ficha;
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn(), refreshKey: 0 }) }));
const fixture = () => new Ficha({ id: 'teste', nomePersonagem: 'Teste', levelTotal: 1, atributosPersonagem: new Atributos(14, 18, 14, 14, 14, 14) });
function adicionar(f: Ficha, nome: string) { f.setItemMochila(itens.find(i => i.nomeIngles === nome)!); return f.itensMochila!.slice(-1)[0]; }
const reabrir = (f: Ficha) => parseImport(exportFicha(f));

test.each(registros.filter(r => r.metadados.modo === 'melhoria').map(r => [r.indice, r.nomeIngles] as const))('melhoria %s %s não cria equipamento antes de vincular', (indice, nome) => {
  const origem = itens[indice];
  expect(origem.nomeIngles).toBe(nome);
  const f = fixture(); f.setItemMochila(origem);
  expect(f.ArmasMochila).toBeNull(); expect(f.ArmadurasMochila).toBeNull();
  expect(f.itensMochila![0].equipamentoMagico?.modo).toBe('melhoria');
});

test.each(registros.filter(r => r.metadados.modo === 'especifico').map(r => [r.indice, r.nomeIngles] as const))('registro %s %s: identificação, representação única e JSON', (indice, nome) => {
  const origem = itens[indice];
  expect(origem.nomeIngles).toBe(nome);
  expect(itensIngles[indice].nome).toBe(nome);
  expect(origem.equipamentoMagico).toBeDefined();
  let f = fixture(); f.setItemMochila(origem); let item = f.itensMochila![0];
  const magia = item.equipamentoMagico!;
    const requerEscolha = !magia.baseNome;
    expect(!requerEscolha || !item.vinculoEquipamento).toBe(true);
    const invalida = requerEscolha ? f.selecionarBaseEquipamentoMagico(item.id, 'Inexistente') : false;
    expect(invalida).toBe(false);
    const escolhida = requerEscolha ? f.selecionarBaseEquipamentoMagico(item.id, magia.basesCompativeis![0]) : true;
    expect(escolhida).toBe(true);
    const vinculo = item.vinculoEquipamento!;
    expect(vinculo.tipo).toBe(magia.tipo === 'arma' ? 'arma' : 'armadura');
    f.setEquiparItem(item);
    const sintonizado = item.sintonizavel ? f.setSintonizarItem(item.id, true) : true;
    expect(sintonizado).toBe(true);
    expect(itemEstaEquipado(f, item)).toBe(true);
    f = reabrir(f); item = f.itensMochila![0];
    f = reabrir(f);
    expect(f.itensMochila![0].vinculoEquipamento).toEqual(vinculo);
    const equipamentos = vinculo.tipo === 'arma' ? f.ArmasMochila : f.ArmadurasMochila;
    expect(equipamentos).toHaveLength(1);
    expect(equipamentos![0].nome).toBe(item.nome);
    f.excluirItem(item.id);
    expect(vinculo.tipo === 'arma' ? f.ArmasMochila : f.ArmadurasMochila).toEqual([]);
});

test.each([1, 2, 3])('Foice Lunar +%s tem bônus locais, magias das classes corretas e exige segurar/sintonizar', bonus => {
  let f = fixture(); const i = adicionar(f, `+${bonus} Moon Sickle`), foice = f.ArmasMochila![0];
  f.setArmaMochila(armas.find(a => a.nome === 'Adaga')!); const outra = f.ArmasMochila![1];
  expect(foice.dano).toEqual(armas.find(a => a.nome === 'Foice Curta')!.dano);
  const antes = selecionarArma(f, foice), adaga = selecionarArma(f, outra);
  f.setEquiparItem(i);
  expect(selecionarArma(f, foice)).toEqual(antes);
  expect(f.setSintonizarItem(i.id, true)).toBe(true);
  expect(selecionarArma(f, foice).ataque).toBe(antes.ataque + bonus);
  expect(selecionarArma(f, foice).formula).toBe(`1d4 +${2 + bonus}`);
  expect(selecionarArma(f, outra)).toEqual(adaga);
  for (const classe of ['druida', 'patrulheiro']) {
    expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', classe)).toBe(bonus);
    expect(calcularBonusMagiaPorClasse(f, 'cd_magia', classe)).toBe(bonus);
  }
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(0);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia')).toBe(0);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'ranger')).toBe(bonus);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'druid')).toBe(bonus);
  f = reabrir(f); f = reabrir(f);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'druida')).toBe(bonus);
  f.setSintonizarItem(i.id, false);
  expect(calcularBonusMagiaPorClasse(f, 'cd_magia', 'druida')).toBe(0);
  f.setSintonizarItem(i.id, true); f.setDesequiparArma(foice.id);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'patrulheiro')).toBe(0);
  expect(f.itensSintonizados).toEqual([]);
});

test('Foice Lunar migra efeitos antigos sem duplicar bônus mágicos ou expandir seu alcance', () => {
  const f = fixture(), i = adicionar(f, '+1 Moon Sickle');
  i.efeitosExplicitos = [Object.assign(new Efeitos(), { tipoEfeito: 'ataque_magia', bonus: 1, classeNome: 'todas' })];
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(calcularBonusMagiaPorClasse(reabrir(f), 'ataque_magia', 'druida')).toBe(1);
  expect(calcularBonusMagiaPorClasse(reabrir(f), 'ataque_magia', 'mago')).toBe(0);
});

test.each(['Animated Shield', 'Sentinel Shield', 'Spellguard Shield', 'Arrow-Catching Shield', 'Shield of Missile Attraction', 'Pariah\'s Shield'])('escudo %s não ganha bônus permanente por raridade ou condição', nome => {
  const f = fixture(), i = adicionar(f, nome), s = f.ArmadurasMochila![0];
  expect(s.ac).toBe(2);
  f.setEquiparItem(i); if (i.sintonizavel) f.setSintonizarItem(i.id, true);
  expect(selecionarCA(f).total).toBe(16);
  expect(f.getMaosOcupadas()).toBe(1);
  f.setDesequiparEscudo();
  expect(itemEstaEquipado(f, i)).toBe(false);
  expect(i.vinculoEquipamento?.id).toBe(s.id);
  f.setEquiparItem(i); f.excluirArmaduraMochila(s.id);
  expect(f.itensMochila).toEqual([]); expect(f.ArmadurasMochila).toEqual([]);
});

test('armadura mágica fixa e alternativas compatíveis preservam CA e efeitos próprios', () => {
  const f = fixture(), i = adicionar(f, 'Glamoured Studded Leather');
  f.setEquiparItem(i);
  expect(selecionarCA(f).total).toBe(17);
  f.excluirItem(i.id);
  const serpente = adicionar(f, 'Serpent Scale Armor'); f.setEquiparItem(serpente);
  expect(selecionarCA(f).total).toBe(18);
  expect(selecionarCA(f).tooltip).not.toContain('máx.');
  expect(f.ArmadurasMochila![0].furtividade).toBe('');
  const mithral = adicionar(f, 'Mithral Armor');
  expect(mithral.vinculoEquipamento).toBeUndefined();
  expect(f.selecionarBaseEquipamentoMagico(mithral.id, 'Couro')).toBe(false);
  expect(f.selecionarBaseEquipamentoMagico(mithral.id, 'Peitoral')).toBe(true);
});

test('espadas com bases alternativas têm escolha explícita e não inventam bônus para iluminação/chamas', () => {
  const f = fixture(), lua = adicionar(f, 'Moon-Touched Sword');
  expect(f.ArmasMochila).toBeNull();
  expect(f.selecionarBaseEquipamentoMagico(lua.id, 'Machadinha')).toBe(false);
  expect(f.selecionarBaseEquipamentoMagico(lua.id, 'Espada Curta')).toBe(true);
  const a = f.ArmasMochila![0]; f.setEquiparItem(lua);
  expect(selecionarArma(f, a).ataque).toBe(4);
  const chamas = adicionar(f, 'Flame Tongue'); f.selecionarBaseEquipamentoMagico(chamas.id, 'Espada Longa');
  f.setEquiparItem(chamas); f.setSintonizarItem(chamas.id, true);
  expect(selecionarArma(f, f.ArmasMochila![1]).ataque).toBe(2);
  expect(selecionarArma(f, f.ArmasMochila![1]).formula).toBe('1d8 +2');
  const vingadora = adicionar(f, 'Holy Avenger'); f.selecionarBaseEquipamentoMagico(vingadora.id, 'Espada Grande');
  f.setDesequiparArma(a.id); f.setDesequiparItem(chamas.id); f.setEquiparItem(vingadora); f.setSintonizarItem(vingadora.id, true);
  expect(selecionarArma(f, f.ArmasMochila![2]).ataque).toBe(5);
});

test('Lâmina Solar preserva dano radiante, Acuidade e proficiência em espada curta', () => {
  const f = fixture(), i = adicionar(f, 'Sun Blade'), a = f.ArmasMochila![0];
  f.setEfeitos(Object.assign(new Efeitos(), { proeficienciasClasse: ['Espada Curta'] }));
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(a).toMatchObject({ dano_tipo: 'Radiante', dano: armas.find(a => a.nome === 'Espada Longa')!.dano });
  expect(a.propriedades).toContain('Acuidade');
  expect(selecionarArma(f, a)).toMatchObject({ ataque: 8, formula: '1d8 +6', proficiente: true });
});

test('cajado do poder aplica bônus próprios e CA uma única vez, só equipado e sintonizado', () => {
  let f = fixture(); const i = adicionar(f, 'Staff of Power'), a = f.ArmasMochila![0];
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(selecionarArma(f, a).ataque).toBe(4);
  expect(selecionarCA(f).total).toBe(16);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(2);
  f = reabrir(f); f = reabrir(f);
  expect(selecionarCA(f).total).toBe(16);
  f.setSintonizarItem(i.id, false);
  expect(selecionarCA(f).total).toBe(14);
  expect(calcularBonusMagiaPorClasse(f, 'ataque_magia', 'mago')).toBe(0);
});

test('edições duplicadas são registros distintos e dados incompletos não assumem uma variante segura', () => {
  const sol = itens.filter(i => i.nomeIngles === 'Sun Blade');
  expect(sol.map(i => i.equipamentoMagico?.edicao)).toEqual(['DND_2014', 'DND_2024']);
  const incompleto = itens.find(i => i.nomeIngles === 'Moonblade' && !i.equipamentoMagico)!;
  expect(incompleto).toBeDefined();
  const f = fixture(); f.setItemMochila(incompleto);
  expect(f.ArmasMochila).toBeNull();
  expect(reabrir(f).ArmasMochila).toBeNull();
});

test('itens comuns não criam equipamentos e cópias de um escudo mágico não compartilham estados', () => {
  const f = fixture(); adicionar(f, '+1 Amulet of the Devout');
  expect(f.ArmasMochila).toBeNull(); expect(f.ArmadurasMochila).toBeNull();
  const a = adicionar(f, 'Sentinel Shield'), b = adicionar(f, 'Sentinel Shield');
  expect(a.id).not.toBe(b.id); expect(a.vinculoEquipamento?.id).not.toBe(b.vinculoEquipamento?.id);
  f.setEquiparItem(a);
  expect(itemEstaEquipado(f, a)).toBe(true); expect(itemEstaEquipado(f, b)).toBe(false);
  f.setEquiparItem(b);
  expect(itemEstaEquipado(f, a)).toBe(false); expect(itemEstaEquipado(f, b)).toBe(true);
});

test('propriedades compactas atendem hover, teclado e toque sem confirmações narrativas', () => {
  mockFicha = fixture(); const i = adicionar(mockFicha, 'Sword of Answering (Answerer)');
  const view = render(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sintonizar' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Equipar' })); fireEvent.click(screen.getByRole('button', { name: 'Sintonizar' }));
  expect(mockFicha.itensSintonizados).toContain(i.id);
  view.rerender(<AbaArmas setModalAberto={() => {}} />);
  const reacao = screen.getByRole('button', { name: 'Reação (2014)' });
  expect(reacao.tagName).toBe('SPAN');
  expect(reacao).toHaveClass('info-badge-propriedade');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  fireEvent.focus(reacao);
  expect(screen.getByRole('tooltip')).toHaveTextContent('vantagem');
  fireEvent.scroll(screen.getByRole('tooltip'));
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  fireEvent.keyDown(reacao, { key: 'Escape' }); expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Vinculado' }));
  expect(screen.getByRole('tooltip')).toHaveTextContent('permanente');
  view.rerender(<AbaArmaduras setModalEquipamentoAberto={() => {}} />);
  const escudo = adicionar(mockFicha, 'Sentinel Shield');
  view.rerender(<AbaArmaduras setModalEquipamentoAberto={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Sentinela' }));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Percepção');
  expect(escudo.vinculoEquipamento).toBeDefined();
});

test('sintonização preserva o limite mecânico sem verificar requisitos narrativos antigos', () => {
  const f = fixture();
  const objetos = ['Sword of Answering (Answerer)', 'Staff of Power', 'Spellguard Shield', '+1 Moon Sickle'].map(nome => adicionar(f, nome));
  objetos.forEach(i => { i.requisitosSintonizacaoConfirmados = false; });
  objetos.slice(0, 3).forEach(i => expect(f.setSintonizarItem(i.id, true)).toBe(true));
  expect(f.setSintonizarItem(objetos[3].id, true)).toBe(false);
  expect(reabrir(f).getItensSintonizadosEquipados()).toHaveLength(3);
});

test('normalização legada reconhece o nome traduzido sem criar cópias na mochila', () => {
  const f = fixture(); const origem = itens.find(i => i.nomeIngles === '+1 Moon Sickle')!;
  const antigo: typeof origem = Object.assign(Object.create(Object.getPrototypeOf(origem)), origem);
  delete antigo.equipamentoMagico; delete antigo.registroCatalogo;
  antigo.nomeIngles = '';
  f.setItemMochila(antigo);
  expect(f.ArmasMochila).toHaveLength(1);
  expect(f.itensMochila).toHaveLength(1);
  expect(reabrir(f).ArmasMochila).toHaveLength(1);
});

test('modificadores especiais de atributo só funcionam quando o equipamento está ativo', () => {
  const f = fixture(), i = adicionar(f, 'Thunderous Greatclub'), a = f.ArmasMochila![0];
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(selecionarArma(f, a).ataque).toBe(5);
  f.setSintonizarItem(i.id, false);
  expect(selecionarArma(f, a).ataque).toBe(2);
  const carisma = adicionar(f, 'Snicker-Snack'), espada = f.ArmasMochila![1];
  f.atributosPersonagem!.carisma.valor = 20;
  f.setDesequiparArma(a.id); f.setEquiparItem(carisma); f.setSintonizarItem(carisma.id, true);
  expect(selecionarArma(f, espada).ataque).toBe(10);
  f.setSintonizarItem(carisma.id, false);
  expect(selecionarArma(f, espada).ataque).toBe(2);
});

test('equipamento mecânico sem encantamento não é promovido a arma mágica por raridade desconhecida', () => {
  const f = fixture(), i = adicionar(f, 'Light Repeating Crossbow');
  expect(i.equipamentoMagico).toBeUndefined();
  expect(f.ArmasMochila).toBeNull();
  expect(reabrir(f).ArmasMochila).toBeNull();
});

test.each(['Rod of Lordly Might', 'Witchlight Vane'])('%s integra a função explícita de maça sem bônus globais', nome => {
  const f = fixture(), i = adicionar(f, nome), maca = f.ArmasMochila![0];
  f.setArmaMochila(armas.find(a => a.nome === 'Adaga')!); const outra = f.ArmasMochila![1];
  const antes = selecionarArma(f, outra);
  expect(maca.dano).toEqual(armas.find(a => a.nome === 'Maça')!.dano);
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(selecionarArma(f, maca)).toMatchObject({ ataque: 5, formula: '1d6 +5' });
  expect(selecionarArma(f, outra)).toEqual(antes);
});

test('arma especial com dados próprios preserva o dano declarado sem somar o dano condicional', () => {
  const f = fixture(), i = adicionar(f, "Gurt's Greataxe"), a = f.ArmasMochila![0];
  f.setEquiparItem(i); f.setSintonizarItem(i.id, true);
  expect(selecionarArma(f, a)).toMatchObject({ ataque: 3, formula: '3d12 +3' });
});

test('Foice Lunar reconhece a proficiência real de druida em foice, inclusive sem sintonização', () => {
  const f = fixture(); f.classePrincipal = new Druida();
  const i = adicionar(f, '+1 Moon Sickle'), a = f.ArmasMochila![0];
  f.setEquiparItem(i);
  expect(selecionarArma(f, a)).toMatchObject({ ataque: 4, proficiente: true });
  f.setSintonizarItem(i.id, true);
  expect(selecionarArma(f, a)).toMatchObject({ ataque: 5, formula: '1d4 +3', proficiente: true });
});
