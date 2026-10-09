import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { getRulesetData } from '../rulesets/getRulesetData';
import { buscarMagiaConteudo, buscarTalentoConteudo, formulaCura, getMagiasConteudo, getTalentosConteudo, referenciaConteudo, resolverConteudo, resolverMagiaSalva } from '../rulesets/conteudo';
import { talentosElegiveis } from './escolhasProgressao';
import { descreverTalentoSalvo, erroTalento, selecionarTalentoInicial } from './talentosConteudo';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { selecionarIniciativa, selecionarPericia, selecionarProficiencias } from './fichaSeletores';
import { adicionarMagia, prepararMagia, pendenciasMagia, revisarFonteMagia, selecionarFontesConjuracao } from './fichaConjuracao';
import { exportFicha, parseImport } from './fichaStorage';
import ModalMagias from '../../pages/modals/ModalMagias';
import ModalTalento from '../../pages/modals/ModalSelecaoTalento';
import TalentoDescricao from '../../leveis/components/TalendoDescricao';
import TalentoOrigem from '../../leveis/components/TalentoOrigem';
import AbaDetalhes from '../../pages/components/components_inventario/AbaDetalhes';
import { descricaoCaracteristica } from '../../bibliotecas/bibliotecaPrincipal';
import { PDFDocument, PDFPage } from 'pdf-lib';
import fs from 'fs';
import { gerarFichaPdf } from '../../utils/exportarFichaPdf';

let mockFicha;
const mockForceUpdate = jest.fn();
jest.mock('./FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: mockForceUpdate }) }));
function ficha(edicao = 'DND_2024', nivel = 4, classe = 'Guerreiro') {
  const rules = getRulesetData(edicao);
  const c = rules.classes.find(c => c.nome === classe);
  const f = new Ficha({ versaoRegras: edicao, levelTotal: nivel, classePrincipal: c,
    atributosPersonagem: new Atributos(13, 14, 12, 16, 16, 12), racaPrincipal: rules.racasOuEspecies.find(r => r.nome === 'Humano'), pericias: [] });
  f.multiclasses = [{ id: 'classe', classe: c, nivelClasse: nivel, nivelEscolhido: Array.from({ length: nivel }, (_, i) => i + 1) }];
  return f;
}
const reabrir = f => parseImport(exportFicha(f));
const fonte = f => selecionarFontesConjuracao(f)[0].id;
afterEach(cleanup);

test('edições e revisões desconhecidas não caem no catálogo legado nem na revisão atual', () => {
  expect(() => getRulesetData('DND_2030')).toThrow(/não suportada/);
  expect(() => getMagiasConteudo(undefined)).toThrow(/não suportada/);
  const magia = buscarMagiaConteudo('DND_2024', 'Curar Ferimentos');
  expect(resolverConteudo({ ...referenciaConteudo(magia), revisao: 'futura' })).toBeUndefined();
  expect(resolverConteudo({ ...referenciaConteudo(magia), edicao: 'DND_2014' })).toBeUndefined();
  expect(buscarMagiaConteudo('DND_2024', 'Raio de Fogo')).toBeUndefined();
  expect(buscarMagiaConteudo('DND_2014', 'Raio de Fogo')).toBeDefined();
});

test('catálogos têm identidade, fonte, revisão, licença e categoria; legado não é certificado', () => {
  for (const edicao of ['DND_2014', 'DND_2024']) {
    const registros = [...getMagiasConteudo(edicao), ...getTalentosConteudo(edicao)];
    expect(new Set(registros.map(c => `${c.id}@${c.revisao}`)).size).toBe(registros.length);
    registros.forEach(c => {
      expect(c.edicao).toBe(edicao);
      expect(c.fonte.consultadoEm).toBe('2026-10-07');
      expect(c.fonte.localizador).toBeTruthy();
      expect(c.categoria).toBeTruthy();
      expect(['oficial', 'compativel', 'homebrew', 'nao-verificado']).toContain(c.natureza);
      expect(['CC-BY-4.0', 'pendente']).toContain(c.licenca);
    });
  }
  expect(buscarTalentoConteudo('DND_2014', 'ALERTA')).toMatchObject({ natureza: 'nao-verificado', licenca: 'pendente' });
  expect(buscarTalentoConteudo('DND_2024', 'Alerta')).toMatchObject({ natureza: 'oficial', licenca: 'CC-BY-4.0', categoria: 'Origin' });
});

test.each([
  ['DND_2014', 'evocação', '1d8+3', '3d8+3', null],
  ['DND_2024', 'abjuração', '2d8+3', '6d8+3', '2d8+3'],
])('Curar Ferimentos %s: escola, fórmula, escalonamento e alvos', (edicao, escola, base, elevado, constructo) => {
  const m = buscarMagiaConteudo(edicao, 'Curar Ferimentos');
  expect(m.tipo).toBe(escola);
  expect(formulaCura(m, 1, 3)).toBe(base);
  expect(formulaCura(m, 3, 3)).toBe(elevado);
  expect(formulaCura(m, 1, 3, 'constructo')).toBe(constructo);
  expect(formulaCura(m, 0, 3)).toBeNull();
  expect(formulaCura({ ...m, revisao: 'ausente' }, 1, 3)).toBeNull();
});

test.each([['DND_2014', 'ALERTA', 7, 7], ['DND_2024', 'Alerta', 4, 5]])('Alerta %s aplica benefício por edição, nível ativo e mantém JSON', (edicao, nome, no4, no8) => {
  const f = ficha(edicao, 8);
  expect(f.selecionarTalentoAvanco(4, nome)).toBe(true);
  expect(f.selecionarTalentoAvanco(6, nome)).toBe(false);
  expect(selecionarIniciativa(f).total).toBe(no8);
  f.levelTotal = 4;
  expect(selecionarIniciativa(f).total).toBe(no4);
  expect(selecionarIniciativa(reabrir(f))).toEqual(selecionarIniciativa(f));
  expect(reabrir(f).efeitos[0].conteudo.edicao).toBe(edicao);
  f.levelTotal = 3;
  expect(selecionarIniciativa(f).total).toBe(2);
});

test('talento antigo não ganha automaticamente efeitos nem texto de 2024 ao reabrir', () => {
  const f = ficha();
  const e = Object.assign(new Efeitos(), { talento: 'ALERTA', level: 1, tipoEfeito: 'iniciativa', bonus: 5 });
  f.efeitos = [e];
  const antes = exportFicha(f);
  const salvo = reabrir(f);
  expect(salvo.efeitos[0].conteudo).toBeUndefined();
  expect(selecionarIniciativa(salvo).total).toBe(7);
  expect(exportFicha(salvo)).toBe(antes);
  expect(descreverTalentoSalvo(e)).toMatch(/legado sem referência/);
});

test('referência desconhecida preserva snapshot e bloqueia benefício automático', () => {
  const f = ficha();
  expect(f.selecionarTalentoAvanco(4, 'Alerta')).toBe(true);
  f.efeitos[0].conteudo.revisao = 'futura';
  const restaurada = reabrir(f);
  expect(restaurada.efeitos[0].talentoSnapshot).toEqual(f.efeitos[0].talentoSnapshot);
  expect(selecionarIniciativa(restaurada).total).toBe(2);
  expect(descreverTalentoSalvo(restaurada.efeitos[0])).toMatch(/indisponível/);
});

test('Imobilizador valida nível, FOR ou DES, escolha, teto e repetibilidade antes de mudar estado', () => {
  const f = ficha('DND_2024', 8);
  const t = buscarTalentoConteudo('DND_2024', 'Imobilizador');
  expect(erroTalento(f, 3, t, ['forca'])).toMatch(/nível 4/);
  f.atributosPersonagem.forca.valor = 12; f.atributosPersonagem.destreza.valor = 12;
  expect(f.selecionarTalentoAvanco(4, t.nome, ['forca'])).toBe(false);
  f.atributosPersonagem.destreza.valor = 13;
  const antes = exportFicha(f);
  expect(f.selecionarTalentoAvanco(4, t.nome)).toBe(false);
  expect(f.selecionarTalentoAvanco(4, t.nome, ['carisma'])).toBe(false);
  expect(exportFicha(f)).toBe(antes);
  expect(f.selecionarTalentoAvanco(4, t.nome, ['forca'])).toBe(true);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(13);
  expect(f.selecionarTalentoAvanco(6, t.nome, ['destreza'])).toBe(false);
  expect(reabrir(f).efeitos[0].escolhasTalento).toEqual(['forca']);
  f.atributosPersonagem.destreza.valor = 20;
  expect(f.selecionarTalentoAvanco(4, t.nome, ['destreza'])).toBe(false);
});

test('aumento futuro não habilita requisito anterior; ASI/talento substituem apenas seu avanço', () => {
  const f = ficha('DND_2024', 8);
  f.atributosPersonagem.forca.valor = 12; f.atributosPersonagem.destreza.valor = 12;
  expect(f.aplicarAumentoAtributos(8, ['forca', 'forca'])).toBe(true);
  expect(f.selecionarTalentoAvanco(4, 'Imobilizador', ['forca'])).toBe(false);
  f.atributosPersonagem.destreza.valor = 13;
  expect(f.selecionarTalentoAvanco(4, 'Imobilizador', ['forca'])).toBe(true);
  expect(f.aplicarAumentoAtributos(4, ['destreza', 'destreza'])).toBe(true);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(14);
  expect(f.escolhasAnteriores.at(-1).valor[0].conteudo.id).toMatch(/imobilizador/);
});

test('ASI retroativo respeita teto de um talento posterior', () => {
  const f = ficha('DND_2024', 8);
  f.atributosPersonagem.forca.valor = 18;
  expect(f.selecionarTalentoAvanco(8, 'Imobilizador', ['forca'])).toBe(true);
  expect(f.aplicarAumentoAtributos(4, ['forca', 'forca'])).toBe(false);
  expect(calcularValorAtributoFinal(f, 'forca')).toBe(19);
});

test('Habilidoso requer três escolhas válidas, concede perícias/ferramentas, repete com novas escolhas', () => {
  const f = ficha('DND_2024', 8);
  const antes = exportFicha(f);
  for (const escolhas of [[], ['Atletismo'], ['Atletismo', 'Atletismo', 'História'], ['inventada', 'História', 'Acrobacia']]) {
    expect(f.selecionarTalentoAvanco(4, 'Habilidoso', escolhas)).toBe(false);
  }
  expect(exportFicha(f)).toBe(antes);
  expect(f.selecionarTalentoAvanco(4, 'Habilidoso', ['Atletismo', 'Acrobacia', 'Ferramentas de Ladrão'])).toBe(true);
  expect(selecionarPericia(f, 'Atletismo', 'forca')).toMatchObject({ treinada: true, total: 4 });
  expect(selecionarProficiencias(f).has('ferramentas de ladrao')).toBe(true);
  expect(f.selecionarTalentoAvanco(6, 'Habilidoso', ['Atletismo', 'História', 'Furtividade'])).toBe(false);
  expect(f.selecionarTalentoAvanco(6, 'Habilidoso', ['Medicina', 'História', 'Furtividade'])).toBe(true);
  expect(selecionarPericia(reabrir(f), 'Medicina', 'sabedoria').treinada).toBe(true);
  expect(f.aplicarAumentoAtributos(4, ['forca', 'forca'])).toBe(true);
  expect(selecionarPericia(f, 'Atletismo', 'forca').treinada).toBe(false);
  expect(selecionarPericia(f, 'Medicina', 'sabedoria').treinada).toBe(true);
});

test('Humano 2024 aceita só Origem, impede duplicata e não oferece placeholders', () => {
  const f = ficha();
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Imobilizador', ['forca'])).toMatch(/categoria Origin/);
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Iniciado em Magia (Mago)')).toMatch(/pendente/);
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Alerta')).toBeNull();
  expect(f.selecionarTalentoAvanco(4, 'Alerta')).toBe(false);
  expect(talentosElegiveis(f, 4).every(t => t.suportado)).toBe(true);
  expect(selecionarTalentoInicial(f, 'titulo-forjado', 'Alerta')).toMatch(/não concede/);
});

test.each(['DND_2014', 'DND_2024'])('magia nova %s guarda referência e snapshot na exportação/reabertura', edicao => {
  const f = ficha(edicao, 1, 'Clerigo');
  expect(adicionarMagia(f, fonte(f), 'Curar Ferimentos')).toBeNull();
  const salvo = reabrir(f);
  expect(salvo.magiasConjuracao).toEqual(f.magiasConjuracao);
  const m = resolverMagiaSalva(salvo.magiasConjuracao[0]);
  expect(m.edicao).toBe(edicao);
  expect(m.tipo).toBe(edicao === 'DND_2024' ? 'abjuração' : 'evocação');
  expect(pendenciasMagia(salvo, salvo.magiasConjuracao[0])).toEqual([]);
});

test('magia legada 2014 em ficha 2024 mantém significado; revisão explícita arquiva antes de converter', () => {
  const f = ficha('DND_2024', 1, 'Clerigo');
  f.magiasEscolhidas = [{ classe: 'Clerigo', magia: ['Curar Ferimentos'] }];
  const salvo = reabrir(f);
  const antiga = JSON.parse(JSON.stringify(salvo.magiasConjuracao[0]));
  expect(resolverMagiaSalva(antiga).tipo).toBe('evocação');
  expect(pendenciasMagia(salvo, antiga).join()).toMatch(/Conteúdo 2014 em ficha/);
  expect(revisarFonteMagia(salvo, antiga.id, fonte(salvo))).toBeNull();
  expect(resolverMagiaSalva(salvo.magiasConjuracao[0]).tipo).toBe('abjuração');
  expect(salvo.escolhasAnteriores.at(-1).valor).toEqual(antiga);
  expect(reabrir(salvo).magiasConjuracao).toEqual(salvo.magiasConjuracao);
});

test('magia com revisão desconhecida não prepara nem resolve por nome; importação preserva referência', () => {
  const f = ficha('DND_2024', 1, 'Mago');
  expect(adicionarMagia(f, fonte(f), 'Detectar Magia')).toBeNull();
  f.magiasConjuracao[0].conteudo.revisao = 'futura';
  const salvo = reabrir(f);
  expect(resolverMagiaSalva(salvo.magiasConjuracao[0])).toBeUndefined();
  expect(prepararMagia(salvo, salvo.magiasConjuracao[0].id, true)).toMatch(/desconhecida/);
  expect(pendenciasMagia(salvo, salvo.magiasConjuracao[0]).join()).toMatch(/sem fallback/);
  expect(salvo.magiasConjuracao[0].snapshot).toEqual(f.magiasConjuracao[0].snapshot);
});

test('importação recusa referência malformada e escolhas que quebrariam UI; revisão desconhecida válida fica pendente', () => {
  const f = ficha(); f.selecionarTalentoAvanco(4, 'Alerta');
  f.efeitos[0].conteudo = { id: {}, revisao: 'x', edicao: 'DND_2024' };
  expect(() => reabrir(f)).toThrow();
  delete f.efeitos[0].conteudo;
  f.efeitos[0].escolhasTalento = [22];
  expect(() => reabrir(f)).toThrow();
});

test('modal de talento preserva metadados, exige escolhas e só fecha depois de sucesso', () => {
  mockFicha = ficha();
  const t = buscarTalentoConteudo('DND_2024', 'Habilidoso');
  const selecionar = jest.fn(() => false), fechar = jest.fn();
  render(<ModalTalento titulo="Talento" opcoes={[t]} talentoInicial={t} onSelect={selecionar} onClose={fechar} validar={(t, e) => erroTalento(mockFicha, 4, t, e)} />);
  const botao = screen.getByRole('button', { name: 'Escolher Habilidoso' });
  expect(botao).toBeDisabled();
  ['Atletismo', 'Furtividade', 'Ferramentas de Ladrão'].forEach((v, i) => fireEvent.change(screen.getByLabelText(`Escolha adicional ${i + 1}`), { target: { value: v } }));
  expect(botao).toBeEnabled(); fireEvent.click(botao);
  expect(selecionar).toHaveBeenCalledWith(expect.objectContaining({ id: t.id, requisito: t.requisito, revisao: t.revisao }), ['Atletismo', 'Furtividade', 'Ferramentas de Ladrão']);
  expect(fechar).not.toHaveBeenCalled();
});

test('talento de origem com escolhas obrigatórias pode ser concluído na UI e reaberto', () => {
  mockFicha = ficha('DND_2024', 1);
  mockFicha.backGround = getRulesetData('DND_2024').backgroundsOuOrigens.find(o => o.talentoOrigem === 'Habilidoso');
  render(<TalentoOrigem />);
  fireEvent.click(screen.getByRole('button', { name: 'Configurar ou revisar Habilidoso' }));
  ['Acrobacia', 'Atletismo', 'Ferramentas de Ladrão'].forEach((v, i) => fireEvent.change(screen.getByLabelText(`Escolha adicional ${i + 1}`), { target: { value: v } }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Habilidoso' }));
  expect(mockFicha.efeitos.find(e => e.tituloEfeito === 'TalentoOrigem').escolhasTalento).toHaveLength(3);
  expect(selecionarPericia(reabrir(mockFicha), 'Acrobacia', 'destreza').treinada).toBe(true);
});

test('modal de magia 2024 exibe a versão correta e calcula a fórmula escolhida', () => {
  mockFicha = ficha('DND_2024', 1, 'Clerigo');
  render(<ModalMagias titulo="Magias" magiaSelect="" onSelect={jest.fn()} onClose={jest.fn()} />);
  fireEvent.click(screen.getByText('Curar Ferimentos'));
  expect(screen.getByText('Nível 1 · abjuração')).toBeInTheDocument();
  expect(screen.getByText(/Uma criatura tocada recupera 2d8/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Círculo de conjuração'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Modificador de conjuração'), { target: { value: '4' } });
  expect(screen.getByText(/Fórmula de cura: 6d8\+4/)).toBeInTheDocument();
});

test('detalhes de uma escolha legada mostram texto 2014; edição da ficha não a substitui', () => {
  mockFicha = ficha('DND_2024', 1, 'Clerigo');
  mockFicha.magiasEscolhidas = [{ classe: 'Clerigo', magia: ['Curar Ferimentos'] }];
  mockFicha = reabrir(mockFicha);
  render(<ModalMagias titulo="Registro salvo" magiaSelect="Curar Ferimentos" escolhaSalva={mockFicha.magiasConjuracao[0]} onSelect={jest.fn()} onClose={jest.fn()} />);
  expect(screen.getByText('Nível 1 · evocação')).toBeInTheDocument();
  expect(screen.queryByLabelText('Círculo de conjuração')).not.toBeInTheDocument();
  expect(screen.getByText(/Registro legado catalogo-2014/)).toBeInTheDocument();
});

test('aba de detalhes e descrição de talento não usam Alerta 2014 em escolha 2024', () => {
  mockFicha = ficha(); mockFicha.selecionarTalentoAvanco(4, 'Alerta');
  render(<AbaDetalhes />);
  fireEvent.click(screen.getByRole('button', { name: 'Alerta' }));
  expect(screen.getByText(/Some seu bônus de proficiência à iniciativa/)).toBeInTheDocument();
  expect(screen.queryByText(/recebe \+5/)).not.toBeInTheDocument();
  cleanup();
  render(<TalentoDescricao talento="Alerta" efeito={mockFicha.efeitos[0]} />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(/Some seu bônus de proficiência à iniciativa/)).toBeInTheDocument();
});

test('detalhes preservam aquisições repetidas e atualizam após mutação da mesma ficha', () => {
  mockFicha = ficha('DND_2024', 8);
  mockFicha.selecionarTalentoAvanco(4, 'Habilidoso', ['Atletismo', 'Acrobacia', 'Ferramentas de Ladrão']);
  const view = render(<AbaDetalhes />);
  expect(screen.getAllByRole('button', { name: 'Habilidoso' })).toHaveLength(1);
  mockFicha.selecionarTalentoAvanco(6, 'Habilidoso', ['Medicina', 'História', 'Furtividade']);
  view.rerender(<AbaDetalhes />);
  expect(screen.getAllByRole('button', { name: 'Habilidoso' })).toHaveLength(2);
  fireEvent.click(screen.getAllByRole('button', { name: 'Habilidoso' })[1]);
  expect(screen.getByText('Escolhas: Medicina, História, Furtividade')).toBeInTheDocument();
});

test('características de classe sem versão revisada não usam texto legado como fallback', () => {
  expect(descricaoCaracteristica('Pacto da Corrente', 'DND_2024')).toMatch(/não catalogada/);
  expect(descricaoCaracteristica('Pacto da Corrente', 'DND_2030')).toMatch(/desconhecida/);
});

test('PDF real identifica conteúdo, revisão, escolhas e legado 2014 em ficha 2024', async () => {
  const f = ficha();
  f.selecionarTalentoAvanco(4, 'Habilidoso', ['Adestrar Animais', 'Acrobacia', 'Ferramentas de Ladrão']);
  f.magiasEscolhidas = [{ classe: 'Mago', magia: ['Curar Ferimentos'] }];
  const antigaFetch = global.fetch;
  global.fetch = jest.fn(async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from(fs.readFileSync('public/ficha-de-personagem-dd-5e.pdf')).buffer }));
  const spy = jest.spyOn(PDFPage.prototype, 'drawText');
  try {
    const bytes = await gerarFichaPdf(reabrir(f));
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThanOrEqual(3);
    const texto = spy.mock.calls.map(c => c[0]).join('\n');
    expect(texto).toContain('srd-5.2.1-pt-resumo-1');
    expect(texto).toContain('Adestrar Animais');
    expect(texto).toContain('DND_2014:magia:curar-ferimentos');
    expect(texto).toContain('legado sem revisão individual');
    expect(selecionarPericia(f, 'Adestrar Animais', 'sabedoria').treinada).toBe(true);
  } finally { spy.mockRestore(); global.fetch = antigaFetch; }
});
