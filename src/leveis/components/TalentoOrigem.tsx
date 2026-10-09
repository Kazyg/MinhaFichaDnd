import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { buscarTalentoConteudo } from '../../api/rulesets/conteudo';
import { descreverTalentoSalvo, erroTalento, selecionarTalentoInicial } from '../../api/fichaPersonagem/talentosConteudo';
import ModalSelecaoTalento from '../../pages/modals/ModalSelecaoTalento';

export default function TalentoOrigem() {
  const { ficha, forceUpdate } = useFicha();
  const [aberto, setAberto] = useState(false);
  if (!ficha || ficha.versaoRegras !== 'DND_2024') return null;
  const nome = (ficha.backGround as unknown as { talentoOrigem?: string })?.talentoOrigem;
  if (!nome) return null;
  const t = buscarTalentoConteudo(ficha.versaoRegras, nome);
  const efeitos = ficha.efeitos?.filter(e => e.tituloEfeito === 'TalentoOrigem') ?? [];
  return <section aria-label="Talento da origem">
    <h4>Talento da origem: {nome}</h4>
    {efeitos.map(e => <p key={e.id}>{descreverTalentoSalvo(e)}</p>)}
    {!t?.suportado ? <p role="status">Implementação e escolhas pendentes. O nome concedido pela origem permanece salvo.</p> : <button onClick={() => setAberto(true)}>Configurar ou revisar {nome}</button>}
    {aberto && t && <div className="popup"><ModalSelecaoTalento titulo={`Revisar ${nome}`} opcoes={[t]} talentoInicial={t}
      escolhasIniciais={efeitos[0]?.escolhasTalento} validar={(t, escolhas) => erroTalento(ficha, 1, t, escolhas, 'Origin', efeitos)}
      onClose={() => setAberto(false)} onSelect={(t, escolhas) => {
        if (selecionarTalentoInicial(ficha, 'TalentoOrigem', t.nome, escolhas)) return false;
        forceUpdate(); return true;
      }} /></div>}
  </section>;
}
