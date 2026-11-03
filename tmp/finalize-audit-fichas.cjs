const fs = require('fs');
const rows=JSON.parse(fs.readFileSync('tmp/audit-fichas.json','utf8'));
const actions={
 'src/api/rulesets/custos.test.js:16':'Acrescentada comparação do custo de talentos na reabertura/subida com a criação, sem orçamento arbitrário; afterEach restaura spies mesmo em falha; removido log diagnóstico.',
 'src/api/fichaPersonagem/FichaContext.test.js:41':'Avançados mais 10 segundos após salvar e mantida exigência de exatamente uma gravação.',
 'src/api/fichaPersonagem/FichaContext.test.js:122':'Título corrigido para contrato real de idempotência; verificados IDs únicos no repositório e no contexto, preservando legado.',
 'src/api/fichaPersonagem/fichasIndexedDB.test.ts:47':'Registro JSON com __proto__ incluído na migração parcial; verificada ausência no banco e ausência de poluição de Object.prototype.',
 'src/api/fichaPersonagem/fichaSerialization.test.js:6':'Árvore com 61 camadas adicionada; importação deve rejeitar especificamente profundidade máxima.',
 'src/api/fichaPersonagem/progressao.test.js:142':'Removida asserção tautológica sobre string constante; comparados atributos antes/depois de cada recusa, inclusive após distribuição válida.',
 'src/api/fichaPersonagem/conteudoVersionado.test.js:220':'Referência válida com revisão futura faz roundtrip e preserva snapshot, sem aplicar benefício de Alerta.',
 'src/api/fichaPersonagem/fichaSeletores.test.js:162':'afterEach restaura global.fetch e todos os spies, inclusive se geração/verificação do PDF falhar.',
 'src/api/fichaPersonagem/fichaRestauracao.test.js:155':'afterEach restaura innerWidth também quando fluxo mobile falha.',
 'src/api/fichaPersonagem/catalogoEquipamentosMagicos.test.tsx:185':'Hover abre tooltip real e aria-expanded; Escape fecha antes de exercer foco/teclado/toque existentes.',
};
for(const r of rows){
 if(r.file==='src/api/fichaPersonagem/fichaRecursosPersistencia.test.js') {
  r.category='B';r.justification='Exercita persistência real de slots/morte, mas interações não aguardam atualizações assíncronas do provider; baseline emite avisos de act.';
  r.action='Aguardar interações dentro de act assíncrono, sem silenciar console.';
  r.actionTaken='Todas as interações do fluxo aguardam act assíncrono; execução direcionada sem avisos de act.';
 }
 const key=`${r.file}:${r.line}`;
 if(r.category==='B' && actions[key])r.actionTaken=actions[key];
 if(r.category==='B' && r.file==='src/leveis/LevelUm.distribuicao.test.js')r.actionTaken='Math.random determinístico rola1,2,4,6 por atributo; exige12 em todos os seis resultados e restaura spy em afterEach.';
 r.categoryAfter=r.actionTaken?'A':r.category;
 if(key==='src/api/fichaPersonagem/FichaContext.test.js:122')r.testAfter='StrictMode mantém uma única ficha migrada e preserva o legado';
}
fs.writeFileSync('tmp/audit-fichas.json',JSON.stringify(rows,null,2)+'\n');
const improved=rows.filter(r=>r.actionTaken);
fs.writeFileSync('tmp/audit-fichas-improvements.json',JSON.stringify(improved,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,initial:rows.reduce((a,r)=>(a[r.category]=(a[r.category]||0)+1,a),{}),after:rows.reduce((a,r)=>(a[r.categoryAfter]=(a[r.categoryAfter]||0)+1,a),{}),improved:improved.length}));
