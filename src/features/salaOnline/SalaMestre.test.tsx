import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import SalaMestre from './SalaMestre';
import { DadosCampanha } from '../areaMestre/modelos';
import { lerConfig, lerMembros, lerSala, publicarSala, rpc, observarSala } from './cliente';

import { provisionarSala } from './provisionamento';

jest.mock('react-toastify', () => ({ toast: { info: jest.fn() } }));
jest.mock('./provisionamento', () => ({ provisionarSala: jest.fn() }));
jest.mock('./cliente', () => ({
  salaConfigurada: () => true, lerConfig: jest.fn(), lerMembros: jest.fn(), lerSala: jest.fn(), obterCliente: jest.fn(), publicarSala: jest.fn(),
  observarSala: jest.fn(() => jest.fn()), rpc: jest.fn(), linkConvite: (token: string) => 'https://teste/sala#convite=' + token,
}));
jest.mock('./VisaoJogadores', () => () => null);
const dados: DadosCampanha = {
  campanha: { id: 'c', nome: 'Mesa', schemaVersion: 1, roteiro: 'SEGREDO', criadoEm: '', atualizadoEm: '', revisao: 1 },
  instancias: [{ id: 'j', campanhaId: 'c', fichaOriginalId: null, categoria: 'jogador', nome: 'Lia', pv: { atuais: 10, maximos: 20 } }],
  fichas: [], anexos: [], participantes: [], combates: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
};
beforeEach(() => {
  jest.clearAllMocks(); (observarSala as jest.Mock).mockReturnValue(jest.fn());
  let revisao = 0;
  (provisionarSala as jest.Mock).mockResolvedValue({ id: 'sala', usuario: { id: 'mestre', is_anonymous: true } });
  (rpc as jest.Mock).mockResolvedValue(undefined);
  (lerSala as jest.Mock).mockImplementation(async () => ({ id: 'sala', revisao, aberta: true, bloqueada: false, visao: { nome: 'Mesa', jogadores: [], combate: null } }));
  (lerMembros as jest.Mock).mockResolvedValue([]);
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'abc', escolha: { jogadores: ['j'], monstros: [], combateId: null } });
  (publicarSala as jest.Mock).mockImplementation(async () => ++revisao);
});

test('sincroniza somente depois de salvar a campanha, inclusive com painel fechado', async () => {
  const props = { dados, pronto: false, aberto: false, onFechar: jest.fn() };
  const { rerender } = render(<SalaMestre {...props} />);
  expect(provisionarSala).not.toHaveBeenCalled();
  expect(publicarSala).not.toHaveBeenCalled();
  rerender(<SalaMestre {...props} pronto />);
  await waitFor(() => expect(publicarSala).toHaveBeenCalledTimes(1), { timeout: 3000 });
  expect((publicarSala as jest.Mock).mock.calls[0][1].visao.jogadores[0].pv.atuais).toBe(10);
  expect(JSON.stringify((publicarSala as jest.Mock).mock.calls[0][1])).not.toContain('SEGREDO');
  const curada = { ...dados, campanha: { ...dados.campanha, revisao: 2 }, instancias: [{ ...dados.instancias[0], pv: { atuais: 15, maximos: 20 } }] };
  rerender(<SalaMestre {...props} dados={curada} pronto />);
  await waitFor(() => expect(publicarSala).toHaveBeenCalledTimes(2), { timeout: 3000 });
  expect((publicarSala as jest.Mock).mock.calls[1][0].revisao).toBe(1);
  expect((publicarSala as jest.Mock).mock.calls[1][1].visao.jogadores[0].pv.atuais).toBe(15);
});

test('convite fica apenas na modal; copia apenas o convite sem e-mail', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  const { rerender } = render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  await waitFor(() => expect(lerConfig).toHaveBeenCalled());
  expect(screen.queryByLabelText('Link de convite')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Copiar link' })).not.toBeInTheDocument();
  rerender(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  expect(await screen.findByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=abc');
  expect(screen.queryByLabelText('Seu e-mail')).not.toBeInTheDocument();
  expect(provisionarSala).toHaveBeenCalledWith('c', 'Mesa');
  fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }));
  await screen.findByText('Link copiado.');
  expect(writeText).toHaveBeenCalledWith('https://teste/sala#convite=abc');
});
test('reabrir a campanha recupera o mesmo convite', async () => {
  const props = { dados, pronto: true, aberto: true, onFechar: jest.fn() };
  const { unmount } = render(<SalaMestre {...props} />);
  await screen.findByLabelText('Link de convite'); unmount();
  render(<SalaMestre {...props} />);
  expect(await screen.findByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=abc');
  expect(provisionarSala).toHaveBeenCalledTimes(2);
});
test('falha mostra nova tentativa e recupera o convite', async () => {
  (provisionarSala as jest.Mock).mockRejectedValueOnce(new Error('Sem conexão'));
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByText('Sem conexão');
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByLabelText('Link de convite');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
test('renovar substitui o convite e mantém a campanha', async () => {
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByLabelText('Link de convite');
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'novo', escolha: { jogadores: ['j'], monstros: [], combateId: null } });
  fireEvent.click(screen.getByRole('button', { name: 'Renovar convite' }));
  await waitFor(() => expect(screen.getByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=novo'));
  expect(rpc).toHaveBeenCalledWith('sala_comando', { p_sala: 'sala', p_acao: 'renovar', p_usuario: null });
  expect(dados.campanha.roteiro).toBe('SEGREDO');
});
test('sala encerrada não reabre automaticamente', async () => {
  (lerSala as jest.Mock).mockResolvedValue({ id: 'sala', aberta: false, revisao: 4 });
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByText(/Sala encerrada/);
  expect(screen.getByRole('button', { name: 'Copiar link' })).toBeInTheDocument();
  expect(screen.getByText(/novo convite funcionará/)).toBeInTheDocument();
  expect(publicarSala).not.toHaveBeenCalled();
});
test('resposta atrasada da campanha anterior não aparece na próxima', async () => {
  let resolver!: (value: unknown) => void;
  (provisionarSala as jest.Mock).mockImplementationOnce(() => new Promise(resolve => { resolver = resolve; }));
  const { rerender } = render(<SalaMestre key="c" dados={dados} pronto aberto onFechar={jest.fn()} />);
  await waitFor(() => expect(provisionarSala).toHaveBeenCalledWith('c', 'Mesa'));
  const outra = { ...dados, campanha: { ...dados.campanha, id: 'outra', nome: 'Outra' } };
  rerender(<SalaMestre key="outra" dados={outra} pronto aberto onFechar={jest.fn()} />);
  await screen.findByLabelText('Link de convite');
  await act(async () => resolver({ id: 'sala-antiga', usuario: { id: 'mestre' } }));
  expect(lerSala).not.toHaveBeenCalledWith('sala-antiga');
});

test('salvar durante o provisionamento não cancela a identificação', async () => {
  let resolver!: (value: unknown) => void;
  (provisionarSala as jest.Mock).mockImplementationOnce(() => new Promise(resolve => { resolver = resolve; }));
  const props = { dados, aberto: true, onFechar: jest.fn() };
  const { rerender } = render(<SalaMestre {...props} pronto />);
  await waitFor(() => expect(provisionarSala).toHaveBeenCalled());
  rerender(<SalaMestre {...props} pronto={false} />);
  await act(async () => resolver({ id: 'sala', usuario: { id: 'mestre', is_anonymous: true } }));
  await screen.findByLabelText('Link de convite');
  expect(publicarSala).not.toHaveBeenCalled();
  rerender(<SalaMestre {...props} pronto />);
  await waitFor(() => expect(publicarSala).toHaveBeenCalled(), { timeout: 3000 });
});

test('renovação em outra aba atualiza o link sem sobrescrever a seleção local', async () => {
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByLabelText('Link de convite');
  expect(screen.queryByRole('checkbox', { name: 'Lia' })).not.toBeInTheDocument();
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'outra-aba', escolha: { jogadores: ['j'], monstros: [], combateId: null } });
  await act(async () => (observarSala as jest.Mock).mock.calls[0][1]());
  await waitFor(() => expect(screen.getByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=outra-aba'));
  expect(screen.getByText('Grupo sempre visível')).toBeInTheDocument();
});

test('pedido de entrada notifica com modal fechada e não se repete a cada atualização', async () => {
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', nome: 'Lia', estado: 'pendente', visto_em: new Date().toISOString() }]);
  render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  await screen.findByText(/aguardando aprovação em Sala online/);
  expect(toast.info).toHaveBeenCalledTimes(1);
  expect(toast.info).toHaveBeenCalledWith(expect.stringContaining('Lia solicitou entrada'), expect.objectContaining({ toastId: 'sala-pedido-sala-visitante' }));
  await act(async () => (observarSala as jest.Mock).mock.calls[0][1]());
  expect(toast.info).toHaveBeenCalledTimes(1);
  expect(screen.queryByLabelText('Link de convite')).not.toBeInTheDocument();
});
test('aprovação remove o aviso de pedido pendente', async () => {
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', nome: 'Lia', estado: 'pendente', visto_em: '' }]);
  render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  await screen.findByText(/aguardando aprovação em Sala online/);
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'visitante', nome: 'Lia', estado: 'aprovado', visto_em: '' }]);
  await act(async () => (observarSala as jest.Mock).mock.calls[0][1]());
  await waitFor(() => expect(screen.queryByText(/aguardando aprovação em Sala online/)).not.toBeInTheDocument());
});

test('X e clique no fundo fecham o painel; clique dentro não fecha', async () => {
  const fechar = jest.fn();
  render(<SalaMestre dados={dados} pronto aberto onFechar={fechar} />);
  await screen.findByLabelText('Link de convite');
  fireEvent.click(screen.getByRole('dialog', { name: 'Sala online' }));
  expect(fechar).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Fechar sala online' }));
  expect(fechar).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByTestId('sala-online-fundo'));
  expect(fechar).toHaveBeenCalledTimes(2);
});
test('participante removido some da lista', async () => {
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'v', nome: 'Visitante', estado: 'aprovado', visto_em: '' }]);
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByRole('button', { name: 'Remover Visitante' });
  (lerMembros as jest.Mock).mockResolvedValue([{ usuario: 'v', nome: 'Visitante', estado: 'revogado', visto_em: '' }]);
  fireEvent.click(screen.getByRole('button', { name: 'Remover Visitante' }));
  await waitFor(() => expect(screen.queryByText('Visitante')).not.toBeInTheDocument());
  expect(rpc).toHaveBeenCalledWith('sala_comando', { p_sala: 'sala', p_acao: 'revogar', p_usuario: 'v' });
});
test('desmarcar monstro publica a ocultação sem botão de aplicar', async () => {
  const combate: DadosCampanha = { ...dados,
    combates: [{ id: 'b', campanhaId: 'c', estado: 'ativo', rodada: 1, participanteAtivoId: 'p', iniciadoEm: '', encerradoEm: null }],
    instancias: [...dados.instancias, { id: 'm', campanhaId: 'c', fichaOriginalId: null, categoria: 'monstro', nome: 'Dragão', pv: { atuais: 200, maximos: 200 } }],
    participantes: [{ id: 'p', combateId: 'b', instanciaId: 'm', iniciativa: 20, ordem: 0, pvInicio: { atuais: 200, maximos: 200 } }],
  };
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'abc', escolha: { jogadores: [], combateId: 'b', monstros: ['m'] } });
  render(<SalaMestre dados={combate} pronto aberto onFechar={jest.fn()} />);
  await waitFor(() => expect(publicarSala).toHaveBeenCalledTimes(1), { timeout: 3000 });
  await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Revelar retrato: Dragão' })).toBeEnabled());
  fireEvent.click(screen.getByRole('checkbox', { name: 'Revelar retrato: Dragão' }));
  await waitFor(() => expect(publicarSala).toHaveBeenCalledTimes(2), { timeout: 3000 });
  expect((publicarSala as jest.Mock).mock.calls[1][1].visao.combate.imagens).toEqual([]);
  expect((publicarSala as jest.Mock).mock.calls[1][1].visao.combate.roda.ordem).toEqual([]);
  expect(screen.queryByRole('button', { name: 'Aplicar compartilhamento' })).not.toBeInTheDocument();
});
test('encerrar mostra imediatamente o novo convite reservado', async () => {
  render(<SalaMestre dados={dados} pronto aberto onFechar={jest.fn()} />);
  await screen.findByLabelText('Link de convite');
  (lerSala as jest.Mock).mockResolvedValue({ id: 'sala', revisao: 1, aberta: false, bloqueada: false });
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'reservado', escolha: { jogadores: [], combateId: null, monstros: [] } });
  fireEvent.click(screen.getByRole('button', { name: 'Encerrar acesso de todos' }));
  await waitFor(() => expect(screen.getByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=reservado'));
  expect(screen.getByRole('button', { name: 'Reabrir sala' })).toBeInTheDocument();
});
