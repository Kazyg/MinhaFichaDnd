import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Ficha } from '../api/fichaPersonagem/FichaPersonagem';
import { Efeitos } from '../api/classesPrincipais/Efeitos';
import { getRulesetData } from '../api/rulesets/getRulesetData';
import { exportFicha } from '../api/fichaPersonagem/fichaStorage';
import CaracteristicasClasse from '../leveis/components/CaracteristicasClasseProps';
import PericiasEOutros from './components/PericiasEOutros';
import AbaMagias from './components/components_inventario/AbaMagias';

let mockFicha;
const mockForceUpdate = jest.fn();
jest.mock('../api/fichaPersonagem/FichaContext', () => ({
  useFicha: () => ({ ficha: mockFicha, forceUpdate: mockForceUpdate, refreshKey: 0 }),
}));

beforeEach(() => { mockFicha = new Ficha(); mockForceUpdate.mockClear(); });

test.each(['DND_2014', 'DND_2024'])('estilo de luta abre uma única modal interativa e permite reabrir: %s', async edicao => {
  const user = userEvent.setup();
  const classe = getRulesetData(edicao).classes.find(c => c.chave === 'guerreiro');
  mockFicha = new Ficha({ versaoRegras: edicao, classePrincipal: classe, levelTotal: 1 });
  render(<CaracteristicasClasse classe={classe} nivel={1} />);
  await user.click(screen.getByRole('button', { name: /Selecionar Estilo de luta/ }));
  expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(1);
  const dialog = screen.getByRole('dialog');
  // Inert ancestors are the browser-level cause of this regression.
  // eslint-disable-next-line testing-library/no-node-access
  expect(dialog.closest('[inert]')).toBeNull();
  await user.click(within(dialog).getByRole('button', { name: 'Defesa', exact: true }));
  expect(within(dialog).getByRole('button', { name: 'Defesa', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await user.click(within(dialog).getByRole('button', { name: 'Escolher Defesa' }));
  expect(mockFicha.estiloLuta).toEqual(expect.arrayContaining([expect.objectContaining({ estilo: 'Defesa' })]));
  expect(mockFicha.efeitos.filter(e => e.tipoEfeito === 'estilo_defesa')).toHaveLength(1);
  await user.click(screen.getByRole('button', { name: /Selecionar Estilo de luta/ }));
  expect(screen.getByRole('button', { name: 'Defesa', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await user.click(screen.getByRole('button', { name: 'Duelismo', exact: true }));
  await user.click(screen.getByRole('button', { name: 'Escolher Duelismo' }));
  expect(mockFicha.efeitos.filter(e => e.tipoEfeito === 'estilo_defesa')).toHaveLength(0);
  expect(mockFicha.efeitos.filter(e => e.tipoEfeito === 'estilo_duelismo')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access
  expect(document.querySelector('[inert]')).toBeNull();
});

test('perícias removem controles manuais e painéis sem apagar efeitos salvos', () => {
  const efeito = new Efeitos();
  Object.assign(efeito, { origemTipo: 'manual', tituloEfeito: 'especializacao:Acrobacia', tipoEfeito: 'especializacao', pericia: 'Acrobacia' });
  mockFicha.setEfeitos(efeito);
  const original = exportFicha(mockFicha);
  render(<PericiasEOutros />);
  expect(screen.queryByText(/Especialização manual|Especialização por fonte oficial|Revisão de dados antigos|As caixas abaixo/)).not.toBeInTheDocument();
  expect(screen.queryByRole('checkbox', { name: /Especialização em/ })).not.toBeInTheDocument();
  expect(exportFicha(mockFicha)).toBe(original);
});

test('magias não oferecem recuperação por descanso e preservam consumo salvo', () => {
  mockFicha.recursos.slots = { 'compartilhado:0': 2 };
  const original = exportFicha(mockFicha);
  render(<AbaMagias />);
  expect(screen.queryByRole('button', { name: /Recuperar espaços/ })).not.toBeInTheDocument();
  expect(screen.queryByText(/Após concluir o descanso|Espaços combinados permitem/)).not.toBeInTheDocument();
  expect(exportFicha(mockFicha)).toBe(original);
});
