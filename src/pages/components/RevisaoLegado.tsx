import React from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { pendenciasLegadas, revisarLegado } from '../../api/fichaPersonagem/revisaoLegado';

export default function RevisaoLegado() {
  const { ficha, forceUpdate } = useFicha();
  if (!ficha) return null;
  const pendencias = pendenciasLegadas(ficha);
  return <details><summary>Revisão de dados antigos ({pendencias.length})</summary>
    <p>Exporte primeiro o JSON original pelo menu. Manter registra sua decisão e uma cópia anterior, sem atribuir origem. Arquivar retira apenas o efeito escolhido e guarda sua cópia no histórico exportado.</p>
    <p>Para corrigir idiomas, distribuição ou deslocamento: revise uma cópia do JSON, preserve escolhasAnteriores, subclassesAnteriores e inventarioAnterior e importe como cópia pela Home. Compare as duas fichas antes de substituir a original. Rolagens e origens ausentes precisam de informação da mesa.</p>
    <ul>{pendencias.map(p => <li key={p.id}><p>{p.motivo}</p>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(p.valor, null, 2)}</pre>
      <button onClick={() => { revisarLegado(ficha, p.id, 'manter'); forceUpdate(); }}>Manter valor revisado: {p.id}</button>
      {p.id.startsWith('efeito:') && <button onClick={() => { revisarLegado(ficha, p.id, 'arquivar'); forceUpdate(); }}>Arquivar efeito: {p.id}</button>}
    </li>)}</ul>
    <p>As decisões e cópias anteriores permanecem em escolhasAnteriores no JSON. Para desfazer um arquivamento, siga o mesmo fluxo de revisão e importação como cópia.</p>
  </details>;
}
