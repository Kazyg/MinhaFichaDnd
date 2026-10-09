// node docs/auditoria-2026-10-06/A25-medir.cjs <CRA BUILD_PATH>
// Read-only: production JS, excluding maps; gzip uses Node's default level.
const fs = require('node:fs');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const root = path.resolve(process.argv[2]);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'asset-manifest.json'), 'utf8'));
const initial = new Set(manifest.entrypoints);
const files = fs.readdirSync(path.join(root, 'static/js')).filter(f => f.endsWith('.js')).map(name => {
  const file = `static/js/${name}`;
  const bytes = fs.readFileSync(path.join(root, file));
  return { file, initial: initial.has(file), bytes: bytes.length, gzip: gzipSync(bytes).length };
});
console.log(JSON.stringify({ node: process.version, files,
  initialGzip: files.filter(f => f.initial).reduce((sum, f) => sum + f.gzip, 0),
  totalGzip: files.reduce((sum, f) => sum + f.gzip, 0) }, null, 2));
