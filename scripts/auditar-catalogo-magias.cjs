const fs = require('node:fs');
const ts = require('typescript');
const code = ts.transpile(fs.readFileSync('src/bibliotecas/Magia.ts','utf8'),{ module:ts.ModuleKind.CommonJS });
const library = {};
new Function('exports',code)(library);
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const antiga = [...new Map(Object.entries(library).filter(([k]) => k !== 'Magias').flatMap(([,v]) => v).map(m => [m.nome,m])).values()];
const nova = require('../src/api/rulesets/dnd2024/phb2024.json').magias;
const aliases2014 = {
  'Infringir Ferimentos':'Infligir Ferimentos', 'Banquete dos Heróis':'Banquete de Heróis', 'Enfraquecer o Intelecto':'Enfraquecer Intelecto',
  'Criar Passage':'Criar Passagem', 'Lufado':'Lufada', 'Maremato':'Maremoto', 'Grifo psíquico':'Grito Psíquico',
  'Guardilão da natureza':'Guardião da Natureza', 'Galola da alma':'Gaiola da Alma', 'Esfera cússica':'Esfera Cáustica',
  'Queimadura de Aganazar':'Queimadura de Aganazzar', 'Manta de chamas':'Manto de Chamas', 'Manta de gelo':'Manto de Gelo',
  'Manta de pedra':'Manto de Pedra', 'Manta de vento':'Manto de Vento',
  'Espíritos Guardiões':'Guardiões Espirituais', 'Convocar Relâmpagos':'Invocar Relâmpagos', 'Metamorfose':'Polimorfia', 'Ajuda':'Auxílio',
  'Criar Chamas':'Produzir Chama', 'Escudo de Fogo':'Escudo Ardente', 'Tempestade de Gelo':'Tempestade Glacial',
  'Auxílio Divino':'Favor Divino', 'Marca do Caçador':'Marca do Predador', 'Repreensão Infernal':'Repreensão Diabólica', 'Oração Curativa':'Oração de Cura',
};
const aliases2024 = {
  'Toque Necrótico':'Toque Arrepiante', 'Raio Místico':'Rajada Mística', 'Criar Chamas':'Produzir Chama',
  'Zombaria Perversa':'Zombaria Viciosa', 'Raio Guia':'Raio Guiador', 'Raio Nauseante':'Raio Adoecente',
  'Convocar Relâmpagos':'Invocar Relâmpagos', 'Paralisar Pessoa':'Imobilizar Pessoa', 'Paralisar Monstro':'Imobilizar Monstro', 'Telecinese':'Telecinesia',
};
for (const magia of antiga) {
  if (!library.Magias.some(m => m.nome === magia.nome)) {
    const matches = library.Magias.filter(m => norm(m.nome) === norm(magia.nome));
    if (matches.length === 1) aliases2014[magia.nome] = matches[0].nome;
  }
}
fs.writeFileSync('src/api/rulesets/magiasAliases.json',JSON.stringify({ DND_2014:aliases2014,DND_2024:aliases2024 },null,2)+'\n');
const revisadas = require('../src/api/rulesets/magiasRevisadas.json');
const audit = {};
for (const [edition, spells, aliases] of [['DND_2014',antiga,aliases2014],['DND_2024',nova,aliases2024]]) {
  audit[edition] = spells.map(m => {
    const name = aliases[m.nome] ?? m.nome;
    const key = Object.keys(revisadas[edition]).find(k => norm(k) === norm(name));
    const original = edition === 'DND_2014' ? library.Magias.find(v => v.nome === m.nome) ?? library.Magias.find(v => norm(v.nome) === norm(name)) : m;
    const corrected = key ? revisadas[edition][key] : null;
    const texto = original?.descricao ?? '';
    const candidatos = { dano:/\bdano\b/i.test(texto), cura:/cura|recupera.*(?:PV|pontos de vida)/i.test(texto), ataque:/ataque (?:mágico|com magia)/i.test(texto), resistencia:/teste de resistência|salvaguarda/i.test(texto) };
    return { nome:m.nome, nomeCorrespondente:name, descricaoOriginalAusente:!original?.descricao,
      correspondenciaRecuperada:edition === 'DND_2014' && !library.Magias.some(v => v.nome === m.nome) && !!original,
      verificadaSRD:!!corrected, fonte:corrected?.combate.fonte ?? null, ingles:corrected?.ingles ?? null,
      selecionavel:!!original?.descricao || !!corrected,
      candidatosParaRevisao:corrected ? [] : Object.entries(candidatos).filter(([,presente]) => presente).map(([campo]) => campo),
      combate:corrected?.combate.dano ? 'dano' : corrected?.combate.cura ? 'cura' : corrected?.combate.resistencia ? 'resistência' : corrected ? 'efeito sem fórmula de dano' : 'não estruturado; consultar descrição',
    };
  });
}
fs.mkdirSync('docs/magias-2026-10-14',{ recursive:true });
fs.writeFileSync('docs/magias-2026-10-14/auditoria.json',JSON.stringify(audit,null,2)+'\n');
console.log(Object.fromEntries(Object.entries(audit).map(([e,m]) => [e,{ total:m.length, verificadaSRD:m.filter(s => s.verificadaSRD).length, correspondencias:m.filter(s => s.correspondenciaRecuperada).length, semDescricao:m.filter(s => !s.selecionavel).map(s => s.nome) }])));
