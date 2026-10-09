import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { FichaProvider, useFicha } from './FichaContext';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { chaveClasse, cumpreRequisitosClasse, erroDistribuicao, nivelDaClasse, podeSelecionarClasse, recursosNoNivel } from '../rulesets/progressao';
import { eventosMetamagia, metamagiasNoNivel, opcoesMetamagia } from '../rulesets/metamagia';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { erroASI } from './escolhasProgressao';
import { exportFicha, parseImport, serializeCollection } from './fichaStorage';
import AvancoAtributos from '../../leveis/components/AvancoAtributos';
import LevelOneSetup from '../../leveis/LevelUm';
import NivelBlock from '../../leveis/NivelBlock';

function fixture(edicao = 'DND_2024', chave = 'guerreiro', level = 4) {
  const rules = getRulesetData(edicao);
  const classe = rules.classes.find(c => chaveClasse(c) === chave);
  const ficha = new Ficha({ versaoRegras: edicao, classePrincipal: classe, levelTotal: level,
    atributosPersonagem: new Atributos(13, 13, 13, 13, 13, 13),
    racaPrincipal: rules.racasOuEspecies.find(r => r.nome === 'Humano'), backGround: rules.backgroundsOuOrigens[0] });
  for (let n = 1; n <= level; n++) expect(ficha.selecionarClasseNoNivel(classe, n)).toBe(true);
  return ficha;
}
const classe = (f, key) => getRulesetData(f.versaoRegras).classes.find(c => chaveClasse(c) === key);
const reabrir = ficha => parseImport(exportFicha(ficha));
const standard = () => ({ metodo: 'Array Padrão', atributos: { forca: 15, destreza: 14, constituicao: 13, inteligencia: 12, sabedoria: 10, carisma: 8 }, valores: [], pontos: 27, modo: 'todos', maior: '', menor: '' });

test.each(['DND_2014', 'DND_2024'])('marcos das doze classes %s, sem depender dos rótulos', edicao => {
  const rules = getRulesetData(edicao);
  expect(rules.classes).toHaveLength(12);
  for (const c of rules.classes) {
    const expected = [4, 8, 12, 16, ...(edicao === 'DND_2014' ? [19] : []), ...(chaveClasse(c) === 'guerreiro' ? [6, 14] : []), ...(chaveClasse(c) === 'ladino' ? [10] : [])].sort((a, b) => a - b);
    const actual = Array.from({ length: 20 }, (_, i) => i + 1).filter(n => recursosNoNivel(c, n, edicao).includes('asi'));
    expect(actual).toEqual(expected);
    expect(recursosNoNivel(c, 19, edicao)).toEqual([edicao === 'DND_2024' ? 'epic-boon' : 'asi']);
    expect(recursosNoNivel({ nome: 'Rótulo editado', chave: c.chave }, 4, edicao)).toEqual(['asi']);
  }
});

test.each(['Barbaro', 'Bárbaro', 'Clérigo', 'Clerigo', 'Lutador', 'Guerreiro', 'Ranger', 'Rogue'])('aliases e requisitos 12/13: %s', name => {
  expect(cumpreRequisitosClasse(name, () => 12)).toBe(false);
  expect(cumpreRequisitosClasse(name, () => 13)).toBe(true);
});
test.each(['monge', 'patrulheiro', 'paladino'])('requisitos compostos exigem ambos: %s', key => {
  const first = key === 'paladino' ? 'forca' : 'destreza';
  const second = key === 'paladino' ? 'carisma' : 'sabedoria';
  expect(cumpreRequisitosClasse(key, a => a === first ? 13 : 12)).toBe(false);
  expect(cumpreRequisitosClasse(key, a => a === second ? 13 : 12)).toBe(false);
  expect(cumpreRequisitosClasse(key, () => 13)).toBe(true);
});
test('guerreiro exige Força OU Destreza', () => {
  expect(cumpreRequisitosClasse('guerreiro', a => a === 'destreza' ? 13 : 12)).toBe(true);
  expect(cumpreRequisitosClasse('guerreiro', a => a === 'forca' ? 13 : 12)).toBe(true);
});
test('chave de classe sobrevive a mudança de rótulo e JSON', () => {
  const ficha = fixture(); ficha.classePrincipal.nome = 'Nome personalizado';
  expect(chaveClasse(reabrir(ficha).classePrincipal)).toBe('guerreiro');
  expect(recursosNoNivel(reabrir(ficha).classePrincipal, 6, ficha.versaoRegras)).toEqual(['asi']);
});
test.each(['DND_2014', 'DND_2024'])('origem inválida é recusada pela UI e pela operação em %s', edicao => {
  const ficha = fixture(edicao, 'barbaro'); ficha.atributosPersonagem.forca.valor = 12;
  const mago = classe(ficha, 'mago'); const before = exportFicha(ficha);
  expect(podeSelecionarClasse(ficha, mago, 4)).toBe(false);
  expect(ficha.selecionarClasseNoNivel(mago, 4)).toBe(false);
  expect(exportFicha(ficha)).toBe(before);
  ficha.atributosPersonagem.forca.valor = 13;
  expect(ficha.selecionarClasseNoNivel(mago, 4)).toBe(true);
  expect(nivelDaClasse(ficha, 'mago')).toBe(1);
  expect(nivelDaClasse(ficha, 'barbaro')).toBe(3);
});
test('atributos de avanço futuro não autorizam multiclasse anterior', () => {
  const ficha = fixture('DND_2024', 'guerreiro', 8);
  ficha.atributosPersonagem.inteligencia.valor = 12;
  expect(ficha.aplicarAumentoAtributos(8, ['inteligencia', 'carisma'])).toBe(true);
  expect(ficha.selecionarClasseNoNivel(classe(ficha, 'mago'), 5)).toBe(false);
});

test.each(['DND_2014', 'DND_2024'])('classe já adquirida pode avançar sem revalidar entrada em multiclasse: %s', edicao => {
  let ficha = fixture(edicao, 'guerreiro', 4);
  const mago = classe(ficha, 'mago');
  expect(ficha.selecionarClasseNoNivel(mago, 2)).toBe(true);
  ficha.atributosPersonagem.forca.valor = 10;
  ficha.atributosPersonagem.destreza.valor = 10;
  ficha = reabrir(ficha);
  expect(podeSelecionarClasse(ficha, classe(ficha, 'mago'), 4)).toBe(true);
  expect(ficha.selecionarClasseNoNivel(classe(ficha, 'mago'), 4)).toBe(true);
  expect(nivelDaClasse(reabrir(ficha), 'mago')).toBe(2);
  expect(ficha.selecionarClasseNoNivel(classe(ficha, 'clerigo'), 3)).toBe(false);
});

test('aumento já adquirido libera nova classe, inclusive após reabrir', () => {
  let ficha = fixture('DND_2024', 'guerreiro', 5);
  ficha.atributosPersonagem.inteligencia.valor = 12;
  expect(ficha.aplicarAumentoAtributos(4, ['inteligencia', 'carisma'])).toBe(true);
  ficha = reabrir(ficha);
  expect(ficha.selecionarClasseNoNivel(classe(ficha, 'mago'), 5)).toBe(true);
});

test.each(['DND_2014', 'DND_2024'])('ASI 19/20, atomicidade e reabertura %s', edicao => {
  let ficha = fixture(edicao); ficha.atributosPersonagem.forca.valor = 19;
  const before = exportFicha(ficha);
  expect(ficha.aplicarAumentoAtributos(4, ['forca', 'forca'])).toBe(false);
  expect(ficha.aplicarAumentoAtributos(4, ['forca'])).toBe(false);
  expect(exportFicha(ficha)).toBe(before);
  expect(ficha.aplicarAumentoAtributos(4, ['forca', 'destreza'])).toBe(true);
  ficha = reabrir(ficha);
  expect(calcularValorAtributoFinal(ficha, 'forca')).toBe(20);
  expect(ficha.aplicarAumentoAtributos(4, ['forca', 'forca'])).toBe(false);
  ficha.setLevelTotal(3);
  expect(calcularValorAtributoFinal(ficha, 'forca')).toBe(19);
  expect(ficha.aplicarAumentoAtributos(4, ['destreza', 'destreza'])).toBe(false);
  ficha = reabrir(ficha); ficha.setLevelTotal(4);
  expect(calcularValorAtributoFinal(ficha, 'forca')).toBe(20);
});
test('ASI retroativo considera aumentos posteriores e mantém exceções de outras fontes', () => {
  const ficha = fixture('DND_2024', 'guerreiro', 8); ficha.atributosPersonagem.forca.valor = 18;
  expect(ficha.aplicarAumentoAtributos(8, ['forca', 'forca'])).toBe(true);
  expect(erroASI(ficha, 4, ['forca', 'destreza'])).toMatch(/posteriores/);
  const manual = new Efeitos(); manual.atributo = 'carisma'; manual.bonus = 12; ficha.setEfeitos(manual);
  expect(calcularValorAtributoFinal(ficha, 'carisma')).toBe(25);
  expect(ficha.aplicarAumentoAtributos(4, ['destreza', 'destreza'])).toBe(true);
  expect(calcularValorAtributoFinal(ficha, 'carisma')).toBe(25);
});
test('trocar ASI/talento arquiva somente a escolha correspondente', () => {
  let ficha = fixture(); const manual = new Efeitos(); manual.level = 4; manual.tituloEfeito = 'anotação'; ficha.setEfeitos(manual);
  expect(ficha.aplicarAumentoAtributos(4, ['forca', 'forca'])).toBe(true);
  expect(ficha.selecionarTalentoAvanco(4, 'Habilidoso', ['Acrobacia', 'Atletismo', 'Furtividade'])).toBe(true);
  expect(calcularValorAtributoFinal(ficha, 'forca')).toBe(13);
  expect(ficha.efeitos.some(e => e.id === manual.id)).toBe(true);
  ficha = reabrir(ficha);
  expect(ficha.escolhasAnteriores.some(a => a.tipo === 'avanco:4' && a.valor.length === 2)).toBe(true);
  expect(ficha.aplicarAumentoAtributos(4, ['destreza', 'destreza'])).toBe(true);
  expect(ficha.efeitos.some(e => e.talento === 'Habilidoso')).toBe(false);
});

test('array incompleto, repetido, point buy inválido e origem inválida não concluem', () => {
  const ficha = fixture(); const base = JSON.stringify(ficha.atributosPersonagem);
  ficha.distribuicaoAtributos = standard(); ficha.distribuicaoAtributos.atributos.forca = 0;
  expect(ficha.concluirAtributos()).toBe(false);
  ficha.distribuicaoAtributos = standard(); ficha.distribuicaoAtributos.atributos.forca = 14;
  expect(ficha.concluirAtributos()).toBe(false);
  ficha.distribuicaoAtributos = { ...standard(), metodo: 'Point Buy', pontos: 0 };
  expect(ficha.concluirAtributos()).toBe(true); // standard array spends exactly 27
  ficha.distribuicaoAtributos.atributos.forca = 16;
  expect(ficha.concluirAtributos()).toBe(false);
  ficha.distribuicaoAtributos = standard(); ficha.distribuicaoAtributos.modo = 'dois'; ficha.distribuicaoAtributos.maior = 'forca'; ficha.distribuicaoAtributos.menor = 'forca';
  expect(ficha.concluirAtributos()).toBe(false);
  expect(base).toBeTruthy();
});
test('distribuição preserva base e não reaplica bônus depois de reabrir', () => {
  let ficha = fixture(); ficha.distribuicaoAtributos = standard();
  expect(erroDistribuicao(ficha)).toBeNull();
  expect(ficha.concluirAtributos()).toBe(true);
  const values = JSON.stringify(ficha.atributosPersonagem);
  ficha = reabrir(ficha);
  expect(ficha.concluirAtributos()).toBe(true);
  expect(JSON.stringify(ficha.atributosPersonagem)).toBe(values);
  ficha.distribuicaoAtributos = { ...standard(), metodo: 'Rolagem de Dados', gerados: [18, 18, 18, 18, 18, 18] };
  expect(ficha.concluirAtributos()).toBe(false);
});

test.each([['DND_2014', 3, 4], ['DND_2024', 2, 6]])('metamagia %s: entrada %s, total %s, sem duplicatas e reversível', (edicao, entrada, total) => {
  let ficha = fixture(edicao, 'feiticeiro', 20);
  const options = opcoesMetamagia(edicao);
  expect(ficha.selecionarMetamagia(entrada - 1, 0, options[0].nome)).toBe(false);
  expect(ficha.selecionarMetamagia(entrada, 0, options[0].nome)).toBe(true);
  expect(ficha.selecionarMetamagia(entrada, 1, options[0].nome)).toBe(false);
  const levels = edicao === 'DND_2024' ? [2, 2, 10, 10, 17, 17] : [3, 3, 10, 17];
  levels.forEach((level, i) => expect(ficha.selecionarMetamagia(level, i, options[i].nome)).toBe(true));
  expect(metamagiasNoNivel(ficha, 20)).toHaveLength(total);
  ficha.setLevelTotal(entrada - 1); ficha = reabrir(ficha);
  expect(metamagiasNoNivel(ficha, nivelDaClasse(ficha, 'feiticeiro'))).toHaveLength(0);
  expect(eventosMetamagia(ficha)).toHaveLength(total);
  ficha.setLevelTotal(20);
  expect(metamagiasNoNivel(ficha, nivelDaClasse(ficha, 'feiticeiro'))).toHaveLength(total);
});
test('2024 permite uma substituição por nível e conserva as quatro opções legadas', () => {
  let ficha = fixture('DND_2024', 'feiticeiro', 17);
  ficha.metamagica1 = { nome: 'Magia Acelerada', descricao: 'Texto antigo recuperável' };
  ficha.metamagica2 = { nome: 'Magia Aumentada', descricao: 'Texto antigo' };
  ficha.metamagica4 = { nome: 'Magia Distante', descricao: 'Escolha antiga de nível 17' };
  expect(ficha.selecionarMetamagia(3, 0, 'Magia Sutil')).toBe(true);
  expect(ficha.selecionarMetamagia(3, 1, 'Magia Cuidadosa')).toBe(false);
  expect(ficha.selecionarMetamagia(4, 1, 'Magia Cuidadosa')).toBe(true);
  ficha = reabrir(ficha);
  expect(ficha.metamagica1.descricao).toBe('Texto antigo recuperável');
  expect(metamagiasNoNivel(ficha, 2).find(m => m.slot === 0).nome).toBe('Magia Acelerada');
  expect(metamagiasNoNivel(ficha, 17).find(m => m.slot === 4).nome).toBe('Magia Distante');
});
test('patrono 2014 selecionado imediatamente; 2024 preserva legado sem ativar controle', () => {
  const ficha = fixture('DND_2014', 'bruxo', 1);
  expect(ficha.setPatrono({ nome: 'Primeiro' })).toBe(true);
  expect(ficha.setPatrono({ nome: 'Segundo' })).toBe(true);
  expect(reabrir(ficha).patrono.nome).toBe('Segundo');
  expect(ficha.escolhasAnteriores.find(a => a.tipo === 'patrono').valor.nome).toBe('Primeiro');
  const revised = fixture('DND_2024', 'bruxo', 3); revised.patrono = { nome: 'Legado' };
  expect(revised.setPatrono({ nome: 'Indevido' })).toBe(false);
  expect(reabrir(revised).patrono.nome).toBe('Legado');
});

let api;
function Probe() { api = useFicha(); return null; }
function mount(ficha, children) {
  const values = new Map([['fichas', serializeCollection([ficha], ficha.id)]]);
  return render(<FichaProvider storage={{ getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) }}><Probe />{children}</FichaProvider>);
}
const tick = fn => act(async () => { fn(); await Promise.resolve(); });
test.each(['DND_2014', 'DND_2024'])('UI permite entrar em outra classe no nível 2 com atributos válidos: %s', async edicao => {
  const ficha = fixture(edicao, 'paladino', 2);
  mount(ficha, <NivelBlock nivel={2} classesDisponiveis={getRulesetData(edicao).classes}
    selecionarMulticlasse={(c, n) => api.ficha.selecionarClasseNoNivel(c, n)} />);
  await tick(() => fireEvent.click(screen.getByRole('button', { name: /Selecionar Classe/ })));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('button', { name: 'Mago', exact: true })).toBeInTheDocument();
  await tick(() => fireEvent.click(within(dialog).getByRole('button', { name: 'Mago', exact: true })));
  await tick(() => fireEvent.click(within(dialog).getByRole('button', { name: 'Escolher Mago' })));
  expect(nivelDaClasse(api.ficha, 'mago')).toBe(1);
});
test.each(['DND_2014', 'DND_2024'])('UI de talento no nível 4 exibe opções: %s', async edicao => {
  const ficha = fixture(edicao, 'paladino', 4);
  mount(ficha, <NivelBlock nivel={4} classesDisponiveis={getRulesetData(edicao).classes} selecionarMulticlasse={() => {}} />);
  await tick(() => fireEvent.click(screen.getByRole('checkbox', { name: 'Talento', exact: true })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Selecionar Talento' })));
  expect(within(screen.getByRole('dialog')).getByRole('button', { name: /^Alerta$/i })).toBeInTheDocument();
  await tick(() => fireEvent.click(screen.getByRole('button', { name: /^Alerta$/i })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: /^Escolher Alerta$/i })));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(api.ficha.efeitos.some(e => /^alerta$/i.test(e.talento))).toBe(true);
});
test('modal mantém classes visíveis e explica requisitos da classe de origem', async () => {
  const ficha = fixture('DND_2014', 'paladino', 2);
  ficha.atributosPersonagem.carisma.valor = 12;
  mount(ficha, <NivelBlock nivel={2} classesDisponiveis={getRulesetData('DND_2014').classes} selecionarMulticlasse={() => {}} />);
  await tick(() => fireEvent.click(screen.getByRole('button', { name: /Selecionar Classe/ })));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Mago', exact: true })));
  expect(screen.getByRole('button', { name: 'Escolher Mago' })).toBeDisabled();
  expect(screen.getByText(/Paladino exige Força 13 e Carisma 13/)).toHaveTextContent('carisma: 12');
});
test.each(['DND_2014', 'DND_2024'])('paladino só exibe seleção de subclasse no nível de entrada: %s', edicao => {
  const ficha = fixture(edicao, 'paladino', 5);
  const props = { classesDisponiveis: getRulesetData(edicao).classes, selecionarMulticlasse: () => {} };
  const view = mount(ficha, <NivelBlock {...props} nivel={3} />);
  expect(screen.getByRole('button', { name: /Selecionar.*Juramento|Selecionar.*Subclasse/ })).toBeInTheDocument();
  view.unmount();
  mount(ficha, <><NivelBlock {...props} nivel={4} /><NivelBlock {...props} nivel={5} /></>);
  expect(screen.queryByRole('button', { name: /Selecionar.*Juramento|Selecionar.*Subclasse/ })).not.toBeInTheDocument();
});
test('UI ASI só aplica distribuição completa e válida', async () => {
  const ficha = fixture(); ficha.atributosPersonagem.forca.valor = 19;
  mount(ficha, <AvancoAtributos nivel={4} />);
  expect(screen.getByRole('button', { name: 'Aplicar aumento' })).toBeDisabled();
  await tick(() => fireEvent.change(screen.getByLabelText('Aumento 1'), { target: { value: 'forca' } }));
  await tick(() => fireEvent.change(screen.getByLabelText('Aumento 2'), { target: { value: 'forca' } }));
  expect(screen.getByRole('button', { name: 'Aplicar aumento' })).toBeDisabled();
  await tick(() => fireEvent.change(screen.getByLabelText('Aumento 2'), { target: { value: 'destreza' } }));
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Aplicar aumento' })));
  expect(calcularValorAtributoFinal(api.ficha, 'forca')).toBe(20);
});
test('UI não conclui array zerado', async () => {
  const ficha = fixture(); ficha.distribuicaoAtributos = standard(); ficha.distribuicaoAtributos.atributos.forca = 0; ficha.distribuicaoAtributos.valores = [15];
  mount(ficha, <LevelOneSetup raca={ficha.racaPrincipal} classe={ficha.classePrincipal} />);
  await tick(() => fireEvent.click(screen.getByRole('button', { name: 'Distribuir Atributos' })));
  expect(screen.getByRole('button', { name: 'Concluir' })).toBeDisabled();
});
test('UI 2024 oferece duas metamagias no nível 2', () => {
  const ficha = fixture('DND_2024', 'feiticeiro', 2);
  mount(ficha, <NivelBlock nivel={2} classesDisponiveis={getRulesetData('DND_2024').classes} selecionarMulticlasse={() => {}} />);
  expect(screen.getByLabelText('Metamagia 1')).toBeInTheDocument();
  expect(screen.getByLabelText('Metamagia 2')).toBeInTheDocument();
  expect(screen.queryByText('Selecionar Patrono')).not.toBeInTheDocument();
});
test.each(['DND_2014', 'DND_2024'])('UI libera ASI para as doze classes %s no nível 4', edicao => {
  for (const c of getRulesetData(edicao).classes) {
    const ficha = fixture(edicao, chaveClasse(c));
    const view = mount(ficha, <NivelBlock nivel={4} classesDisponiveis={getRulesetData(edicao).classes} selecionarMulticlasse={() => {}} />);
    expect(screen.getByLabelText('Aumento 1')).toBeInTheDocument();
    view.unmount();
  }
});
test('multiclasse Bruxo 2024 não mostra patrono no primeiro nível da classe e libera subclasse no terceiro', () => {
  const ficha = fixture('DND_2024', 'guerreiro', 4);
  for (const n of [2, 3, 4]) ficha.selecionarClasseNoNivel(classe(ficha, 'bruxo'), n);
  let view = mount(ficha, <NivelBlock nivel={2} classesDisponiveis={getRulesetData('DND_2024').classes} selecionarMulticlasse={() => {}} />);
  expect(screen.queryByRole('button', { name: /Selecionar Patrono/ })).not.toBeInTheDocument();
  view.unmount();
  view = mount(ficha, <NivelBlock nivel={4} classesDisponiveis={getRulesetData('DND_2024').classes} selecionarMulticlasse={() => {}} />);
  expect(screen.getByRole('button', { name: /Selecionar seu Patrono/ })).toBeInTheDocument();
});
test('trocar origem preserva perícias de classe e dados da origem anterior', () => {
  const ficha = fixture(); ficha.pericias = [...ficha.backGround.proeficienciasHabilidades, 'Atletismo', 'Perícia manual'];
  ficha.setBackGround({ nome: 'Outra origem', proeficienciasHabilidades: ['Atuação'] });
  expect(ficha.pericias).toEqual(expect.arrayContaining(['Atletismo', 'Perícia manual', 'Atuação']));
  expect(ficha.escolhasAnteriores.some(e => e.tipo === 'origem')).toBe(true);
});
