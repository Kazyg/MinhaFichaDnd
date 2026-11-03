import { DadosCampanha } from './modelos';
import { validarDadosCampanha } from './validacao';
import { ErroPersistencia, normalizarErroPersistencia } from './erros';

function exemplo(): DadosCampanha {
  const data = '2026-10-17T12:00:00Z';
  return {
    campanha: { id: 'c', nome: 'Teste', roteiro: '', schemaVersion: 1, criadoEm: data, atualizadoEm: data },
    anexos: [{ id: 'a', campanhaId: 'c', nome: 'g.png', mime: 'image/png', tamanho: 1, arquivo: new Blob(['x']) }],
    fichas: [{ id: 'f', campanhaId: 'c', nome: 'Goblin', categoria: 'monstro', formato: 'imagem', anexoId: 'a', imagemAnexoId: 'a', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: ['extracao-manual'], importadoEm: data }],
    instancias: [{ id: 'i', campanhaId: 'c', nome: 'Goblin', categoria: 'monstro', fichaOriginalId: 'f', pv: { atuais: 2, maximos: 7 } }, { id: 'j', campanhaId: 'c', nome: 'Minion', categoria: 'monstro', fichaOriginalId: null, pv: { atuais: 1, maximos: 1 } }],
    combates: [{ id: 'b', campanhaId: 'c', estado: 'ativo', rodada: 1, participanteAtivoId: 'p', iniciadoEm: data, encerradoEm: null }],
    participantes: [{ id: 'p', combateId: 'b', instanciaId: 'i', iniciativa: 12, ordem: 0, pvInicio: { atuais: 7, maximos: 7 } }, { id: 'q', combateId: 'b', instanciaId: 'j', iniciativa: 12, ordem: 1, pvInicio: { atuais: 1, maximos: 1 } }],
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [{ id: 'l', tipo: 'roteiro', x: 0, y: 0, largura: 1, altura: 1, fechado: false, recolhido: false }] },
  };
}

test('valida agregado completo sem modificar dados e aceita campanha vazia', () => {
  const dados = exemplo();
  const antes = JSON.stringify(dados);
  expect(() => validarDadosCampanha(dados)).not.toThrow();
  expect(JSON.stringify(dados)).toBe(antes);
  expect(() => validarDadosCampanha({ ...dados, anexos: [], fichas: [], instancias: [], combates: [], participantes: [] })).not.toThrow();
});

test.each<[(d: DadosCampanha) => void]>([
  [d => { d.campanha.id = ''; }],
  [d => { d.campanha.criadoEm = 'ontem'; }],
  [d => { d.campanha.revisao = -1; }],
  [d => { d.anexos.push(d.anexos[0]); }],
  [d => { d.anexos[0].tamanho = 999; }],
  [d => { d.anexos[0].mime = 'image/svg+xml'; }],
  [d => { d.fichas[0].anexoId = 'ausente'; }],
  [d => { d.fichas[0].imagemAnexoId = 'ausente'; }],
  [d => { d.fichas[0].formato = 'pdf'; }],
  [d => { d.fichas[0].campanhaId = 'outra'; }],
  [d => { d.instancias[0].fichaOriginalId = 'ausente'; }],
  [d => { d.instancias[0].categoria = 'jogador'; }],
  [d => { d.instancias[0].pv.atuais = 8; }],
  [d => { d.participantes[0].pvInicio.maximos = Infinity; }],
  [d => { d.participantes[0].combateId = 'ausente'; }],
  [d => { d.participantes[0].instanciaId = 'ausente'; }],
  [d => { d.participantes[1].ordem = 0; }],
  [d => { d.participantes[1].instanciaId = 'i'; }],
  [d => { d.participantes.pop(); }],
  [d => { d.combates[0].participanteAtivoId = 'ausente'; }],
  [d => { d.combates[0].rodada = 0; }],
  [d => { d.combates[0].encerradoEm = '2026-10-17T12:00:00Z'; }],
  [d => { d.layout.campanhaId = 'outra'; }],
  [d => { d.layout.paineis[0].largura = 0; }],
  [d => { Object.assign(d.fichas[0], { categoria: ['monstro'] }); }],
  [d => { Object.assign(d.campanha, { schemaVersion: 99 }); }],
  [d => { Object.assign(d.campanha, { extra: 'não suportado' }); }],
  [d => { Object.defineProperty(d.campanha, 'nome', { get: () => 'acessor' }); }],
])('rejeita corrupção de entidade ou referência (%#)', alterar => {
  const dados = exemplo();
  alterar(dados);
  expect(() => validarDadosCampanha(dados)).toThrow(expect.objectContaining({ codigo: 'dados-corrompidos' }));
});

test('rejeita a mesma instância em dois combates ativos', () => {
  const dados = exemplo();
  dados.combates.push({ ...dados.combates[0], id: 'outro', participanteAtivoId: 'r' });
  dados.participantes.push(...dados.participantes.map((p, i) => ({ ...p, id: ['r', 's'][i], combateId: 'outro' })));
  expect(() => validarDadosCampanha(dados)).toThrow(/dois combates ativos/);
});

test('permite histórico encerrado da mesma instância', () => {
  const dados = exemplo();
  dados.combates.push({ ...dados.combates[0], id: 'historico', estado: 'encerrado', encerradoEm: '2026-10-17T12:00:00Z', participanteAtivoId: null });
  dados.participantes.push(...dados.participantes.map((p, i) => ({ ...p, id: ['r', 's'][i], combateId: 'historico' })));
  expect(() => validarDadosCampanha(dados)).not.toThrow();
});

test.each([
  ['QuotaExceededError', 'cota-excedida'], ['SecurityError', 'bloqueado'], ['VersionError', 'versao-incompativel'],
  ['ConstraintError', 'conflito'], ['DataCloneError', 'dados-corrompidos'], ['InvalidStateError', 'indisponivel'], ['AbortError', 'transacao-falhou'],
])('normaliza falha %s', (name, codigo) => {
  expect(normalizarErroPersistencia({ name })).toMatchObject({ codigo });
});

test('preserva erros conhecidos e normaliza causas desconhecidas', () => {
  const erro = new ErroPersistencia('nao-encontrado', 'Removida');
  expect(normalizarErroPersistencia(erro)).toBe(erro);
  expect(normalizarErroPersistencia(null)).toMatchObject({ codigo: 'transacao-falhou' });
});
