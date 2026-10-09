import React, { useState } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import AccessibleDialog from './components/AccessibleDialog';
import ModalSelecaoTalento from './modals/ModalSelecaoTalento';
import ModalSelecaoIdioma from './modals/ModalSelecaoIdiomas';
import { FichaProvider } from '../api/fichaPersonagem/FichaContext';

beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); });

test.each(['2014', '2024'])('criar, cancelar, abrir e reabrir usando apenas teclado: %s', async edition => {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.tab();
  expect(screen.getByRole('button', { name: 'Carregar Ficha Salva' })).toHaveFocus();
  await user.tab();
  const create = screen.getByRole('button', { name: 'Criar Nova Ficha' });
  await user.keyboard('{Enter}');
  const dialog = screen.getByRole('dialog', { name: 'Escolha as regras da ficha' });
  expect(within(dialog).getByRole('heading')).toHaveFocus();
  await user.tab({ shift: true });
  expect(within(dialog).getByRole('button', { name: 'Fechar' })).toHaveFocus();
  await user.tab();
  expect(within(dialog).getByRole('button', { name: /Regras 2024/ })).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(create).toHaveFocus();
  await user.keyboard(' ');
  await user.tab();
  if (edition === '2014') await user.tab();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Menu da ficha' })).toHaveFocus();
  expect(screen.getByRole('textbox', { name: 'Nome' })).toBeInTheDocument();
  view.unmount();
  window.history.replaceState({}, '', '/');
  render(<App />);
  await user.tab();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('dialog', { name: 'Selecione uma Ficha' })).toBeInTheDocument();
  expect(screen.getByLabelText('Importar ficha JSON')).toBeInTheDocument();
  await user.tab();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Menu da ficha' })).toHaveFocus();
});

test('seleciona talento por teclado, anuncia seleção e retorna ao acionador', async () => {
  const user = userEvent.setup();
  const selected = jest.fn();
  const talent = { id: 'teste', revisao: '1', edicao: 'DND_2024', nome: 'Talento de teste', suportado: true,
    descricao: 'Descrição longa '.repeat(100), requisito: {}, fonte: {}, categoria: 'geral' };
  function Harness() {
    const [open, setOpen] = useState(false);
    return <><button onClick={() => setOpen(true)}>Talento</button>{open &&
      <ModalSelecaoTalento titulo="Talentos" opcoes={[talent]} onSelect={selected} onClose={() => setOpen(false)} />}</>;
  }
  render(<Harness />);
  await user.tab(); await user.keyboard('{Enter}'); await user.tab();
  expect(screen.getByRole('textbox', { name: 'Filtrar talentos...' })).toHaveFocus();
  await user.tab(); await user.keyboard(' ');
  expect(screen.getByRole('button', { name: talent.nome })).toHaveAttribute('aria-pressed', 'true');
  await user.tab(); await user.tab(); await user.keyboard('{Enter}');
  expect(selected).toHaveBeenCalledWith(talent, []);
  expect(screen.getByRole('button', { name: 'Talento' })).toHaveFocus();
});

test('atualização não reinicia foco; remoção do controle e desmontagem têm destino', async () => {
  const user = userEvent.setup();
  function Harness() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [removed, setRemoved] = useState(false);
    return <><button onClick={() => setOpen(true)}>Abrir</button>{open && <AccessibleDialog aria-label="Teste" onClose={() => setOpen(false)}>
      <h2>Teste</h2><button onClick={() => setCount(count + 1)}>Atualizar {count}</button>
      {!removed && <button onClick={() => setRemoved(true)}>Remover</button>}
      <button onClick={() => setOpen(false)}>Fechar</button>
    </AccessibleDialog>}</>;
  }
  render(<Harness />);
  await user.tab(); await user.keyboard('{Enter}'); await user.tab(); await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Atualizar 1' })).toHaveFocus();
  expect(screen.getByText('Abrir')).toHaveAttribute('inert');
  await user.tab(); await user.keyboard('{Enter}');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Teste' })).toHaveFocus());
  await user.keyboard('{Escape}');
  expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Abrir' })).not.toHaveAttribute('inert');
});

test('menu expõe estado, fecha por Escape e omite ações simuladas', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Criar Nova Ficha' }));
  await user.click(screen.getByRole('button', { name: /Regras 2014/ }));
  const menu = screen.getByRole('button', { name: 'Menu da ficha' });
  await user.keyboard('{Enter}');
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByText('Exportar XML')).not.toBeInTheDocument();
  expect(screen.queryByText('Mapear PDF')).not.toBeInTheDocument();
  await user.tab(); await user.keyboard('{Escape}');
  expect(menu).toHaveFocus();
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  await user.click(screen.getByRole('button', { name: 'Ajustar vida' }));
  expect(screen.getByRole('slider', { name: 'Pontos de vida atuais' })).toBeInTheDocument();
  expect(screen.getByRole('spinbutton', { name: 'Dano' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.getByRole('button', { name: 'Ajustar vida' })).toHaveFocus();
});

test('idioma permite cancelar sem alterar e confirmar por teclado', async () => {
  const user = userEvent.setup();
  const selected = jest.fn();
  function Harness() {
    const [open, setOpen] = useState(false);
    return <FichaProvider><button onClick={() => setOpen(true)}>Idioma</button>{open &&
      <ModalSelecaoIdioma titulo="Idioma" idiomaInicial={null} idiomasPermitidos={['Élfico']}
        onSelect={selected} onClose={() => setOpen(false)} />}</FichaProvider>;
  }
  render(<Harness />);
  await user.tab(); await user.keyboard('{Enter}'); await user.tab();
  expect(screen.getByRole('textbox', { name: 'Filtrar idiomas...' })).toHaveFocus();
  await user.tab(); await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Élfico' })).toHaveAttribute('aria-pressed', 'true');
  await user.keyboard('{Escape}');
  expect(selected).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Idioma' })).toHaveFocus();
  await user.keyboard('{Enter}'); await user.tab(); await user.tab(); await user.keyboard(' ');
  await user.tab(); await user.keyboard('{Enter}');
  expect(selected).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Élfico' }));
  expect(screen.getByRole('button', { name: 'Idioma' })).toHaveFocus();
});

test('erro de importação fica associado ao campo no diálogo', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  const input = screen.getByLabelText('Importar ficha JSON');
  await user.upload(input, new File(['{ inválido'], 'teste.json', { type: 'application/json' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar Importação' }));
  await screen.findByRole('alert');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription(screen.getByRole('alert').textContent);
});
