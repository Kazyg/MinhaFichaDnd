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
  if (process.exitCode === 0) {
    for (const arquivo of ['worker.min.js', 'core/tesseract-core-lstm.wasm.js',
      'core/tesseract-core-simd-lstm.wasm.js', 'core/tesseract-core-relaxedsimd-lstm.wasm.js',
      'lang/eng.traineddata.gz', 'lang/por.traineddata.gz']) {
      const origem = fs.readFileSync(path.join(__dirname, '../public/ocr', arquivo));
      const copia = fs.readFileSync(path.join(output, 'ocr', arquivo));
      if (!origem.equals(copia)) throw new Error(`Asset OCR alterado durante o build: ${arquivo}`);
    }
    console.log('OCR local: worker, kernels e idiomas preservados no build.');
  }
} finally {
  fs.rmSync(output, { recursive: true, force: true });
}
