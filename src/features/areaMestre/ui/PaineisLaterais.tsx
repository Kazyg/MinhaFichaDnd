import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { LayoutCampanha } from '../modelos';
import './paineisLaterais.css';

type Lado = 'sidebar' | 'pv';
type Larguras = { sidebar: number; pv: number };
const limites = { sidebar: [200, 400], pv: [240, 440] };
const limitar = (valor: number, min: number, max: number) => Math.max(min, Math.min(max, valor));
export default function PaineisLaterais({ layout, onChange, carregando = false, sidebar, children, pv }: {
  layout: LayoutCampanha; onChange: (layout: LayoutCampanha) => void; carregando?: boolean;
  sidebar: ReactNode; children: ReactNode; pv: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(() => window.innerWidth);
  const [temporarias, setTemporarias] = useState<Larguras | null>(null);
  const arraste = useRef<{ lado: Lado; x: number; inicial: number; larguras: Larguras; valor: number; pointer: number } | null>(null);
  useEffect(() => {
    const medir = () => { const medida = ref.current?.getBoundingClientRect().width; setLargura(medida && medida > 0 ? medida : window.innerWidth); };
    medir();
    const observador = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null;
    if (ref.current) observador?.observe(ref.current);
    window.addEventListener('resize', medir);
    return () => { observador?.disconnect(); window.removeEventListener('resize', medir); };
  }, []);
  useEffect(() => { arraste.current = null; setTemporarias(null); }, [layout.campanhaId, layout.sidebarRecolhida, carregando]);
  const salvas = { sidebar: limitar(layout.larguraSidebar ?? 260, 200, 400), pv: limitar(layout.larguraPV ?? 320, 240, 440) };
  const atuais = temporarias ?? salvas;
  const desktop = largura >= 1200;
  const esquerda = layout.sidebarRecolhida ? 70 : Math.min(atuais.sidebar, Math.max(200, largura - atuais.pv - 368));
  const direita = Math.min(atuais.pv, Math.max(240, largura - esquerda - 368));
  const maximo = (lado: Lado, valores: Larguras) => Math.floor(Math.min(limites[lado][1], largura - 368 - (lado === 'sidebar' ? valores.pv : layout.sidebarRecolhida ? 70 : valores.sidebar)));
  const salvar = (lado: Lado, valor: number) => onChange({ ...layout, [lado === 'sidebar' ? 'larguraSidebar' : 'larguraPV']: valor });
  const separador = (lado: Lado) => {
    if (!desktop || (lado === 'sidebar' && layout.sidebarRecolhida)) return null;
    return <div className={`am-separador am-separador-${lado}`} role="separator" tabIndex={carregando ? -1 : 0}
      aria-label={lado === 'sidebar' ? 'Largura da navegação' : 'Largura dos pontos de vida'} aria-orientation="vertical"
      aria-valuemin={limites[lado][0]} aria-valuemax={maximo(lado, atuais)} aria-valuenow={lado === 'sidebar' ? esquerda : direita}
      aria-disabled={carregando} onKeyDown={e => {
        if (carregando) return;
        const sinal = lado === 'sidebar' ? 1 : -1;
        const valor = e.key === 'Home' ? limites[lado][0] : e.key === 'End' ? maximo(lado, atuais) : e.key === 'ArrowLeft' ? atuais[lado] - sinal * (e.shiftKey ? 40 : 10) : e.key === 'ArrowRight' ? atuais[lado] + sinal * (e.shiftKey ? 40 : 10) : null;
        if (valor === null) return;
        e.preventDefault(); salvar(lado, limitar(valor, limites[lado][0], maximo(lado, atuais)));
      }} onPointerDown={e => {
        if (carregando || e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        arraste.current = { lado, x: e.clientX, inicial: atuais[lado], larguras: atuais, valor: atuais[lado], pointer: e.pointerId };
      }} onPointerMove={e => {
        const a = arraste.current;
        if (!a || a.pointer !== e.pointerId) return;
        const valor = limitar(Math.round(a.inicial + (e.clientX - a.x) * (lado === 'sidebar' ? 1 : -1)), limites[lado][0], maximo(lado, a.larguras));
        a.valor = valor; setTemporarias({ ...a.larguras, [lado]: valor });
      }} onPointerUp={e => {
        const a = arraste.current;
        if (!a || a.pointer !== e.pointerId) return;
        arraste.current = null; setTemporarias(null);
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        if (a.valor !== a.inicial) salvar(lado, a.valor);
      }} onPointerCancel={() => { arraste.current = null; setTemporarias(null); }} onLostPointerCapture={() => { arraste.current = null; setTemporarias(null); }} />;
  };
  const style = { '--am-lateral-esquerda': `${esquerda}px`, '--am-lateral-direita': `${direita}px` } as CSSProperties;
  return <main className={`am-corpo am-laterais${layout.sidebarRecolhida ? ' am-sidebar-recolhida' : ''}${desktop ? ' am-laterais-desktop' : ''}`} aria-label="Área do Mestre" aria-busy={carregando} ref={ref} style={style}>
    <fieldset className="am-bloqueio" disabled={carregando}>
      <div className="am-slot-sidebar">{sidebar}</div>{separador('sidebar')}
      <div className="am-central">{children}</div>{separador('pv')}
      <div className="am-slot-pv">{pv}</div>
    </fieldset>
  </main>;
}

