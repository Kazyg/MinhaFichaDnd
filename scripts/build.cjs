const { spawnSync } = require('node:child_process');
const path = require('node:path');

const output = path.resolve(process.env.BUILD_PATH || 'build');
function run(script, args = []) {
  const result = spawnSync(process.execPath, [require.resolve(script), ...args], {
    stdio: 'inherit', env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run('react-scripts/scripts/build');
run('javascript-obfuscator/bin/javascript-obfuscator', [output, '--output', output,
  '--compact', 'true', '--control-flow-flattening', 'true']);
