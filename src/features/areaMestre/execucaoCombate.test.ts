import { DadosCampanha, InstanciaFicha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate, migrarExecucaoLegada } from './execucaoCombate';
import { validarDadosCampanha } from './validacao';

const data = '2026-10-18T12:00:00Z';
function preparado(): DadosCampanha {
  const instancias: InstanciaFicha[] = ['a', 'b', 'c', 'd'].map(id => ({ id, campanhaId: 'c', fichaOriginalId: null,
    categoria: 'monstro', nome: 'Mesmo nome', pv: { atuais: 2, maximos: 7 } }));
  const dados: DadosCampanha = { campanha: { id: 'c', nome: 'Teste', roteiro: '', schemaVersion: 1, criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], instancias, participantes: [], combates: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] } };
  return confirmarPreparacao(dados, { participantes: instancias.map((instancia, i) => ({ id: instancia.id, instancia, iniciativa: i < 2 ? 0 : -i })) }, 'b', data);
}
const iniciar = (d = preparado()) => executarAcaoCombate(d, 'b', 'iniciar', data);
const avancar = (d: DadosCampanha) => executarAcaoCombate(d, 'b', 'avancar', data);

const reforco: InstanciaFicha = { id: 'reforco', campanhaId: 'c', fichaOriginalId: null, categoria: 'monstro', nome: 'Minion', pv: { atuais: 1, maximos: 1 } };
const adicionar = (dados: DadosCampanha, iniciativa?: number) => executarAcaoCombate(dados, 'b', { adicionar: { id: 'novo', instancia: reforco, iniciativa } }, data);

test('inclui minion sem iniciativa após o turno atual e preserva progresso e PV de entrada', () => {
  const origem = avancar(iniciar()); const antes = JSON.stringify(origem);
  let d = adicionar(origem);
  expect(JSON.stringify(origem)).toBe(antes);
  expect(d.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'b', execucao: { visitados: ['a', 'b'] } });
  expect(d.combates[0].execucao!.pvAtivacao).toContainEqual({ participanteId: 'novo', instanciaId: 'reforco', pv: reforco.pv });
  expect(d.instancias).toContainEqual(reforco);
  for (const id of ['novo', 'c', 'd', 'a']) { d = avancar(d); expect(d.combates[0].participanteAtivoId).toBe(id); }
  expect(d.combates[0].rodada).toBe(2);
});

test('inclui após o último participante sem antecipar a próxima rodada', () => {
  let d = adicionar(avancar(avancar(avancar(iniciar()))));
  d = avancar(d);
  expect(d.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'novo' });
  expect(avancar(d).combates[0]).toMatchObject({ rodada: 2, participanteAtivoId: 'a' });
});

test.each([5, 0, -1, -5])('posiciona iniciativa %s e concede um turno ao reforço na rodada', iniciativa => {
  let d = adicionar(avancar(iniciar()), iniciativa);
  const ordem = d.participantes.slice().sort((a, b) => a.ordem - b.ordem);
  expect(ordem.map(p => p.iniciativa)).toEqual(ordem.map(p => p.iniciativa).sort((a, b) => b - a));
  const turnos: string[] = [];
  while (d.combates[0].rodada === 1) { d = avancar(d); if (d.combates[0].rodada === 1) turnos.push(d.combates[0].participanteAtivoId!); }
  expect(turnos.sort()).toEqual(['c', 'd', 'novo']);
});

test('adiciona instância existente sem sobrescrever PV e rejeita duplicatas e encontro preparado', () => {
  const origem = iniciar(); origem.instancias.push({ ...reforco, pv: { atuais: 3, maximos: 5 } });
  const d = adicionar(origem);
  expect(d.instancias.filter(i => i.id === reforco.id)).toHaveLength(1);
  expect(d.participantes.find(p => p.id === 'novo')!.pvInicio).toEqual({ atuais: 3, maximos: 5 });
  expect(() => executarAcaoCombate(d, 'b', { adicionar: { id: 'outro', instancia: reforco } }, data)).toThrow(/combate ativo/);
  expect(() => adicionar(preparado())).toThrow(/andamento/);
  expect(() => adicionar(iniciar(), 1.5)).toThrow(/inteiro/);
});

test('ativa por ordem estável com empates/negativas e snapshot de PV feridos na ativação', () => {
  const origem = preparado(); origem.instancias[0].pv.atuais = 0;
  const antes = JSON.stringify(origem); const ativo = iniciar(origem);
  expect(JSON.stringify(origem)).toBe(antes);
  expect(ativo.combates[0]).toMatchObject({ estado: 'ativo', rodada: 1, participanteAtivoId: 'a', execucao: { visitados: ['a'] } });
  expect(ativo.participantes.map(p => p.id)).toEqual(['a', 'b', 'c', 'd']);
  expect(ativo.combates[0].execucao!.pvAtivacao[0].pv.atuais).toBe(0);
  expect(ativo.participantes[0].pvInicio.atuais).toBe(2);
  ativo.instancias[0].pv.atuais = 7;
  expect(ativo.combates[0].execucao!.pvAtivacao[0].pv.atuais).toBe(0);
  expect(() => iniciar(ativo)).toThrow(/preparado/);
});

test('completa todos os turnos incluindo zero PV, incrementando só após o último', () => {
  const origem = preparado();
  origem.instancias.find(i => i.id === 'c')!.pv.atuais = 0;
  let d = iniciar(origem); const snapshot = JSON.stringify(d.combates[0].execucao!.pvAtivacao);
  for (const id of ['b', 'c', 'd']) { d = avancar(d); expect(d.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: id }); }
  d = avancar(d);
  expect(d.combates[0]).toMatchObject({ rodada: 2, participanteAtivoId: 'a', execucao: { visitados: ['a'] } });
  expect(JSON.stringify(d.combates[0].execucao!.pvAtivacao)).toBe(snapshot);
});

test('reordena rodada parcial sem repetir visitados nem pular restantes', () => {
  let d = avancar(iniciar());
  d = executarAcaoCombate(d, 'b', { ordem: ['d', 'a', 'c', 'b'] }, data);
  expect(d.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'b', execucao: { visitados: ['a', 'b'] } });
  d = avancar(d); expect(d.combates[0].participanteAtivoId).toBe('d');
  d = avancar(d); expect(d.combates[0]).toMatchObject({ rodada: 1, participanteAtivoId: 'c' });
  d = avancar(d); expect(d.combates[0]).toMatchObject({ rodada: 2, participanteAtivoId: 'd' });
  expect(d.participantes.slice().sort((a, b) => a.ordem - b.ordem).map(p => p.id)).toEqual(['d', 'a', 'c', 'b']);
});

test.each([['a', 'a', 'c', 'd'], ['a', 'b'], ['a', 'b', 'c', 'estranho']])('rejeita ordem inválida %j', (...ordem) => {
  expect(() => executarAcaoCombate(iniciar(), 'b', { ordem }, data)).toThrow(/exatamente uma vez/);
});

test('não ativa instância ocupada em outro encontro', () => {
  const d = preparado();
  d.combates.push({ ...d.combates[0], id: 'outro', estado: 'ativo', rodada: 1, participanteAtivoId: 'a2' });
  d.participantes.push(...d.participantes.map(p => ({ ...p, id: `${p.id}2`, combateId: 'outro' })));
  expect(() => iniciar(d)).toThrow(/outro combate ativo/);
});

test.each(['duplicado', 'ausente', 'instancia', 'pv', 'ativo'] as const)('rejeita execução corrompida: %s', caso => {
  const d = iniciar(); const e = d.combates[0].execucao!;
  if (caso === 'duplicado') e.visitados.push('a');
  if (caso === 'ausente') e.pvAtivacao.pop();
  if (caso === 'instancia') e.pvAtivacao[0].instanciaId = 'b';
  if (caso === 'pv') e.pvAtivacao[0].pv.atuais = 99;
  if (caso === 'ativo') e.visitados = ['b'];
  expect(() => validarDadosCampanha(d)).toThrow();
});

test('migração legada reconstrói prefixo e preserva snapshot histórico existente', () => {
  const d = preparado();
  const combate = { ...d.combates[0], estado: 'ativo' as const, rodada: 3, participanteAtivoId: 'b' };
  const migrado = migrarExecucaoLegada(combate, d.participantes);
  expect(migrado.execucao!.visitados).toEqual(['a', 'b']);
  expect(migrado.execucao!.pvAtivacao[0].pv).toEqual(d.participantes[0].pvInicio);
  expect(migrarExecucaoLegada(migrado, d.participantes)).toBe(migrado);
});
