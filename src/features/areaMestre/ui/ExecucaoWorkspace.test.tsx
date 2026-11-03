import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AreaMestreWorkspace from './AreaMestreWorkspace';
import { useCampanhas } from '../useCampanhas';
import { RepositorioCampanhas } from '../contratos';
import { DadosCampanha } from '../modelos';
import { confirmarPreparacao } from '../preparacaoCombate';
import { executarAcaoCombate } from '../execucaoCombate';
import { criarLayoutPadrao } from './layoutWorkspace';
import { repositorioTeste } from './testRepositorio';

function Tela({ repo }: { repo: RepositorioCampanhas }) {
  return <AreaMestreWorkspace estado={useCampanhas(repo)} onSair={jest.fn()} />;
}
const agora = '2026-10-18T12:00:00.000Z';
function campanha() {
  const imagem = new Blob(['retrato'], { type: 'image/png' });
  const dados: DadosCampanha = {
    campanha: { id: 'c', nome: 'Turnos', schemaVersion: 1, roteiro: '', criadoEm: agora, atualizadoEm: agora },
    anexos: [{ id: 'imagem', campanhaId: 'c', nome: 'Goblin.png', mime: imagem.type, tamanho: imagem.size, arquivo: imagem }],
    fichas: [{ id: 'f', campanhaId: 'c', nome: 'Goblin original', categoria: 'monstro', formato: 'imagem', anexoId: 'imagem', pvIniciais: { atuais: 10, maximos: 10 }, origemPV: 'manual-pendente', avisos: [], importadoEm: agora }],
    instancias: ['Ladina', 'Goblin 1', 'Goblin 2', 'Maga'].map((nome, i) => ({ id: `i${i}`, campanhaId: 'c', nome, categoria: i === 1 || i === 2 ? 'monstro' : 'jogador', fichaOriginalId: i === 1 || i === 2 ? 'f' : null, pv: { atuais: 10, maximos: 10 } })),
    combates: [], participantes: [], layout: criarLayoutPadrao('c'),
  };
  return confirmarPreparacao(dados, { participantes: dados.instancias.map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: [22, 17, 12, -2][i] })) }, 'encontro', agora);
}

describe('execução integrada no workspace', () => {
  let ambiente: ReturnType<typeof repositorioTeste>;
  const urlOriginal = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
  const revogarOriginal = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
  beforeEach(async () => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:retrato') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
    ambiente = repositorioTeste(); await ambiente.repositorio.criar(campanha());
  });
  afterEach(() => {
    cleanup(); ambiente.limpar();
    if (urlOriginal) Object.defineProperty(URL, 'createObjectURL', urlOriginal); else Reflect.deleteProperty(URL, 'createObjectURL');
    if (revogarOriginal) Object.defineProperty(URL, 'revokeObjectURL', revogarOriginal); else Reflect.deleteProperty(URL, 'revokeObjectURL');
  });
  const abrir = async () => {
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Turnos' }));
    await screen.findByRole('button', { name: 'Ver encontro preparado 1' });
  };
  const faixa = () => screen.getByRole('region', { name: 'Barra de iniciativa' });
  const proximo = async () => {
    await waitFor(() => expect(within(faixa()).getByRole('button', { name: 'Próximo turno' })).toBeEnabled());
    fireEvent.click(within(faixa()).getByRole('button', { name: 'Próximo turno' }));
    await waitFor(() => expect(within(faixa()).getByRole('button', { name: 'Próximo turno' })).toBeEnabled());
  };
  test('inicia explicitamente, sincroniza vida/ficha, reordena e retoma sem reiniciar após reload', async () => {
    const view = render(<Tela repo={ambiente.repositorio} />);
    await abrir();
    expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver encontro preparado 1' }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Encontro preparado' })).getByRole('button', { name: 'Iniciar combate' }));
    await screen.findByRole('region', { name: 'Barra de iniciativa' });
    expect(within(faixa()).getAllByAltText('')).toHaveLength(3);
    expect(within(faixa()).getByText('Rodada 1')).toBeInTheDocument();
    await proximo(); await proximo();
    fireEvent.click(within(faixa()).getByRole('button', { name: 'Abrir participante Goblin 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ajustar vida' }));
    expect(screen.getByRole('dialog', { name: 'Goblin 1' })).toHaveClass('popup-vida-content');
    fireEvent.change(screen.getByLabelText('Dano'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('article', { name: 'PV de Goblin 1' })).toHaveTextContent('0/10');
    expect(within(faixa()).getByRole('button', { name: 'Abrir participante Goblin 1' })).toHaveTextContent('PV 0/10');
    fireEvent.click(within(screen.getByRole('article', { name: 'PV de Goblin 1' })).getByRole('button'));
    fireEvent.change(screen.getByLabelText('Cura'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(within(faixa()).getByRole('button', { name: 'Abrir participante Goblin 1' })).toHaveTextContent('PV 3/10');
    expect(screen.getByRole('article', { name: 'PV de Goblin 2' })).toHaveTextContent('10/10');
    fireEvent.click(within(faixa()).getByRole('button', { name: 'Abrir participante Goblin 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir ficha completa' }));
    expect(screen.getByRole('dialog', { name: 'Ficha original: Goblin original' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar ficha' }));
    fireEvent.keyDown(within(faixa()).getByRole('button', { name: 'Reorganizar Maga' }), { key: 'ArrowLeft' });
    await waitFor(() => expect(within(faixa()).getByRole('button', { name: 'Próximo turno' })).toBeEnabled());
    await proximo(); await proximo();
    expect(within(faixa()).getByText('Rodada 2')).toBeInTheDocument();
    const salvo = (await ambiente.repositorio.obter('c'))!;
    expect(salvo.combates[0]).toMatchObject({ rodada: 2, participanteAtivoId: 'p0' });
    expect(salvo.combates[0].execucao?.pvAtivacao.find(p => p.instanciaId === 'i1')?.pv.atuais).toBe(10);
    expect(salvo.fichas[0].pvIniciais.atuais).toBe(10);
    view.unmount(); ambiente.repositorio.fechar();
    render(<Tela repo={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Turnos' }));
    await screen.findByRole('button', { name: 'Retomar combate 1' });
    expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retomar combate 1' }));
    expect(within(faixa()).getByText('Rodada 2')).toBeInTheDocument();
    expect((await ambiente.repositorio.obter('c'))!.combates).toEqual(salvo.combates);
    expect(screen.getByRole('button', { name: 'Mover ou redimensionar Monstros' })).toBeInTheDocument();
  });
  test('dois combates ativos exigem escolha explícita e trocar a barra não muda a execução', async () => {
    let dados = (await ambiente.repositorio.obter('c'))!;
    dados = confirmarPreparacao(dados, { participantes: dados.instancias.slice(0, 2).map((instancia, indice) => ({ id: `novo-p${indice}`, iniciativa: 0, instancia: { ...instancia, id: `nova-i${indice}`, nome: `Novo ${indice}` } })) }, 'encontro-2', agora);
    dados = executarAcaoCombate(dados, 'encontro', 'iniciar', agora);
    dados = executarAcaoCombate(dados, 'encontro-2', 'iniciar', agora);
    await ambiente.repositorio.salvar(dados);
    const antes = (await ambiente.repositorio.obter('c'))!;
    render(<Tela repo={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Turnos' }));
    await screen.findByRole('button', { name: 'Retomar combate 2' });
    expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retomar combate 2' }));
    expect(within(faixa()).getByRole('button', { name: 'Abrir participante Novo 0' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retomar combate 1' }));
    expect(within(faixa()).getByRole('button', { name: 'Abrir participante Ladina' })).toBeInTheDocument();
    expect((await ambiente.repositorio.obter('c'))!.combates).toEqual(antes.combates);
  });
});
