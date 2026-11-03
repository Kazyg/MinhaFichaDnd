const fs = require('fs');
const ts = require('typescript');
const dir = 'src/features/areaMestre';
const rows = [];
const special = [
 ['preparacaoCombate', 'referência original existente', 'B', 'O nome promete recusar troca de ficha original, mas só exercita colisões de IDs; adicionar uma troca válida estruturalmente da referência existente.', 'Melhorar cenário de referência trocada'],
 ['execucaoCombate', 'completa todos os turnos incluindo zero', 'B', 'A fixture inicia todos com PV=2; a sequência protege turnos e rodadas, mas não detecta exclusão de participante com zero PV.', 'Definir PV zero antes de iniciar e verificar sua vez'],
 ['useCampanhas', 'falha de listagem', 'B', 'O repositório começa vazio; relistar [] não detecta perda de campanha durante falha de listagem.', 'Semear campanha e verificar sua recuperação após retry'],
 ['pdfFichaJson', 'converte legado mínimo', 'B', 'Verifica ajustes de PV e idempotência, mas a fixture não contém retrato apesar de o nome prometer preservá-lo.', 'Acrescentar retrato associado e verificar vínculo e bytes após conversão'],
 ['preparacaoRoundTrip', 'cancelar seleções', 'E', 'Altera apenas objetos locais de fixture e consulta banco sem chamar produção responsável pela preparação; passaria com confirmarPreparacao defeituosa.', 'Exercitar preparação de rascunho sem commit e verificar isolamento'],
 ['roteiros', 'backup v1', 'A', 'Reescreve versão do ZIP produzido com roteiro legado ainda presente; lerBackup migra texto e restauração remapeia IDs verificando conteúdos.', 'Manter'],
];
for (const name of fs.readdirSync(dir).filter(n => /\.test\.tsx?$/.test(n))) {
 const file = dir+'/'+name, content = fs.readFileSync(file,'utf8');
 const sf = ts.createSourceFile(file,content,ts.ScriptTarget.Latest,true);
 const prod = [...content.matchAll(/from ['"]\.\/([^'"]+)['"]/g)].map(m=>m[1]).filter(m=>!m.startsWith('ui/'));
 function visit(node) {
  if (ts.isCallExpression(node) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
   let each;
   let e = node.expression;
   const plain = ts.isIdentifier(e) && ['test','it'].includes(e.text);
   if (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression) && e.expression.name.text === 'each' && ['test','it'].includes(e.expression.expression.getText(sf))) each=e.arguments[0];
   if (plain || each) {
    const title=node.arguments[0].text;
    const callback=node.arguments[1];
    const assertions=[];
    function find(n) {
     if(ts.isExpressionStatement(n) && /\bexpect\(/.test(n.getText(sf))) assertions.push(n.getText(sf).replace(/\s+/g,' ').slice(0,340));
     ts.forEachChild(n,find);
    }
    if(callback)find(callback);
    if (!assertions.length && callback && ts.isArrowFunction(callback)) assertions.push(callback.body.getText(sf).replace(/\s+/g,' ').slice(0,340));
    let args=each;
    while(args && (ts.isAsExpression(args)||ts.isParenthesizedExpression(args)))args=args.expression;
    const parameters=args&&ts.isArrayLiteralExpression(args)?args.elements.map(a=>a.getText(sf).replace(/\s+/g,' ')):[null];
    const rule=special.find(([f,t])=>name.replace(/\.test\.tsx?$/,'')===f && title.startsWith(t));
    for (const parameter of parameters) rows.push({file,line:sf.getLineAndCharacterOfPosition(node.getStart(sf)).line+1,test:title,parameter,category:rule?.[2]||'A',justification:rule?.[3]||`Contrato de ${prod.join(', ')}: ${title}. Evidência: ${assertions.slice(0,2).join(' ')}`,action:rule?.[4]||'Manter'});
   }
  }
  ts.forEachChild(node,visit);
 }
 visit(sf);
}
fs.writeFileSync('tmp/audit-mestre.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,files:new Set(rows.map(r=>r.file)).size,categories:rows.reduce((a,r)=>(a[r.category]=(a[r.category]||0)+1,a),{})}));
