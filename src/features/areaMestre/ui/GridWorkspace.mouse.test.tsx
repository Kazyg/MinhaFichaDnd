
import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GridWorkspace } from './GridWorkspace';
import { criarLayoutPadrao } from './layoutWorkspace';
import { repositorioTeste } from './testRepositorio';
import { useCampanhas } from '../useCampanhas';



jest.mock('react-grid-layout', () => ({
  ...jest.requireActual('react-grid-layout'),
  useContainerWidth: () => ({ width: 960, containerRef: { current: null } }),
}));

let offsetParent: jest.SpyInstance;
beforeEach(() => {
  window.innerWidth = 1400;
  offsetParent = jest.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(function (this: HTMLElement) { return this.parentElement; });
});
afterEach(() => offsetParent.mockRestore());
test('real library mouse drag changes saved coordinates and resize changes saved dimensions', () => {
  const saved = jest.fn();
  function Workspace() {
    const [layout, setLayout] = useState(criarLayoutPadrao('mouse'));
    return <GridWorkspace layout={layout} onChange={next => { saved(next); setLayout(next); }}
      renderPainel={p => <section><span className="mestre-drag-handle" data-testid={`handle-${p.id}`}>{p.tipo}</span><button>Acao</button></section>} />;
  }
  render(<Workspace />);
  const handle = screen.getByTestId('handle-monstros');
  const button = handle.parentElement!.querySelector('button')!;
  fireEvent.mouseDown(button, { button: 0, clientX: 20, clientY: 20 });
  fireEvent.mouseMove(document, { buttons: 1, clientX: 340, clientY: 520 });
  fireEvent.mouseUp(document, { button: 0, clientX: 340, clientY: 520 });
  expect(saved).not.toHaveBeenCalled();
  fireEvent.mouseDown(handle, { button: 0, clientX: 20, clientY: 20 });
  fireEvent.mouseMove(document, { buttons: 1, clientX: 340, clientY: 520 });
  fireEvent.mouseUp(document, { button: 0, clientX: 340, clientY: 520 });
  expect(saved).toHaveBeenCalled();
  const dragged = saved.mock.calls[saved.mock.calls.length - 1][0];
  expect(dragged.paineis.find((p: any) => p.id === 'monstros').x).toBeGreaterThan(0);
  expect(dragged.paineis.find((p: any) => p.id === 'monstros').y).toBeGreaterThan(0);
  const resize = screen.getByTestId('handle-monstros').closest('.react-grid-item')!.querySelector('.react-resizable-handle')!;
  expect(resize).not.toBeNull();
  saved.mockClear();
  fireEvent.mouseDown(resize, { button: 0, clientX: 300, clientY: 400 });
  fireEvent.mouseMove(document, { buttons: 1, clientX: 380, clientY: 446 });
  fireEvent.mouseUp(document, { button: 0, clientX: 380, clientY: 446 });
  expect(saved).toHaveBeenCalled();
  const resized = saved.mock.calls[saved.mock.calls.length - 1][0].paineis.find((p: any) => p.id === 'monstros');
  expect(resized.altura).toBeGreaterThan(10);
});



test('real mouse position survives autosave and IndexedDB reopen', async () => {
  const ambiente = repositorioTeste();
  function WorkspacePersistido() {
    const estado = useCampanhas(ambiente.repositorio);
    if (!estado.dados) return <button onClick={() => estado.campanhas.length ? estado.selecionar(estado.campanhas[0].id) : estado.criar('Grid persistido')}>Abrir</button>;
    return <GridWorkspace layout={estado.dados.layout}
      onChange={layout => estado.atualizar(dados => ({ ...dados, layout }))}
      renderPainel={p => <span className="mestre-drag-handle" data-testid={`persistido-${p.id}`}>{p.tipo}</span>} />;
  }
  try {
    const { unmount } = render(<WorkspacePersistido />);
    fireEvent.click(screen.getByText('Abrir'));
    const handle = await screen.findByTestId('persistido-monstros');
    fireEvent.mouseDown(handle, { button: 0, clientX: 20, clientY: 20 });
    fireEvent.mouseMove(document, { buttons: 1, clientX: 340, clientY: 520 });
    fireEvent.mouseUp(document, { button: 0, clientX: 340, clientY: 520 });
    let xSalvo = 0;
    await waitFor(async () => {
      const campanhas = await ambiente.repositorio.listar();
      const salvo = (await ambiente.repositorio.obter(campanhas[0].id))!;
      xSalvo = salvo.layout.paineis.find(p => p.id === 'monstros')!.x;
      expect(xSalvo).toBeGreaterThan(0);
    });
    unmount();
    ambiente.repositorio.fechar();
    const { unmount: unmountReaberto } = render(<WorkspacePersistido />);
    await waitFor(async () => expect(await ambiente.repositorio.listar()).toHaveLength(1));
    fireEvent.click(screen.getByText('Abrir'));
    await screen.findByTestId('persistido-monstros');
    const salvo = (await ambiente.repositorio.obter((await ambiente.repositorio.listar())[0].id))!;
    expect(salvo.layout.paineis.find(p => p.id === 'monstros')!.x).toBe(xSalvo);
    unmountReaberto();
  } finally { ambiente.limpar(); }
});



