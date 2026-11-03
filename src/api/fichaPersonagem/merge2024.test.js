import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { exportFicha, parseImport } from './fichaStorage';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { selecionarTalentoInicial } from './talentosConteudo';
import { magiasConcedidas, usarMagiaTalento } from './talentos2024Utils';
import { selecionarIniciativa } from './fichaSeletores';

function documento() {
  const regras = getRulesetData('DND_2024');
  const classe = regras.classes.find(c => c.chave === 'guerreiro');
  const f = new Ficha({ nomePersonagem: 'Sintética', versaoRegras: 'DND_2024', levelTotal: 8,
    classePrincipal: classe, racaPrincipal: regras.racasOuEspecies.find(r => r.nome === 'Humano'),
    atributosPersonagem: new Atributos(14, 14, 14, 14, 14, 14) });
  f.multiclasses = [{ id: 'classe', classe, nivelClasse: 8, nivelEscolhido: [1,2,3,4,5,6,7,8] }];
  return f;
}
const escolhas = { lista: ['Mago'], conjuracao: ['carisma'], truques: ['2024: Luz', '2024: Mãos Mágicas'], magias: ['2024: Alarme'] };

test('troca de talento PHB por ASI arquiva registro e concessões sem acumular aumentos', () => {
  const f = documento();
  expect(f.selecionarTalentoAvanco(4, 'Atleta', { atributo: ['forca'] })).toBe(true);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(15);
  const original = f.efeitos.find(e => e.talento === 'Atleta');
  expect(f.aplicarAumentoAtributos(4, ['destreza','destreza'])).toBe(true);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(14);
  expect(calcularValorAtributoFinal(f, 'destreza')).toBe(16);
  expect(f.escolhasAnteriores.at(-1).valor).toEqual(expect.arrayContaining([original]));
  const salvo = parseImport(exportFicha(f));
  expect(calcularValorAtributoFinal(salvo, 'forca')).toBe(14);
  expect(salvo.escolhasAnteriores).toEqual(f.escolhasAnteriores);
});

test('magias e usos do talento persistem sem consumir vagas de classe e sem vazar para outra ficha', () => {
  const f = documento(), outra = documento();
  const efeitosOutra = JSON.parse(JSON.stringify(outra.efeitos));
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Iniciado em Magia', escolhas)).toBeNull();
  expect(usarMagiaTalento(f, 'TalentoOrigemHumano', '2024: Alarme')).toBe(true);
  const salvo = parseImport(exportFicha(f));
  expect(usarMagiaTalento(salvo, 'TalentoOrigemHumano', '2024: Alarme')).toBe(false);
  expect(salvo.magiasConjuracao ?? []).toHaveLength(0);
  expect(magiasConcedidas(outra)).toHaveLength(0);
  expect(outra.efeitos).toEqual(efeitosOutra);
});

test('JSON de feat/regras-2024 conserva escolhas em objeto no campo original', () => {
  const f = documento();
  const e = new Efeitos();
  Object.assign(e, { talento: '2024: Iniciado em Magia', tituloEfeito: 'legado-2024', level: 1, escolhasTalento: escolhas, usosMagiaTalento: { '2024: Alarme': 1 } });
  f.efeitos = [e];
  const salvo = parseImport(exportFicha(f));
  expect(salvo.efeitos[0].escolhasTalento).toEqual(escolhas);
  expect(salvo.efeitos[0].escolhasTalento2024).toBeUndefined();
  expect(magiasConcedidas(salvo)).toHaveLength(3);
  expect(usarMagiaTalento(salvo, 'legado-2024', '2024: Alarme')).toBe(false);
  expect(JSON.parse(exportFicha(salvo)).data.efeitos[0].escolhasTalento).toEqual(escolhas);
});

test('revisão desconhecida inativa talento e concessões sem apagar dados após importação', () => {
  const f = documento();
  expect(f.selecionarTalentoAvanco(4, 'Atleta', { atributo: ['forca'] })).toBe(true);
  const salvo = parseImport(exportFicha(f));
  salvo.efeitos.find(e => e.talento === 'Atleta').conteudo.revisao = 'futura';
  expect(calcularValorAtributoFinal(salvo, 'forca')).toBe(14);
  expect(salvo.efeitos).toHaveLength(f.efeitos.length);
  expect(salvo.efeitos[0].escolhasTalento2024).toEqual({ atributo: ['forca'] });
});

test('Alerta salvo com nome qualificado aplica iniciativa sem duplicar o bônus versionado', () => {
  const f = documento();
  const e = new Efeitos();
  Object.assign(e, { talento: '2024: Alerta', tituloEfeito: 'alerta', level: 1, escolhasTalento: {} });
  f.setEfeitos(e);
  expect(selecionarIniciativa(f).total).toBe(5);
  expect(selecionarIniciativa(parseImport(exportFicha(f))).total).toBe(5);
});

test('talento PHB não repetível bloqueia nova aquisição e planejamento retroativo duplicado', () => {
  const f = documento();
  expect(f.selecionarTalentoAvanco(8, 'Atleta', { atributo: ['forca'] })).toBe(true);
  const antes = exportFicha(f);
  expect(f.selecionarTalentoAvanco(4, 'Atleta', { atributo: ['destreza'] })).toBe(false);
  expect(exportFicha(f)).toBe(antes);
});
