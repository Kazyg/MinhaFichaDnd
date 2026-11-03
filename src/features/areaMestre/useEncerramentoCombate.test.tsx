import { act, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { repositorioTeste } from './ui/testRepositorio';
import { ErroPersistencia } from './erros';

let ambiente: ReturnType<typeof repositorioTeste>;
beforeEach(() => { ambiente = repositorioTeste(); });
afterEach(() => { ambiente.limpar(); jest.restoreAllMocks(); });

async function iniciar() {
  const view = renderHook(() => useCampanhas(ambiente.repositorio));
  await waitFor(() => expect(view.result.current.carregando).toBe(false));
  await act(async () => { await view.result.current.criar('Encerramento transacional'); });
  const id = view.result.current.dados!.campanha.id;
  await act(async () => { await view.result.current.confirmarCombate({ participantes: [1, 2].map(n => ({
    id: `p${n}`, iniciativa: n,
    instancia: { id: `i${n}`, campanhaId: id, fichaOriginalId: null, categoria: 'monstro', nome: `Minion ${n}`, pv: { atuais: 3, maximos: 8 } },
  })) }, 'combate'); });
  await act(async () => { await view.result.current.executarCombate('combate', 'iniciar'); });
  act(() => { view.result.current.atualizar(dados => ({ ...dados, instancias: dados.instancias.map(i => ({ ...i, pv: { atuais: 0, maximos: 10 } })) })); });
  await act(async () => { await view.result.current.salvarAgora(); });
  return { ...view, id, revisao: view.result.current.dados!.campanha.revisao! };
}

test('encerramento restaura somente após commit e permite retry sem autosave parcial', async () => {
  const { result, id, revisao } = await iniciar();
  const antes = (await ambiente.repositorio.obter(id))!;
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida', 'Sem espaço'));
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(false); });
  expect(result.current.dados).toEqual(antes);
  expect(await ambiente.repositorio.obter(id)).toEqual(antes);
  expect(result.current.pendente).toBe(false);
  await act(async () => { await result.current.salvarAgora(); });
  expect(salvar).toHaveBeenCalledTimes(1);
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(true); });
  expect(result.current.dados!.combates[0].estado).toBe('encerrado');
  expect(result.current.dados!.instancias.map(i => i.pv)).toEqual([{ atuais: 3, maximos: 8 }, { atuais: 3, maximos: 8 }]);
  const final = await ambiente.repositorio.obter(id);
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', result.current.dados!.campanha.revisao!)).toBe(false); });
  expect(await ambiente.repositorio.obter(id)).toEqual(final);
});

test('revisão capturada na modal rejeita alteração local de PV, inclusive ao concluir autosave pendente', async () => {
  const { result, id, revisao } = await iniciar();
  act(() => { result.current.atualizar(dados => ({ ...dados, instancias: dados.instancias.map(i => i.id === 'i1' ? { ...i, pv: { atuais: 1, maximos: 10 } } : i) })); });
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(false); });
  expect(result.current.dados!.combates[0].estado).toBe('ativo');
  expect(result.current.dados!.instancias.find(i => i.id === 'i1')!.pv.atuais).toBe(1);
  expect((await ambiente.repositorio.obter(id))!.combates[0].estado).toBe('ativo');
});

test('alteração de outra aba nunca é sobrescrita pela decisão antiga', async () => {
  const { result, id, revisao } = await iniciar();
  const externa = (await ambiente.repositorio.obter(id))!;
  externa.instancias[0].pv = { atuais: 6, maximos: 12 };
  await ambiente.repositorio.salvar(externa);
  const atual = await ambiente.repositorio.obter(id);
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(false); });
  expect(result.current.conflito).toBe(true);
  expect(await ambiente.repositorio.obter(id)).toEqual(atual);
});

test('duplo clique durante commit não aplica restauração duas vezes e protege saída', async () => {
  const { result, id, revisao, unmount } = await iniciar();
  const original = ambiente.repositorio.salvar.bind(ambiente.repositorio);
  let liberar!: () => void;
  const bloqueio = new Promise<void>(resolve => { liberar = resolve; });
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockImplementationOnce(async dados => { await bloqueio; await original(dados); });
  let tarefa!: Promise<boolean>;
  act(() => { tarefa = result.current.encerrarCombate('combate', 'restaurar', revisao); });
  await waitFor(() => expect(result.current.carregando).toBe(true));
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(false); });
  const evento = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(evento);
  expect(evento.defaultPrevented).toBe(true);
  unmount(); liberar();
  expect(await tarefa).toBe(true);
  expect(salvar).toHaveBeenCalledTimes(1);
  expect((await ambiente.repositorio.obter(id))!.combates[0].estado).toBe('encerrado');
});

test('commit com leitura indisponível publica encerramento confirmado e bloqueia repetição até recarga', async () => {
  const { result, id, revisao } = await iniciar();
  const obterOriginal = ambiente.repositorio.obter.bind(ambiente.repositorio);
  const obter = jest.spyOn(ambiente.repositorio, 'obter').mockImplementationOnce(obterOriginal).mockRejectedValueOnce(new Error('Leitura indisponível'));
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'manter', revisao)).toBe(true); });
  expect(result.current.conflito).toBe(true);
  expect(result.current.dados!.combates[0].estado).toBe('encerrado');
  expect(result.current.dados!.instancias.every(i => i.pv.atuais === 0)).toBe(true);
  await act(async () => { expect(await result.current.encerrarCombate('combate', 'restaurar', revisao)).toBe(false); });
  obter.mockRestore();
  const salvo = await ambiente.repositorio.obter(id);
  await act(async () => { await result.current.recarregar(); });
  expect(result.current.conflito).toBe(false);
  expect(result.current.dados).toEqual(salvo);
});
