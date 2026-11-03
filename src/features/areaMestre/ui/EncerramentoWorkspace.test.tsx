import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AreaMestreWorkspace from './AreaMestreWorkspace';
import { useCampanhas } from '../useCampanhas';
import { RepositorioCampanhas } from '../contratos';
import { DadosCampanha } from '../modelos';
import { confirmarPreparacao } from '../preparacaoCombate';
import { criarLayoutPadrao } from './layoutWorkspace';
import { repositorioTeste } from './testRepositorio';

function Tela({ repo }: { repo: RepositorioCampanhas }) { return <AreaMestreWorkspace estado={useCampanhas(repo)} onSair={jest.fn()} />; }
const data = '2026-10-18T12:00:00Z';
function inicial(): DadosCampanha {
  const dados: DadosCampanha = {
    campanha: { id: 'c', nome: 'Múltiplos encontros', schemaVersion: 1, roteiro: '', criadoEm: data, atualizadoEm: data },
    anexos: [], fichas: [], instancias: ['Ária', 'Guarda', 'Fora'].map((nome, i) => ({ id: `i${i}`, campanhaId: 'c', nome, categoria: i === 0 ? 'jogador' : 'monstro', fichaOriginalId: null, pv: { atuais: 3, maximos: 8 } })),
    combates: [], participantes: [], layout: criarLayoutPadrao('c'),
  };
  return confirmarPreparacao(dados, { nome: 'Torre', participantes: dados.instancias.slice(0, 2).map((instancia, i) => ({ id: `p${i}`, instancia, iniciativa: 10 - i })) }, 'A', data);
}
let ambiente: ReturnType<typeof repositorioTeste>;
beforeEach(async () => { ambiente = repositorioTeste(); await ambiente.repositorio.criar(inicial()); });
afterEach(() => ambiente.limpar());
const barra = () => screen.getByRole('region', { name: 'Barra de iniciativa' });
async function abrir() {
  fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Múltiplos encontros' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver encontro preparado 1' }));
  fireEvent.click(within(screen.getByRole('dialog', { name: 'Encontro preparado' })).getByRole('button', { name: 'Iniciar combate' }));
  await screen.findByRole('region', { name: 'Barra de iniciativa' });
}
async function dano(nome: string, valor: string) {
  fireEvent.click(within(screen.getByRole('article', { name: `PV de ${nome}` })).getByRole('button'));
  fireEvent.change(screen.getByLabelText('Dano'), { target: { value: valor } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}

test('condição aplicada pela roleta persiste, edita e expira no turno completo do alvo', async () => {
  render(<Tela repo={ambiente.repositorio} />); await abrir();
  fireEvent.click(within(barra()).getByRole('button', { name: 'Adicionar condição a Ária' }));
  const modal = await screen.findByRole('dialog', { name: 'Adicionar condição — Ária' });
  fireEvent.change(within(modal).getByLabelText('Categoria'), { target: { value: 'dano-continuo' } });
  fireEvent.click(within(modal).getByRole('button', { name: /^Queimando/ }));
  fireEvent.change(within(modal).getByLabelText('Quantidade de turnos do alvo'), { target: { value: '2' } });
  fireEvent.click(within(modal).getByRole('button', { name: '+ Adicionar efeito' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect((await ambiente.repositorio.obter('c'))!.combates[0].condicoes![0].restantes).toBe(2);
  fireEvent.click(within(barra()).getByRole('button', { name: /Editar Queimando/ }));
  const edicao = await screen.findByRole('dialog', { name: 'Editar condição — Ária' });
  fireEvent.change(within(edicao).getByLabelText('Quantidade de turnos do alvo'), { target: { value: '1' } });
  fireEvent.click(within(edicao).getByRole('button', { name: 'Salvar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const quantidades: number[] = [];
  for (let i = 0; i < 3; i++) {
    const proximo = within(barra()).getByRole('button', { name: 'Próximo turno' });
    await waitFor(() => expect(proximo).toBeEnabled());
    fireEvent.click(proximo);
    await waitFor(() => expect((screen.getByRole('region', { name: 'Barra de iniciativa' }))).toHaveAttribute('aria-busy', 'false'));
    quantidades.push((await ambiente.repositorio.obter('c'))!.combates[0].condicoes!.length);
  }
  expect(quantidades).toEqual([1, 1, 0]);
  expect((await ambiente.repositorio.obter('c'))!.combates[0].condicoes).toHaveLength(0);
  expect(within(barra()).queryByRole('button', { name: /Editar Queimando/ })).not.toBeInTheDocument();
  expect(screen.getByRole('article', { name: 'PV de Ária' })).toHaveTextContent('3/8');
});

test('cria outro ativo, alterna, cancela e encerra com decisões distintas, preservando painel e histórico', async () => {
  render(<Tela repo={ambiente.repositorio} />); await abrir();
  await dano('Ária', '2');
  fireEvent.click(within(barra()).getByRole('button', { name: 'Próximo turno' }));
  await waitFor(() => expect(within(barra()).getByRole('button', { name: 'Próximo turno' })).toBeEnabled());
  const torre = (await ambiente.repositorio.obter('c'))!.combates[0];
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar combate' }));
  expect(screen.getByRole('dialog', { name: 'Combate em andamento' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Criar outro combate' }));
  fireEvent.change(screen.getByLabelText('Nome do combate (opcional)'), { target: { value: 'Floresta' } });
  expect(screen.getByRole('button', { name: 'Selecionar jogador Ária' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Selecionar jogador Ária' })).toHaveTextContent('Em Torre');
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar combatente avulso' }));
  for (const [label, value] of [['Nome do combatente', 'Lobo'], ['PV máximos', '10'], ['PV atuais', '4'], ['Quantidade', '2']]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
  const resumo = await screen.findByRole('dialog', { name: 'Encontro preparado' });
  fireEvent.click(within(resumo).getByRole('button', { name: 'Iniciar combate' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(within(barra()).getByText('Floresta')).toBeInTheDocument();
  expect((await ambiente.repositorio.obter('c'))!.combates[0]).toEqual(torre);
  const floresta = (await ambiente.repositorio.obter('c'))!.combates[1];
  fireEvent.click(screen.getByRole('button', { name: 'Retomar combate 1' }));
  expect(within(barra()).getByText('Torre')).toBeInTheDocument();
  fireEvent.click(within(barra()).getByRole('button', { name: 'Encerrar combate' }));
  await screen.findByRole('dialog', { name: 'Encerrar combate' });
  expect(screen.getByRole('button', { name: 'Confirmar encerramento' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect((await ambiente.repositorio.obter('c'))!.combates[0]).toEqual(torre);
  fireEvent.click(within(barra()).getByRole('button', { name: 'Encerrar combate' }));
  await screen.findByRole('dialog', { name: 'Encerrar combate' });
  fireEvent.click(screen.getByRole('radio', { name: /Restaurar PV anteriores/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar encerramento' }));
  const historico = await screen.findByRole('dialog', { name: 'Histórico do combate' });
  expect(within(historico).getByRole('cell', { name: '1/8' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Fechar histórico' }));
  expect(screen.queryByRole('region', { name: 'Barra de iniciativa' })).not.toBeInTheDocument();
  expect(screen.getByRole('article', { name: 'PV de Ária' })).toHaveTextContent('3/8');
  expect(screen.getByRole('article', { name: 'PV de Fora' })).toHaveTextContent('3/8');
  expect((await ambiente.repositorio.obter('c'))!.combates[1]).toEqual(floresta);
  fireEvent.click(within(screen.getByRole('region', { name: 'Combates em andamento' })).getByRole('button'));
  await dano('Lobo 1', '50');
  fireEvent.click(within(barra()).getByRole('button', { name: 'Encerrar combate' }));
  await screen.findByRole('dialog', { name: 'Encerrar combate' });
  fireEvent.click(screen.getByRole('radio', { name: /Manter PV atuais/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar encerramento' }));
  await screen.findByRole('dialog', { name: 'Histórico do combate' });
  fireEvent.click(screen.getByRole('button', { name: 'Fechar histórico' }));
  expect(screen.getByRole('article', { name: 'PV de Lobo 1' })).toHaveTextContent('0/10');
  fireEvent.click(screen.getByRole('button', { name: 'Gerenciar combates' }));
  const encerrados = await screen.findByRole('region', { name: 'Encerrados' });
  expect(within(encerrados).getAllByRole('listitem')[0]).toHaveTextContent('Floresta');
  expect(within(encerrados).queryByRole('button', { name: 'Retomar combate' })).not.toBeInTheDocument();
  fireEvent.click(within(encerrados).getAllByRole('button', { name: 'Consultar histórico' })[1]);
  expect(await screen.findByRole('cell', { name: '1/8' })).toBeInTheDocument();
  const salvo = (await ambiente.repositorio.obter('c'))!;
  expect(salvo.combates.every(c => c.estado === 'encerrado')).toBe(true);
  expect(salvo.instancias).toHaveLength(5);
});

test('mudança em outra aba durante confirmação mantém modal, não restaura e exige recarga', async () => {
  render(<Tela repo={ambiente.repositorio} />); await abrir();
  fireEvent.click(within(barra()).getByRole('button', { name: 'Encerrar combate' }));
  await screen.findByRole('dialog', { name: 'Encerrar combate' });
  const externa = (await ambiente.repositorio.obter('c'))!;
  externa.instancias[0].pv = { atuais: 5, maximos: 12 };
  await ambiente.repositorio.salvar(externa);
  fireEvent.click(screen.getByRole('radio', { name: /Restaurar PV anteriores/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar encerramento' }));
  expect(await within(screen.getByRole('dialog', { name: 'Encerrar combate' })).findByRole('alert')).toHaveTextContent('outra aba');
  const salvo = (await ambiente.repositorio.obter('c'))!;
  expect(salvo.combates[0].estado).toBe('ativo');
  expect(salvo.combates[0].historico).toBeUndefined();
  expect(salvo.instancias[0].pv).toEqual({ atuais: 5, maximos: 12 });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByRole('button', { name: 'Recarregar versão salva' })).toBeInTheDocument();
});
