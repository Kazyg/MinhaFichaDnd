/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { DadosCampanha } from './modelos';
import { criarRepositorioCampanhas, MIGRACOES_MESTRE } from './persistencia';

function campanha(id = 'campanha-1'): DadosCampanha {
  return {
    campanha: { id, schemaVersion: 1, nome: 'Aventura', roteiro: 'Preparação', criadoEm: '2026-10-17T12:00:00.000Z', atualizadoEm: '2026-10-17T12:00:00.000Z' },
    anexos: [], fichas: [], instancias: [], combates: [], participantes: [],
    layout: { campanhaId: id, versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}

function comFicha(id = 'campanha-1'): DadosCampanha {
  const dados = campanha(id);
  const arquivo = new Blob(['%PDF-1.7\noriginal'], { type: 'application/pdf' });
  dados.anexos.push({ id: 'anexo-1', campanhaId: id, nome: 'goblin.pdf', mime: arquivo.type, tamanho: arquivo.size, arquivo });
  dados.fichas.push({ id: 'ficha-1', campanhaId: id, categoria: 'monstro', formato: 'pdf', anexoId: 'anexo-1', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: ['extracao-manual'], importadoEm: dados.campanha.criadoEm });
  dados.instancias = ['a', 'b'].map(idInstancia => ({ id: idInstancia, campanhaId: id, fichaOriginalId: 'ficha-1', categoria: 'monstro', nome: 'Goblin', pv: { atuais: 7, maximos: 7 } }));
  return dados;
}

describe('persistência IndexedDB da Área do Mestre', () => {
  let fabrica: IDBFactory;
  let repositorio: ReturnType<typeof criarRepositorioCampanhas>;
  beforeEach(() => { fabrica = new IDBFactory(); repositorio = criarRepositorioCampanhas({ indexedDB: fabrica }); });
  afterEach(() => repositorio.fechar());

  test('cria, lista metadados e recupera após fechar/reabrir', async () => {
    await repositorio.criar(campanha());
    expect(await repositorio.listar()).toEqual([expect.objectContaining({ id: 'campanha-1', revisao: 1 })]);
    repositorio.fechar();
    expect(await repositorio.obter('campanha-1')).toEqual({ ...campanha(), campanha: { ...campanha().campanha, revisao: 1 } });
    expect(await repositorio.obter('ausente')).toBeNull();
  });

  test('atualiza roteiro/layout e mantém PV independentes sem duplicar anexos', async () => {
    await repositorio.criar(comFicha());
    const dados = (await repositorio.obter('campanha-1'))!;
    dados.instancias[0].pv.atuais = 2;
    dados.campanha.roteiro = 'Nova cena';
    dados.layout.sidebarRecolhida = true;
    await repositorio.salvar(dados);
    const salvo = (await repositorio.obter('campanha-1'))!;
    expect(salvo.instancias.map(i => i.pv.atuais)).toEqual([2, 7]);
    expect(salvo.anexos).toHaveLength(1);
    expect(salvo.campanha).toMatchObject({ roteiro: 'Nova cena', revisao: 2 });
    expect(salvo.layout.sidebarRecolhida).toBe(true);
  });

  test('captura snapshot validado antes do primeiro await', async () => {
    const dados = comFicha();
    const gravacao = repositorio.criar(dados);
    dados.campanha.nome = 'Mutação posterior';
    dados.instancias[0].fichaOriginalId = 'referencia-invalida';
    dados.anexos = [];
    await gravacao;
    expect(await repositorio.obter('campanha-1')).toMatchObject({ campanha: { nome: 'Aventura' }, anexos: [expect.objectContaining({ id: 'anexo-1' })] });
  });

  test('atualizar PV não regrava Blob já recuperado na mesma revisão', async () => {
    await repositorio.criar(comFicha());
    const dados = (await repositorio.obter('campanha-1'))!;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put');
    try {
      dados.instancias[0].pv.atuais = 1;
      await repositorio.salvar(dados);
      const stores = (put.mock.instances as unknown as IDBObjectStore[]).map(store => store.name);
      expect(stores).not.toContain('arquivos');
      expect(stores).toContain('instancias');
    } finally { put.mockRestore(); }
  });

  test('cota excedida depois de gravar metadados provoca rollback de tudo', async () => {
    const putOriginal = IDBObjectStore.prototype.put;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
      if (this.name === 'arquivos') throw new DOMException('Simulada', 'QuotaExceededError');
      return putOriginal.call(this, valor, chave);
    });
    try { await expect(repositorio.criar(comFicha())).rejects.toMatchObject({ codigo: 'cota-excedida' }); }
    finally { put.mockRestore(); }
    expect(await repositorio.listar()).toEqual([]);
    await repositorio.criar(comFicha());
    expect((await repositorio.obter('campanha-1'))!.anexos).toHaveLength(1);
  });

  test.each([
    ['application/pdf', 'documento.pdf', '%PDF-1.7\noriginal'],
    ['image/png', 'retrato.png', '\x89PNG\r\n\x1a\noriginal'],
    ['application/json', 'ficha.json', '{"nomePersonagem":"Aria"}'],
  ])('preserva bytes e metadados de %s', async (mime, nome, conteudo) => {
    const dados = campanha();
    const arquivo = new Blob([conteudo], { type: mime });
    dados.anexos = [{ id: 'arquivo', campanhaId: dados.campanha.id, nome, mime, tamanho: arquivo.size, arquivo }];
    await repositorio.criar(dados);
    const anexo = (await repositorio.obter(dados.campanha.id))!.anexos[0];
    expect({ ...anexo, arquivo: undefined }).toEqual({ ...dados.anexos[0], arquivo: undefined });
    expect(new Uint8Array(await anexo.arquivo.arrayBuffer())).toEqual(new Uint8Array(await arquivo.arrayBuffer()));
  });

  test('exclui campanha com todos os registros associados, sem remover outra', async () => {
    await repositorio.criar(comFicha());
    await repositorio.criar(campanha('outra'));
    await repositorio.excluir('campanha-1');
    expect(await repositorio.obter('campanha-1')).toBeNull();
    expect(await repositorio.obter('outra')).not.toBeNull();
    // Os IDs antigos tornam-se disponíveis após a exclusão em cascata.
    await repositorio.criar(comFicha('nova'));
    expect((await repositorio.obter('nova'))!.anexos).toHaveLength(1);
    await expect(repositorio.excluir('ausente')).rejects.toMatchObject({ codigo: 'nao-encontrado' });
  });

  test('bloqueia ficha dependente e anexo compartilhado; permite remoção explícita após desvincular', async () => {
    await repositorio.criar(comFicha());
    await expect(repositorio.excluirFicha('campanha-1', 'ficha-1')).rejects.toMatchObject({ codigo: 'conflito' });
    await expect(repositorio.excluirAnexo('campanha-1', 'anexo-1')).rejects.toMatchObject({ codigo: 'conflito' });
    const dados = (await repositorio.obter('campanha-1'))!;
    dados.instancias = [];
    await repositorio.salvar(dados);
    await repositorio.excluirFicha('campanha-1', 'ficha-1');
    expect((await repositorio.obter('campanha-1'))!.anexos).toHaveLength(1);
    await repositorio.excluirAnexo('campanha-1', 'anexo-1');
    expect((await repositorio.obter('campanha-1'))!.anexos).toHaveLength(0);
  });

  test('rejeita revisão obsoleta e criação duplicada entre sessões', async () => {
    await repositorio.criar(campanha());
    const outraAba = criarRepositorioCampanhas({ indexedDB: fabrica });
    try {
      const [a, b] = await Promise.all([repositorio.obter('campanha-1'), outraAba.obter('campanha-1')]);
      a!.campanha.nome = 'Primeira'; b!.campanha.nome = 'Obsoleta';
      await repositorio.salvar(a!);
      await expect(outraAba.salvar(b!)).rejects.toMatchObject({ codigo: 'conflito' });
      await expect(outraAba.criar(campanha())).rejects.toMatchObject({ codigo: 'conflito' });
      expect((await repositorio.obter('campanha-1'))!.campanha.nome).toBe('Primeira');
    } finally { outraAba.fechar(); }
  });

  test('cache de Blob não impede restaurar conteúdo anterior após edição em outra aba', async () => {
    await repositorio.criar(comFicha());
    const antigo = (await repositorio.obter('campanha-1'))!.anexos[0].arquivo;
    const outraAba = criarRepositorioCampanhas({ indexedDB: fabrica });
    try {
      const outra = (await outraAba.obter('campanha-1'))!;
      const substituto = new Blob(['%PDF-1.7\nalterado'], { type: 'application/pdf' });
      outra.anexos[0].arquivo = substituto;
      outra.anexos[0].tamanho = substituto.size;
      await outraAba.salvar(outra);
      const atual = (await repositorio.obter('campanha-1'))!;
      atual.anexos[0].arquivo = antigo;
      atual.anexos[0].tamanho = antigo.size;
      await repositorio.salvar(atual);
      expect(await (await repositorio.obter('campanha-1'))!.anexos[0].arquivo.text()).toBe('%PDF-1.7\noriginal');
    } finally { outraAba.fechar(); }
  });

  test('rollback da substituição inteira quando um ID colide com outra campanha', async () => {
    await repositorio.criar(comFicha());
    await repositorio.criar(campanha('outra'));
    const dados = (await repositorio.obter('outra'))!;
    const original = comFicha('outra');
    dados.anexos = original.anexos;
    dados.fichas = original.fichas;
    dados.instancias = original.instancias;
    dados.campanha.nome = 'Não deve gravar';
    await expect(repositorio.salvar(dados)).rejects.toMatchObject({ codigo: 'conflito' });
    expect(await repositorio.obter('outra')).toMatchObject({ campanha: { nome: 'Aventura', revisao: 1 }, anexos: [], fichas: [], instancias: [] });
    expect((await repositorio.obter('campanha-1'))!.anexos).toHaveLength(1);
  });

  test('rejeita referência inválida antes de qualquer gravação', async () => {
    const dados = comFicha(); dados.anexos = [];
    await expect(repositorio.criar(dados)).rejects.toMatchObject({ codigo: 'dados-corrompidos' });
    expect(await repositorio.listar()).toEqual([]);
    await expect(repositorio.salvar(campanha())).rejects.toMatchObject({ codigo: 'nao-encontrado' });
  });

  test('preserva dados em upgrade sequencial e fecha conexão antiga por versionchange', async () => {
    await repositorio.criar(comFicha());
    const nova = criarRepositorioCampanhas({ indexedDB: fabrica, versao: 5, migracoes: { ...MIGRACOES_MESTRE, 5: banco => { banco.createObjectStore('futuro'); } } });
    try {
      expect((await nova.obter('campanha-1'))!.fichas[0].nome).toBe('Goblin');
      await expect(repositorio.listar()).rejects.toMatchObject({ codigo: 'versao-incompativel' });
    } finally { nova.fechar(); }
  });

  test('falha de migração aborta upgrade e conserva versão e dados anteriores', async () => {
    await repositorio.criar(comFicha()); repositorio.fechar();
    const falha = criarRepositorioCampanhas({ indexedDB: fabrica, versao: 5, migracoes: { ...MIGRACOES_MESTRE, 5: banco => { banco.createObjectStore('temporaria'); throw new Error('falha simulada'); } } });
    await expect(falha.listar()).rejects.toMatchObject({ codigo: 'migracao-falhou' });
    falha.fechar();
    expect((await repositorio.obter('campanha-1'))!.anexos).toHaveLength(1);
  });

  test('abertura bloqueada não remove registros e informa erro previsível', async () => {
    await repositorio.criar(campanha()); repositorio.fechar();
    const antiga = await new Promise<IDBDatabase>((resolve, reject) => { const pedido = fabrica.open('minhafichadnd-area-mestre', 4); pedido.onsuccess = () => resolve(pedido.result); pedido.onerror = reject; });
    const nova = criarRepositorioCampanhas({ indexedDB: fabrica, versao: 5, migracoes: { ...MIGRACOES_MESTRE, 5: () => undefined } });
    try { await expect(nova.listar()).rejects.toMatchObject({ codigo: 'bloqueado' }); }
    finally { antiga.close(); nova.fechar(); }
  });

  test.each([['SecurityError', 'bloqueado'], ['QuotaExceededError', 'cota-excedida']])('normaliza falha de abertura %s', async (nome, codigo) => {
    const fabricaFalha = { open: () => { throw new DOMException('Simulado', nome); } } as unknown as IDBFactory;
    const falha = criarRepositorioCampanhas({ indexedDB: fabricaFalha });
    await expect(falha.listar()).rejects.toMatchObject({ codigo });
  });
});
