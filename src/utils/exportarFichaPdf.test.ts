import fs from 'fs';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { exportarFichaPdf } from './exportarFichaPdf';
import { Ficha } from '../api/fichaPersonagem/FichaPersonagem';
import { Efeitos } from '../api/classesPrincipais/Efeitos';
import { Atributos } from '../api/classesPrincipais/Atributos.class';

test('PDF generation includes talent choices and granted spells after a JSON import',async()=>{
  const template=Uint8Array.from(fs.readFileSync(`${process.cwd()}/public/ficha-de-personagem-dd-5e.pdf`));
  const originalFetch=global.fetch;
  global.fetch=jest.fn(async()=>({ok:true,arrayBuffer:async()=>template.buffer})) as any;
  const originalCreate=URL.createObjectURL;
  const originalRevoke=URL.revokeObjectURL;
  URL.createObjectURL=jest.fn(()=>'blob:test');URL.revokeObjectURL=jest.fn();
  const click=jest.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  const desenhar=jest.spyOn(PDFPage.prototype,'drawText');
  const salvar=jest.spyOn(PDFDocument.prototype,'save');
  try {
    let ficha=new Ficha({levelTotal:1,nomePersonagem:'Teste 2024',atributosPersonagem:new Atributos(),magiasEscolhidas:[{classe:'Mago',magia:['Bola de Fogo']}]});
    const efeito=new Efeitos();efeito.level=1;efeito.tituloEfeito='origem';efeito.talento='2024: Iniciado em Magia';efeito.escolhasTalento={lista:['Mago'],conjuracao:['carisma'],truques:['2024: Luz','2024: Mãos Mágicas'],magias:['2024: Alarme']};ficha.setEfeitos(efeito);
    ficha=new Ficha(JSON.parse(JSON.stringify(ficha)));
    await exportarFichaPdf(ficha);
    const texto=desenhar.mock.calls.map(c=>c[0]).join('\n');
    expect(texto).toContain('2024: Iniciado');
    expect(texto).toContain('2024: Alarme');
    expect(texto).toContain('Bola de Fogo');
    expect(texto).toContain('carisma');
    const bytes=await salvar.mock.results[0].value;
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(3);
    expect(click).toHaveBeenCalled();
  } finally {
    global.fetch=originalFetch;URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke;
    click.mockRestore();desenhar.mockRestore();salvar.mockRestore();
  }
});
