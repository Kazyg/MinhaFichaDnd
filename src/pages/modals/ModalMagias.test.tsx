import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ModalSelecaoMagias from './ModalMagias';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { getMagiasConteudo } from '../../api/rulesets/conteudo';

let mockFicha: Ficha;
jest.mock('../../api/fichaPersonagem/FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha }) }));
beforeEach(() => { mockFicha = new Ficha({ versaoRegras: 'DND_2024' }); });

afterEach(() => jest.restoreAllMocks());

test('nomes curtos, longos e espaço reduzido mantêm nome acessível e fonte mínima', () => {
  let largura = 320;
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => largura);
  jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return (this.textContent?.length ?? 0) * parseFloat(this.style.fontSize || '14') * 0.55;
  });
  const onClose = jest.fn();
  const nomeLongo = getMagiasConteudo('DND_2024').filter(m => m.selecionavel !== false)
    .sort((a, b) => b.nome.length - a.nome.length)[0].nome;
  const props = { titulo: 'Escolher magia e fonte', onClose, onSelect: jest.fn(), magiaSelect: '',
    selecaoDirigida: { opcoes: ['Luz', nomeLongo], descricao: '', edicao: 'DND_2024' as const } };
  render(<ModalSelecaoMagias {...props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Luz' }));
  const curto = screen.getByRole('button', { name: 'Escolher Luz' });
  expect(within(curto).getByText('Escolher Luz')).toHaveStyle({ fontSize: '14px' });
  fireEvent.click(screen.getByRole('button', { name: nomeLongo }));
  const longo = screen.getByRole('button', { name: `Escolher ${nomeLongo}` });
  expect(longo).toHaveAttribute('title', `Escolher ${nomeLongo}`);
  largura = (`Escolher ${nomeLongo}`).length * 13 * 0.55;
  fireEvent(window, new Event('resize'));
  const texto = within(longo).getByText(`Escolher ${nomeLongo}`);
  expect(parseFloat(texto.style.fontSize)).toBeLessThan(14);
  expect(texto.scrollWidth).toBeLessThanOrEqual(texto.clientWidth);
  largura = 100;
  fireEvent(window, new Event('resize'));
  expect(texto).toHaveStyle({ fontSize: '12px' });
  expect(texto.scrollWidth).toBeGreaterThan(texto.clientWidth);
  largura = 400;
  fireEvent(window, new Event('resize'));
  expect(texto).toHaveStyle({ fontSize: '14px' });
  fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
