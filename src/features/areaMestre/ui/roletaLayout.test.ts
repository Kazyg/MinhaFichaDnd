/** @jest-environment node */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import postcss from 'postcss';

// Contrato estrutural do CSS: medidas físicas/animação visual exigem navegador.
const folha = postcss.parse(readFileSync(resolve(process.cwd(), 'src/features/areaMestre/ui/barraIniciativa.css'), 'utf8'));
function estilo(seletor: string, media?: string): Record<string, string> {
  const resultado: Record<string, string> = {};
  folha.walkRules(seletor, regra => {
    const pai = regra.parent;
    if (media ? pai?.type !== 'atrule' || !('params' in pai) || pai.params !== media : pai?.type === 'atrule') return;
    regra.walkDecls(d => { resultado[d.prop] = d.value; });
  });
  return resultado;
}
test('desktop mantém roleta de cinco colunas, centro maior e próximo turno na mesma linha', () => {
  expect(estilo('.am-barra-iniciativa')).toMatchObject({ display: 'grid', 'align-items': 'center', 'grid-template-columns': 'minmax(150px,1fr) minmax(0,850px) minmax(150px,1fr)' });
  expect(estilo('.am-iniciativa-faixa')['grid-template-columns']).toBe('1fr 1fr 1.16fr 1fr 1fr');
  expect(parseInt(estilo('.am-iniciativa-cartao[aria-current=step]').height)).toBeGreaterThan(parseInt(estilo('.am-iniciativa-cartao').height));
  expect(estilo('.am-workspace .am-iniciativa-proximo')).toMatchObject({ 'grid-column': '3', 'justify-self': 'end', width: 'auto' });
});
test('viewport móvel recorta as extremidades sem perder o centro ou expandir a página', () => {
  expect(estilo('.am-roleta-viewport')).toMatchObject({ 'min-width': '0', overflow: 'hidden' });
  expect(estilo('.am-iniciativa-faixa', '(max-width:650px)')).toMatchObject({ width: 'max(100%,420px)', left: '50%', transform: 'translateX(-50%)' });
  expect(estilo('.am-workspace .am-iniciativa-proximo', '(max-width:650px)')).toMatchObject({ 'grid-column': '2' });
});
test('handle transparente tem foco visível, toque e hover discreto', () => {
  expect(estilo('.am-workspace .am-iniciativa-arrastar')).toMatchObject({ background: 'transparent', border: '0', 'touch-action': 'none' });
  expect(estilo('.am-workspace .am-iniciativa-arrastar:focus-visible').outline).toContain('3px solid');
  expect(estilo('.am-workspace .am-iniciativa-arrastar:hover:enabled').background).toContain('--area-menu-hover');
});
