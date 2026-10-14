const fs = require('fs'), path = require('path');
const rows = [];
for (const variant of ['plain', 'obfuscated']) {
  const dir = path.join(__dirname, 'browser-profile-' + variant);
  const r = JSON.parse(fs.readFileSync(path.join(dir, 'result.json')));
  for (const ed of ['DND_2014', 'DND_2024']) for (const cache of ['frio-desabilitado', 'quente']) {
    for (const etapa of ['A25-importar-reabrir', 'A25-nivel1-3']) {
      const samples = r.timings.filter(x => x.ed === ed && x.cache === cache && x.etapa === etapa);
      const values = samples.map(x => x.ms).sort((a, b) => a - b);
      const cpu = samples.map(x => {
        const p = JSON.parse(fs.readFileSync(path.join(dir, `cpu-${etapa.includes('importar') ? 'import' : 'level'}-${ed}-${x.rep}.json`))).profile;
        const nodes = new Map(p.nodes.map(n => [n.id, n.callFrame.functionName]));
        return p.samples.reduce((s, id, i) => s + (nodes.get(id) === '(idle)' ? 0 : p.timeDeltas[i] ?? 0), 0) / 1000;
      }).sort((a, b) => a - b);
      rows.push({ variant, ed, cache, etapa, n: values.length, wallMs: { min: values[0], median: values[1], max: values[2] },
        sampledNonIdleMs: { min: cpu[0], median: cpu[1], max: cpu[2] } });
    }
  }
}
fs.writeFileSync(path.join(__dirname, 'perfil-resumo.json'), JSON.stringify({ nota: 'Wall time inclui polling e UI/importação. CPU amostrada exclui apenas (idle); não é contagem de commits React, nem prova de gargalo. Frio = cache HTTP limpo/desabilitado, não processo/JIT frio.', rows }, null, 2));
for (const r of rows) console.log([r.variant, r.ed, r.cache, r.etapa, ...Object.values(r.wallMs).map(n => n.toFixed(1)), ...Object.values(r.sampledNonIdleMs).map(n => n.toFixed(1))].join(' | '));
