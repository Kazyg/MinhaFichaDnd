import { Ficha } from './FichaPersonagem';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { chaveClasse } from '../rulesets/progressao';
import { exportFicha, parseImport } from './fichaStorage';
import { selecionarEspecializacao, especializacoesAtivas, arquivarEspecializacao } from './fichaEspecializacao';
import { selecionarPericia } from './fichaSeletores';
import { pendenciasLegadas, revisarLegado } from './revisaoLegado';
import { idiomasEscolhidos } from './fichaRestauracao';
import { opcoesMetamagia, selecionarMetamagia } from '../rulesets/metamagia';

function fixture(edicao, chave = 'ladino', nivel = 6) {
  const classe = getRulesetData(edicao).classes.find(c => chaveClasse(c) === chave);
  return new Ficha({ versaoRegras: edicao, nomePersonagem: 'Sintética', levelTotal: nivel, classePrincipal: classe,
    multiclasses: [{ id: 'classe', classe, nivelClasse: nivel, nivelEscolhido: Array.from({ length: nivel }, (_, i) => i + 1) }],
    pericias: ['Furtividade', 'Percepção', 'Investigação', 'Arcanismo', 'Medicina'] });
}
describe.each(['DND_2014', 'DND_2024'])('%s', edicao => {
  const escolha = (pericia, fonte = 'ladino:1', nivelAquisicao = 1) => ({ pericia, fonte: `${edicao}:${fonte}`, nivelAquisicao, edicao });
  test('limite, duplicata, treino independente, redução, remoção da fonte e duas fichas', () => {
    let f = fixture(edicao); const outra = fixture(edicao);
    expect(selecionarEspecializacao(f, escolha('Atletismo'))).toMatch(/treinamento/);
    expect(selecionarEspecializacao(f, escolha('Furtividade'))).toBeNull();
    expect(selecionarEspecializacao(f, escolha('Furtividade'))).toMatch(/já/);
    expect(selecionarEspecializacao(f, escolha('Percepção'))).toBeNull();
    expect(selecionarEspecializacao(f, escolha('Investigação'))).toMatch(/esgotada/);
    expect(selecionarEspecializacao(f, escolha('Investigação', 'ladino:6', 5))).toMatch(/nível/);
    expect(selecionarEspecializacao(f, escolha('Investigação', 'ladino:6', 6))).toBeNull();
    f = parseImport(exportFicha(f));
    expect(especializacoesAtivas(f)).toHaveLength(3);
    expect(selecionarPericia(f, 'Furtividade', 'destreza').total).toBe(6);
    f.levelTotal = 1;
    expect(especializacoesAtivas(f)).toHaveLength(2);
    f.levelTotal = 6;
    expect(especializacoesAtivas(f)).toHaveLength(3);
    f.multiclasses = [];
    expect(especializacoesAtivas(f)).toHaveLength(0);
    expect(f.especializacoesOficiais).toHaveLength(3);
    expect(outra.especializacoesOficiais).toBeUndefined();
    arquivarEspecializacao(f, 0);
    expect(parseImport(exportFicha(f)).escolhasAnteriores[0].valor.pericia).toBe('Furtividade');
  });
  test('manual é preservado e não autoriza nova escolha oficial', () => {
    const f = fixture(edicao);
    const efeito = Object.assign(new Efeitos(), { origemTipo: 'manual', tipoEfeito: 'especializacao', pericia: 'Atletismo' });
    f.efeitos = [efeito];
    expect(selecionarEspecializacao(f, escolha('Atletismo'))).toMatch(/treinamento/);
    expect(parseImport(exportFicha(f)).efeitos[0].id).toBe(efeito.id);
  });
  test('histórico e revisão explícita sobrevivem ao JSON; leitura não altera dados', () => {
    const f = fixture(edicao);
    f.efeitos = [Object.assign(new Efeitos(), { tituloEfeito: 'Origem desconhecida', bonus: 2 })];
    f.idiomas = ['Comum', 'Élfico'];
    f.subclassesAnteriores = []; f.inventarioAnterior = { anotacao: 'preservar' };
    const original = exportFicha(f);
    expect(pendenciasLegadas(f).length).toBeGreaterThan(0);
    expect(idiomasEscolhidos(f)).toEqual([]);
    expect(exportFicha(f)).toBe(original);
    expect(revisarLegado(f, 'idiomas', 'manter')).toBe(true);
    expect(revisarLegado(f, `efeito:${f.efeitos[0].id}`, 'arquivar')).toBe(true);
    const copia = parseImport(exportFicha(f));
    expect(copia.efeitos).toHaveLength(0);
    expect(copia.idiomas).toEqual(['Comum', 'Élfico']);
    expect(pendenciasLegadas(copia)).toHaveLength(0);
    // Roteiro P16: editar somente uma cópia, guardando o arquivo anterior.
    const json = JSON.parse(exportFicha(copia));
    json.data.efeitos.push(json.data.escolhasAnteriores.find(e => e.tipo.includes('arquivar:efeito')).valor);
    const recuperada = parseImport(JSON.stringify(json));
    expect(recuperada.efeitos[0].bonus).toBe(2);
    expect(recuperada.inventarioAnterior).toEqual({ anotacao: 'preservar' });
    expect(copia.efeitos).toHaveLength(0);
    expect(parseImport(original).efeitos).toHaveLength(1);
  });
});
test.each([['DND_2014', 3, 10], ['DND_2024', 2, 9]])('marcos de Bardo %s são próprios da edição', (edicao, primeiro, segundo) => {
  const f = fixture(edicao, 'bardo', segundo);
  expect(selecionarEspecializacao(f, { fonte: `${edicao}:bardo:${primeiro}`, pericia: 'Furtividade', nivelAquisicao: primeiro - 1, edicao })).toMatch(/nível/);
  expect(selecionarEspecializacao(f, { fonte: `${edicao}:bardo:${primeiro}`, pericia: 'Furtividade', nivelAquisicao: primeiro, edicao })).toBeNull();
});
test('Mago revisado restringe perícias e treino futuro não satisfaz aquisição', () => {
  const f = fixture('DND_2024', 'mago', 4);
  const escolha = { fonte: 'DND_2024:mago:2', pericia: 'Furtividade', nivelAquisicao: 2, edicao: 'DND_2024' };
  expect(selecionarEspecializacao(f, escolha)).toMatch(/elegível/);
  f.pericias = [];
  f.efeitos = [Object.assign(new Efeitos(), { tipoEfeito: 'proficiencia', pericia: 'Arcanismo', level: 4 })];
  expect(selecionarEspecializacao(f, { ...escolha, pericia: 'Arcanismo' })).toMatch(/treinamento/);
});
test('metamagias revisadas persistem resumo, revisão e fonte; legado fica intacto', () => {
  const f = fixture('DND_2024', 'feiticeiro', 2);
  f.metamagica1 = { nome: 'Magia Sutil', descricao: 'Snapshot antigo' };
  expect(opcoesMetamagia('desconhecida')).toEqual([]);
  expect(opcoesMetamagia('DND_2024')).toHaveLength(10);
  expect(selecionarMetamagia(f, 2, 1, 'Magia Aumentada')).toBe(true);
  const copia = parseImport(exportFicha(f));
  expect(copia.escolhasMetamagia.find(e => e.slot === 1)).toMatchObject({ revisao: 'srd-5.2.1-pt-resumo-1', descricao: expect.stringContaining('2 pontos') });
  expect(copia.metamagica1.descricao).toBe('Snapshot antigo');
  expect(opcoesMetamagia('DND_2024').find(e => e.nome === 'Magia Sutil').descricao).toContain('materiais');
});
