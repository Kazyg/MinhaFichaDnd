const fs=require('fs'),path=require('path');
const root=process.cwd(), ts=require(path.join(root,'node_modules/typescript'));
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2017,esModuleInterop:true}}).outputText,f);
const {Ficha}=require(path.join(root,'src/api/fichaPersonagem/FichaPersonagem.ts'));
const {exportFicha,parseImport}=require(path.join(root,'src/api/fichaPersonagem/fichaStorage.ts'));
const {gerarFichaPdf}=require(path.join(root,'src/utils/exportarFichaPdf.ts'));
const {PDFPage}=require(path.join(root,'node_modules/pdf-lib'));
const {getTalentosConteudo,getMagiasConteudo}=require(path.join(root,'src/api/rulesets/conteudo.ts'));
global.fetch=async()=>({ok:true,arrayBuffer:async()=>Uint8Array.from(fs.readFileSync(path.join(root,'public/ficha-de-personagem-dd-5e.pdf'))).buffer});
(async()=>{
 const output={catalogs:[],pdf:[]};
 for(const ed of ['DND_2014','DND_2024']){
 output.catalogs.push({ed,feats:getTalentosConteudo(ed).filter(t=>t.suportado).map(t=>t.nome),spells:getMagiasConteudo(ed).length});
 const f=new Ficha({id:'review-'+ed,versaoRegras:ed,nomePersonagem:'Revisão sintética',levelTotal:1,recursos:{slots:{},morte:{sucessos:2,falhas:1}}});
 const restored=parseImport(exportFicha(f));
 const texts=[],draw=PDFPage.prototype.drawText;
 PDFPage.prototype.drawText=function(text,...rest){texts.push(text);return draw.call(this,text,...rest);};
 try{await gerarFichaPdf(restored);}finally{PDFPage.prototype.drawText=draw;}
 output.pdf.push({ed,deathAfterRoundtrip:restored.recursos.morte,deathText:texts.filter(t=>/morte/i.test(t)),drawnTexts:texts.length});
 }
 console.log(JSON.stringify(output,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});

