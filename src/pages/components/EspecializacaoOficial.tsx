import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { arquivarEspecializacao, erroEspecializacao, fontesEspecializacao, periciasEspecializacao, selecionarEspecializacao } from '../../api/fichaPersonagem/fichaEspecializacao';

export default function EspecializacaoOficial() {
  const { ficha, forceUpdate } = useFicha();
  const [fonte, setFonte] = useState('');
  const [pericia, setPericia] = useState('');
  const [nivel, setNivel] = useState(1);
  if (!ficha) return null;
  const escolha = { fonte, pericia, nivelAquisicao: nivel, edicao: ficha.versaoRegras };
  const erro = erroEspecializacao(ficha, escolha);
  return <details><summary>Especialização por fonte oficial</summary>
    <p>Escolhas validadas separadas dos ajustes manuais. Treinamentos antigos não têm histórico de aquisição: confira quando foram obtidos. Ferramentas de ladrão de 2014 e outras fontes continuam sob controle manual.</p>
    <label>Fonte de especialização <select value={fonte} onChange={e => setFonte(e.target.value)}><option value="">Selecione</option>
      {fontesEspecializacao(ficha.versaoRegras).map(f => <option key={f.id} value={f.id}>{f.classe}, nível {f.nivel}: {f.quantidade} escolhas</option>)}</select></label>
    <label>Perícia para especialização <select value={pericia} onChange={e => setPericia(e.target.value)}><option value="">Selecione</option>
      {periciasEspecializacao.map(p => <option key={p}>{p}</option>)}</select></label>
    <label>Nível total de aquisição <input type="number" min={1} max={20} value={nivel} onChange={e => setNivel(Number(e.target.value))} /></label>
    <p id="erro-especializacao">{erro ?? 'Escolha elegível.'}</p>
    <button disabled={!!erro} aria-describedby="erro-especializacao" onClick={() => { selecionarEspecializacao(ficha, escolha); forceUpdate(); }}>Registrar especialização oficial</button>
    <ul>{(ficha.especializacoesOficiais ?? []).map((e, i, todas) => <li key={`${e.fonte}:${i}`}>
      {e.pericia} — {e.fonte} — {erroEspecializacao(ficha, e, todas.filter((_, j) => j !== i)) ?? 'Ativa'}
      <button onClick={() => { arquivarEspecializacao(ficha, i); forceUpdate(); }}>Arquivar escolha de {e.pericia}</button>
    </li>)}</ul>
  </details>;
}
