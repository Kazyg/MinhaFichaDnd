import { FichasIndexedDB } from './api/fichaPersonagem/fichasIndexedDB';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/criar-ficha');
});

test('exibe a modal inicial sem faixa de salvamento quando não há pendências', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /Criador de Fichas de RPG/i })).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('fechar a seleção de edição não cria ficha', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(await screen.findByRole('button', { name: /Criar Nova Ficha/i }));
  expect(screen.getByRole('heading', { name: 'Escolha as regras da ficha' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Voltar' }));
  expect(screen.queryByRole('heading', { name: 'Escolha as regras da ficha' })).not.toBeInTheDocument();
  expect(localStorage.getItem('fichas')).toBeNull();
  expect((await new FichasIndexedDB().load()).fichas).toHaveLength(0);
  expect(window.location.pathname).toBe('/criar-ficha');
});

test.each(['2014', '2024'])('cria e reabre uma ficha da edição %s', async edition => {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(await screen.findByRole('button', { name: /Criar Nova Ficha/i }));
  await user.click(screen.getByRole('button', { name: new RegExp(`Regras ${edition}`) }));
  expect(window.location.pathname).toBe('/criar-ficha');
  const name = await screen.findByPlaceholderText('Nome do Personagem');
  await user.type(name, `Aventureira sintética ${edition}`);
  await user.tab();
  view.unmount();
  await waitFor(async () => expect((await new FichasIndexedDB().load()).fichas[0]?.nomePersonagem).toBe(`Aventureira sintética ${edition}`));
  const saved = (await new FichasIndexedDB().load());
  expect(saved.fichas).toHaveLength(1);
  expect(saved.fichas[0].versaoRegras).toBe(`DND_${edition}`);
  expect(saved.fichas[0].nomePersonagem).toBe(`Aventureira sintética ${edition}`);
  window.history.replaceState({ usr: { abrirFichas: true } }, '', '/criar-ficha');
  render(<App />);
  await user.click(await screen.findByRole('button', { name: /Carregar Ficha Salva/i }));
  await user.click(screen.getByText(new RegExp(`Aventureira sintética ${edition}:`)));
  expect(await screen.findByPlaceholderText('Nome do Personagem')).toHaveValue(`Aventureira sintética ${edition}`);
});

test('dados corrompidos mostram recuperação sem perder os bytes originais', async () => {
  localStorage.setItem('fichas', '[corrompido');
  render(<App />);
  expect(screen.queryByRole('button', { name: /Criar Nova Ficha/i })).not.toBeInTheDocument();
  expect(window.location.pathname).toBe('/criar-ficha');
  expect(localStorage.getItem('fichas')).toBe('[corrompido');
  expect(await screen.findByText(/Gravações bloqueadas/)).toBeInTheDocument();
});
