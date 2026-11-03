import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GerenciarFichas from './GerenciarFichas';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';

jest.mock('../../api/fichaPersonagem/FichaContext', () => ({ useFicha: jest.fn() }));

const ficha = { id: 'salva', nomePersonagem: 'Aria', versaoRegras: 'DND_2024' };
let excluir;
let salvarPendentes;

beforeEach(() => {
  excluir = jest.fn().mockResolvedValue(true);
  salvarPendentes = jest.fn().mockResolvedValue(true);
  useFicha.mockImplementation(() => ({ fichas: [ficha], deletarFicha: excluir, salvarPendentes }));
});

async function abrirConfirmacao() {
  const user = userEvent.setup();
  render(<GerenciarFichas onClose={jest.fn()} />);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getByRole('button', { name: 'Excluir Aria' }));
  return user;
}

test('abre confirmação com nome e descrição, cancela e restaura foco por teclado', async () => {
  const user = await abrirConfirmacao();
  const dialog = screen.getByRole('dialog', { name: 'Excluir ficha?' });
  expect(dialog).toHaveAccessibleDescription("Tem certeza de que deseja excluir a ficha 'Aria'? Esta ação não pode ser desfeita.");
  expect(within(dialog).getByRole('heading')).toHaveFocus();
  expect(excluir).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.queryByRole('dialog', { name: 'Excluir ficha?' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Excluir Aria' })).toHaveFocus();
  expect(salvarPendentes).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: 'Excluir ficha?' })).not.toBeInTheDocument();
  expect(excluir).not.toHaveBeenCalled();
});

test('aguarda persistência, bloqueia confirmação duplicada e fecha após sucesso', async () => {
  let concluir;
  excluir.mockImplementation(() => new Promise(resolve => { concluir = resolve; }));
  const user = await abrirConfirmacao();
  const confirmar = screen.getByRole('button', { name: 'Excluir ficha' });
  fireEvent.click(confirmar);
  fireEvent.click(confirmar);
  await waitFor(() => expect(excluir).toHaveBeenCalledTimes(1));
  expect(excluir).toHaveBeenCalledWith(ficha.id);
  expect(salvarPendentes).toHaveBeenCalledTimes(1);
  expect(confirmar).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Excluindo ficha');
  await user.keyboard('{Escape}');
  expect(screen.getByRole('dialog', { name: 'Excluir ficha?' })).toBeInTheDocument();
  await act(async () => concluir(true));
  expect(screen.queryByRole('dialog', { name: 'Excluir ficha?' })).not.toBeInTheDocument();
});

test.each(['retorno falso', 'exceção'])('preserva ficha, anuncia erro e permite tentar novamente em %s', async modo => {
  if (modo === 'exceção') excluir.mockRejectedValueOnce(new Error('Falha no IndexedDB'));
  else excluir.mockResolvedValueOnce(false);
  const user = await abrirConfirmacao();
  await user.click(screen.getByRole('button', { name: 'Excluir ficha' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível excluir a ficha. Tente novamente.');
  expect(screen.getByRole('dialog', { name: 'Excluir ficha?' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Excluir ficha' })).toBeEnabled();
  await user.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByRole('button', { name: 'Excluir Aria' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Excluir Aria' }));
  await user.click(screen.getByRole('button', { name: 'Excluir ficha' }));
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Excluir ficha?' })).not.toBeInTheDocument());
  expect(excluir).toHaveBeenCalledTimes(2);
  expect(excluir).toHaveBeenLastCalledWith(ficha.id);
});

test('não exclui se alterações pendentes não puderem ser salvas', async () => {
  salvarPendentes.mockResolvedValue(false);
  const user = await abrirConfirmacao();
  await user.click(screen.getByRole('button', { name: 'Excluir ficha' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível salvar as alterações pendentes');
  expect(excluir).not.toHaveBeenCalled();
});

test('acompanha a listagem atualizada pelo serviço existente após excluir', async () => {
  function Harness() {
    const [fichas, setFichas] = useState([ficha]);
    useFicha.mockReturnValue({ fichas, salvarPendentes, deletarFicha: async id => {
      const sucesso = await excluir(id);
      if (sucesso) setFichas([]);
      return sucesso;
    } });
    return <GerenciarFichas onClose={jest.fn()} />;
  }
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Carregar Ficha Salva' }));
  await user.click(screen.getByRole('button', { name: 'Excluir Aria' }));
  await user.click(screen.getByRole('button', { name: 'Excluir ficha' }));
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Excluir ficha?' })).not.toBeInTheDocument());
  expect(screen.queryByRole('button', { name: 'Excluir Aria' })).not.toBeInTheDocument();
  expect(screen.getByRole('dialog', { name: 'Selecione uma Ficha' })).toBeInTheDocument();
});
