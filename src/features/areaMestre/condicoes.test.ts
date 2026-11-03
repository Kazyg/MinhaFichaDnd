import { CATALOGO_CONDICOES, CATEGORIAS_CONDICOES, nomeCondicao } from './catalogoCondicoes';
import { alterarCondicao, DadosCondicao } from './condicoes';
import { executarAcaoCombate } from './execucaoCombate';
import { encerrarCombate } from './encerramentoCombate';
import { DadosCampanha, InstanciaFicha } from './modelos';
import { confirmarPreparacao } from './preparacaoCombate';
import { validarDadosCampanha } from './validacao';

const agora = '2026-10-18T12:00:00Z';
function iniciar(): DadosCampanha {
  const instancias: InstanciaFicha[] = ['guerreiro', 'mago', 'goblin1', 'goblin2'].map((id, i) => ({ id,
    campanhaId: 'campanha', fichaOriginalId: null, categoria: i < 2 ? 'jogador' : 'monstro', nome: i < 2 ? id : 'Goblin', pv: { atuais: 0, maximos: 7 } }));
  const dados: DadosCampanha = { campanha: { id: 'campanha', nome: 'Teste', roteiro: '', schemaVersion: 1, criadoEm: agora, atualizadoEm: agora },
    instancias, fichas: [], anexos: [], participantes: [], combates: [], layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: false, paineis: [] } };
  return executarAcaoCombate(confirmarPreparacao(dados, { participantes: instancias.map((instancia, i) => ({ id: instancia.id, instancia, iniciativa: 10 - i })) }, 'combate', agora), 'combate', 'iniciar', agora);
}
const avancar = (d: DadosCampanha, quantidade = 1) => {
  for (let i = 0; i < quantidade; i++) d = executarAcaoCombate(d, 'combate', 'avancar', agora);
  return d;
};
const adicionar = (d: DadosCampanha, alvo: string, id: string, campos: Partial<DadosCondicao> = {}) => alterarCondicao(d, 'combate', alvo, {
  tipo: 'adicionar', id, dados: { tipo: 'queimando', duracao: 'turnos', restantes: 3, momento: 'final', ...campos },
}, agora);

test('catálogo completo tem quinze oficiais e cinco categorias sem IDs ambíguos', () => {
  expect(CATALOGO_CONDICOES.filter(c => c.categoria === 'oficiais')).toHaveLength(15);
  expect(CATALOGO_CONDICOES).toHaveLength(77);
  expect(CATEGORIAS_CONDICOES).toHaveLength(5);
  expect(new Set(CATALOGO_CONDICOES.map(c => c.id)).size).toBe(77);
  expect(CATALOGO_CONDICOES.every(c => /^[a-z0-9-]+$/.test(c.id) && !c.nome.includes('?') && c.icone)).toBe(true);
  expect(CATALOGO_CONDICOES.find(c => c.id === 'envenenado')?.categoria).toBe('oficiais');
  expect(CATALOGO_CONDICOES.find(c => c.id === 'veneno-continuo')?.categoria).toBe('dano-continuo');
});

test('efeitos repetidos no mesmo alvo têm contadores independentes e respeitam identidades', () => {
  const original = iniciar();
  let d = adicionar(original, 'goblin1', 'fogo1', { restantes: 1 });
  d = adicionar(d, 'goblin1', 'fogo2', { restantes: 2 });
  expect(original.combates[0].condicoes).toBeUndefined();
  d = avancar(d, 2);
  expect(d.combates[0].condicoes?.map(c => c.restantes)).toEqual([1, 2]);
  d = avancar(d);
  expect(d.combates[0].condicoes).toMatchObject([{ id: 'fogo2', participanteId: 'goblin1', restantes: 1 }]);
  expect(d.instancias).toEqual(original.instancias);
  d = avancar(d, 4);
  expect(d.combates[0].condicoes).toEqual([]);
});

test('aplicação no turno atual ignora ocorrência parcial mesmo após reordenar e recarregar', () => {
  let d = adicionar(iniciar(), 'guerreiro', 'veneno', { tipo: 'envenenado', restantes: 1 });
  expect(d.combates[0].condicoes?.[0].ignorarOcorrencia).toBe(0);
  d = executarAcaoCombate(d, 'combate', { ordem: ['goblin2', 'guerreiro', 'goblin1', 'mago'] }, agora);
  expect(d.combates[0].execucao?.ocorrenciaTurno).toBe(0);
  d = JSON.parse(JSON.stringify(avancar(d)));
  expect(d.combates[0].condicoes?.[0].restantes).toBe(1);
  d = avancar(d, 4);
  expect(d.combates[0].participanteAtivoId).toBe('guerreiro');
  expect(d.combates[0].condicoes?.[0].restantes).toBe(1);
  d = avancar(d);
  expect(d.combates[0].condicoes).toEqual([]);
});

test('início conta apenas a próxima entrada do alvo e final conta a saída elegível', () => {
  let d = adicionar(iniciar(), 'guerreiro', 'inicioAtual', { momento: 'inicio', restantes: 1 });
  d = adicionar(d, 'mago', 'inicioProximo', { momento: 'inicio', restantes: 1 });
  d = adicionar(d, 'mago', 'finalProximo', { restantes: 1 });
  d = avancar(d);
  expect(d.combates[0].condicoes?.map(c => c.id)).toEqual(['inicioAtual', 'finalProximo']);
  d = avancar(d);
  expect(d.combates[0].condicoes?.map(c => c.id)).toEqual(['inicioAtual']);
  d = avancar(d, 2);
  expect(d.combates[0].condicoes).toEqual([]);
});

test('editar restantes preserva ocorrência ignorada e não avança rodada; manual não expira', () => {
  let d = adicionar(iniciar(), 'guerreiro', 'efeito', { duracao: 'manual', restantes: null });
  d = avancar(d, 4);
  expect(d.combates[0].condicoes?.[0].restantes).toBeNull();
  const antes = d.combates[0];
  d = alterarCondicao(d, 'combate', 'guerreiro', { tipo: 'editar', id: 'efeito', dados: {
    tipo: 'personalizado', nomePersonalizado: 'Vínculo arcano', duracao: 'turnos', restantes: 1, momento: 'final', observacao: 'Origem independente',
  } }, agora);
  expect(d.combates[0].rodada).toBe(antes.rodada);
  expect(d.combates[0].execucao).toEqual(antes.execucao);
  expect(nomeCondicao(d.combates[0].condicoes![0])).toBe('Vínculo arcano');
  expect(d.combates[0].condicoes?.[0].ignorarOcorrencia).toBe(0);
  expect(avancar(d).combates[0].condicoes).toEqual([]);
  const removido = alterarCondicao(d, 'combate', 'guerreiro', { tipo: 'excluir', id: 'efeito' }, agora);
  expect(removido.combates[0].condicoes).toEqual([]);
  expect(() => alterarCondicao(d, 'combate', 'goblin2', { tipo: 'excluir', id: 'efeito' }, agora)).toThrow();
});

test.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejeita turnos inválidos %s', restantes => {
  expect(() => adicionar(iniciar(), 'mago', 'efeito', { restantes })).toThrow();
});

test('validação protege tipos, níveis, ligações, duplicatas e relógio corrompido', () => {
  const original = iniciar();
  for (const campos of [{ tipo: 'inexistente' }, { tipo: 'personalizado', nomePersonalizado: ' ' }, { tipo: 'exaustao', nivel: 7 },
    { tipo: 'exaustao' }, { tipo: 'queimando', nivel: 1 }, { duracao: 'manual' as const, restantes: 3 }]) {
    expect(() => adicionar(original, 'mago', 'efeito', campos)).toThrow();
  }
  let d = adicionar(original, 'mago', 'exaustao', { tipo: 'exaustao', nivel: 0 });
  expect(() => adicionar(d, 'mago', 'exaustao')).toThrow();
  d = adicionar(d, 'goblin1', 'exaustao6', { tipo: 'exaustao', nivel: 6 });
  d.combates[0].condicoes![0].participanteId = 'estranho';
  expect(() => validarDadosCampanha(d)).toThrow();
  const limite = iniciar(); limite.combates[0].execucao!.ocorrenciaTurno = Number.MAX_SAFE_INTEGER;
  expect(() => avancar(limite)).toThrow(/turnos/);
});

test('encerrar copia condições ativas para histórico e impede avanço e alterações posteriores', () => {
  const d = adicionar(iniciar(), 'goblin2', 'eterno', { duracao: 'manual', restantes: null });
  const encerrado = encerrarCombate(d, 'combate', 'restaurar', agora);
  expect(encerrado.combates[0].historico?.condicoes).toEqual(d.combates[0].condicoes);
  expect(encerrado.combates[0].historico?.condicoes).not.toBe(encerrado.combates[0].condicoes);
  d.combates[0].condicoes![0].observacao = 'Mudança externa';
  expect(encerrado.combates[0].historico?.condicoes?.[0].observacao).toBeUndefined();
  expect(() => avancar(encerrado)).toThrow();
  expect(() => alterarCondicao(encerrado, 'combate', 'goblin2', { tipo: 'excluir', id: 'eterno' }, agora)).toThrow();
  encerrado.combates[0].historico!.condicoes![0].restantes = 0;
  expect(() => validarDadosCampanha(encerrado)).toThrow();
});
