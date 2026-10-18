import { act, cleanup, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { repositorioTeste } from './ui/testRepositorio';

class CanalTeste {
  static canais: CanalTeste[] = [];
  onmessage: ((evento: MessageEvent) => void) | null = null;
  fechado = false;
  constructor(public nome: string) { CanalTeste.canais.push(this); }
  postMessage(data: unknown) {
    CanalTeste.canais.filter(c => c !== this && !c.fechado && c.nome === this.nome).forEach(c => queueMicrotask(() => { if (!c.fechado) c.onmessage?.({ data } as MessageEvent); }));
  }
  close() { this.fechado = true; }
}
let ambiente: ReturnType<typeof repositorioTeste>;
const anterior = Object.getOwnPropertyDescriptor(globalThis, 'BroadcastChannel');
beforeEach(() => {
  ambiente = repositorioTeste(); CanalTeste.canais = [];
  Object.defineProperty(globalThis, 'BroadcastChannel', { configurable: true, value: CanalTeste });
});
afterEach(() => {
  cleanup(); ambiente.limpar();
  if (anterior) Object.defineProperty(globalThis, 'BroadcastChannel', anterior); else Reflect.deleteProperty(globalThis, 'BroadcastChannel');
});

async function duasAbas() {
  const { result: resultado1, unmount: desmontar1 } = renderHook(() => useCampanhas(ambiente.repositorio));
  const primeira = { result: resultado1, unmount: desmontar1 };
  await waitFor(() => expect(primeira.result.current.carregando).toBe(false));
  await act(async () => { await primeira.result.current.criar('Mesma campanha'); });
  const id = primeira.result.current.dados!.campanha.id;
  await act(async () => {
    await primeira.result.current.confirmarCombate({ participantes: [0, 1, 2].map(n => ({ id: `p${n}`, iniciativa: -n, instancia: { id: `i${n}`, campanhaId: id, nome: `Combatente ${n}`, categoria: 'monstro', fichaOriginalId: null, pv: { atuais: 7, maximos: 7 } } })) }, 'combate');
    await primeira.result.current.executarCombate('combate', 'iniciar');
  });
  const { result: resultado2, unmount: desmontar2 } = renderHook(() => useCampanhas(ambiente.repositorio));
  const segunda = { result: resultado2, unmount: desmontar2 };
  await waitFor(() => expect(segunda.result.current.carregando).toBe(false));
  await act(async () => { await segunda.result.current.selecionar(id); });
  return { primeira, segunda, id };
}

test('notificação após commit atualiza turno e ordem de outra aba sem escrever novamente', async () => {
  const { primeira, segunda } = await duasAbas();
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar');
  await act(async () => { await primeira.result.current.executarCombate('combate', 'avancar'); });
  await waitFor(() => expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p1'));
  await act(async () => { await primeira.result.current.executarCombate('combate', { ordem: ['p2', 'p1', 'p0'] }); });
  await waitFor(() => expect(segunda.result.current.dados!.campanha.revisao).toBe(primeira.result.current.dados!.campanha.revisao));
  expect(segunda.result.current.dados!.participantes.map(p => p.ordem)).toEqual([2, 1, 0]);
  expect(segunda.result.current.dados!.combates[0].rodada).toBe(1);
  expect(salvar).toHaveBeenCalledTimes(2);
  primeira.unmount(); segunda.unmount();
  expect(CanalTeste.canais.every(c => c.fechado)).toBe(true);
  salvar.mockRestore();
});

test('notificação externa não sobrescreve rascunho e mantém a proteção de revisão', async () => {
  const { primeira, segunda } = await duasAbas();
  act(() => { segunda.result.current.atualizar(d => ({ ...d, campanha: { ...d.campanha, nome: 'Rascunho local' } })); });
  await act(async () => { await primeira.result.current.executarCombate('combate', 'avancar'); });
  expect(segunda.result.current.dados!.campanha.nome).toBe('Rascunho local');
  expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p0');
  await act(async () => { expect(await segunda.result.current.salvarAgora()).toBe(false); });
  expect(segunda.result.current.conflito).toBe(true);
  expect(segunda.result.current.dados!.campanha.nome).toBe('Rascunho local');
});

test('formulário aberto adia recarga externa e a atualização chega depois de fechar', async () => {
  const { primeira, segunda } = await duasAbas();
  const { unmount: fecharModal } = render(<div role="dialog" aria-modal="true"><input aria-label="Edição local" /></div>);
  await act(async () => { await primeira.result.current.executarCombate('combate', 'avancar'); });
  expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p0');
  fecharModal();
  await waitFor(() => expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p1'), { timeout: 2000 });
});

test('sem BroadcastChannel a volta do foco atualiza a versão salva', async () => {
  Object.defineProperty(globalThis, 'BroadcastChannel', { configurable: true, value: undefined });
  const { primeira, segunda } = await duasAbas();
  await act(async () => { await primeira.result.current.executarCombate('combate', 'avancar'); });
  expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p0');
  fireEvent(window, new Event('focus'));
  await waitFor(() => expect(segunda.result.current.dados!.combates[0].participanteAtivoId).toBe('p1'));
});
