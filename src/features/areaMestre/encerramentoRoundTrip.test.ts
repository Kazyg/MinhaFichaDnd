/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import { webcrypto } from 'crypto';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { exportFicha } from '../../api/fichaPersonagem/fichaStorage';
import { prepararImportacao } from './importacao';
import { criarInstancia } from './dominio';
import { DadosCampanha, InstanciaFicha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate } from './execucaoCombate';
import { encerrarCombate } from './encerramentoCombate';
import { RepositorioCampanhasIndexedDB } from './persistencia';
import { exportarBackup, restaurarBackup } from './backup';

const data = '2026-10-18T12:00:00.000Z';
const ativacao = '2026-10-18T12:05:00.000Z';
const fim = '2026-10-18T13:00:00.000Z';
const arquivo = (conteudo: string, nome: string, mime: string): File => Object.assign(new Blob([conteudo], { type: mime }), { name: nome, lastModified: 0 }) as File;
async function campanha(): Promise<DadosCampanha> {
  const contexto = { campanhaId: 'c', importadoEm: data };
  const jogador = await prepararImportacao(arquivo(exportFicha(new Ficha({ id: 'aria-original', nomePersonagem: 'Ária', versaoRegras: 'DND_2024', vidaTotal: 24, vidaAtual: 13 })), 'Aria.json', 'application/json'), { ...contexto, fichaId: 'aria', anexoId: 'json', categoria: 'jogador' });
  const monstro = await prepararImportacao(arquivo('%PDF-1.7\nGoblin original\n', 'Goblin.pdf', 'application/pdf'), { ...contexto, fichaId: 'goblin', anexoId: 'pdf', categoria: 'monstro' });
  monstro.ficha.pvIniciais = { atuais: 7, maximos: 7 };
  return {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Múltiplos encontros', roteiro: 'Não perder roteiro', criadoEm: data, atualizadoEm: data },
    fichas: [jogador.ficha, monstro.ficha], anexos: [jogador.anexo, monstro.anexo],
    instancias: [criarInstancia(jogador.ficha, 'aria-1'), criarInstancia(monstro.ficha, 'g1', 'Goblin 1'), criarInstancia(monstro.ficha, 'g2', 'Goblin 2'), criarInstancia(monstro.ficha, 'g3', 'Goblin 3')],
    combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, larguraSidebar: 240, paineis: [] },
  };
}
function preparar(dados: DadosCampanha, id: string, instancias: InstanciaFicha[]): DadosCampanha {
  return confirmarPreparacao(dados, { participantes: instancias.map((instancia, i) => ({ id: `${id}-p${i}`, iniciativa: 10 - i, instancia: { ...instancia, pv: { ...instancia.pv } } })) }, id, data);
}
function dano(dados: DadosCampanha, ids: string[], atuais = 0): DadosCampanha {
  return { ...dados, instancias: dados.instancias.map(i => ids.includes(i.id) ? { ...i, pv: { atuais, maximos: i.pv.maximos + 3 } } : i) };
}
async function ativo(repo: RepositorioCampanhasIndexedDB) {
  await repo.criar(await campanha());
  const inicial = (await repo.obter('c'))!;
  await repo.salvar(executarAcaoCombate(preparar(inicial, 'A', inicial.instancias.slice(0, 2)), 'A', 'iniciar', ativacao));
  return (await repo.obter('c'))!;
}
beforeAll(() => Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto }));

test('importação, dois ativos independentes, restauração ferida, histórico imutável, reload e backup completo', async () => {
  const fabrica = new IDBFactory();
  let repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'encerramento-integral' });
  try {
    let dados = await ativo(repo);
    // A prepared encounter may share instances, but activation must revalidate occupation.
    const compartilhado = preparar(await campanha(), 'compartilhado', dados.instancias.slice(0, 2));
    const conflitante = { ...dados, combates: [...dados.combates, ...compartilhado.combates], participantes: [...dados.participantes, ...compartilhado.participantes] };
    expect(() => executarAcaoCombate(conflitante, 'compartilhado', 'iniciar', ativacao)).toThrow(/outro combate ativo/);
    expect(() => preparar(dados, 'ocupado', dados.instancias.slice(0, 2))).toThrow();
    dados = executarAcaoCombate(dados, 'A', { ordem: ['A-p1', 'A-p0'] }, ativacao);
    dados = executarAcaoCombate(dados, 'A', 'avancar', ativacao);
    dados = executarAcaoCombate(dados, 'A', 'avancar', ativacao);
    dados = dano(dados, ['aria-1', 'g1']);
    dados = preparar(dados, 'B', dados.instancias.slice(2));
    dados = executarAcaoCombate(dados, 'B', 'iniciar', ativacao);
    dados = executarAcaoCombate(dados, 'B', 'avancar', ativacao);
    dados = dano(dados, ['g2'], 2);
    await repo.salvar(dados);
    dados = (await repo.obter('c'))!;
    const b = dados.combates.find(c => c.id === 'B')!;
    const instanciaB = dados.instancias.filter(i => ['g2', 'g3'].includes(i.id));
    await repo.salvar(encerrarCombate(dados, 'A', 'restaurar', fim));
    dados = (await repo.obter('c'))!;
    expect(dados.combates.find(c => c.id === 'B')).toEqual(b);
    expect(dados.instancias.filter(i => ['g2', 'g3'].includes(i.id))).toEqual(instanciaB);
    expect(dados.instancias.find(i => i.id === 'aria-1')!.pv).toEqual({ atuais: 13, maximos: 24 });
    expect(dados.instancias.find(i => i.id === 'g1')!.pv).toEqual({ atuais: 7, maximos: 7 });
    const a = dados.combates.find(c => c.id === 'A')!;
    expect(a).toMatchObject({ estado: 'encerrado', rodada: 2, encerradoEm: fim, historico: { decisaoPV: 'restaurar' } });
    expect(a.historico!.participantes.map(p => p.instanciaId)).toEqual(['g1', 'aria-1']);
    expect(a.historico!.participantes.find(p => p.instanciaId === 'aria-1')).toMatchObject({ nome: 'Ária', pvInicial: { atuais: 13, maximos: 24 }, pvFinal: { atuais: 0, maximos: 27 } });
    // Released IDs are eligible for future encounters; preparing does not mutate A's history.
    expect(() => preparar(dados, 'futuro', dados.instancias.slice(0, 2))).not.toThrow();
    await repo.salvar(encerrarCombate(dados, 'B', 'manter', '2026-10-18T14:00:00.000Z'));
    dados = (await repo.obter('c'))!;
    expect(dados.instancias.filter(i => ['g2', 'g3'].includes(i.id))).toEqual(instanciaB);
    const historicos = dados.combates.map(c => c.historico);
    await repo.salvar({ ...dados, instancias: dados.instancias.map(i => ({ ...i, nome: 'Nome alterado', pv: { atuais: 1, maximos: 1 } })) });
    repo.fechar();
    repo = new RepositorioCampanhasIndexedDB({ indexedDB: fabrica, nomeBanco: 'encerramento-integral' });
    dados = (await repo.obter('c'))!;
    expect(dados.combates.map(c => c.historico)).toEqual(historicos);
    let n = 0;
    const copia = await restaurarBackup(await exportarBackup(dados), repo, () => `copia-${++n}`);
    const restaurado = (await repo.obter(copia.campanha.id))!;
    expect(restaurado.campanha.roteiros?.map(r => r.conteudo)).toContain(dados.campanha.roteiro);
    expect(restaurado.layout.larguraSidebar).toBe(240);
    expect(restaurado.combates.map(c => c.estado)).toEqual(['encerrado', 'encerrado']);
    for (const combate of restaurado.combates) {
      const original = dados.combates.find(c => c.encerradoEm === combate.encerradoEm)!;
      expect(combate.historico!.decisaoPV).toBe(original.historico!.decisaoPV);
      expect(combate.historico!.participantes.map(p => [p.nome, p.iniciativa, p.ordem, p.pvInicial, p.pvFinal])).toEqual(original.historico!.participantes.map(p => [p.nome, p.iniciativa, p.ordem, p.pvInicial, p.pvFinal]));
      for (const p of combate.historico!.participantes) {
        expect(restaurado.participantes.some(v => v.id === p.participanteId && v.combateId === combate.id && v.instanciaId === p.instanciaId)).toBe(true);
        expect(restaurado.instancias.some(i => i.id === p.instanciaId && i.fichaOriginalId === p.fichaOriginalId)).toBe(true);
      }
    }
    for (const anexo of dados.anexos) {
      expect(new Uint8Array(await restaurado.anexos.find(a => a.nome === anexo.nome)!.arquivo.arrayBuffer())).toEqual(new Uint8Array(await anexo.arquivo.arrayBuffer()));
    }
    expect(await repo.obter('c')).toEqual(dados);
  } finally { repo.fechar(); }
});

test('falha no meio da gravação do encerramento desfaz restauração e histórico; revisão obsoleta também não grava', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'encerramento-rollback' });
  try {
    let dados = await ativo(repo);
    await repo.salvar(dano(dados, ['aria-1', 'g1']));
    dados = (await repo.obter('c'))!;
    const pronto = encerrarCombate(dados, 'A', 'restaurar', fim);
    const original = IDBObjectStore.prototype.put;
    const put = jest.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, valor, chave) {
      if (this.name === 'combates') throw new DOMException('Cota simulada', 'QuotaExceededError');
      return original.call(this, valor, chave);
    });
    try { await expect(repo.salvar(pronto)).rejects.toMatchObject({ codigo: 'cota-excedida' }); }
    finally { put.mockRestore(); }
    expect(await repo.obter('c')).toEqual(dados);
    await repo.salvar({ ...dados, campanha: { ...dados.campanha, nome: 'Outra aba' } });
    await expect(repo.salvar(pronto)).rejects.toMatchObject({ codigo: 'conflito' });
    const atual = (await repo.obter('c'))!;
    expect(atual.combates[0].estado).toBe('ativo');
    expect(atual.instancias.find(i => i.id === 'aria-1')!.pv.atuais).toBe(0);
    await repo.salvar(encerrarCombate(atual, 'A', 'restaurar', fim));
    const final = (await repo.obter('c'))!;
    expect(() => encerrarCombate(final, 'A', 'restaurar', fim)).toThrow();
    expect(() => executarAcaoCombate(final, 'A', 'avancar', fim)).toThrow();
    expect(await repo.obter('c')).toEqual(final);
  } finally { repo.fechar(); }
});

test('histórico completo sobrevive exclusão posterior de instâncias e documentos e remapeia IDs órfãos', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB: new IDBFactory(), nomeBanco: 'encerramento-orfaos' });
  try {
    const dados = await ativo(repo);
    await repo.salvar(encerrarCombate(dados, 'A', 'manter', fim));
    const encerrado = (await repo.obter('c'))!;
    await repo.salvar({ ...encerrado, instancias: [], fichas: [], anexos: [] });
    const semFontes = (await repo.obter('c'))!;
    expect(semFontes.combates[0].historico).toEqual(encerrado.combates[0].historico);
    let n = 0;
    const copia = await restaurarBackup(await exportarBackup(semFontes), repo, () => `orfaos-${++n}`);
    const restaurado = (await repo.obter(copia.campanha.id))!;
    expect(restaurado.instancias).toEqual([]);
    expect(restaurado.combates[0].historico!.participantes.map(p => p.nome)).toEqual(['Ária', 'Goblin 1']);
    for (const p of restaurado.combates[0].historico!.participantes) {
      expect(p.instanciaId).not.toBe(semFontes.combates[0].historico!.participantes.find(v => v.nome === p.nome)!.instanciaId);
      expect(restaurado.participantes.some(v => v.id === p.participanteId && v.instanciaId === p.instanciaId)).toBe(true);
      expect(p.fichaOriginalId).not.toBeNull();
      expect(p.fichaOriginalId).not.toBe(semFontes.combates[0].historico!.participantes.find(v => v.nome === p.nome)!.fichaOriginalId);
    }
  } finally { repo.fechar(); }
});
