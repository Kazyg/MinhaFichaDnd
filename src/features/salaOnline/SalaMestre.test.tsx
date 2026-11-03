import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SalaMestre from './SalaMestre';
import { DadosCampanha } from '../areaMestre/modelos';
import { lerConfig, lerMembros, lerSala, publicarSala, rpc, observarSala } from './cliente';

import { provisionarSala } from './provisionamento';
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

test('convite aparece na campanha sem abrir painel ou informar e-mail; copia apenas o convite', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  expect(await screen.findByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=abc');
  expect(screen.queryByLabelText('Seu e-mail')).not.toBeInTheDocument();
  expect(provisionarSala).toHaveBeenCalledWith('c', 'Mesa');
  fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }));
  await screen.findByText('Link copiado.');
  expect(writeText).toHaveBeenCalledWith('https://teste/sala#convite=abc');
});
test('reabrir a campanha recupera o mesmo convite', async () => {
  const props = { dados, pronto: true, aberto: false, onFechar: jest.fn() };
  const { unmount } = render(<SalaMestre {...props} />);
  await screen.findByLabelText('Link de convite'); unmount();
  render(<SalaMestre {...props} />);
  expect(await screen.findByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=abc');
  expect(provisionarSala).toHaveBeenCalledTimes(2);
});
test('falha mostra nova tentativa e recupera o convite', async () => {
  (provisionarSala as jest.Mock).mockRejectedValueOnce(new Error('Sem conexão'));
  render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
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
  render(<SalaMestre dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  await screen.findByText(/Sala encerrada. Reabra/);
  expect(screen.queryByRole('button', { name: 'Copiar link' })).not.toBeInTheDocument();
  expect(publicarSala).not.toHaveBeenCalled();
});
test('resposta atrasada da campanha anterior não aparece na próxima', async () => {
  let resolver!: (value: unknown) => void;
  (provisionarSala as jest.Mock).mockImplementationOnce(() => new Promise(resolve => { resolver = resolve; }));
  const { rerender } = render(<SalaMestre key="c" dados={dados} pronto aberto={false} onFechar={jest.fn()} />);
  await waitFor(() => expect(provisionarSala).toHaveBeenCalledWith('c', 'Mesa'));
  const outra = { ...dados, campanha: { ...dados.campanha, id: 'outra', nome: 'Outra' } };
  rerender(<SalaMestre key="outra" dados={outra} pronto aberto={false} onFechar={jest.fn()} />);
  await screen.findByLabelText('Link de convite');
  await act(async () => resolver({ id: 'sala-antiga', usuario: { id: 'mestre' } }));
  expect(lerSala).not.toHaveBeenCalledWith('sala-antiga');
});

test('salvar durante o provisionamento não cancela a identificação', async () => {
  let resolver!: (value: unknown) => void;
  (provisionarSala as jest.Mock).mockImplementationOnce(() => new Promise(resolve => { resolver = resolve; }));
  const props = { dados, aberto: false, onFechar: jest.fn() };
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
  fireEvent.click(screen.getByRole('checkbox', { name: 'Lia' }));
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'outra-aba', escolha: { jogadores: ['j'], monstros: [], combateId: null } });
  await act(async () => (observarSala as jest.Mock).mock.calls[0][1]());
  await waitFor(() => expect(screen.getByLabelText('Link de convite')).toHaveValue('https://teste/sala#convite=outra-aba'));
  expect(screen.getByRole('checkbox', { name: 'Lia' })).not.toBeChecked();
});
