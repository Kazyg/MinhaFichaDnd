import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { FichasIndexedDB } from './fichasIndexedDB';
import { Ficha } from './FichaPersonagem';
import { exportFicha, parseImport, serializeCollection } from './fichaStorage';

const ficha = (id: string, versaoRegras: 'DND_2014' | 'DND_2024' = 'DND_2014') => new Ficha({ id, nomePersonagem: id, versaoRegras });
const legacy = (raw: string | null) => ({ getItem: jest.fn((key: string) => key === 'fichas' ? raw : null), setItem: jest.fn() });
afterEach(() => jest.restoreAllMocks());

test('CRUD, seleção, importação JSON e reabertura preservam ambas as edições e campos desconhecidos', async () => {
  const factory = new IDBFactory();
  let repo = new FichasIndexedDB(factory);
  await repo.migrate(legacy(null));
  let state = await repo.load();
  const a = Object.assign(ficha('a'), { extensao: { valores: ['preservar'] } });
  const b = parseImport(exportFicha(ficha('b', 'DND_2024')));
  state.revision = await repo.save(serializeCollection([a, b], 'a'), state.revision);
  expect((await repo.load()).fichas).toHaveLength(2);
  expect(await repo.get('ausente')).toBeNull();
  const loaded = (await repo.get('a'))!;
  loaded.nomePersonagem = 'Atualizada';
  state.revision = await repo.save(serializeCollection([loaded, b], 'b'), state.revision);
  expect((await repo.load()).fichas).toHaveLength(2);
  await repo.close();
  repo = new FichasIndexedDB(factory);
  state = await repo.load();
  expect(state.selectedId).toBe('b');
  expect(state.fichas.map(f => f.versaoRegras)).toEqual(['DND_2014', 'DND_2024']);
  expect(await repo.get('a')).toMatchObject({ nomePersonagem: 'Atualizada', extensao: { valores: ['preservar'] } });
  await repo.save(serializeCollection([b], 'b'), state.revision);
  expect(await repo.get('a')).toBeNull();
});

test.each([1, 3])('migra %s fichas, repete sem duplicar e não ressuscita exclusões', async count => {
  const repo = new FichasIndexedDB(new IDBFactory());
  const store = legacy(JSON.stringify(Array.from({ length: count }, (_, i) => ficha(String(i), i % 2 ? 'DND_2024' : 'DND_2014'))));
  await Promise.all([repo.migrate(store), repo.migrate(store)]);
  expect((await repo.load()).fichas).toHaveLength(count);
  const state = await repo.load();
  await repo.save(serializeCollection([], null), state.revision);
  store.getItem.mockImplementation(() => { throw new Error('LocalStorage indisponível'); });
  await repo.migrate(store);
  expect((await repo.load()).fichas).toHaveLength(0);
  expect(store.setItem).not.toHaveBeenCalled();
});

test('migração parcial isola inválidos, duplicados e campos maliciosos sem perder fichas válidas', async () => {
  const repo = new FichasIndexedDB(new IDBFactory());
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const malicious = JSON.parse('{"id":"maliciosa","nomePersonagem":"Maliciosa","__proto__":{"poluido":true}}');
  const raw = JSON.stringify([null, ficha('a'), { id: '', nomePersonagem: 'Inválida' }, ficha('a'), malicious, ficha('b', 'DND_2024')]);
  const store = legacy(raw);
  await repo.migrate(store);
  expect((await repo.load()).fichas.map(f => f.id)).toEqual(['a', 'b']);
  expect(warn).toHaveBeenCalled();
  expect(await repo.get('maliciosa')).toBeNull();
  expect(Object.prototype).not.toHaveProperty('poluido');
  expect(store.getItem('fichas')).toBe(raw);
});

test('migra envelope e seleção e não substitui registros mais novos', async () => {
  const repo = new FichasIndexedDB(new IDBFactory());
  await repo.save(serializeCollection([Object.assign(ficha('a'), { nomePersonagem: 'Nova' })], 'a'), 0);
  await repo.migrate(legacy(serializeCollection([ficha('a'), ficha('b')], 'b')));
  expect((await repo.get('a'))!.nomePersonagem).toBe('Nova');
  expect((await repo.load()).selectedId).toBe('a');
  expect((await repo.load()).fichas).toHaveLength(2);
});

test.each(['[corrompido', '{}', 'null'])('falha de leitura %s preserva dados e permite repetir', async raw => {
  const repo = new FichasIndexedDB(new IDBFactory());
  const store = legacy(raw);
  await expect(repo.migrate(store)).rejects.toThrow();
  expect(store.setItem).not.toHaveBeenCalled();
  await repo.migrate(legacy(JSON.stringify([ficha('a')])));
  expect(await repo.get('a')).not.toBeNull();
});

test('conflito entre abas cancela a transação inteira', async () => {
  const factory = new IDBFactory();
  const a = new FichasIndexedDB(factory), b = new FichasIndexedDB(factory);
  await a.migrate(legacy(null));
  const state = await a.load();
  await a.save(serializeCollection([ficha('a')], 'a'), state.revision);
  await expect(b.save(serializeCollection([ficha('b')], 'b'), state.revision)).rejects.toThrow(/outra aba/);
  expect((await b.load()).fichas.map(f => f.id)).toEqual(['a']);
});

test('falha de gravação na migração faz rollback inclusive do marcador e permite nova tentativa', async () => {
  const repo = new FichasIndexedDB(new IDBFactory());
  const store = legacy(JSON.stringify([ficha('a')]));
  const add = jest.spyOn(IDBObjectStore.prototype, 'add').mockImplementation(function(this: IDBObjectStore) {
    this.transaction.abort();
    return {} as IDBRequest;
  });
  await expect(repo.migrate(store)).rejects.toThrow();
  add.mockRestore();
  expect((await repo.load()).fichas).toHaveLength(0);
  await repo.migrate(store);
  expect((await repo.load()).fichas).toHaveLength(1);
});

test('falha de abertura é reportada', async () => {
  const factory = new IDBFactory();
  jest.spyOn(factory, 'open').mockImplementation(() => { throw new Error('Acesso negado'); });
  await expect(new FichasIndexedDB(factory).load()).rejects.toThrow('Acesso negado');
});
