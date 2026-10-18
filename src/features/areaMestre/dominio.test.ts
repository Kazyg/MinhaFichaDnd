import { criarInstancia, ErroAreaMestre, validarId, validarPV } from './dominio';
import { FichaOriginal } from './modelos';

function fichaOriginal(): FichaOriginal {
  return {
    id: 'goblin', campanhaId: 'campanha', categoria: 'monstro', formato: 'imagem',
    anexoId: 'documento-goblin', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 },
    origemPV: 'manual-pendente', avisos: ['extracao-manual'], importadoEm: '2026-10-17T12:00:00Z',
  };
}

describe('instâncias de fichas', () => {
  test('compartilham a ficha original mantendo PV e identidades independentes', () => {
    const original = fichaOriginal();
    const snapshot = JSON.stringify(original);
    const primeira = criarInstancia(original, 'goblin-1');
    const segunda = criarInstancia(original, 'goblin-2', '  Goblin arqueiro  ');

    primeira.pv.atuais = 2;
    primeira.pv.maximos = 10;

    expect(primeira.id).not.toBe(segunda.id);
    expect(primeira.fichaOriginalId).toBe(original.id);
    expect(segunda.fichaOriginalId).toBe(original.id);
    expect(segunda.campanhaId).toBe(original.campanhaId);
    expect(segunda.categoria).toBe('monstro');
    expect(segunda.nome).toBe('Goblin arqueiro');
    expect(primeira.nome).toBe('Goblin');
    expect(segunda.pv).toEqual({ atuais: 7, maximos: 7 });
    expect(primeira.pv).not.toBe(original.pvIniciais);
    expect(segunda.pv).not.toBe(original.pvIniciais);
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  test.each(['', '   ', 'x'.repeat(201)])('recusa ID inválido de instância: %p', id => {
    expect(() => criarInstancia(fichaOriginal(), id)).toThrow(ErroAreaMestre);
  });

  test.each(['id', 'campanhaId'] as const)('recusa referência inválida: %s', campo => {
    expect(() => criarInstancia({ ...fichaOriginal(), [campo]: '' }, 'instancia')).toThrow(ErroAreaMestre);
  });

  test.each(['', '   '])('recusa nome vazio: %p', nome => {
    expect(() => criarInstancia(fichaOriginal(), 'instancia', nome)).toThrow(ErroAreaMestre);
  });

  test('recusa PV inconsistentes da ficha original', () => {
    const original = fichaOriginal();
    original.pvIniciais.atuais = 8;
    expect(() => criarInstancia(original, 'instancia')).toThrow(ErroAreaMestre);
  });
});

describe('validação dos dados de domínio', () => {
  test.each([{ atuais: 0, maximos: 0 }, { atuais: 0, maximos: 7 }, { atuais: 7, maximos: 7 }])(
    'aceita os limites válidos de PV: %p', pv => {
      expect(() => validarPV(pv)).not.toThrow();
    },
  );

  test.each([
    { atuais: -1, maximos: 7 }, { atuais: 0, maximos: -1 }, { atuais: 8, maximos: 7 },
    { atuais: 0.5, maximos: 7 }, { atuais: 0, maximos: 7.5 },
    { atuais: NaN, maximos: 7 }, { atuais: 0, maximos: Infinity },
    { atuais: Infinity, maximos: Infinity }, { atuais: 0, maximos: Number.MAX_SAFE_INTEGER + 1 },
  ])('recusa PV inválidos: %p', pv => {
    expect(() => validarPV(pv)).toThrow(ErroAreaMestre);
    expect(() => validarPV(pv)).toThrow(expect.objectContaining({ codigo: 'dados-invalidos' }));
  });

  test('aceita IDs no limite de tamanho', () => {
    expect(() => validarId('x'.repeat(200))).not.toThrow();
  });
});
