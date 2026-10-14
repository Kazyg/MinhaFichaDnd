const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const out = __dirname;
function run(name, script, args, env = {}) {
  const log = fs.openSync(path.join(out, name + '.log'), 'wx');
  const r = spawnSync(process.execPath, [script, ...args], { stdio: ['ignore', log, log], env: { ...process.env, ...env } });
  fs.closeSync(log); fs.writeFileSync(path.join(out, name + '.exit.txt'), String(r.status ?? 1));
  if (r.error || r.status) throw r.error ?? Error(name + ': ' + r.status);
}
const final = fs.mkdtempSync(path.join(os.tmpdir(), 'minhaficha-pendencias-final-'));
fs.writeFileSync(path.join(out, 'build-final-path.txt'), final);
run('build-final', require.resolve('react-scripts/scripts/build'), [], { BUILD_PATH: final, NODE_OPTIONS: '--trace-deprecation' });
const before = fs.readFileSync(path.join(out, 'build-before-path.txt'), 'utf16le').replace(/^\uFEFF/, '').trim();
const paths = { intermediate: before, final };
for (const [name, dir] of Object.entries(paths)) {
  const measure = spawnSync(process.execPath, ['docs/auditoria-2026-10-06/A25-medir.cjs', dir], { encoding: 'utf8' });
  fs.writeFileSync(path.join(out, 'bundle-' + name + '.json'), measure.stdout);
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'minhaficha-pendencias-cli-'));
  fs.cpSync(dir, copy, { recursive: true });
  fs.writeFileSync(path.join(out, 'build-' + name + '-obfuscated-path.txt'), copy);
  run('obfuscation-' + name, require.resolve('javascript-obfuscator/bin/javascript-obfuscator'), [copy, '--output', copy, '--compact', 'true', '--control-flow-flattening', 'true', '--seed', '25']);
  const m = spawnSync(process.execPath, ['docs/auditoria-2026-10-06/A25-medir.cjs', copy], { encoding: 'utf8' });
  fs.writeFileSync(path.join(out, 'bundle-' + name + '-obfuscated.json'), m.stdout);
}
console.log(paths);
