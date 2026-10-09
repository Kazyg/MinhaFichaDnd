import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Ficha } from './FichaPersonagem';
import { selecionarFontesConjuracao, selecionarPoolsMagia, selecionarEscolhasMagia } from './fichaConjuracao';
import { FichaProvider, useFicha } from './FichaContext';
import { exportFicha, parseImport, parseCollection, serializeCollection, persist } from './fichaStorage';
import { getRulesetData } from '../rulesets/getRulesetData';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { CavaleiroArcano } from '../classesClassesNetos/CavaleiroArcano';
import { CavaleiroMistico2024 } from '../classesClassesNetos/CavaleiroMistico2024';
import { TrapaceiroArcano } from '../classesClassesNetos/TrapaceiroArcano';
import { TrapaceiroArcano2024 } from '../classesClassesNetos/TrapaceiroArcano2024';
import AbaMagias from '../../pages/components/components_inventario/AbaMagias';
import CriarFicha from '../../pages/criarFicha';

jest.setTimeout(30000);
jest.mock('../../pages/modals/ModalMagias', () => ({ onSelect, onClose }) => {
  const { ficha } = require('./FichaContext').useFicha();
  const fontes = require('./fichaConjuracao').selecionarFontesConjuracao(ficha);
  return <button onClick={() => { onSelect('Luz', fontes[0].id, 'progressao'); onClose(); }}>Confirmar magia de teste</button>;
});
async function calcularViaUI() {
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Escolher Magia' })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Confirmar magia de teste' })));
}

function fixture(edition = 'DND_2024', name = 'Guerreiro') {
  const rules = getRulesetData(edition);
  const classe = rules.classes.find(c => c.nome === name);
  const ficha = new Ficha({ id: 'restauracao', nomePersonagem: 'Restauração', versaoRegras: edition,
    classePrincipal: classe, racaPrincipal: rules.racasOuEspecies.find(r => r.nome === 'Humano'),
    backGround: rules.backgroundsOuOrigens[0], atributosPersonagem: new Atributos(15, 14, 13, 16, 12, 10),
    idiomas: ['Comum', 'Élfico', 'Anão'], pericias: ['Atletismo'], levelTotal: 5 });
  for (let n = 1; n <= 5; n++) ficha.selecionarClasseNoNivel(classe, n);
  return ficha;
}
function memory(raw) {
  const values = new Map([['fichas', raw]]);
  return { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) };
}
let api;
function Probe() { api = useFicha(); return null; }
const tick = async fn => act(async () => { fn(); await Promise.resolve(); });
afterEach(() => jest.useRealTimers());

test.each([
  ['DND_2014', 'Guerreiro', CavaleiroArcano], ['DND_2024', 'Guerreiro', CavaleiroMistico2024],
  ['DND_2014', 'Ladino', TrapaceiroArcano], ['DND_2024', 'Ladino', TrapaceiroArcano2024],
])('JSON e consumidor de magias preservam %s %s', async (edition, name, Subclass) => {
  const original = fixture(edition, name);
  original.setSubClasse(original.classePrincipal, new Subclass());
  original.subClasse[0].subclasse.descricao = 'Ajuste manual preservado';
  const effect = new Efeitos(); effect.setLevel(4); effect.bonus = 2; effect.atributo = 'inteligencia';
  original.setEfeitos(effect);
  const restored = parseImport(exportFicha(original));
  expect(restored.subClasse[0].subclasse).toBeInstanceOf(Subclass);
  expect(restored.atributosPersonagem).toBeInstanceOf(Atributos);
  expect(restored.efeitos.every(e => e instanceof Efeitos)).toBe(true);
  expect(JSON.parse(exportFicha(restored))).toEqual(JSON.parse(exportFicha(original)));
  const store = memory(serializeCollection([restored], restored.id));
  const view = render(<FichaProvider storage={store}><Probe /><AbaMagias /></FichaProvider>);
  await tick(() => {});
  await calcularViaUI();
  const before = { fontes: selecionarFontesConjuracao(api.ficha), pools: selecionarPoolsMagia(api.ficha), escolhas: selecionarEscolhasMagia(api.ficha) };
  expect(before.fontes.reduce((sum, c) => sum + c.truques, 0)).toBeGreaterThan(0);
  expect(before.escolhas).toHaveLength(1);
  expect(before.escolhas[0].nome).toBe('Luz');
  expect(api.ficha.espacosMagiaTotais).toBeNull(); // Rendering no longer writes derived caches.
  await tick(() => api.salvarFicha(api.ficha));
  view.unmount();
  const utils = render(<FichaProvider storage={store}><Probe /><AbaMagias /></FichaProvider>);
  await tick(() => {});
  expect({ fontes: selecionarFontesConjuracao(api.ficha), pools: selecionarPoolsMagia(api.ficha), escolhas: selecionarEscolhasMagia(api.ficha) }).toEqual(before);
  await tick(() => api.ficha.selecionarClasseNoNivel(getRulesetData(edition).classes.find(c => c.nome === 'Mago'), 5));
  expect(api.ficha.multiclasses.find(m => m.classe.nome === name).nivelClasse).toBe(4);
  expect(api.ficha.subClasse[0].subclasse).toBeInstanceOf(Subclass);
  await tick(() => api.ficha.atributosPersonagem.somarAtributo('forca', 1));
  expect(api.ficha.atributosPersonagem.forca.valor).toBe(16);
  utils.unmount();
});

test('subclasse única, arquivo das duplicadas e backup permanente da migração', () => {
  const ficha = fixture();
  const first = new CavaleiroMistico2024(); const last = ficha.classePrincipal.subClasse[0];
  ficha.subClasse = [{ classe: ficha.classePrincipal, subclasse: first }, { classe: ficha.classePrincipal, subclasse: last }];
  const raw = JSON.stringify([ficha]);
  const { fichas } = parseCollection(raw);
  expect(fichas[0].subClasse).toHaveLength(1);
  expect(fichas[0].subClasse[0].subclasse.id).toBe(last.id);
  expect(fichas[0].subclassesAnteriores[0].subclasse.id).toBe(first.id);
  const store = memory(raw); const next = serializeCollection(fichas, ficha.id);
  persist(store, raw, next);
  persist(store, next, next);
  expect(store.getItem('fichas.backup.F3-subclasse-unica-v1')).toBe(raw);
  expect(parseCollection(next).fichas[0].subclassesAnteriores).toHaveLength(1);
});

test('troca e perda de elegibilidade invalidam somente a origem da subclasse', () => {
  const ficha = fixture(); const sub = new CavaleiroMistico2024();
  ficha.setSubClasse(ficha.classePrincipal, sub);
  const own = new Efeitos(); own.origemTipo = 'subclasse'; own.origemId = sub.id;
  const manual = new Efeitos(); manual.setLevel(5);
  ficha.setEfeitos(own); ficha.setEfeitos(manual);
  ficha.setSubClasse(ficha.classePrincipal, ficha.classePrincipal.subClasse[0]);
  expect(ficha.subClasse).toHaveLength(1);
  expect(ficha.efeitos).not.toContain(own); expect(ficha.efeitos).toContain(manual);
  const mage = getRulesetData(ficha.versaoRegras).classes.find(c => c.nome === 'Mago');
  for (const n of [5, 4, 3]) ficha.selecionarClasseNoNivel(mage, n);
  expect(ficha.subClasse).toHaveLength(0);
  expect(ficha.efeitos).toContain(manual);
});

test('efeito com origem acompanha o nível da classe; efeito manual não muda', () => {
  const ficha = fixture();
  const effect = new Efeitos();
  Object.assign(effect, { origemTipo: 'nivel', classeNome: 'Guerreiro', nivelClasseOrigem: 4, level: 4, tituloEfeito: 'selecionadoTalento4' });
  ficha.setEfeitos(effect);
  const manual = new Efeitos(); manual.level = 4; ficha.setEfeitos(manual);
  const restored = parseImport(exportFicha(ficha));
  const mage = getRulesetData('DND_2024').classes.find(c => c.nome === 'Mago');
  restored.selecionarClasseNoNivel(mage, 2);
  expect(restored.efeitos.find(e => e.id === effect.id)).toMatchObject({ level: 5, tituloEfeito: 'selecionadoTalento5' });
  expect(restored.efeitos.find(e => e.id === manual.id).level).toBe(4);
  restored.selecionarClasseNoNivel(mage, 3);
  expect(restored.efeitos.find(e => e.id === effect.id)).toBeUndefined();
  expect(restored.efeitos.find(e => e.id === manual.id)).toBeDefined();
});

test('conteúdo antigo desconhecido e ajustes manuais são preservados sem converter edição', () => {
  const ficha = fixture('DND_2014');
  delete ficha.versaoRegras;
  ficha.subClasse = [{ classe: ficha.classePrincipal, subclasse: { id: 'antiga', nome: 'Opção antiga', niveis: [], anotacao: 'manual' } }];
  ficha.atributosPersonagem.forca.valor = 23;
  ficha.campoAntigo = { texto: 'não verificado' };
  const restored = parseImport(JSON.stringify(ficha));
  expect(restored.versaoRegras).toBe('DND_2014');
  expect(restored.atributosPersonagem.forca.valor).toBe(23);
  expect(restored.subClasse[0].subclasse.anotacao).toBe('manual');
  expect(restored.campoAntigo).toEqual(ficha.campoAntigo);
});

test('falha do backup de migração impede sobrescrever a coleção', () => {
  const ficha = fixture(); const sub = new CavaleiroMistico2024();
  ficha.subClasse = [{ classe: ficha.classePrincipal, subclasse: sub }, { classe: ficha.classePrincipal, subclasse: sub }];
  const raw = JSON.stringify([ficha]);
  const store = memory(raw); const write = store.setItem;
  store.setItem = (k, v) => { if (k.includes('F3-')) throw new Error('quota'); write(k, v); };
  const next = serializeCollection(parseCollection(raw).fichas, ficha.id);
  expect(() => persist(store, raw, next)).toThrow('quota');
  expect(store.getItem('fichas')).toBe(raw);
});

test('fluxo mobile real restaura idiomas, perícias e distribuição ao alternar abas e fichas', async () => {
  jest.useFakeTimers();
  const previousWidth = window.innerWidth;
  window.innerWidth = 480;
  const first = fixture(); const second = fixture(); second.id = 'segunda'; second.pericias = []; second.idiomas = ['Comum'];
  // This scenario restores explicit choices; ambiguous legacy languages are
  // covered separately and must not gain provenance from their array position.
  first.idiomasLivres = ['Élfico', 'Anão'];
  const store = memory(serializeCollection([first, second], first.id));
  const mount = () => render(<FichaProvider storage={store}><Probe /><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><CriarFicha /></MemoryRouter></FichaProvider>);
  let view = mount();
  await tick(() => {});
  expect(screen.getByRole('heading', { name: /Método de distribuição/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Idioma 1 Élfico/ })).toBeInTheDocument();
  await tick(() => fireEvent.click(screen.getByRole('checkbox', { name: 'Atletismo' })));
  expect(api.ficha.pericias).not.toContain('Atletismo');
  await tick(() => fireEvent.click(screen.getByRole('checkbox', { name: 'Atletismo' })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Point Buy' })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Distribuir Atributos' })));
  await tick(() => fireEvent.click(screen.getAllByRole('button', { name: '+' })[0]));
  const draft = JSON.parse(JSON.stringify(api.ficha.distribuicaoAtributos));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Perícias', exact: true })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Criar', exact: true })));
  expect(screen.getByRole('checkbox', { name: 'Atletismo' })).toBeChecked();
  expect(api.ficha.distribuicaoAtributos).toEqual(draft);
  await tick(() => fireEvent.click(screen.getByRole('button', { name: /Idioma 1 Élfico/ })));
  const modal = screen.getByRole('dialog', { name: 'Escolha seu idioma' });
  const option = within(modal).getAllByRole('listitem').find(li => !['Élfico', 'Anão', 'Comum'].includes(li.textContent));
  const language = option.textContent;
  await tick(() => fireEvent.click(within(option).getByRole('button')));
  await tick(() => fireEvent.click(within(modal).getByRole('button', { name: `Escolher ${language}` })));
  expect(api.ficha.idiomas).toContain(language); expect(api.ficha.idiomas).not.toContain('Élfico');
  await tick(() => api.setFicha(api.fichas.find(f => f.id === second.id)));
  expect(screen.queryByRole('heading', { name: /Método de distribuição/ })).not.toBeInTheDocument();
  await tick(() => api.setFicha(api.fichas.find(f => f.id === first.id)));
  expect(screen.getByRole('checkbox', { name: 'Atletismo' })).toBeChecked();
  await tick(() => api.tentarSalvar());
  view.unmount(); view = mount();
  await tick(() => {});
  expect(api.ficha.distribuicaoAtributos).toEqual(draft);
  expect(api.ficha.idiomasLivres[0]).toBe(language);
  expect(screen.getByRole('checkbox', { name: 'Atletismo' })).toBeChecked();
  view.unmount(); window.innerWidth = previousWidth;
});
