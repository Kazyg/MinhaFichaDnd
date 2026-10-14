// Entrada: pages.json temporário obtido com PDF.js, com {page, text, items}.
// O PDF e sua extração integral não fazem parte do repositório.
const fs = require('node:fs');
const pages = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const index = require('../docs/revisao-pendencias-2026-10-08/FONTE-PHB2024-indice.json');
const join = s => s.replace(/-\s*\n\s*([a-zà-ÿ])/g, '$1').replace(/\s+/g, ' ').trim();
const lines = (start, end) => pages.filter(p => p.page >= start && p.page <= end).flatMap(p => p.text.split('\n').map(text => ({ text: text.trim(), page: p.page })))
  .filter(l => l.text && !/^CAPÍTULO \d+ \|/.test(l.text) && !/^\d+$/.test(l.text) && !/^[A-Z][A-Z &.'’—-]{5,}$/.test(l.text));
const spellLines = lines(245, 349);
const starts = spellLines.flatMap((l, i) => /^(Truque de |[1-9][º°] Círculo,)/.test(l.text) ? [i - 1] : []);
const classKeys = { Bardo: 'bardo', Bruxo: 'bruxo', Clérigo: 'clerigo', Druida: 'druida', Feiticeiro: 'feiticeiro', Guardião: 'patrulheiro', Mago: 'mago', Paladino: 'paladino' };
const magias = starts.map((start, n) => {
  const section = spellLines.slice(start, starts[n + 1] ?? spellLines.length);
  const nome = section[0].text;
  const text = section.slice(1).map(l => l.text).join('\n');
  const match = text.match(/^([\s\S]+?)Tempo de Conjuração:\s*([\s\S]+?)Alcance:\s*([\s\S]+?)Componentes?:\s*([\s\S]+?)Duração:\s*([^\n]+)\n([\s\S]+)$/);
  if (!match) throw new Error(`Cabeçalho inválido: ${nome}`);
  const [, header, cast, range, components, duration, description] = match;
  const h = join(header).match(/^(?:Truque de |[1-9][º°] Círculo,\s*)(\S+)\s*\(([^)]+)\)/);
  if (!h) throw new Error(`Escola/listas: ${nome}`);
  const listas = h[2].split(',').map(c => classKeys[c.trim()]);
  if (listas.some(c => !c)) throw new Error(`Classe não mapeada: ${nome} ${h[2]}`);
  const m = join(components);
  const numericRange = join(range).match(/^([\d.,]+) metros?$/);
  return { nome, pagina: section[0].page - 6, nivel: /^Truque/.test(header) ? 0 : Number(header[0]),
    tipo: h[1] === 'Invocação' ? 'conjuração' : h[1].toLocaleLowerCase('pt-BR'), listas,
    conjuracao: join(cast), alcance: { tipo: numericRange ? 'distância' : join(range).toLocaleLowerCase('pt-BR'), distancia: numericRange ? Number(numericRange[1].replace('.', '').replace(',', '.')) : 0 },
    componentes: { componentes: m.split('(')[0].split(',').map(c => c.trim()), material: m.includes('(') ? m.slice(m.indexOf('(') + 1, m.lastIndexOf(')')) : null },
    duracao: join(duration), concentracao: /Concentração/i.test(duration), ritual: /Ritual/.test(cast), descricao: join(description) };
});
const featLines = lines(206, 217);
const featStarts = featLines.flatMap((l, i) => /^Talento (de Origem|Geral \(|de Estilo de Luta \(|de Dádiva Épica \()/.test(l.text) ? [i - 1] : []);
const aliases = { 'Tocado Pelas Sombras': 'Tocado pela Sombra', 'Tocado Por Fadas': 'Tocado pelas Fadas' };
const talentos = featStarts.map((start, n) => {
  const s = featLines.slice(start, featStarts[n + 1] ?? featLines.length);
  const nome = aliases[s[0].text] ?? s[0].text;
  const indexed = index.talentos.find(t => t.nome === nome);
  if (!indexed) throw new Error(`Talento fora do índice: ${nome}`);
  const text = join(s.slice(1).map(l => l.text).join('\n'));
  const req = text.match(/Pré-requisito: ([^)]+)\)/)?.[1] ?? '';
  const desc = text.replace(/^Talento (?:de Origem|Geral \([^)]*\)|de Estilo de Luta \([^)]*\)|de Dádiva Épica \([^)]*\))\s*/, '').replace(/Talentos (?:Gerais|de Origem|de Estilo de Luta|de Dádiva Épica).*$/, '').trim();
  return { nome, pagina: s[0].page - 6, categoria: indexed.categoria, repetivel: indexed.repetivel, requisitoTexto: req, descricao: desc };
});
for (const [collection, expected] of [[magias, index.magias], [talentos, index.talentos]]) {
  if (collection.length !== expected.length || new Set(collection.map(x => x.nome)).size !== expected.length || expected.some(e => !collection.some(x => x.nome === e.nome))) throw new Error('Índice e descrição divergem.');
}
fs.writeFileSync('src/api/rulesets/dnd2024/phb2024.json', JSON.stringify({ magias, talentos }, null, 2) + '\n');
console.log(JSON.stringify({ magias: magias.length, talentos: talentos.length }));

