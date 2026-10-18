declare module 'pdfjs-dist/build/pdf.mjs' {
  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(options: { data: Uint8Array; isEvalSupported: boolean; enableXfa: boolean; useSystemFonts: boolean }): { promise: Promise<import('./pdf').DocumentoPdf> };
}
