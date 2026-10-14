import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { buscarTalentoConteudo } from '../../api/rulesets/conteudo';
import { descreverTalentoSalvo, erroTalento, selecionarTalentoInicial } from '../../api/fichaPersonagem/talentosConteudo';
import DescricaoCaracteristica from './DescricaoCaracteristica';
import { camposTalento } from '../../bibliotecas/Catalogo2024';
import { talento2024, proficiencia2024 } from '../../api/fichaPersonagem/talentos2024Utils';
import iconTalento from '../../imagens/icon_ancestry.png';
import ModalSelecaoTalento from '../../pages/modals/ModalSelecaoTalento';

export default function TalentoOrigem() {
  const { ficha, forceUpdate } = useFicha();
  const [aberto, setAberto] = useState(false);
  const [expandido, setExpandido] = useState(false);
  if (!ficha || ficha.versaoRegras !== 'DND_2024') return null;
  const nome = (ficha.backGround as unknown as { talentoOrigem?: string })?.talentoOrigem;
  if (!nome) return null;
  const t = buscarTalentoConteudo(ficha.versaoRegras, nome);
  const efeitos = ficha.efeitos?.filter(e => e.tituloEfeito === 'TalentoOrigem') ?? [];
  const regra = t?.phb && talento2024(t.nome);
  const precisaConfiguracao = !!t?.escolha || !!(regra && camposTalento(regra, efeitos[0]?.escolhasTalento2024 ?? {}, proficiencia2024(ficha)).length);
  const descricao = efeitos.length ? efeitos.map(descreverTalentoSalvo).join('\n') : t?.descricao ?? '';
  return <section className="talento-origem skills-container" aria-label="Talento da origem">
    <button type="button" className="talento-toggle" aria-expanded={expandido} onClick={() => setExpandido(!expandido)}>Talento da origem: {nome} <span aria-hidden="true">{expandido ? "▲" : "▼"}</span></button>
    {expandido && <div className="talento-origem-conteudo">
    {descricao && <DescricaoCaracteristica nome={nome} descricao={descricao} versao={ficha.versaoRegras} />}
    </div>}
    {!t?.suportado ? <p role="status">Implementação e escolhas pendentes. O nome concedido pela origem permanece salvo.</p> : precisaConfiguracao ? <button className="talento-configurar botao-selecao-talento" aria-label={`Configurar ou revisar ${nome}`} onClick={() => setAberto(true)}><img className="button-icon" src={iconTalento} alt="" /><span className="botao-texto"><span>Configurar ou revisar</span><strong>{nome}</strong></span></button> : null}
    {aberto && t && <div className="popup"><ModalSelecaoTalento ficha={ficha} listaDefinida={/^Iniciado em Magia \((.+)\)$/.exec(nome)?.[1]} titulo={`Revisar ${nome}`} opcoes={[t]} talentoInicial={t}
      escolhasIniciais={efeitos[0]?.escolhasTalento2024 ?? efeitos[0]?.escolhasTalento} validar={(t, escolhas) => erroTalento(ficha, 1, t, escolhas, 'Origin', efeitos)}
      onClose={() => setAberto(false)} onSelect={(t, escolhas) => {
        if (selecionarTalentoInicial(ficha, 'TalentoOrigem', t.nome, escolhas)) return false;
        forceUpdate(); return true;
      }} /></div>}
  </section>;
}
