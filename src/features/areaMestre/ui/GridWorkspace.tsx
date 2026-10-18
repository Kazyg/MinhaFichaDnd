import React, { useEffect, useState } from 'react';
import { GridLayout, Layout, useContainerWidth, verticalCompactor } from 'react-grid-layout';
import { LayoutCampanha, PainelLayout } from '../modelos';
import { aplicarGrade, completarLayout, paraGrade } from './layoutWorkspace';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './gridWorkspace.css';

interface Props {
  layout: LayoutCampanha;
  onChange: (layout: LayoutCampanha) => void;
  renderPainel: (painel: PainelLayout) => React.ReactNode;
  editarLayout?: boolean;
}
export function GridWorkspace({ layout, onChange, renderPainel, editarLayout = true }: Props) {
  const { width, containerRef } = useContainerWidth({ initialWidth: 1000 });
  const [viewport, setViewport] = useState(() => window.innerWidth);
  useEffect(() => {
    const atualizar = () => setViewport(window.innerWidth);
    window.addEventListener('resize', atualizar);
    return () => window.removeEventListener('resize', atualizar);
  }, []);
  const normalizado = completarLayout(layout);
  const desktop = viewport >= 1200 && width >= 320;
  const interativo = desktop && editarLayout;
  const mobile = viewport < 600;
  const grade = paraGrade(normalizado, desktop ? 12 : 6);
  const visiveis = normalizado.paineis.filter(p => !p.fechado).sort((a, b) => a.y - b.y || a.x - b.x);
  const salvar = (proxima: Layout) => {
    if (desktop && proxima.every(p => p.y >= 0 && p.y + p.h <= 60)) onChange(aplicarGrade(normalizado, proxima));
  };
  const teclado = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editarLayout || !(event.target instanceof HTMLElement) || !event.target.matches('.mestre-drag-handle')) return;
    const canonica = paraGrade(normalizado, 12);
    const id = event.target.dataset.panelid;
    const item = canonica.find(p => p.i === id);
    if (!item || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const proxima = canonica.map(p => ({ ...p }));
    const alterado = proxima.find(p => p.i === id)!;
    const dx = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const dy = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (event.shiftKey) {
      alterado.w = Math.max(3, Math.min(12 - alterado.x, alterado.w + dx));
      if (!normalizado.paineis.find(p => p.id === id)?.recolhido) alterado.h = Math.max(3, Math.min(20, alterado.h + dy));
    } else {
      alterado.x = Math.max(0, Math.min(12 - alterado.w, alterado.x + dx));
      alterado.y = Math.max(0, Math.min(60 - alterado.h, alterado.y + dy));
    }
    const compactada = verticalCompactor.compact(proxima, 12);
    if (compactada.every(p => p.y >= 0 && p.y + p.h <= 60)) onChange(aplicarGrade(normalizado, compactada));
  };
  return <div className={`mestre-grid-container ${interativo ? 'mestre-grid-editavel' : ''}`} ref={containerRef as React.RefObject<HTMLDivElement>} onKeyDown={teclado}>
    <span id="mestre-grid-teclado" className="mestre-grid-sr-only">Use as setas para mover o quadro e Shift com as setas para redimensionar.</span>
    {mobile ? <div className="mestre-grid-mobile">{visiveis.map(p => <div className="mestre-grid-painel" key={p.id}>{renderPainel(p)}</div>)}</div> : <GridLayout
      width={width} layout={grade} gridConfig={{ cols: desktop ? 12 : 6, rowHeight: 34, maxRows: 60, margin: [12, 12], containerPadding: [0, 0] }}
      dragConfig={{ enabled: interativo, bounded: false, handle: '.mestre-drag-handle', cancel: '.mestre-no-drag,button,input,textarea,select,a', allowMobileScroll: true }}
      resizeConfig={{ enabled: interativo }} compactor={verticalCompactor}
      onDragStop={salvar} onResizeStop={salvar}>
      {visiveis.map(p => <div className="mestre-grid-painel" key={p.id}>{renderPainel(p)}</div>)}
    </GridLayout>}
  </div>;
}
export default GridWorkspace;
