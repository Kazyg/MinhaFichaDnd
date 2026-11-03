import { act, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { repositorioTeste } from './ui/testRepositorio';
import { ErroPersistencia } from './erros';
import { RascunhoPreparacaoCombate } from './preparacaoCombate';

let ambiente: ReturnType<typeof repositorioTeste>;
beforeEach(() => { ambiente = repositorioTeste(); });
afterEach(() => { ambiente.limpar(); jest.restoreAllMocks(); });

async function preparar() {
  const view = renderHook(() => useCampanhas(ambiente.repositorio));
  await waitFor(() => expect(view.result.current.carregando).toBe(false));
  await act(async () => { await view.result.current.criar('Execução transacional'); });
  const id = view.result.current.dados!.campanha.id;
  const rascunho: RascunhoPreparacaoCombate = { participantes: [1, 2, 3].map(n => ({
    id: `p${n}`, iniciativa: 4 - n,
    instancia: { id: `i${n}`, campanhaId: id, fichaOriginalId: null, categoria: 'monstro', nome: `Goblin ${n}`, pv: { atuais: 7, maximos: 7 } },
  })) };
  await act(async () => { expect(await view.result.current.confirmarCombate(rascunho, 'combate')).toBe(true); });
  return { ...view, id };
}

test('ativação conclui PV pendentes antes de capturar snapshot e não repõe a vida da preparação', async () => {
  const { result, id } = await preparar();
  act(() => { result.current.atualizar(dados => ({ ...dados, instancias: dados.instancias.map(i => i.id === 'i1' ? { ...i, pv: { ...i.pv, atuais: 2 } } : i) })); });
  expect(result.current.pendente).toBe(true);
  await act(async () => { expect(await result.current.executarCombate('combate', 'iniciar')).toBe(true); });
  const salvo = (await ambiente.repositorio.obter(id))!;
  expect(salvo.combates[0].execucao!.pvAtivacao.find(p => p.instanciaId === 'i1')!.pv.atuais).toBe(2);
  expect(salvo.participantes.find(p => p.instanciaId === 'i1')!.pvInicio.atuais).toBe(7);
  expect(salvo.instancias.find(i => i.id === 'i1')!.pv.atuais).toBe(2);
  expect(result.current.pendente).toBe(false);
});

test('ativação e avanço só publicam estado confirmado; falha permite retry sem avanço oculto', async () => {
  const { result, id } = await preparar();
  await act(async () => { expect(await result.current.executarCombate('combate', 'iniciar')).toBe(true); });
  const original = (await ambiente.repositorio.obter(id))!;
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida', 'Sem espaço'));
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(false); });
  expect(result.current.dados!.combates[0]).toEqual(original.combates[0]);
  expect(await ambiente.repositorio.obter(id)).toEqual(original);
  expect(result.current.pendente).toBe(false);
  await act(async () => { expect(await result.current.salvarAgora()).toBe(true); });
  expect(salvar).toHaveBeenCalledTimes(1);
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(true); });
  expect(result.current.dados!.combates[0]).toMatchObject({ participanteAtivoId: 'p2', rodada: 1 });
});

test('revisão de outra aba impede sobrescrever avanço mais recente', async () => {
  const { result, id } = await preparar();
  const externa = (await ambiente.repositorio.obter(id))!;
  await ambiente.repositorio.salvar({ ...externa, campanha: { ...externa.campanha, nome: 'Outra aba' } });
  await act(async () => { expect(await result.current.executarCombate('combate', 'iniciar')).toBe(false); });
  expect(result.current.conflito).toBe(true);
  const salvo = (await ambiente.repositorio.obter(id))!;
  expect(salvo.campanha.nome).toBe('Outra aba');
  expect(salvo.combates[0].estado).toBe('preparado');
  expect(result.current.dados!.combates[0].estado).toBe('preparado');
});

test('operação pendente rejeita segundo clique e termina apenas um avanço após desmontar', async () => {
  const { result, id, unmount } = await preparar();
  await act(async () => { await result.current.executarCombate('combate', 'iniciar'); });
  const salvarOriginal = ambiente.repositorio.salvar.bind(ambiente.repositorio);
  let liberar!: () => void;
  const bloqueio = new Promise<void>(resolve => { liberar = resolve; });
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockImplementationOnce(async dados => { await bloqueio; await salvarOriginal(dados); });
  let tarefa!: Promise<boolean>;
  act(() => { tarefa = result.current.executarCombate('combate', 'avancar'); });
  await waitFor(() => expect(result.current.carregando).toBe(true));
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(false); });
  expect(() => result.current.atualizar(dados => dados)).toThrow(/Aguarde/);
  const evento = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(evento);
  expect(evento.defaultPrevented).toBe(true);
  unmount(); liberar();
  expect(await tarefa).toBe(true);
  expect(salvar).toHaveBeenCalledTimes(1);
  expect((await ambiente.repositorio.obter(id))!.combates[0]).toMatchObject({ participanteAtivoId: 'p2', rodada: 1 });
});

test('commit seguido de falha de leitura bloqueia repetição até recarregar e preserva turno confirmado', async () => {
  const { result, id } = await preparar();
  await act(async () => { await result.current.executarCombate('combate', 'iniciar'); });
  const obter = jest.spyOn(ambiente.repositorio, 'obter').mockRejectedValueOnce(new Error('Leitura indisponível'));
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(true); });
  expect(result.current.conflito).toBe(true);
  expect(result.current.dados!.combates[0].participanteAtivoId).toBe('p2');
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(false); });
  obter.mockRestore();
  expect((await ambiente.repositorio.obter(id))!.combates[0].participanteAtivoId).toBe('p2');
  await act(async () => { await result.current.recarregar(); });
  expect(result.current.conflito).toBe(false);
  await act(async () => { expect(await result.current.executarCombate('combate', 'avancar')).toBe(true); });
  expect(result.current.dados!.combates[0].participanteAtivoId).toBe('p3');
});
