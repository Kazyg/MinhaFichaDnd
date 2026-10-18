
const fs = require('node:fs');
const path = require('node:path');
const destino = path.resolve(__dirname, '../public/ocr');
function copiar(origem, nome) {
  const alvo = path.join(destino, nome);
  fs.mkdirSync(path.dirname(alvo), { recursive: true });
  if (!fs.existsSync(alvo) || !fs.readFileSync(alvo).equals(fs.readFileSync(origem))) fs.copyFileSync(origem, alvo);
}
const tesseract = path.dirname(require.resolve('tesseract.js/package.json'));
const core = path.dirname(require.resolve('tesseract.js-core/package.json'));
copiar(path.join(tesseract, 'dist/worker.min.js'), 'worker.min.js');
copiar(path.join(tesseract, 'dist/worker.min.js.LICENSE.txt'), 'worker.LICENSE.txt');
copiar(path.join(core, 'LICENSE'), 'core/LICENSE.txt');
for (const variante of ['lstm', 'simd-lstm', 'relaxedsimd-lstm']) {
  const nome = `tesseract-core-${variante}.wasm.js`;
  copiar(path.join(core, nome), `core/${nome}`);
}
for (const idioma of ['eng', 'por']) {
  const pacote = path.dirname(require.resolve(`@tesseract.js-data/${idioma}/package.json`));
  copiar(path.join(pacote, `4.0.0_best_int/${idioma}.traineddata.gz`), `lang/${idioma}.traineddata.gz`);
  copiar(path.join(pacote, 'README.md'), `lang/${idioma}.README.md`);
}
