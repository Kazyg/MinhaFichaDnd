import React from 'react';
import { useFicha } from '../../../api/fichaPersonagem/FichaContext';
import { itemMagicoVinculado, melhoriaCompativel, melhoriasDisponiveis, motivoBloqueioMelhoria, TipoEquipamento } from '../../../api/fichaPersonagem/fichaEquipamentosMagicos';
import type { Armas } from '../../../api/equipamentos/Armas';
import type { Armaduras_equip } from '../../../api/equipamentos/Armaduras';

export default function VinculacaoMagica({ tipo, equipamento }: { tipo: TipoEquipamento; equipamento: Armas | Armaduras_equip }) {
  const { ficha, forceUpdate } = useFicha();
  const item = itemMagicoVinculado(ficha, tipo, equipamento.id);
  const disponiveis = melhoriasDisponiveis(ficha, tipo, equipamento);
  const bloqueio = motivoBloqueioMelhoria(ficha, tipo, equipamento);
  if (item?.equipamentoMagico?.modo === 'especifico') return null;
  if (item) return <div className="vinculacao-magica">
    <span className="info-badge magia-equipamento-badge">{item.nome}</span>
    <button className="botao-sintonizar-item" onClick={() => { ficha?.desvincularItemMagico(item.id); forceUpdate(); }}>Remover melhoria</button>
  </div>;
  if (bloqueio && ficha?.itensMochila?.some(i => melhoriaCompativel(i, tipo, equipamento))) return <span className="magia-equipamento-nota">{bloqueio}</span>;
  if (!disponiveis.length) return null;
  return <div className="vinculacao-magica">
    <label>
      Melhoria mágica
      <select aria-label={`Melhoria mágica para ${equipamento.nome}`} value="" onChange={event => {
        if (event.target.value) ficha?.vincularItemMagico(event.target.value, tipo, equipamento.id);
        forceUpdate();
      }}>
        <option value="">Escolher melhoria</option>
        {disponiveis.map((i, indice) => <option key={i.id} value={i.id}>{i.nome}{disponiveis.filter(outro => outro.nome === i.nome).length > 1 ? ` — cópia ${indice + 1}` : ''}</option>)}
      </select>
    </label>
  </div>;
}
