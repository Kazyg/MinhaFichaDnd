import { garantirIdentidade, provisionarSala } from './provisionamento';
import { obterCliente, rpc } from './cliente';
jest.mock('./cliente', () => ({ obterCliente: jest.fn(), rpc: jest.fn() }));
const user = { id: 'identidade-persistida', is_anonymous: true };
const getSession = jest.fn(); const signInAnonymously = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  (obterCliente as jest.Mock).mockReturnValue({ auth: { getSession, signInAnonymously } });
  getSession.mockResolvedValue({ data: { session: null }, error: null });
  signInAnonymously.mockResolvedValue({ data: { user, session: { user } }, error: null });
  (rpc as jest.Mock).mockResolvedValue('sala-persistida');
});
test('cria uma única identidade para chamadas simultâneas', async () => {
  const users = await Promise.all([garantirIdentidade(), garantirIdentidade()]);
  expect(users).toEqual([user, user]);
  expect(signInAnonymously).toHaveBeenCalledTimes(1);
});
test.each([true, false])('reutiliza sessão salva anônima=%s sem pedir e-mail', async is_anonymous => {
  getSession.mockResolvedValue({ data: { session: { user: { ...user, is_anonymous } } }, error: null });
  await provisionarSala('campanha-a', 'Aventura');
  await provisionarSala('campanha-a', 'Aventura');
  expect(signInAnonymously).not.toHaveBeenCalled();
  expect(rpc).toHaveBeenCalledWith('sala_criar', { p_campanha: 'campanha-a', p_nome: 'Aventura' });
});
test('erro de sessão não troca a identidade nem provisiona outra sala', async () => {
  getSession.mockResolvedValue({ data: { session: null }, error: new Error('offline') });
  await expect(provisionarSala('a','A')).rejects.toThrow('recuperar sua sessão');
  expect(signInAnonymously).not.toHaveBeenCalled(); expect(rpc).not.toHaveBeenCalled();
});
test('erro de identificação permite nova tentativa sem enviar RPC', async () => {
  signInAnonymously.mockResolvedValueOnce({ data: { user: null, session: null }, error: new Error('offline') });
  await expect(provisionarSala('a','A')).rejects.toThrow('preparar seu acesso');
  expect(rpc).not.toHaveBeenCalled();
  await expect(provisionarSala('a','A')).resolves.toEqual({ id: 'sala-persistida', usuario: user });
});
