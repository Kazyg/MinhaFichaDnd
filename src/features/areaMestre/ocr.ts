import { TextoPagina, TrechoPagina } from './pdf';


export async function reconhecerImagem(entrada: Blob | HTMLCanvasElement, progresso?: (texto: string) => void, signal?: AbortSignal): Promise<TextoPagina> {
  if (signal?.aborted) throw new Error('Processamento cancelado.');
  let canvas: HTMLCanvasElement | undefined;
  let url: string | undefined;
  const limitar = async (): Promise<HTMLCanvasElement> => {
    if (!(entrada instanceof Blob)) return entrada;
    url = URL.createObjectURL(entrada);
    const imagem = new Image();
    await new Promise<void>((resolve, reject) => {
      const concluir = (erro?: Error) => { clearTimeout(limite); signal?.removeEventListener('abort', abortar); imagem.onload = null; imagem.onerror = null; if (erro) { imagem.src = ''; reject(erro); } else resolve(); };
      const abortar = () => concluir(new Error('Processamento cancelado.'));
      const limite = setTimeout(() => concluir(new Error('A leitura da imagem excedeu o tempo permitido.')), 15_000);
      imagem.onload = () => concluir(); imagem.onerror = () => concluir(new Error('Imagem ilegível para reconhecimento.'));
      signal?.addEventListener('abort', abortar, { once: true });
      if (signal?.aborted) abortar(); else imagem.src = url!;
    });
    if (imagem.naturalWidth * imagem.naturalHeight > 80_000_000 || !imagem.naturalWidth || !imagem.naturalHeight) throw new Error('A imagem excede a resolução permitida.');
    const escala = Math.min(1, 2200 / Math.max(imagem.naturalWidth, imagem.naturalHeight));
    canvas = document.createElement('canvas'); canvas.width = Math.ceil(imagem.naturalWidth * escala); canvas.height = Math.ceil(imagem.naturalHeight * escala);
    const contexto = canvas.getContext('2d'); if (!contexto) throw new Error('Canvas indisponível.');
    contexto.fillStyle = '#fff'; contexto.fillRect(0, 0, canvas.width, canvas.height); contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    return canvas;
  };
  let worker: { terminate(): Promise<unknown> } | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let cancelar: (() => void) | undefined;
  let encerrado = false;
  try {
    const imagem = await limitar();
    const motor = await import('./ocrMotor');
    const resultado = await new Promise<TextoPagina>((resolve, reject) => {
      cancelar = () => { encerrado = true; void worker?.terminate(); reject(new Error(signal?.aborted ? 'Processamento cancelado.' : 'O reconhecimento excedeu 90 segundos. Preencha os dados manualmente.')); };
      signal?.addEventListener('abort', cancelar, { once: true }); timeout = setTimeout(cancelar, 90_000);
      if (signal?.aborted) { cancelar(); return; }
      void (async () => {
        const criado = await motor.criarMotor(progresso); worker = criado;
        if (encerrado || signal?.aborted) { await criado.terminate(); throw new Error('Processamento cancelado.'); }
        const reconhecido = await criado.recognize(imagem, {}, { tsv: true });
        const trechos: TrechoPagina[] = [];
        for (const linha of (reconhecido.data.tsv ?? '').split('\n').slice(1, 20001)) {
          const campos = linha.split('\t'); if (campos[0] !== '5' || !campos[11]?.trim()) continue;
          const valores = campos.slice(6, 11).map(Number);
          if (!valores.every(Number.isFinite)) continue;
          trechos.push({ texto: campos.slice(11).join('\t').trim(), x: valores[0], y: valores[1], largura: valores[2], altura: valores[3], confianca: valores[4] });
        }
        resolve({ largura: imagem.width, altura: imagem.height, trechos });
      })().catch(reject);
    });
    return resultado;
  } finally {
    if (timeout) clearTimeout(timeout); if (cancelar) signal?.removeEventListener('abort', cancelar);
    await worker?.terminate(); if (url) URL.revokeObjectURL(url); if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
}
