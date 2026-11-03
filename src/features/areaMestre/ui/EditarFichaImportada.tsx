import { useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { AnexoCampanha, FichaOriginal } from '../modelos';
import { confirmarMetadados, ImportacaoConfirmada, prepararRetrato } from '../importacaoVisual';
import RecortarRetrato from './RecortarRetrato';
import VisualizadorDocumento from './VisualizadorDocumento';
import './importarFicha.css';
export default function EditarFichaImportada({ficha,anexos,onSalvar,onFechar}:{ficha:FichaOriginal;anexos:AnexoCampanha[];onSalvar:(resultado:ImportacaoConfirmada)=>Promise<boolean>;onFechar:()=>void}){
  const [nome,setNome]=useState(ficha.nome),[maximos,setMaximos]=useState(String(ficha.pvIniciais.maximos)),[atuais,setAtuais]=useState(String(ficha.pvIniciais.atuais));
  const [retrato,setRetrato]=useState<AnexoCampanha|null>(null),[erro,setErro]=useState(''),[ocupado,setOcupado]=useState(false);
  const original=anexos.find(a=>a.id===ficha.anexoId);
  const salvar=async()=>{setErro('');try{const r=confirmarMetadados({ficha,anexos:retrato?[retrato]:[]},nome,maximos,atuais);if(retrato)r.ficha={...r.ficha,imagemAnexoId:retrato.id};setOcupado(true);if(await onSalvar(r))onFechar();else setErro('Não foi possível salvar. As alterações permanecem pendentes; tente salvar novamente.');}catch(e){setErro(e instanceof Error?e.message:'Falha ao salvar.');}finally{setOcupado(false);}};
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-importar-ficha" aria-label="Editar dados e retrato" onClose={()=>{if(!ocupado)onFechar();}}>
    <h2>Editar dados e retrato</h2><p>Corrige os dados de referência da ficha. Os PV e nomes das instâncias existentes permanecem independentes. O arquivo original será preservado.</p>
    <form onSubmit={e=>{e.preventDefault();void salvar();}}>
      <label>Nome da ficha<input value={nome} maxLength={200} disabled={ocupado} onChange={e=>setNome(e.target.value)}/></label>
      <div className="am-importar-pv"><label>PV máximos de referência<input type="number" min="0" step="1" value={maximos} disabled={ocupado} onChange={e=>setMaximos(e.target.value)}/></label><label>PV atuais de referência<input type="number" min="0" step="1" value={atuais} disabled={ocupado} onChange={e=>setAtuais(e.target.value)}/></label></div>
      {original&&ficha.formato!=='json'&&<RecortarRetrato anexo={original} onRetrato={setRetrato} disabled={ocupado}/>}
      <label>Retrato opcional<input type="file" accept=".png,.jpg,.jpeg,.gif,.webp" disabled={ocupado} onChange={async e=>{const arquivo=e.target.files?.[0];if(!arquivo)return;setOcupado(true);setErro('');try{setRetrato(await prepararRetrato(arquivo,ficha.campanhaId));}catch(causa){setErro(causa instanceof Error?causa.message:'Imagem inválida.');}finally{setOcupado(false);}}}/></label>
      {retrato&&<><VisualizadorDocumento anexo={retrato}/><button type="button" onClick={()=>setRetrato(null)}>Descartar novo retrato</button></>}
      {erro&&<p role="alert">{erro}</p>}<div className="am-dialog-acoes am-importar-acoes"><button type="button" disabled={ocupado} onClick={onFechar}>Cancelar</button><button disabled={ocupado}>Salvar dados e retrato</button></div>
    </form>
  </AccessibleDialog></div>;
}
