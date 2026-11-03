export interface PaginaPdf {
  getViewport(options: { scale: number }): { width: number; height: number };
  render(options: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }): { promise: Promise<void>; cancel(): void };
  getTextContent(): Promise<{ items: unknown[] }>;
}
export interface DocumentoPdf { numPages: number; getPage(n: number): Promise<PaginaPdf>; destroy(): Promise<void> }
export interface TrechoPagina { texto: string; x: number; y: number; largura: number; altura: number; confianca?: number }
export interface TextoPagina { largura: number; altura: number; trechos: TrechoPagina[] }
export async function extrairPaginasPdf(blob: Blob, signal?: AbortSignal): Promise<TextoPagina[]> {
  const documento = await abrirPdf(blob);
  try {
    const paginas: TextoPagina[] = [];
    for (let n = 1; n <= Math.min(documento.numPages, 3); n++) {
      if (signal?.aborted) throw new Error('Processamento cancelado.');
      const pagina = await documento.getPage(n);
      const viewport = pagina.getViewport({ scale: 1 });
      const conteudo = await pagina.getTextContent();
      const trechos = conteudo.items.slice(0, 10000).flatMap(item => {
        const dado = item as { str?: string; transform?: number[]; width?: number; height?: number };
        if (!dado.str?.trim() || !dado.transform) return [];
        return [{ texto: dado.str.trim(), x: dado.transform[4], y: viewport.height - dado.transform[5] - (dado.height || 10), largura: dado.width || 1, altura: dado.height || 10 }];
      });
      paginas.push({ largura: viewport.width, altura: viewport.height, trechos });
    }
    return paginas;
  } finally { await documento.destroy(); }
}
export async function rasterizarPaginaPdf(blob: Blob, numero = 1, maxLado = 2200, signal?: AbortSignal): Promise<{ canvas: HTMLCanvasElement; largura: number; altura: number; numPaginas: number }> {
  const documento = await abrirPdf(blob);
  let canvas: HTMLCanvasElement | undefined;
  try {
    if (signal?.aborted) throw new Error('Processamento cancelado.');
    if (!Number.isSafeInteger(numero) || numero < 1 || numero > documento.numPages) throw new Error('Página inválida.');
    const pagina = await documento.getPage(numero);
    const original = pagina.getViewport({ scale: 1 });
    const viewport = pagina.getViewport({ scale: Math.min(3, Math.min(2200, maxLado) / Math.max(original.width, original.height)) });
    canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    const contexto = canvas.getContext('2d'); if (!contexto) throw new Error('Canvas indisponível.');
    const render = pagina.render({ canvasContext: contexto, viewport });
    const cancelar = () => render.cancel(); signal?.addEventListener('abort', cancelar, { once: true });
    try { await render.promise; } finally { signal?.removeEventListener('abort', cancelar); }
    if (signal?.aborted) throw new Error('Processamento cancelado.');
    return { canvas, largura: canvas.width, altura: canvas.height, numPaginas: documento.numPages };
  } catch (erro) { if (canvas) { canvas.width = 0; canvas.height = 0; } throw erro; }
  finally { await documento.destroy(); }
}
export function lerBlob(blob: Blob, texto = false): Promise<ArrayBuffer | string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reader.onabort = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.onload = () => resolve(reader.result as ArrayBuffer | string);
    if (texto) reader.readAsText(blob); else reader.readAsArrayBuffer(blob);
  });
}
export async function abrirPdf(blob: Blob): Promise<DocumentoPdf> {
  const motor = await import('./pdfMotor');
  return motor.carregarPdf(new Uint8Array(await lerBlob(blob) as ArrayBuffer));
}

export async function extrairTextoPdf(blob: Blob): Promise<string> {
  const documento = await abrirPdf(blob);
  try {
    const trechos: string[] = [];

    for (let n = 1; n <= Math.min(documento.numPages, 5); n++) {
      const pagina = await documento.getPage(n);
      const texto = await pagina.getTextContent();
      trechos.push(texto.items.map(item => item && typeof item === 'object' && 'str' in item
        ? `${String(item.str)}${'hasEOL' in item && item.hasEOL ? '\n' : ' '}` : '').join('').slice(0, 100_000));
    }
    return trechos.join('\n');
  } finally { await documento.destroy(); }
}
