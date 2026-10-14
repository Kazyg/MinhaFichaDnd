import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { getMagiasConteudo } from '../rulesets/conteudo';
import { chaveClasse } from '../rulesets/progressao';
import { espacosDaFonte } from '../rulesets/conjuracao';
import { adicionarMagia, buscarMagia, listasMagias, migrarMagias, pendenciasMagia, prepararMagia, removerMagia, revisarFonteMagia, selecionarEscolhasMagia, selecionarFontesConjuracao, selecionarPoolsMagia, validarEscolhaMagia } from './fichaConjuracao';
import { exportFicha, parseImport, hydrateFicha, persist, serializeCollection, STORAGE_KEY } from './fichaStorage';
import AbaMagias from '../../pages/components/components_inventario/AbaMagias';
import ModalMagias from '../../pages/modals/ModalMagias';

let mockFicha;
const mockForceUpdate = jest.fn();
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: mockForceUpdate, refreshKey: 0 }) }));
function fixture(edicao, classes, arcana) {
  const f = new Ficha({ versaoRegras: edicao, atributosPersonagem: new Atributos(14,14,14,16,10,14), levelTotal: classes.reduce((s, c) => s + c[1], 0) });
  let posicao = 1;
  f.multiclasses = classes.map(([chave, nivel]) => {
    const classe = getRulesetData(edicao).classes.find(c => chaveClasse(c) === chave);
    const nivelEscolhido = Array.from({ length: nivel }, () => posicao++);
    return { id: chave, classe, nivelEscolhido, nivelClasse: nivel };
  });
  f.classePrincipal = f.multiclasses[0].classe;
  if (arcana) {
    const classe = f.multiclasses.find(m => ['guerreiro', 'ladino'].includes(chaveClasse(m.classe))).classe;
    f.subClasse = [{ classe, subclasse: classe.subClasse.find(s => /Cavaleiro (Arcano|Místico)|Trapaceiro Arcano/.test(s.nome)) }];
  }
  return f;
}
const fonte = (f, chave) => selecionarFontesConjuracao(f).find(s => s.chave === chave);
const roundtrip = f => parseImport(exportFicha(f));
const resumo = f => ({ fontes: selecionarFontesConjuracao(f), pools: selecionarPoolsMagia(f), escolhas: selecionarEscolhasMagia(f) });

test.each([
  ['DND_2024', [['paladino',1]], [2]],
  ['DND_2014', [['paladino',3]], [3]],
  ['DND_2024', [['mago',1],['paladino',1]], [3]],
  ['DND_2014', [['mago',1],['paladino',2]], [3]],
  ['DND_2014', [['mago',1],['paladino',1]], [2]],
  ['DND_2024', [['mago',5]], [4,3,2]],
  ['DND_2014', [['mago',5]], [4,3,2]],
  ['DND_2014', [['paladino',3],['guerreiro',1]], [3]],
  ['DND_2024', [['mago',1],['paladino',3]], [4,2]],
  ['DND_2014', [['mago',1],['paladino',3]], [3]],
])('%s %j: tabela correta e equivalência antes/depois de JSON', (edicao, classes, esperado) => {
  const f = fixture(edicao, classes);
  const antes = JSON.stringify(f);
  expect(selecionarPoolsMagia(f)[0].espacos).toEqual(esperado);
  expect(resumo(JSON.parse(antes))).toEqual(resumo(f));
  expect(resumo(roundtrip(f))).toEqual(resumo(f));
  expect(JSON.stringify(f)).toBe(antes);
});

test.each(['DND_2014', 'DND_2024'])('Bruxo3 %s: Pacto separado mesmo junto de Mago5', edicao => {
  const f = fixture(edicao, [['bruxo',3]]);
  expect(selecionarPoolsMagia(f)).toEqual([expect.objectContaining({ espacos: [0,2], recuperacao: 'Descanso curto ou longo' })]);
  expect(fonte(f, 'bruxo')).toMatchObject({ magias: 4, truques: 2, circuloMaximo: 2 });
  const multic = fixture(edicao, [['mago',5],['bruxo',3]]);
  expect(selecionarPoolsMagia(multic).map(p => p.espacos)).toEqual([[4,3,2],[0,2]]);
  expect(resumo(roundtrip(multic))).toEqual(resumo(multic));
  expect(resumo(roundtrip(f))).toEqual(resumo(f));
});

test.each(['DND_2014','DND_2024'].flatMap(e => ['guerreiro','ladino'].flatMap(c => [3,4,7,10,13,16,19,20].map(n => [e,c,n]))))('subclasse %s %s%d: fonte própria, INT, tabela e JSON', (edicao, chave, nivel) => {
  const f = fixture(edicao, [[chave,nivel]], true);
  const esperado = nivel === 3 ? [2] : nivel === 4 ? [3] : nivel === 7 ? [4,2] : nivel === 10 ? [4,3] : nivel === 13 ? [4,3,2] : nivel === 16 ? [4,3,3] : [4,3,3,1];
  expect(fonte(f,chave)).toMatchObject({ atributo: 'inteligencia', lista: 'mago', espacos: esperado, categoria: edicao === 'DND_2014' ? 'conhecida' : 'preparada' });
  expect(resumo(roundtrip(f))).toEqual(resumo(f));
  expect(resumo(JSON.parse(JSON.stringify(f)))).toEqual(resumo(f));
  f.levelTotal = 2;
  expect(selecionarFontesConjuracao(f)).toEqual([]);
});

test('multiclasse arcana usa terço arredondado para baixo; uma só fonte usa sua tabela', () => {
  const f = fixture('DND_2024', [['guerreiro',4],['mago',1]], true);
  expect(selecionarPoolsMagia(f)[0].espacos).toEqual([3]);
  expect(fonte(f, 'guerreiro').espacos).toEqual([3]);
});

test('Mago2014 INT16/SAB10 prepara4: livro, cópias e truques independentes', () => {
  const f = fixture('DND_2014', [['mago',1]]);
  const s = fonte(f, 'mago');
  expect(s).toMatchObject({ magias: 4, truques: 3, livroPorProgressao: 6, cd: 13, ataque: 5 });
  const magias = listasMagias.mago.filter(m => m.nivel === 1).slice(0,7);
  magias.slice(0,4).forEach(m => expect(adicionarMagia(f,s.id,m.nome)).toBeNull());
  expect(f.magiasConjuracao.every(m => m.preparada)).toBe(true);
  const cheio = exportFicha(f);
  expect(adicionarMagia(f,s.id,magias[4].nome)).toMatch(/limite de 4 magias/);
  expect(adicionarMagia(f,s.id,magias[4].nome,'copia')).toMatch(/limite de 4 magias/);
  expect(exportFicha(f)).toBe(cheio);
  expect(adicionarMagia(f,s.id,'Luz')).toBeNull();
  expect(adicionarMagia(f,s.id,'Desejo')).toMatch(/1º círculo/);
  expect(resumo(roundtrip(f))).toEqual(resumo(f));
  f.magiasConjuracao[0].preparada = false;
  expect(adicionarMagia(f,s.id,magias[4].nome,'copia')).toBeNull();
  expect(adicionarMagia(f,s.id,magias[0].nome)).toMatch(/limite de 4/);
  f.magiasConjuracao[1].preparada = false;
  const quantidadeLivro = f.magiasConjuracao.length;
  expect(adicionarMagia(f,s.id,magias[0].nome)).toBeNull();
  expect(f.magiasConjuracao).toHaveLength(quantidadeLivro);
  expect(f.magiasConjuracao[0].preparada).toBe(true);
});

test('atributos finais F5 e nível ativo F4 definem preparação/CD; consultas não alteram ordem', () => {
  const f = fixture('DND_2014', [['mago',5]]);
  f.multiclasses[0].nivelEscolhido.reverse();
  f.efeitos = [Object.assign(new Efeitos(), { atributo: 'inteligencia', bonus: 2, level: 4 })];
  const antes = JSON.stringify(f);
  expect(fonte(f,'mago')).toMatchObject({ magias: 9, cd: 15 });
  expect(JSON.stringify(f)).toBe(antes);
  f.levelTotal = 1;
  expect(fonte(f,'mago')).toMatchObject({ magias: 4, cd: 13 });
});

test('mesma magia em duas fontes; exclusão por origem; slots altos não liberam aprendizado', () => {
  const f = fixture('DND_2024', [['mago',1],['clerigo',4]]);
  expect(selecionarPoolsMagia(f)[0].espacos).toEqual([4,3,2]);
  expect(f.setMagiaEscolhidas({ classe: 'Mago', magia: 'Luz' })).toBeNull();
  expect(f.setMagiaEscolhidas({ classe: 'Clerigo', magia: 'Luz' })).toBeNull();
  expect(f.magiasConjuracao).toHaveLength(2);
  expect(f.setMagiaEscolhidas({ classe: 'Mago', magia: 'Desejo' })).toMatch(/1º círculo/);
  expect(f.setMagiaEscolhidas({ classe: 'Mago', magia: 'Luz' })).toMatch(/já escolheu/);
  expect(f.excluirMagiaEscolhidas('Luz')).toBe(false);
  const reaberta = roundtrip(f);
  removerMagia(reaberta, reaberta.magiasConjuracao[0].id);
  expect(reaberta.magiasConjuracao).toHaveLength(1);
  expect(reaberta.magiasConjuracao[0].classe).toBe('Clerigo');
  expect(reaberta.escolhasAnteriores).toHaveLength(1);
});

test('migração não apaga ilegais, desconhecidas ou fonte ambígua; mantém snapshot e é idempotente', () => {
  const f = fixture('DND_2014', [['mago',1],['guerreiro',3]], true);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Luz','Desejo','Magia caseira'] }];
  const original = JSON.stringify(f.magiasEscolhidas);
  const reaberta = roundtrip(f);
  expect(reaberta.magiasConjuracao).toHaveLength(3);
  expect(reaberta.magiasConjuracao.every(e => e.fonte === 'legado:Mago')).toBe(true);
  expect(pendenciasMagia(reaberta,reaberta.magiasConjuracao[0]).join()).toMatch(/ambígua/);
  expect(JSON.stringify(reaberta.magiasEscolhidas)).toBe(original);
  expect(roundtrip(reaberta)).toEqual(reaberta);
  const apenas = fixture('DND_2014', [['mago',1]]);
  apenas.magiasEscolhidas = f.magiasEscolhidas;
  migrarMagias(apenas);
  expect(pendenciasMagia(apenas,apenas.magiasConjuracao[1]).join()).toMatch(/1º círculo/);
  expect(pendenciasMagia(apenas,apenas.magiasConjuracao[2]).join()).toMatch(/ainda não está disponível no catálogo/);
});

test('persistência cria backup permanente F6 e rejeita formato inválido sem descartá-lo', () => {
  const f = fixture('DND_2014', [['mago',1]]);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Desejo'] }];
  const anterior = serializeCollection([f]);
  const reaberta = hydrateFicha(f);
  const proximo = serializeCollection([reaberta]);
  const values = new Map([[STORAGE_KEY, anterior]]);
  const storage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) };
  persist(storage, anterior, proximo);
  expect(values.get('fichas.backup.F6-conjuracao-v1')).toBe(anterior);
  persist(storage, proximo, proximo);
  expect(values.get('fichas.backup.F6-conjuracao-v1')).toBe(anterior);
  const invalid = JSON.parse(JSON.stringify(reaberta));
  invalid.magiasConjuracao[0].nivel = 10;
  expect(() => hydrateFicha(invalid)).toThrow(/magiasConjuracao/);
});

test('revisão explícita de fonte mantém ID, arquiva origem anterior e rejeita revisão ilegal', () => {
  const f = fixture('DND_2014', [['mago',1],['guerreiro',3]], true);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Luz','Desejo'] }];
  migrarMagias(f);
  const original = { ...f.magiasConjuracao[0] };
  expect(revisarFonteMagia(f, original.id, fonte(f,'guerreiro').id)).toBeNull();
  expect(f.magiasConjuracao[0]).toMatchObject({ id: original.id, categoria: 'truque', classe: 'Guerreiro', fonte: fonte(f,'guerreiro').id });
  expect(f.escolhasAnteriores[0].valor).toEqual(original);
  expect(revisarFonteMagia(f, f.magiasConjuracao[1].id, fonte(f,'mago').id)).toMatch(/1º círculo/);
  expect(resumo(roundtrip(f))).toEqual(resumo(f));
});

test('preparar não aceita registro migrado de outra lista nem círculo adulterado', () => {
  const f = fixture('DND_2014', [['mago',1]]);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Curar Ferimentos','Desejo'] }];
  migrarMagias(f);
  expect(prepararMagia(f, f.magiasConjuracao[0].id, true)).toMatch(/Revise a lista/);
  f.magiasConjuracao[1].nivel = 1;
  expect(prepararMagia(f, f.magiasConjuracao[1].id, true)).toMatch(/Revise a lista/);
  expect(pendenciasMagia(f,f.magiasConjuracao[1]).join()).toMatch(/Círculo salvo/);
});

test('falha no backup F6 impede a gravação principal', () => {
  const f = fixture('DND_2014', [['mago',1]]);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Luz'] }];
  const previous = serializeCollection([f]);
  const next = serializeCollection([hydrateFicha(f)]);
  const storage = { getItem: k => k === STORAGE_KEY ? previous : null, setItem: jest.fn() };
  expect(() => persist(storage,previous,next)).toThrow(/backup da migração F6/);
  expect(storage.setItem).not.toHaveBeenCalledWith(STORAGE_KEY, next);
});

test.each([
  ['DND_2014','paladino',3,3], ['DND_2024','paladino',1,2],
  ['DND_2024','mago',5,9], ['DND_2024','feiticeiro',2,4],
  ['DND_2014','feiticeiro',5,6], ['DND_2014','bardo',5,8],
  ['DND_2024','bardo',5,9], ['DND_2024','clerigo',5,9], ['DND_2024','druida',5,9],
  ['DND_2014','patrulheiro',3,3], ['DND_2024','patrulheiro',3,4],
])('limites independentes %s %s%d = %d', (edicao, chave, nivel, limite) => {
  expect(fonte(fixture(edicao,[[chave,nivel]]),chave).magias).toBe(limite);
});

test('subclasses 2014 limitam escolas; 2024 não; Mãos Mágicas tem vaga reservada', () => {
  for (const edicao of ['DND_2014','DND_2024']) {
    const f = fixture(edicao, [['guerreiro',3]], true);
    const s = fonte(f,'guerreiro');
    const livres = getMagiasConteudo(edicao).filter(m => m.listas.includes('mago') && m.nivel === 1 && !['abjuração','evocação'].includes(m.tipo));
    expect(adicionarMagia(f,s.id,livres[0].nome)).toBeNull();
    expect(!!adicionarMagia(f,s.id,livres[1].nome)).toBe(edicao === 'DND_2014');
  }
  const f = fixture('DND_2024', [['ladino',3]], true);
  const s = fonte(f,'ladino');
  const truques = getMagiasConteudo('DND_2024').filter(m => m.listas.includes('mago') && m.nivel === 0 && m.nome !== 'Mãos Mágicas');
  truques.slice(0,2).forEach(m => expect(adicionarMagia(f,s.id,m.nome)).toBeNull());
  expect(adicionarMagia(f,s.id,truques[2].nome)).toMatch(/precisa escolher Mãos Mágicas/);
  expect(adicionarMagia(f,s.id,'Mãos Mágicas')).toBeNull();
});

test.each(['DND_2014','DND_2024'])('20 níveis %s: tabelas de slots das classes existentes concordam com o motor', edicao => {
  for (const chave of ['bardo','clerigo','druida','feiticeiro','mago','paladino','patrulheiro']) {
    const c = getRulesetData(edicao).classes.find(c => chaveClasse(c) === chave);
    for (const row of c.niveis) {
      const slots = espacosDaFonte(row.nivel, ['paladino','patrulheiro'].includes(chave) ? 'meia' : 'completa', edicao);
      expect(slots.concat(Array(9-slots.length).fill(0))).toEqual(row.espacosMagia.concat(Array(9-row.espacosMagia.length).fill(0)));
    }
  }
});

test('UI exibe espaços sem magias escolhidas e Pacto separado; render não grava', () => {
  mockFicha = fixture('DND_2024', [['mago',5],['bruxo',3]]);
  const antes = JSON.stringify(mockFicha);
  render(<AbaMagias />);
  expect(screen.getByRole('region', { name: 'Conjuração' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Magia de Pacto — Bruxo' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Conjuração, círculo 3, espaço/ })).toHaveLength(2);
  expect(JSON.stringify(mockFicha)).toBe(antes);
});

test('modal bloqueia Desejo no nível1, preserva filtro de truque e permite fonte explícita', () => {
  mockFicha = fixture('DND_2014', [['mago',1],['clerigo',1]]);
  const onSelect = jest.fn();
  const antes = JSON.stringify(listasMagias);
  render(<ModalMagias titulo="Seleção" magiaSelect="" onClose={jest.fn()} onSelect={onSelect} />);
  expect(screen.queryByText(/Catálogo parcial|Fonte de conjuração/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Desejo' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Luz'));
  fireEvent.change(screen.getByLabelText('Aprender por'), { target: { value: fonte(mockFicha,'clerigo').id } });
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Luz' }));
  expect(onSelect).toHaveBeenCalledWith('Luz',fonte(mockFicha,'clerigo').id,'progressao');
  expect(JSON.stringify(listasMagias)).toBe(antes);
  expect(buscarMagia('Desejo').nivel).toBe(9);
  expect(validarEscolhaMagia(mockFicha,fonte(mockFicha,'mago').id,'Desejo')).toMatch(/1º círculo/);
});


test.each(['DND_2014', 'DND_2024'])('cards %s: fontes, círculos, ataque, dano e preparação', edicao => {
  mockFicha = fixture(edicao, [['mago', 5]]);
  const mago = fonte(mockFicha, 'mago');
  expect(adicionarMagia(mockFicha, mago.id, 'Raio de Fogo')).toBeNull();
  expect(adicionarMagia(mockFicha, mago.id, 'Bola de Fogo')).toBeNull();
  render(<AbaMagias />);
  const truques = screen.getByRole('region', { name: 'Conjuração, Truques' });
  expect(within(truques).queryByRole('button', { name: /espaço/ })).not.toBeInTheDocument();
  const raio = within(truques).getByRole('article', { name: 'Raio de Fogo' });
  expect(within(raio).getByText('Ataque +6')).toBeInTheDocument();
  expect(within(raio).getByText('2d10')).toBeInTheDocument();
  const bola = within(screen.getByRole('region', { name: 'Conjuração, Círculo 3' })).getByRole('article', { name: 'Bola de Fogo' });
  expect(within(bola).getByText('8d6')).toBeInTheDocument();
  expect(within(bola).getByText('CD 14 · Destreza')).toBeInTheDocument();
  expect(within(bola).queryByText(/Ataque/)).not.toBeInTheDocument();
  expect(selecionarEscolhasMagia(mockFicha).find(e => e.nome === 'Bola de Fogo').preparada).toBe(true);
  expect(within(bola).queryByRole('button', { name: /Preparar|Despreparar|Arquivar|Consultar catálogo/, hidden:true })).not.toBeInTheDocument();
  expect(bola.textContent).not.toMatch(/licença|legado-local|Revisão pendente|Dados de combate|Fonte:/);
});

test.each([['DND_2014', '1d8', '2d8'], ['DND_2024', '2d8', '4d8']])('cura %s respeita edição e círculo escolhido', (edicao, base, acima) => {
  mockFicha = fixture(edicao, [['clerigo', 3]]);
  expect(adicionarMagia(mockFicha, fonte(mockFicha, 'clerigo').id, 'Curar Ferimentos')).toBeNull();
  render(<AbaMagias />);
  const card = screen.getByRole('article', { name: 'Curar Ferimentos' });
  expect(within(card).getByText(base)).toBeInTheDocument();
  fireEvent.change(within(card).getByLabelText('Conjurar no círculo'), { target: { value: '2' } });
  expect(within(card).getByText(acima)).toBeInTheDocument();
  expect(within(card).queryByText(/Ataque/)).not.toBeInTheDocument();
});

test('cards preservam registros inativos e desconhecidos sem inventar fórmulas', () => {
  mockFicha = fixture('DND_2024', [['mago', 4]]);
  mockFicha.magiasConjuracao = [
    { id: 'desconhecida', nome: 'Registro antigo', fonte: 'legado', classe: 'Antiga', nivel: null, categoria: 'pendente', edicao: 'DND_2014', catalogo: 'catalogo-2014' },
    { id: 'alta', nome: 'Desejo', fonte: 'legado', classe: 'Antiga', nivel: 9, categoria: 'livro', edicao: 'DND_2014', catalogo: 'catalogo-2014' },
  ];
  const antes = JSON.stringify(mockFicha);
  render(<AbaMagias />);
  expect(within(screen.getByRole('region', { name: 'Magias pendentes de revisão' })).getByRole('article', { name: 'Registro antigo' })).toBeInTheDocument();
  expect(within(screen.getByRole('region', { name: 'Conjuração, Círculo 9' })).getByRole('article', { name: 'Desejo' })).toBeInTheDocument();
  expect(document.querySelector('.magia-card-valores strong')).toBeNull();
  expect(JSON.stringify(mockFicha)).toBe(antes);
});

test.each(['DND_2014','DND_2024'])('Mísseis Mágicos %s aparece preparado, com dano por dardo e contador consistente', edicao => {
  mockFicha = fixture(edicao,[['mago',4]]);
  const mago = fonte(mockFicha,'mago');
  expect(adicionarMagia(mockFicha,mago.id,'Mísseis Mágicos')).toBeNull();
  render(<AbaMagias />);
  expect(screen.getByText(`Preparadas 1/${mago.magias}`)).toBeInTheDocument();
  const card = screen.getByRole('article',{ name:'Mísseis Mágicos' });
  expect(within(card).getByText('1d4 + 1')).toBeInTheDocument();
  expect(within(card).getByText('Energia')).toBeInTheDocument();
  expect(within(card).getByRole('button',{ name:'Dardos: 3' })).toBeInTheDocument();
  expect(within(card).getByRole('button',{ name:'Acerto automático' })).toBeInTheDocument();
  expect(within(card).queryByText(/Ataque \+|CD \d/)).not.toBeInTheDocument();
  expect(within(card).queryByRole('button',{ name:/Preparar|Despreparar|Consultar catálogo|Arquivar/, hidden:true })).not.toBeInTheDocument();
  expect(card.textContent).not.toMatch(/F7|licença|Revisão pendente|catalogo-|consulta 20|Dados de combate/);
  fireEvent.change(within(card).getByLabelText('Conjurar no círculo'),{ target:{ value:'2' } });
  expect(within(card).getByRole('button',{ name:'Dardos: 4' })).toBeInTheDocument();
  expect(within(card).getByText('1d4 + 1')).toBeInTheDocument();
  expect(mockFicha.recursos.slots).toEqual({});
});


test.each(['DND_2014', 'DND_2024'])('mensagens simples distinguem catálogo, classe e limites em %s', edicao => {
  const f = fixture(edicao, [['mago',1]]);
  const s = fonte(f, 'mago');
  const catalogo = getMagiasConteudo(edicao);
  const incompat = catalogo.find(m => m.selecionavel !== false && !m.listas.includes('mago'));
  expect(incompat).toBeDefined();
  expect(validarEscolhaMagia(f,s.id,incompat.nome)).toBe('Esta magia não está disponível para sua classe.');
  expect(validarEscolhaMagia(f,s.id,'Magia inexistente')).toBe(`Esta magia ainda não está disponível no catálogo da versão ${edicao.replace('DND_', '')}.`);
  expect(validarEscolhaMagia(f,'inativa','Luz')).toBe('Não foi possível identificar a origem desta magia.');
  expect(validarEscolhaMagia(f,s.id,'Desejo')).toBe('Você só pode escolher magias até o 1º círculo.');
  const truques = catalogo.filter(m => m.selecionavel !== false && m.listas.includes('mago') && m.nivel === 0);
  truques.slice(0,s.truques).forEach(m => expect(adicionarMagia(f,s.id,m.nome)).toBeNull());
  expect(validarEscolhaMagia(f,s.id,truques[0].nome)).toBe('Você já escolheu esta magia.');
  expect(validarEscolhaMagia(f,s.id,truques[s.truques].nome)).toBe(`Você já atingiu o limite de ${s.truques} truques.`);
  const magias = catalogo.filter(m => m.selecionavel !== false && m.listas.includes('mago') && m.nivel === 1);
  magias.slice(0,s.magias).forEach(m => expect(adicionarMagia(f,s.id,m.nome)).toBeNull());
  expect(validarEscolhaMagia(f,s.id,magias[s.magias].nome)).toBe(`Você já atingiu o limite de ${s.magias} magias.`);
});

test.each(['DND_2014', 'DND_2024'])('modal filtra por fonte e círculo sem esconder validação em %s', edicao => {
  mockFicha = fixture(edicao, [['mago',1],['clerigo',4]]);
  render(<ModalMagias titulo="Escolher magia" onClose={jest.fn()} onSelect={jest.fn()} magiaSelect="" />);
  const s = fonte(mockFicha,'mago');
  const catalogo = getMagiasConteudo(edicao);
  const nomesVisiveis = screen.getAllByRole('button').map(b => b.textContent);
  catalogo.filter(m => m.selecionavel !== false).forEach(m => {
    expect(nomesVisiveis.includes(m.nome)).toBe(m.listas.includes(s.lista) && m.nivel <= s.circuloMaximo);
  });
  expect(adicionarMagia(mockFicha,s.id,'Luz')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Luz'}));
  const aviso = screen.getByRole('status');
  expect(aviso).toHaveTextContent('Você já escolheu esta magia.');
  expect(screen.getByRole('button',{name:'Escolher Luz'})).toHaveAttribute('aria-describedby', 'erro-magia');
  expect(screen.getByRole('button',{name:'Escolher Luz'})).toBeDisabled();
  fireEvent.change(screen.getByRole('combobox',{name:'Aprender por'}), {target:{value:fonte(mockFicha,'clerigo').id}});
  expect(screen.getByRole('button',{name:'Escolher Luz'})).toBeEnabled();
  const nomesClerigo = screen.getAllByRole('button').map(b => b.textContent);
  catalogo.filter(m => m.selecionavel !== false).forEach(m => {
    expect(nomesClerigo.includes(m.nome)).toBe(m.listas.includes('clerigo') && m.nivel <= 2);
  });
});
