/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { IDBFactory } from 'fake-indexeddb';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { DadosCampanha } from './modelos';
import { MIGRACOES_MESTRE, RepositorioCampanhasIndexedDB } from './persistencia';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate } from './execucaoCombate';
import { podeRestaurarPV, encerrarCombate } from './encerramentoCombate';
import { exportarBackup, lerBackup } from './backup';

const inicio = '2026-10-18T12:00:00Z';
const ativacao = '2026-10-18T13:00:00Z';
function legado(ambiguo = false) {
  const dados: DadosCampanha = { campanha: { id: 'c', schemaVersion: 1, nome: 'Legada', roteiro: '', criadoEm: inicio, atualizadoEm: inicio }, anexos: [], fichas: [], instancias: [0, 1].map(i => ({ id: `i${i}`, campanhaId: 'c', categoria: 'monstro', fichaOriginalId: null, nome: `Vigia ${i}`, pv: { atuais: 3, maximos: 8 } })), combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] } };
  const pronto = confirmarPreparacao(dados, { participantes: dados.instancias.map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: i })) }, 'b', inicio);
  const ativo = executarAcaoCombate(pronto, 'b', 'iniciar', ambiguo ? inicio : ativacao);
  delete ativo.combates[0].execucao!.origemSnapshot;
  ativo.instancias[0].pv = { atuais: 0, maximos: 10 };
  return ativo;
}

test.each([false, true])('banco 3 para 4 preserva dados e identifica origem do snapshot, ambíguo=%s', async ambiguo => {
  const fabrica = new IDBFactory();
  const antiga = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, versao: 3 });
  await antiga.criar(legado(ambiguo));
  const antes = (await antiga.obter('c'))!; antiga.fechar();
  const atual = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica });
  try {
    const migrado = (await atual.obter('c'))!;
    expect(migrado.instancias).toEqual(antes.instancias);
    expect(migrado.participantes).toEqual(antes.participantes);
    expect(migrado.campanha).toEqual(antes.campanha);
    expect(podeRestaurarPV(migrado.combates[0])).toBe(!ambiguo);
    const manter = encerrarCombate(migrado, 'b', 'manter', ativacao);
    expect(manter.instancias[0].pv).toEqual({ atuais: 0, maximos: 10 });
  } finally { atual.fechar(); }
});

test('falha na migração 4 mantém banco 3 e snapshot sem marcador intactos', async () => {
  const fabrica = new IDBFactory();
  const antiga = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, versao: 3 });
  await antiga.criar(legado()); const antes = await antiga.obter('c'); antiga.fechar();
  const falha = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, migracoes: { ...MIGRACOES_MESTRE, 4: (b, tx) => { MIGRACOES_MESTRE[4](b, tx); throw new Error('Interrupção'); } } });
  await expect(falha.listar()).rejects.toMatchObject({ codigo: 'migracao-falhou' }); falha.fechar();
  const reaberto = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, versao: 3 });
  try { expect(await reaberto.obter('c')).toEqual(antes); } finally { reaberto.fechar(); }
});

test.each([1, 2, 3])('backup versão %i migra snapshot antigo real sem preencher PV máximos', async versao => {
  const zip = unzipSync(new Uint8Array(await (await exportarBackup(legado())).arrayBuffer()));
  const manifesto = JSON.parse(strFromU8(zip['manifesto.json'])); manifesto.versao = versao;
  zip['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  const dados = await lerBackup(new Blob([zipSync(zip, { level: 0 })]));
  expect(podeRestaurarPV(dados.combates[0])).toBe(true);
  const resultado = encerrarCombate(dados, 'b', 'restaurar', ativacao);
  expect(resultado.instancias[0].pv).toEqual({ atuais: 3, maximos: 8 });
  expect(resultado.combates[0].historico!.participantes.find(p => p.instanciaId === 'i0')!.pvFinal).toEqual({ atuais: 0, maximos: 10 });
});
