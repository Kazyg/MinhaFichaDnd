// Uso: node indexar-fonte-phb2024.cjs <pdf-local> <pdfjs-dist/legacy/build/pdf.mjs> <saida.json>
// Extrai somente um índice de nomes/localizadores; não copia descrições do livro.
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { createHash } = require('node:crypto');

async function main() {
  const [arquivo, extrator, saida] = process.argv.slice(2);
  if (!arquivo || !extrator || !saida) throw new Error('Informe PDF, módulo pdfjs e saída.');
  const bytes = fs.readFileSync(arquivo);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== '55f530ae733992d95cf6c7a000b86b40a2166e98292347e76db4693941f7236c') {
    throw new Error('PDF diferente da referência conferida; revalidar paginação e extração.');
  }
  const { getDocument } = await import(pathToFileURL(extrator).href);
  const pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise;
  const paginas = new Map();
  for (const numero of [205, 206, ...Array.from({ length: 105 }, (_, i) => i + 245)]) {
    const pagina = await pdf.getPage(numero);
    const texto = await pagina.getTextContent();
    paginas.set(numero, texto.items.map(t => t.str + (t.hasEOL ? '\n' : ' ')).join('').split('\n').map(l => l.trim()));
  }
  const talentos = [];
  for (const numero of [205, 206]) {
    for (const linha of paginas.get(numero)) {
      const m = linha.match(/^(.+?)\s+(Origem|Geral|Estilo de Luta|Dádiva Épica)$/);
      if (!m || /^Talentos? de$/.test(m[1])) continue;
      talentos.push({ nome: m[1].replace(/\*$/, ''), categoria: m[2], repetivel: m[1].endsWith('*'), paginaIndice: numero - 6, paginaPdfIndice: numero });
    }
  }
  const magias = [];
  let cabecalhosConjuracao = 0;
  for (let numero = 245; numero <= 349; numero++) {
    const linhas = paginas.get(numero);
    cabecalhosConjuracao += linhas.filter(l => /^Tempo de Conjuração:/.test(l)).length;
    for (let i = 0; i < linhas.length; i++) {
      const m = linhas[i].match(/^(Truque de |([1-9])[º°] Círculo,)/);
      if (m) magias.push({ nome: linhas[i - 1], nivel: Number(m[2] ?? 0), pagina: numero - 6, paginaPdf: numero });
    }
  }
  if (talentos.length !== 75 || magias.length !== 391 || cabecalhosConjuracao !== 391 ||
      new Set(talentos.map(t => t.nome)).size !== 75 || new Set(magias.map(m => m.nome)).size !== 391) {
    throw new Error('Contagem ou unicidade divergente; não publicar índice incompleto.');
  }
  const inventario = { edicao: 'DND_2024', traducao: 'Heróis Anônimos', revisaoTraducao: '6ª edição, 13/08/2025',
    consultadoEm: '2026-10-08', sha256: hash, paginasPdf: pdf.numPages,
    estado: 'Índice de referência; não é catálogo implementado nem certificação de errata ou licença.', talentos, magias };
  fs.writeFileSync(saida, JSON.stringify(inventario, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ talentos: talentos.length, magias: magias.length, cabecalhosConjuracao, sha256: hash }));
  await pdf.destroy();
}
main().catch(e => { console.error(e); process.exitCode = 1; });
