import { FichasIndexedDB } from '../api/fichaPersonagem/fichasIndexedDB';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { exportFicha } from '../api/fichaPersonagem/fichaStorage';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});
afterEach(() => { jest.restoreAllMocks(); window.innerWidth = 1024; });

async function entrar(user) {
  await user.click(await screen.findByRole('link', { name: /Área do Jogador/ }));
  await waitFor(() => expect(window.location.pathname).toBe('/criar-ficha'));
  expect(await screen.findByRole('dialog', { name: 'Criador de Fichas de RPG' })).toBeInTheDocument();
}
async function criar(user, edition = '2024') {
  await user.click(screen.getByRole('button', { name: 'Criar Nova Ficha' }));
  await user.click(screen.getByRole('button', { name: new RegExp(`Regras ${edition}`) }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}
async function sair(user) {
  await user.click(screen.getByRole('button', { name: 'Menu da ficha' }));
  await user.click(screen.getByRole('button', { name: 'Sair' }));
  await waitFor(() => expect(window.location.pathname).toBe('/'));
}

test('popup exige escolher uma opcao e nao exibe Fichas ou Fechar', async () => {
  const user = userEvent.setup();
  render(<App />);
  await entrar(user);
  expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Fichas', hidden: true })).not.toBeInTheDocument();
  await user.keyboard('{Escape}');
  fireEvent.click(screen.getByTestId('fichas-overlay'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(localStorage.getItem('fichas')).toBeNull();
  await criar(user);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test.each([390, 1280])('modal preserva edição ao fechar, trocar ficha e sair (%s px)', async width => {
  window.innerWidth = width;
  const user = userEvent.setup();
  render(<App />);
  await entrar(user);
  await criar(user, '2014');
  if (width <= 768) await user.click(screen.getByRole('button', { name: 'Informações' }));
  await user.type(screen.getByPlaceholderText('Nome do Personagem'), 'Aria');
  await user.tab();
  await sair(user); await entrar(user);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getAllByRole('button', { name: /Aria:|Aria editada:/ })[0]);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  if (width <= 768) await user.click(screen.getByRole('button', { name: 'Informações' }));
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue('Aria');
  await sair(user); await entrar(user);
  await criar(user);
  await sair(user); await entrar(user);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getByText(/Aria:/));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  if (width <= 768) await user.click(screen.getByRole('button', { name: 'Informações' }));
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue('Aria');
  await user.clear(screen.getByPlaceholderText('Nome do Personagem'));
  await user.type(screen.getByPlaceholderText('Nome do Personagem'), 'Aria editada');
  await sair(user);
  expect(window.location.pathname).toBe('/');
  expect((await new FichasIndexedDB().load()).fichas).toHaveLength(2);
  expect((await new FichasIndexedDB().load()).fichas.some(f => f.nomePersonagem === 'Aria editada')).toBe(true);
  await entrar(user);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getByText(/Aria editada:/));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  if (width <= 768) await user.click(screen.getByRole('button', { name: 'Informações' }));
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue('Aria editada');
});

test('falha ao salvar impede sair; edição continua disponível', async () => {
  const user = userEvent.setup();
  render(<App />);
  await entrar(user); await criar(user);
  jest.spyOn(FichasIndexedDB.prototype, 'save').mockImplementation(() => { throw new Error('Sem espaço'); });
  await user.type(screen.getByPlaceholderText('Nome do Personagem'), 'Pendente');
  await user.click(screen.getByRole('button', { name: 'Menu da ficha' }));
  await user.click(screen.getByRole('button', { name: 'Sair' }));
  await screen.findByRole('alert');
  expect(window.location.pathname).toBe('/criar-ficha');
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue('Pendente');

});

test('rota antiga redireciona ao editor e abre modal', async () => {
  window.history.replaceState({}, '', '/jogador');
  render(<App />);
  await waitFor(() => expect(window.location.pathname).toBe('/criar-ficha'));
  expect(await screen.findByRole('dialog', { name: 'Criador de Fichas de RPG' })).toBeInTheDocument();
});

test('mestre abre gerenciador acessível e oferece Sair no menu', async () => {
  window.history.replaceState({}, '', '/mestre');
  const user = userEvent.setup();
  render(<App />);
  expect(await screen.findByRole('dialog', { name: 'Gerenciador de Campanhas' }, { timeout: 10000 })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Selecionar área/, hidden: true })).not.toBeInTheDocument();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: 'Menu do mestre' }));
  await user.keyboard('{Escape}');
  expect(screen.getByRole('button', { name: 'Menu do mestre' })).toHaveFocus();
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: 'Sair' }));
  await waitFor(() => expect(window.location.pathname).toBe('/'));
  expect(window.location.pathname).toBe('/');
  expect(localStorage.getItem('fichas')).toBeNull();
});

test('redimensionar mantem o popup aberto', async () => {
  const user = userEvent.setup();
  render(<App />);
  await entrar(user);
  window.innerWidth = 390;
  fireEvent(window, new Event('resize'));
  expect(screen.getByRole('heading', { name: 'Criador de Fichas de RPG' })).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('importação resolve colisão como cópia e exclusão mantém a ficha original', async () => {
  const user = userEvent.setup();
  render(<App />);
  await entrar(user); await criar(user);
  const original = (await new FichasIndexedDB().load()).fichas[0];
  await sair(user); await entrar(user);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.upload(screen.getByLabelText('Importar ficha JSON'), new File([exportFicha(original)], 'ficha.json', { type: 'application/json' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar Importação' }));
  await user.click(await screen.findByRole('button', { name: 'Importar como cópia' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const salvo = (await new FichasIndexedDB().load());
  expect(salvo.fichas).toHaveLength(2);
  expect(new Set(salvo.fichas.map(f => f.id)).size).toBe(2);
  await sair(user); await entrar(user);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getAllByRole('button', { name: /Excluir Ficha sem Nome/ })[1]);
  expect(screen.getByRole('dialog', { name: 'Excluir ficha?' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Excluir ficha', exact: true }));
  await waitFor(async () => expect((await new FichasIndexedDB().load()).fichas.map(f => f.id)).toEqual([original.id]));
  await user.click(screen.getByRole('button', { name: /Ficha sem Nome:/ }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.queryByRole('heading', { name: 'Área do Jogador' })).not.toBeInTheDocument();
});
