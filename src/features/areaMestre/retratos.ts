import { AnexoCampanha } from './modelos';
export interface AreaRecorte { x: number; y: number; largura: number; altura: number }
export async function carregarImagemRecorte(anexo: AnexoCampanha, signal?: AbortSignal): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(anexo.arquivo);
  try {
    const imagem = new Image();
    await new Promise<void>((resolve, reject) => {
      const abortar = () => { imagem.src = ''; reject(new Error('Processamento cancelado.')); };
      const terminar = (erro?: Error) => { signal?.removeEventListener('abort', abortar); erro ? reject(erro) : resolve(); };
      imagem.onload = () => terminar(); imagem.onerror = () => terminar(new Error('Não foi possível decodificar a imagem.'));
      signal?.addEventListener('abort', abortar, { once: true });
      if (signal?.aborted) abortar(); else imagem.src = url;
    });
    if (!imagem.naturalWidth || !imagem.naturalHeight || imagem.naturalWidth * imagem.naturalHeight > 50_000_000) throw new Error('A imagem excede o limite de resolução (50 megapixels).');
    const escala = Math.min(1, 2200 / Math.max(imagem.naturalWidth, imagem.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala)); canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala));
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas indisponível.');
    ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height); return canvas;
  } finally { URL.revokeObjectURL(url); }
}


export function sugerirRecorte(canvas: HTMLCanvasElement): AreaRecorte | null {
  const mini = document.createElement('canvas'); mini.width = 80; mini.height = 80;
  try {
    const ctx = mini.getContext('2d', { willReadFrequently: true }); if (!ctx) return null;
    ctx.drawImage(canvas, 0, 0, 80, 80);
    const pixels = ctx.getImageData(0, 0, 80, 80).data;
    const mascara = new Uint8Array(6400);
    for (let i = 0; i < 6400; i++) { const [r,g,b,a] = pixels.slice(i*4, i*4+4); if (a > 100 && Math.max(r,g,b)-Math.min(r,g,b) > 35 && Math.max(r,g,b) > 60) mascara[i] = 1; }
    const regioes: { x: number; y: number; w: number; h: number; quantidade: number }[] = [];
    for (let i = 0; i < 6400; i++) {
      if (!mascara[i]) continue;
      const fila = [i]; mascara[i] = 0; let minX=80, minY=80, maxX=0, maxY=0, quantidade=0;
      for (let n = 0; n < fila.length; n++) {
        const p=fila[n], x=p%80, y=Math.floor(p/80); quantidade++; minX=Math.min(minX,x); maxX=Math.max(maxX,x); minY=Math.min(minY,y); maxY=Math.max(maxY,y);
        for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx=x+dx,ny=y+dy,indice=ny*80+nx; if(nx>=0&&nx<80&&ny>=0&&ny<80&&mascara[indice]){mascara[indice]=0;fila.push(indice);} }
      }
      const w=maxX-minX+1,h=maxY-minY+1;
      if (w>=20&&h>=15&&w*h>=960&&w*h<4800&&quantidade/(w*h)>.5) regioes.push({x:minX,y:minY,w,h,quantidade});
    }
    regioes.sort((a,b)=>b.quantidade-a.quantidade);
    if (!regioes.length || (regioes[1] && regioes[1].quantidade>regioes[0].quantidade*.5)) return null;
    const r=regioes[0]; return {x:Math.max(0,(r.x-1)/80*100),y:Math.max(0,(r.y-1)/80*100),largura:Math.min(80-r.x,r.w+2)/80*100,altura:Math.min(80-r.y,r.h+2)/80*100};
  } catch { return null; } finally { mini.width=0; mini.height=0; }
}

export async function gerarRetrato(canvas: HTMLCanvasElement, area: AreaRecorte, campanhaId: string): Promise<AnexoCampanha> {
  const {x,y,largura,altura}=area;
  if (![x,y,largura,altura].every(Number.isFinite)||x<0||y<0||largura<=0||altura<=0||x+largura>100.001||y+altura>100.001) throw new Error('Selecione uma área válida dentro da página.');
  const origemW=canvas.width*largura/100,origemH=canvas.height*altura/100;
  if (origemW<2||origemH<2) throw new Error('O recorte é pequeno demais.');
  const escala=Math.min(1,1024/Math.max(origemW,origemH));
  const saida=document.createElement('canvas'); saida.width=Math.max(1,Math.round(origemW*escala));saida.height=Math.max(1,Math.round(origemH*escala));
  try {
    const ctx=saida.getContext('2d'); if(!ctx)throw new Error('Canvas indisponível.');
    ctx.drawImage(canvas,canvas.width*x/100,canvas.height*y/100,origemW,origemH,0,0,saida.width,saida.height);
    const arquivo=await new Promise<Blob>((resolve,reject)=>saida.toBlob(blob=>blob?resolve(blob):reject(new Error('Não foi possível gerar o retrato.')),'image/png'));
    return {id:crypto.randomUUID(),campanhaId,nome:'retrato-recortado.png',mime:'image/png',tamanho:arquivo.size,arquivo};
  } finally {saida.width=0;saida.height=0;}
}
