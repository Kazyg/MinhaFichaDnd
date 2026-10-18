import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { GridWorkspace } from './GridWorkspace';
import { criarLayoutPadrao } from './layoutWorkspace';

let mockLargura = 868;
let mockGradeProps: any;
jest.mock('react-grid-layout', () => {
  const original = jest.requireActual('react-grid-layout');
  return { ...original, useContainerWidth: () => ({ width: mockLargura, containerRef: { current: null } }),
    GridLayout: (props: any) => { mockGradeProps = props; return <div>{props.children}</div>; } };
});
beforeEach(() => { window.innerWidth = 1280; mockLargura = 868; mockGradeProps = undefined; });
const painel = (p: any) => <section><span tabIndex={0} className="mestre-drag-handle" data-panelid={p.id}>{p.tipo}</span></section>;

test('habilita gestos diretamente e salva somente ao terminar', () => {
  const onChange = jest.fn();
  render(<GridWorkspace layout={criarLayoutPadrao('a')} onChange={onChange} renderPainel={painel} />);
  expect(onChange).not.toHaveBeenCalled();
  expect(mockGradeProps.dragConfig).toMatchObject({ enabled: true, handle: '.mestre-drag-handle', bounded: false });
  expect(mockGradeProps.resizeConfig.enabled).toBe(true);
  mockGradeProps.onDragStop(mockGradeProps.layout);
  expect(onChange).toHaveBeenCalledTimes(1);
});
test('desktop estreito continua editavel com as duas barras abertas', () => {
  mockLargura = 360;
  render(<GridWorkspace layout={criarLayoutPadrao('a')} onChange={jest.fn()} renderPainel={painel} />);
  expect(mockGradeProps.dragConfig.enabled).toBe(true);
});
test('tablet deriva seis colunas sem gravar o layout desktop', () => {
  window.innerWidth = 1000;
  const onChange = jest.fn();
  render(<GridWorkspace layout={criarLayoutPadrao('a')} onChange={onChange} renderPainel={painel} />);
  expect(mockGradeProps.gridConfig.cols).toBe(6);
  expect(mockGradeProps.dragConfig.enabled).toBe(false);
  mockGradeProps.onResizeStop(mockGradeProps.layout);
  expect(onChange).not.toHaveBeenCalled();
});
test('handle permite mover e redimensionar com teclado', () => {
  const onChange = jest.fn();
  render(<GridWorkspace layout={criarLayoutPadrao('a')} onChange={onChange} renderPainel={painel} />);
  fireEvent.keyDown(screen.getByText('monstros'), { key: 'ArrowRight' });
  expect(onChange.mock.calls[0][0].paineis[0].x).toBe(1);
  fireEvent.keyDown(screen.getByText('monstros'), { key: 'ArrowDown', shiftKey: true });
  expect(onChange.mock.calls[1][0].paineis[0].altura).toBe(11);
});
test('viewport menor nao salva e gesto alem do limite e rejeitado', () => {
  const onChange = jest.fn();
  const layout = criarLayoutPadrao('a');
  const { rerender } = render(<GridWorkspace layout={layout} onChange={onChange} renderPainel={painel} />);
  mockGradeProps.onDragStop([{ ...mockGradeProps.layout[0], y: 59, h: 10 }]);
  expect(onChange).not.toHaveBeenCalled();
  window.innerWidth = 1000;
  fireEvent(window, new Event('resize'));
  rerender(<GridWorkspace layout={layout} onChange={onChange} renderPainel={painel} />);
  expect(mockGradeProps.gridConfig.cols).toBe(6);
  expect(onChange).not.toHaveBeenCalled();
  expect(layout.paineis[2].x).toBe(8);
});

test('teclado mobile altera grade canonica sem persistir a derivacao responsiva', () => {
  window.innerWidth = 400;
  mockLargura = 400;
  const onChange = jest.fn();
  render(<GridWorkspace layout={criarLayoutPadrao('a')} onChange={onChange} renderPainel={painel} />);
  fireEvent.keyDown(screen.getByText('monstros'), { key: 'ArrowRight' });
  const salvo = onChange.mock.calls[0][0];
  expect(salvo.paineis[0].x).toBe(1);
  expect(salvo.paineis[2].x).toBe(8);
  expect(salvo.paineis[2].largura).toBe(4);
});
