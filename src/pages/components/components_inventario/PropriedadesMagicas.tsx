import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Itens } from '../../../bibliotecas/Itens';
import { useFicha } from '../../../api/fichaPersonagem/FichaContext';
import { itemEstaEquipado } from '../../../api/fichaPersonagem/fichaEquipamentosMagicos';

export function PropriedadeMagica({ rotulo, descricao }: { rotulo: string; descricao: string }) {
  const id = useId();
  const [aberto, setAberto] = useState(false);
  const ancora = useRef<HTMLSpanElement>(null);
  const atraso = useRef<ReturnType<typeof setTimeout>>();
  const [posicao, setPosicao] = useState({ left: 8, top: 8, width: 320 });
  const mostrar = () => {
    clearTimeout(atraso.current);
    const limites = ancora.current?.getBoundingClientRect();
    if (limites) {
      const width = Math.min(320, window.innerWidth - 16);
      setPosicao({ width, left: Math.max(8, Math.min(limites.left, window.innerWidth - width - 8)), top: window.innerHeight - limites.bottom > 230 ? limites.bottom + 6 : Math.max(8, limites.top - 226) });
    }
    setAberto(true);
  };
  const ocultar = () => { atraso.current = setTimeout(() => setAberto(false), 150); };
  useEffect(() => () => clearTimeout(atraso.current), []);
  useEffect(() => {
    if (!aberto) return;
    const fechar = (event: Event) => {
      if (event.type === 'scroll' && event.target instanceof Element && event.target.closest('.tooltip-propriedade-magica')) return;
      setAberto(false);
    };
    window.addEventListener('scroll', fechar, true);
    window.addEventListener('resize', fechar);
    return () => { window.removeEventListener('scroll', fechar, true); window.removeEventListener('resize', fechar); };
  }, [aberto]);
  return <span className="propriedade-magica-container" onMouseEnter={mostrar} onMouseLeave={ocultar}>
    <span className="info-badge info-badge-propriedade magia-equipamento-badge" role="button" tabIndex={0}
      ref={ancora} aria-expanded={aberto} aria-describedby={aberto ? id : undefined}
      onFocus={mostrar} onBlur={() => setAberto(false)} onClick={mostrar}
      onKeyDown={event => {
        if (event.key === 'Escape') setAberto(false);
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setAberto(true); }
      }}>{rotulo}</span>
    {aberto && createPortal(<span id={id} role="tooltip" className="tooltip-propriedade-magica" style={posicao} onMouseEnter={mostrar} onMouseLeave={ocultar} onMouseDown={event => event.preventDefault()}>{descricao}</span>, document.body)}
  </span>;
}

export default function PropriedadesMagicas({ item, equipamento = false }: { item?: Itens; equipamento?: boolean }) {
  const { ficha } = useFicha();
  const magia = item?.equipamentoMagico;
  if (!item || !magia) return null;
  const propriedades = magia.propriedadesEspeciais ?? [];
  const ativo = (magia.modo === 'melhoria' && !item.sintonizavel) || (itemEstaEquipado(ficha, item) && (!item.sintonizavel || ficha?.itensSintonizados?.includes(item.id)));
  return <div className="propriedades-grid propriedades-magicas">
    {propriedades.map(descricao => <PropriedadeMagica key={descricao} rotulo={descricao.includes(':') ? descricao.split(':')[0] : 'Propriedade especial'} descricao={descricao} />)}
    {!propriedades.length && magia.usarDescricaoCatalogo && item.descricao && <PropriedadeMagica rotulo="Propriedades" descricao={item.descricao} />}
    {!!propriedades.length && magia.usarDescricaoCatalogo && item.descricao && <PropriedadeMagica rotulo="Descrição completa" descricao={item.descricao} />}
    {magia.requisitoSintonizacao && <PropriedadeMagica rotulo="Requisito" descricao={magia.requisitoSintonizacao} />}
    {equipamento && magia.modo === 'especifico' && <PropriedadeMagica rotulo="Vinculado" descricao="Este equipamento representa a instância original do item mágico. O vínculo é permanente e não aceita melhorias genéricas." />}
    {equipamento && !ativo && <PropriedadeMagica rotulo="Magia inativa" descricao={item.sintonizavel ? 'As propriedades mágicas exigem que o equipamento esteja equipado e sintonizado. A sintonização é controlada na aba Itens.' : 'As propriedades mágicas exigem que o equipamento esteja equipado.'} />}
  </div>;
}
