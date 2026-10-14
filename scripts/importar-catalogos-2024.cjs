/* Run with text extracted using pdftotext -raw from the supplied chapters.
 * node scripts/importar-catalogos-2024.cjs /tmp/magias2024-raw.txt /tmp/talentos2024-raw.txt
 * Fails rather than publishing an incomplete catalog. */
const fs = require("fs");
const path = require("path");
const clean = (s) =>
  s
    .replace(/\f/g, "\n")
    .replace(/^CAPÍTULO.*$/gm, "")
    .replace(/^\d{3}\s*$/gm, "")
    .replace(/^[A-ZÀ-Ý][A-ZÀ-Ý &'’.-]{2,}$/gm, "")
    .replace(/([\p{L}])-\n-?([\p{L}])/gu, "$1$2")
    .replace(/([\p{L}])-\s+([\p{L}])/gu, "$1$2");
const flat = (s) => s.replace(/\s+/g, " ").trim();
const spellText = clean(fs.readFileSync(process.argv[2], "utf8"));
const spellMatches = [
  ...spellText.matchAll(
    /^(Truque de |[1-9][º°] Círculo, )([^\n]+(?:\n[^\n]+)*?)\nTempo de Conjuração:/gm,
  ),
];
const spells = spellMatches.map((m, i) => {
  const name = spellText.slice(0, m.index).trim().split("\n").pop().trim();
  const next = spellMatches[i + 1];
  const end = next
    ? spellText.lastIndexOf("\n", next.index - 2)
    : spellText.length;
  const body = flat(spellText.slice(m.index + m[0].length, end));
  const fields = body.match(
    /^(.*?) Alcance: (.*?) Componentes?: (.*?) Duração: (.*)$/,
  );
  if (!fields) throw new Error("Missing fields: " + name);
  const header = flat(m[2]);
  const classes = header
    .slice(header.indexOf("(") + 1, header.lastIndexOf(")"))
    .split(",")
    .map((s) => s.trim().replace("Guardião", "Patrulheiro"));
  const duration = fields[4].match(
    /^(Instantânea|Até [^\.]+?(?:rodada|minuto|hora|dia)s?|Concentração, até \d+ (?:rodada|minuto|hora|dia)s?|\d+ (?:rodada|minuto|hora|dia)s?|Até ser dissipada|Especial)(?:\s|$)([\s\S]*)/i,
  );
  if (!duration)
    throw new Error(
      "Unknown duration: " + name + " " + fields[4].slice(0, 100),
    );
  const component = fields[3];
  return {
    nome: "2024: " + name,
    nomeExibicao: name,
    edicao: "2024",
    nivel: m[1].startsWith("Truque") ? 0 : Number(m[1][0]),
    tipo: header
      .split(" (")[0]
      .toLowerCase()
      .replace("invocação", "conjuração"),
    classes,
    conjuracao: fields[1],
    alcance: { tipo: fields[2], distancia: 0 },
    componentes: {
      componentes: component
        .split(" (")[0]
        .split(",")
        .map((s) => s.trim()),
      material: component.includes("(")
        ? component.slice(component.indexOf("(") + 1, -1)
        : null,
    },
    duracao: duration[1].replace(/^Concentração, /i, ""),
    concentracao: /^Concentração/i.test(duration[1]),
    ritual: /Ritual/.test(fields[1]),
    descricao: duration[2]
      .trim()
      .replace(/ Um gnomo Bardo conjura Zombaria Perversa[\s\S]*$/, ""),
  };
});
const featText = clean(fs.readFileSync(process.argv[3], "utf8"));
const featMatches = [
  ...featText.matchAll(
    /^Talento (de Origem|Geral|de Estilo de Luta|de Dádiva Épica)(?: \(Pré-requisito: ([\s\S]*?)\))?\s*\n/gm,
  ),
];
const feats = featMatches.map((m, i) => {
  const name = featText.slice(0, m.index).trim().split("\n").pop().trim();
  const next = featMatches[i + 1];
  const end = next
    ? featText.lastIndexOf("\n", next.index - 2)
    : featText.length;
  const description = flat(featText.slice(m.index + m[0].length, end))
    .replace(/ Talentos (Gerais|de Estilo de Luta|de Dádiva Épica)[\s\S]*$/, "")
    .replace(/ Nos céus de Eberron[\s\S]*$/, "");
  const req = flat(m[2] || "");
  return {
    nome: "2024: " + name,
    nomeExibicao: name,
    edicao: "2024",
    categoria: m[1].replace(/^de /, ""),
    requisito: { tipo: null, requisito: req ? [req] : null, valor: null },
    bonus: [],
    descricao: description,
    preRequisito: req,
    repetivel: /Repetível\./.test(description),
  };
});
for (const [kind, data, count] of [
  ["magias", spells, 391],
  ["talentos", feats, 75],
]) {
  if (data.length !== count || new Set(data.map((d) => d.nome)).size !== count)
    throw new Error(`${kind}: expected ${count}, got ${data.length}`);
  if (data.some((d) => !d.descricao))
    throw new Error(`${kind}: empty descriptions`);
}
const target = path.resolve(__dirname, "../src/bibliotecas");
fs.writeFileSync(
  path.join(target, "catalogos2024.json"),
  JSON.stringify({ magias: spells, talentos: feats }, null, 2) + "\n",
);
console.log(`Imported ${spells.length} spells and ${feats.length} feats.`);
