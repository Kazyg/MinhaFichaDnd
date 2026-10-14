// CRA's development server is not a production host. Keep its tools local.
const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, [require.resolve('react-scripts/scripts/start')], {
  stdio: 'inherit', env: { ...process.env, HOST: '127.0.0.1' },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
