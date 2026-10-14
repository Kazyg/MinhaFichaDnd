import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalSelecaoTalento from './ModalSelecaoTalento';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { Atributos } from '../../api/classesPrincipais/Atributos.class';
import { getTalentosConteudo } from '../../api/rulesets/conteudo';
import { selecionarTalentoInicial, erroTalento } from '../../api/fichaPersonagem/talentosConteudo';
import { getRulesetData } from '../../api/rulesets/getRulesetData';
import { exportFicha, parseImport } from '../../api/fichaPersonagem/fichaStorage';
import { magiasConcedidas } from '../../api/fichaPersonagem/talentos2024Utils';

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
  fireEvent.change(screen.getByLabelText('Dois truques 1'), { target: { value: '2024: Mãos Mágicas' } });
  fireEvent.change(screen.getByLabelText('Lista de magias 1'), { target: { value: 'Clérigo' } });
  expect(screen.getByLabelText('Dois truques 1')).toHaveValue('');
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
});
