
import './ambienteIndexedDB.testUtils';
import { TextEncoder } from 'util';
import { webcrypto } from 'crypto';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { unzipSync, zipSync } from 'fflate';
import { exportarBackup, restaurarBackup } from './backup';
import { criarInstancia } from './dominio';
import { DadosCampanha } from './modelos';
import { normalizarRoteirosCampanha } from './roteiros';
import { RepositorioCampanhasIndexedDB } from './persistencia';

const data = '2026-10-17T12:00:00.000Z';

function campanhaCompleta(): DadosCampanha {
  const anexos = [
    { id: 'pdf', nome: 'Goblin.pdf', mime: 'application/pdf', bytes: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55, 0, 255]) },
    { id: 'retrato', nome: 'retrato.png', mime: 'image/png', bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 128]) },
    { id: 'json', nome: 'Aria.json', mime: 'application/json', bytes: new TextEncoder().encode('{"id":"aria-original","nomePersonagem":"Ária","vidaTotal":24,"vidaAtual":17,"versaoRegras":"DND_2024"}\n') },
  ].map(({ bytes, ...metadados }) => ({ ...metadados, campanhaId: 'campanha', tamanho: bytes.length, arquivo: new Blob([bytes], { type: metadados.mime }) }));
  const fichas: DadosCampanha['fichas'] = [
    { id: 'goblin', campanhaId: 'campanha', categoria: 'monstro', formato: 'pdf', anexoId: 'pdf', imagemAnexoId: 'retrato', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: ['extracao-manual'], importadoEm: data },
    { id: 'aria', campanhaId: 'campanha', categoria: 'jogador', formato: 'json', anexoId: 'json', imagemAnexoId: 'retrato', nome: 'Ária', pvIniciais: { atuais: 17, maximos: 24 }, origemPV: 'json', origemJson: { id: 'aria-original', versaoRegras: 'DND_2024', envelope: false }, avisos: [], importadoEm: data },
  ];
  return {
    campanha: { id: 'campanha', schemaVersion: 1, nome: 'A caverna', roteiro: 'Entrada\nInvestigar o altar: ação secreta.', criadoEm: data, atualizadoEm: data },
    anexos, fichas,
    instancias: [criarInstancia(fichas[0], 'goblin-1', 'Goblin arqueiro'), criarInstancia(fichas[0], 'goblin-2', 'Goblin vigia'), criarInstancia(fichas[1], 'aria-1')],
    combates: [{ id: 'combate', campanhaId: 'campanha', estado: 'ativo', rodada: 3, participanteAtivoId: 'participante-2', iniciadoEm: data, encerradoEm: null }],
    participantes: [
      { id: 'participante-1', combateId: 'combate', instanciaId: 'goblin-1', iniciativa: 18, ordem: 0, pvInicio: { atuais: 7, maximos: 7 } },
      { id: 'participante-2', combateId: 'combate', instanciaId: 'aria-1', iniciativa: 18, ordem: 1, pvInicio: { atuais: 17, maximos: 24 } },
    ],
    layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: true, larguraSidebar: 280, larguraPV: 360, paineis: [
      { id: 'painel', tipo: 'roteiro', x: 10, y: 20, largura: 640, altura: 400, recolhido: false, fechado: false },
    ] },
  };
}

function normalizar(dados: DadosCampanha) {
  dados = { ...dados, campanha: normalizarRoteirosCampanha(dados.campanha) };
  for (const grupo of ['anexos', 'fichas', 'instancias', 'combates', 'participantes'] as const) {

    Object.assign(dados, { [grupo]: [...dados[grupo]].sort((a, b) => a.id.localeCompare(b.id)) });
  }
  const ids = new Map<string, string>();
  const registrar = (id: string, papel: string) => ids.set(id, papel);
  registrar(dados.campanha.id, 'campanha');
  for (const grupo of ['anexos', 'fichas', 'instancias', 'combates', 'participantes'] as const) {
    dados[grupo].forEach((registro, indice) => registrar(registro.id, `${grupo}-${indice}`));
  }
  dados.campanha.roteiros?.forEach((roteiro, indice) => registrar(roteiro.id, `roteiro-${indice}`));
  dados.layout.paineis.forEach((painel, indice) => registrar(painel.id, `painel-${indice}`));
  return JSON.parse(JSON.stringify(dados, (chave, valor) => {
    if (chave === 'arquivo' || chave === 'revisao') return undefined;
    if (typeof valor === 'string' && ['id', 'campanhaId', 'anexoId', 'imagemAnexoId', 'fichaOriginalId', 'combateId', 'instanciaId', 'participanteAtivoId'].includes(chave)) return ids.get(valor) || valor;
    return valor;
  }));
}

describe('round-trip completo IndexedDB → ZIP → nova campanha', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
  });

  test('preserva bytes, metadados, roteiro, layout, snapshots e PV independentes ao reabrir e restaurar', async () => {
    const fabrica = new IDBFactory();
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'round-trip' });
    const original = campanhaCompleta();
    original.campanha = normalizarRoteirosCampanha(original.campanha);
    original.campanha.roteiros!.push({ id: 'segunda-sessao', titulo: 'Segunda sessao', conteudo: 'Outro roteiro independente', criadoEm: data, atualizadoEm: data });
    await repo.criar(original);
    original.campanha.revisao = (await repo.obter(original.campanha.id))!.campanha.revisao;
    original.instancias[0].pv.atuais = 2;
    original.instancias[2].pv.atuais = 13;
    await repo.salvar(original);
    repo.fechar();
    const reaberto = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'round-trip' });
    const persistido = (await reaberto.obter(original.campanha.id))!;
    expect(persistido.instancias.find(instancia => instancia.id === 'goblin-1')!.pv.atuais).toBe(2);
    expect(persistido.instancias.find(instancia => instancia.id === 'goblin-2')!.pv.atuais).toBe(7);
    expect(persistido.instancias.find(instancia => instancia.id === 'aria-1')!.pv.atuais).toBe(13);
    const backup = await exportarBackup(persistido);
    let numero = 0;
    const restaurado = await restaurarBackup(backup, reaberto, () => `novo-${String(++numero).padStart(3, '0')}`);
    expect(restaurado.campanha.id).not.toBe(original.campanha.id);
    expect(await reaberto.listar()).toHaveLength(2);
    const recuperado = (await reaberto.obter(restaurado.campanha.id))!;
    expect(normalizar(recuperado)).toEqual(normalizar(persistido));
    for (const anexo of original.anexos) {
      const copia = recuperado.anexos.find(item => item.nome === anexo.nome)!;
      expect(new Uint8Array(await copia.arquivo.arrayBuffer())).toEqual(new Uint8Array(await anexo.arquivo.arrayBuffer()));
    }
    expect(recuperado.anexos).toHaveLength(3);
    expect(recuperado.campanha.roteiros?.map(r => r.conteudo)).toEqual(original.campanha.roteiros!.map(r => r.conteudo));
    expect(recuperado.campanha.roteiros).toHaveLength(2);
    expect(await reaberto.obter(original.campanha.id)).toEqual(persistido);
    reaberto.fechar();
  });

  test.each(['ausente', 'corrompido'] as const)('rejeita anexo %s sem deixar registros parciais', async modo => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: `backup-${modo}` });
    const original = campanhaCompleta();
    await repo.criar(original);
    const backup = await exportarBackup(original);
    const arquivos = unzipSync(new Uint8Array(await backup.arrayBuffer()));
    const caminho = Object.keys(arquivos).find(nome => nome.startsWith('anexos/'))!;
    if (modo === 'ausente') delete arquivos[caminho];
    else arquivos[caminho] = new Uint8Array([0, 1, 2]);
    await expect(restaurarBackup(new Blob([zipSync(arquivos)]), repo)).rejects.toThrow();
    expect(await repo.listar()).toEqual([{ ...original.campanha, revisao: 1 }]);
    expect(normalizar((await repo.obter(original.campanha.id))!)).toEqual(normalizar(original));
    repo.fechar();
  });

  test('colisão de IDs na restauração preserva a campanha existente e não grava dados parciais', async () => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'colisao' });
    const original = campanhaCompleta();
    await repo.criar(original);
    const backup = await exportarBackup(original);
    await expect(restaurarBackup(backup, repo, () => original.campanha.id)).rejects.toThrow();
    expect(await repo.listar()).toEqual([{ ...original.campanha, revisao: 1 }]);
    expect(normalizar((await repo.obter(original.campanha.id))!)).toEqual(normalizar(original));
    repo.fechar();
  });

  test('cota esgotada no segundo arquivo restaura atomicamente e permite tentar novamente', async () => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'cota-restauracao' });
    const original = campanhaCompleta();
    await repo.criar(original);
    const backup = await exportarBackup(original);
    const putOriginal = IDBObjectStore.prototype.put;
    let arquivosGravados = 0;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
      if (this.name === 'arquivos' && ++arquivosGravados === 2) throw new DOMException('Cota simulada', 'QuotaExceededError');
      return putOriginal.call(this, valor, chave);
    });
    try {
      await expect(restaurarBackup(backup, repo)).rejects.toMatchObject({ codigo: 'cota-excedida' });
    } finally { put.mockRestore(); }
    expect(await repo.listar()).toEqual([{ ...original.campanha, revisao: 1 }]);
    expect(normalizar((await repo.obter(original.campanha.id))!)).toEqual(normalizar(original));
    const restaurado = await restaurarBackup(backup, repo);
    expect(await repo.listar()).toHaveLength(2);
    expect((await repo.obter(restaurado.campanha.id))!.anexos).toHaveLength(3);
    repo.fechar();
  });
});

