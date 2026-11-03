const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const run = JSON.parse(fs.readFileSync('tmp/audit-baseline.json','utf8'));
const rows=[];
const weaknesses=[
 ['src/App.test.js','fechar a seleção','A ausência no localStorage não comprova ausência no IndexedDB usado atualmente.','Agora exige coleção IndexedDB vazia após cancelar.'],
 ['src/pages/navegacaoAreas.test.js','falha ao salvar','O caso exercita sair, mas o título também prometia troca de ficha sem executar essa ação.','Título corrigido para o fluxo realmente exercitado; troca bloqueada segue recomendação de integração.'],
 ['src/pages/modals/ModalSelecao.test.js','meio-elfo','Compara atributos restaurados apenas ao objeto selecionado, sem conferir os bônus esperados da escolha.','Exige carisma/destreza/sabedoria com bônus 2/1/1 após round trip.'],
 ['src/pages/modals/ModalSelecao.test.js','humano variante','Ficha compartilhada mutável entre casos pode contaminar escolhas e efeitos.','beforeEach recria Ficha; mantém confirmação e ausência de efeito no rascunho.'],
 ['src/pages/modals/Selecao2024.test.tsx','troca da lista','Só preenche um truque; não detecta magia de primeiro círculo antiga mantida indevidamente.','Seleciona Alarme também e exige limpar truque e magia ao trocar lista.'],
 ['src/pages/modals/Selecao2024.test.tsx','escolha incompleta','Rejeita escolhas inválidas mas não edita escolha existente, apesar do título.','Seleciona e substitui o mesmo talento, exige uma única fonte e novas magias exatas.'],
 ['src/pages/components/GerenciarFichas.exclusao.test.jsx','preserva ficha','Verifica erro/cancelamento, mas não executa nova tentativa prometida.','Reabre confirmação, tenta novamente e exige duas chamadas e fechamento após sucesso.'],
 ['src/pages/components/components_inventario/AbaMagias.test.js','recolher conjuração','Slot já existe com zero: toBeDefined não detectaria alternância inoperante.','Exige contador 1 e marca do primeiro slot consumida.'],
 ['src/utils/pendenciasPdf.test.js','', 'Substitui global.fetch e só restaura spies; restauração de mocks não desfaz atribuição global.','afterEach restaura fetch original inclusive em falha.'],
 ['src/pages/modals/ModalMagias.test.tsx','', 'Geometria de texto é simulada; prova algoritmo e fonte mínima, mas não overflow real do navegador.','Manter contrato do algoritmo; recomendar smoke visual em navegador.'],
];
for(const suite of run.testResults){
 const file=path.relative(process.cwd(),suite.name).replaceAll('\\','/');
 if(!file.startsWith('src/pages/')&&!file.startsWith('src/utils/')&&file!=='src/App.test.js')continue;
 const source=execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'});
 const ast=parser.parse(source,{sourceType:'module',plugins:['typescript','jsx']});
 const declarations=[];
 traverse(ast,{CallExpression(p){const n=p.node;const callee=source.slice(n.callee.start,n.callee.end); if(!/^(test|it)(\b|\.)/.test(callee)||n.arguments[0]?.type!=='StringLiteral')return;
  const cb=n.arguments.find(a=>['ArrowFunctionExpression','FunctionExpression'].includes(a.type));if(!cb)return;
  const assertions=[];p.traverse({ExpressionStatement(a){const text=source.slice(a.node.start,a.node.end);if(text.startsWith('expect('))assertions.push(text.replace(/\s+/g,' '));}});
  declarations.push({template:n.arguments[0].value,line:n.loc.start.line,evidence:[assertions[0],assertions.at(-1)].filter(Boolean).join(' ')});
 }});
 for(const t of suite.assertionResults){
  const matches=declarations.filter(d=>new RegExp('^'+d.template.split(/(%[sdifjoOp#]|\$[A-Za-z_][\w.]*)/).map(s=>/^(%[sdifjoOp#]|\$[A-Za-z_])/.test(s)?'.*':s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$').test(t.title));
  if(matches.length!==1)throw Error(file+' '+t.title+' '+matches.length);
  const d=matches[0];const w=weaknesses.find(w=>w[0]===file&&t.title.startsWith(w[1]));
  const deferred=file.endsWith('ModalMagias.test.tsx');
  rows.push({file,line:d.line,test:t.fullName,template:d.template,category:w?'B':'A',justification:w?w[2]:`Contrato observado: ${t.title}. Evidência: ${d.evidence}`,action:w?w[3]:'Manter',categoryAfter:deferred?'B':'A',actionTaken:w?w[3]:'Mantido',baselineStatus:t.status});
 }
}
fs.writeFileSync('tmp/audit-root.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,files:new Set(rows.map(r=>r.file)).size,categories:rows.reduce((a,r)=>(a[r.category]=(a[r.category]||0)+1,a),{})}));
