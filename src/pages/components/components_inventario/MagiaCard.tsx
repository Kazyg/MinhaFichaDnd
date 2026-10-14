import React, { useState } from 'react';
import type { MagiaConteudo } from '../../../api/rulesets/types';
import { formulaCura } from '../../../api/rulesets/conteudo';
import { propriedadeMagiaDisponivel } from '../DescricaoMagia';
import { calcularFormulaMagia, calcularAlvosMagia } from '../../../api/rulesets/magiaFormulas';

export function MagiaBadge({ children, detalhe }: { children: React.ReactNode; detalhe: string }) {
  const [aberto, setAberto] = useState(false);
  return <span className="magia-badge-wrap">
    <span className="info-badge" role="button" tabIndex={0} aria-label={detalhe} aria-expanded={aberto}
      onClick={() => setAberto(!aberto)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAberto(!aberto); } if (e.key === 'Escape') setAberto(false); }}
      onBlur={() => setAberto(false)}>{children}</span>
    <span className={`magia-tooltip${aberto ? ' aberto' : ''}`} role="tooltip">{detalhe}</span>
  </span>;
}

export default function MagiaCard({ nome, magia, origem, status, ataque, cd, modificador, nivelPersonagem = 1, circulos = [], children }: {
  nome: string; magia?: MagiaConteudo; origem: string; status?: string; ataque?: number; cd?: number; modificador?: number;
  nivelPersonagem?: number; circulos?: number[]; children: React.ReactNode;
}) {
  const [circuloEscolhido, setCirculo] = useState<number | null>(null);
  const circulo = circuloEscolhido !== null && circulos.includes(circuloEscolhido) ? circuloEscolhido : magia?.nivel ?? 0;
  const cura = magia?.combate?.cura ? calcularFormulaMagia(magia.combate.cura, magia.nivel, circulo, nivelPersonagem, modificador)
    : magia?.cura && modificador !== undefined ? formulaCura(magia, circulo, modificador) : null;
  const dano = magia?.combate?.dano;
  const danos = [dano, ...(magia?.combate?.danosAdicionais ?? [])].flatMap(dados => dados && magia ? [{
    label: dados.rotulo ?? 'Dano', formula:calcularFormulaMagia(dados, magia.nivel, circulo, nivelPersonagem, modificador), dado:dados.dado, tipo:dados.tipo,
  }] : []);
  const alvos = magia ? calcularAlvosMagia(magia, circulo, nivelPersonagem) : null;
  const aumenta = magia?.combate?.alvos?.porCirculo || magia?.combate?.cura?.dadosPorCirculo || dano?.dadosPorCirculo || magia?.combate?.danosAdicionais?.some(d => d.dadosPorCirculo) || magia?.cura;
  const propriedade = (texto: string | undefined, rotulo: string) => propriedadeMagiaDisponivel(texto) ? <MagiaBadge detalhe={`${rotulo}: ${texto}`}>{texto}</MagiaBadge> : null;
  return <article className="magia-card" aria-label={nome}>
    <div className="magia-card-titulo"><h4>{nome}</h4>{status && <MagiaBadge detalhe={status}>{status}</MagiaBadge>}</div>
    <div className="propriedades-grid">
      <MagiaBadge detalhe={origem}>{origem}</MagiaBadge>
      {magia && <>{propriedade(magia.nivel === 0 ? 'Truque' : `Círculo ${magia.nivel}`, 'Círculo')}{propriedade(magia.tipo, 'Escola')}
        {magia.concentracao && <MagiaBadge detalhe="Exige concentração">Concentração</MagiaBadge>}
        {magia.ritual && <MagiaBadge detalhe="Pode ser conjurada como ritual conforme as regras da fonte">Ritual</MagiaBadge>}</>}
    </div>
    <div className="magia-card-valores">
      {magia?.combate?.ataque && ataque !== undefined && <strong className="magia-destaque">Ataque {ataque >= 0 ? '+' : ''}{ataque}</strong>}
      {magia?.combate?.resistencia && cd !== undefined && <strong className="magia-destaque">CD {cd} · {magia.combate.resistencia}</strong>}
      {[...danos, { label:'Cura', formula:cura, dado:magia?.combate?.cura?.dado ?? magia?.cura?.dado, tipo:undefined }].map((v,i) => v.formula && <div className="linha-base-equipamento" key={`${v.label}:${i}`}>
        {[4,6,8,10,12,20].includes(v.dado ?? 0) && <img className="dado-base" src={`/icon_d${v.dado}.png`} alt={`d${v.dado}`} />}
        <span>{v.label} <strong>{v.formula}</strong>{v.tipo && <span className="magia-tipo-dano">{v.tipo}</span>}</span>
      </div>)}
      {magia && aumenta && circulos.some(n => n > magia.nivel) && <label className="magia-circulo-escolha">Conjurar no círculo <select value={circulo} onChange={e => setCirculo(Number(e.target.value))}>
        {[...new Set([magia.nivel, ...circulos.filter(n => n >= magia.nivel)])].map(n => <option key={n} value={n}>{n}</option>)}
      </select></label>}
    </div>
    {magia && <div className="propriedades-grid">
      {alvos !== null && <MagiaBadge detalhe={`${magia.combate?.alvos?.rotulo}: ${alvos}`}>{magia.combate?.alvos?.rotulo} {alvos}</MagiaBadge>}
      {magia.combate?.propriedades?.map(p => <MagiaBadge key={p} detalhe={p}>{p}</MagiaBadge>)}
      {propriedade(magia.alcance.tipo + (magia.alcance.distancia > 0 ? ` ${magia.alcance.distancia} m` : ''), 'Alcance')}
      {propriedade(magia.conjuracao, 'Conjuração')}{propriedade(magia.duracao, 'Duração')}
      {!!magia.componentes.componentes.length && <MagiaBadge detalhe={`Componentes: ${magia.componentes.componentes.join(', ')}. ${magia.componentes.material ?? ''}`}>{magia.componentes.componentes.join(', ')}</MagiaBadge>}
    </div>}
    <details className="magia-detalhes"><summary>Descrição</summary>{children}</details>
  </article>;
}
