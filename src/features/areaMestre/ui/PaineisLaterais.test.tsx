import { RepositorioCampanhas } from '../contratos';
import { useCampanhas } from '../useCampanhas';
import { repositorioTeste } from './testRepositorio';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaineisLaterais from './PaineisLaterais';
import { criarLayoutPadrao } from './layoutWorkspace';

beforeEach(() => { Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 }); });
test('teclado respeita limites e preserva largura da outra lateral', () => {
  const layout = { ...criarLayoutPadrao('a'), larguraSidebar: 260, larguraPV: 320 };
  const onChange = jest.fn();
  render(<PaineisLaterais layout={layout} onChange={onChange} sidebar={<nav />} pv={<aside />}>Grade</PaineisLaterais>);
  const esquerda = screen.getByRole('separator', { name: 'Largura da navegação' });
  fireEvent.keyDown(esquerda, { key: 'End' });
  expect(onChange).toHaveBeenLastCalledWith({ ...layout, larguraSidebar: 400 });
  fireEvent.keyDown(esquerda, { key: 'Home' });
  expect(onChange).toHaveBeenLastCalledWith({ ...layout, larguraSidebar: 200 });
  fireEvent.keyDown(screen.getByRole('separator', { name: 'Largura dos pontos de vida' }), { key: 'ArrowLeft' });
  expect(onChange).toHaveBeenLastCalledWith({ ...layout, larguraPV: 330 });
});
test('recolhimento preserva memória e adaptação não grava dimensões', () => {
  const layout = { ...criarLayoutPadrao('a'), larguraSidebar: 380, larguraPV: 420, sidebarRecolhida: true };
  const onChange = jest.fn();
  const { rerender } = render(<PaineisLaterais layout={layout} onChange={onChange} sidebar="Menu" pv="PV">Grade</PaineisLaterais>);
  expect(screen.queryByRole('separator', { name: 'Largura da navegação' })).not.toBeInTheDocument();
  rerender(<PaineisLaterais layout={{ ...layout, sidebarRecolhida: false }} onChange={onChange} sidebar="Menu" pv="PV">Grade</PaineisLaterais>);
  expect(screen.getByRole('separator', { name: 'Largura da navegação' })).toHaveAttribute('aria-valuenow', '380');
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 });
  fireEvent(window, new Event('resize'));
  expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  expect(onChange).not.toHaveBeenCalled();
});
test('arraste só persiste no término e cancelamento descarta a prévia', () => {
  const original = window.PointerEvent;
  class PointerTeste extends MouseEvent { pointerId: number; constructor(tipo: string, opcoes: PointerEventInit) { super(tipo, opcoes); this.pointerId = opcoes.pointerId ?? 1; } }
  window.PointerEvent = PointerTeste as typeof PointerEvent;
  try {
    const layout = criarLayoutPadrao('a'); const onChange = jest.fn();
    render(<PaineisLaterais layout={layout} onChange={onChange} sidebar="Menu" pv="PV">Grade</PaineisLaterais>);
    const separador = screen.getByRole('separator', { name: 'Largura da navegação' });
    fireEvent.pointerDown(separador, { clientX: 260, button: 0, pointerId: 1 });
    fireEvent.pointerMove(separador, { clientX: 310.4, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
    expect(separador).toHaveAttribute('aria-valuenow', '310');
    fireEvent.pointerUp(separador, { pointerId: 1 });
    expect(onChange).toHaveBeenCalledWith({ ...layout, larguraSidebar: 310 });
    onChange.mockClear();
    fireEvent.pointerDown(separador, { clientX: 260, button: 0, pointerId: 2 });
    fireEvent.pointerMove(separador, { clientX: 350, pointerId: 2 });
    fireEvent.pointerCancel(separador, { pointerId: 2 });
    expect(onChange).not.toHaveBeenCalled();
    expect(separador).toHaveAttribute('aria-valuenow', String(layout.larguraSidebar ?? 260));
  } finally { window.PointerEvent = original; }
});

function Persistencia({ repo }: { repo: RepositorioCampanhas }) {
  const estado = useCampanhas(repo);
  return <>
    <button disabled={estado.carregando} onClick={() => void estado.criar('Laterais')}>Criar</button>
    {estado.campanhas.map(c => <button key={c.id} onClick={() => void estado.selecionar(c.id)}>Abrir {c.nome}</button>)}
    {estado.dados && <PaineisLaterais layout={estado.dados.layout} onChange={layout => estado.atualizar(atual => ({ ...atual, layout }))} sidebar="Menu" pv="PV">Grade</PaineisLaterais>}
  </>;
}
test('larguras atravessam hook, IndexedDB e reabertura da conexão', async () => {
  const ambiente = repositorioTeste();
  try {
    const view = render(<Persistencia repo={ambiente.repositorio} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Criar' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));
    fireEvent.keyDown(await screen.findByRole('separator', { name: 'Largura da navegação' }), { key: 'End' });
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Largura dos pontos de vida' }), { key: 'Home' });
    await waitFor(async () => {
      const [campanha] = await ambiente.repositorio.listar();
      const dados = await ambiente.repositorio.obter(campanha.id);
      expect(dados?.layout).toMatchObject({ larguraSidebar: 400, larguraPV: 240 });
    });
    view.unmount(); ambiente.repositorio.fechar();
    render(<Persistencia repo={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir Laterais' }));
    expect(await screen.findByRole('separator', { name: 'Largura da navegação' })).toHaveAttribute('aria-valuenow', '400');
    expect(screen.getByRole('separator', { name: 'Largura dos pontos de vida' })).toHaveAttribute('aria-valuenow', '240');
  } finally { ambiente.limpar(); }
});

test('reserva 320px úteis na grade além de padding e separadores', () => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
  const layout = { ...criarLayoutPadrao('a'), larguraSidebar: 400, larguraPV: 440 };
  const onChange = jest.fn();
  render(<PaineisLaterais layout={layout} onChange={onChange} sidebar="Menu" pv="PV">Grade</PaineisLaterais>);
  const esquerda = screen.getByRole('separator', { name: 'Largura da navegação' });
  expect(esquerda).toHaveAttribute('aria-valuenow', '392');
  expect(1200 - Number(esquerda.getAttribute('aria-valuenow')) - 440 - 16 - 32).toBeGreaterThanOrEqual(320);
  fireEvent.keyDown(esquerda, { key: 'End' });
  expect(onChange).toHaveBeenCalledWith({ ...layout, larguraSidebar: 392 });
});
