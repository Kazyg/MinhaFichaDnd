import React, { useState } from 'react';
import type { MagiaConteudo } from '../../api/rulesets/types';
import { formulaCura } from '../../api/rulesets/conteudo';
import DescricaoMagia, { propriedadeMagiaDisponivel } from './DescricaoMagia';

export default function ConteudoMagia({ magia, aviso, snapshot }: { magia?: MagiaConteudo; aviso?: string; snapshot?: MagiaConteudo }) {
  const [circulo, setCirculo] = useState(1);
  const [modificador, setModificador] = useState(0);
  if (!magia) return <DescricaoMagia snapshot={snapshot} />;
  return <section aria-label={`Conteúdo de ${magia.nome}`}>
    {aviso && <p role="status">{aviso}</p>}
    <p>Nível {magia.nivel} · {magia.tipo}</p>
    <DescricaoMagia magia={magia} />
    {propriedadeMagiaDisponivel(magia.conjuracao) && <p>Conjuração: {magia.conjuracao}</p>}
    {propriedadeMagiaDisponivel(magia.alcance.tipo) && <p>Alcance: {magia.alcance.tipo}{magia.alcance.distancia > 0 ? ` ${magia.alcance.distancia} m` : ''}</p>}
    {propriedadeMagiaDisponivel(magia.duracao) && <p>Duração: {magia.duracao}</p>}
    {!!magia.componentes.componentes.length && <p>Componentes: {magia.componentes.componentes.join(', ')} {magia.componentes.material ?? ''}.</p>}
    {magia.fonte.url && <p>Fonte: <a href={magia.fonte.url} target="_blank" rel="noreferrer">{magia.fonte.titulo}</a></p>}
    {magia.errata && <a href={magia.errata} target="_blank" rel="noreferrer">Errata consultada</a>}
    {magia.cura && <div>
      <label>Círculo de conjuração <input type="number" min={1} max={9} value={circulo} onChange={e => setCirculo(Number(e.target.value))} /></label>
      <label>Modificador de conjuração <input type="number" value={modificador} onChange={e => setModificador(Number(e.target.value))} /></label>
      <p>Fórmula de cura: {formulaCura(magia, circulo, modificador) ?? 'Valores inválidos'}. A rolagem e a aplicação de PV são manuais.</p>
    </div>}
  </section>;
}
