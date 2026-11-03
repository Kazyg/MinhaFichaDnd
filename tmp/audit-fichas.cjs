const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const roots = ['src/api', 'src/bibliotecas', 'src/leveis'];
const files = roots.flatMap(function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.test\.[jt]sx?$/.test(e.name) ? [`${dir}/${e.name}`] : []); });
const weaknesses = {
 'src/api/rulesets/custos.test.js:16': ['Conta chamadas a magias e talentos em três etapas reais, mas só valida as contagens de magias; regressão no catálogo de talentos passaria. Spies só são restaurados no sucesso.', 'Verificar contagens de talentos e restaurar spies em finally.'],
 'src/api/fichaPersonagem/FichaContext.test.js:41': ['Confirma limite 4999/5000 ms e conteúdo persistido, mas não avança outro intervalo depois do primeiro save; não demonstra a ausência de repetição anunciada.', 'Avançar novo intervalo após salvar e exigir uma única gravação.'],
 'src/api/fichaPersonagem/FichaContext.test.js:122': ['StrictMode preserva uma ficha e o legado, mas não verifica quantas vezes a inicialização/migração é executada; deduplicação dos dados não prova deduplicação das operações.', 'Instrumentar chamadas se inicialização única for contrato; preservar verificações reais de dados.'],
 'src/api/fichaPersonagem/fichasIndexedDB.test.ts:47': ['Exercita isolamento de inválidos e IDs duplicados, porém os dados não incluem campos maliciosos apesar do título.', 'Incluir campo __proto__ vindo de JSON e provar que o registro é isolado sem poluição.'],
 'src/api/fichaPersonagem/fichaSerialization.test.js:6': ['Verifica tipos, IDs, não finitos, tamanho e referências; nenhuma entrada ultrapassa a profundidade máxima declarada no título.', 'Incluir árvore com profundidade maior que 60 e exigir rejeição específica.'],
 'src/api/fichaPersonagem/progressao.test.js:142': ['As recusas retornam false, mas a última asserção testa apenas a string constante base; uma recusa que alterasse atributos continuaria passando.', 'Comparar atributos antes e depois de cada recusa; após o caso válido capturar nova base.'],
 'src/api/fichaPersonagem/conteudoVersionado.test.js:220': ['Rejeita referência malformada e escolhas inválidas, mas não inclui revisão desconhecida válida nem verifica pendência, apesar do título.', 'Adicionar roundtrip válido com revisão futura, snapshot preservado e benefício inativo.'],
 'src/api/fichaPersonagem/fichaSeletores.test.js:162': ['Gera PDF real e confere paginação/texto/coordenadas, mas substitui global.fetch sem restauração e só restaura drawText quando todas as asserções passam.', 'Restaurar fetch e spy em finally para isolar falhas.'],
 'src/api/fichaPersonagem/fichaRestauracao.test.js:155': ['Fluxo real verifica mudanças e persistência mobile, porém innerWidth só é restaurado no sucesso; uma falha contamina os próximos casos do arquivo.', 'Restaurar largura em afterEach ou finally.'],
 'src/api/fichaPersonagem/catalogoEquipamentosMagicos.test.tsx:185': ['Verifica foco, Escape, clique e conteúdo do tooltip; a interação hover anunciada no título nunca acontece.', 'Exercitar mouseEnter/mouseLeave e preservar verificações de teclado/toque.'],
};
const rows=[];
function visit(node, fn) { if (!node || typeof node !== 'object') return; fn(node); for (const [k,v] of Object.entries(node)) { if (k==='loc') continue; if (Array.isArray(v)) v.forEach(c=>visit(c,fn)); else if(v && typeof v==='object') visit(v,fn); } }
for(const file of files) {
 const src=fs.readFileSync(file,'utf8'); const ast=parser.parse(src,{sourceType:'module',plugins:['typescript','jsx']});
 visit(ast,n=>{
  if(n.type!=='CallExpression' || n.arguments[0]?.type!=='StringLiteral' || !n.arguments.some(a=>a.type==='ArrowFunctionExpression'||a.type==='FunctionExpression')) return;
  const callee=src.slice(n.callee.start,n.callee.end);
  if(!/^(test|it)(\b|\.)/.test(callee))return;
  const callback=n.arguments.find(a=>a.type==='ArrowFunctionExpression'||a.type==='FunctionExpression');
  const assertions=[];
  visit(callback.body,a=>{if(a.type==='ExpressionStatement' && src.slice(a.start,a.end).trimStart().startsWith('expect('))assertions.push(src.slice(a.start,a.end).replace(/\s+/g,' '));});
  const weakness=weaknesses[`${file}:${n.loc.start.line}`];
  const evidence=[...new Set([assertions[0],assertions.at(-1)])].filter(Boolean).join(' ');
  rows.push({file,line:n.loc.start.line,test:n.arguments[0].value,parameter:callee.includes('.each') ? src.slice(n.callee.start,n.callee.end) : null,category:weakness?'B':'A',justification:weakness?weakness[0]:`Protege ${n.arguments[0].value.replace(/%[sdijp#]|\$\w+/g,'[parâmetro]')}. Evidência observável: ${evidence}`,action:weakness?weakness[1]:'Manter',assertions:assertions.length});
 });
}
fs.writeFileSync('tmp/audit-fichas-declarations.json',JSON.stringify(rows,null,2)+'\n');
if(fs.existsSync('tmp/audit-baseline.json')) {
 const run=JSON.parse(fs.readFileSync('tmp/audit-baseline.json','utf8'));
 const expanded=[];
 for(const suite of run.testResults){
  const file=path.relative(process.cwd(),suite.name).replaceAll('\\','/');
  if(!files.includes(file))continue;
  for(const t of suite.assertionResults){
   const matches=rows.filter(r=>r.file===file).filter(r=>{
    const pattern=r.test.split(/(%[sdifjoOp#]|\$[A-Za-z_][\w.]*)/).map(s=>/^(%[sdifjoOp#]|\$[A-Za-z_])/.test(s)?'.*':s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('');
    return new RegExp(`^${pattern}$`).test(t.title);
   });
   if(matches.length!==1)throw new Error(`${file}: ${t.title}: matches ${matches.length}`);
   const r=matches[0];
   const result={...r,test:t.fullName,template:r.test,parameter:r.parameter?t.title:null,status:t.status};
   if(file==='src/leveis/LevelUm.distribuicao.test.js' && t.title.includes('Rolagem de Dados')) {
    result.category='B';
    result.justification='Seleciona rolagem na UI e exige seis números entre 3 e 18; trocar 4d6 descartando o menor por 3d6 continuaria passando.';
    result.action='Fixar sequência de Math.random e exigir a soma dos três maiores dentre quatro dados distintos.';
   }
   expanded.push(result);
  }
 }
 fs.writeFileSync('tmp/audit-fichas.json',JSON.stringify(expanded,null,2)+'\n');
 console.log(JSON.stringify({files:files.length,declarations:rows.length,cases:expanded.length,categories:expanded.reduce((a,r)=>(a[r.category]=(a[r.category]||0)+1,a),{})}));
} else {
 fs.writeFileSync('tmp/audit-fichas.json',JSON.stringify(rows,null,2)+'\n');
 console.log(JSON.stringify({files:files.length,declarations:rows.length,pending:'baseline expansion'}));
}
