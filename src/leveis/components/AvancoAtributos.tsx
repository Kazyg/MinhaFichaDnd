import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { atributosChaves, nivelDaClasse, recursosNoNivel } from '../../api/rulesets/progressao';
import { efeitosDoAvanco, erroASI } from '../../api/fichaPersonagem/escolhasProgressao';

export default function AvancoAtributos({ nivel }: { nivel: number }) {
  const { ficha, forceUpdate } = useFicha();
  const existentes = ficha ? efeitosDoAvanco(ficha, nivel).filter(e => e.atributo) : [];
  const [escolhas, setEscolhas] = useState([existentes[0]?.atributo ?? '', existentes[1]?.atributo ?? '']);
  if (!ficha) return null;
  const classe = ficha.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe;
  if (!classe) return null;
  const recursos = recursosNoNivel(classe, nivelDaClasse(ficha, classe, nivel), ficha.versaoRegras);
  if (!recursos.length) return null;
  const erro = erroASI(ficha, nivel, escolhas);
  return <fieldset>
    <legend>{recursos.includes('epic-boon') ? 'Dádiva épica ou outro talento elegível' : 'Aumento de atributos / talento'}</legend>
    <p>ASI: distribua dois aumentos de +1 (máximo 20).</p>
    {escolhas.map((valor, i) => <label key={i}>Aumento {i + 1}
      <select aria-label={`Aumento ${i + 1}`} value={valor} onChange={e => setEscolhas(escolhas.map((v, j) => j === i ? e.target.value : v))}>
        <option value="">Selecione um atributo</option>
        {atributosChaves.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </label>)}
    {erro && <p role="status">{erro}</p>}
    <button disabled={!!erro} onClick={() => { if (ficha.aplicarAumentoAtributos(nivel, escolhas)) forceUpdate(); }}>Aplicar aumento</button>
  </fieldset>;
}
