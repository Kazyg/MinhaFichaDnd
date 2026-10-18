import { DocumentoPdf } from './pdf';
// Este módulo e o worker só são baixados quando um documento PDF é aberto.
export async function carregarPdf(data: Uint8Array): Promise<DocumentoPdf> {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  return pdfjs.getDocument({ data, isEvalSupported: false, enableXfa: false, useSystemFonts: true }).promise;
}
