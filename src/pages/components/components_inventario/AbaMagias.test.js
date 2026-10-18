import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AbaMagias from './AbaMagias';
import { Ficha } from '../../../api/fichaPersonagem/FichaPersonagem';
import { Atributos } from '../../../api/classesPrincipais/Atributos.class';
import { getRulesetData } from '../../../api/rulesets/getRulesetData';
import { adicionarMagia, selecionarFontesConjuracao } from '../../../api/fichaPersonagem/fichaConjuracao';

let mockFicha;
const mockForceUpdate = jest.fn();
jest.mock('../../../api/fichaPersonagem/FichaContext', () => ({
  useFicha: () => ({ ficha: mockFicha, forceUpdate: mockForceUpdate }),
}));

function criarFicha(edicao, chaves = ['clerigo']) {
  const classes = chaves.map(chave => getRulesetData(edicao).classes.find(c => c.chave === chave));
  mockFicha = new Ficha({ versaoRegras: edicao, classePrincipal: classes[0], levelTotal: classes.length * 3,
    atributosPersonagem: new Atributos(14, 14, 14, 16, 16, 14) });
  mockFicha.multiclasses = classes.map((classe, i) => ({ id: classe.chave, classe, nivelClasse: 3,
    nivelEscolhido: [i * 3 + 1, i * 3 + 2, i * 3 + 3] }));
  return selecionarFontesConjuracao(mockFicha);
}

test.each(['DND_2014', 'DND_2024'])('visualização e recolhimento são independentes e preservam a ficha em %s', async edicao => {
  const fontes = criarFicha(edicao);
  expect(adicionarMagia(mockFicha, fontes[0].id, 'Curar Ferimentos')).toBeNull();
  const antes = JSON.stringify(mockFicha);
  const user = userEvent.setup();
  render(<AbaMagias />);
  const compacto = screen.getByRole('button', { name: 'Visualização compacta' });
  const primeiro = screen.getByRole('button', { name: 'Recolher Círculo 1 — Conjuração' });
  const segundo = screen.getByRole('button', { name: 'Recolher Círculo 2 — Conjuração' });
  expect(compacto).toHaveAttribute('aria-pressed', 'false');
  expect(primeiro).toHaveAttribute('aria-expanded', 'true');
  expect(segundo).toHaveAttribute('aria-expanded', 'true');
  const card = screen.getByRole('article', { name: 'Curar Ferimentos' });
  await user.selectOptions(within(card).getByLabelText('Conjurar no círculo'), '2');
  const badges = within(card).getAllByRole('button').map(b => b.getAttribute('aria-label'));
  await user.click(compacto);
  expect(compacto).toHaveAttribute('aria-pressed', 'true');
  expect(compacto).toHaveAccessibleName('Visualização compacta');
  expect(compacto).not.toHaveTextContent('Visualização compacta');
  const nome = within(card).getByRole('button', { name: 'Curar Ferimentos' });
  expect(nome).toHaveAttribute('aria-expanded', 'false');
  expect(within(card).getByLabelText('Conjurar no círculo')).not.toBeVisible();
  nome.focus();
  await user.keyboard('{Enter}');
  expect(nome).toHaveAttribute('aria-expanded', 'true');
  expect(within(card).getAllByRole('button').map(b => b.getAttribute('aria-label'))).toEqual(expect.arrayContaining(badges));
  primeiro.focus();
  await user.keyboard('{Enter}');
  expect(primeiro).toHaveAttribute('aria-expanded', 'false');
  expect(primeiro).toHaveAttribute('aria-controls');
  expect(screen.queryByRole('article', { name: 'Curar Ferimentos' })).not.toBeInTheDocument();
  expect(segundo).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getAllByRole('button', { name: /Conjuração, círculo 1, espaço/ })).toHaveLength(4);
  await user.click(compacto);
  expect(primeiro).toHaveAttribute('aria-expanded', 'false');
  await user.click(compacto);
  await user.keyboard('{Tab}');
  primeiro.focus();
  await user.keyboard(' ');
  expect(primeiro).toHaveAttribute('aria-expanded', 'true');
  expect(compacto).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('article', { name: 'Curar Ferimentos' })).toBe(card);
  expect(within(card).getByLabelText('Conjurar no círculo')).toHaveValue('2');
  await user.click(compacto);
  expect(within(card).queryByRole('button', { name: 'Curar Ferimentos' })).not.toBeInTheDocument();
  expect(within(card).getByLabelText('Conjurar no círculo')).toBeVisible();
  expect(JSON.stringify(mockFicha)).toBe(antes);
});

test('recolher conjuração mantém espaços acionáveis e não recolhe o círculo de Pacto correspondente', async () => {
  criarFicha('DND_2024', ['clerigo', 'bruxo']);
  const user = userEvent.setup();
  render(<AbaMagias />);
  const pacto = screen.getByRole('region', { name: 'Magia de Pacto — Bruxo, Círculo 2' });
  await user.click(screen.getByRole('button', { name: 'Recolher Círculo 2 — Conjuração' }));
  expect(within(pacto).getByRole('button', { name: /Recolher Círculo 2/ })).toHaveAttribute('aria-expanded', 'true');
  const slot = screen.getByRole('button', { name: 'Conjuração, círculo 2, espaço 1: disponível' });
  mockForceUpdate.mockClear();
  await user.click(slot);
  expect(mockFicha.recursos.slots['conjuracao:1']).toBe(1);
  expect(mockFicha.recursos.slots['conjuracao:1:icone:0']).toBe(1);
  expect(mockForceUpdate).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button', { name: 'Escolher Magia' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
