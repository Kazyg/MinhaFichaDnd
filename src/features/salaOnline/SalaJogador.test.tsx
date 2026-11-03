import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SalaJogador from './SalaJogador';
import { lerMembros, lerSala, observarSala, obterCliente, rpc } from './cliente';

jest.mock('./provisionamento', () => ({ garantirIdentidade: jest.fn().mockResolvedValue({ id: 'visitante' }) }));
jest.mock('./cliente', () => ({ salaConfigurada: () => true, lerMembros: jest.fn(), lerSala: jest.fn(), observarSala: jest.fn(), obterCliente: jest.fn(), rpc: jest.fn() }));
jest.mock('./VisaoJogadores', () => ({ __esModule: true, default: ({ visao }: { visao: { nome: string } }) => <div>Grupo compartilhado: {visao.nome}</div> }));
const sala = { id: 'sala-1', aberta: true, visao: { nome: 'Aventura' }, atualizada_em: new Date().toISOString(), mestre_visto_em: new Date().toISOString() };
let atualizar: () => void;
beforeEach(() => {
  jest.clearAllMocks(); sessionStorage.clear(); window.location.hash = 'convite=abc';
  (obterCliente as jest.Mock).mockReturnValue({ auth: { getSession: async () => ({ data: { session: null } }), signInAnonymously: jest.fn(async () => ({ error: null })), getUser: async () => ({ data: { user: { id: 'visitante' } }, error: null }) } });
  (observarSala as jest.Mock).mockImplementation((_id, fn) => { atualizar = fn; return jest.fn(); });
  (rpc as jest.Mock).mockResolvedValue('sala-1');
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'pendente' }]);
  (lerSala as jest.Mock).mockResolvedValue(sala);
});
test('nome cria solicitação; só carrega o grupo após aprovação e limpa após revogação', async () => {
  render(<MemoryRouter><SalaJogador /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Lia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Solicitar entrada' }));
  await screen.findByText('Aguardando a aprovação do mestre…');
  expect(lerSala).not.toHaveBeenCalled();
  expect(rpc).toHaveBeenCalledWith('sala_pedir_entrada', { p_convite: 'abc', p_nome: 'Lia' });
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'aprovado' }]);
  await act(async () => atualizar());
  await screen.findByText('Grupo compartilhado: Aventura');
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'revogado' }]);
  await act(async () => atualizar());
  await waitFor(() => expect(screen.queryByText('Grupo compartilhado: Aventura')).not.toBeInTheDocument());
  expect(screen.getByLabelText('Seu nome')).toHaveValue('');
  expect(sessionStorage.getItem('sala-convite-abc')).toBeNull();
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'pendente' }]);
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Lia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Solicitar entrada' }));
  await screen.findByText('Aguardando a aprovação do mestre…');
  expect((rpc as jest.Mock).mock.calls.filter(([name]) => name === 'sala_pedir_entrada')).toHaveLength(2);
  expect(screen.queryByText('Grupo compartilhado: Aventura')).not.toBeInTheDocument();
});
test('falha de rede sinaliza última atualização sem fingir sincronização', async () => {
  sessionStorage.setItem('sala-convite-abc','sala-1');
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'aprovado' }]);
  render(<MemoryRouter><SalaJogador /></MemoryRouter>);
  await screen.findByText('Grupo compartilhado: Aventura');
  (lerMembros as jest.Mock).mockRejectedValue(new Error('Sem rede'));
  await act(async () => atualizar());
  await screen.findByText(/Reconectando · dados podem estar desatualizados/);
  expect(screen.getByText('Grupo compartilhado: Aventura')).toBeInTheDocument();
});

test('convite inválido não abre campanha nem carrega dados', async () => {
  (rpc as jest.Mock).mockRejectedValue(new Error('Convite indisponível ou novas entradas bloqueadas.'));
  render(<MemoryRouter><SalaJogador /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Lia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Solicitar entrada' }));
  await screen.findByRole('alert');
  expect(lerSala).not.toHaveBeenCalled();
  expect(sessionStorage.getItem('sala-convite-abc')).toBeNull();
});
test('convite direciona à sala retornada pelo servidor, sem escolher campanha', async () => {
  (rpc as jest.Mock).mockResolvedValue('sala-outra');
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado: 'aprovado' }]);
  render(<MemoryRouter><SalaJogador /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Lia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Solicitar entrada' }));
  await screen.findByText('Grupo compartilhado: Aventura');
  expect(lerSala).toHaveBeenCalledWith('sala-outra');
  expect(screen.queryByRole('button', { name: /campanha/i })).not.toBeInTheDocument();
});

test.each(['revogado', 'recusado'])('reabrir convite com acesso %s limpa a sessão da sala e pede nome', async estado => {
  sessionStorage.setItem('sala-convite-abc', 'sala-1');
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', estado }]);
  render(<MemoryRouter><SalaJogador /></MemoryRouter>);
  expect(await screen.findByLabelText('Seu nome')).toHaveValue('');
  expect(sessionStorage.getItem('sala-convite-abc')).toBeNull();
  expect(lerSala).not.toHaveBeenCalled();
  expect(rpc).not.toHaveBeenCalled();
});
