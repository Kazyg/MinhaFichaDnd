import { AnexoCampanha, CategoriaFicha, PontosVida } from './modelos';
import { extrairPaginasPdf, rasterizarPaginaPdf, TextoPagina, TrechoPagina } from './pdf';

export interface Reconhecimento { nome: string | null; pv: PontosVida | null; avisos: string[] }
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const inteiro = (texto: string) => /^\d+$/.test(texto) && Number.isSafeInteger(Number(texto)) ? Number(texto) : null;
const rotulo = /(?:pontos?\s+de\s+vida(?:\s+(?:totais|atuais|maximos|temporarios))?|hit\s+points|(?:current|max(?:imum)?)\s+hp|(?:pv|hp)(?:\s+(?:totais|atuais|maximos|temporarios))?)/i;

/** Mantém as coordenadas: valores podem estar acima do rótulo no PDF oficial. */
export function reconhecerPagina(pagina: TextoPagina, categoria: CategoriaFicha): Reconhecimento {
  const trechos = pagina.trechos;
  const linhas: TrechoPagina[] = [];
  for (const trecho of [...trechos].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const linha = linhas.find(l => Math.abs(l.y - trecho.y) <= Math.max(3, Math.min(l.altura, trecho.altura) * .5) && trecho.x >= l.x && trecho.x - (l.x + l.largura) < Math.max(25, trecho.altura * 2));
    if (linha) { linha.texto += ` ${trecho.texto}`; linha.largura = trecho.x + trecho.largura - linha.x; linha.confianca = Math.min(linha.confianca ?? 100, trecho.confianca ?? 100); }
    else linhas.push({ ...trecho });
  }
  const linhasConfiaveis = linhas.filter(l => l.confianca === undefined || l.confianca >= 65);
  const valores: { tipo: 'max' | 'atual'; valor: number }[] = [];
  for (const linha of linhasConfiaveis) {
    const texto = normalizar(linha.texto);
    const match = rotulo.exec(texto);
    if (!match || /tempor|temporary/.test(texto)) continue;
    const tipo = /atuais|current/.test(texto) ? 'atual' : 'max';
    const depois = texto.slice((match.index ?? 0) + match[0].length).trim().replace(/^[:：]\s*/, '');
    const direto = /^(\d+)(?![\d.,/])(?:\s*\(|\s*$)/.exec(depois);
    let valor = direto ? inteiro(direto[1]) : null;
    if (valor === null && !depois) {
      const vizinhos = trechos.filter(t => (t.confianca === undefined || t.confianca >= 65) && inteiro(t.texto.trim()) !== null &&
        ((Math.abs(t.y - linha.y) < Math.max(15, linha.altura * 1.5) && t.x >= linha.x + linha.largura && t.x - linha.x - linha.largura < 140) ||
          (t.y <= linha.y && linha.y - t.y < Math.max(45, linha.altura * 4) && t.x >= linha.x - 12 && t.x <= linha.x + linha.largura + 80)));
      if (vizinhos.length === 1) valor = inteiro(vizinhos[0].texto.trim());
    }
    if (valor !== null) valores.push({ tipo, valor });
  }
  const maximos = valores.filter(v => v.tipo === 'max'); const atuais = valores.filter(v => v.tipo === 'atual');
  let pv: PontosVida | null = null;
  if (maximos.length === 1 && atuais.length <= 1) {
    const atual = atuais[0]?.valor ?? maximos[0].valor;
    if (atual <= maximos[0].valor) pv = { atuais: atual, maximos: maximos[0].valor };
  }
  let nome: string | null = null;
  const explicitos = linhasConfiaveis.flatMap(l => { const m = /^(?:nome(?: do personagem)?|(?:character )?name)\s*[:：]\s*(.{1,200})$/i.exec(l.texto); return m ? [m[1].trim()] : []; });
  if (explicitos.length === 1) nome = explicitos[0];
  if (!nome && categoria === 'jogador') {
    const label = linhasConfiaveis.find(l => /^(?:nome do personagem|character name)$/i.test(l.texto.trim()));
    if (label) {
      const candidatos = linhasConfiaveis.filter(l => l !== label && l.y < label.y && label.y - l.y < 55 && l.x >= label.x - 25 && l.x < label.x + label.largura + 120 && /[a-z]/i.test(l.texto) && !rotulo.test(normalizar(l.texto)));
      if (candidatos.length === 1) nome = candidatos[0].texto;
    }
  }
  if (!nome && categoria === 'monstro') {
    const primeira = linhasConfiaveis.filter(l => l.y < pagina.altura * .24 && l.texto.length >= 3 && l.texto.length <= 120 && /[a-z]/i.test(l.texto) && !/\d|dungeons|dragons|stat block/i.test(l.texto) && !rotulo.test(normalizar(l.texto))).sort((a, b) => a.y - b.y)[0];
    if (primeira && primeira.altura >= Math.max(...linhas.filter(l => l.y < pagina.altura * .3).map(l => l.altura)) * .8) nome = primeira.texto;
  }
  return { nome, pv, avisos: [...(!nome ? ['Nome não identificado com segurança; revise manualmente.'] : []), ...(!pv ? ['PV não identificados com segurança; revise manualmente.'] : [])] };
}

export async function reconhecerArquivo(anexo: AnexoCampanha, categoria: CategoriaFicha, onProgresso?: (mensagem: string) => void, signal?: AbortSignal): Promise<Reconhecimento> {
  if (anexo.mime === 'application/json') return { nome: null, pv: null, avisos: [] };
  if (signal?.aborted) throw new Error('Processamento cancelado.');
  onProgresso?.('Reconhecendo nome e pontos de vida…');
  if (anexo.mime === 'application/pdf') {
    const paginas = await extrairPaginasPdf(anexo.arquivo, signal);
    const resultados = paginas.map(p => reconhecerPagina(p, categoria));
    const resultado = resultados.find(r => r.pv || r.nome);
    if (paginas.some(p => p.trechos.reduce((n, t) => n + t.texto.length, 0) > 70)) return resultado ?? { nome: null, pv: null, avisos: ['Revise nome e PV manualmente.'] };
    const raster = await rasterizarPaginaPdf(anexo.arquivo, 1, 2200, signal);
    try { const { reconhecerImagem } = await import('./ocr'); return reconhecerPagina(await reconhecerImagem(raster.canvas, onProgresso, signal), categoria); }
    finally { raster.canvas.width = 0; raster.canvas.height = 0; }
  }
  const { reconhecerImagem } = await import('./ocr');
  return reconhecerPagina(await reconhecerImagem(anexo.arquivo, onProgresso, signal), categoria);
}
