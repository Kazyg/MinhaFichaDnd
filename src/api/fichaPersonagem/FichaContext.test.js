import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FichaProvider, useFicha } from './FichaContext';
import { Ficha } from './FichaPersonagem';
import { FichasIndexedDB } from './fichasIndexedDB';
import { exportFicha } from './fichaStorage';
const fixture = (overrides = {}) => new Ficha({ id: 'sintetica-1', nomePersonagem: 'Antes', ...overrides });
beforeEach(() => localStorage.clear());
let api;
function Probe() { api = useFicha(); return <div>Editor pronto</div>; }
async function mount(repo) {
  const view = render(<FichaProvider repository={repo}><Probe /></FichaProvider>);
  await screen.findByText('Editor pronto');
  return view;
}
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

test('cria, atualiza, importa, seleciona, exclui e reabre', async () => {
  const repo = new FichasIndexedDB();
  const view = await mount(repo);
  await act(async () => { expect(await api.salvarFicha(fixture())).toBe(true); });
  await act(async () => { api.ficha.nomePersonagem = 'Editada'; expect(await api.salvarPendentes()).toBe(true); });
  await act(async () => { expect(await api.importarFicha(exportFicha(fixture()), 'copia')).not.toBeNull(); });
  expect(api.fichas).toHaveLength(2);
  await act(async () => { await api.setFicha(api.fichas.find(f => f.id === 'sintetica-1')); });
  const copy = api.fichas.find(f => f.id !== 'sintetica-1').id;
  await act(async () => { expect(await api.deletarFicha(copy)).toBe(true); });
  view.unmount();
  await repo.close();
  await mount(new FichasIndexedDB());
  expect(api.ficha.nomePersonagem).toBe('Editada');
  expect(api.fichas).toHaveLength(1);
});

test('operações simultâneas preservam novas fichas', async () => {
  await mount(new FichasIndexedDB());
  await act(async () => { await Promise.all([api.salvarFicha(fixture()), api.salvarFicha(fixture({ id: 'segunda' }))]); });
  expect(api.fichas).toHaveLength(2);
});

test('autosave espera cinco segundos e não repete sem mudanças', async () => {
  const repo = new FichasIndexedDB();
  await mount(repo);
  await act(async () => { await api.salvarFicha(fixture()); });
  const save = jest.spyOn(repo, 'save');
  jest.useFakeTimers({ doNotFake: ['setImmediate'] });
  await act(async () => { api.ficha.nomePersonagem = 'Automática'; });
  act(() => jest.advanceTimersByTime(4999));
  expect(save).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(1));
  jest.useRealTimers();
  await waitFor(() => expect(api.status).toBe('salvo'));
  expect(save).toHaveBeenCalledTimes(1);
  expect((await repo.get('sintetica-1')).nomePersonagem).toBe('Automática');
});

test('falha de gravação preserva alterações e permite tentar novamente', async () => {
  const repo = new FichasIndexedDB();
  await mount(repo);
  await act(async () => { await api.salvarFicha(fixture()); });
  const save = jest.spyOn(repo, 'save').mockRejectedValueOnce(new Error('Sem espaço'));
  await act(async () => { api.ficha.nomePersonagem = 'Pendente'; expect(await api.salvarPendentes()).toBe(false); });
  expect(screen.getByRole('alert')).toHaveTextContent('Sem espaço');
  expect((await repo.get('sintetica-1')).nomePersonagem).toBe('Antes');
  save.mockRestore();
  await act(async () => { expect(await api.tentarSalvar()).toBe(true); });
  expect((await repo.get('sintetica-1')).nomePersonagem).toBe('Pendente');
});

test('falha de leitura bloqueia o editor; recuperação preserva o legado', async () => {
  localStorage.setItem('fichas', '[corrompido');
  render(<FichaProvider><Probe /></FichaProvider>);
  await screen.findByText(/Gravações bloqueadas/);
  expect(screen.queryByText('Editor pronto')).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox'), { target: { value: JSON.stringify([fixture()]) } });
  fireEvent.click(screen.getByText('Validar e recuperar coleção'));
  await screen.findByText('Editor pronto');
  expect(api.fichas).toHaveLength(1);
  expect(localStorage.getItem('fichas')).toBe('[corrompido');
});

test('colisão exige escolha; substituição explícita e importação inválida', async () => {
  await mount(new FichasIndexedDB());
  await act(async () => { await api.salvarFicha(fixture()); });
  await act(async () => { expect(await api.importarFicha(exportFicha(fixture()))).toBeNull(); });
  await act(async () => { expect(await api.importarFicha('{}')).toBeNull(); });
  await act(async () => { await api.importarFicha(exportFicha(fixture({ nomePersonagem: 'Importada' })), 'substituir'); });
  expect(api.fichas).toHaveLength(1);
  expect(api.ficha.nomePersonagem).toBe('Importada');
});

test('edição durante gravação permanece pendente e é salva antes de sair', async () => {
  const repo = new FichasIndexedDB();
  await mount(repo);
  await act(async () => { await api.salvarFicha(fixture()); });
  const original = repo.save.bind(repo);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  jest.spyOn(repo, 'save').mockImplementationOnce(async (...args) => { await gate; return original(...args); });
  let pending;
  await act(async () => { api.ficha.nomePersonagem = 'Primeira'; pending = api.tentarSalvar(); });
  await act(async () => { api.ficha.nomePersonagem = 'Mais recente'; });
  await act(async () => { release(); await pending; });
  expect(api.status).toBe('sujo');
  await act(async () => { expect(await api.salvarPendentes()).toBe(true); });
  expect((await repo.get('sintetica-1')).nomePersonagem).toBe('Mais recente');
});

test.each(['pagehide', 'visibilitychange', 'beforeunload', 'unmount'])('%s inicia gravação das pendências', async event => {
  const repo = new FichasIndexedDB();
  const view = await mount(repo);
  await act(async () => { await api.salvarFicha(fixture()); });
  await act(async () => { api.ficha.nomePersonagem = 'Ao sair'; });
  jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  await act(async () => {
    if (event === 'unmount') view.unmount();
    else (event === 'visibilitychange' ? document : window).dispatchEvent(new Event(event));
  });
  await waitFor(async () => expect((await repo.get('sintetica-1')).nomePersonagem).toBe('Ao sair'));
});

test('StrictMode não duplica inicialização ou migração e preserva o legado', async () => {
  const raw = JSON.stringify([fixture()]);
  localStorage.setItem('fichas', raw);
  const repo = new FichasIndexedDB();
  render(<React.StrictMode><FichaProvider repository={repo}><Probe /></FichaProvider></React.StrictMode>);
  expect(screen.queryByText('Editor pronto')).not.toBeInTheDocument();
  await screen.findByText('Editor pronto');
  expect((await repo.load()).fichas).toHaveLength(1);
  expect(localStorage.getItem('fichas')).toBe(raw);
});
