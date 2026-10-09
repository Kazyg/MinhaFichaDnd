const fs = require('fs'), path = require('path'), crypto = require('crypto'), ts = require('typescript');
const out = __dirname;
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, esModuleInterop: true } }).outputText, f);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const entries = [];
for (const name of ['Talentos', 'Magia', 'CaracteristicasClasse', 'Itens', 'ItensTraduzidos']) {
  const file = `src/bibliotecas/${name}.ts`;
  const exports = require(path.resolve(file));
  for (const [collection, values] of Object.entries(exports)) if (Array.isArray(values)) values.forEach((entry, i) => {
    const nome = typeof entry === 'string' ? entry : entry.nome ?? entry.name ?? entry.caracteristica ?? `registro ${i}`;
    entries.push({ arquivo: file, colecao: collection, indice: i, nome,
      edicao: entry.versaoRegras ?? 'não certificada por registro', fonte: entry.fonte ?? null, revisao: entry.revisao ?? null,
      licenca: entry.licenca ?? 'pendente', falta: 'Documento primário com localizador e revisão; autorização/licença da reprodução e tradução específica. Metadados locais não comprovam esses direitos.' });
  });
}
const { getTalentosConteudo, getMagiasConteudo } = require(path.resolve('src/api/rulesets/conteudo.ts'));
for (const edicao of ['DND_2014', 'DND_2024']) for (const entry of [...getTalentosConteudo(edicao), ...getMagiasConteudo(edicao)]) {
  entries.push({ arquivo: 'src/api/rulesets/conteudo.ts', id: entry.id, nome: entry.nome, edicao, fonte: entry.fonte,
    revisao: entry.revisao, licenca: entry.licenca, suportado: entry.suportado,
    falta: entry.licenca === 'pendente' ? 'Fonte primária, revisão e autorização/licença da tradução do registro legado.' : null });
}
const previous = JSON.parse(fs.readFileSync('docs/auditoria-2026-10-06/F7-assets.json', 'utf8'));
const assets = previous.arquivos.map(a => ({ ...a, sha256Atual: fs.existsSync(a.caminho) ? hash(fs.readFileSync(a.caminho)) : null,
  documentoFaltante: 'Declaração do autor/titular ou licença que autorize distribuir este arquivo e suas adaptações; URL original e atribuição exigida.' }));
fs.writeFileSync(path.join(out, 'fontes-por-entrada.json'), JSON.stringify({ consulta: '2026-10-08', criterio: 'Inventário, não certificação editorial ou jurídica; acervo preservado.', entries, assets }, null, 2));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const readAudit = file => JSON.parse(fs.readFileSync(path.join(out, file), 'utf16le').replace(/^\uFEFF/, ''));
const audit = readAudit('audit-after.json');
const runtime = new Set();
function resolvePackage(from, name) {
  let folder = from;
  while (true) {
    const key = `${folder ? folder + '/' : ''}node_modules/${name}`;
    if (lock.packages[key]) return key;
    if (!folder) return null;
    folder = folder.includes('/node_modules/') ? folder.slice(0, folder.lastIndexOf('/node_modules/')) : '';
  }
}
function visit(key) {
  if (!key || runtime.has(key)) return;
  runtime.add(key);
  for (const name of Object.keys(lock.packages[key].dependencies ?? {})) visit(resolvePackage(key, name));
}
for (const name of ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'pdf-lib', 'react-toastify', 'web-vitals', 'yocto-queue']) visit(resolvePackage('', name));
const vulnerabilities = Object.values(audit.vulnerabilities).map(v => ({ nome: v.name, severidade: v.severity,
  nodes: v.nodes.map(n => ({ path: n, version: lock.packages[n]?.version })),
  alcance: v.nodes.some(n => runtime.has(n)) ? 'dependência de runtime: examinar uso específico' : 'toolchain: build/testes/dev-server; não depende dos roots runtime examinados',
  advisories: v.via, correcoes: v.fixAvailable,
  mitigacao: v.nodes.some(n => runtime.has(n)) ? 'Router declarativo; caminhos de navegação constantes; sem SSR/hydration, loaders ou actions. Não aceitar destinos de JSON/URL sem allowlist.' : 'Build/testes com arquivos controlados; dev-server somente loopback e perfil isolado, sem páginas não confiáveis. Publicar apenas artefatos estáticos, nunca npm start. Atualização major da toolchain exige decisão separada.' }));
fs.writeFileSync(path.join(out, 'triagem-dependencias.json'), JSON.stringify({ consulta: '2026-10-08', metadata: audit.metadata, runtimeClosure: [...runtime], vulnerabilities }, null, 2));
console.log(JSON.stringify({ entries: entries.length, assets: assets.length, assetsChanged: assets.filter(a => a.sha256 !== a.sha256Atual).map(a => a.caminho), audit: audit.metadata.vulnerabilities, runtimeAffected: vulnerabilities.filter(v => v.alcance.startsWith('dependência')).map(v => v.nome) }));
