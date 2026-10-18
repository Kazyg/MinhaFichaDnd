import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { Atributos } from '../../api/classesPrincipais/Atributos.class';
import { exportFicha, MAX_INPUT_BYTES } from '../../api/fichaPersonagem/fichaStorage';
import { ContextoImportacao, interpretarFichaJson, MAX_ANEXO_BYTES, prepararImportacao } from './importacao';

const contexto: ContextoImportacao = {
  campanhaId: 'campanha-1', fichaId: 'original-1', anexoId: 'anexo-1',
  categoria: 'jogador', importadoEm: '2026-10-17T12:00:00.000Z',
};
const legado = (extra = {}) => JSON.stringify({ id: 'legado', nomePersonagem: '  Aria  ', ...extra });

describe('metadados JSON de fichas existentes', () => {
  test.each(['DND_2014','DND_2024'] as const)('JSON exportado %s com máximo automático usa seletor existente sem mutação',versaoRegras=>{
    const ficha=new Ficha({id:'paladino',nomePersonagem:'Personagem sem nome',versaoRegras,levelTotal:2,vidaTotal:null,vidaAtual:20,atributosPersonagem:new Atributos(15,14,15,12,10,14),classePrincipal:{nome:'Paladino',dadosVida:10} as Ficha['classePrincipal']});
    const texto=exportFicha(ficha);
    expect(interpretarFichaJson(texto)).toMatchObject({nome:'Personagem sem nome',pv:{atuais:20,maximos:20},origemPV:'json',avisos:[]});
    expect(interpretarFichaJson(JSON.stringify(JSON.parse(texto).data)).pv).toEqual({atuais:20,maximos:20});
    expect(exportFicha(ficha)).toBe(texto);expect(ficha.vidaTotal).toBeNull();
  });
  test.each(['DND_2014', 'DND_2024'] as const)('interpreta exportação real %s sem alterar o documento', versaoRegras => {
    const ficha = new Ficha({ id: 'original', nomePersonagem: 'Aria', versaoRegras, vidaTotal: 24, vidaAtual: 17 });
    const texto = exportFicha(ficha);
    expect(interpretarFichaJson(texto)).toEqual({
      nome: 'Aria', pv: { atuais: 17, maximos: 24 }, origemPV: 'json', avisos: [],
      origem: { id: 'original', versaoRegras, envelope: true },
    });
    expect(exportFicha(ficha)).toBe(texto);
  });

  test('aceita legado e preserva a ausência de PV sem calcular valores', () => {
    expect(interpretarFichaJson(legado())).toMatchObject({
      nome: 'Aria', pv: { atuais: 0, maximos: 0 }, origemPV: 'manual-pendente',
      avisos: ['pv-nao-identificados'], origem: { versaoRegras: 'DND_2014', envelope: false },
    });
  });

  test.each([null, -1, 1.5])('PV máximos não confirmados (%s) pedem ajuste manual', vidaTotal => {
    expect(interpretarFichaJson(legado({ vidaTotal, vidaAtual: 10 }))).toMatchObject({
      pv: { atuais: 0, maximos: 0 }, origemPV: 'manual-pendente', avisos: ['pv-nao-identificados'],
    });
  });

  test.each([null, -1, 21, 1.5])('PV atuais inconsistentes (%s) não são confirmados', vidaAtual => {
    expect(interpretarFichaJson(legado({ vidaTotal: 20, vidaAtual }))).toMatchObject({
      pv: { atuais: 0, maximos: 20 }, origemPV: 'json', avisos: ['pv-atuais-nao-identificados'],
    });
  });

  test('zero é um valor confirmado e nome ausente gera aviso', () => {
    expect(interpretarFichaJson(legado({ nomePersonagem: null, vidaTotal: 0, vidaAtual: 0 }))).toMatchObject({
      nome: null, pv: { atuais: 0, maximos: 0 }, avisos: ['nome-ausente'],
    });
  });

  test.each([
    '{', '[]', '{}',
    JSON.stringify({ format: 'outro', version: 1, kind: 'ficha', data: JSON.parse(legado()) }),
    JSON.stringify({ format: 'minhafichadnd', version: 2, kind: 'ficha', data: JSON.parse(legado()) }),
    JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'colecao', data: [JSON.parse(legado())] }),
    '{"id":"x","nomePersonagem":"x","extra":{"__proto__":{}}}',
    '{"id":"x","nomePersonagem":"x","extra":{"constructor":{}}}',
    legado({ versaoRegras: 'DND_2030' }),
  ])('rejeita documentos incompatíveis e propriedades perigosas: %s', texto => {
    expect(() => interpretarFichaJson(texto)).toThrow('JSON inválido ou incompatível');
  });
});

describe('preparação de anexos', () => {
  test('mantém o arquivo JSON original e seus metadados', async () => {
    const arquivo = new File([legado({ vidaTotal: 12, vidaAtual: 6 })], 'personagem.json', { type: 'application/json' });
    const resultado = await prepararImportacao(arquivo, contexto);
    expect(resultado.anexo.arquivo).toBe(arquivo);
    expect(resultado.anexo).toMatchObject({ nome: arquivo.name, tamanho: arquivo.size, mime: 'application/json' });
    expect(resultado.ficha).toMatchObject({ nome: 'Aria', pvIniciais: { atuais: 6, maximos: 12 }, anexoId: contexto.anexoId });
  });

  test.each([
    ['png', 'image/png', new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
    ['jpg', 'image/jpeg', new Uint8Array([255, 216, 255])],
    ['gif', 'image/gif', 'GIF89a'],
    ['webp', 'image/webp', 'RIFF0000WEBP'],
    ['pdf', 'application/pdf', '%PDF-1.7'],
  ])('aceita assinatura %s e mantém PV pendentes', async (extensao, mime, bytes) => {
    const arquivo = new File([bytes], `Goblin.${extensao}`, { type: mime });
    const resultado = await prepararImportacao(arquivo, { ...contexto, categoria: 'monstro' });
    expect(resultado.anexo.arquivo).toBe(arquivo);
    expect(resultado.ficha).toMatchObject({ nome: 'Goblin', pvIniciais: { atuais: 0, maximos: 0 }, origemPV: 'manual-pendente', avisos: ['pv-nao-identificados', 'extracao-manual'] });
    expect(resultado.ficha.imagemAnexoId).toBe(extensao === 'pdf' ? undefined : contexto.anexoId);
  });

  test('aceita MIME ausente quando a assinatura corresponde', async () => {
    const resultado = await prepararImportacao(new File(['%PDF-1.7'], 'roteiro.pdf'), contexto);
    expect(resultado.anexo.mime).toBe('application/pdf');
  });

  test.each([
    [new File(['texto'], 'x.pdf', { type: 'application/pdf' }), contexto],
    [new File(['%PDF-'], 'x.pdf', { type: 'image/png' }), contexto],
    [new File([legado()], 'x.json'), { ...contexto, categoria: 'monstro' as const }],
    [new File(['x'], 'x.svg'), contexto],
  ])('rejeita formato não suportado ou divergente', async (arquivo, dados) => {
    await expect(prepararImportacao(arquivo, dados)).rejects.toMatchObject({ codigo: 'formato-nao-suportado' });
  });

  test('rejeita arquivo vazio', async () => {
    await expect(prepararImportacao(new File([], 'x.pdf'), contexto)).rejects.toMatchObject({ codigo: 'arquivo-vazio' });
  });

  test.each([['json', MAX_INPUT_BYTES], ['pdf', MAX_ANEXO_BYTES]])('aplica o limite de %s antes de ler', async (extensao, limite) => {
    const arquivo = new File(['x'], `x.${extensao}`);
    Object.defineProperty(arquivo, 'size', { value: Number(limite) + 1 });
    await expect(prepararImportacao(arquivo, contexto)).rejects.toMatchObject({ codigo: 'arquivo-grande' });
  });

  test('reporta falha de leitura', async () => {
    const leitura = jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (this: FileReader) {
      this.dispatchEvent(new ProgressEvent('error'));
    });
    try {
      await expect(prepararImportacao(new File([legado()], 'x.json'), contexto)).rejects.toMatchObject({ codigo: 'leitura-falhou' });
    } finally {
      leitura.mockRestore();
    }
  });
});
