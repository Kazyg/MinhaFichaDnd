/* eslint-disable testing-library/no-container, testing-library/no-node-access -- inspeção do desenho SVG garante os símbolos locais corretos. */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CondicoesCombate from './CondicoesCombate';
import BarraIniciativa from './BarraIniciativa';
import { CondicaoCombate, DadosCampanha } from '../modelos';
import IconeCondicao from './IconeCondicao';

function dadosTeste(): DadosCampanha {
  return { campanha: { id:'c',nome:'Teste',schemaVersion:1,roteiro:'',criadoEm:'',atualizadoEm:'' }, anexos:[],fichas:[],layout:{campanhaId:'c',versao:1,sidebarRecolhida:false,paineis:[]},
    combates:[{id:'b',campanhaId:'c',estado:'ativo',rodada:1,participanteAtivoId:'p0',iniciadoEm:'',encerradoEm:null}],
    instancias:[0,1].map(i=>({id:`i${i}`,campanhaId:'c',nome:i?'Goblin 2':'Goblin 1',categoria:'monstro',fichaOriginalId:null,pv:{atuais:0,maximos:10}})),
    participantes:[0,1].map(i=>({id:`p${i}`,combateId:'b',instanciaId:`i${i}`,iniciativa:10-i,ordem:i,pvInicio:{atuais:10,maximos:10}})) };
}
const efeito = (id:string): CondicaoCombate => ({id,campanhaId:'c',combateId:'b',participanteId:'p0',tipo:'queimando',duracao:'turnos',restantes:3,momento:'final',ignorarOcorrencia:0});
test('ícones de veneno, fogo e congelamento têm representações distintas', () => {
  const { container }=render(<><IconeCondicao icone="veneno"/><IconeCondicao icone="chama"/><IconeCondicao icone="neve"/></>);
  const desenhos=[...container.querySelectorAll('path')].map(p=>p.getAttribute('d'));
  expect(new Set(desenhos).size).toBe(3); expect(desenhos[0]).toContain('M9 2h6'); expect(desenhos[2]).toContain('M12 2v20');
});
test('efeito personalizado exige nome e salva duração manual com observação', async () => {
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:{randomUUID:()=> 'nova-condicao'}});
  const onSalvar=jest.fn(async()=>true);
  render(<CondicoesCombate dados={dadosTeste()} combateId="b" participanteId="p0" onSalvar={onSalvar} onFechar={jest.fn()}/>);
  fireEvent.change(screen.getByLabelText('Categoria'),{target:{value:'marcadores'}});
  fireEvent.click(screen.getByRole('button',{name:'Outro efeito personalizado'}));
  const confirmar=screen.getByRole('button',{name:'+ Adicionar efeito'}); expect(confirmar).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Nome do efeito'),{target:{value:'Aura do dragão'}});
  fireEvent.click(screen.getByLabelText('Duração ilimitada ou até remoção manual'));
  fireEvent.change(screen.getByLabelText('Observação opcional'),{target:{value:'Origem: dragão'}});
  fireEvent.click(confirmar);
  await waitFor(()=>expect(onSalvar).toHaveBeenCalledWith(expect.objectContaining({tipo:'adicionar',dados:expect.objectContaining({tipo:'personalizado',nomePersonalizado:'Aura do dragão',duracao:'manual',restantes:null,observacao:'Origem: dragão'})})));
});
test('busca, categoria, seleção e duração inválida controlam a inclusão, cancelar não salva', async () => {
  const onSalvar=jest.fn(async()=>true),onFechar=jest.fn();
  render(<CondicoesCombate dados={dadosTeste()} combateId="b" participanteId="p0" onSalvar={onSalvar} onFechar={onFechar}/>);
  const confirmar=screen.getByRole('button',{name:'+ Adicionar efeito'});
  expect(confirmar).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Categoria'),{target:{value:'dano-continuo'}});
  fireEvent.change(screen.getByPlaceholderText('Buscar condição ou efeito...'),{target:{value:'zzzzz'}});
  expect(screen.getByText(/Nenhum efeito encontrado/)).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Buscar condição ou efeito...'),{target:{value:'Burning'}});
  fireEvent.click(screen.getByRole('button',{name:'Queimando'}));
  expect(confirmar).toBeEnabled();
  fireEvent.change(screen.getByLabelText('Quantidade de turnos do alvo'),{target:{value:'0'}});
  expect(confirmar).toBeDisabled();
  fireEvent.click(screen.getByLabelText('Duração ilimitada ou até remoção manual'));
  expect(screen.queryByLabelText('Quantidade de turnos do alvo')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio',{name:'Início do turno'}));
  fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));
  expect(onSalvar).not.toHaveBeenCalled(); expect(onFechar).toHaveBeenCalledTimes(1);
});
test('editar duração e excluir usam identificador da aplicação independente', async () => {
  const dados=dadosTeste(); dados.combates[0].condicoes=[efeito('e1'),efeito('e2')];
  const onSalvar=jest.fn(async()=>true),onFechar=jest.fn();
  const view=render(<CondicoesCombate dados={dados} combateId="b" participanteId="p0" condicaoId="e2" onSalvar={onSalvar} onFechar={onFechar}/>);
  fireEvent.change(screen.getByLabelText('Quantidade de turnos do alvo'),{target:{value:'1'}});
  fireEvent.click(screen.getByRole('button',{name:'Salvar'}));
  await waitFor(()=>expect(onSalvar).toHaveBeenCalledWith(expect.objectContaining({tipo:'editar',id:'e2',dados:expect.objectContaining({restantes:1})})));
  view.unmount();
  render(<CondicoesCombate dados={dados} combateId="b" participanteId="p0" condicaoId="e1" onSalvar={onSalvar} onFechar={onFechar}/>);
  fireEvent.click(screen.getByRole('button',{name:'Excluir condição'}));
  await waitFor(()=>expect(onSalvar).toHaveBeenLastCalledWith({tipo:'excluir',id:'e1'}));
});
test('roleta repetida mantém controles únicos, overflow e edição com IDs reais, expiração remove ícone', () => {
  const dados=dadosTeste(); dados.combates[0].condicoes=[efeito('e1'),efeito('e2'),efeito('e3')];
  const p={dados,combateId:'b',ocupado:false,onAvancar:jest.fn(async()=>true),onReordenar:jest.fn(async()=>true),onAbrirParticipante:jest.fn(),onAdicionarCondicao:jest.fn(),onEditarCondicao:jest.fn()};
  const view=render(<BarraIniciativa {...p}/>);
  expect(screen.getAllByRole('button',{name:/Adicionar condição a/})).toHaveLength(2);
  const editores=screen.getAllByRole('button',{name:/Editar Queimando/}); expect(editores).toHaveLength(2);
  expect(editores[0].querySelector('svg path')).toHaveAttribute('d',expect.stringContaining('M12 2C14'));
  fireEvent.click(editores[1]); expect(p.onEditarCondicao).toHaveBeenCalledWith('p0','e2');
  fireEvent.click(screen.getByRole('button',{name:'Ver todas as 3 condições de Goblin 1'})); expect(p.onEditarCondicao).toHaveBeenLastCalledWith('p0');
  const atualizado={...dados,combates:[{...dados.combates[0],condicoes:[]}]}; view.rerender(<BarraIniciativa {...p} dados={atualizado}/>);
  expect(screen.queryByRole('button',{name:/Editar Queimando/})).not.toBeInTheDocument();
});
