import { aplicarCura, aplicarDano, ajustarInstancia, criarInstanciaAdicional, duplicarInstancia, removerInstancia } from './instancias';
import { DadosCampanha } from './modelos';

export function dadosPV(): DadosCampanha {
  return {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Teste', roteiro: '', criadoEm: '2026-10-17T12:00:00Z', atualizadoEm: '2026-10-17T12:00:00Z' },
    anexos: [], fichas: [{ id: 'f', campanhaId: 'c', categoria: 'monstro', formato: 'imagem', anexoId: 'a', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: [], importadoEm: '2026-10-17T12:00:00Z' }],
    instancias: [{ id: 'i', campanhaId: 'c', fichaOriginalId: 'f', categoria: 'monstro', nome: 'Goblin', pv: { atuais: 7, maximos: 7 } }],
    combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}
test('três instâncias compartilham original sem compartilhar PV; duplicação copia PV atuais', () => {
  const original = dadosPV();
  let dados = criarInstanciaAdicional(original, 'f', 'i2');
  dados = aplicarDano(dados, 'i', 5);
  dados = duplicarInstancia(dados, 'i', 'i3');
  dados = aplicarCura(dados, 'i3', 2);
  expect(dados.instancias.map(i => i.pv.atuais)).toEqual([2, 7, 4]);
  expect(original.instancias[0].pv.atuais).toBe(7);
  expect(dados.fichas).toBe(original.fichas);
  expect(dados.anexos).toBe(original.anexos);
  expect(dados.instancias[2].pv).not.toBe(dados.instancias[0].pv);
});
test('dano e cura respeitam limites mesmo com maior inteiro seguro', () => {
  const dados = aplicarDano(dadosPV(), 'i', Number.MAX_SAFE_INTEGER);
  expect(dados.instancias[0].pv.atuais).toBe(0);
  expect(aplicarCura(dados, 'i', Number.MAX_SAFE_INTEGER).instancias[0].pv.atuais).toBe(7);
});
test.each([-1, 1.2, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('recusa quantidade inválida %p sem mudar dados', quantidade => {
  const dados = dadosPV();
  expect(() => aplicarDano(dados, 'i', quantidade)).toThrow();
  expect(() => aplicarCura(dados, 'i', quantidade)).toThrow();
  expect(() => ajustarInstancia(dados, 'i', 'G', quantidade, 7)).toThrow();
  expect(dados.instancias[0].pv.atuais).toBe(7);
});
test('ajuste reduz PV ao máximo e permite máximo não definido', () => {
  const dados = ajustarInstancia(dadosPV(), 'i', '  Vigia  ', 7, 3);
  expect(dados.instancias[0]).toMatchObject({ nome: 'Vigia', pv: { atuais: 3, maximos: 3 } });
  expect(ajustarInstancia(dados, 'i', 'Vigia', 3, 0).instancias[0].pv).toEqual({ atuais: 0, maximos: 0 });
});
test('remoção respeita referências e preserva original e outras instâncias', () => {
  const dados = criarInstanciaAdicional(dadosPV(), 'f', 'i2');
  dados.participantes.push({ id: 'p', combateId: 'b', instanciaId: 'i', iniciativa: 1, ordem: 0, pvInicio: { atuais: 7, maximos: 7 } });
  expect(() => removerInstancia(dados, 'i')).toThrow('referenciada');
  expect(removerInstancia(dados, 'i2').instancias).toHaveLength(1);
  expect(removerInstancia(dados, 'i2').fichas).toBe(dados.fichas);
});
test('impede IDs duplicados, referências ausentes e duplicação de jogador', () => {
  const dados = dadosPV();
  expect(() => criarInstanciaAdicional(dados, 'f', 'i')).toThrow();
  expect(() => criarInstanciaAdicional(dados, 'ausente', 'i2')).toThrow();
  dados.instancias[0].categoria = 'jogador';
  expect(() => duplicarInstancia(dados, 'i', 'i2')).toThrow();
});
