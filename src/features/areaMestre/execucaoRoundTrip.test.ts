/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { webcrypto } from 'crypto';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { exportFicha } from '../../api/fichaPersonagem/fichaStorage';
import { exportarBackup, lerBackup, restaurarBackup } from './backup';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { criarInstancia } from './dominio';
import { prepararImportacao } from './importacao';
import { DadosCampanha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate } from './execucaoCombate';
import { MIGRACOES_MESTRE, RepositorioCampanhasIndexedDB } from './persistencia';

const data = '2026-10-18T12:00:00.000Z';
const ativacao = '2026-10-18T13:00:00.000Z';
const arquivo = (conteudo: string, nome: string, mime: string): File => Object.assign(new Blob([conteudo], { type: mime }), { name: nome, lastModified: 0 }) as File;

async function preparado(): Promise<DadosCampanha> {
  const contexto = { campanhaId: 'campanha', importadoEm: data };
  const jogador = await prepararImportacao(arquivo(exportFicha(new Ficha({ id: 'aria-original', nomePersonagem: 'Ária', versaoRegras: 'DND_2024', vidaTotal: 24, vidaAtual: 13 })), 'Aria.json', 'application/json'), { ...contexto, fichaId: 'aria', anexoId: 'json', categoria: 'jogador' });
  const monstro = await prepararImportacao(arquivo('%PDF-1.7\nGoblin original\n', 'Goblin.pdf', 'application/pdf'), { ...contexto, fichaId: 'goblin', anexoId: 'pdf', categoria: 'monstro' });
  monstro.ficha.pvIniciais = { atuais: 7, maximos: 7 };
  const dados: DadosCampanha = {
    campanha: { id: 'campanha', schemaVersion: 1, nome: 'Execução', roteiro: '', criadoEm: data, atualizadoEm: data },
    anexos: [jogador.anexo, monstro.anexo], fichas: [jogador.ficha, monstro.ficha],
    instancias: [criarInstancia(jogador.ficha, 'aria-1'), ...[1, 2, 3].map(n => criarInstancia(monstro.ficha, `goblin-${n}`, `Goblin ${n}`))],
    combates: [], participantes: [], layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
  return confirmarPreparacao(dados, { participantes: dados.instancias.map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: [12, -2, 0, 12][i] })) }, 'encontro', data);
}

beforeAll(() => Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto }));

async function legado(): Promise<DadosCampanha> {
  const dados = await preparado();
  dados.combates[0] = { ...dados.combates[0], estado: 'ativo', rodada: 3, participanteAtivoId: 'p3' };
  dados.instancias.find(i => i.id === 'goblin-3')!.pv.atuais = 1;
  return dados;
}

test('migração do banco 2 recupera progresso legado sem usar PV atuais como snapshot', async () => {
  const fabrica = new IDBFactory();
  const antiga = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-legada', versao: 2 });
  await antiga.criar(await legado());
  const original = (await antiga.obter('campanha'))!;
  antiga.fechar();
  const nova = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-legada' });
  try {
    const migrado = (await nova.obter('campanha'))!;
    expect(migrado.campanha).toEqual(original.campanha);
    expect(migrado.anexos).toEqual(original.anexos);
    expect(migrado.combates[0]).toMatchObject({ rodada: 3, participanteAtivoId: 'p3', execucao: { versao: 1, visitados: ['p0', 'p3'] } });
    expect(migrado.combates[0].execucao!.pvAtivacao.find(p => p.instanciaId === 'goblin-3')!.pv.atuais).toBe(7);
    expect(migrado.instancias.find(i => i.id === 'goblin-3')!.pv.atuais).toBe(1);
    expect(executarAcaoCombate(migrado, 'encontro', 'avancar', ativacao).combates[0]).toMatchObject({ rodada: 3, participanteAtivoId: 'p2' });
  } finally { nova.fechar(); }
});

test('migração 2 para 3 abortada conserva versão, documentos e execução legada', async () => {
  const fabrica = new IDBFactory();
  const antiga = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-migracao-falha', versao: 2 });
  await antiga.criar(await legado());
  const original = (await antiga.obter('campanha'))!;
  antiga.fechar();
  const falha = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-migracao-falha', migracoes: { ...MIGRACOES_MESTRE, 3: (banco, tx) => { MIGRACOES_MESTRE[3](banco, tx); throw new Error('Falha simulada'); } } });
  try { await expect(falha.listar()).rejects.toMatchObject({ codigo: 'migracao-falhou' }); }
  finally { falha.fechar(); }
  const recuperada = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-migracao-falha', versao: 2 });
  try { expect(await recuperada.obter('campanha')).toEqual(original); }
  finally { recuperada.fechar(); }
});

test.each([1, 2])('backup versão %i migra execução legada e mantém PV atuais distintos do snapshot', async versao => {
  const zip = unzipSync(new Uint8Array(await (await exportarBackup(await legado())).arrayBuffer()));
  const manifesto = JSON.parse(strFromU8(zip['manifesto.json']));
  manifesto.versao = versao;
  zip['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  const dados = await lerBackup(new Blob([zipSync(zip, { level: 0 })], { type: 'application/zip' }));
  expect(dados.combates[0]).toMatchObject({ rodada: 3, participanteAtivoId: 'p3', execucao: { visitados: ['p0', 'p3'] } });
  expect(dados.combates[0].execucao!.pvAtivacao.find(p => p.instanciaId === 'goblin-3')!.pv.atuais).toBe(7);
  expect(dados.instancias.find(i => i.id === 'goblin-3')!.pv.atuais).toBe(1);
});

test('importação, quatro combatentes, turnos, dano, reordenação, reload e backup mantêm ciclo e snapshot da ativação', async () => {
  const fabrica = new IDBFactory();
  let repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-round-trip' });
  try {
    await repo.criar(await preparado());
    const antes = (await repo.obter('campanha'))!;
    antes.instancias.find(i => i.id === 'goblin-1')!.pv.atuais = 5;
    await repo.salvar(antes);
    await repo.salvar(executarAcaoCombate((await repo.obter('campanha'))!, 'encontro', 'iniciar', ativacao));
    for (let n = 0; n < 2; n++) await repo.salvar(executarAcaoCombate((await repo.obter('campanha'))!, 'encontro', 'avancar', ativacao));
    const ferido = (await repo.obter('campanha'))!;
    expect(ferido.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'p2' });
    ferido.instancias.find(i => i.id === 'goblin-1')!.pv.atuais = 0;
    await repo.salvar(ferido);
    const ordem = ['p1', 'p2', 'p0', 'p3'];
    await repo.salvar(executarAcaoCombate((await repo.obter('campanha'))!, 'encontro', { ordem }, ativacao));
    const reordenado = (await repo.obter('campanha'))!;
    expect(reordenado.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'p2', execucao: { visitados: ['p0', 'p3', 'p2'] } });
    await repo.salvar(executarAcaoCombate(reordenado, 'encontro', 'avancar', ativacao));
    expect((await repo.obter('campanha'))!.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'p1' });
    await repo.salvar(executarAcaoCombate((await repo.obter('campanha'))!, 'encontro', 'avancar', ativacao));
    repo.fechar();
    repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'execucao-round-trip' });
    const salvo = (await repo.obter('campanha'))!;
    expect(salvo.combates[0]).toMatchObject({ estado: 'ativo', rodada: 2, participanteAtivoId: 'p1', execucao: { ativadoEm: ativacao, visitados: ['p1'] } });
    expect([...salvo.participantes].sort((a, b) => a.ordem - b.ordem).map(p => p.id)).toEqual(ordem);
    expect(salvo.combates[0].execucao!.pvAtivacao.find(p => p.instanciaId === 'goblin-1')!.pv.atuais).toBe(5);
    expect(salvo.participantes.find(p => p.id === 'p1')!.pvInicio.atuais).toBe(7);
    expect(salvo.instancias.find(i => i.id === 'goblin-1')!.pv.atuais).toBe(0);
    expect(salvo.instancias.find(i => i.id === 'goblin-2')!.pv.atuais).toBe(7);
    let n = 0;
    const copia = await restaurarBackup(await exportarBackup(salvo), repo, () => `restaurado-${++n}`);
    const recuperado = (await repo.obter(copia.campanha.id))!;
    const combate = recuperado.combates[0];
    const participantes = [...recuperado.participantes].sort((a, b) => a.ordem - b.ordem);
    expect(combate).toMatchObject({ estado: 'ativo', rodada: 2, participanteAtivoId: participantes[0].id, execucao: { visitados: [participantes[0].id] } });
    expect(participantes.map(p => recuperado.instancias.find(i => i.id === p.instanciaId)!.nome)).toEqual(['Goblin 1', 'Goblin 2', 'Ária', 'Goblin 3']);
    for (const snapshot of combate.execucao!.pvAtivacao) {
      expect(recuperado.participantes.find(p => p.id === snapshot.participanteId)!.instanciaId).toBe(snapshot.instanciaId);
      expect(salvo.instancias.some(i => i.id === snapshot.instanciaId)).toBe(false);
    }
    expect(combate.execucao!.pvAtivacao.find(p => p.participanteId === participantes[0].id)!.pv.atuais).toBe(5);
    const proximo = executarAcaoCombate(recuperado, combate.id, 'avancar', ativacao);
    expect(proximo.combates[0]).toMatchObject({ rodada: 2, participanteAtivoId: participantes[1].id });
    for (const anexo of salvo.anexos) expect(await recuperado.anexos.find(a => a.nome === anexo.nome)!.arquivo.text()).toBe(await anexo.arquivo.text());
    expect(await repo.obter('campanha')).toEqual(salvo);
  } finally { repo.fechar(); }
});

test('falha transacional parcial desfaz ativação e snapshot; retry persiste uma única ativação', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'execucao-rollback' });
  try {
    await repo.criar(await preparado());
    const original = (await repo.obter('campanha'))!;
    const ativo = executarAcaoCombate(original, 'encontro', 'iniciar', ativacao);
    const originalPut = IDBObjectStore.prototype.put;
    let participantes = 0;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
      if (this.name === 'participantes' && ++participantes === 2) throw new DOMException('Cota simulada', 'QuotaExceededError');
      return originalPut.call(this, valor, chave);
    });
    try { await expect(repo.salvar(ativo)).rejects.toMatchObject({ codigo: 'cota-excedida' }); }
    finally { put.mockRestore(); }
    expect(await repo.obter('campanha')).toEqual(original);
    await repo.salvar(ativo);
    const salvo = (await repo.obter('campanha'))!;
    expect(salvo.combates[0].execucao!.pvAtivacao).toHaveLength(4);
    expect(() => executarAcaoCombate(salvo, 'encontro', 'iniciar', ativacao)).toThrow();
  } finally { repo.fechar(); }
});

test('duas abas não sobrescrevem turno ou ordem com revisão antiga', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'execucao-conflito' });
  try {
    await repo.criar(await preparado());
    await repo.salvar(executarAcaoCombate((await repo.obter('campanha'))!, 'encontro', 'iniciar', ativacao));
    const antiga = (await repo.obter('campanha'))!;
    await repo.salvar(executarAcaoCombate(antiga, 'encontro', 'avancar', ativacao));
    const salvo = (await repo.obter('campanha'))!;
    await expect(repo.salvar(executarAcaoCombate(antiga, 'encontro', { ordem: ['p1', 'p2', 'p3', 'p0'] }, ativacao))).rejects.toMatchObject({ codigo: 'conflito' });
    expect(await repo.obter('campanha')).toEqual(salvo);
    expect(salvo.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'p3' });
  } finally { repo.fechar(); }
});
