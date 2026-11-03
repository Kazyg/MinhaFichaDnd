import { render, screen } from '@testing-library/react';
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
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
  expect(screen.getByText('Monstro revelado')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /avançar|encerrar/i })).not.toBeInTheDocument();
  rerender(<VisaoJogadores visao={{ ...visao, combate: { imagens: [], roda: { rodada: 3, ordem: ['j0'], ativo: null } } }} />);
  expect(screen.queryByText('Monstro revelado')).not.toBeInTheDocument();
  expect(screen.queryByText('Sua vez')).not.toBeInTheDocument();
});
