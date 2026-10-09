import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { FichaProvider, useFicha } from './FichaContext';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { BACKUP_KEY, RECOVERY_KEY, MAX_INPUT_BYTES, parseCollection, parseImport, exportFicha } from './fichaStorage';
import { getRulesetData, getRulesetVersion } from '../rulesets/getRulesetData';
import CriarFicha from '../../pages/criarFicha';
import { MemoryRouter } from 'react-router-dom';
import { Efeitos } from '../classesPrincipais/Efeitos';

function memory(raw = null) {
  const data = new Map(raw === null ? [] : [['fichas', raw]]);
  return { data, getItem: jest.fn(k => data.get(k) ?? null), setItem: jest.fn((k, v) => data.set(k, v)) };
}
let api;
function Probe() { api = useFicha(); return <div>{api.ficha?.nomePersonagem}</div>; }
function mount(store) { return render(<FichaProvider storage={store}><Probe /></FichaProvider>); }
function fixture(overrides = {}) { return new Ficha({ id: 'sintetica-1', nomePersonagem: 'Antes', ...overrides }); }
function stored(store) { return parseCollection(store.getItem('fichas')); }

afterEach(() => { jest.useRealTimers(); });

test.each(['[{broken', '{}', 'null', '[null]', '[42]', '{"format":"minhafichadnd","version":99,"kind":"colecao","data":[]}'])('preserva leitura inválida %s e bloqueia gravação', raw => {
  const store = memory(raw);
  mount(store);
  expect(screen.getByText(/Gravações bloqueadas/)).toBeInTheDocument();
  expect(store.data.get('fichas')).toBe(raw);
  expect(store.setItem).not.toHaveBeenCalled();
});

test('acesso negado na leitura é visível e não grava', () => {
  const store = memory();
  store.getItem.mockImplementation(() => { throw new Error('Acesso negado'); });
  mount(store);
  expect(screen.getByRole('alert')).toHaveTextContent('Acesso negado');
  expect(store.setItem).not.toHaveBeenCalled();
});

test('não grava coleção vazia ao montar ou desmontar', () => {
  const store = memory();
  const view = mount(store);
  view.unmount();
  expect(store.setItem).not.toHaveBeenCalled();
});

test('legado sem edição abre, preserva opções desconhecidas e autosalva mutações aninhadas ao reabrir', async () => {
  jest.useFakeTimers();
  const old = { ...fixture(), atributosPersonagem: new Atributos(), opcoesAntigas: { escolha: 'desconhecida' }, talentos: ['Talento antigo'] };
  delete old.versaoRegras;
  const raw = JSON.stringify([old]);
  const store = memory(raw);
  store.data.set('ficha', old.id);
  const view = mount(store);
  expect(api.ficha.versaoRegras).toBe('DND_2014');
  expect(store.setItem).not.toHaveBeenCalled();
  await act(async () => {
    api.ficha.setNomePersonagem('Depois');
    api.ficha.atributosPersonagem.forca.valor = 15;
    api.ficha.idiomas = ['Comum'];
    api.ficha.idiomas.push('Idioma antigo');
  });
  expect(screen.getByRole('status')).toHaveTextContent('Alterações não salvas');
  act(() => jest.advanceTimersByTime(300));
  expect(api.status).toBe('salvo');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(store.data.get(BACKUP_KEY)).toBe(raw);
  view.unmount();
  mount(store);
  expect(api.ficha.nomePersonagem).toBe('Depois');
  expect(api.ficha.atributosPersonagem.forca.valor).toBe(15);
  expect(api.ficha.idiomas).toEqual(['Comum', 'Idioma antigo']);
  expect(api.ficha.opcoesAntigas).toEqual({ escolha: 'desconhecida' });
  expect(api.ficha.talentos).toEqual(['Talento antigo']);
});

test.each(['quota', 'acesso negado'])('falha de %s preserva bytes e permite tentar novamente', async reason => {
  jest.useFakeTimers();
  const raw = JSON.stringify([fixture()]);
  const store = memory(raw);
  store.data.set('ficha', 'sintetica-1');
  mount(store);
  store.setItem.mockImplementation(() => { throw new Error(reason); });
  await act(async () => { api.ficha.nomePersonagem = 'Pendente'; api.forceUpdate(); });
  act(() => jest.advanceTimersByTime(300));
  expect(api.status).toBe('erro');
  expect(store.data.get('fichas')).toBe(raw);
  expect(api.ficha.nomePersonagem).toBe('Pendente');
  store.setItem.mockImplementation((k, v) => store.data.set(k, v));
  act(() => { expect(api.tentarSalvar()).toBe(true); });
  expect(stored(store).fichas[0].nomePersonagem).toBe('Pendente');
});

test('falha na chave principal mantém original e backup, sem declarar importação bem sucedida', () => {
  const raw = JSON.stringify([fixture()]);
  const store = memory(raw);
  mount(store);
  store.setItem.mockImplementation((k, v) => { if (k === 'fichas') throw new Error('Quota'); store.data.set(k, v); });
  act(() => { expect(api.importarFicha(JSON.stringify(fixture({ id: 'novo' })))).toBeNull(); });
  expect(api.fichas).toHaveLength(1);
  expect(store.data.get('fichas')).toBe(raw);
  expect(store.data.get(BACKUP_KEY)).toBe(raw);
});

test('colisão exige escolha; cópia gera ID novo; substituição é explícita', () => {
  const store = memory(JSON.stringify([fixture()]));
  mount(store);
  const text = exportFicha(fixture({ nomePersonagem: 'Importada' }));
  const before = store.data.get('fichas');
  act(() => { expect(api.importarFicha(text)).toBeNull(); });
  expect(store.data.get('fichas')).toBe(before);
  act(() => { expect(api.importarFicha(text, 'copia').id).not.toBe('sintetica-1'); });
  expect(api.fichas).toHaveLength(2);
  expect(api.fichas.find(f => f.id === 'sintetica-1').nomePersonagem).toBe('Antes');
  act(() => { expect(api.importarFicha(text, 'substituir').id).toBe('sintetica-1'); });
  expect(api.fichas).toHaveLength(2);
  expect(stored(store).fichas.find(f => f.id === 'sintetica-1').nomePersonagem).toBe('Importada');
});

test.each([
  'null', '{}', '[]', JSON.stringify({ ...fixture(), versaoRegras: 'DND_2099' }),
].filter(Boolean))('importação inválida não altera coleção: %s', text => {
  const raw = JSON.stringify([fixture()]);
  const store = memory(raw);
  mount(store);
  act(() => { expect(api.importarFicha(text)).toBeNull(); });
  expect(api.fichas).toHaveLength(1);
  expect(store.data.get('fichas')).toBe(raw);
  expect(store.setItem).not.toHaveBeenCalled();
});

test('valida tipos, números, IDs, referências, profundidade e tamanho', () => {
  for (const patch of [{ vidaTotal: '20' }, { idiomas: [null] }, { atributosPersonagem: {} }, { id: '' }, { versaoRegras: null }, { subClasse: [{ classe: { nome: 'ausente' }, subclasse: { id: 'sub', nome: 'Antiga' } }] }]) {
    expect(() => parseImport(JSON.stringify({ ...fixture(), ...patch }))).toThrow();
  }
  expect(() => parseImport(JSON.stringify(fixture()).replace('"vidaTotal":null', '"vidaTotal":1e400'))).toThrow();
  expect(() => exportFicha(fixture({ vidaTotal: NaN }))).toThrow();
  expect(() => parseImport(' '.repeat(MAX_INPUT_BYTES + 1))).toThrow();
  expect(() => parseImport('{"__proto__":{},"id":"a","nomePersonagem":null}')).toThrow();
  expect(() => parseCollection(JSON.stringify([fixture(), fixture()]))).toThrow();
  expect(() => parseCollection(JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'colecao', selectedId: 'ausente', data: [] }))).toThrow();
  expect(() => getRulesetVersion('futuro')).toThrow();
});

test('recupera coleção corrigida preservando bytes corrompidos', () => {
  const store = memory('[{broken');
  mount(store);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: JSON.stringify([fixture()]) } });
  fireEvent.click(screen.getByText('Validar e recuperar coleção'));
  expect(store.data.get(RECOVERY_KEY)).toBe('[{broken');
  expect(api.fichas).toHaveLength(1);
  expect(api.recuperacao).toBe(false);
});

test('restaura backup validado sem perder conteúdo original', () => {
  const store = memory('null');
  store.data.set(BACKUP_KEY, JSON.stringify([fixture()]));
  mount(store);
  fireEvent.click(screen.getByText('Restaurar última cópia de segurança'));
  expect(stored(store).fichas).toHaveLength(1);
  expect(store.data.get(RECOVERY_KEY)).toBe('null');
});

test('detecta conflito com outra aba sem sobrescrever', async () => {
  jest.useFakeTimers();
  const store = memory(JSON.stringify([fixture()]));
  mount(store);
  await act(async () => { api.fichas[0].nomePersonagem = 'Minha edição'; });
  store.data.set('fichas', 'dados de outra aba');
  act(() => jest.advanceTimersByTime(300));
  expect(api.erro).toMatch(/outra aba/);
  expect(store.data.get('fichas')).toBe('dados de outra aba');
});

test.each(['DND_2014', 'DND_2024'])('snapshots do contrato atual %s fazem roundtrip sem mudar opções', edition => {
  const rules = getRulesetData(edition);
  for (const classe of rules.classes) {
    const ficha = fixture({ versaoRegras: edition, classePrincipal: classe, racaPrincipal: rules.racasOuEspecies[0], backGround: rules.backgroundsOuOrigens[0], atributosPersonagem: new Atributos() });
    expect(JSON.parse(JSON.stringify(parseImport(exportFicha(ficha))))).toEqual(JSON.parse(JSON.stringify(ficha)));
  }
});

test('edição pela página real salva nome sem esperar timer local e reabre', async () => {
  jest.useFakeTimers();
  const store = memory(JSON.stringify([fixture()]));
  store.data.set('ficha', 'sintetica-1');
  const view = render(<FichaProvider storage={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><CriarFicha /></MemoryRouter></FichaProvider>);
  fireEvent.change(screen.getByPlaceholderText('Nome do Personagem'), { target: { value: 'Nome pela tela' } });
  await act(async () => { await Promise.resolve(); });
  expect(screen.getByRole('status')).toHaveTextContent('Alterações não salvas');
  act(() => jest.advanceTimersByTime(300));
  expect(stored(store).fichas[0].nomePersonagem).toBe('Nome pela tela');
  view.unmount();
  mount(store);
  expect(api.ficha.nomePersonagem).toBe('Nome pela tela');
});

test('restaura métodos de atributos e efeitos para editar fichas reabertas', async () => {
  jest.useFakeTimers();
  const effect = new Efeitos();
  const store = memory(JSON.stringify([fixture({ efeitos: [effect], atributosPersonagem: new Atributos() })]));
  store.data.set('ficha', 'sintetica-1');
  mount(store);
  await act(async () => {
    api.ficha.efeitos[0].setLevel(2);
    api.ficha.atributosPersonagem.somarAtributo('forca', 1);
  });
  act(() => jest.advanceTimersByTime(300));
  expect(stored(store).fichas[0].efeitos[0].level).toBe(2);
  expect(stored(store).fichas[0].atributosPersonagem.forca.valor).toBe(9);
});

test('fúrias ilimitadas têm representação explícita, sem aceitar infinito arbitrário', () => {
  const barbaro = getRulesetData('DND_2014').classes.find(c => c.nome === 'barbaro');
  const text = exportFicha(fixture({ classePrincipal: barbaro }));
  expect(JSON.parse(text).data.classePrincipal.niveis.find(n => n.nivel === 20).furias).toBe('ilimitado');
  expect(parseImport(text).classePrincipal.niveis.find(n => n.nivel === 20).furias).toBe(Infinity);
  expect(() => parseImport(text.replace('"ilimitado"', '1e400'))).toThrow();
});

test('falha de verificação mantém backup e não declara sucesso', () => {
  const raw = JSON.stringify([fixture()]);
  const store = memory(raw);
  mount(store);
  store.setItem.mockImplementation((k, v) => { if (k !== 'fichas') store.data.set(k, v); });
  act(() => { expect(api.salvarFicha(fixture({ nomePersonagem: 'Novo' }))).toBe(false); });
  expect(api.status).toBe('erro');
  expect(store.data.get(BACKUP_KEY)).toBe(raw);
  expect(store.data.get('fichas')).toBe(raw);
});

test('seleção nula no envelope não reativa o ponteiro legado', async () => {
  jest.useFakeTimers();
  const store = memory(JSON.stringify([fixture()]));
  store.data.set('ficha', 'sintetica-1');
  const view = mount(store);
  await act(async () => { api.setFicha(null); });
  act(() => jest.advanceTimersByTime(300));
  view.unmount();
  mount(store);
  expect(api.ficha).toBeNull();
  expect(api.fichas).toHaveLength(1);
});
