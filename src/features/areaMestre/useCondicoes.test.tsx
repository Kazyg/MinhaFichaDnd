import { act, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { repositorioTeste } from './ui/testRepositorio';
import { ErroPersistencia } from './erros';
import { AcaoCondicao } from './condicoes';

let ambiente: ReturnType<typeof repositorioTeste>;
beforeEach(() => { ambiente = repositorioTeste(); });
afterEach(() => { ambiente.limpar(); jest.restoreAllMocks(); });
const adicionar: AcaoCondicao = { tipo: 'adicionar', id: 'efeito', dados: {
  tipo: 'queimando', duracao: 'turnos', restantes: 2, momento: 'final',
} };
async function iniciar() {
  const view = renderHook(() => useCampanhas(ambiente.repositorio));
  await waitFor(() => expect(view.result.current.carregando).toBe(false));
  await act(async () => { await view.result.current.criar('Condições'); });
  const id = view.result.current.dados!.campanha.id;
  await act(async () => { await view.result.current.confirmarCombate({ participantes: [1, 2].map(n => ({
    id: `p${n}`, iniciativa: 10 - n,
    instancia: { id: `i${n}`, campanhaId: id, fichaOriginalId: null, categoria: 'monstro', nome: `Goblin ${n}`, pv: { atuais: 0, maximos: 8 } },
  })) }, 'combate'); });
  await act(async () => { await view.result.current.executarCombate('combate', 'iniciar'); });
  return { ...view, id, revisao: view.result.current.dados!.campanha.revisao! };
}

test('falha ao aplicar não publica efeito nem deixa autosave parcial; retry persiste em alvo com zero PV', async () => {
  const { result, id, revisao } = await iniciar();
  const antes = await ambiente.repositorio.obter(id);
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida', 'Sem espaço'));
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(false); });
  expect(result.current.dados).toEqual(antes);
  expect(await ambiente.repositorio.obter(id)).toEqual(antes);
  await act(async () => { await result.current.salvarAgora(); });
  expect(salvar).toHaveBeenCalledTimes(1);
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(true); });
  expect(result.current.dados!.combates[0].condicoes).toHaveLength(1);
  expect((await ambiente.repositorio.obter(id))!.combates[0].condicoes).toEqual(result.current.dados!.combates[0].condicoes);
  expect(result.current.dados!.instancias.every(i => i.pv.atuais === 0)).toBe(true);
});

test('revisão da modal rejeita avanço de turno local ou externo sem sobrescrever contagem', async () => {
  const { result, id, revisao } = await iniciar();
  await act(async () => { await result.current.executarCombate('combate', 'avancar'); });
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(false); });
  expect(result.current.conflito).toBe(true);
  await act(async () => { await result.current.recarregar(); });
  const novaRevisao = result.current.dados!.campanha.revisao!;
  const externa = (await ambiente.repositorio.obter(id))!;
  externa.campanha.nome = 'Outra aba';
  await ambiente.repositorio.salvar(externa);
  const atualizado = await ambiente.repositorio.obter(id);
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, novaRevisao)).toBe(false); });
  expect(await ambiente.repositorio.obter(id)).toEqual(atualizado);
});

test('lock impede aplicar duas vezes ou avançar turno durante confirmação pendente', async () => {
  const { result, id, revisao } = await iniciar();
  const original = ambiente.repositorio.salvar.bind(ambiente.repositorio);
  let liberar!: () => void;
  const bloqueio = new Promise<void>(resolve => { liberar = resolve; });
  const salvar = jest.spyOn(ambiente.repositorio, 'salvar').mockImplementationOnce(async dados => { await bloqueio; await original(dados); });
  let tarefa!: Promise<boolean>;
  act(() => { tarefa = result.current.alterarCondicao('combate', 'p1', adicionar, revisao); });
  await waitFor(() => expect(result.current.carregando).toBe(true));
  await act(async () => {
    expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(false);
    expect(await result.current.executarCombate('combate', 'avancar')).toBe(false);
  });
  await act(async () => { liberar(); expect(await tarefa).toBe(true); });
  expect(salvar).toHaveBeenCalledTimes(1);
  expect((await ambiente.repositorio.obter(id))!.combates[0].participanteAtivoId).toBe('p1');
});

test('falha de releitura após commit bloqueia repetição sem perder efeito já salvo', async () => {
  const { result, id, revisao } = await iniciar();
  const obter = ambiente.repositorio.obter.bind(ambiente.repositorio);
  const spy = jest.spyOn(ambiente.repositorio, 'obter').mockImplementationOnce(obter).mockRejectedValueOnce(new Error('Leitura indisponível'));
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(true); });
  expect(result.current.conflito).toBe(true);
  expect(result.current.dados!.combates[0].condicoes).toHaveLength(1);
  await act(async () => { expect(await result.current.alterarCondicao('combate', 'p1', adicionar, revisao)).toBe(false); });
  spy.mockRestore();
  expect((await ambiente.repositorio.obter(id))!.combates[0].condicoes).toHaveLength(1);
});
