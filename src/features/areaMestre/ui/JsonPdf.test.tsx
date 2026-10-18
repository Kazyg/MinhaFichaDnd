import { useState } from 'react';
import fs from 'fs';
import { webcrypto } from 'crypto';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Ficha } from '../../../api/fichaPersonagem/FichaPersonagem';
import { exportFicha } from '../../../api/fichaPersonagem/fichaStorage';
import { prepararImportacaoComPdf } from '../pdfFichaJson';
import { prepararImportacao } from '../importacao';
import { incorporarImportacao } from '../fichasCampanha';
import { criarLayoutPadrao } from './layoutWorkspace';
import { exportarBackup, restaurarBackup } from '../backup';
import { useCampanhas } from '../useCampanhas';
import { RepositorioCampanhas } from '../contratos';
import { DadosCampanha } from '../modelos';
import { abrirPdf } from '../pdf';
import VisualizadorFicha from './VisualizadorFicha';
import { repositorioTeste } from './testRepositorio';

jest.mock('../pdf', () => ({ ...jest.requireActual('../pdf'), abrirPdf:jest.fn() }));
const data='2026-10-18T12:00:00.000Z';
const contexto={campanhaId:'c',fichaId:'f',anexoId:'json',categoria:'jogador' as const,importadoEm:data};
const vazio = (): DadosCampanha => ({ campanha:{id:'c',nome:'PDF',schemaVersion:1,roteiro:'',criadoEm:data,atualizadoEm:data},
  fichas:[],anexos:[],instancias:[],combates:[],participantes:[],layout:criarLayoutPadrao('c') });
function Tela({repo,id='c'}:{repo:RepositorioCampanhas;id?:string}) {
  const estado=useCampanhas(repo); const [aberto,setAberto]=useState(true);
  return estado.dados ? aberto ? <VisualizadorFicha ficha={estado.dados.fichas[0]} anexos={estado.dados.anexos} onGerarPdf={()=>estado.garantirPdfFicha(estado.dados!.fichas[0].id)} onFechar={()=>setAberto(false)} /> : <button onClick={()=>setAberto(true)}>Reabrir ficha</button>
    : <button disabled={estado.carregando} onClick={()=>void estado.selecionar(id)}>Abrir campanha</button>;
}
let ambiente:ReturnType<typeof repositorioTeste>;
let fetchAnterior:typeof fetch;
beforeEach(()=>{
  ambiente=repositorioTeste(); fetchAnterior=global.fetch;
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:{randomUUID:globalThis.crypto.randomUUID,subtle:webcrypto.subtle}});
  const template=Uint8Array.from(fs.readFileSync(`${process.cwd()}/public/ficha-de-personagem-dd-5e.pdf`));
  global.fetch=jest.fn(async()=>({ok:true,arrayBuffer:async()=>template.buffer})) as unknown as typeof fetch;
  Object.defineProperty(URL,'createObjectURL',{configurable:true,value:jest.fn(()=> 'blob:pdf')});
  Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:jest.fn()});
  (abrirPdf as jest.Mock).mockImplementation(async()=>({numPages:3,destroy:async()=>{},getPage:async()=>({getViewport:()=>({width:100,height:200}),render:()=>({promise:Promise.resolve(),cancel:()=>{}})})}));
  jest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({} as CanvasRenderingContext2D);
});
afterEach(()=>{ambiente.limpar();global.fetch=fetchAnterior;jest.restoreAllMocks();});
async function abrir() { await waitFor(()=>expect(screen.getByRole('button',{name:'Abrir campanha'})).toBeEnabled()); fireEvent.click(screen.getByRole('button',{name:'Abrir campanha'})); await screen.findByText('Página 1 de 3',{}, {timeout:10000}); }

test('importação real → PDF → visualizador → reabertura → backup/restauração → mesmo PDF sem JSON principal',async()=>{
  const storage=jest.spyOn(Storage.prototype,'setItem');
  const texto=exportFicha(new Ficha({id:'aria',nomePersonagem:'Ária',versaoRegras:'DND_2024',vidaTotal:18,vidaAtual:7}));
  const resultado=await prepararImportacaoComPdf(new File([texto],'Aria.json',{type:'application/json'}),contexto);
  await ambiente.repositorio.criar(incorporarImportacao(vazio(),resultado));
  let view=render(<Tela repo={ambiente.repositorio}/>); await abrir();
  expect(screen.queryByText(/Snapshot original/)).not.toBeInTheDocument();
  expect(screen.queryByRole('heading',{name:'Defesas e PV históricos'})).not.toBeInTheDocument();
  expect(screen.getByText('Baixar original')).toHaveAttribute('download','Aria_ficha.pdf');
  fireEvent.click(screen.getByRole('button',{name:'Fechar ficha'}));
  fireEvent.click(screen.getByRole('button',{name:'Reabrir ficha'})); await screen.findByText('Página 1 de 3');
  view.unmount(); ambiente.repositorio.fechar();
  view=render(<Tela repo={ambiente.repositorio}/>); await abrir(); view.unmount();
  const salvo=(await ambiente.repositorio.obter('c'))!;
  const restaurado=await restaurarBackup(await exportarBackup(salvo),ambiente.repositorio);
  view=render(<Tela repo={ambiente.repositorio} id={restaurado.campanha.id}/>); await abrir();
  expect(abrirPdf).toHaveBeenLastCalledWith(expect.objectContaining({type:'application/pdf'}));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(storage).not.toHaveBeenCalled(); view.unmount();
},20000);

test('primeira abertura de legado gera e salva uma vez, sem mudar PV manuais ou retratos',async()=>{
  const original=await prepararImportacao(new File(['{"id":"antiga","nomePersonagem":"Antiga","vidaTotal":9,"vidaAtual":2}'],'Antiga.json',{type:'application/json'}),contexto);
  const dados=incorporarImportacao(vazio(),{ficha:original.ficha,anexos:[original.anexo]});
  dados.instancias[0].pv={atuais:4,maximos:20};
  await ambiente.repositorio.criar(dados);
  const view=render(<Tela repo={ambiente.repositorio}/>); await abrir();
  const salvo=(await ambiente.repositorio.obter('c'))!;
  expect(salvo.fichas[0].pdfAnexoId).toBeTruthy(); expect(salvo.instancias[0].pv).toEqual({atuais:4,maximos:20});
  fireEvent.click(screen.getByRole('button',{name:'Fechar ficha'}));fireEvent.click(screen.getByRole('button',{name:'Reabrir ficha'}));await screen.findByText('Página 1 de 3');
  expect(global.fetch).toHaveBeenCalledTimes(1);view.unmount();
},20000);
