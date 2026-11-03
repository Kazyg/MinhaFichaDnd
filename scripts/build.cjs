const { spawnSync } = require('node:child_process');
const path = require('node:path');
require('./prepare-ocr.cjs');

const output = path.resolve(process.env.BUILD_PATH || 'build');
function run(script, args = []) {
  const result = spawnSync(process.execPath, [require.resolve(script), ...args], {
    stdio: 'inherit', env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run('react-scripts/scripts/build');
// Control-flow flattening pode descartar argumentos de fetch(...arguments).
// A verificação do build executa o SDK final para detectar essa regressão.
run('javascript-obfuscator/bin/javascript-obfuscator', [output, '--output', output,
  '--compact', 'true', '--control-flow-flattening', 'false',

  '--exclude', `${output.replace(/\\/g, '/')}/ocr/**`]);
