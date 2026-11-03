import { render, waitFor } from '@testing-library/react';
import SalaMestre from './SalaMestre';
import { DadosCampanha } from '../areaMestre/modelos';
import { lerConfig, lerMembros, lerSala, obterCliente, publicarSala } from './cliente';

jest.mock('./cliente', () => ({
  salaConfigurada: () => true, lerConfig: jest.fn(), lerMembros: jest.fn(), lerSala: jest.fn(), obterCliente: jest.fn(), publicarSala: jest.fn(),
  observarSala: () => jest.fn(), rpc: () => Promise.resolve(), linkConvite: () => 'https://teste/sala#convite=abc',
}));
jest.mock('./VisaoJogadores', () => () => null);
const dados: DadosCampanha = {
  campanha: { id: 'c', nome: 'Mesa', schemaVersion: 1, roteiro: 'SEGREDO', criadoEm: '', atualizadoEm: '', revisao: 1 },
  instancias: [{ id: 'j', campanhaId: 'c', fichaOriginalId: null, categoria: 'jogador', nome: 'Lia', pv: { atuais: 10, maximos: 20 } }],
  fichas: [], anexos: [], participantes: [], combates: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
};
beforeEach(() => {
  jest.clearAllMocks();
  let revisao = 0;
  const query = { select: jest.fn(), eq: jest.fn(), maybeSingle: async () => ({ data: { id: 'sala' } }) };
  query.select.mockReturnValue(query); query.eq.mockReturnValue(query);
  (obterCliente as jest.Mock).mockReturnValue({
    from: () => query,
    auth: { getUser: async () => ({ data: { user: { id: 'mestre', is_anonymous: false } } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: jest.fn() } } }) },
  });
  (lerSala as jest.Mock).mockImplementation(async () => ({ id: 'sala', revisao, aberta: true, bloqueada: false, visao: { nome: 'Mesa', jogadores: [], combate: null } }));
  (lerMembros as jest.Mock).mockResolvedValue([]);
  (lerConfig as jest.Mock).mockResolvedValue({ convite: 'abc', escolha: { jogadores: ['j'], monstros: [], combateId: null } });
  (publicarSala as jest.Mock).mockImplementation(async () => ++revisao);
});

test('sincroniza somente depois de salvar a campanha, inclusive com painel fechado', async () => {
  const props = { dados, pronto: false, aberto: false, onFechar: jest.fn() };
  const { rerender } = render(<SalaMestre {...props} />);
  await waitFor(() => expect(lerConfig).toHaveBeenCalled());
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
