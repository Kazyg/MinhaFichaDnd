const fs = require('node:fs');
const path = require('node:path');
const lock = require('../../package-lock.json');
const bytes = fs.readFileSync(path.join(__dirname, 'audit-after.json'));
const audit = JSON.parse(bytes.toString(bytes[0] === 0xff && bytes[1] === 0xfe ? 'utf16le' : 'utf8').replace(/^\uFEFF/, ''));
const runtimeRoots = ['react', 'react-dom', 'react-router-dom', 'pdf-lib', 'framer-motion', 'react-toastify', 'web-vitals', 'yocto-queue'];
const runtime = new Set();
function resolve(from, name) {
  let dir = from;
  while (dir) {
    const candidate = `${dir}/node_modules/${name}`;
    if (lock.packages[candidate]) return candidate;
    dir = path.posix.dirname(dir);
    if (dir === '.') break;
  }
  const root = `node_modules/${name}`;
  return lock.packages[root] ? root : null;
}
function visit(key) {
  if (!key || runtime.has(key)) return;
  runtime.add(key);
  const pkg = lock.packages[key];
  for (const name of Object.keys({ ...pkg.dependencies, ...pkg.optionalDependencies, ...pkg.peerDependencies })) visit(resolve(key, name));
}
runtimeRoots.forEach(name => visit(`node_modules/${name}`));
const entries = Object.entries(audit.vulnerabilities).map(([name, v]) => ({
  name, severity: v.severity, nodes: v.nodes, range: v.range, via: v.via,
  fixAvailable: v.fixAvailable, runtimeReachable: v.nodes.some(n => runtime.has(n)),
}));
fs.writeFileSync(path.join(__dirname, 'triagem.json'), JSON.stringify({
  runtimeRoots, criterion: 'Alcance transitivo pelo lockfile; não comprova entrega ao browser, tree shaking ou exploração. Demais nós são tooling ou não alcançados pelos roots examinados.',
  counts: audit.metadata.vulnerabilities, entries,
}, null, 2));
console.log(JSON.stringify({ runtimeReachable: entries.filter(e => e.runtimeReachable).map(e => e.name), total: entries.length }));
