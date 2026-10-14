const fs = require('fs'), path = require('path'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, esModuleInterop: true } }).outputText, f);
const { Ficha } = require(path.resolve('src/api/fichaPersonagem/FichaPersonagem.ts'));
const { exportFicha } = require(path.resolve('src/api/fichaPersonagem/fichaStorage.ts'));
const { getRulesetData } = require(path.resolve('src/api/rulesets/getRulesetData.ts'));
for (const versaoRegras of ['DND_2014', 'DND_2024']) {
  const rules = getRulesetData(versaoRegras), classe = rules.classes.find(c => c.chave === 'guerreiro');
  const ficha = new Ficha({ id: 'browser-' + versaoRegras, versaoRegras, nomePersonagem: 'A25 ' + versaoRegras, levelTotal: 1,
    idiomasLivres: ['Élfico', 'Anão'], idiomas: ['Comum', 'Élfico', 'Anão'], classePrincipal: classe,
    racaPrincipal: rules.racasOuEspecies.find(r => r.nome === 'Humano'), backGround: rules.backgroundsOuOrigens[0],
    recursos: { slots: {}, morte: { sucessos: 2, falhas: 1 } },
    itensMochila: [{ id: 'item-sintetico', nome: 'Item sintético de ensaio', sintonizavel: true, efeitosExplicitos: [], descricao: 'Fixture sem efeitos de catálogo', peso: 0 }],
  });
  ficha.selecionarClasseNoNivel(classe, 1);
  fs.writeFileSync(path.join(__dirname, 'fixture-' + versaoRegras + '.json'), exportFicha(ficha));
}
