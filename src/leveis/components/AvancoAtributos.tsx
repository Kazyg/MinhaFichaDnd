import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { atributosChaves, nivelDaClasse, recursosNoNivel } from '../../api/rulesets/progressao';
import { arquivarEscolha, efeitosDoAvanco, erroASI } from '../../api/fichaPersonagem/escolhasProgressao';
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
  const limpar = () => {
    const anteriores = efeitosDoAvanco(ficha, nivel);
    if (anteriores.length) {
      arquivarEscolha(ficha, `avanco:${nivel}`, anteriores);
      ficha.efeitos = (ficha.efeitos ?? []).filter(e => !anteriores.includes(e));
    }
  };
  const alterar = (novas: string[]) => {
    setEscolhas(novas);
    if (novas.every(Boolean) && !erroASI(ficha, nivel, novas)) ficha.aplicarAumentoAtributos(nivel, novas);
    else limpar();
    forceUpdate();
  };
  const mudarModo = (novo: 'atributo' | 'talento') => {
    if (novo === modo) return;
    limpar();
    setEscolhas(['', '']);
    setModo(novo);
    forceUpdate();
  };
  return <div className="avanco-atributos">
    {onSelecionarTalento && <div className="avanco-opcoes">
      <label><input type="radio" name={`avanco-${nivel}`} checked={modo === 'atributo'} onChange={() => mudarModo('atributo')} /> Atributo</label>
      <label><input type="radio" name={`avanco-${nivel}`} checked={modo === 'talento'} onChange={() => mudarModo('talento')} /> Talento</label>
    </div>}
    {modo === 'atributo' && <>
    {escolhas.map((valor, i) => <label key={i}>Aumento {i + 1}
      <select aria-label={`Aumento ${i + 1}`} value={valor} onChange={e => alterar(escolhas.map((v, j) => j === i ? e.target.value : v))}>
        <option value="">Selecione um atributo</option>
        {atributosChaves.map(a => <option key={a} value={a}>{{ forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição', inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma' }[a]}</option>)}
      </select>
    </label>)}
    {erro && escolhas.every(Boolean) && <p role="status">{erro}</p>}
    </>}
    {modo === 'talento' && onSelecionarTalento && <button className="botao-selecao-talento" aria-label="Selecionar Talento" onClick={onSelecionarTalento}>
      <img src={iconTalento} className="button-icon" alt="" />
      <div className="botao-texto"><span>Selecionar Talento</span><strong>{ficha.efeitos?.find(e => e.level === nivel && e.talento)?.talento || 'Selecionar Talento'}</strong></div>
    </button>}
  </div>;
}
