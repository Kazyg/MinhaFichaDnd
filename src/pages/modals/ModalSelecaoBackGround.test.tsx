import React from 'react';
import { exportFicha, parseImport } from '../../api/fichaPersonagem/fichaStorage';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalSelecaoBackGround from './ModalSelecaoBackGround';
import { getRulesetData } from '../../api/rulesets/getRulesetData';
import { Artista } from '../../api/backGroundsFilhos/Artista.class';
import { Charlatao } from '../../api/backGroundsFilhos/Charlatao.class';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import AbaItens from '../components/components_inventario/AbaItens';
import { Acolito } from '../../api/backGroundsFilhos/Acolito.class';
let mockFicha: Ficha;
jest.mock('../../api/fichaPersonagem/FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn() }) }));

test('aba Itens mostra saldo e preserva fichas antigas sem aviso administrativo', () => {
  mockFicha = new Ficha();
  mockFicha.setBackGround(new Acolito());
  const view = render(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.getByText('Ouro: 15')).toBeInTheDocument();
  mockFicha = new Ficha({ backGround: new Acolito(), ouro: 9 });
  mockFicha.setBackGround(new Acolito());
  view.rerender(<AbaItens setModalItemAberto={() => {}} />);
  expect(screen.getByText('Ouro: 24')).toBeInTheDocument();
  expect(screen.queryByText(/Ficha antiga sem origem/)).not.toBeInTheDocument();
  expect(mockFicha.concessoesIniciais?.revisao).toBeUndefined();
});

test('seleção 2024 aplica somente a alternativa financeira', () => {
  const b = getRulesetData('DND_2024').backgroundsOuOrigens[0];
  const f = new Ficha({ versaoRegras: 'DND_2024', nomePersonagem: 'Teste' });
  const view = render(<ModalSelecaoBackGround opcoes={[b]} titulo="Origem" backGroundInicial={b} onClose={() => {}} onSelect={b => f.setBackGround(b)} />);
  fireEvent.click(screen.getByRole('button', { name: 'Receber ouro' }));
  fireEvent.click(screen.getByRole('button', { name: `Escolher ${b.nome}` }));
  expect(f.ouro).toBe(50);
  expect(f.itensMochila ?? []).toHaveLength(0);
  expect(b.escolhaEquipamento).toBeUndefined();
  expect(parseImport(exportFicha(f)).backGround?.escolhaEquipamento).toBe('dinheiro');
  view.unmount();
  render(<ModalSelecaoBackGround opcoes={[b]} titulo="Origem" backGroundInicial={f.backGround} onClose={() => {}} onSelect={b => f.setBackGround(b)} />);
  expect(screen.getByRole('button', { name: 'Receber ouro' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Equipamentos iniciais' }));
  fireEvent.click(screen.getByRole('button', { name: `Escolher ${b.nome}` }));
  expect(f.ouro).toBe(8);
  expect(f.itensMochila?.length).toBeGreaterThan(0);
  expect(parseImport(exportFicha(f)).backGround?.escolhaEquipamento).toBe('equipamentos');
});

test('instrumento escolhido substitui o genérico sem alterar o catálogo', () => {
  const b = new Artista();
  const f = new Ficha();
  render(<ModalSelecaoBackGround opcoes={[b]} titulo="Origem" backGroundInicial={b} onClose={() => {}} onSelect={b => f.setBackGround(b)} />);
  fireEvent.change(screen.getByLabelText('Instrumento musical'), { target: { value: 'Flauta' } });
  fireEvent.click(screen.getByRole('button', { name: `Escolher ${b.nome}` }));
  expect(f.itensMochila?.filter(i => i.nome === 'Flauta')).toHaveLength(1);
  expect(f.itensMochila?.some(i => /instrumento musical/i.test(i.nome))).toBe(false);
  expect(b.equipamentos).not.toContain('Flauta');
});

test('Charlatão concede apenas a trapaça escolhida, preservando dez unidades', () => {
  const b = new Charlatao();
  const f = new Ficha();
  render(<ModalSelecaoBackGround opcoes={[b]} titulo="Origem" backGroundInicial={b} onClose={() => {}} onSelect={b => f.setBackGround(b)} />);
  fireEvent.change(screen.getByLabelText('Item do antecedente'), { target: { value: 'dez garrafas tampadas preenchidas com líquidos coloridos' } });
  fireEvent.click(screen.getByRole('button', { name: `Escolher ${b.nome}` }));
  expect(f.itensMochila?.filter(i => /garrafas tampadas/i.test(i.nome))).toHaveLength(10);
  expect(f.itensMochila?.some(i => /ferramentas de trapaça/i.test(i.nome))).toBe(false);
  expect(f.ouro).toBe(15);
});
