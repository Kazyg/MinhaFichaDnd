import { DadosCampanha, InstanciaFicha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { executarAcaoCombate, migrarExecucaoLegada, migrarOrigemSnapshot } from './execucaoCombate';
import { encerrarCombate, nomeCombate, podeRestaurarPV } from './encerramentoCombate';
import { removerInstancia } from './instancias';
import { validarDadosCampanha } from './validacao';

const data = '2026-10-18T12:00:00Z';
const fim = '2026-10-18T13:00:00Z';
function ativo(): DadosCampanha {
  const instancias: InstanciaFicha[] = ['a', 'b', 'fora'].map(id => ({ id, campanhaId: 'c', fichaOriginalId: null,
    nome: id, categoria: 'monstro', pv: { atuais: 3, maximos: 7 } }));
  const dados: DadosCampanha = { campanha: { id: 'c', nome: 'Teste', roteiro: '', schemaVersion: 1, criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], instancias, participantes: [], combates: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] } };
  const preparado = confirmarPreparacao(dados, { nome: 'Torre', participantes: instancias.slice(0, 2).map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: i === 0 ? 0 : -i })) }, 'b', data);
  return executarAcaoCombate(preparado, 'b', 'iniciar', data);
}

test.each(['manter', 'restaurar'] as const)('encerra %s atomicamente, preservando os resultados antes da restauração', decisao => {
  let dados = ativo();
  dados = executarAcaoCombate(dados, 'b', 'avancar', data);
  dados.instancias[0] = { ...dados.instancias[0], pv: { atuais: 0, maximos: 9 } };
  const antes = JSON.stringify(dados);
  const resultado = encerrarCombate(dados, 'b', decisao, fim);
  expect(JSON.stringify(dados)).toBe(antes);
  expect(resultado.instancias[0].pv).toEqual(decisao === 'manter' ? { atuais: 0, maximos: 9 } : { atuais: 3, maximos: 7 });
  expect(resultado.instancias[2]).toEqual(dados.instancias[2]);
  expect(resultado.combates[0]).toMatchObject({ nome: 'Torre', estado: 'encerrado', rodada: 1, participanteAtivoId: null, encerradoEm: fim,
    historico: { decisaoPV: decisao, iniciadoEm: data, participantes: [{ nome: 'a', iniciativa: 0, ordem: 0, pvInicial: { atuais: 3, maximos: 7 }, pvFinal: { atuais: 0, maximos: 9 } }, {}] } });
  expect(resultado.participantes).toEqual(dados.participantes);
  expect(() => encerrarCombate(resultado, 'b', decisao, fim)).toThrow(/andamento/);
  expect(() => executarAcaoCombate(resultado, 'b', 'avancar', fim)).toThrow(/andamento/);
  expect(() => executarAcaoCombate(resultado, 'b', 'iniciar', fim)).toThrow(/preparado/);
});

test('histórico independente permite remover instâncias e preserva identidade e PV', () => {
  let dados = encerrarCombate(ativo(), 'b', 'restaurar', fim);
  dados.instancias[0].nome = 'Mudou'; dados.instancias[0].pv.atuais = 7;
  dados = removerInstancia(dados, 'a');
  expect(() => validarDadosCampanha(dados)).not.toThrow();
  expect(dados.combates[0].historico!.participantes[0]).toMatchObject({ nome: 'a', pvFinal: { atuais: 3, maximos: 7 } });
  dados.combates[0].historico!.participantes.pop();
  expect(() => validarDadosCampanha(dados)).toThrow(/histórico incompleto/);
});

test('legado sem snapshot real permite manter e impede restauração inventada', () => {
  const dados = ativo(); delete dados.combates[0].execucao;
  dados.combates[0] = migrarExecucaoLegada(dados.combates[0], dados.participantes);
  expect(podeRestaurarPV(dados.combates[0])).toBe(false);
  expect(() => encerrarCombate(dados, 'b', 'restaurar', fim)).toThrow(/Snapshot/);
  expect(encerrarCombate(dados, 'b', 'manter', fim).combates[0].historico!.participantes[0].pvInicial).toBeNull();
  delete dados.combates[0].execucao;
  expect(encerrarCombate(dados, 'b', 'manter', fim).combates[0].historico!.participantes[0].pvInicial).toBeNull();
});

test('migra snapshots Fase6 diferenciáveis, preservando ambíguos como indisponíveis', () => {
  const dados = ativo(); const combate = dados.combates[0]; delete combate.execucao!.origemSnapshot;
  expect(migrarOrigemSnapshot(combate).execucao!.origemSnapshot).toBe('legado');
  combate.execucao!.ativadoEm = fim;
  expect(migrarOrigemSnapshot(combate).execucao!.origemSnapshot).toBe('ativacao');
  expect(nomeCombate(dados, combate)).toBe('Torre'); delete combate.nome;
  expect(nomeCombate(dados, combate)).toBe('Combate 1');
});
