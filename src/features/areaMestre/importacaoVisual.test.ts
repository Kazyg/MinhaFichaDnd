import { confirmarMetadados, detectarNomeTexto, detectarPvTexto, prepararRetrato } from './importacaoVisual';
import { prepararImportacao } from './importacao';

const contexto = { campanhaId: 'campanha', fichaId: 'ficha', anexoId: 'anexo', categoria: 'jogador' as const, importadoEm: '2026-10-17T12:00:00Z' };
describe('revisão de importação', () => {
  test.each(['Pontos de vida 42 (5d8)', 'Hit Points: 42', 'PV máximos: 42'])('detecta somente rótulo explícito: %s', texto => expect(detectarPvTexto(texto)).toBe(42));
  test.each(['CA 18 Força 42', 'Hit Points 12 Hit Points 24', 'Pontos de vida -4', 'Hit Points 9007199254740992', 'PV máximos 7.5', 'PV máximos 7/10', 'Hit Points 7 / 10', 'PV máximos 7,5'])('recusa texto ausente, ambíguo ou inválido', texto => expect(detectarPvTexto(texto)).toBeNull());
  test('nome PDF exige rótulo explícito e único em sua própria linha', () => {
    expect(detectarNomeTexto('Name: Goblin\nHit Points 7')).toBe('Goblin');
    expect(detectarNomeTexto('Goblin\nHit Points 7')).toBeNull();
    expect(detectarNomeTexto('Nome: Um\nNome: Outro')).toBeNull();
  });
  test('preserva original e altera apenas metadados revisados', async () => {
    const arquivo = new File(['{"id":"x","nomePersonagem":"Aria"}'], 'aria.json', { type: 'application/json' });
    const preparado = await prepararImportacao(arquivo, contexto);
    const original = { ficha: preparado.ficha, anexos: [preparado.anexo] };
    const revisado = confirmarMetadados(original, '  Nome  ', '20', '7');
    expect(revisado.ficha).toMatchObject({ nome: 'Nome', pvIniciais: { maximos: 20, atuais: 7 } });
    expect(original.ficha.pvIniciais).toEqual({ maximos: 0, atuais: 0 });
    expect(revisado.anexos[0].arquivo).toBe(arquivo);
    for (const [max, atual] of [['', '0'], ['-1', '0'], ['1.5', '0'], ['20', '21'], ['9007199254740992', '0']]) expect(() => confirmarMetadados(original, 'Nome', max, atual)).toThrow();
    expect(() => confirmarMetadados(original, ' ', '0', '0')).toThrow('nome');
  });
  test('retratos aceitam apenas imagens e mantêm bytes', async () => {
    const anterior = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => 'id-retrato' } });
    try {
      const imagem = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'retrato.png', { type: 'image/png' });
      expect((await prepararRetrato(imagem, 'campanha')).arquivo).toBe(imagem);
      await expect(prepararRetrato(new File(['%PDF-1.7'], 'retrato.pdf', { type: 'application/pdf' }), 'campanha')).rejects.toThrow('retrato deve ser uma imagem');
    } finally { if (anterior) Object.defineProperty(globalThis, 'crypto', anterior); }
  });
});
