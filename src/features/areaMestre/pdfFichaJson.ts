import { parseImport, parseJSON } from '../../api/fichaPersonagem/fichaStorage';
import { ErroAreaMestre } from './dominio';
import { ContextoImportacao, MAX_ANEXO_BYTES, prepararImportacao } from './importacao';
import { ImportacaoConfirmada } from './importacaoVisual';
import { AnexoCampanha, DadosCampanha, FichaOriginal } from './modelos';
import { lerBlob } from './pdf';
import { validarDadosCampanha } from './validacao';
const lerTexto = async (arquivo: Blob) => typeof arquivo.text === 'function' ? arquivo.text() : await lerBlob(arquivo, true) as string;


export function validarJsonDoSite(texto: string) {
  const valor = parseJSON(texto);
  const envelope = valor?.format === 'minhafichadnd' && valor?.version === 1 && valor?.kind === 'ficha';
  const snapshot = envelope ? valor.data : valor;
  const atributos = snapshot?.atributosPersonagem;
  const legado = atributos && ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma']
    .every(chave => typeof atributos[chave]?.valor === 'number') &&
    ['levelTotal', 'efeitos', 'ArmaEquipada', 'vidaTotal'].some(chave => Object.prototype.hasOwnProperty.call(snapshot, chave));
  if (!envelope && !legado) throw new ErroAreaMestre('json-invalido', 'Use um arquivo JSON exportado pelo MinhaFichaDnd (2014 ou 2024).');
  return parseImport(texto);
}


export async function gerarPdfDoJson(ficha: FichaOriginal, original: AnexoCampanha): Promise<AnexoCampanha> {
  const texto = await lerTexto(original.arquivo);

  const personagem = parseImport(texto);
  const { gerarFichaPdf } = await import('../../utils/exportarFichaPdf');
  const bytes = await gerarFichaPdf(personagem);
  const arquivo = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  if (!arquivo.size || arquivo.size > MAX_ANEXO_BYTES) throw new Error('O PDF gerado excede o tamanho permitido.');
  return { id: crypto.randomUUID(), campanhaId: ficha.campanhaId, nome: `${original.nome.replace(/\.json$/i, '')}_ficha.pdf`,
    mime: 'application/pdf', tamanho: arquivo.size, arquivo };
}


export async function prepararImportacaoComPdf(arquivo: File, contexto: ContextoImportacao): Promise<ImportacaoConfirmada> {
  const resultado = await prepararImportacao(arquivo, contexto);
  if (resultado.ficha.formato !== 'json') return { ficha: resultado.ficha, anexos: [resultado.anexo] };
  try {
    validarJsonDoSite(await lerTexto(arquivo));
    const pdf = await gerarPdfDoJson(resultado.ficha, resultado.anexo);
    return { ficha: { ...resultado.ficha, pdfAnexoId: pdf.id }, anexos: [resultado.anexo, pdf] };
  } catch (causa) {
    throw new ErroAreaMestre('json-invalido', causa instanceof Error ? causa.message : 'Não foi possível gerar o PDF da ficha. Tente novamente.');
  }
}


export async function converterFichaJson(dados: DadosCampanha, fichaId: string): Promise<DadosCampanha> {
  const ficha = dados.fichas.find(f => f.id === fichaId);
  if (!ficha || ficha.formato !== 'json') throw new Error('Ficha JSON não encontrada.');
  if (ficha.pdfAnexoId) return dados;
  const original = dados.anexos.find(a => a.id === ficha.anexoId);
  if (!original) throw new Error('O JSON original não está disponível.');
  const pdf = await gerarPdfDoJson(ficha, original);
  const proximo = { ...dados, fichas: dados.fichas.map(f => f.id === fichaId ? { ...f, pdfAnexoId: pdf.id } : f), anexos: [...dados.anexos, pdf] };
  validarDadosCampanha(proximo);
  return proximo;
}
