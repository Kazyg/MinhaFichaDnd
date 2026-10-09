import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { parseCollection } from './api/fichaPersonagem/fichaStorage';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

test('exibe a home e o estado de salvamento', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Criador de Fichas de RPG/i })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Salvo neste navegador');
});

test('fechar a seleção de edição não cria ficha', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /Criar Nova Ficha/i }));
  expect(screen.getByRole('heading', { name: 'Escolha as regras da ficha' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(screen.queryByRole('heading', { name: 'Escolha as regras da ficha' })).not.toBeInTheDocument();
  expect(localStorage.getItem('fichas')).toBeNull();
  expect(window.location.pathname).toBe('/');
});

test.each(['2014', '2024'])('cria e reabre uma ficha da edição %s', async edition => {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(screen.getByRole('button', { name: /Criar Nova Ficha/i }));
  await user.click(screen.getByRole('button', { name: new RegExp(`Regras ${edition}`) }));
  expect(window.location.pathname).toBe('/criar-ficha');
  const name = screen.getByPlaceholderText('Nome do Personagem');
  await user.type(name, `Aventureira sintética ${edition}`);
  view.unmount();
  const saved = parseCollection(localStorage.getItem('fichas'));
  expect(saved.fichas).toHaveLength(1);
  expect(saved.fichas[0].versaoRegras).toBe(`DND_${edition}`);
  expect(saved.fichas[0].nomePersonagem).toBe(`Aventureira sintética ${edition}`);
  window.history.replaceState({}, '', '/');
  render(<App />);
  await user.click(screen.getByRole('button', { name: /Carregar Ficha Salva/i }));
  await user.click(screen.getByText(new RegExp(`Aventureira sintética ${edition}:`)));
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue(`Aventureira sintética ${edition}`);
});

test('dados corrompidos mostram recuperação sem perder os bytes originais', () => {
  localStorage.setItem('fichas', '[corrompido');
  render(<App />);
  expect(screen.queryByRole('button', { name: /Criar Nova Ficha/i })).not.toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
  expect(localStorage.getItem('fichas')).toBe('[corrompido');
  expect(screen.getByText(/Gravações bloqueadas/)).toBeInTheDocument();
});
