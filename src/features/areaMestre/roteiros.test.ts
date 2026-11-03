
import './ambienteIndexedDB.testUtils';
import { IDBFactory, IDBCursor } from 'fake-indexeddb';
import { zipSync, unzipSync, strFromU8, strToU8 } from 'fflate';
import { normalizarRoteirosCampanha } from './roteiros';
import { criarRepositorioCampanhas } from './persistencia';
import { exportarBackup, lerBackup, restaurarBackup } from './backup';
import { DadosCampanha } from './modelos';
import { validarDadosCampanha } from './validacao';

const data = '2026-10-17T12:00:00Z';
function dados(): DadosCampanha {
  return {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Campanha', roteiro: 'Texto legado\ncompleto', criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], instancias: [], combates: [], participantes: [],
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}

test('normalizacao conserva texto completo, evita colisao e e idempotente', () => {
  const original = dados().campanha;
  original.roteiros = [{ id: 'roteiro-legado', titulo: 'Outro', conteudo: 'Independente', criadoEm: data, atualizadoEm: data }];
  const resultado = normalizarRoteirosCampanha(original);
  expect(resultado.roteiro).toBe('');
  expect(resultado.roteiros?.map(r => r.conteudo)).toEqual(['Independente', original.roteiro]);
  expect(resultado.roteiros?.[1].id).toBe('roteiro-legado-1');
  expect(normalizarRoteirosCampanha(resultado)).toBe(resultado);
  expect(original.roteiro).toBe('Texto legado\ncompleto');
});

test('migra banco v1 e mantem scripts independentes apos reabrir v2', async () => {
  const indexedDB = new IDBFactory();
  const antigo = criarRepositorioCampanhas({ indexedDB, versao: 1 });
  await antigo.criar(dados());
  antigo.fechar();
  const atual = criarRepositorioCampanhas({ indexedDB });
  try {
    const migrado = (await atual.obter('c'))!;
    expect(migrado.campanha.roteiro).toBe('');
    expect(migrado.campanha.roteiros?.[0].conteudo).toBe(dados().campanha.roteiro);
    migrado.campanha.roteiros!.push({ id: 'segundo', titulo: 'Segundo', conteudo: 'Outra sessao', criadoEm: data, atualizadoEm: data });
    migrado.campanha.roteiros![0].conteudo = 'Primeiro editado';
    await atual.salvar(migrado);
    atual.fechar();
    const reaberto = (await atual.obter('c'))!;
    expect(reaberto.campanha.roteiros?.map(r => r.conteudo)).toEqual(['Primeiro editado', 'Outra sessao']);
  } finally { atual.fechar(); }
});

test('backup v1 e migrado e backup v6 restaura todos os roteiros com IDs novos', async () => {
  const original = dados();
  const zip = unzipSync(new Uint8Array(await (await exportarBackup(original)).arrayBuffer()));
  const manifesto = JSON.parse(strFromU8(zip['manifesto.json']));
  expect(manifesto.versao).toBe(6);
  manifesto.versao = 1;
  zip['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  const migrado = await lerBackup(new Blob([zipSync(zip)]));
  expect(migrado.campanha.roteiros?.[0].conteudo).toBe(original.campanha.roteiro);
  migrado.campanha.roteiros!.push({ id: 'outro', titulo: 'Segundo', conteudo: 'Outra sessao', criadoEm: data, atualizadoEm: data });
  let contador = 0;
  const criar = jest.fn().mockResolvedValue(undefined);
  const restaurado = await restaurarBackup(await exportarBackup(migrado), { criar }, () => `novo-${++contador}`);
  expect(restaurado.campanha.roteiros?.map(r => r.conteudo)).toEqual(migrado.campanha.roteiros?.map(r => r.conteudo));
  expect(restaurado.campanha.roteiros?.map(r => r.id)).not.toEqual(migrado.campanha.roteiros?.map(r => r.id));
  expect(criar).toHaveBeenCalledTimes(1);
});

test('rejeita roteiros duplicados e larguras fora dos limites', () => {
  const campanha = dados();
  campanha.campanha = normalizarRoteirosCampanha(campanha.campanha);
  campanha.campanha.roteiros!.push({ ...campanha.campanha.roteiros![0] });
  expect(() => validarDadosCampanha(campanha)).toThrow();
  campanha.campanha.roteiros!.pop();
  campanha.layout.larguraSidebar = 199;
  expect(() => validarDadosCampanha(campanha)).toThrow();
  campanha.layout.larguraSidebar = 260;
  campanha.layout.larguraPV = 320;
  expect(() => validarDadosCampanha(campanha)).not.toThrow();
});

test('texto legado longo continua acessivel depois da migracao', () => {
  const original = dados();
  original.campanha.roteiro = 'x'.repeat(4 * 1024 * 1024 + 1);
  const migrado = { ...original, campanha: normalizarRoteirosCampanha(original.campanha) };
  expect(migrado.campanha.roteiros?.[0].conteudo).toBe(original.campanha.roteiro);
  expect(() => validarDadosCampanha(migrado)).not.toThrow();
});

test('falha ao atualizar roteiro na migracao v2 preserva banco v1 e texto original', async () => {
  const indexedDB = new IDBFactory();
  const antigo = criarRepositorioCampanhas({ indexedDB, versao: 1 });
  const original = dados();
  await antigo.criar(original);
  antigo.fechar();
  const atualizarOriginal = IDBCursor.prototype.update;
  const put = jest.spyOn(IDBCursor.prototype, 'update').mockImplementationOnce(function (this: IDBCursor, valor) {
    const pedido = atualizarOriginal.call(this, valor);
    (this.source as IDBObjectStore).transaction.abort();
    return pedido;
  });
  const atual = criarRepositorioCampanhas({ indexedDB });
  try {
    await expect(atual.listar()).rejects.toMatchObject({ codigo: 'migracao-falhou' });
  } finally { put.mockRestore(); atual.fechar(); }
  const banco = await new Promise<IDBDatabase>((resolve, reject) => {
    const pedido = indexedDB.open('minhafichadnd-area-mestre', 1);
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
  try {
    expect(banco.version).toBe(1);
    const campanha = await new Promise((resolve, reject) => {
      const pedido = banco.transaction('campanhas').objectStore('campanhas').get(original.campanha.id);
      pedido.onsuccess = () => resolve(pedido.result);
      pedido.onerror = () => reject(pedido.error);
    });
    expect(campanha).toEqual({ ...original.campanha, revisao: 1 });
  } finally { banco.close(); }
});
