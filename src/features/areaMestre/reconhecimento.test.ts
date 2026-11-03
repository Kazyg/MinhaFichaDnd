import { reconhecerArquivo, reconhecerPagina } from './reconhecimento';
import { extrairPaginasPdf, rasterizarPaginaPdf, TextoPagina } from './pdf';
import { reconhecerImagem } from './ocr';
jest.mock('./pdf', () => ({ extrairPaginasPdf: jest.fn(), rasterizarPaginaPdf: jest.fn() }));
jest.mock('./ocr', () => ({ reconhecerImagem: jest.fn() }));
const pagina = (...linhas: string[]): TextoPagina => ({ largura: 800, altura: 1000, trechos: linhas.map((texto, n) => ({ texto, x: 20, y: 20 + n * 30, altura: n ? 12 : 20, largura: 220 })) });
afterEach(() => jest.clearAllMocks());
test.each(['HP 66 (12d8 + 12)', 'HP: 66', 'Hit Points: 66', 'Pontos de Vida: 66', 'PV: 66'])('monstro: %s não confunde dados com PV', texto => {
  expect(reconhecerPagina(pagina('AARAKOCRA AEROMANCER', texto, 'AC 16'), 'monstro')).toMatchObject({ nome: 'AARAKOCRA AEROMANCER', pv: { atuais: 66, maximos: 66 } });
});
test('campos de jogador distinguem máximos, atuais e temporários', () => {
  expect(reconhecerPagina(pagina('Nome: Aria', 'PV Totais 20', 'PV Atuais 7', 'PV Temporários 50'), 'jogador')).toMatchObject({ nome: 'Aria', pv: { atuais: 7, maximos: 20 } });
});
test('posição do valor acima do rótulo independe da ordem dos elementos PDF', () => {
  const folha = pagina('Nome: Aria');
  folha.trechos.push({ texto: 'PV Totais', x: 300, y: 300, largura: 80, altura: 12 }, { texto: '20', x: 420, y: 300, largura: 20, altura: 12 }, { texto: 'PONTOS DE VIDA ATUAIS', x: 300, y: 390, largura: 160, altura: 12 }, { texto: '7', x: 365, y: 365, largura: 10, altura: 18 }, { texto: '25', x: 100, y: 300, largura: 20, altura: 12 });
  expect(reconhecerPagina(folha, 'jogador').pv).toEqual({ maximos: 20, atuais: 7 });
});
test('nome de personagem acima do rótulo e HP zero', () => {
  expect(reconhecerPagina(pagina('Personagem sem nome', 'NOME DO PERSONAGEM', 'Max HP 20', 'Current HP 0'), 'jogador')).toMatchObject({ nome: 'Personagem sem nome', pv: { maximos: 20, atuais: 0 } });
});
test.each([['HP 10', 'HP 20'], ['PV Totais 10', 'PV Atuais 20'], ['PV Temporários 30'], ['HP 7.5'], ['HP 7 / 10'], ['AC 16', 'Speed 30'], ['HP 9007199254740992']])('ambiguidade exige confirmação: %s', (...texto) => {
  expect(reconhecerPagina(pagina(...texto), 'monstro').pv).toBeNull();
});
test('ignora OCR com baixa confiança', () => {
  const folha = pagina('Nome: Aria', 'HP 20'); folha.trechos.forEach(t => { t.confianca = 30; });
  expect(reconhecerPagina(folha, 'jogador')).toMatchObject({ nome: null, pv: null });
});
test('palavra temporários com baixa confiança não transforma PV temporários em máximo',()=>{
  const folha=pagina();folha.trechos=[{texto:'PV',x:10,y:100,largura:20,altura:12,confianca:99},{texto:'Temporários',x:35,y:100,largura:80,altura:12,confianca:20},{texto:'50',x:120,y:100,largura:20,altura:12,confianca:99}];
  expect(reconhecerPagina(folha,'jogador').pv).toBeNull();
});
const anexo = (mime: string) => ({ id: 'a', campanhaId: 'c', nome: 'ficha', mime, tamanho: 4, arquivo: new Blob(['test']) });
test('PDF textual usa posições e não dispara OCR', async () => {
  (extrairPaginasPdf as jest.Mock).mockResolvedValue([pagina('AARAKOCRA AEROMANCER', 'HP 66 (12d8 + 12)', 'Medium Elemental Neutral', 'Actions Wind Staff ranged attack')]);
  expect((await reconhecerArquivo(anexo('application/pdf'), 'monstro')).pv?.maximos).toBe(66);
  expect(reconhecerImagem).not.toHaveBeenCalled();
});
test('PDF digitalizado rasteriza e libera canvas após OCR', async () => {
  const canvas = document.createElement('canvas');
  (extrairPaginasPdf as jest.Mock).mockResolvedValue([pagina()]); (rasterizarPaginaPdf as jest.Mock).mockResolvedValue({ canvas });
  (reconhecerImagem as jest.Mock).mockResolvedValue(pagina('Goblin', 'PV: 40'));
  expect((await reconhecerArquivo(anexo('application/pdf'), 'monstro')).pv?.maximos).toBe(40);
  expect(canvas.width).toBe(0); expect(canvas.height).toBe(0);
});
test('imagens usam OCR sob demanda; JSON nunca usa OCR', async () => {
  (reconhecerImagem as jest.Mock).mockResolvedValue(pagina('Goblin', 'HP 10'));
  expect((await reconhecerArquivo(anexo('image/png'), 'monstro')).pv?.maximos).toBe(10);
  await reconhecerArquivo(anexo('application/json'), 'jogador'); expect(reconhecerImagem).toHaveBeenCalledTimes(1);
});
test('cancelamento impede processamento; falha OCR continua visível ao chamador', async () => {
  const abort = new AbortController(); abort.abort();
  await expect(reconhecerArquivo(anexo('image/png'), 'monstro', undefined, abort.signal)).rejects.toThrow('cancelado');
  (reconhecerImagem as jest.Mock).mockRejectedValue(new Error('OCR indisponível'));
  await expect(reconhecerArquivo(anexo('image/png'), 'monstro')).rejects.toThrow('OCR indisponível');
});
