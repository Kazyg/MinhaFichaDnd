import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import NomePersonagem from './NomePersonagem';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('aguarda uma pausa na digitação sem salvar cada letra', () => {
  const salvar = jest.fn();
  render(<NomePersonagem nome="" onSave={salvar} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'A' } });
  act(() => { jest.advanceTimersByTime(600); });
  fireEvent.change(input, { target: { value: 'Aragorn' } });
  act(() => { jest.advanceTimersByTime(799); });
  expect(salvar).not.toHaveBeenCalled();
  expect(input).toHaveValue('Aragorn');
  act(() => { jest.advanceTimersByTime(1); });
  expect(salvar).toHaveBeenCalledTimes(1);
  expect(salvar).toHaveBeenCalledWith('Aragorn');
});

test('confirma ao perder foco e cancela o salvamento pendente', () => {
  const salvar = jest.fn();
  render(<NomePersonagem nome="Antigo" onSave={salvar} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
  fireEvent.blur(screen.getByRole('textbox'));
  act(() => { jest.runOnlyPendingTimers(); });
  expect(salvar).toHaveBeenCalledTimes(1);
  expect(salvar).toHaveBeenCalledWith('');
});

test('confirma alterações ao desmontar o campo', () => {
  const salvar = jest.fn();
  const view = render(<NomePersonagem nome="" onSave={salvar} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Elrond' } });
  view.unmount();
  act(() => { jest.runOnlyPendingTimers(); });
  expect(salvar).toHaveBeenCalledTimes(1);
  expect(salvar).toHaveBeenCalledWith('Elrond');
});
