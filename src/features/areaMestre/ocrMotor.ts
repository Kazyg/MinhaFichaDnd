export async function criarMotor(progresso?: (texto: string) => void) {
  const tesseract = await import('tesseract.js');
  const base = `${process.env.PUBLIC_URL || ''}/ocr`;
  return tesseract.createWorker('por+eng', tesseract.OEM.LSTM_ONLY, {
    workerPath: `${base}/worker.min.js`, corePath: `${base}/core`, langPath: `${base}/lang`,
    gzip: true, workerBlobURL: false, cacheMethod: 'none',
    logger: evento => progresso?.(`Reconhecendo ficha: ${Math.round((evento.progress || 0) * 100)}%`),
  });
}
