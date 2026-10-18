import { DadosCampanha, InstanciaFicha } from './modelos';
import { confirmarPreparacao, ParticipantePreparacao, ordenarParticipantesPreparacao } from './preparacaoCombate';
import { validarDadosCampanha } from './validacao';

const data = '2026-10-18T12:00:00Z';
function instancia(id: string): InstanciaFicha {
  return { id, campanhaId: 'c', fichaOriginalId: null, categoria: 'monstro', nome: id, pv: { atuais: 2, maximos: 7 } };
}
function dados(): DadosCampanha {
  return { campanha: { id: 'c', nome: 'Campanha', roteiro: '', schemaVersion: 1, criadoEm: data, atualizadoEm: data },
    fichas: [], anexos: [], instancias: [instancia('a')], combates: [], participantes: [],
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] } };
}
function selecao(): ParticipantePreparacao[] {
  return [{ id: 'p', instancia: instancia('a'), iniciativa: -2 }, { id: 'q', instancia: instancia('b'), iniciativa: 0 }];
}

test('confirma sem mutar fontes, preserva vida ferida e cria avulso apenas no agregado retornado', () => {
  const origem = dados(); const participantes = selecao(); const snapshot = JSON.stringify([origem, participantes]);
  const resultado = confirmarPreparacao(origem, { participantes }, 'combate', data);
  expect(JSON.stringify([origem, participantes])).toBe(snapshot);
  expect(resultado.combates[0]).toMatchObject({ estado: 'preparado', rodada: 0, participanteAtivoId: null, encerradoEm: null });
  expect(resultado.instancias).toHaveLength(2);
  expect(resultado.instancias[0].pv.atuais).toBe(2);
  expect(resultado.participantes.map(p => p.id)).toEqual(['q', 'p']);
  resultado.instancias[0].pv.atuais = 0;
  expect(resultado.participantes.find(p => p.id === 'p')?.pvInicio.atuais).toBe(2);
  expect(participantes[0].instancia.pv.atuais).toBe(2);
});

test('empates seguem inclusão e iniciativas aceitam extremos inteiros negativos e positivos', () => {
  const lista = [...selecao(), { id: 'r', instancia: instancia('d'), iniciativa: 0 }, { id: 's', instancia: instancia('e'), iniciativa: Number.MAX_SAFE_INTEGER }];
  expect(ordenarParticipantesPreparacao(lista).map(p => p.id)).toEqual(['s', 'q', 'r', 'p']);
  expect(confirmarPreparacao(dados(), { participantes: lista }, 'b', data).participantes.map(p => p.ordem)).toEqual([0, 1, 2, 3]);
});

test.each<[(lista: ParticipantePreparacao[]) => void]>([
  [p => { p.pop(); }], [p => { p[1].id = p[0].id; }], [p => { p[1].instancia.id = p[0].instancia.id; }],
  [p => { p[0].iniciativa = NaN; }], [p => { p[0].iniciativa = 0.5; }], [p => { p[0].iniciativa = Infinity; }],
  [p => { p[0].iniciativa = Number.MAX_SAFE_INTEGER + 1; }], [p => { p[0].instancia.pv.atuais = 8; }],
  [p => { p[0].instancia.pv.maximos = -1; }], [p => { p[0].instancia.campanhaId = 'outra'; }],
  [p => { p[0].instancia.fichaOriginalId = 'ausente'; }], [p => { p[0].instancia.categoria = 'jogador'; }],
  [p => { p[0].instancia.nome = ' '; }],
])('rejeita rascunho inválido sem alterar agregado (%#)', alterar => {
  const origem = dados(); const antes = JSON.stringify(origem); const participantes = selecao(); alterar(participantes);
  expect(() => confirmarPreparacao(origem, { participantes }, 'b', data)).toThrow();
  expect(JSON.stringify(origem)).toBe(antes);
});

test('preparados podem compartilhar instâncias, mas ativos bloqueiam nova preparação', () => {
  const preparado = confirmarPreparacao(dados(), { participantes: selecao() }, 'b', data);
  const segunda = selecao().map(p => ({ ...p, id: `${p.id}-2` }));
  expect(() => confirmarPreparacao(preparado, { participantes: segunda }, 'b2', data)).not.toThrow();
  preparado.combates[0] = { ...preparado.combates[0], estado: 'ativo', rodada: 1, participanteAtivoId: 'p' };
  expect(() => confirmarPreparacao(preparado, { participantes: segunda }, 'b2', data)).toThrow(/combate ativo/);
});

test('referência original existente não pode ser trocada e encontro/participante não pode colidir', () => {
  const preparado = confirmarPreparacao(dados(), { participantes: selecao() }, 'b', data);
  expect(() => confirmarPreparacao(preparado, { participantes: selecao() }, 'b', data)).toThrow(/já existe/);
  expect(() => confirmarPreparacao(preparado, { participantes: selecao() }, 'outro', data)).toThrow(/duplicados/);
});

test.each(['rodada', 'ativo', 'encerrado'] as const)('validação impede estado preparado inconsistente: %s', campo => {
  const preparado = confirmarPreparacao(dados(), { participantes: selecao() }, 'b', data);
  if (campo === 'rodada') preparado.combates[0].rodada = 1;
  if (campo === 'ativo') preparado.combates[0].participanteAtivoId = 'p';
  if (campo === 'encerrado') preparado.combates[0].encerradoEm = data;
  expect(() => validarDadosCampanha(preparado)).toThrow();
});
