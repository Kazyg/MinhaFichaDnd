import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalSelecaoTalento from './ModalSelecaoTalento';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { Atributos } from '../../api/classesPrincipais/Atributos.class';
import TalentoOrigem from '../../leveis/components/TalentoOrigem';
import AbaMagias from '../components/components_inventario/AbaMagias';
import { getTalentosConteudo } from '../../api/rulesets/conteudo';
import { selecionarTalentoInicial, erroTalento } from '../../api/fichaPersonagem/talentosConteudo';
import { getRulesetData } from '../../api/rulesets/getRulesetData';
import { exportFicha, parseImport } from '../../api/fichaPersonagem/fichaStorage';
import { magiasConcedidas } from '../../api/fichaPersonagem/talentos2024Utils';

let mockFicha: Ficha;
jest.mock('../../api/fichaPersonagem/FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn() }) }));
beforeEach(() => { mockFicha = new Ficha({ versaoRegras: 'DND_2024' }); });

const ficha = () => new Ficha({ versaoRegras: 'DND_2024', nomePersonagem: 'Teste', levelTotal: 4,
  classePrincipal: getRulesetData('DND_2024').classes.find(c => c.chave === 'mago'),
  racaPrincipal: getRulesetData('DND_2024').racasOuEspecies.find(r => r.nome === 'Humano'),
  atributosPersonagem: new Atributos(14, 14, 14, 14, 14, 14) });

test('talento PHB exige escolhas e transmite referência versionada e campos', () => {
  const f = ficha(), onSelect = jest.fn();
  render(<ModalSelecaoTalento ficha={f} opcoes={getTalentosConteudo('DND_2024')} titulo="Talentos" onClose={() => {}} onSelect={onSelect} talentoInicial={null} />);
  fireEvent.click(screen.getByRole('button', { name: 'Adepto Elemental' }));
  const confirmar = screen.getByRole('button', { name: 'Escolher Adepto Elemental' });
  expect(confirmar).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Atributo aumentado 1'), { target: { value: 'inteligencia' } });
  fireEvent.change(screen.getByLabelText('Domínio Elemental 1'), { target: { value: 'Ígneo' } });
  expect(confirmar).toBeEnabled(); fireEvent.click(confirmar);
  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Adepto Elemental', edicao: 'DND_2024' }), { atributo: ['inteligencia'], elemento: ['Ígneo'] });
});

test('troca da lista de Iniciado em Magia limpa as magias anteriores', () => {
  const f = ficha();
  render(<ModalSelecaoTalento ficha={f} opcoes={getTalentosConteudo('DND_2024')} titulo="Talentos" onClose={() => {}} onSelect={() => {}} talentoInicial={null} />);
  fireEvent.click(screen.getByRole('button', { name: 'Iniciado em Magia' }));
  fireEvent.change(screen.getByLabelText('Lista de magias 1'), { target: { value: 'Mago' } });
  fireEvent.click(screen.getByRole('button', { name: 'Escolher truque 1' }));
  fireEvent.click(screen.getByRole('button', { name: 'Mãos Mágicas' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Mãos Mágicas' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher magia de 1º círculo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Alarme' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Alarme' }));
  fireEvent.change(screen.getByLabelText('Lista de magias 1'), { target: { value: 'Clérigo' } });
  expect(screen.getByRole('button', { name: 'Escolher truque 1' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Escolher magia de 1º círculo' })).toBeEnabled();
  expect(screen.queryByRole('button', { name: 'Mãos Mágicas' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Alarme' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Escolher Iniciado em Magia' })).toBeDisabled();
});

test('Iniciado de origem valida no domínio e conserva escolhas e magias após JSON', () => {
  const f = ficha();
  const escolhas = { lista: ['Mago'], conjuracao: ['carisma'], truques: ['2024: Luz', '2024: Mãos Mágicas'], magias: ['2024: Alarme'] };
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Iniciado em Magia', escolhas)).toBeNull();
  const salvo = parseImport(exportFicha(f));
  expect(salvo.efeitos![0].escolhasTalento2024).toEqual(escolhas);
  expect(magiasConcedidas(salvo).map(m => m.magia.nome)).toEqual(['2024: Luz', '2024: Mãos Mágicas', '2024: Alarme']);
  expect(salvo.magiasConjuracao ?? []).toEqual(f.magiasConjuracao ?? []);
});

test('escolha incompleta não modifica a ficha; edição de escolha valida ignorando a anterior', () => {
  const f = ficha(), antes = exportFicha(f);
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', 'Iniciado em Magia', {})).toMatch(/Complete/);
  expect(exportFicha(f)).toBe(antes);
  const t = getTalentosConteudo('DND_2024').find(t => t.nome === 'Iniciado em Magia')!;
  expect(erroTalento(f, 1, t, { lista: ['Mago'], conjuracao: ['carisma'], truques: ['2024: Luz', '2024: Luz'], magias: ['2024: Alarme'] })).toMatch(/Complete/);
  const escolhas = { lista: ['Mago'], conjuracao: ['carisma'], truques: ['2024: Luz', '2024: Mãos Mágicas'], magias: ['2024: Alarme'] };
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', t.nome, escolhas)).toBeNull();
  const revisadas = { ...escolhas, magias: ['2024: Armadura Arcana'] };
  expect(selecionarTalentoInicial(f, 'TalentoOrigemHumano', t.nome, revisadas)).toBeNull();
  expect(f.efeitos?.filter(e => e.tituloEfeito === 'TalentoOrigemHumano')).toHaveLength(1);
  expect(f.efeitos?.find(e => e.tituloEfeito === 'TalentoOrigemHumano')?.escolhasTalento2024).toEqual(revisadas);
  expect(magiasConcedidas(f).map(m => m.magia.nome)).toEqual(['2024: Luz', '2024: Mãos Mágicas', '2024: Armadura Arcana']);
});


test('origem fixa a lista, permite atributo PHB e salva escolhas via modal sem classe nem idiomas', () => {
  mockFicha = new Ficha({ versaoRegras: 'DND_2024', nomePersonagem: 'Teste' });
  mockFicha.setBackGround(getRulesetData('DND_2024').backgroundsOuOrigens.find(b => b.nome === 'Sábio')!);
  const view = render(<TalentoOrigem />);
  expect(screen.getByRole('button', { name: /Talento da origem:/ })).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(screen.getByRole('button', { name: /Configurar ou revisar/ }));
  expect(screen.queryByLabelText('Lista de magias 1')).not.toBeInTheDocument();
  expect(screen.getByText(/Mago.*Definida pela origem/)).toBeInTheDocument();
  expect(screen.queryByText('Nível de aquisição inválido.')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Atributo de conjuração 1'), { target: { value: 'carisma' } });
  const escolher = (botao: string, magia: string) => {
    fireEvent.click(screen.getByRole('button', { name: botao }));
    expect(screen.getByRole('button', { name: 'Filtros' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Curar Ferimentos' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: magia }));
    fireEvent.click(screen.getByRole('button', { name: `Escolher ${magia}` }));
  };
  escolher('Escolher truque 1', 'Luz');
  fireEvent.click(screen.getByRole('button', { name: 'Escolher truque 2' }));
  expect(screen.queryByRole('button', { name: 'Luz' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Mãos Mágicas' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Mãos Mágicas' }));
  escolher('Escolher magia de 1º círculo', 'Alarme');
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Iniciado em Magia' }));
  mockFicha = parseImport(exportFicha(mockFicha));
  expect(magiasConcedidas(mockFicha)).toHaveLength(3);
  expect(mockFicha.efeitos?.find(e => e.tituloEfeito === 'TalentoOrigem')?.escolhasTalento2024?.conjuracao).toEqual(['carisma']);
  view.rerender(<TalentoOrigem />);
  fireEvent.click(screen.getByRole('button', { name: /Configurar ou revisar/ }));
  expect(screen.getByLabelText('Atributo de conjuração 1')).toHaveValue('carisma');
  escolher('Alarme', 'Armadura Arcana');
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Iniciado em Magia' }));
  expect(magiasConcedidas(mockFicha).map(m => m.magia.nome)).not.toContain('2024: Alarme');
  expect(magiasConcedidas(mockFicha)).toHaveLength(3);
  view.unmount();
  render(<AbaMagias />);
  expect(screen.getByText('Magias concedidas por talentos')).toBeInTheDocument();
  expect(screen.queryByText('Recuperação de talentos')).not.toBeInTheDocument();
});

test('origem rejeita lista diferente e nível realmente inválido continua validado', () => {
  const f = ficha();
  f.levelTotal = null;
  f.setBackGround(getRulesetData('DND_2024').backgroundsOuOrigens.find(b => b.nome === 'Sábio')!);
  const t = getTalentosConteudo('DND_2024').find(t => t.nome === 'Iniciado em Magia')!;
  expect(erroTalento(f, 1, t)).toBeNull();
  expect(erroTalento(f, 0, t)).toMatch(/inválido/);
  expect(erroTalento(f, 2, t)).toBeNull();
  expect(erroTalento(f, 21, t)).toMatch(/inválido/);
  expect(selecionarTalentoInicial(f, 'TalentoOrigem', t.nome, { lista: ['Clérigo'] })).toMatch(/origem define/);
});


test('talento de origem sem escolhas exibe somente texto', () => {
  mockFicha = ficha();
  mockFicha.setBackGround(getRulesetData('DND_2024').backgroundsOuOrigens.find(b => (b as typeof b & { talentoOrigem?: string }).talentoOrigem === 'Alerta')!);
  render(<TalentoOrigem />);
  const toggle = screen.getByRole('button', { name: /Talento da origem: Alerta/ });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByRole('button', { name: /Configurar ou revisar/ })).not.toBeInTheDocument();
});
