/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { webcrypto } from 'crypto';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { DadosCampanha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate } from './execucaoCombate';
import { alterarCondicao, DadosCondicao } from './condicoes';
import { encerrarCombate } from './encerramentoCombate';
import { RepositorioCampanhasIndexedDB } from './persistencia';
import { exportarBackup, restaurarBackup, lerBackup } from './backup';

const data = '2026-10-18T12:00:00.000Z';
function inicial(): DadosCampanha {
  const dados: DadosCampanha = {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Condições', roteiro: '', criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], combates: [], participantes: [],
    instancias: ['Guerreiro', 'Mago', 'Goblin 1', 'Goblin 2'].map((nome, i) => ({ id: `i${i}`, campanhaId: 'c', fichaOriginalId: null, nome, categoria: i < 2 ? 'jogador' : 'monstro', pv: { atuais: i === 2 ? 0 : 5, maximos: 10 } })),
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
  return executarAcaoCombate(confirmarPreparacao(dados, { participantes: dados.instancias.map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: 20 - i })) }, 'b', data), 'b', 'iniciar', data);
}
const efeito = (tipo: string, restantes: number | null): DadosCondicao => ({ tipo, duracao: restantes === null ? 'manual' : 'turnos', restantes, momento: 'final' });
const adicionar = (d: DadosCampanha, participante: string, id: string, tipo: string, restantes: number | null) => alterarCondicao(d, 'b', participante, { tipo: 'adicionar', id, dados: efeito(tipo, restantes) }, data);
const avancar = (d: DadosCampanha) => executarAcaoCombate(d, 'b', 'avancar', data);
const restantes = (d: DadosCampanha, id: string) => d.combates[0].condicoes?.find(c => c.id === id)?.restantes;
beforeAll(() => Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto }));

test('quatro participantes: duração própria, zero PV, reload, edição, expiração e backup com remapeamento', async () => {
  const fabrica = new IDBFactory();
  let repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'condicoes-integral' });
  try {
    let dados = adicionar(adicionar(adicionar(inicial(), 'p2', 'fogo', 'queimando', 2), 'p0', 'veneno', 'envenenado', 3), 'p3', 'paralisia', 'paralisado', null);
    const pv = dados.instancias.map(i => i.pv);
    await repo.criar(dados);
    dados = (await repo.obter('c'))!;
    async function passo() { await repo.salvar(avancar(dados)); dados = (await repo.obter('c'))!; }
    await passo(); // Guerreiro recebeu veneno durante o turno parcial: não conta.
    expect(restantes(dados, 'veneno')).toBe(3);
    await passo(); // Mago termina: Goblin 1 começa.
    expect(restantes(dados, 'fogo')).toBe(2);
    await passo(); // Goblin 1 completa o primeiro turno, mesmo com 0 PV.
    expect(restantes(dados, 'fogo')).toBe(1);
    expect(restantes(dados, 'veneno')).toBe(3);
    await passo(); // Goblin 2: indefinida permanece.
    expect(restantes(dados, 'paralisia')).toBeNull();
    repo.fechar();
    repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'condicoes-integral' });
    expect(await repo.obter('c')).toEqual(dados);
    await passo(); // Guerreiro: primeiro turno completo.
    expect(restantes(dados, 'veneno')).toBe(2);
    await passo(); await passo();
    expect(restantes(dados, 'fogo')).toBeUndefined();
    await passo(); // Goblin 2 conclui turno com duração ainda indefinida.
    const rodada = dados.combates[0].rodada;
    await repo.salvar(alterarCondicao(dados, 'b', 'p3', { tipo: 'editar', id: 'paralisia', dados: efeito('paralisado', 1) }, data));
    dados = (await repo.obter('c'))!;
    expect(dados.combates[0].rodada).toBe(rodada);
    expect(restantes(dados, 'paralisia')).toBe(1);
    let n = 0;
    const copia = await restaurarBackup(await exportarBackup(dados), repo, () => `copia-${++n}`);
    let restaurado = (await repo.obter(copia.campanha.id))!;
    const copiaPersistida = restaurado;
    const original = dados.combates[0];
    const novo = restaurado.combates[0];
    expect(novo.execucao?.ocorrenciaTurno).toBe(original.execucao?.ocorrenciaTurno);
    expect(novo.condicoes!.map(c => [c.tipo, c.restantes, c.momento])).toEqual(original.condicoes!.map(c => [c.tipo, c.restantes, c.momento]));
    for (const c of novo.condicoes!) {
      expect(original.condicoes!.some(v => v.id === c.id)).toBe(false);
      expect(c.campanhaId).toBe(restaurado.campanha.id);
      expect(c.combateId).toBe(novo.id);
      expect(restaurado.participantes.some(p => p.id === c.participanteId && p.combateId === novo.id)).toBe(true);
    }
    // Counts resume at the same turn occurrence on both aggregates.
    for (let i = 0; i < 8; i++) {
      await passo();
      restaurado = executarAcaoCombate(restaurado, novo.id, 'avancar', data);
    }
    expect(dados.combates[0].condicoes).toEqual([]);
    expect(restaurado.combates[0].condicoes).toEqual([]);
    expect(dados.instancias.map(i => i.pv)).toEqual(pv);
    expect(await repo.obter(copia.campanha.id)).toEqual(copiaPersistida);
  } finally { repo.fechar(); }
});

test('turno e decremento/expiração são revertidos juntos; revisão de outra aba impede escrita atrasada', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'condicoes-rollback' });
  try {
    let dados = adicionar(inicial(), 'p2', 'fogo', 'queimando', 1);
    dados = avancar(avancar(dados));
    await repo.criar(dados); dados = (await repo.obter('c'))!;
    const proximo = avancar(dados);
    expect(restantes(proximo, 'fogo')).toBeUndefined();
    const original = IDBObjectStore.prototype.put;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
      if (this.name === 'combates') throw new DOMException('Cota simulada', 'QuotaExceededError');
      return original.call(this, valor, chave);
    });
    try { await expect(repo.salvar(proximo)).rejects.toMatchObject({ codigo: 'cota-excedida' }); }
    finally { put.mockRestore(); }
    expect(await repo.obter('c')).toEqual(dados);
    await repo.salvar(alterarCondicao(dados, 'b', 'p2', { tipo: 'editar', id: 'fogo', dados: efeito('queimando', 4) }, data));
    await expect(repo.salvar(proximo)).rejects.toMatchObject({ codigo: 'conflito' });
    const atual = (await repo.obter('c'))!;
    expect(restantes(atual, 'fogo')).toBe(4);
    expect(atual.combates[0].participanteAtivoId).toBe('p2');
    expect(atual.combates[0].execucao?.ocorrenciaTurno).toBe(dados.combates[0].execucao?.ocorrenciaTurno);
  } finally { repo.fechar(); }
});

test('encerramento mantém snapshot das condições, sem transferir para outro encontro, inclusive após backup', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'condicoes-historico' });
  try {
    const ativo = adicionar(inicial(), 'p2', 'fogo', 'queimando', 2);
    await repo.criar(encerrarCombate(ativo, 'b', 'restaurar', data));
    const encerrado = (await repo.obter('c'))!;
    expect(encerrado.combates[0].historico?.condicoes).toEqual(ativo.combates[0].condicoes);
    expect(() => avancar(encerrado)).toThrow();
    expect(() => adicionar(encerrado, 'p2', 'novo', 'paralisado', null)).toThrow();
    const futuro = confirmarPreparacao(encerrado, { participantes: encerrado.instancias.slice(0, 2).map((instancia, i) => ({ id: `f${i}`, instancia, iniciativa: i })) }, 'futuro', data);
    expect(futuro.combates[1].condicoes ?? []).toEqual([]);
    expect(futuro.combates[0].historico).toEqual(encerrado.combates[0].historico);
    let n = 0;
    const copia = await restaurarBackup(await exportarBackup(encerrado), repo, () => `hist-${++n}`);
    const historico = copia.combates[0].historico!.condicoes!;
    expect(historico).toHaveLength(1);
    expect(historico[0]).toMatchObject({ tipo: 'queimando', restantes: 2, campanhaId: copia.campanha.id, combateId: copia.combates[0].id });
    expect(historico[0].id).not.toBe('fogo');
    expect(copia.participantes.some(p => p.id === historico[0].participanteId)).toBe(true);
  } finally { repo.fechar(); }
});

test.each([1, 2, 3, 4])('backup antigo v%i sem condições retoma combate sem efeitos inventados', async versao => {
  const antigo = inicial();
  delete antigo.combates[0].condicoes;
  delete antigo.combates[0].execucao!.ocorrenciaTurno;
  const zip = unzipSync(new Uint8Array(await (await exportarBackup(antigo)).arrayBuffer()));
  const manifesto = JSON.parse(strFromU8(zip['manifesto.json']));
  manifesto.versao = versao;
  zip['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  const restaurado = await lerBackup(new Blob([zipSync(zip, { level: 0 })]));
  expect(restaurado.combates[0].condicoes ?? []).toEqual([]);
  const proximo = avancar(restaurado);
  expect(proximo.combates[0].participanteAtivoId).toBe('p1');
  expect(proximo.combates[0].condicoes ?? []).toEqual([]);
});
