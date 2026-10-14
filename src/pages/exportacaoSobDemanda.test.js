import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../utils/exportarFichaPdf', () => ({ exportarFichaPdf: jest.fn() }));

test('PDF carrega pela ação, mantém tratamento de falha e permite tentar novamente', async () => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Criar Nova Ficha' }));
  await user.click(screen.getByRole('button', { name: /Regras 2014/ }));
  const { exportarFichaPdf } = await import('../utils/exportarFichaPdf');
  expect(exportarFichaPdf).not.toHaveBeenCalled();
  exportarFichaPdf.mockRejectedValueOnce(new Error('Falha de rede'));
  await user.click(screen.getByRole('button', { name: 'Menu da ficha' }));
  await user.click(screen.getByRole('button', { name: 'Exportar PDF' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível exportar o PDF');
  exportarFichaPdf.mockResolvedValueOnce(undefined);
  await user.click(screen.getByRole('button', { name: 'Menu da ficha' }));
  expect(screen.getByRole('button', { name: 'Exportar JSON' })).toBeEnabled();
  await user.click(screen.getByRole('button', { name: 'Exportar PDF' }));
  await waitFor(() => expect(exportarFichaPdf).toHaveBeenCalledTimes(2));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
