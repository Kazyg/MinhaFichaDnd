import React, { useState } from 'react';
import type { MagiaConteudo } from '../../api/rulesets/types';
import { formulaCura, rotuloConteudo } from '../../api/rulesets/conteudo';

export default function ConteudoMagia({ magia, aviso, snapshot }: { magia?: MagiaConteudo; aviso?: string; snapshot?: MagiaConteudo }) {
  const [circulo, setCirculo] = useState(1);
  const [modificador, setModificador] = useState(0);
  if (!magia) return <p role="status">Revisão de conteúdo indisponível. {snapshot ? `Snapshot preservado (não aplicado): ${snapshot.descricao}` : 'Nenhum texto de outra versão foi substituído.'}</p>;
  return <section aria-label={`Conteúdo de ${magia.nome}`}>
    {aviso && <p role="status">{aviso}</p>}
    <p>{rotuloConteudo(magia)}</p>
    <p>Nível {magia.nivel} · {magia.tipo}</p>
    <p>{magia.descricao}</p>
    <p>Conjuração: {magia.conjuracao}. Alcance: {magia.alcance.tipo}{magia.alcance.distancia > 0 ? ` ${magia.alcance.distancia} m` : ''}. Duração: {magia.duracao}.</p>
    {!!magia.componentes.componentes.length && <p>Componentes: {magia.componentes.componentes.join(', ')} {magia.componentes.material ?? ''}.</p>}
    <p>Fonte: {magia.fonte.url ? <a href={magia.fonte.url} target="_blank" rel="noreferrer">{magia.fonte.titulo}</a> : magia.fonte.titulo} · {magia.fonte.localizador} · consulta {magia.fonte.consultadoEm}</p>
    {magia.errata && <a href={magia.errata} target="_blank" rel="noreferrer">Errata consultada</a>}
    <p><a href={`${process.env.PUBLIC_URL}/CONTEUDO-LICENCAS.txt`} target="_blank" rel="noreferrer">Atribuições e licenças do conteúdo</a></p>
    {magia.cura && <div>
      <label>Círculo de conjuração <input type="number" min={1} max={9} value={circulo} onChange={e => setCirculo(Number(e.target.value))} /></label>
      <label>Modificador de conjuração <input type="number" value={modificador} onChange={e => setModificador(Number(e.target.value))} /></label>
      <p>Fórmula de cura: {formulaCura(magia, circulo, modificador) ?? 'Valores inválidos'}. A rolagem e a aplicação de PV são manuais.</p>
    </div>}
  </section>;
}
