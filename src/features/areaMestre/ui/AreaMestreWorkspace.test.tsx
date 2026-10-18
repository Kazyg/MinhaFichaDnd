import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AreaMestreWorkspace from './AreaMestreWorkspace';
import { useCampanhas } from '../useCampanhas';
import { RepositorioCampanhas } from '../contratos';
import { repositorioTeste } from './testRepositorio';
import { criarLayoutPadrao } from './layoutWorkspace';
import { ErroPersistencia } from '../erros';
jest.mock('../reconhecimento', () => ({ reconhecerArquivo: jest.fn(async () => ({nome:null,pv:null,avisos:[]})) }));

function Integracao({ repositorio }: { repositorio: RepositorioCampanhas }) {
  return <AreaMestreWorkspace estado={useCampanhas(repositorio)} onSair={jest.fn()} />;
}

describe('workspace refinado da Área do Mestre', () => {
  let ambiente: ReturnType<typeof repositorioTeste>;
  beforeEach(() => { ambiente = repositorioTeste(); });
  afterEach(() => { ambiente.limpar(); });
  async function criar(nome: string) {
    fireEvent.change(await screen.findByLabelText('Nome da nova campanha'), { target: { value: nome } });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Criar campanha' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Criar campanha' }));
    await screen.findByRole('heading', { name: nome, level: 1 });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Gerenciador de Campanhas' })).not.toBeInTheDocument());
  }
  function menu(acao: string) {
    fireEvent.click(screen.getByRole('button', { name: 'Menu do mestre' }));
    fireEvent.click(screen.getByRole('button', { name: acao }));
  }
  async function novoRoteiro(titulo: string, conteudo: string) {
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar roteiro' }));
    fireEvent.change(screen.getByLabelText('Título do roteiro'), { target: { value: titulo } });
    fireEvent.change(screen.getByLabelText('Conteúdo do roteiro'), { target: { value: conteudo } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Adicionar roteiro' })).not.toBeInTheDocument());
  }

  test('header tem campanha à esquerda, marca central e operações apenas no menu', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />);
    await criar('Uma campanha com nome muito longo para o cabeçalho');
    const header = screen.getByRole('banner', { name: 'Cabeçalho da campanha' });
    // eslint-disable-next-line testing-library/no-node-access -- Verify the dedicated left header slot required by the layout.
    expect(within(header).getByRole('heading', { level: 1 }).closest('.am-header-esquerda')).toBeInTheDocument();
    expect(within(header).getByText('minhafichadnd')).toHaveClass('am-marca');
    expect(within(header).queryByText('Área do Mestre')).not.toBeInTheDocument();
    expect(within(header).getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByText('Todas as alterações salvas')).not.toBeInTheDocument();
    fireEvent.click(within(header).getByRole('button', { name: 'Menu do mestre' }));
    expect(within(header).getAllByRole('button', { name: 'Campanhas' })).toHaveLength(1);
    expect(screen.queryByText('Editar posições e dimensões dos quadros')).not.toBeInTheDocument();
  });

  test('cria dois roteiros, edita um independentemente e recupera após remontar', async () => {
    const view = render(<Integracao repositorio={ambiente.repositorio} />);
    await criar('A mina perdida');
    expect(screen.queryByRole('textbox', { name: 'Roteiro da campanha' })).not.toBeInTheDocument();
    await novoRoteiro('Sessão 1', 'Investigar a entrada da mina');
    await novoRoteiro('Sessão 2', 'O altar no subterrâneo');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir roteiro Sessão 1' }));
    fireEvent.change(screen.getByLabelText('Conteúdo do roteiro'), { target: { value: 'A entrada foi descoberta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const [campanha] = await ambiente.repositorio.listar();
    expect(campanha.roteiros?.map(r => r.conteudo)).toEqual(['A entrada foi descoberta', 'O altar no subterrâneo']);
    view.unmount(); ambiente.repositorio.fechar();
    render(<Integracao repositorio={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha A mina perdida' }));
    expect(await screen.findByRole('button', { name: 'Abrir roteiro Sessão 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir roteiro Sessão 2' })).toBeInTheDocument();
  });

  test('quadros resumidos abrem coleções por teclado sem interceptar os controles do grid', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />); await criar('Coleções compactas');
    const monstros = screen.getByRole('region', { name: 'Monstros' });
    expect(within(monstros).getAllByRole('button')).toHaveLength(4);
    expect(within(monstros).queryByRole('button', { name: /Adicionar/ })).not.toBeInTheDocument();
    fireEvent.click(within(monstros).getByRole('button', { name: 'Mover ou redimensionar Monstros' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(within(monstros).getByRole('button', { name: 'Abrir coleção de monstros' }));
    expect(screen.getByRole('dialog', { name: 'Coleção de monstros' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar coleção' }));
    fireEvent.click(within(monstros).getByRole('button', { name: 'Ocultar Monstros' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Monstros' })).not.toBeInTheDocument();
  });

  test('cancelamento protege o rascunho e exclusão requer confirmação sem afetar outros', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />); await criar('Roteiros independentes');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar roteiro' }));
    fireEvent.change(screen.getByLabelText('Conteúdo do roteiro'), { target: { value: 'Rascunho não salvo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o título');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('dialog', { name: 'Fechar roteiro sem salvar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar editando' }));
    expect(screen.getByLabelText('Conteúdo do roteiro')).toHaveValue('Rascunho não salvo');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Descartar rascunho e fechar' }));
    await novoRoteiro('Primeiro', 'Texto primeiro'); await novoRoteiro('Segundo', 'Texto segundo');
    fireEvent.click(screen.getByRole('button', { name: 'Excluir roteiro Primeiro' }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Excluir roteiro' })).getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('button', { name: 'Abrir roteiro Primeiro' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Excluir roteiro Primeiro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Abrir roteiro Primeiro' })).not.toBeInTheDocument();
    expect((await ambiente.repositorio.listar())[0].roteiros?.map(r => r.titulo)).toEqual(['Segundo']);
  });

  test('erro ao salvar mantém o texto na modal e retry não duplica o roteiro', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />); await criar('Falha de quota');
    jest.spyOn(ambiente.repositorio, 'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida', 'Sem espaço'));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar roteiro' }));
    fireEvent.change(screen.getByLabelText('Título do roteiro'), { target: { value: 'Plano secreto' } });
    fireEvent.change(screen.getByLabelText('Conteúdo do roteiro'), { target: { value: 'Conteúdo longo preservado' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    await screen.findByText(/Não foi possível salvar. O texto continua/);
    expect(screen.getByLabelText('Conteúdo do roteiro')).toHaveValue('Conteúdo longo preservado');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect((await ambiente.repositorio.listar())[0].roteiros).toHaveLength(1);
  });

  test('rascunho de roteiro sobrevive à navegação SPA sem criar documentos duplicados', async () => {
    const view = render(<Integracao repositorio={ambiente.repositorio} />); await criar('Rascunhos');
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar roteiro' }));
    fireEvent.change(screen.getByLabelText('Título do roteiro'), { target: { value: 'Texto em andamento' } });
    fireEvent.change(screen.getByLabelText('Conteúdo do roteiro'), { target: { value: 'Anotações ainda não confirmadas' } });
    view.unmount();
    render(<Integracao repositorio={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Rascunhos' }));
    await screen.findByRole('heading', { name: 'Rascunhos', level: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar roteiro' }));
    expect(screen.getByLabelText('Conteúdo do roteiro')).toHaveValue('Anotações ainda não confirmadas');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar roteiro' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect((await ambiente.repositorio.listar())[0].roteiros).toHaveLength(1);
  });

  test('sidebar e painéis persistem por campanha; menu reexibe e restaura padrão', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />); await criar('Primeira');
    fireEvent.click(screen.getByRole('button', { name: 'Recolher navegação' }));
    fireEvent.click(screen.getByRole('button', { name: 'Recolher Monstros' }));
    expect(screen.getByRole('button', { name: 'Expandir Monstros' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar Roteiro' }));
    menu('Campanhas'); await criar('Segunda');
    expect(screen.getByRole('region', { name: 'Roteiro' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recolher navegação' })).toBeInTheDocument();
    menu('Campanhas');
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Primeira' }));
    await screen.findByRole('button', { name: 'Expandir navegação' });
    expect(screen.queryByRole('region', { name: 'Roteiro' })).not.toBeInTheDocument();
    menu('Reexibir Roteiro');
    expect(screen.getByRole('region', { name: 'Roteiro' })).toBeInTheDocument();
    menu('Restaurar layout padrão');
    expect(screen.getByRole('button', { name: 'Recolher navegação' })).toBeInTheDocument();
    menu('Editar nome da campanha');
    fireEvent.change(screen.getByLabelText('Nome da campanha'), { target: { value: 'Primeira revisada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nome' }));
    expect(screen.getByRole('heading', { name: 'Primeira revisada', level: 1 })).toBeInTheDocument();
    await waitFor(async () => expect((await ambiente.repositorio.listar()).some(c => c.nome === 'Primeira revisada')).toBe(true));
  });

  test('conflito conserva edição local e só recarrega após confirmar descarte', async () => {
    render(<Integracao repositorio={ambiente.repositorio} />); await criar('Compartilhada');
    const [campanha] = await ambiente.repositorio.listar();
    const externa = (await ambiente.repositorio.obter(campanha.id))!; externa.campanha.nome = 'Nome da outra aba';
    await act(async () => { await ambiente.repositorio.salvar(externa); });
    menu('Editar nome da campanha');
    fireEvent.change(screen.getByLabelText('Nome da campanha'), { target: { value: 'Nome local' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nome' }));
    await screen.findByText(/Esta campanha mudou em outra aba/);
    expect(screen.getByRole('heading', { name: 'Nome local' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar salvar novamente' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Recarregar versão salva' }));
    fireEvent.click(screen.getByRole('button', { name: 'Descartar alterações e recarregar' }));
    await screen.findByRole('heading', { name: 'Nome da outra aba' });
  });

  test('exibe fichas persistidas nas categorias corretas sem controles futuros fictícios', async () => {
    const id = 'importada', data = '2026-10-17T12:00:00Z';
    const anexos = [{ id: 'pdf', mime: 'application/pdf', texto: '%PDF-' }, { id: 'json', mime: 'application/json', texto: '{}' }].map(({ texto, ...anexo }) => {
      const arquivo = new Blob([texto], { type: anexo.mime }); return { ...anexo, nome: anexo.id, campanhaId: id, arquivo, tamanho: arquivo.size };
    });
    await ambiente.repositorio.criar({ campanha: { id, schemaVersion: 1, nome: 'Importada', roteiro: '', criadoEm: data, atualizadoEm: data }, anexos,
      fichas: [
        { id: 'g', campanhaId: id, categoria: 'monstro', formato: 'pdf', anexoId: 'pdf', nome: 'Goblin da caverna', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: [], importadoEm: data },
        { id: 'm', campanhaId: id, categoria: 'jogador', formato: 'json', anexoId: 'json', nome: 'Elminster', pvIniciais: { atuais: 20, maximos: 20 }, origemPV: 'json', origemJson: { id: 'original', versaoRegras: 'DND_2024', envelope: true }, avisos: [], importadoEm: data },
      ], instancias: [], combates: [], participantes: [], layout: criarLayoutPadrao(id) });
    render(<Integracao repositorio={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Importada' }));
    const monstros = await screen.findByRole('region', { name: 'Monstros' });
    expect(within(monstros).getByText('Goblin da caverna')).toBeInTheDocument();
    expect(within(monstros).queryByRole('button', { name: /Excluir ficha/ })).not.toBeInTheDocument();
    fireEvent.click(within(monstros).getByRole('button', { name: 'Abrir coleção de monstros' }));
    expect(screen.getByRole('dialog', { name: 'Coleção de monstros' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir ficha Goblin da caverna' })).toHaveTextContent('PV de referência: 7 / 7');
    expect(screen.getByRole('button', { name: 'Editar dados e retrato de Goblin da caverna' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar coleção' }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir coleção de jogadores' }));
    expect(screen.getByText('JSON · D&D 2024')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fechar coleção' }));
    expect(screen.getByRole('button', { name: 'Adicionar ficha de monstro' })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Iniciar combate/ })).toBeEnabled();
    expect(screen.queryByRole('button', { name: /(?:Curar|Aplicar dano)/i })).not.toBeInTheDocument();
  });

  test('importa imagem, controla três instâncias, protege exclusão e recupera PV após reabrir', async () => {
    const criarUrl = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    const revogarUrl = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:goblin') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
    try {
      const view = render(<Integracao repositorio={ambiente.repositorio} />); await criar('Goblin independente');
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar ficha de monstro' }));
      const arquivo = new File([new Uint8Array([137,80,78,71,13,10,26,10,0,1])], 'Goblin.png', { type: 'image/png' });
      fireEvent.change(screen.getByLabelText(/Arquivo da ficha/), { target: { files: [arquivo] } });
      await screen.findByLabelText('Nome da ficha');
      fireEvent.change(screen.getByLabelText('PV máximos'), { target: { value: '7' } });
      fireEvent.change(screen.getByLabelText('PV atuais'), { target: { value: '7' } });
      await waitFor(() => expect(screen.getByRole('button', { name: 'Incluir' })).toBeEnabled());
      fireEvent.click(screen.getByRole('button', { name: /Confirmar importação|Incluir/ }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      fireEvent.click(screen.getByRole('button', { name: 'Abrir coleção de monstros' }));
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar instância de Goblin' }));
      await waitFor(async () => expect((await ambiente.repositorio.obter((await ambiente.repositorio.listar())[0].id))!.instancias).toHaveLength(2));
      // Aguarda revisão publicada antes da próxima operação confirmada.
      await waitFor(async () => expect((await ambiente.repositorio.obter((await ambiente.repositorio.listar())[0].id))!.instancias).toHaveLength(2));
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar instância de Goblin' }));
      fireEvent.click(screen.getByRole('button', { name: 'Fechar coleção' }));
      const segundo = await screen.findByRole('article', { name: 'PV de Goblin 2' });
      await screen.findByRole('article', { name: 'PV de Goblin 3' });
      fireEvent.click(within(segundo).getByRole('button', { name: /^Ajustar vida de Goblin 2:/ }));
      fireEvent.change(within(screen.getByRole('dialog', { name: 'Goblin 2' })).getByRole('spinbutton', { name: 'Dano' }), { target: { value: '4' } });
      fireEvent.click(within(screen.getByRole('dialog', { name: 'Goblin 2' })).getByRole('button', { name: 'Confirmar' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      const [campanha] = await ambiente.repositorio.listar();
      await waitFor(async () => expect((await ambiente.repositorio.obter(campanha.id))!.instancias.map(i => i.pv.atuais).sort()).toEqual([3,7,7]));
      fireEvent.click(screen.getByRole('button', { name: 'Abrir coleção de monstros' }));
      fireEvent.click(screen.getByRole('button', { name: 'Abrir ficha Goblin' }));
      expect(screen.getByRole('dialog', { name: 'Ficha original: Goblin' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Fechar ficha' }));
      fireEvent.click(screen.getByRole('button', { name: 'Excluir ficha Goblin' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão da ficha' }));
      expect(await within(screen.getByRole('dialog', { name: 'Excluir ficha' })).findByRole('alert')).toHaveTextContent('Remova primeiro');
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      view.unmount(); ambiente.repositorio.fechar();
      render(<Integracao repositorio={ambiente.repositorio} />);
      fireEvent.click(await screen.findByRole('button', { name: 'Abrir campanha Goblin independente' }));
      expect(await screen.findByRole('article', { name: 'PV de Goblin 2' })).toHaveTextContent('3/7');
      expect(screen.getByRole('article', { name: 'PV de Goblin 1' })).toHaveTextContent('7/7');
      const salvo = (await ambiente.repositorio.obter(campanha.id))!;
      expect(salvo.fichas[0].pvIniciais).toEqual({ atuais: 7, maximos: 7 });
      expect(salvo.anexos).toHaveLength(1);
    } finally {
      cleanup();
      if (criarUrl) Object.defineProperty(URL, 'createObjectURL', criarUrl); else Reflect.deleteProperty(URL, 'createObjectURL');
      if (revogarUrl) Object.defineProperty(URL, 'revokeObjectURL', revogarUrl); else Reflect.deleteProperty(URL, 'revokeObjectURL');
    }
  });

  test('preparação mantém minions locais, permite descarte e confirma encontro atomicamente com retry e recuperação', async () => {
    const view = render(<Integracao repositorio={ambiente.repositorio} />);
    await criar('Preparar encontro');
    const [campanha] = await ambiente.repositorio.listar();
    const adicionarMinions = async () => {
      fireEvent.click(screen.getByRole('button',{name:'Adicionar combatente avulso'}));
      fireEvent.change(screen.getByLabelText('Nome do combatente'),{target:{value:'Esqueleto'}});
      fireEvent.click(screen.getByLabelText('Minion rápido (1 PV, editável)'));
      fireEvent.change(screen.getByLabelText('Quantidade'),{target:{value:'3'}});
      fireEvent.change(screen.getByLabelText('Iniciativa'),{target:{value:'0'}});
      fireEvent.click(screen.getByRole('button',{name:'Incluir participante'}));
      await screen.findByRole('button',{name:'Editar participante Esqueleto 2'});
    };
    fireEvent.click(screen.getByRole('button',{name:'Iniciar combate'}));
    await adicionarMinions();
    expect((await ambiente.repositorio.obter(campanha.id))!.instancias).toHaveLength(0);
    fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));
    expect(screen.getByRole('dialog',{name:'Descartar preparação de combate'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Continuar preparando'}));
    expect(screen.getByRole('button',{name:'Editar participante Esqueleto 2'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));
    fireEvent.click(screen.getByRole('button',{name:'Descartar preparação'}));
    expect((await ambiente.repositorio.obter(campanha.id))!.combates).toHaveLength(0);
    expect((await ambiente.repositorio.obter(campanha.id))!.instancias).toHaveLength(0);
    fireEvent.click(screen.getByRole('button',{name:'Iniciar combate'})); await adicionarMinions();
    fireEvent.click(screen.getByRole('button',{name:'Editar participante Esqueleto 2'}));
    fireEvent.change(screen.getByLabelText('Iniciativa'),{target:{value:'-2'}});
    fireEvent.change(screen.getByLabelText('PV atuais'),{target:{value:'0'}});
    fireEvent.click(screen.getByRole('button',{name:'Salvar configuração'}));
    jest.spyOn(ambiente.repositorio,'salvar').mockRejectedValueOnce(new ErroPersistencia('cota-excedida','Sem espaço para preparação'));
    fireEvent.click(screen.getByRole('button',{name:'Confirmar preparação'}));
    expect(await within(screen.getByRole('dialog',{name:'Preparar combate'})).findByRole('alert')).toHaveTextContent('O rascunho foi mantido');
    const intacto = (await ambiente.repositorio.obter(campanha.id))!;
    expect(intacto.instancias).toHaveLength(0); expect(intacto.combates).toHaveLength(0); expect(intacto.participantes).toHaveLength(0);
    fireEvent.click(screen.getByRole('button',{name:'Confirmar preparação'}));
    const resumo = await screen.findByRole('dialog',{name:'Encontro preparado'});
    expect(within(resumo).getByRole('status')).toHaveTextContent('Preparação salva');
    expect(within(resumo).getByText('Iniciativa -2',{exact:false})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Fechar resumo'}));
    expect(screen.getByRole('article',{name:'PV de Esqueleto 2'})).toHaveTextContent('0/1');
    expect(screen.queryByRole('button',{name:'Próximo turno'})).not.toBeInTheDocument();
    view.unmount(); ambiente.repositorio.fechar();
    render(<Integracao repositorio={ambiente.repositorio} />);
    fireEvent.click(await screen.findByRole('button',{name:'Abrir campanha Preparar encontro'}));
    fireEvent.click(await screen.findByRole('button',{name:'Ver encontro preparado 1'}));
    expect(await screen.findByRole('dialog',{name:'Encontro preparado'})).toHaveTextContent('Esqueleto 2');
    const persistido = (await ambiente.repositorio.obter(campanha.id))!;
    expect(persistido.combates[0]).toMatchObject({estado:'preparado',rodada:0,participanteAtivoId:null});
    expect(persistido.participantes).toHaveLength(3); expect(persistido.instancias).toHaveLength(3);
  });
});
