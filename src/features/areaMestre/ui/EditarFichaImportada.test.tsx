import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EditarFichaImportada from './EditarFichaImportada';
import { repositorioTeste } from './testRepositorio';
import { criarLayoutPadrao } from './layoutWorkspace';
import { AnexoCampanha, DadosCampanha, FichaOriginal } from '../modelos';
jest.mock('./VisualizadorDocumento',()=>({__esModule:true,default:()=> <p>Prévia do retrato</p>}));
jest.mock('./RecortarRetrato',()=>({__esModule:true,default:({onRetrato}:{onRetrato:(a:AnexoCampanha)=>void})=><button type="button" onClick={()=>onRetrato({id:'recorte',campanhaId:'c',nome:'retrato-recortado.png',mime:'image/png',tamanho:8,arquivo:new Blob([new Uint8Array([137,80,78,71,13,10,26,10])],{type:'image/png'})})}>Usar recorte revisado</button>}));

test('completa ficha antiga com retrato e PV de referência sem alterar instância ou documento; persiste após reabrir',async()=>{
  const ambiente=repositorioTeste();
  const data='2026-10-18T12:00:00.000Z';
  const ficha:FichaOriginal={id:'f',campanhaId:'c',categoria:'monstro',formato:'pdf',anexoId:'original',nome:'Antigo',pvIniciais:{atuais:0,maximos:0},origemPV:'manual-pendente',avisos:['pv-nao-identificados'],importadoEm:data};
  const arquivo=new Blob(['%PDF-1.7 original'],{type:'application/pdf'});
  const dados:DadosCampanha={campanha:{id:'c',schemaVersion:1,nome:'Campanha',roteiro:'',criadoEm:data,atualizadoEm:data},fichas:[ficha],anexos:[{id:'original',campanhaId:'c',nome:'original.pdf',mime:'application/pdf',arquivo,tamanho:arquivo.size}],instancias:[{id:'instancia',campanhaId:'c',fichaOriginalId:'f',categoria:'monstro',nome:'Ajustado manualmente',pv:{atuais:3,maximos:7}}],combates:[],participantes:[],layout:criarLayoutPadrao('c')};
  try{
    await ambiente.repositorio.criar(dados);const fechar=jest.fn();
    render(<EditarFichaImportada ficha={ficha} anexos={dados.anexos} onFechar={fechar} onSalvar={async r=>{const atual=(await ambiente.repositorio.obter('c'))!;await ambiente.repositorio.salvar({...atual,fichas:[r.ficha],anexos:[...atual.anexos,...r.anexos]});return true;}}/>);
    fireEvent.change(screen.getByLabelText('Nome da ficha'),{target:{value:'Goblin'}});
    fireEvent.change(screen.getByLabelText('PV máximos de referência'),{target:{value:'20'}});
    fireEvent.change(screen.getByLabelText('PV atuais de referência'),{target:{value:'18'}});
    fireEvent.click(screen.getByRole('button',{name:'Usar recorte revisado'}));
    fireEvent.click(screen.getByRole('button',{name:'Salvar dados e retrato'}));
    await waitFor(()=>expect(fechar).toHaveBeenCalledTimes(1));
    ambiente.repositorio.fechar();const salvo=(await ambiente.repositorio.obter('c'))!;
    expect(salvo.fichas[0]).toMatchObject({nome:'Goblin',imagemAnexoId:'recorte',pvIniciais:{atuais:18,maximos:20}});
    expect(salvo.instancias).toEqual(dados.instancias);expect(salvo.anexos).toHaveLength(2);
    expect(salvo.anexos.find(a=>a.id==='original')!.arquivo.size).toBe(arquivo.size);
  }finally{ambiente.limpar();}
});
