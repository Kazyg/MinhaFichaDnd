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
  expect(screen.getByRole('region', { name: 'Imagens do combate' })).toBeInTheDocument();
  rerender(<VisaoJogadores visao={{ ...visao, combate: null }} />);
  expect(screen.queryByRole('region', { name: 'Imagens do combate' })).not.toBeInTheDocument();
});
