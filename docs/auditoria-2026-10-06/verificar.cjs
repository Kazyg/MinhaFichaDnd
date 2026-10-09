// Verificações da auditoria: somente dados sintéticos, sem alterar src ou armazenamento real.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');
const root = path.resolve(__dirname, '../..');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText, f);
for (const ext of ['.css','.png','.jpg','.svg']) require.extensions[ext] = m => {m.exports='asset';};
const from = f => require(path.join(root, 'src', f));
const read = f => fs.readFileSync(path.join(root, 'src', f), 'utf8');
function extract(file, name, context = {}) {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let found;
  function visit(n) {if ((ts.isFunctionDeclaration(n) || ts.isVariableDeclaration(n)) && n.name?.getText(source) === name && !found) found = n; ts.forEachChild(n,visit);}
  visit(source);
  if (!found) throw Error('Não encontrado: '+file+' '+name);
  const code = ts.isFunctionDeclaration(found) ? found.getText(source) : 'const '+found.getText(source)+';';
  const js = ts.transpileModule(code, {compilerOptions:{target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React}}).outputText;
  return vm.runInNewContext(js+'\n'+name, context);
}
const {Ficha} = from('api/fichaPersonagem/FichaPersonagem.ts');
const {Atributos} = from('api/classesPrincipais/Atributos.class.ts');
const {Efeitos} = from('api/classesPrincipais/Efeitos.ts');
const utils = from('api/fichaPersonagem/fichaEfeitosUtils.ts');
const {getRulesetData} = from('api/rulesets/getRulesetData.ts');
const {CavaleiroArcano} = from('api/classesClassesNetos/CavaleiroArcano.ts');
const {CavaleiroMistico2024} = from('api/classesClassesNetos/CavaleiroMistico2024.ts');
const {TrapaceiroArcano} = from('api/classesClassesNetos/TrapaceiroArcano.ts');
const {TrapaceiroArcano2024} = from('api/classesClassesNetos/TrapaceiroArcano2024.ts');
const spellFile='pages/components/components_inventario/AbaMagias.tsx';
const classTypes={};
for (const [file, name] of [['Bardo','Bardo'],['Bruxo','Bruxo'],['Clerigo','Clerigo'],['Druida','Druida'],['Feiticeiro','Feiticeiro'],['Lutador','Lutador'],['Rogue','Rogue'],['Mago','Mago'],['Paladino','Paladino'],['Ranger','Ranger'],['Bardo2024','Bardo2024'],['Bruxo2024','Bruxo2024'],['Clerigo2024','Clerigo2024'],['Druida2024','Druida2024'],['Feiticeiro2024','Feiticeiro2024'],['Lutador2024','Lutador2024'],['Ladino2024','Ladino2024'],['Mago2024','Mago2024'],['Paladino2024','Paladino2024'],['Ranger2024','Ranger2024']]) Object.assign(classTypes,from('api/classesClassesFilhos/'+file+'.class.ts'));
const rows=[];
function check(id, action){try {rows.push({id,...action()});} catch(e){rows.push({id,error:e.message});}}
function character(version, levels) {
  const data=getRulesetData(version);
  let next=1;
  const multiclasses=levels.map(([name,n])=>({id:name,classe:data.classes.find(c=>c.nome===name),nivelClasse:n,nivelEscolhido:Array.from({length:n},()=>next++)}));
  return new Ficha({versaoRegras:version,levelTotal:next-1,multiclasses,classePrincipal:multiclasses[0].classe,atributosPersonagem:new Atributos(16,14,14,16,10,14)});
}
check('V01-modificadores-proficiencia',()=>{const f=new Ficha();return {actual:[8,9,10,15,20].map(n=>f.calcularModificador(n)),proficiency:[1,4,5,9,13,17,20].map(n=>{f.setLevelTotal(n);return f.proeficiencia;}),expected:[-1,-1,0,2,5]};});
check('V02-edicao-roundtrip-prototipos',()=>{const f=character('DND_2024',[['Guerreiro',3]]);const sub=new CavaleiroMistico2024();f.setSubClasse(f.classePrincipal,sub);const ef=new Efeitos();f.setEfeitos(ef);const re=new Ficha(JSON.parse(JSON.stringify(f)));return {edition:re.versaoRegras,legacyDefault:new Ficha({}).versaoRegras,invalidEdition:new Ficha({versaoRegras:'INVALID'}).versaoRegras,attributeMethod:typeof re.atributosPersonagem.somarAtributo,effectMethod:typeof re.efeitos[0].setLevel,subclassInstance:re.subClasse[0].subclasse instanceof CavaleiroMistico2024};});
for (const [version,levels,expected] of [['DND_2014',[['Guerreiro',3]],[]],['DND_2024',[['Paladino',1]],[2]],['DND_2014',[['Paladino',3]],[3]],['DND_2024',[['Paladino',3]],[3]],['DND_2024',[['Mago',1],['Paladino',1]],[3]],['DND_2014',[['Mago',1],['Paladino',2]],[3]],['DND_2024',[['Bruxo',3]],['pacto: 2 espaços de nível 2']],['DND_2014',[['Mago',5]],[4,3,2]]]) check('V03-espacos-'+version+'-'+JSON.stringify(levels),()=>{
  const ficha=character(version,levels);const context={ficha,CavaleiroArcano,CavaleiroMistico2024,TrapaceiroArcano,TrapaceiroArcano2024};context.tabelaConjuradores=extract(spellFile,'tabelaConjuradores');extract(spellFile,'calcularEspacosMagia',context)();return {actual:ficha.espacosMagiaTotais,expected};
});
for(const version of ['DND_2014','DND_2024'])check('V04-ASI-'+version,()=>({classes:getRulesetData(version).classes.map(c=>({name:c.nome,level4:c.niveis.find(n=>n.nivel===4).caracteristicas,uiRecognizes:c.niveis.find(n=>n.nivel===4).caracteristicas.includes('Incremento no Valor de Habilidade')}))}));
check('V05-preparacao-mago2014',()=>{const ficha=character('DND_2014',[['Mago',1]]);const ctx={ficha,...classTypes,CavaleiroArcano,CavaleiroMistico2024,TrapaceiroArcano,TrapaceiroArcano2024,calcularModificador:ficha.calcularModificador};ctx.hidratarClasse=extract(spellFile,'hidratarClasse',ctx);extract(spellFile,'calcularMagiasConhecidas',ctx)();return {actual:ficha.magiasConhecidas,expected:4};});
check('V06-magia-nivel9-no-nivel1',()=>{const ficha=character('DND_2014',[['Mago',1]]);ficha.magiasConhecidas=[{classe:'Mago',magias:4}];const validate=extract(spellFile,'validarMagiaEscolhida',{ficha,calcularMagiasConhecidas:()=>{},toast:{error:()=>{}}});return {actual:validate({nome:'Desejo',nivel:9,tipo:'conjuração'},['Mago']),expected:'rejeitar'};});
check('V07-truques-contam-magias',()=>{const ficha=character('DND_2014',[['Mago',1]]);ficha.magiasConhecidas=[{classe:'Mago',magias:4}];ficha.truquesConhecidos=[{classe:'Mago',magias:3}];ficha.magiasEscolhidas=[{classe:'Mago',magia:['Armadura Arcana','Escudo Arcano','Mísseis Mágicos']}];const validate=extract(spellFile,'validarMagiaEscolhida',{ficha,calcularMagiasConhecidas:()=>{},toast:{error:()=>{}}});return {actual:validate({nome:'Luz',nivel:0,tipo:'evocação'},['Mago']),expected:'permitir primeiro truque'};});
check('V08-iniciativa-apos-bonus',()=>{const f=new Ficha();f.setAtributosPersonagem(new Atributos(10,14,10,10,10,10));f.atributosPersonagem.somarAtributo('destreza',2);return {dex:f.atributosPersonagem.destreza.valor,initiative:f.iniciativa,expected:3};});
check('V09-PV-guerreiro5-pdf',()=>{const ficha=character('DND_2014',[['Guerreiro',5]]);const calculate=extract('pages/components/components_InformacoesPersonagem/ModalVida.tsx','calcularVida',{calcularValorAtributoFinal:utils.calcularValorAtributoFinal,calcularModificador:ficha.calcularModificador});return {display:calculate(ficha),pdfField:ficha.vidaTotal??0,expected:44};});
check('V10-multiclasse-nomes',()=>{const ficha=character('DND_2024',[['Mago',1]]);ficha.atributosPersonagem=new Atributos(16,16,16,16,16,16);const classesDisponiveis=getRulesetData('DND_2024').classes;const actual=extract('leveis/NivelBlock.tsx','classesPermitidas',{ficha,classesDisponiveis,getAtributo:a=>a?.valor??0});return {available:actual.map(c=>c.nome),missing:classesDisponiveis.filter(c=>!actual.includes(c)).map(c=>c.nome)};});
check('V11-CA-sem-treino',()=>{const ficha=character('DND_2014',[['Mago',1]]);ficha.ArmaduraEquipada={categoria:'Armadura Pesada',ac:18};const ui=extract('pages/components/InformacoesPersonagem.tsx','calcularCA',{ficha,calcularModificador:ficha.calcularModificador,calcularAtributo:()=>14,calcularBonusCAItens:utils.calcularBonusCAItens,proficienciaArmaduraLeve:false,proficienciaArmaduraMedia:false,proficienciaArmaduraPesada:false,proficienciaEscudos:false});const pdf=extract('utils/exportarFichaPdf.ts','calcularCA',{calcularModificador:ficha.calcularModificador,...utils});return {ui:ui(),pdf:pdf(ficha),expected2014:18};});
check('V12-subclasse-duplicada',()=>{const ficha=character('DND_2024',[['Guerreiro',3]]);const classes=getRulesetData('DND_2024').classes;const c=classes.find(c=>c.nome==='Guerreiro');ficha.setSubClasse(c,c.subClasse[0]);ficha.setSubClasse(c,c.subClasse[1]);return {stored:ficha.subClasse.map(s=>s.subclasse.nome),display:ficha.subClasse.find(s=>s.classe.nome===c.nome).subclasse.nome};});
check('V13-remocao-nivel5-perde-subclasse',()=>{const ficha=character('DND_2024',[['Guerreiro',5]]);ficha.setSubClasse(ficha.classePrincipal,ficha.classePrincipal.subClasse[0]);const choose=extract('pages/components/CriacaoFicha.tsx','selecionarMulticlasse',{ficha,Multiclasses:from('api/classesPrincipais/Multiclasses.ts').Multiclasses,Efeitos,validaSubClasse:(_,n)=>n===3});choose(getRulesetData('DND_2024').classes.find(c=>c.nome==='Mago'),5);return {fighterLevel:ficha.multiclasses.find(m=>m.classe.nome==='Guerreiro').nivelClasse,subclasses:ficha.subClasse,expected:'manter subclasse de Guerreiro nível 4'};});
check('V14-regex-atributo-ingles',()=>({effects:utils.extrairEfeitosDoItem({id:'synthetic',nome:'Synthetic',descricao:'Your Strength score increases by 2.'}).map(e=>({attribute:e.atributo,bonus:e.bonus})),expected:[{attribute:'forca',bonus:2}]}));
check('V15-pdf-niveis',()=>{const ficha=character('DND_2014',[['Guerreiro',3],['Mago',2]]);return {actual:extract('utils/exportarFichaPdf.ts','obterNivelClasses',{normalizarLista:values=>values.filter(Boolean)})(ficha),expected:'Guerreiro 3 | Mago 2'};});
const {JSDOM}=require('jsdom');const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://audit.local'});global.window=dom.window;global.document=dom.window.document;global.localStorage=dom.window.localStorage;global.HTMLElement=dom.window.HTMLElement;global.navigator=dom.window.navigator;
const React=require('react');const {render,act,cleanup}=require('@testing-library/react');const {FichaProvider,useFicha}=from('api/fichaPersonagem/FichaContext.tsx');let ctx;function Probe(){ctx=useFicha();return null;}
check('V16-storage-corrompido',()=>{localStorage.clear();localStorage.setItem('fichas','[{broken');const original=console.error;console.error=()=>{};try{render(React.createElement(FichaProvider,null,React.createElement(Probe)));return {before:'[{broken',after:localStorage.getItem('fichas'),expected:'preservar original'};}finally{console.error=original;cleanup();}});
check('V17-salvamento-mutacao',()=>{localStorage.clear();render(React.createElement(FichaProvider,null,React.createElement(Probe)));act(()=>ctx.salvarFicha(new Ficha({nomePersonagem:'Antes'})));act(()=>{ctx.ficha.setNomePersonagem('Depois');ctx.forceUpdate();});const before=JSON.parse(localStorage.getItem('fichas'))[0].nomePersonagem;act(()=>ctx.salvarFicha(ctx.ficha));const after=JSON.parse(localStorage.getItem('fichas'))[0].nomePersonagem;cleanup();return {afterEdit:before,afterExplicitSave:after};});
check('V18-idiomas-reabertura-dom',()=>{localStorage.clear();const f=character('DND_2024',[['Guerreiro',1]]);const rules=getRulesetData('DND_2024');f.racaPrincipal=rules.racasOuEspecies.find(r=>r.nome==='Humano');f.backGround=rules.backgroundsOuOrigens.find(b=>b.nome==='Soldado');f.idiomas=['Comum','Élfico','Anão'];localStorage.setItem('fichas',JSON.stringify([f]));localStorage.setItem('ficha',f.id);const Component=from('pages/components/CriacaoFicha.tsx').default;const original=console.error;console.error=()=>{};try{const rendered=render(React.createElement(FichaProvider,null,React.createElement(Probe),React.createElement(Component)));const text=rendered.container.textContent;return {stored:f.idiomas,asksAgain:text.includes('Selecionar Idioma 1'),levelOneSetupVisible:text.includes('Método de distribuição'),expected:'idiomas e edição restaurados'};}finally{console.error=original;cleanup();}});
fs.writeFileSync(path.join(__dirname,'cenarios.json'),JSON.stringify(rows,null,2));
console.log(JSON.stringify(rows,null,2));
dom.window.close();
