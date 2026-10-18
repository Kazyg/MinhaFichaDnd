/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { webcrypto } from 'crypto';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { exportFicha } from '../../api/fichaPersonagem/fichaStorage';
import { exportarBackup, restaurarBackup } from './backup';
import { criarInstancia } from './dominio';
import { prepararImportacao } from './importacao';
import { DadosCampanha } from './modelos';
import { confirmarPreparacao, RascunhoPreparacaoCombate } from './preparacaoCombate';
import { RepositorioCampanhasIndexedDB } from './persistencia';

const data = '2026-10-18T12:00:00.000Z';
// A File's immutable name is the only extra field the importer needs over Blob.
const arquivo = (conteudo: string, nome: string, mime: string): File => Object.assign(new Blob([conteudo], { type: mime }), { name: nome, lastModified: 0 }) as File;

async function importarCampanha(): Promise<DadosCampanha> {
  const contexto = { campanhaId: 'campanha', importadoEm: data };
  const jogador = await prepararImportacao(arquivo(exportFicha(new Ficha({ id: 'aria-original', nomePersonagem: 'Ária', versaoRegras: 'DND_2024', vidaTotal: 24, vidaAtual: 13 })), 'Aria.json', 'application/json'), { ...contexto, fichaId: 'aria', anexoId: 'json', categoria: 'jogador' });
  const monstro = await prepararImportacao(arquivo('%PDF-1.7\nGoblin original\n', 'Goblin.pdf', 'application/pdf'), { ...contexto, fichaId: 'goblin', anexoId: 'pdf', categoria: 'monstro' });
  // Manual review of missing PDF HP uses existing import flow; no OCR is needed.
  monstro.ficha.pvIniciais = { atuais: 7, maximos: 7 };
  return {
    campanha: { id: 'campanha', schemaVersion: 1, nome: 'Preparação', roteiro: '', criadoEm: data, atualizadoEm: data },
    fichas: [jogador.ficha, monstro.ficha], anexos: [jogador.anexo, monstro.anexo],
    instancias: [criarInstancia(jogador.ficha, 'aria-1'), criarInstancia(monstro.ficha, 'goblin-1', 'Goblin 1')],
    combates: [], participantes: [], layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}

function preparar(dados: DadosCampanha): RascunhoPreparacaoCombate {
  const goblin = dados.fichas.find(f => f.id === 'goblin')!;
  const instancias = [dados.instancias.find(i => i.id === 'aria-1')!, dados.instancias.find(i => i.id === 'goblin-1')!, criarInstancia(goblin, 'goblin-2', 'Goblin 2'), criarInstancia(goblin, 'goblin-3', 'Goblin 3')];
  return { participantes: instancias.map((instancia, i) => ({ id: `participante-${i}`, instancia: { ...instancia, pv: { ...instancia.pv } }, iniciativa: [12, -2, 0, 12][i] })) };
}

describe('preparação completa com IndexedDB transacional e backup', () => {
  beforeAll(() => Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto }));

  test('importa jogador e PDF, confirma três monstros independentes, reabre e restaura relacionamentos e bytes', async () => {
    const fabrica = new IDBFactory();
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'preparacao-round-trip' });
    await repo.criar(await importarCampanha());
    const inicial = (await repo.obter('campanha'))!;
    const rascunho = preparar(inicial);
    rascunho.participantes[2].instancia.pv.atuais = 2;
    const pronto = confirmarPreparacao(inicial, rascunho, 'encontro', data);
    expect(inicial.instancias).toHaveLength(2);
    expect(inicial.combates).toEqual([]);
    await repo.salvar(pronto);
    repo.fechar();
    const reaberto = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'preparacao-round-trip' });
    try {
      const salvo = (await reaberto.obter('campanha'))!;
      expect(salvo.combates).toEqual([{ id: 'encontro', nome: 'Combate 1', campanhaId: 'campanha', estado: 'preparado', rodada: 0, participanteAtivoId: null, iniciadoEm: data, encerradoEm: null }]);
      expect(salvo.instancias.filter(i => i.fichaOriginalId === 'goblin')).toHaveLength(3);
      expect(salvo.instancias.find(i => i.id === 'aria-1')!.pv).toEqual({ atuais: 13, maximos: 24 });
      expect(salvo.instancias.filter(i => i.fichaOriginalId === 'goblin').map(i => i.pv.atuais)).toEqual([7, 2, 7]);
      const ordenados = [...salvo.participantes].sort((a, b) => a.ordem - b.ordem);
      expect(ordenados.map(p => p.iniciativa)).toEqual([12, 12, 0, -2]);
      expect(ordenados.map(p => p.instanciaId)).toEqual(['aria-1', 'goblin-3', 'goblin-2', 'goblin-1']);
      expect(salvo.anexos).toHaveLength(2);
      let n = 0;
      const copia = await restaurarBackup(await exportarBackup(salvo), reaberto, () => `restaurado-${++n}`);
      const recuperado = (await reaberto.obter(copia.campanha.id))!;
      expect(recuperado.combates[0]).toMatchObject({ estado: 'preparado', rodada: 0, participanteAtivoId: null });
      expect(recuperado.participantes).toHaveLength(4);
      expect(new Set(recuperado.participantes.map(p => p.instanciaId)).size).toBe(4);
      for (const participante of recuperado.participantes) {
        expect(participante.combateId).toBe(recuperado.combates[0].id);
        const instancia = recuperado.instancias.find(i => i.id === participante.instanciaId)!;
        expect(instancia).toBeDefined();
        expect(instancia.pv).toEqual(participante.pvInicio);
        expect(recuperado.fichas.some(f => f.id === instancia.fichaOriginalId)).toBe(true);
      }
      for (const anexo of salvo.anexos) {
        const restaurado = recuperado.anexos.find(a => a.nome === anexo.nome)!;
        expect(new Uint8Array(await restaurado.arquivo.arrayBuffer())).toEqual(new Uint8Array(await anexo.arquivo.arrayBuffer()));
      }
      expect(await reaberto.obter('campanha')).toEqual(salvo);
    } finally { reaberto.fechar(); }
  });

  test('cancelar seleções, novas instâncias e edição de PV do rascunho não grava nem altera registros', async () => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'preparacao-cancelada' });
    try {
      await repo.criar(await importarCampanha());
      const original = (await repo.obter('campanha'))!;
      const rascunho = preparar(original);
      rascunho.participantes[0].instancia.pv.atuais = 0;
      rascunho.participantes.splice(1, 1);
      expect(rascunho.participantes).toHaveLength(3);
      // Dismissing the modal drops the draft; it never invokes a repository write.
      expect(await repo.obter('campanha')).toEqual(original);
      expect((await repo.obter('campanha'))!.instancias).toHaveLength(2);
    } finally { repo.fechar(); }
  });

  test('falha após gravar parte dos participantes desfaz instâncias, PV e encontro; retry confirma integralmente', async () => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'preparacao-rollback' });
    try {
      await repo.criar(await importarCampanha());
      const original = (await repo.obter('campanha'))!;
      const rascunho = preparar(original);
      rascunho.participantes[0].instancia.pv.atuais = 3;
      const pronto = confirmarPreparacao(original, rascunho, 'encontro', data);
      const originalPut = IDBObjectStore.prototype.put;
      let participantes = 0;
      const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
        if (this.name === 'participantes' && ++participantes === 2) throw new DOMException('Cota simulada', 'QuotaExceededError');
        return originalPut.call(this, valor, chave);
      });
      try { await expect(repo.salvar(pronto)).rejects.toMatchObject({ codigo: 'cota-excedida' }); }
      finally { put.mockRestore(); }
      expect(participantes).toBe(2);
      expect(await repo.obter('campanha')).toEqual(original);
      await repo.salvar(pronto);
      const salvo = (await repo.obter('campanha'))!;
      expect(salvo.instancias).toHaveLength(4);
      expect(salvo.participantes).toHaveLength(4);
      expect(salvo.combates).toHaveLength(1);
      expect(salvo.instancias.find(i => i.id === 'aria-1')!.pv.atuais).toBe(3);
    } finally { repo.fechar(); }
  });

  test('revisão obsoleta não sobrescreve PV concorrentes nem deixa novos participantes ou instâncias', async () => {
    const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'preparacao-conflito' });
    try {
      await repo.criar(await importarCampanha());
      const original = (await repo.obter('campanha'))!;
      const pronto = confirmarPreparacao(original, preparar(original), 'encontro', data);
      const concorrente = (await repo.obter('campanha'))!;
      concorrente.instancias.find(i => i.id === 'aria-1')!.pv.atuais = 5;
      await repo.salvar(concorrente);
      await expect(repo.salvar(pronto)).rejects.toMatchObject({ codigo: 'conflito' });
      const salvo = (await repo.obter('campanha'))!;
      expect(salvo.instancias).toHaveLength(2);
      expect(salvo.instancias.find(i => i.id === 'aria-1')!.pv.atuais).toBe(5);
      expect(salvo.combates).toEqual([]);
      expect(salvo.participantes).toEqual([]);
      expect(salvo.anexos).toEqual(original.anexos);
    } finally { repo.fechar(); }
  });
});
