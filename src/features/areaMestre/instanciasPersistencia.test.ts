/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { IDBFactory } from 'fake-indexeddb';
import { RepositorioCampanhasIndexedDB } from './persistencia';
import { aplicarDano, criarInstanciaAdicional, duplicarInstancia } from './instancias';
import { DadosCampanha } from './modelos';

test('PV de três instâncias persistem independentemente e gravação obsoleta é rejeitada', async () => {
  const fabrica = new IDBFactory();
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'pv-independentes' });
  const data = '2026-10-17T12:00:00Z';
  const arquivo = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
  let dados: DadosCampanha = {
    campanha: { id: 'c', nome: 'Teste', roteiro: '', schemaVersion: 1, criadoEm: data, atualizadoEm: data },
    anexos: [{ id: 'a', campanhaId: 'c', nome: 'Goblin.png', mime: 'image/png', tamanho: arquivo.size, arquivo }],
    fichas: [{ id: 'f', campanhaId: 'c', categoria: 'monstro', formato: 'imagem', anexoId: 'a', imagemAnexoId: 'a', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: [], importadoEm: data }],
    instancias: [], combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
  try {
    dados = criarInstanciaAdicional(dados, 'f', 'i1');
    dados = criarInstanciaAdicional(dados, 'f', 'i2');
    dados = duplicarInstancia(dados, 'i1', 'i3');
    await repo.criar(dados);
    const obsoleto = (await repo.obter('c'))!;
    dados = aplicarDano((await repo.obter('c'))!, 'i2', 5);
    await repo.salvar(dados);
    await expect(repo.salvar(aplicarDano(obsoleto, 'i1', 7))).rejects.toMatchObject({ codigo: 'conflito' });
    repo.fechar();
    const recuperado = (await repo.obter('c'))!;
    expect(recuperado.instancias.map(item => item.pv.atuais)).toEqual([7, 2, 7]);
    expect(recuperado.anexos).toHaveLength(1);
    expect(recuperado.fichas[0].pvIniciais).toEqual({ atuais: 7, maximos: 7 });
    expect(new Uint8Array(await recuperado.anexos[0].arquivo.arrayBuffer())).toEqual(new Uint8Array(await arquivo.arrayBuffer()));
  } finally { repo.fechar(); }
});
