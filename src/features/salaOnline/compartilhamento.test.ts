import { DadosCampanha } from '../areaMestre/modelos';
import { prepararPublicacao } from './compartilhamento';

function campanha(): DadosCampanha {
  const ficha = { campanhaId: 'c', formato: 'imagem' as const, pvIniciais: { atuais: 10, maximos: 10 }, origemPV: 'manual-pendente' as const, avisos: [], importadoEm: '' };
  return {
    campanha: { id: 'c', nome: 'Aventura', schemaVersion: 1, roteiro: 'SEGREDO_ROTEIRO', criadoEm: '', atualizadoEm: '' },
    anexos: ['j-ficha','m-ficha','m-retrato'].map(id => ({ id, campanhaId: 'c', nome: `SEGREDO_${id}`, mime: 'image/png', tamanho: 1, arquivo: new Blob([id], { type: 'image/png' }) })),
    fichas: [{ ...ficha, id: 'j', categoria: 'jogador', nome: 'Clériga', anexoId: 'j-ficha' }, { ...ficha, id: 'm', categoria: 'monstro', nome: 'SEGREDO_NOME', anexoId: 'm-ficha', imagemAnexoId: 'm-retrato' }],
    instancias: [{ id: 'pj', campanhaId: 'c', fichaOriginalId: 'j', categoria: 'jogador', nome: 'Clériga', pv: { atuais: 4, maximos: 12 } }, { id: 'pm', campanhaId: 'c', fichaOriginalId: 'm', categoria: 'monstro', nome: 'SEGREDO_INSTANCIA', pv: { atuais: 999, maximos: 999 } }],
    combates: [{ id: 'b', campanhaId: 'c', estado: 'ativo', rodada: 5, participanteAtivoId: 'mp', iniciadoEm: '', encerradoEm: null }],
    participantes: [{ id: 'mp', combateId: 'b', instanciaId: 'pm', iniciativa: 21, ordem: 1, pvInicio: { atuais: 999, maximos: 999 } }],
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}
const escolha = { jogadores: ['pj'], combateId: 'b', monstros: ['pm'] };
test('permite somente os campos públicos e os arquivos explicitamente compartilhados', () => {
  const dados = campanha(); const resultado = prepararPublicacao(dados, escolha);
  expect(resultado.visao.jogadores[0].pv).toEqual({ atuais: 4, maximos: 12 });
  expect(JSON.stringify(resultado.visao)).not.toMatch(/SEGREDO|999|iniciativa|rodada|roteiro|anexoId/);
  expect(resultado.visao.combate?.imagens[0]).toEqual({ id: 'm0', retrato: { id: 'm0-retrato', mime: 'image/png', nome: 'Retrato' } });
  expect([...resultado.arquivos.values()]).not.toContain(dados.anexos[1].arquivo);
  expect(resultado.visao.jogadores[0].pv).not.toBe(dados.instancias[0].pv);
});
test.each(['preparado','encerrado'] as const)('não revela monstros de combate %s', estado => {
  const dados = campanha(); dados.combates[0].estado = estado;
  const resultado = prepararPublicacao(dados, escolha);
  expect(resultado.visao.combate).toBeNull(); expect(resultado.arquivos.size).toBe(1);
});
test('monstro sem recorte não usa sua ficha como imagem', () => {
  const dados = campanha(); dados.fichas[1].imagemAnexoId = 'm-ficha';
  const resultado = prepararPublicacao(dados, escolha);
  expect(resultado.visao.combate?.imagens[0].retrato).toBeNull(); expect(resultado.arquivos.size).toBe(1);
});
test('não aceita monstros na lista do grupo nem jogadores na lista de inimigos', () => {
  const resultado = prepararPublicacao(campanha(), { ...escolha, jogadores: ['pm'], monstros: ['pj'] });
  expect(resultado.visao.jogadores).toEqual([]); expect(resultado.visao.combate?.imagens).toEqual([]);
});
test('só revela os monstros escolhidos no combate selecionado', () => {
  const resultado = prepararPublicacao(campanha(), { ...escolha, monstros: [] });
  expect(resultado.visao.combate?.imagens).toEqual([]);
});
test('não compartilha o JSON original, nem anexos de outra campanha', () => {
  const dados = campanha(); dados.fichas[0].formato = 'json'; dados.anexos[2].campanhaId = 'outra';
  const resultado = prepararPublicacao(dados, escolha);
  expect(resultado.visao.jogadores[0].ficha).toBeNull(); expect(resultado.visao.combate?.imagens[0].retrato).toBeNull(); expect(resultado.arquivos.size).toBe(0);
});
