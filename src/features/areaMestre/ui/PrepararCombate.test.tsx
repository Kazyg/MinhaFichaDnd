/* eslint-disable testing-library/no-node-access -- Verifica a separação estrutural entre listas roláveis, cabeçalhos e rodapé. */
import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import PrepararCombate from './PrepararCombate';
import { DadosCampanha } from '../modelos';
import { repositorioTeste } from './testRepositorio';

function dadosTeste(): DadosCampanha {
  return {
    campanha: { id: 'c', schemaVersion: 1, nome: 'Aventura', roteiro: '', criadoEm: '2026-10-18T00:00:00Z', atualizadoEm: '2026-10-18T00:00:00Z' },
    anexos: [], fichas: [{ id: 'g', campanhaId: 'c', categoria: 'monstro', formato: 'pdf', anexoId: 'pdf', nome: 'Goblin', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: [], importadoEm: '2026-10-18T00:00:00Z' }],
    instancias: [{ id: 'j', campanhaId: 'c', categoria: 'jogador', fichaOriginalId: null, nome: 'Ladina', pv: { atuais: 12, maximos: 20 } }, { id: 'g1', campanhaId: 'c', categoria: 'monstro', fichaOriginalId: 'g', nome: 'Goblin 1', pv: { atuais: 3, maximos: 7 } }],
    combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] },
  };
}
function numero(label: string, valor: string) { fireEvent.change(screen.getByLabelText(label), { target: { value: valor } }); }
function incluirJogador(iniciativa = '0') {
  fireEvent.click(screen.getByRole('button', { name: 'Selecionar jogador Ladina' }));
  numero('Iniciativa', iniciativa);
  fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
}
function incluirAvulsos(nome = 'Esqueleto', quantidade = '3') {
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar combatente avulso' }));
  numero('Nome do combatente', nome); numero('Quantidade', quantidade);
  fireEvent.click(screen.getByLabelText('Minion rápido (1 PV, editável)'));
  fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
}

describe('preparação local de combate', () => {
  let ambiente: ReturnType<typeof repositorioTeste>;
  const matchMediaOriginal = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  beforeEach(() => {
    ambiente = repositorioTeste();
    Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })) });
  });
  afterEach(() => {
    ambiente.limpar();
    if (matchMediaOriginal) Object.defineProperty(window, 'matchMedia', matchMediaOriginal);
    else Reflect.deleteProperty(window, 'matchMedia');
  });
  test('mantém cabeçalhos e ações fora das duas listas, mesmo com muitos participantes', () => {
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={jest.fn()} onFechar={jest.fn()} />);
    expect(screen.queryByText(/Escolha os participantes e revise/)).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Revisão da preparação' })).not.toBeInTheDocument();
    expect(screen.queryByText('Revisão e ações')).not.toBeInTheDocument();
    const verificarEstrutura = () => {
      const dialogo = screen.getByRole('dialog', { name: 'Preparar combate' });
      const listas = within(dialogo).getAllByRole('region', { name: /^Lista de/ });
      expect(listas).toHaveLength(2);
      for (const lista of listas) {
        expect(lista).toHaveAttribute('tabindex', '0');
        expect(within(lista).queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
        expect(within(lista).queryByRole('button', { name: 'Confirmar preparação' })).not.toBeInTheDocument();
      }
      expect(screen.getByRole('button', { name: 'Cancelar' }).closest('footer')).toBe(screen.getByRole('button', { name: 'Confirmar preparação' }).closest('footer'));
      expect(screen.getByRole('button', { name: 'Fechar preparação' }).closest('header')).toContainElement(screen.getByRole('heading', { name: 'Preparar combate' }));
    };
    verificarEstrutura();
    incluirAvulsos('Horda', '50');
    verificarEstrutura();
    expect(within(screen.getByRole('region', { name: 'Lista de participantes selecionados' })).getAllByRole('listitem')).toHaveLength(50);
  });
  test('atalho + tem dica por mouse e foco e abre a configuração existente', () => {
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={jest.fn()} onFechar={jest.fn()} />);
    const adicionar = screen.getByRole('button', { name: 'Adicionar combatente avulso' });
    expect(adicionar).toHaveAccessibleName('Adicionar combatente avulso');
    expect(adicionar).not.toHaveTextContent('Adicionar combatente avulso');
    expect(adicionar.closest('header')).toContainElement(screen.getByRole('heading', { name: 'Combatentes disponíveis' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.mouseEnter(adicionar);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Adicionar combatente avulso');
    expect(adicionar).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
    fireEvent.mouseLeave(adicionar);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.focus(adicionar);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(adicionar);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.click(adicionar);
    expect(screen.getByRole('dialog', { name: 'Configurar combatente' })).toBeInTheDocument();
  });
  test('seletor móvel mantém as seleções ao alternar painéis e fechar preserva o descarte', () => {
    const matchMedia = jest.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as MediaQueryList);
    const fechar = jest.fn();
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={jest.fn()} onFechar={fechar} />);
    incluirAvulsos('Guarda', '2');
    expect(screen.queryByRole('region', { name: 'Participantes selecionados' })).not.toBeInTheDocument();
    const selecionados = screen.getByRole('button', { name: 'Selecionados (2)' });
    fireEvent.click(selecionados);
    expect(selecionados).toHaveAttribute('aria-pressed', 'true');
    expect(document.getElementById(selecionados.getAttribute('aria-controls')!)).toContainElement(screen.getByRole('button', { name: 'Editar participante Guarda 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Disponíveis' }));
    expect(screen.queryByRole('button', { name: 'Editar participante Guarda 2' })).not.toBeInTheDocument();
    fireEvent.click(selecionados);
    expect(screen.getByRole('button', { name: 'Editar participante Guarda 2' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar preparação' }));
    expect(screen.getByRole('dialog', { name: 'Descartar preparação de combate' })).toBeInTheDocument();
    expect(fechar).not.toHaveBeenCalled();
    matchMedia.mockRestore();
  });
  test('ficha de jogador antiga sem instância permite criar ocorrência somente no rascunho',()=>{
    const dados=dadosTeste();dados.instancias=[];dados.fichas.push({...dados.fichas[0],id:'j-original',categoria:'jogador',nome:'Aria',pvIniciais:{atuais:8,maximos:20}});
    render(<PrepararCombate dados={dados} onConfirmar={jest.fn()} onFechar={jest.fn()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Selecionar jogador Aria'}));
    expect(screen.getByLabelText('Nome do combatente')).toHaveValue('Aria');
    expect(screen.getByLabelText('PV atuais')).toHaveValue(8);
    fireEvent.click(screen.getByRole('button',{name:'Incluir participante'}));
    expect(screen.getByRole('button',{name:'Selecionar jogador Aria'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Editar participante Aria'})).toBeInTheDocument();
    expect(dados.instancias).toHaveLength(0);
  });
  test('lista jogadores/monstros, exige dois e impede jogador duplicado sem alterar PV', async () => {
    const dados = dadosTeste(); const confirmar = jest.fn(async () => true);
    render(<PrepararCombate dados={dados} onConfirmar={confirmar} onFechar={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Selecionar monstro Goblin' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
    expect(screen.getByRole('alert')).toHaveTextContent('pelo menos dois');
    incluirJogador('-2');
    expect(screen.getByRole('button', { name: 'Selecionar jogador Ladina' })).toBeDisabled();
    expect(dados.instancias[0].pv).toEqual({ atuais: 12, maximos: 20 });
    expect(confirmar).not.toHaveBeenCalled();
  });
  test('seleciona instância existente com seus PV atuais e inclui nova do mesmo original', async () => {
    const confirmar = jest.fn(async () => true);
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={confirmar} onFechar={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar monstro Goblin' }));
    numero('Instância do monstro', 'g1');
    expect(screen.getByLabelText('PV atuais')).toHaveValue(3);
    numero('Iniciativa', '-1');
    fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar monstro Goblin' }));
    numero('Nome do combatente', 'Goblin 2'); numero('Iniciativa', '0');
    fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
    const rascunho = confirmar.mock.calls[0] as unknown as [{ participantes: { instancia: { id: string; fichaOriginalId: string; pv: { atuais: number } } }[] }];
    expect(rascunho[0].participantes.map(p => p.instancia.pv.atuais)).toEqual([3, 7]);
    expect(new Set(rascunho[0].participantes.map(p => p.instancia.id)).size).toBe(2);
    expect(rascunho[0].participantes.map(p => p.instancia.fichaOriginalId)).toEqual(['g', 'g']);
  });
  test('cria minions independentes, edita iniciativa e preserva desempate estável', async () => {
    const confirmar = jest.fn(async () => true);
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={confirmar} onFechar={jest.fn()} />);
    incluirAvulsos();
    fireEvent.click(screen.getByRole('button', { name: 'Editar participante Esqueleto 2' }));
    numero('Iniciativa', '21'); numero('PV atuais', '0');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar configuração' }));
    const lista = within(screen.getByRole('region', { name: 'Participantes selecionados' })).getAllByRole('listitem');
    expect(lista[0]).toHaveTextContent('Esqueleto 2'); expect(lista[1]).toHaveTextContent('Esqueleto 1'); expect(lista[2]).toHaveTextContent('Esqueleto 3');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
    expect(confirmar).toHaveBeenCalledWith({ participantes: expect.arrayContaining([expect.objectContaining({ instancia: expect.objectContaining({ nome: 'Esqueleto 2', pv: { atuais: 0, maximos: 1 } }), iniciativa: 21 }), expect.objectContaining({ instancia: expect.objectContaining({ nome: 'Esqueleto 1', pv: { atuais: 1, maximos: 1 } }) })]) });
  });
  test('remove rascunhos e confirma descarte por Escape sem chamar persistência', () => {
    const fechar = jest.fn(); const confirmar = jest.fn(async () => true); const dados = dadosTeste();
    render(<PrepararCombate dados={dados} onConfirmar={confirmar} onFechar={fechar} />);
    incluirJogador(); incluirAvulsos();
    fireEvent.click(screen.getByRole('button', { name: 'Remover participante Esqueleto 2' }));
    expect(screen.queryByRole('button', { name: 'Editar participante Esqueleto 2' })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog', { name: 'Descartar preparação de combate' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar preparando' }));
    expect(screen.getByRole('button', { name: 'Editar participante Ladina' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Descartar preparação' }));
    expect(fechar).toHaveBeenCalledTimes(1); expect(confirmar).not.toHaveBeenCalled(); expect(dados.instancias).toHaveLength(2);
  });
  test('mantém rascunho após erro e permite nova confirmação', async () => {
    const confirmar = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true); const fechar = jest.fn();
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={confirmar} onFechar={fechar} erroConfirmacao="Quota excedida" />);
    incluirAvulsos('Minion', '2');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Quota excedida');
    expect(fechar).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar preparação' }));
    await waitFor(() => expect(fechar).toHaveBeenCalledTimes(1));
    expect(confirmar.mock.calls[0][0]).toEqual(confirmar.mock.calls[1][0]);
  });
  test('protege configuração alterada por Escape e numera novas instâncias sem colisões', () => {
    render(<PrepararCombate dados={dadosTeste()} onConfirmar={jest.fn()} onFechar={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar monstro Goblin' }));
    expect(screen.getByLabelText('Nome do combatente')).toHaveValue('Goblin 2');
    numero('Iniciativa', '14');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog', { name: 'Descartar configuração do combatente' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar configurando' }));
    expect(screen.getByLabelText('Iniciativa')).toHaveValue(14);
    fireEvent.click(screen.getByRole('button', { name: 'Incluir participante' }));
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar monstro Goblin' }));
    expect(screen.getByLabelText('Nome do combatente')).toHaveValue('Goblin 3');
  });
  test('bloqueia instância ativa e rejeita PV e iniciativa inválidos na configuração', () => {
    const dados = dadosTeste(); dados.combates.push({ id: 'ativo', campanhaId: 'c', estado: 'ativo', rodada: 1, participanteAtivoId: 'p', iniciadoEm: '2026-10-18T00:00:00Z', encerradoEm: null }); dados.participantes.push({ id: 'p', combateId: 'ativo', instanciaId: 'j', iniciativa: 1, ordem: 0, pvInicio: { atuais: 12, maximos: 20 } });
    render(<PrepararCombate dados={dados} onConfirmar={jest.fn()} onFechar={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Selecionar jogador Ladina' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar combatente avulso' }));
    numero('Nome do combatente', 'Guarda'); numero('Iniciativa', '1.5');
    fireEvent.submit(screen.getByRole('button', { name: 'Incluir participante' }));
    expect(screen.getByRole('alert')).toHaveTextContent('iniciativa');
    numero('Iniciativa', '0'); numero('PV atuais', '2'); numero('PV máximos', '1');
    fireEvent.submit(screen.getByRole('button', { name: 'Incluir participante' }));
    expect(screen.getByRole('alert')).toHaveTextContent('não podem ultrapassar');
  });
});
