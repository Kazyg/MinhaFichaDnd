import { useLayoutEffect, useRef, useState } from 'react';
import iconCa from '../../../imagens/icon_ac.png';
import '../../css/EscudoCA.css';

// Centróide da área interna do PNG original (150 × 150), não do seu bounding box.
// A ponta estreita deixa o centro visual acima de y=75. Medição reproduzível em
// docs/alinhamento-escudo/medir-geometria.py. O desenho original é preservado.
const CENTRO = { x: 74.5, y: 65 };

export default function EscudoCA({ valor }: { valor: number }) {
  const texto = useRef<SVGTextElement>(null);
  const [posicao, setPosicao] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    // Ambientes sem layout/canvas (como jsdom) usam o alinhamento SVG de fallback.
    if (typeof CanvasRenderingContext2D === 'undefined') return;
    let ativo = true;
    const contexto = document.createElement('canvas').getContext('2d');
    if (!contexto) return;

    const alinhar = () => {
      if (!ativo || !texto.current) return;
      const estilo = getComputedStyle(texto.current);
      contexto.font = `${estilo.fontStyle} ${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
      contexto.fontKerning = 'none';
      contexto.textAlign = 'left';
      contexto.textBaseline = 'alphabetic';
      contexto.direction = 'ltr';
      const limites = contexto.measureText(String(valor));
      // A largura de avanço e a caixa da linha incluem espaços da fonte. Estes
      // limites medem a tinta: a mesma fórmula atende qualquer quantidade/dígito.
      const x = CENTRO.x - (limites.actualBoundingBoxRight - limites.actualBoundingBoxLeft) / 2;
      const y = CENTRO.y + (limites.actualBoundingBoxAscent - limites.actualBoundingBoxDescent) / 2;
      if (Number.isFinite(x) && Number.isFinite(y)) {
        setPosicao(anterior => anterior?.x === x && anterior?.y === y ? anterior : { x, y });
      }
    };

    alinhar();
    document.fonts?.ready.then(alinhar);
    document.fonts?.addEventListener('loadingdone', alinhar);
    return () => {
      ativo = false;
      document.fonts?.removeEventListener('loadingdone', alinhar);
    };
  }, [valor]);

  return (
    <svg
      className="escudo-ca"
      viewBox="0 0 150 150"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Classe de armadura: ${valor}`}
    >
      <image href={iconCa} width="150" height="150" aria-hidden="true" />
      <text
        ref={texto}
        className="escudo-ca__valor"
        x={posicao?.x ?? CENTRO.x}
        y={posicao?.y ?? CENTRO.y}
        textAnchor={posicao ? 'start' : 'middle'}
        dominantBaseline={posicao ? 'alphabetic' : 'central'}
        aria-hidden="true"
      >
        {valor}
      </text>
    </svg>
  );
}
