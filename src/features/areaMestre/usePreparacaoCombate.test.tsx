import { act, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { repositorioTeste } from './ui/testRepositorio';
import { ErroPersistencia } from './erros';
import { RascunhoPreparacaoCombate } from './preparacaoCombate';

let ambiente: ReturnType<typeof repositorioTeste>;
beforeEach(() => { ambiente = repositorioTeste(); });
afterEach(() => { ambiente.limpar(); jest.restoreAllMocks(); });
async function iniciar() {
  const view = renderHook(() => useCampanhas(ambiente.repositorio));
  await waitFor(() => expect(view.result.current.carregando).toBe(false));
  await act(async () => { await view.result.current.criar('Preparação transacional'); });
  const id = view.result.current.dados!.campanha.id;
  const rascunho: RascunhoPreparacaoCombate = { participantes: [1,2].map(n => ({
    id:`participante-${n}`, iniciativa:n === 1 ? 0 : -2,
    instancia:{id:`avulso-${n}`,campanhaId:id,fichaOriginalId:null,categoria:'monstro',nome:`Esqueleto ${n}`,pv:{atuais:1,maximos:1}},
  })) };
  return { ...view, id, rascunho };
}

test('falha anterior ao commit não publica nem agenda autosave de instâncias; retry confirma uma vez', async () => {
  const { result, rascunho, id } = await iniciar();
  const salvar = jest.spyOn(ambiente.repositorio,'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida','Sem espaço'));
  await act(async () => { expect(await result.current.confirmarCombate(rascunho,'encontro')).toBe(false); });
  expect(result.current.dados!.instancias).toHaveLength(0);
  expect(result.current.dados!.combates).toHaveLength(0);
  expect(result.current.pendente).toBe(false);
  expect((await ambiente.repositorio.obter(id))!.instancias).toHaveLength(0);
  await act(async () => { expect(await result.current.salvarAgora()).toBe(true); });
  expect(salvar).toHaveBeenCalledTimes(1);
  await act(async () => { expect(await result.current.confirmarCombate(rascunho,'encontro')).toBe(true); });
  expect(result.current.dados!.campanha.revisao).toBe(2);
  expect(result.current.dados!.combates).toEqual([expect.objectContaining({id:'encontro',estado:'preparado',rodada:0,participanteAtivoId:null})]);
  expect(result.current.dados!.instancias).toHaveLength(2);
});

test('conflito de revisão preserva a campanha externa e não grava o rascunho', async () => {
  const { result, rascunho, id } = await iniciar();
  const externa = (await ambiente.repositorio.obter(id))!;
  await ambiente.repositorio.salvar({...externa,campanha:{...externa.campanha,nome:'Outra aba'}});
  await act(async () => { expect(await result.current.confirmarCombate(rascunho,'encontro')).toBe(false); });
  expect(result.current.conflito).toBe(true);
  expect(result.current.pendente).toBe(false);
  expect(result.current.dados!.instancias).toHaveLength(0);
  expect((await ambiente.repositorio.obter(id))!.campanha.nome).toBe('Outra aba');
  expect((await ambiente.repositorio.obter(id))!.combates).toHaveLength(0);
});

test('falha de leitura após commit reconhece encontro salvo e bloqueia confirmação duplicada até recarga', async () => {
  const { result, rascunho, id } = await iniciar();
  const obter = jest.spyOn(ambiente.repositorio,'obter').mockRejectedValueOnce(new Error('Leitura indisponível'));
  await act(async () => { expect(await result.current.confirmarCombate(rascunho,'encontro')).toBe(true); });
  expect(result.current.erro).toMatch(/O encontro foi salvo/);
  expect(result.current.conflito).toBe(true);
  expect(result.current.dados!.combates).toHaveLength(1);
  await act(async () => { expect(await result.current.confirmarCombate(rascunho,'encontro')).toBe(false); });
  obter.mockRestore();
  expect((await ambiente.repositorio.obter(id))!.combates).toHaveLength(1);
  await act(async () => { await result.current.recarregar(); });
  expect(result.current.dados!.campanha.revisao).toBe(2);
  expect(result.current.conflito).toBe(false);
});

test('espera commit antes de encerrar e protege saída durante confirmação pendente', async () => {
  const { result, rascunho, id, unmount } = await iniciar();
  const salvarOriginal = ambiente.repositorio.salvar.bind(ambiente.repositorio);
  let liberar!: () => void;
  const bloqueio = new Promise<void>(resolve => { liberar=resolve; });
  jest.spyOn(ambiente.repositorio,'salvar').mockImplementationOnce(async dados => { await bloqueio; await salvarOriginal(dados); });
  let tarefa!: Promise<boolean>;
  act(() => { tarefa=result.current.confirmarCombate(rascunho,'encontro'); });
  await waitFor(() => expect(result.current.carregando).toBe(true));
  const evento = new Event('beforeunload',{cancelable:true});window.dispatchEvent(evento);
  expect(evento.defaultPrevented).toBe(true);
  unmount(); liberar(); expect(await tarefa).toBe(true);
  expect((await ambiente.repositorio.obter(id))!.combates).toHaveLength(1);
});
