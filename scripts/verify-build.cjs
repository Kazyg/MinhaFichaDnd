const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// A unique directory prevents CRA's cleanup from touching an existing build.
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'minhafichadnd-build-'));
console.log(`Build descartável: ${output}`);
try {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'build.cjs')], {
    stdio: 'inherit', env: { ...process.env, BUILD_PATH: output },
  });
  if (result.error) throw result.error;
  process.exitCode = result.status || (result.signal ? 1 : 0);
} finally {
  fs.rmSync(output, { recursive: true, force: true });
}
