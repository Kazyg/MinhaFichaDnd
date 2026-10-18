/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { webcrypto } from 'crypto';
import { IDBFactory } from 'fake-indexeddb';
import { prepararImportacao } from './importacao';
import { confirmarMetadados, prepararRetrato } from './importacaoVisual';
import { incorporarImportacao } from './fichasCampanha';
import { aplicarDano, criarInstanciaAdicional, duplicarInstancia } from './instancias';
import { exportarBackup, restaurarBackup } from './backup';
import { DadosCampanha } from './modelos';
import { RepositorioCampanhasIndexedDB } from './persistencia';

class ArquivoTeste extends Blob implements File {
  readonly lastModified = 0;
  readonly webkitRelativePath = '';
  constructor(conteudo: BlobPart[], readonly name: string, opcoes: BlobPropertyBag) { super(conteudo, opcoes); }
}

test('campanha vazia → importação real PDF/retrato → três instâncias → dano isolado → backup/restauração preserva bytes e estado', async () => {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
  const fabrica = new IDBFactory();
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'fase4-importacao-roundtrip' });
  const data = '2026-10-17T12:00:00.000Z';
  const inicial: DadosCampanha = {
    campanha: { id: 'campanha', schemaVersion: 1, nome: 'Caverna', roteiro: '', roteiros: [{ id: 'roteiro', titulo: 'Entrada', conteudo: 'Investigar altar\nSegredo do mestre', criadoEm: data, atualizadoEm: data }], criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], instancias: [], combates: [], participantes: [],
    layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: false, larguraSidebar: 270, larguraPV: 350, paineis: [{ id: 'painel-monstros', tipo: 'monstros', x: 0, y: 0, largura: 6, altura: 4, recolhido: false, fechado: false }] },
  };
  try {
    await repo.criar(inicial);
    expect((await repo.obter('campanha'))!.fichas).toEqual([]);
    const bytesPdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55, 0, 255, 128]);
    const bytesImagem = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 255, 0, 128]);
    const pdf = new ArquivoTeste([bytesPdf], 'goblin.pdf', { type: 'application/pdf' });
    const retratoArquivo = new ArquivoTeste([bytesImagem], 'goblin.png', { type: 'image/png' });
    const preparado = await prepararImportacao(pdf, { campanhaId: 'campanha', fichaId: 'goblin', anexoId: 'pdf-goblin', categoria: 'monstro', importadoEm: data });
    const retrato = await prepararRetrato(retratoArquivo, 'campanha');
    const revisado = confirmarMetadados({ ficha: preparado.ficha, anexos: [preparado.anexo, retrato] }, 'Goblin', '12', '12');
    revisado.ficha = { ...revisado.ficha, imagemAnexoId: retrato.id };
    // Toda preparação é pura: nenhum registro parcial aparece antes de confirmar.
    expect((await repo.obter('campanha'))!.anexos).toHaveLength(0);
    let dados = incorporarImportacao((await repo.obter('campanha'))!, revisado);
    dados = criarInstanciaAdicional(dados, 'goblin', 'goblin-2');
    dados = duplicarInstancia(dados, 'goblin-2', 'goblin-3');
    dados = aplicarDano(dados, 'goblin-2', 5);
    expect(dados.instancias.map(i => i.pv.atuais)).toEqual([12, 7, 12]);
    expect(dados.fichas[0].pvIniciais.atuais).toBe(12);
    await repo.salvar(dados);
    repo.fechar();
    const reaberto = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'fase4-importacao-roundtrip' });
    try {
      const persistido = (await reaberto.obter('campanha'))!;
      const backup = await exportarBackup(persistido);
      let id = 0;
      const restaurado = await restaurarBackup(backup, reaberto, () => `restaurado-${++id}`);
      const recuperado = (await reaberto.obter(restaurado.campanha.id))!;
      expect(await reaberto.listar()).toHaveLength(2);
      expect(recuperado.fichas).toHaveLength(1);
      expect(recuperado.anexos).toHaveLength(2);
      expect(recuperado.instancias).toHaveLength(3);
      expect(recuperado.instancias.map(i => i.pv.atuais).sort((a, b) => a - b)).toEqual([7, 12, 12]);
      expect(recuperado.instancias.every(i => i.pv.maximos === 12 && i.fichaOriginalId === recuperado.fichas[0].id)).toBe(true);
      expect(recuperado.fichas[0].pvIniciais).toEqual({ atuais: 12, maximos: 12 });
      const original = recuperado.anexos.find(a => a.id === recuperado.fichas[0].anexoId)!;
      const imagem = recuperado.anexos.find(a => a.id === recuperado.fichas[0].imagemAnexoId)!;
      expect(new Uint8Array(await original.arquivo.arrayBuffer())).toEqual(bytesPdf);
      expect(new Uint8Array(await imagem.arquivo.arrayBuffer())).toEqual(bytesImagem);
      expect(original.arquivo.type).toBe('application/pdf');
      expect(imagem.arquivo.type).toBe('image/png');
      expect(recuperado.campanha.roteiros?.map(r => [r.titulo, r.conteudo])).toEqual(inicial.campanha.roteiros!.map(r => [r.titulo, r.conteudo]));
      expect({ ...recuperado.layout, campanhaId: 'campanha', paineis: recuperado.layout.paineis.map(p => ({ ...p, id: 'painel-monstros' })) }).toEqual(inicial.layout);
      expect((await reaberto.obter('campanha'))!.instancias).toEqual(persistido.instancias);
    } finally { reaberto.fechar(); }
  } finally { repo.fechar(); if (anterior) Object.defineProperty(globalThis, 'crypto', anterior); }
});
