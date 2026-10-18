import { act, renderHook, waitFor } from '@testing-library/react';
import { useCampanhas } from './useCampanhas';
import { ErroPersistencia } from './erros';
import { DadosCampanha } from './modelos';
import { repositorioTeste } from './ui/testRepositorio';

function atualizarRoteiro(dados: DadosCampanha, conteudo: string): DadosCampanha {
  const anterior = dados.campanha.roteiros?.find(roteiro => roteiro.id === 'roteiro-teste');
  const roteiro = {
    id: 'roteiro-teste', titulo: 'Notas da sessao', conteudo,
    criadoEm: anterior?.criadoEm ?? dados.campanha.criadoEm,
    atualizadoEm: dados.campanha.atualizadoEm,
  };
  return { ...dados, campanha: { ...dados.campanha, roteiro: '', roteiros: [...(dados.campanha.roteiros ?? []).filter(r => r.id !== roteiro.id), roteiro] } };
}

describe('integração React com campanhas IndexedDB', () => {
  let ambiente: ReturnType<typeof repositorioTeste>;
  beforeEach(() => { ambiente = repositorioTeste(); });
  afterEach(() => { ambiente.limpar(); });

  test('cria, salva roteiro e recupera revisão/layout ao remontar', async () => {
    const { repositorio } = ambiente;
    const view = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(view.result.current.carregando).toBe(false));
    await act(async () => { await view.result.current.criar('Aventura'); });
    expect(view.result.current.erro).toBeNull();
    const id = view.result.current.dados!.campanha.id;
    expect(view.result.current.dados!.campanha.revisao).toBe(1);
    act(() => view.result.current.atualizar(dados => ({
      ...atualizarRoteiro(dados, 'A torre abandonada'),
      layout: { ...dados.layout, sidebarRecolhida: true },
    })));
    await act(async () => { await view.result.current.salvarAgora(); });
    expect(view.result.current.dados!.campanha.revisao).toBe(2);
    view.unmount();
    repositorio.fechar();
    const utils = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(utils.result.current.campanhas).toHaveLength(1));
    await act(async () => { await utils.result.current.selecionar(id); });
    expect(utils.result.current.dados).toMatchObject({
      campanha: { roteiros: [{ id: 'roteiro-teste', conteudo: 'A torre abandonada' }], revisao: 2 },
      layout: { sidebarRecolhida: true },
    });
  });

  test('salva alterações pendentes antes de trocar de campanha', async () => {
    const { result } = renderHook(() => useCampanhas(ambiente.repositorio));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => { await result.current.criar('Primeira'); });
    const primeira = result.current.dados!.campanha.id;
    await act(async () => { await result.current.criar('Segunda'); });
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Cena salva antes de sair')));
    await act(async () => { await result.current.selecionar(primeira); });
    const segunda = (await ambiente.repositorio.listar()).find(c => c.nome === 'Segunda')!;
    expect((await ambiente.repositorio.obter(segunda.id))!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Cena salva antes de sair');
    expect(result.current.dados!.campanha.id).toBe(primeira);
  });

  test('conflito preserva edição local, bloqueia troca e permite recarregar explicitamente', async () => {
    const { result } = renderHook(() => useCampanhas(ambiente.repositorio));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => { await result.current.criar('Primeira'); });
    const primeira = result.current.dados!.campanha.id;
    await act(async () => { await result.current.criar('Segunda'); });
    const segunda = result.current.dados!.campanha.id;
    const externa = (await ambiente.repositorio.obter(segunda))!;
    externa.campanha = atualizarRoteiro(externa, 'Alteração em outra aba').campanha;
    await ambiente.repositorio.salvar(externa);
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Edição local')));
    await act(async () => { await result.current.salvarAgora(); });
    expect(result.current.conflito).toBeTruthy();
    expect(result.current.dados!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Edição local');
    await act(async () => { await result.current.selecionar(primeira); });
    expect(result.current.dados!.campanha.id).toBe(segunda);
    await act(async () => { await result.current.recarregar(); });
    expect(result.current.dados!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Alteração em outra aba');
    expect(result.current.conflito).toBeFalsy();
  });

  test('falha de listagem é exposta sem apagar dados do repositório', async () => {
    jest.spyOn(ambiente.repositorio, 'listar').mockRejectedValueOnce(new ErroPersistencia('bloqueado', 'Armazenamento bloqueado'));
    const { result } = renderHook(() => useCampanhas(ambiente.repositorio));
    await waitFor(() => expect(result.current.erro).toBeTruthy());
    expect(result.current.carregando).toBe(false);
    await act(async () => { await result.current.listar(); });
    expect(result.current.campanhas).toEqual([]);
  });

  test('edição durante gravação não é substituída pela leitura da revisão anterior', async () => {
    const { repositorio } = ambiente;
    const { result } = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => { await result.current.criar('Sessão'); });
    const salvarOriginal = repositorio.salvar.bind(repositorio);
    let liberar!: () => void;
    const pausa = new Promise<void>(resolve => { liberar = resolve; });
    const salvar = jest.spyOn(repositorio, 'salvar').mockImplementationOnce(async dados => {
      await pausa;
      await salvarOriginal(dados);
    });
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Primeira edição')));
    let gravacao!: Promise<unknown>;
    act(() => { gravacao = result.current.salvarAgora(); });
    await waitFor(() => expect(salvar).toHaveBeenCalledTimes(1));
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Edição durante gravação')));
    await act(async () => { liberar(); await gravacao; await result.current.salvarAgora(); });
    expect(result.current.dados!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Edição durante gravação');
    expect((await repositorio.obter(result.current.dados!.campanha.id))!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Edição durante gravação');
    expect(result.current.conflito).toBeFalsy();
  });

  test('leitura antiga não substitui a última campanha selecionada', async () => {
    const { repositorio } = ambiente;
    const { result } = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => { await result.current.criar('Primeira'); });
    const primeira = result.current.dados!.campanha.id;
    await act(async () => { await result.current.criar('Segunda'); });
    const segunda = result.current.dados!.campanha.id;
    const obterOriginal = repositorio.obter.bind(repositorio);
    let liberar!: () => void;
    const pausa = new Promise<void>(resolve => { liberar = resolve; });
    const obter = jest.spyOn(repositorio, 'obter').mockImplementationOnce(async id => { await pausa; return obterOriginal(id); });
    let leituraAntiga!: Promise<unknown>;
    act(() => { leituraAntiga = result.current.selecionar(primeira); });
    await waitFor(() => expect(obter).toHaveBeenCalledTimes(1));
    await act(async () => { await result.current.selecionar(segunda); });
    await act(async () => { liberar(); await leituraAntiga; });
    expect(result.current.dados!.campanha.id).toBe(segunda);
  });

  test('falha ao sair da rota preserva rascunho na remontagem e permite nova tentativa', async () => {
    const { repositorio } = ambiente;
    const view = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(view.result.current.carregando).toBe(false));
    await act(async () => { await view.result.current.criar('Sessão em curso'); });
    const salvar = jest.spyOn(repositorio, 'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida', 'Cota esgotada'));
    act(() => view.result.current.atualizar(dados => atualizarRoteiro(dados, 'Não perder estas notas')));
    const evento = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
    view.unmount();
    const utils = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(utils.result.current.carregando).toBe(false));
    expect(salvar).toHaveBeenCalledTimes(1);
    expect(utils.result.current.dados!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Não perder estas notas');
    expect(utils.result.current.erro).toMatch(/recuperadas/);
    expect(utils.result.current.pendente).toBe(true);
    await act(async () => { expect(await utils.result.current.salvarAgora()).toBe(true); });
    expect(utils.result.current.pendente).toBe(false);
    const salvo = await repositorio.obter(utils.result.current.dados!.campanha.id);
    expect(salvo!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Não perder estas notas');
    const semPendencias = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(semPendencias);
    expect(semPendencias.defaultPrevented).toBe(false);
  });

  test('autosave agrupa edições consecutivas e grava o último texto', async () => {
    const { repositorio } = ambiente;
    const { result } = renderHook(() => useCampanhas(repositorio));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => { await result.current.criar('Preparação'); });
    const salvar = jest.spyOn(repositorio, 'salvar');
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Uma pista')));
    act(() => result.current.atualizar(dados => atualizarRoteiro(dados, 'Uma pista e um segredo')));
    expect(salvar).not.toHaveBeenCalled();
    expect(result.current.pendente).toBe(true);
    await waitFor(() => expect(result.current.pendente).toBe(false));
    expect(salvar).toHaveBeenCalledTimes(1);
    expect(salvar).toHaveBeenCalledWith(expect.objectContaining({ campanha: expect.objectContaining({ roteiros: [expect.objectContaining({ id: 'roteiro-teste', conteudo: 'Uma pista e um segredo' })] }) }));
    expect((await repositorio.obter(result.current.dados!.campanha.id))!.campanha.roteiros?.find(r => r.id === 'roteiro-teste')?.conteudo).toBe('Uma pista e um segredo');
  });
});
