import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PDFDocument, PDFPage } from 'pdf-lib';
import fs from 'fs';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { chaveClasse } from '../rulesets/progressao';
import { exportFicha, parseImport } from './fichaStorage';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { selecionarVida, selecionarCA, selecionarArma, selecionarIniciativa, selecionarDeslocamento, selecionarPericia, selecionarClassesAtivas } from './fichaSeletores';
import { gerarFichaPdf, obterNivelClasses } from '../../utils/exportarFichaPdf';
import InformacoesPersonagem from '../../pages/components/InformacoesPersonagem';
import PericiasEOutros from '../../pages/components/PericiasEOutros';
import { Elfo } from '../classesFilhos/Elfo.class';
import { ElfoFloresta } from '../classesNetos/ElfoFloresta.class';
import { ElfoAlto } from '../classesNetos/ElfoAlto.class';

let mockFicha;
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, refreshKey: 0, forceUpdate: jest.fn() }) }));
const classe = (f, chave) => getRulesetData(f.versaoRegras).classes.find(c => chaveClasse(c) === chave);
function fixture(edicao = 'DND_2014', chave = 'guerreiro', nivel = 5) {
  const f = new Ficha({ versaoRegras: edicao, levelTotal: nivel, atributosPersonagem: new Atributos(14, 14, 14, 14, 14, 14) });
  f.classePrincipal = classe(f, chave);
  for (let n = 1; n <= nivel; n++) f.selecionarClasseNoNivel(f.classePrincipal, n);
  return f;
}
function efeito(f, dados) { const e = Object.assign(new Efeitos(), dados); f.setEfeitos(e); return e; }
const escudo = { id: 'escudo', nome: 'Escudo', categoria: 'Escudos', ac: 2 };
const armadura = (categoria, ac) => ({ id: categoria, nome: categoria, categoria, ac });
const espada = { id: 'espada', nome: 'Espada', categoria: 'Armas Marciais', dano: { dano_1: '1d8', dano_2: '1d10' }, dano_atributo: ['Força'], dano_tipo: 'Cortante', propriedades: 'Versátil', distancia: 'não' };

test('Guerreiro5/CON14: PV44, retroatividade, máximo manual e importação sem mutação da base', () => {
  const f = fixture();
  const antes = JSON.stringify(f);
  expect(selecionarVida(f).total).toBe(44);
  expect(JSON.stringify(f)).toBe(antes);
  efeito(f, { atributo: 'constituicao', bonus: 2, level: 4 });
  expect(selecionarVida(f).total).toBe(49);
  f.levelTotal = 3;
  expect(selecionarVida(f).total).toBe(28);
  f.setVidaTotal(51);
  expect(selecionarVida(parseImport(exportFicha(f))).total).toBe(51);
  expect(f.atributosPersonagem.constituicao.valor).toBe(14);
});

test('iniciativa após bônus inicial, ASI, item e ajuste manual; perícia especializada dobra uma única vez', () => {
  const f = fixture();
  f.setAtributosPersonagem(f.atributosPersonagem);
  efeito(f, { atributo: 'destreza', bonus: 2, tituloEfeito: 'Origem' });
  expect(selecionarIniciativa(f).total).toBe(3);
  expect(f.aplicarAumentoAtributos(4, ['destreza', 'destreza'])).toBe(true);
  expect(selecionarIniciativa(f).total).toBe(4);
  efeito(f, { atributo: 'destreza', valorFixo: 20, tipoEfeito: 'atributo_fixo', origemTipo: 'item' });
  expect(selecionarIniciativa(f).total).toBe(5);
  efeito(f, { tipoEfeito: 'iniciativa', bonus: 1, tituloEfeito: 'Ajuste manual' });
  expect(selecionarIniciativa(f).total).toBe(6);
  f.pericias = ['Furtividade'];
  efeito(f, { tipoEfeito: 'especializacao', pericia: 'Furtividade' });
  efeito(f, { tipoEfeito: 'especializacao', pericia: 'Furtividade' });
  expect(selecionarPericia(f, 'Furtividade', 'destreza').total).toBe(11);
  expect(calcularValorAtributoFinal(f, 'destreza')).toBe(20);
  expect(f.atributosPersonagem.destreza.valor).toBe(14);
});

test.each(['DND_2014', 'DND_2024'])('CA sem treino, escudo e Defesa condicionais em %s', edicao => {
  const f = fixture(edicao, 'mago');
  efeito(f, { tituloEfeito: 'estiloLutaMago1', ca: 'CA', bonus: 1 });
  expect(selecionarCA(f).total).toBe(12);
  f.escudoEquipado = escudo;
  expect(selecionarCA(f).total).toBe(edicao === 'DND_2014' ? 14 : 12);
  f.ArmaduraEquipada = armadura('Armadura Pesada', 18);
  expect(selecionarCA(f).total).toBe(edicao === 'DND_2014' ? 21 : 18);
  expect(selecionarCA(f).avisos.length).toBeGreaterThan(0);
  efeito(f, { proeficienciasClasse: ['Todas as armaduras', 'Escudos'] });
  expect(selecionarCA(f).total).toBe(21);
  f.ArmaduraEquipada = armadura('Armadura Média', 14);
  f.atributosPersonagem.destreza.valor = 8;
  expect(selecionarCA(f).total).toBe(16);
  f.ArmaduraEquipada = armadura('Armadura Leve', 11);
  expect(selecionarCA(f).total).toBe(13);
});

test.each(['DND_2014', 'DND_2024'])('Monge/Bárbaro: alternativas não somam, escudo exclui Monge em %s', edicao => {
  const monge = fixture(edicao, 'monge');
  expect(selecionarCA(monge).total).toBe(14);
  monge.escudoEquipado = escudo;
  expect(selecionarCA(monge).total).toBe(edicao === 'DND_2014' ? 14 : 12);
  expect(selecionarCA(monge).alternativas.find(a => a.fonte.startsWith('Monge')).aplicada).toBe(false);
  const barbaro = fixture(edicao, 'barbaro');
  barbaro.escudoEquipado = escudo;
  expect(selecionarCA(barbaro).total).toBe(16);
  barbaro.selecionarClasseNoNivel(classe(barbaro, 'monge'), 5);
  expect(selecionarCA(barbaro).total).toBe(16);
});

test('Arquearia afeta ataque; Duelismo exige arma única equipada; efeito futuro fica inativo', () => {
  const f = fixture();
  f.ArmaEquipada = [espada];
  efeito(f, { arma: 'uma mao', bonus: 2, tituloEfeito: 'estiloLutaGuerreiro1' });
  efeito(f, { arma: 'distancia', bonus: 2 });
  efeito(f, { tipoEfeito: 'dano_arma', bonus: 20, level: 6 });
  expect(selecionarArma(f, espada)).toMatchObject({ ataque: 5, formula: '1d8 +4' });
  f.ArmaEquipada.push({ ...espada, id: 'outra' });
  expect(selecionarArma(f, espada).formula).toBe('1d8 +2');
  expect(selecionarArma(f, { ...espada, distancia: 'sim' }).ataque).toBe(7);
});

test('troca de linhagem 2014/2024 e raça preserva deslocamento manual', () => {
  const f = fixture();
  f.setRacaPrincipal(new Elfo()); f.setSubRaca(new ElfoFloresta());
  expect(selecionarDeslocamento(f).total).toBe(35);
  expect(f.pericias).toContain('Percepção');
  f.setSubRaca(new ElfoAlto());
  expect(selecionarDeslocamento(f).total).toBe(30);
  const elfo = getRulesetData('DND_2024').racasOuEspecies.find(r => r.nome === 'Elfo');
  f.setRacaPrincipal(elfo); f.setSubRaca(elfo.subOpcoes.find(r => r.nome === 'Elfo Silvestre'));
  expect(selecionarDeslocamento(f).total).toBe(35);
  f.setSpeed(42); f.setRacaPrincipal(new Elfo()); f.setSubRaca(null);
  expect(selecionarDeslocamento(f).total).toBe(42);
});

test('UI usa valores finais, mantém especialização após exportar/reabrir', () => {
  mockFicha = fixture();
  render(<><InformacoesPersonagem /><PericiasEOutros /></>);
  expect(screen.getByText('0/44')).toBeInTheDocument();
  expect(screen.getByLabelText('Classe de armadura')).toHaveTextContent('12');
  fireEvent.click(screen.getByLabelText('Especialização em Furtividade'));
  const reaberta = parseImport(exportFicha(mockFicha));
  expect(selecionarPericia(reaberta, 'Furtividade', 'destreza').total).toBe(8);
});

test('fontes de CA: itens somam, Defesa não duplica, CA manual persiste; níveis de origem limitam efeitos', () => {
  const f = fixture();
  f.ArmaduraEquipada = armadura('Armadura Pesada', 18);
  efeito(f, { tipoEfeito: 'estilo_defesa', ca: 'CA', bonus: 1, tituloEfeito: 'Defesa' });
  efeito(f, { tipoEfeito: 'estilo_defesa', ca: 'CA', bonus: 1, tituloEfeito: 'Defesa duplicada' });
  efeito(f, { tipoEfeito: 'ca_item', bonus: 1, tituloEfeito: 'Anel' });
  efeito(f, { tipoEfeito: 'ca_item', bonus: 50, tituloEfeito: 'Futuro', classeNome: 'Guerreiro', nivelClasseOrigem: 6 });
  expect(selecionarCA(f).total).toBe(20);
  expect(selecionarCA(f).explicacao).toContain('Anel: +1');
  f.setClasseArmadura(24);
  expect(selecionarCA(parseImport(exportFicha(f))).total).toBe(24);
});

test('ficha incompleta explicita dados ausentes e preserva níveis planejados', () => {
  const f = fixture();
  f.multiclasses[0].nivelEscolhido = [1, 3, 6];
  expect(selecionarVida(f).ausentes).toEqual([2, 4, 5]);
  expect(selecionarClassesAtivas(f)[0].nivel).toBe(2);
  expect(f.multiclasses[0].nivelEscolhido).toEqual([1, 3, 6]);
});

test('PDF real longo: edição, UI/PDF equivalentes, multiclasse ativa, conteúdo paginado sem corte', async () => {
  const f = fixture('DND_2024');
  f.nomePersonagem = 'Teste F5';
  f.selecionarClasseNoNivel(classe(f, 'mago'), 4);
  f.selecionarClasseNoNivel(classe(f, 'mago'), 5);
  f.selecionarClasseNoNivel(classe(f, 'guerreiro'), 6);
  expect(selecionarClassesAtivas(f).map(c => c.nivel)).toEqual([3, 2]);
  expect(obterNivelClasses(f)).not.toMatch(/Guerreiro 5/);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: Array.from({ length: 170 }, (_, i) => `Magia de teste ${i} com descrição extensa para verificar paginação`) }];
  global.fetch = jest.fn(async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from(fs.readFileSync('public/ficha-de-personagem-dd-5e.pdf')).buffer }));
  const spy = jest.spyOn(PDFPage.prototype, 'drawText');
  const bytes = await gerarFichaPdf(f);
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getPageCount()).toBeGreaterThan(5);
  const textos = spy.mock.calls.map(c => c[0]).join('\n');
  expect(textos).toContain('D&D 2024');
  expect(textos).toContain(obterNivelClasses(f));
  expect(textos).toContain(`máximos: ${selecionarVida(f).total}`);
  expect(textos).toContain(`CA: ${selecionarCA(f).total}`);
  expect(textos).toContain('Magia de teste 169');
  expect(textos).toContain('Adestrar Animais');
  expect(textos).not.toContain('Guerreiro 5');
  expect(spy.mock.calls.every(([, options]) => options.y >= 7)).toBe(true);
  spy.mockRestore();
  if (process.env.F5_PDF) fs.writeFileSync(process.env.F5_PDF, bytes);
});
