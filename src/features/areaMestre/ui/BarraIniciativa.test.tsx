import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import BarraIniciativa, { janelaIniciativa } from './BarraIniciativa';
import { DadosCampanha } from '../modelos';

function dadosTeste(n = 6, ativo = 2): DadosCampanha {
  return {
    campanha: { id: 'c', nome: 'Campanha', schemaVersion: 1, roteiro: '', criadoEm: '', atualizadoEm: '' },
    anexos: [], fichas: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
    combates: [{ id: 'b', campanhaId: 'c', estado: 'ativo', rodada: 1, participanteAtivoId: `p${ativo}`, iniciadoEm: '', encerradoEm: null }],
    instancias: Array.from({ length: n }, (_, i) => ({ id: `i${i}`, campanhaId: 'c', nome: String.fromCharCode(65 + i), categoria: 'monstro', fichaOriginalId: null, pv: { atuais: i ? 0 : 12, maximos: 20 } })),
    participantes: Array.from({ length: n }, (_, i) => ({ id: `p${i}`, combateId: 'b', instanciaId: `i${i}`, iniciativa: 10 - i, ordem: i, pvInicio: { atuais: 20, maximos: 20 } })),
  };
}
function props(n = 6, ativo = 2) { return { dados: dadosTeste(n, ativo), combateId: 'b', ocupado: false, onAvancar: jest.fn(async () => true), onReordenar: jest.fn(async () => true), onAbrirParticipante: jest.fn() }; }
const lista = () => screen.getByRole('list', { name: 'Ordem de iniciativa' });
const itens = () => within(lista()).getAllByRole('listitem');
function ponteiro(elemento: HTMLElement, tipo: string, x: number, y = 20, id = 1, pointerType = 'touch') {
  fireEvent(elemento, Object.assign(new Event(tipo, { bubbles: true }), { pointerId: id, pointerType, button: 0, clientX: x, clientY: y }));
}

test.each([2, 3, 4, 6, 20])('cinco posições com %i participantes, centro ativo e controles únicos por identidade', n => {
  const p = props(n, 0); const antes = JSON.stringify(p.dados);
  render(<BarraIniciativa {...p} />);
  expect(itens()).toHaveLength(5);
  expect(itens()[2]).toHaveAttribute('aria-current', 'step');
  expect(itens().filter(item => item.hasAttribute('aria-current'))).toHaveLength(1);
  const esperados = [-2, -1, 0, 1, 2].map(i => `p${((i % n) + n) % n}`);
  expect(itens().map(item => item.getAttribute('data-iniciativa-real-id'))).toEqual(esperados);
  expect(new Set(itens().map(item => item.getAttribute('data-ocorrencia'))).size).toBe(5);
  expect(screen.getAllByRole('button', { name: /^Abrir participante/ })).toHaveLength(Math.min(n, 5));
  expect(screen.getAllByRole('button', { name: /^Reorganizar/ })).toHaveLength(Math.min(n, 5));
  expect(JSON.stringify(p.dados)).toBe(antes);
  expect(screen.queryByRole('button', { name: /^Mover .*para a/ })).not.toBeInTheDocument();
});

test('sequência A B C D E vira B C D E F e continua circular sem recalcular domínio', () => {
  const p = props(); const view = render(<BarraIniciativa {...p} />);
  expect(itens().map(item => item.getAttribute('data-iniciativa-real-id'))).toEqual(['p0', 'p1', 'p2', 'p3', 'p4']);
  const dados = { ...p.dados, combates: [{ ...p.dados.combates[0], participanteAtivoId: 'p3' }] };
  view.rerender(<BarraIniciativa {...p} dados={dados} />);
  expect(itens().map(item => item.getAttribute('data-iniciativa-real-id'))).toEqual(['p1', 'p2', 'p3', 'p4', 'p5']);
  view.rerender(<BarraIniciativa {...p} dados={{ ...dados, combates: [{ ...dados.combates[0], participanteAtivoId: 'p4' }] }} />);
  expect(itens().map(item => item.getAttribute('data-iniciativa-real-id'))).toEqual(['p2', 'p3', 'p4', 'p5', 'p0']);
  view.rerender(<BarraIniciativa {...p} dados={{ ...dados, combates: [{ ...dados.combates[0], participanteAtivoId: 'p0', rodada: 2 }] }} />);
  expect(itens()[2]).toHaveAttribute('data-iniciativa-real-id', 'p0');
  expect(screen.getByText('Rodada 2')).toBeInTheDocument();
  expect(p.onReordenar).not.toHaveBeenCalled();
});

test('três participantes repetem B C A B C e apenas a ocorrência principal abre os dados corretos', () => {
  const p = props(3, 0); render(<BarraIniciativa {...p} />);
  expect(itens().map(item => item.getAttribute('data-iniciativa-real-id'))).toEqual(['p1', 'p2', 'p0', 'p1', 'p2']);
  fireEvent.click(screen.getByRole('button', { name: 'Abrir participante B' }));
  expect(p.onAbrirParticipante).toHaveBeenCalledWith('i1');
  expect(screen.getByRole('button', { name: 'Abrir participante B' })).toHaveTextContent('PV 0/20 · 0 PV');
});

test('handle é a alternativa de teclado: setas, Home e End alcançam toda a ordem', async () => {
  const p = props(9); render(<BarraIniciativa {...p} />);
  const handle = screen.getByRole('button', { name: 'Reorganizar C' });
  fireEvent.keyDown(handle, { key: 'End' });
  expect(p.onReordenar).toHaveBeenLastCalledWith(['p0', 'p1', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p2']);
  await waitFor(() => expect(handle).toBeEnabled());
  fireEvent.keyDown(handle, { key: 'Home' });
  expect(p.onReordenar).toHaveBeenLastCalledWith(['p2', 'p0', 'p1', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']);
  await waitFor(() => expect(handle).toBeEnabled());
  fireEvent.keyDown(handle, { key: 'ArrowLeft' });
  expect(p.onReordenar).toHaveBeenLastCalledWith(['p0', 'p2', 'p1', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']);
  await waitFor(() => expect(handle).toBeEnabled());
});

test('ordem expandida acessa participantes fora da roleta e escolhe qualquer destino sem setas', async () => {
  const p = props(9); render(<BarraIniciativa {...p} />);
  fireEvent.click(screen.getByRole('button', { name: 'Reorganizar C' }));
  const modal = screen.getByRole('dialog', { name: 'Reorganizar iniciativa' });
  expect(within(modal).getAllByRole('listitem')).toHaveLength(9);
  fireEvent.change(within(modal).getByLabelText('Posição de I'), { target: { value: '0' } });
  expect(p.onReordenar).toHaveBeenCalledWith(['p8', 'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Concluir reordenação' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: 'Concluir reordenação' }));
  expect(itens()[2]).toHaveAttribute('data-iniciativa-real-id', 'p2');
  expect(p.dados.combates[0].rodada).toBe(1);
});

test.each(['touch', 'mouse'])('drag %s usa IDs reais, só grava no drop e não abre ficha ou ordem completa', async tipo => {
  const p = props(3, 0); render(<BarraIniciativa {...p} />);
  const anterior = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
  const destino = itens()[4]; // C repetido: representa p2, não a posição visual 4.
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => destino });
  try {
    const handle = screen.getByRole('button', { name: 'Reorganizar A' });
    ponteiro(handle, 'pointerdown', 20, 20, 1, tipo);
    ponteiro(handle, 'pointermove', 200, 20, 1, tipo);
    expect(destino).toHaveClass('am-iniciativa-destino');
    expect(p.onReordenar).not.toHaveBeenCalled();
    ponteiro(handle, 'pointerup', 200, 20, 1, tipo);
    fireEvent.click(handle, { detail: 1 });
    expect(p.onReordenar).toHaveBeenCalledWith(['p1', 'p2', 'p0']);
    await waitFor(() => expect(handle).toBeEnabled());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(p.onAbrirParticipante).not.toHaveBeenCalled();
  } finally {
    if (anterior) Object.defineProperty(document, 'elementFromPoint', anterior); else Reflect.deleteProperty(document, 'elementFromPoint');
  }
});

test('drag vertical na ordem completa permite mover além dos cinco visíveis', async () => {
  const p = props(9); render(<BarraIniciativa {...p} />);
  fireEvent.click(screen.getByRole('button', { name: 'Reorganizar C' }));
  const modal = screen.getByRole('dialog');
  const destino = within(modal).getAllByRole('listitem')[8];
  const anterior = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => destino });
  try {
    const handle = within(modal).getByRole('button', { name: 'Reorganizar A' });
    ponteiro(handle, 'pointerdown', 20); ponteiro(handle, 'pointermove', 20, 250); ponteiro(handle, 'pointerup', 20, 250);
    expect(p.onReordenar).toHaveBeenCalledWith(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p0']);
    await waitFor(() => expect(handle).toBeEnabled());
  } finally {
    if (anterior) Object.defineProperty(document, 'elementFromPoint', anterior); else Reflect.deleteProperty(document, 'elementFromPoint');
  }
});

test('outro toque, cancelamento e perda de captura não persistem', () => {
  const p = props(); const view = render(<BarraIniciativa {...p} />);
  const handle = screen.getByRole('button', { name: 'Reorganizar C' });
  ponteiro(handle, 'pointerdown', 20); ponteiro(handle, 'pointermove', 200, 20, 2); ponteiro(handle, 'pointerup', 200, 20, 2);
  ponteiro(handle, 'lostpointercapture', 200); ponteiro(handle, 'pointerup', 200);
  ponteiro(handle, 'pointerdown', 20); ponteiro(handle, 'pointermove', 200); ponteiro(handle, 'pointercancel', 200); ponteiro(handle, 'pointerup', 200);
  ponteiro(handle, 'pointerdown', 20); view.rerender(<BarraIniciativa {...p} ocupado />); ponteiro(handle, 'pointerup', 200);
  expect(p.onReordenar).not.toHaveBeenCalled();
});

test('avanço pendente bloqueia repetição e falha não altera a janela', async () => {
  const p = props(); let concluir!: (valor: boolean) => void;
  p.onAvancar.mockImplementation(() => new Promise(resolve => { concluir = resolve; }));
  render(<BarraIniciativa {...p} />);
  const botao = screen.getByRole('button', { name: 'Próximo turno' });
  fireEvent.click(botao); fireEvent.click(botao);
  expect(p.onAvancar).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Reorganizar C' })).toBeDisabled();
  await act(async () => { concluir(false); });
  expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível salvar');
  expect(botao).toBeEnabled();
  expect(itens()[2]).toHaveAttribute('data-iniciativa-real-id', 'p2');
});

test('erro inesperado e falha de reordenação são anunciados e permitem nova tentativa', async () => {
  const p = props(); p.onReordenar.mockRejectedValue(new Error('Falha'));
  render(<BarraIniciativa {...p} />);
  fireEvent.keyDown(screen.getByRole('button', { name: 'Reorganizar C' }), { key: 'ArrowRight' });
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível salvar');
  expect(screen.getByRole('button', { name: 'Reorganizar C' })).toBeEnabled();
});

test('chaves das ocorrências continuam estáveis na virada de rodada e nenhuma posição persiste', () => {
  const dados = dadosTeste();
  const fim = janelaIniciativa(dados.participantes, 'p5', 1);
  const inicio = janelaIniciativa(dados.participantes, 'p0', 2);
  expect(fim.slice(1).map(p => p.chave)).toEqual(inicio.slice(0, 4).map(p => p.chave));
  expect(new Set(janelaIniciativa(dados.participantes.slice(0, 2), 'p0', Number.MAX_SAFE_INTEGER).map(p => p.chave)).size).toBe(5);
});

test('não renderiza roleta sem combate em andamento', () => {
  const p = props(); p.dados.combates[0].estado = 'preparado';
  const view = render(<BarraIniciativa {...p} />);
  expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
  p.dados.combates[0].estado = 'encerrado'; view.rerender(<BarraIniciativa {...p} />);
  expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
});

test.each([false, true])('anima deslocamento de retratos somente na janela, movimento reduzido=%s', reduzido => {
  const media = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  const geometria = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function(this: HTMLElement) {
    const slot = Number(this.getAttribute('aria-label')?.startsWith('Turno atual') ? 2 : this.getAttribute('aria-label')?.startsWith('Próximo 1') ? 3 : this.getAttribute('aria-label')?.startsWith('Próximo 2') ? 4 : this.getAttribute('aria-label')?.startsWith('Anterior 1') ? 1 : 0);
    return { left: slot * 100, width: slot === 2 ? 116 : 100 } as DOMRect;
  });
  const animacaoAnterior = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
  const cancelar = jest.fn(); const animar = jest.fn(() => ({ cancel: cancelar }));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animar });
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: reduzido }) });
  try {
    const p = props(); const view = render(<BarraIniciativa {...p} />);
    expect(animar).not.toHaveBeenCalled();
    view.rerender(<BarraIniciativa {...p} dados={{ ...p.dados, combates: [{ ...p.dados.combates[0], participanteAtivoId: 'p3' }] }} />);
    expect(animar).toHaveBeenCalledTimes(reduzido ? 0 : 5);
    expect(animar.mock.calls[0]).toEqual(reduzido ? undefined : [expect.arrayContaining([expect.objectContaining({ transform: expect.stringContaining('translateX(100px)') })]), { duration: 220, easing: 'ease-out' }]);
    const chamadas = animar.mock.calls.length;
    view.rerender(<BarraIniciativa {...p} dados={{ ...p.dados, combates: [{ ...p.dados.combates[0], participanteAtivoId: 'p3' }], instancias: p.dados.instancias.map(i => ({ ...i, pv: { ...i.pv, atuais: 1 } })) }} />);
    expect(animar).toHaveBeenCalledTimes(chamadas);
    view.unmount();
    expect(cancelar).toHaveBeenCalledTimes(reduzido ? 0 : 5);
  } finally {
    geometria.mockRestore();
    if (media) Object.defineProperty(window, 'matchMedia', media); else Reflect.deleteProperty(window, 'matchMedia');
    if (animacaoAnterior) Object.defineProperty(HTMLElement.prototype, 'animate', animacaoAnterior); else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  }
});

test('viewport compacto preserva cinco prévias, centro e acesso à ordem completa sem focar extremidades cortadas', () => {
  const anterior = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (consulta: string) => ({ matches: consulta.includes('450px'), addEventListener: jest.fn(), removeEventListener: jest.fn() }) });
  try {
    const p = props(9); render(<BarraIniciativa {...p} />);
    expect(itens()).toHaveLength(5);
    expect(within(itens()[0]).queryByRole('button')).not.toBeInTheDocument();
    expect(within(itens()[4]).queryByRole('button')).not.toBeInTheDocument();
    expect(itens()[2]).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: 'Reorganizar C' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir participante I' }));
    expect(p.onAbrirParticipante).toHaveBeenCalledWith('i8');
  } finally {
    if (anterior) Object.defineProperty(window, 'matchMedia', anterior); else Reflect.deleteProperty(window, 'matchMedia');
  }
});
