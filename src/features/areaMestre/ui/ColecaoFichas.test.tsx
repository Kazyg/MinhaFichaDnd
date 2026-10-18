import { fireEvent, render, screen } from '@testing-library/react';
import ColecaoFichas from './ColecaoFichas';
import { DadosCampanha } from '../modelos';
import { criarLayoutPadrao } from './layoutWorkspace';

const dados: DadosCampanha = {
  campanha: { id: 'c', nome: 'Campanha', schemaVersion: 1, roteiro: '', criadoEm: '2026-10-17', atualizadoEm: '2026-10-17' },
  anexos: [], instancias: [], combates: [], participantes: [], layout: criarLayoutPadrao('c'),
  fichas: [{ id: 'f', campanhaId: 'c', categoria: 'monstro', nome: 'Dragão', formato: 'pdf', anexoId: 'a', pvIniciais: { atuais: 12, maximos: 20 }, origemPV: 'manual-pendente', avisos: [], importadoEm: '2026-10-17' }],
};

test('coleção mostra referência e conserva ações fora das miniaturas do quadro', () => {
  const onAbrir = jest.fn(), onAdicionar = jest.fn(), onExcluir = jest.fn(), onEditar = jest.fn(), onFechar = jest.fn();
  render(<ColecaoFichas categoria="monstro" dados={dados} {...{ onAbrir, onAdicionar, onExcluir, onEditar, onFechar }} />);
  expect(screen.getByRole('dialog', { name: 'Coleção de monstros' })).toHaveClass('am-colecao');
  expect(screen.getByText('PV de referência: 12 / 20')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Abrir ficha Dragão' }));
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar instância de Dragão' }));
  fireEvent.click(screen.getByRole('button', { name: 'Editar dados e retrato de Dragão' }));
  fireEvent.click(screen.getByRole('button', { name: 'Excluir ficha Dragão' }));
  expect(onAbrir).toHaveBeenCalledWith('f'); expect(onAdicionar).toHaveBeenCalledWith('f');
  expect(onEditar).toHaveBeenCalledWith('f'); expect(onExcluir).toHaveBeenCalledWith('f');
  fireEvent.click(screen.getByRole('button', { name: 'Fechar coleção' })); expect(onFechar).toHaveBeenCalledTimes(1);
});

test('coleção vazia informa inclusão pela navegação sem duplicar botões', () => {
  render(<ColecaoFichas categoria="jogador" dados={dados} onAbrir={jest.fn()} onAdicionar={jest.fn()} onExcluir={jest.fn()} onEditar={jest.fn()} onFechar={jest.fn()} />);
  expect(screen.getByText(/Use a navegação/)).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(1);
});
