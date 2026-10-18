import { gerarRetrato, sugerirRecorte } from './retratos';
let contexto: jest.SpyInstance;
const drawImage=jest.fn();
beforeEach(()=>{contexto=jest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage,getImageData:()=>({data:new Uint8ClampedArray(80*80*4)})} as unknown as CanvasRenderingContext2D);drawImage.mockClear();});
afterEach(()=>jest.restoreAllMocks());
test('recorta coordenadas exatas, limita retrato a 1024px e preserva canvas original',async()=>{
  const cryptoAnterior=Object.getOwnPropertyDescriptor(globalThis,'crypto');
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:{randomUUID:()=> 'retrato'}});
  try{
    jest.spyOn(HTMLCanvasElement.prototype,'toBlob').mockImplementation(callback=>callback(new Blob(['PNG'],{type:'image/png'})));
    const original=document.createElement('canvas');original.width=2200;original.height=1400;
    const retrato=await gerarRetrato(original,{x:50,y:0,largura:50,altura:50},'campanha');
    expect(drawImage).toHaveBeenCalledWith(original,1100,0,1100,700,0,0,1024,652);
    expect(retrato).toMatchObject({id:'retrato',campanhaId:'campanha',mime:'image/png',tamanho:3});
    expect(original.width).toBe(2200);expect(original.height).toBe(1400);
  }finally{if(cryptoAnterior)Object.defineProperty(globalThis,'crypto',cryptoAnterior);}
});
test.each([{x:-1,y:0,largura:40,altura:40},{x:80,y:0,largura:40,altura:40},{x:0,y:0,largura:0,altura:40}])('rejeita área inválida sem gerar arquivo: %j',async area=>{
  await expect(gerarRetrato(document.createElement('canvas'),area,'c')).rejects.toThrow('área válida');
  expect(drawImage).not.toHaveBeenCalled();
});
test('sugere região colorida isolada e não considera página vazia como ilustração',()=>{
  expect(sugerirRecorte(document.createElement('canvas'))).toBeNull();
  const data=new Uint8ClampedArray(80*80*4);
  for(let y=5;y<40;y++)for(let x=40;x<75;x++){const i=(y*80+x)*4;data.set([100,180,50,255],i);}
  contexto.mockReturnValue({drawImage,getImageData:()=>({data})});
  expect(sugerirRecorte(document.createElement('canvas'))).toMatchObject({x:48.75,y:5,largura:46.25,altura:46.25});
});
