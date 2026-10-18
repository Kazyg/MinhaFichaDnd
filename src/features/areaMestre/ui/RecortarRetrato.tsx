import { useEffect, useRef, useState } from 'react';
import { AnexoCampanha } from '../modelos';
import { AreaRecorte } from '../retratos';
import './recortarRetrato.css';
export default function RecortarRetrato({ anexo, onRetrato, disabled=false }: { anexo: AnexoCampanha; onRetrato: (anexo: AnexoCampanha)=>void; disabled?: boolean }) {
  const [aberto,setAberto]=useState(false),[pagina,setPagina]=useState(1),[total,setTotal]=useState(1),[ocupado,setOcupado]=useState(false),[erro,setErro]=useState(''),[sugerido,setSugerido]=useState(false);
  const [area,setArea]=useState<AreaRecorte>({x:0,y:0,largura:100,altura:100});
  const fonte=useRef<HTMLCanvasElement|null>(null),vista=useRef<HTMLCanvasElement>(null),inicio=useRef<{x:number;y:number}|null>(null);
  useEffect(()=>{
    if(!aberto)return;
    const controle=new AbortController();setOcupado(true);setErro('');
    void (async()=>{
      const helpers=await import('../retratos');
      let canvas:HTMLCanvasElement;
      if(anexo.mime==='application/pdf'){const pdf=await import('../pdf');const r=await pdf.rasterizarPaginaPdf(anexo.arquivo,pagina,2200,controle.signal);canvas=r.canvas;setTotal(r.numPaginas);}
      else canvas=await helpers.carregarImagemRecorte(anexo,controle.signal);
      if(controle.signal.aborted){canvas.width=0;canvas.height=0;return;}
      fonte.current=canvas;
      if(vista.current){vista.current.width=canvas.width;vista.current.height=canvas.height;vista.current.getContext('2d')?.drawImage(canvas,0,0);}
      const sugestao=helpers.sugerirRecorte(canvas);setSugerido(!!sugestao);setArea(sugestao??{x:0,y:0,largura:100,altura:100});
    })().catch(e=>{if(!controle.signal.aborted)setErro(e instanceof Error?e.message:'Não foi possível preparar o recorte.');}).finally(()=>{if(!controle.signal.aborted)setOcupado(false);});
    return()=>{controle.abort();if(fonte.current){fonte.current.width=0;fonte.current.height=0;fonte.current=null;}};
  },[aberto,anexo,pagina]);
  const ponto=(e:React.PointerEvent<HTMLDivElement>)=>{const b=e.currentTarget.getBoundingClientRect();return{x:Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100)),y:Math.max(0,Math.min(100,(e.clientY-b.top)/b.height*100))};};
  return <fieldset className="am-recorte" disabled={disabled}><legend>Retrato da ficha</legend>
    <button type="button" onClick={()=>setAberto(!aberto)}>{aberto?'Fechar ferramenta de recorte':'Selecionar recorte da ficha'}</button>
    {ocupado&&<p role="status">Preparando página para recorte…</p>}
    {aberto&&<>{anexo.mime==='application/pdf'&&<label>Página de origem<input aria-label="Página de origem" disabled={ocupado} type="number" min="1" max={total} value={pagina} onChange={e=>{const n=Number(e.target.value);if(Number.isSafeInteger(n)&&n>=1&&n<=total)setPagina(n);}}/> / {total}</label>}
      <p>{sugerido?'Região de ilustração sugerida. Revise e ajuste antes de usar.':'Arraste sobre a página ou informe a área em porcentagem para selecionar o retrato.'}</p>
      <div className="am-recorte-imagem" role="group" aria-label="Área de seleção do retrato" onPointerDown={e=>{if(ocupado)return;inicio.current=ponto(e);e.currentTarget.setPointerCapture?.(e.pointerId);}} onPointerMove={e=>{if(!inicio.current)return;const p=ponto(e),i=inicio.current;setArea({x:Math.min(p.x,i.x),y:Math.min(p.y,i.y),largura:Math.abs(p.x-i.x),altura:Math.abs(p.y-i.y)});}} onPointerUp={()=>{inicio.current=null;}} onPointerCancel={()=>{inicio.current=null;}}>
        <canvas ref={vista} role="img" aria-label="Página original para recortar"/><div className="am-recorte-selecao" style={{left:`${area.x}%`,top:`${area.y}%`,width:`${area.largura}%`,height:`${area.altura}%`}}/>
      </div>
      <div className="am-recorte-campos">{(['x','y','largura','altura'] as const).map(chave=><label key={chave}>{({x:'Esquerda',y:'Topo',largura:'Largura',altura:'Altura'})[chave]} (%)<input type="number" min="0" max="100" step="0.1" value={Number(area[chave].toFixed(1))} onChange={e=>setArea({...area,[chave]:Number(e.target.value)})}/></label>)}</div>
      <button type="button" disabled={ocupado||!fonte.current} onClick={async()=>{if(!fonte.current)return;setOcupado(true);setErro('');try{const h=await import('../retratos');onRetrato(await h.gerarRetrato(fonte.current,area,anexo.campanhaId));}catch(e){setErro(e instanceof Error?e.message:'Falha no recorte.');}finally{setOcupado(false);}}}>Usar este recorte como retrato</button>
    </>}{erro&&<p role="alert">{erro}</p>}
  </fieldset>;
}
