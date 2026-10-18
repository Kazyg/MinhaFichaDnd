import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { MAX_INPUT_BYTES, parseCollection, parseImport, exportFicha } from './fichaStorage';
import { getRulesetData, getRulesetVersion } from '../rulesets/getRulesetData';
function fixture(overrides = {}) { return new Ficha({ id: 'sintetica-1', nomePersonagem: 'Antes', ...overrides }); }
test('valida tipos, números, IDs, referências, profundidade e tamanho', () => {
  for (const patch of [{ vidaTotal: '20' }, { idiomas: [null] }, { atributosPersonagem: {} }, { id: '' }, { versaoRegras: null }, { subClasse: [{ classe: { nome: 'ausente' }, subclasse: { id: 'sub', nome: 'Antiga' } }] }]) {
    expect(() => parseImport(JSON.stringify({ ...fixture(), ...patch }))).toThrow();
  }
  expect(() => parseImport(JSON.stringify(fixture()).replace('"vidaTotal":null', '"vidaTotal":1e400'))).toThrow();
  expect(() => exportFicha(fixture({ vidaTotal: NaN }))).toThrow();
  expect(() => parseImport(' '.repeat(MAX_INPUT_BYTES + 1))).toThrow();
  expect(() => parseImport('{"__proto__":{},"id":"a","nomePersonagem":null}')).toThrow();
  expect(() => parseCollection(JSON.stringify([fixture(), fixture()]))).toThrow();
  expect(() => parseCollection(JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'colecao', selectedId: 'ausente', data: [] }))).toThrow();
  const profunda = fixture();
  profunda.extensao = Array.from({ length: 61 }).reduce(valor => ({ proximo: valor }), {});
  expect(() => parseImport(JSON.stringify(profunda))).toThrow(/profundidade máxima/);
  expect(() => getRulesetVersion('futuro')).toThrow();
});

test.each(['DND_2014', 'DND_2024'])('snapshots do contrato atual %s fazem roundtrip sem mudar opções', edition => {
  const rules = getRulesetData(edition);
  for (const classe of rules.classes) {
    const ficha = fixture({ versaoRegras: edition, classePrincipal: classe, racaPrincipal: rules.racasOuEspecies[0], backGround: rules.backgroundsOuOrigens[0], atributosPersonagem: new Atributos() });
    expect(JSON.parse(JSON.stringify(parseImport(exportFicha(ficha))))).toEqual(JSON.parse(JSON.stringify(ficha)));
  }
});

test('fúrias ilimitadas têm representação explícita, sem aceitar infinito arbitrário', () => {
  const barbaro = getRulesetData('DND_2014').classes.find(c => c.nome === 'barbaro');
  const text = exportFicha(fixture({ classePrincipal: barbaro }));
  expect(JSON.parse(text).data.classePrincipal.niveis.find(n => n.nivel === 20).furias).toBe('ilimitado');
  expect(parseImport(text).classePrincipal.niveis.find(n => n.nivel === 20).furias).toBe(Infinity);
  expect(() => parseImport(text.replace('"ilimitado"', '1e400'))).toThrow();
});
