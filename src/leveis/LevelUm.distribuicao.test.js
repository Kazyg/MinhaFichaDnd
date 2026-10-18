import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LevelOneSetup from './LevelUm';
import { useFicha } from '../api/fichaPersonagem/FichaContext';
import { Ficha } from '../api/fichaPersonagem/FichaPersonagem';
import { getRulesetData } from '../api/rulesets/getRulesetData';

jest.mock('../api/fichaPersonagem/FichaContext', () => ({ useFicha: jest.fn() }));
afterEach(() => jest.restoreAllMocks());

test.each(['DND_2014', 'DND_2024'].flatMap(versao => ['Array Padrão', 'Point Buy', 'Rolagem de Dados'].map(metodo => [versao, metodo])))('método e ação principal de distribuição continuam funcionais em %s: %s', (versaoRegras, metodo) => {
  const regras = getRulesetData(versaoRegras);
  const ficha = new Ficha({
    versaoRegras,
    classePrincipal: regras.classes[0],
    racaPrincipal: regras.racasOuEspecies[0],
    backGround: regras.backgroundsOuOrigens[0],
  });
  useFicha.mockReturnValue({ ficha, forceUpdate: jest.fn() });
  const setup = () => <LevelOneSetup raca={ficha.racaPrincipal} classe={ficha.classePrincipal} />;
  const view = render(setup());

  const dados = [0, 1 / 6, 3 / 6, 5 / 6];
  let rolagem = 0;
  if (metodo === 'Rolagem de Dados') jest.spyOn(Math, 'random').mockImplementation(() => dados[rolagem++ % dados.length]);

  expect(screen.queryByRole('button', { name: 'Distribuir Atributos' })).not.toBeInTheDocument();
  const metodos = ['Array Padrão', 'Point Buy', 'Rolagem de Dados'];
  metodos.forEach(metodo => expect(screen.getByRole('button', { name: metodo })).toHaveAttribute('aria-pressed', 'false'));

  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${metodo}`) }));
  view.rerender(setup());
  expect(ficha.distribuicaoAtributos.metodo).toBe(metodo);
  expect(screen.getByRole('button', { name: new RegExp(`^${metodo}`) })).toHaveAttribute('aria-pressed', 'true');
  const acao = screen.getByRole('button', { name: 'Distribuir Atributos' });
  expect(acao).toHaveClass('botao-distribuir-principal');
  expect(acao).toBeEnabled();
  fireEvent.click(acao);
  expect(screen.getByText('Distribuição de Atributos')).toBeInTheDocument();
  const valoresEsperados = {
    'Array Padrão': [15, 14, 13, 12, 10, 8],
    'Point Buy': [],
    'Rolagem de Dados': [12, 12, 12, 12, 12, 12],
  };
  expect(ficha.distribuicaoAtributos.gerados).toEqual(valoresEsperados[metodo]);
  expect(ficha.distribuicaoAtributos.gerados.every(valor => valor >= 3 && valor <= 18)).toBe(true);
  expect(ficha.distribuicaoAtributos.pontos).toBe(27);
});
