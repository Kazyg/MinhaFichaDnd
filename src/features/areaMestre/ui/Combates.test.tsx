import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { DadosCampanha } from '../modelos';
import EncerrarCombate from './EncerrarCombate';
import GerenciadorCombates from './GerenciadorCombates';
import HistoricoCombate from './HistoricoCombate';

function dadosTeste(): DadosCampanha {
  return {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Aventura', roteiro: '', criadoEm: '2026-10-18T00:00:00Z', atualizadoEm: '2026-10-18T00:00:00Z' },
    anexos: [], fichas: [], instancias: [{ id: 'i', campanhaId: 'c', categoria: 'jogador', fichaOriginalId: null, nome: 'Guerreiro', pv: { atuais: 0, maximos: 50 } }],
    combates: [{ id: 'a', campanhaId: 'c', nome: 'Torre', estado: 'ativo', rodada: 3, participanteAtivoId: 'p', iniciadoEm: '2026-10-18T00:00:00Z', encerradoEm: null, execucao: { versao: 1, origemSnapshot: 'ativacao', ativadoEm: '2026-10-18T01:00:00Z', visitados: ['p'], pvAtivacao: [{ participanteId: 'p', instanciaId: 'i', pv: { atuais: 35, maximos: 50 } }] } }],
    participantes: [{ id: 'p', combateId: 'a', instanciaId: 'i', iniciativa: -2, ordem: 0, pvInicio: { atuais: 50, maximos: 50 } }],
    layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}

test('encerramento exige escolha explícita e mostra snapshot real diferente da vida máxima', async () => {
  const dados = dadosTeste(); const confirmar = jest.fn().mockResolvedValue(true); const fechar = jest.fn();
  render(<EncerrarCombate dados={dados} combateId="a" onFechar={fechar} onConfirmar={confirmar} />);
  expect(screen.getByRole('button', { name: 'Confirmar encerramento' })).toBeDisabled();
  expect(screen.getAllByRole('radio').every(r => !(r as HTMLInputElement).checked)).toBe(true);
  fireEvent.click(screen.getByRole('radio', { name: /Restaurar PV anteriores/ }));
  expect(screen.getByRole('cell', { name: '35/50' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '0/50' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar encerramento' }));
  await waitFor(() => expect(fechar).toHaveBeenCalledTimes(1));
  expect(confirmar).toHaveBeenCalledWith('restaurar');
  expect(dados.instancias[0].pv.atuais).toBe(0);
});

test('cancelar não confirma nem modifica dados; snapshot legado permite apenas manter', () => {
  const dados = dadosTeste(); delete dados.combates[0].execucao;
  const confirmar = jest.fn(); const fechar = jest.fn(); const antes = JSON.stringify(dados);
  render(<EncerrarCombate dados={dados} combateId="a" onFechar={fechar} onConfirmar={confirmar} />);
  expect(screen.getByRole('radio', { name: /Restaurar PV anteriores/ })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Snapshot inicial válido indisponível');
  fireEvent.click(screen.getByRole('radio', { name: /Manter PV atuais/ }));
  expect(screen.getByRole('button', { name: 'Confirmar encerramento' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(fechar).toHaveBeenCalledTimes(1); expect(confirmar).not.toHaveBeenCalled(); expect(JSON.stringify(dados)).toBe(antes);
});

test('falha mantém modal aberta e tentativas concorrentes ficam bloqueadas', async () => {
  let resolver!: (v: boolean) => void; const confirmar = jest.fn(() => new Promise<boolean>(resolve => { resolver = resolve; })); const fechar = jest.fn();
  render(<EncerrarCombate dados={dadosTeste()} combateId="a" onFechar={fechar} onConfirmar={confirmar} />);
  fireEvent.click(screen.getByRole('radio', { name: /Manter PV atuais/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar encerramento' }));
  fireEvent.click(screen.getByRole('button', { name: 'Encerrando…' }));
  expect(confirmar).toHaveBeenCalledTimes(1); expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  resolver(false);
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível encerrar');
  expect(fechar).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Confirmar encerramento' })).toBeEnabled();
});

test('combate encerrado em outra aba não permite confirmar', () => {
  const dados = dadosTeste(); dados.combates[0].estado = 'encerrado';
  render(<EncerrarCombate dados={dados} combateId="a" onFechar={jest.fn()} onConfirmar={jest.fn()} />);
  expect(screen.getByRole('alert')).toHaveTextContent('não está mais em andamento');
  expect(screen.getByRole('button', { name: 'Confirmar encerramento' })).toBeDisabled();
});

function encerrar(dados: DadosCampanha) {
  const combate = dados.combates[0]; combate.estado = 'encerrado'; combate.encerradoEm = '2026-10-18T02:00:00Z';
  combate.historico = { versao: 1, decisaoPV: 'restaurar', iniciadoEm: '2026-10-18T01:00:00Z', participantes: [{ participanteId: 'p', instanciaId: 'i', fichaOriginalId: null, nome: 'Guerreiro histórico', categoria: 'jogador', iniciativa: -2, ordem: 0, pvInicial: { atuais: 35, maximos: 50 }, pvFinal: { atuais: 0, maximos: 50 } }] };
}

test('histórico preserva nome e resultados após exclusão de instância, sem oferecer alteração', () => {
  const dados = dadosTeste(); encerrar(dados); dados.instancias = []; dados.participantes = [];
  const antes = JSON.stringify(dados); const fechar = jest.fn();
  render(<HistoricoCombate dados={dados} combateId="a" onFechar={fechar} onAbrirFicha={jest.fn()} />);
  expect(screen.getByRole('rowheader', { name: /Guerreiro histórico/ })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '35/50' })).toBeInTheDocument(); expect(screen.getByRole('cell', { name: '0/50' })).toBeInTheDocument();
  expect(screen.getByText('Restaurar PV anteriores')).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Fechar histórico' })); expect(fechar).toHaveBeenCalled(); expect(JSON.stringify(dados)).toBe(antes);
});

test('histórico antigo não inventa resultados e histórico com ficha permite consulta', () => {
  const dados = dadosTeste(); encerrar(dados); delete dados.combates[0].historico;
  const abrirFicha = jest.fn();
  const view = render(<HistoricoCombate dados={dados} combateId="a" onFechar={jest.fn()} onAbrirFicha={abrirFicha} />);
  expect(screen.getByRole('status')).toHaveTextContent('não possui resultados históricos completos');
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  encerrar(dados);
  dados.combates[0].historico!.participantes[0].fichaOriginalId = 'ficha-historica';
  dados.fichas.push({ id: 'ficha-historica' } as DadosCampanha['fichas'][number]);
  view.rerender(<HistoricoCombate dados={dados} combateId="a" onFechar={jest.fn()} onAbrirFicha={abrirFicha} />);
  fireEvent.click(screen.getByRole('button', { name: 'Consultar ficha de Guerreiro histórico' }));
  expect(abrirFicha).toHaveBeenCalledWith('ficha-historica');
});

test('gerenciador agrupa estados, ordena histórico e usa callbacks do encontro correto', () => {
  const dados = dadosTeste();
  dados.combates.push({ ...dados.combates[0], id: 'b', nome: 'Preparado', estado: 'preparado', rodada: 0, execucao: undefined });
  dados.combates.push({ ...dados.combates[0], id: 'c', nome: 'Antigo', estado: 'encerrado', encerradoEm: '2026-10-17T00:00:00Z' });
  dados.combates.push({ ...dados.combates[0], id: 'd', nome: 'Recente', estado: 'encerrado', encerradoEm: '2026-10-19T00:00:00Z' });
  const preparado = jest.fn(); const retomar = jest.fn(); const finalizar = jest.fn(); const historico = jest.fn();
  render(<GerenciadorCombates dados={dados} onFechar={jest.fn()} onPreparado={preparado} onRetomar={retomar} onEncerrar={finalizar} onHistorico={historico} />);
  const encerrados = screen.getByRole('region', { name: 'Encerrados' });
  expect(within(encerrados).getAllByRole('listitem')[0]).toHaveTextContent('Recente');
  expect(within(encerrados).queryByRole('button', { name: 'Retomar combate' })).not.toBeInTheDocument();
  fireEvent.click(within(encerrados).getAllByRole('button', { name: 'Consultar histórico' })[0]); expect(historico).toHaveBeenCalledWith('d');
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar execução' })); expect(preparado).toHaveBeenCalledWith('b');
  fireEvent.click(screen.getByRole('button', { name: 'Retomar combate' })); expect(retomar).toHaveBeenCalledWith('a');
  fireEvent.click(screen.getByRole('button', { name: 'Encerrar combate' })); expect(finalizar).toHaveBeenCalledWith('a');
  expect(screen.getByText(/Guerreiro · Iniciativa -2/)).toBeInTheDocument();
});
