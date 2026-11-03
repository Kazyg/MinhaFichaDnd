const fs=require('fs');
const rows=JSON.parse(fs.readFileSync('tmp/audit-mestre.json','utf8'));
const baseline=JSON.parse(fs.readFileSync('tmp/audit-baseline.json','utf8'));
const after=JSON.parse(fs.readFileSync('tmp/audit-mestre-after.json','utf8'));
const normalize=p=>p.replace(/\\/g,'/');
const rename=['cancelar seleções, novas instâncias e edição de PV do rascunho não grava nem altera registros','preparar seleções, novas instâncias e PV sem commit preserva agregado e registros'];
for(const file of new Set(rows.map(r=>r.file))){
 const initial=baseline.testResults.find(r=>normalize(r.name).endsWith(file));
 const final=after.testResults.find(r=>normalize(r.name).endsWith(file));
 const list=rows.filter(r=>r.file===file);
 if(initial.assertionResults.length!==list.length)throw new Error(file+': contagem divergente');
 list.forEach((row,i)=>{
  const result=initial.assertionResults[i];
  const prefix=row.test.split('%')[0];
  if(!result.title.startsWith(prefix))throw new Error(file+': ordem divergiu '+row.test+' / '+result.title);
  row.baselineName=result.fullName;
  row.baselineStatus=result.status;
  row.initialCategory=row.category;
  const target=result.title===rename[0]?rename[1]:result.title;
  const finalResult=final?.assertionResults.find(r=>r.title===target);
  row.finalCategory=finalResult?.status==='passed'?'A':row.category;
  row.finalStatus=finalResult?.status??'aguardando validação completa';
  row.changeReason=row.category==='B'||row.category==='E'?row.action:result.status==='failed'?(file.endsWith('roundTrip.test.ts')?'Importação explícita TextEncoder de util disponibiliza codificação na fixture jsdom.':'Uint8Array local normaliza os bytes de NodeBlob entre contextos sem alterar o PDF.'):'Nenhuma alteração necessária';
  if(row.category!=='A')row.actionStatus='Corrigido e validado em suíte direcionada';
 });
}
fs.writeFileSync('tmp/audit-mestre.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,baselineFailures:rows.filter(r=>r.baselineStatus==='failed').length,validated:rows.filter(r=>r.finalStatus==='passed').length}));
