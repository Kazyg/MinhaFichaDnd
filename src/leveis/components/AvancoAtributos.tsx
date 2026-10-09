import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { atributosChaves, nivelDaClasse, recursosNoNivel } from '../../api/rulesets/progressao';
import { efeitosDoAvanco, erroASI } from '../../api/fichaPersonagem/escolhasProgressao';
import iconTalento from '../../imagens/icon_ancestry.png';

export default function AvancoAtributos({ nivel, onSelecionarTalento }: { nivel: number; onSelecionarTalento?: () => void }) {
  const { ficha, forceUpdate } = useFicha();
  const existentes = ficha ? efeitosDoAvanco(ficha, nivel).filter(e => e.atributo && !e.talento) : [];
  const [escolhas, setEscolhas] = useState([existentes[0]?.atributo ?? '', existentes[1]?.atributo ?? '']);
  const [modo, setModo] = useState<'atributo' | 'talento'>(existentes.length || !ficha?.efeitos?.some(e => e.level === nivel && e.talento) ? 'atributo' : 'talento');
  if (!ficha) return null;
  const classe = ficha.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe;
  if (!classe) return null;
  const recursos = recursosNoNivel(classe, nivelDaClasse(ficha, classe, nivel), ficha.versaoRegras);
  if (!recursos.length) return null;
  const erro = erroASI(ficha, nivel, escolhas);
  return <div className="avanco-atributos">
    {onSelecionarTalento && <div className="avanco-opcoes">
      <label><input type="checkbox" checked={modo === 'atributo'} onChange={() => setModo('atributo')} /> Atributo</label>
      <label><input type="checkbox" checked={modo === 'talento'} onChange={() => setModo('talento')} /> Talento</label>
    </div>}
    {modo === 'atributo' && <>
    {escolhas.map((valor, i) => <label key={i}>Aumento {i + 1}
      <select aria-label={`Aumento ${i + 1}`} value={valor} onChange={e => setEscolhas(escolhas.map((v, j) => j === i ? e.target.value : v))}>
        <option value="">Selecione um atributo</option>
        {atributosChaves.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </label>)}
    {erro && escolhas.every(Boolean) && <p role="status">{erro}</p>}
    <button disabled={!!erro} onClick={() => { if (ficha.aplicarAumentoAtributos(nivel, escolhas)) forceUpdate(); }}>Aplicar aumento</button>
    </>}
    {modo === 'talento' && onSelecionarTalento && <button className="botao-selecao-talento" aria-label="Selecionar Talento" onClick={onSelecionarTalento}>
      <img src={iconTalento} className="button-icon" alt="" />
      <div className="botao-texto"><span>Selecionar Talento</span><strong>{ficha.efeitos?.find(e => e.level === nivel && e.talento)?.talento || 'Selecionar Talento'}</strong></div>
    </button>}
  </div>;
}
