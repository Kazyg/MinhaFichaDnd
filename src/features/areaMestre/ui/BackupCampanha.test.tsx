import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BackupCampanha from './BackupCampanha';
import { exportarBackup } from '../backup';
import { DadosCampanha } from '../modelos';

jest.mock('../backup', () => ({ exportarBackup: jest.fn() }));
const exportar = exportarBackup as jest.MockedFunction<typeof exportarBackup>;
const dados = { campanha: { id: 'c' } } as DadosCampanha;
const criarAnterior = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
const revogarAnterior = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
beforeEach(() => {
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:backup') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
  exportar.mockReset();
});
afterEach(() => {
  cleanup();
  if (criarAnterior) Object.defineProperty(URL, 'createObjectURL', criarAnterior); else Reflect.deleteProperty(URL, 'createObjectURL');
  if (revogarAnterior) Object.defineProperty(URL, 'revokeObjectURL', revogarAnterior); else Reflect.deleteProperty(URL, 'revokeObjectURL');
});

test('exporta apenas após salvar e libera o ZIP temporário ao fechar', async () => {
  const salvar = jest.fn(async () => true);
  exportar.mockResolvedValue(new Blob(['ZIP']));
  const { unmount } = render(<BackupCampanha modo="exportar" dados={dados} onPrepararExportacao={salvar} onRestaurar={jest.fn()} onFechar={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Gerar backup' }));
  expect(await screen.findByRole('link', { name: 'Baixar backup ZIP' })).toHaveAttribute('href', 'blob:backup');
  expect(salvar).toHaveBeenCalledTimes(1); expect(exportar).toHaveBeenCalledWith(dados);
  unmount(); expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:backup');
});

test('não exporta quando alterações pendentes não puderam ser salvas', async () => {
  render(<BackupCampanha modo="exportar" dados={dados} onPrepararExportacao={async () => false} onRestaurar={jest.fn()} onFechar={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Gerar backup' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Salve as alterações');
  expect(exportar).not.toHaveBeenCalled();
});

test('selecionar ZIP não grava; confirmação restaura e erro mantém arquivo para retry', async () => {
  const restaurar = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const fechar = jest.fn();
  render(<BackupCampanha modo="restaurar" dados={null} onPrepararExportacao={jest.fn()} onRestaurar={restaurar} onFechar={fechar} />);
  const arquivo = new File(['ZIP'], 'campanha.zip', { type: 'application/zip' });
  fireEvent.change(screen.getByLabelText('Arquivo de backup'), { target: { files: [arquivo] } });
  expect(restaurar).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Restaurar como nova campanha' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível restaurar');
  expect(fechar).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Restaurar como nova campanha' }));
  await waitFor(() => expect(fechar).toHaveBeenCalledTimes(1));
  expect(restaurar).toHaveBeenLastCalledWith(arquivo);
});
