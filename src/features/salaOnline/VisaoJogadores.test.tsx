import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VisaoJogadores from './VisaoJogadores';
import { VisaoSala } from './compartilhamento';

jest.mock('./cliente', () => ({ obterCliente: jest.fn() }));
jest.mock('../areaMestre/ui/VisualizadorDocumento', () => () => <div>Documento</div>);
const visao: VisaoSala = { nome: 'Mesa', jogadores: [{ id: 'j0', nome: 'Lia', pv: { atuais: 7, maximos: 20 }, ficha: null, retrato: null }], combate: { imagens: [{ id: 'm0', retrato: null }] } };
test('mostra vida do grupo sem controles de edição nem estatísticas dos monstros', () => {
  const { rerender } = render(<VisaoJogadores visao={visao} />);
  expect(screen.getByLabelText('Vida de Lia: 7 de 20')).toBeInTheDocument();
  expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Roda do combate' })).toBeInTheDocument();
  rerender(<VisaoJogadores visao={{ ...visao, combate: null }} />);
  expect(screen.queryByRole('region', { name: 'Roda do combate' })).not.toBeInTheDocument();
});

test('roda mostra participantes públicos e destaca o turno sem controles de mestre', () => {
  const { rerender } = render(<VisaoJogadores visao={{ ...visao, combate: { imagens: [{ id: 'm0', retrato: null }], roda: { rodada: 3, ordem: ['j0','m0'], ativo: 'j0' } } }} />);
  expect(screen.getByText('Rodada 3')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(5);
  expect(screen.getAllByRole('listitem')[2]).toHaveAttribute('aria-current', 'step');
  expect(screen.getAllByText('Monstro revelado').length).toBeGreaterThan(0);
  expect(screen.queryByRole('button', { name: /Reorganizar/ })).not.toBeInTheDocument();
  expect(screen.queryByText('PV 1/1')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /avançar|encerrar/i })).not.toBeInTheDocument();
  rerender(<VisaoJogadores visao={{ ...visao, combate: { imagens: [], roda: { rodada: 3, ordem: ['j0'], ativo: null } } }} />);
  expect(screen.queryByText('Monstro revelado')).not.toBeInTheDocument();
  expect(screen.queryByText('Sua vez')).not.toBeInTheDocument();
});

test('retrato amplia e fecha automaticamente quando o mestre oculta o monstro', async () => {
  const createURL = URL.createObjectURL; const revokeURL = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:retrato'); URL.revokeObjectURL = jest.fn();
  try {
    const arquivo = { id: 'retrato', mime: 'image/png', nome: 'Retrato' };
    const carregar = jest.fn().mockResolvedValue(new Blob(['imagem'], { type: 'image/png' }));
    const { rerender } = render(<VisaoJogadores carregar={carregar} visao={{ ...visao, combate: { imagens: [{ id: 'm0', retrato: arquivo }] } }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ampliar retrato do monstro 1' }));
    await screen.findByRole('img', { name: 'Retrato do monstro ampliado' });
    fireEvent.click(screen.getByRole('button', { name: 'Fechar retrato' }));
    expect(screen.queryByRole('dialog', { name: 'Retrato do monstro' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ampliar retrato do monstro 1' }));
    await screen.findByRole('img', { name: 'Retrato do monstro ampliado' });
    rerender(<VisaoJogadores carregar={carregar} visao={{ ...visao, combate: { imagens: [] } }} />);
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Retrato do monstro' })).not.toBeInTheDocument());
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  } finally { URL.createObjectURL = createURL; URL.revokeObjectURL = revokeURL; }
});
