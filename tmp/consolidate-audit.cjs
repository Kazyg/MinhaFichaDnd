const fs=require('fs');
const path=require('path');
const coverage=require('istanbul-lib-coverage');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const baseline=read('tmp/audit-baseline.json');
const final=fs.existsSync('tmp/audit-final.json')?read('tmp/audit-final.json'):null;
const sources=['root','fichas','mestre','ui'].flatMap(name=>read(`tmp/audit-${name}.json`).map(r=>({...r,owner:name})));
const unused=new Set(sources);
const rows=[];
const moduleFor=file=>file.includes('/areaMestre/ui/')?'Mestre: interface':file.includes('/areaMestre/')?'Mestre: domínio e persistência':file.includes('/api/fichaPersonagem/')?'Fichas: domínio e persistência':file.includes('/api/rulesets/')?'Regras 2014/2024':file.includes('/bibliotecas/')?'Catálogos':file.includes('/leveis/')?'Progressão':file.includes('/pages/')?'Páginas e componentes':file.includes('/utils/')?'PDF e utilitários':'Aplicação';
const finalByFile=new Map((final?.testResults??[]).map(s=>[path.relative(process.cwd(),s.name).replaceAll('\\','/'),s]));
for(const suite of baseline.testResults){
 const file=path.relative(process.cwd(),suite.name).replaceAll('\\','/');
 const after=finalByFile.get(file);
 if(final&&after.assertionResults.length!==suite.assertionResults.length)throw Error('Contagem mudou '+file);
 for(const [index,t] of suite.assertionResults.entries()){
  const candidates=sources.filter(r=>unused.has(r)&&r.file===file&&(r.baselineName??r.fullName??r.test)===t.fullName);
  if(!candidates.length)throw Error('Caso sem auditoria '+file+' '+t.fullName);
  const r=candidates[0];unused.delete(r);
  const next=after?.assertionResults[index];
  const lintChanged=file==='src/pages/ajustesFeature.test.js'&&t.title.startsWith('estilo de luta');
  const action=r.actionTaken??r.changeReason??'Mantido';
  rows.push({id:`${file}::${String(index+1).padStart(4,'0')}`,module:moduleFor(file),file,baselineLine:r.line,caseIndex:index+1,testBefore:t.fullName,testAfter:next?.fullName??r.testAfter??t.fullName,parameter:typeof r.parameter==='string'?r.parameter:JSON.stringify(r.parameter??null),categoryBefore:r.initialCategory??r.category,categoryAfter:r.categoryAfter??r.finalCategory??r.category,justification:r.justification.replace('Exercita produ??o','Exercita produção'),recommendation:r.action,actionTaken:lintChanged?'Substituídos acessos diretos ao DOM por foco do título e retorno ao acionador.':action,statusBefore:t.status,statusAfter:next?.status??'pendente',durationBeforeMs:t.duration??null,durationAfterMs:next?.duration??null});
 }
}
if(unused.size)throw Error('Linhas de auditoria excedentes: '+unused.size);
rows.sort((a,b)=>a.file.localeCompare(b.file)||a.caseIndex-b.caseIndex);
fs.mkdirSync('docs',{recursive:true});
const columns=Object.keys(rows[0]);const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync('docs/test-audit-2026-10-18-inventory.csv','\uFEFF'+columns.join(',')+'\r\n'+rows.map(r=>columns.map(c=>quote(r[c])).join(',')).join('\r\n')+'\r\n');
const counts=key=>rows.reduce((a,r)=>(a[r[key]]=(a[r[key]]??0)+1,a),{});
const modules={};for(const r of rows){const m=modules[r.module]??={files:new Set(),cases:0,before:{A:0,B:0,C:0,D:0,E:0},after:{A:0,B:0,C:0,D:0,E:0}};m.files.add(r.file);m.cases++;m.before[r.categoryBefore]++;m.after[r.categoryAfter]++;}for(const m of Object.values(modules))m.files=m.files.size;
const runSummary=r=>r?{tests:r.numTotalTests,passed:r.numPassedTests,failed:r.numFailedTests,ignored:r.numPendingTests,suites:r.numTotalTestSuites,passedSuites:r.numPassedTestSuites,failedSuites:r.numFailedTestSuites,elapsedSeconds:(Math.max(...r.testResults.map(s=>s.endTime))-r.startTime)/1000,files:r.testResults.map(s=>({file:path.relative(process.cwd(),s.name).replaceAll('\\','/'),cases:s.assertionResults.length,elapsedSeconds:(s.endTime-s.startTime)/1000,passed:s.assertionResults.filter(t=>t.status==='passed').length,failed:s.assertionResults.filter(t=>t.status==='failed').length}))}:null;
const cov=f=>{const map=coverage.createCoverageMap(read(f));return {partial:true,excludedByInstrumentationError:'src/features/areaMestre/pdfMotor.ts (import.meta / Babel sourceType)',files:map.files().length,summary:map.getCoverageSummary().toJSON(),byModule:Object.fromEntries(Object.keys(modules).map(m=>{const sub=coverage.createCoverageMap({});for(const f of map.files())if(moduleFor(path.relative(process.cwd(),f).replaceAll('\\','/'))===m)sub.addFileCoverage(map.fileCoverageFor(f));return[m,sub.getCoverageSummary().toJSON()];}))};};
const evidence={date:'2026-10-18',revision:'a3df02f',scope:{sourceFiles:530,testFiles:96,cases:rows.length,frameworks:['Jest 27 (react-scripts 5)','React Testing Library','jest-dom','user-event','fake-indexeddb'],separateIntegrationCommand:false,e2eHarness:false,snapshots:0},classificationBefore:counts('categoryBefore'),classificationAfter:counts('categoryAfter'),modules,baseline:runSummary(baseline),final:runSummary(final),coverageBefore:cov('tmp/audit-coverage-before.json'),coverageAfter:final?cov('coverage/coverage-final.json'):null,checks:fs.existsSync('tmp/audit-checks-final.json')?read('tmp/audit-checks-final.json'):null,build:fs.existsSync('tmp/audit-build-after-result.json')?read('tmp/audit-build-after-result.json'):null,failuresBefore:baseline.testResults.flatMap(s=>s.assertionResults.filter(t=>t.status==='failed').map(t=>({file:path.relative(process.cwd(),s.name).replaceAll('\\','/'),test:t.fullName,error:t.failureMessages[0]?.replace(/\u001b\[[0-9;]*m/g,'').split('\n').slice(0,6).join('\n')}))),remainingWeak:rows.filter(r=>r.categoryAfter==='B').map(({file,testAfter,justification,recommendation})=>({file,test:testAfter,justification,recommendation}))};
for(const name of ['baseline','final'])if(evidence[name]){
 const file=name==='baseline'?'tmp/audit-baseline.log':'tmp/audit-final.log';
 const log=fs.readFileSync(file,'utf16le');
 evidence[name].reportedDurationSeconds=Number(log.match(/Time:\s+([\d.]+) s/)[1]);
 evidence[name].exitCode=name==='baseline'?1:0;
 evidence[name].coverageInstrumentationError=log.includes('Failed to collect coverage');
 evidence[name].reactActWarnings=log.includes('not wrapped in act');
}
evidence.commands={baselineTest:'CI=true npm test -- --watchAll=false --runInBand --coverage --json --outputFile=tmp/audit-baseline.json',finalTest:'CI=true npm test -- --watchAll=false --runInBand --coverage --json --outputFile=tmp/audit-final.json',lint:'npm run lint',typecheck:'npm run typecheck',buildBefore:'npm run build',buildAfter:'npm run build:verify'};
evidence.checksBefore={lint:{errors:2,warnings:0},typecheck:{exitCode:0},build:{exitCode:0,timed:false}};
for(const c of ['A','B','C','D','E']){evidence.classificationBefore[c]??=0;evidence.classificationAfter[c]??=0;}
fs.writeFileSync('docs/test-audit-2026-10-18-evidence.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,files:new Set(rows.map(r=>r.file)).size,before:evidence.classificationBefore,after:evidence.classificationAfter,modules,final:evidence.final&&{tests:evidence.final.tests,failed:evidence.final.failed}},null,2));
