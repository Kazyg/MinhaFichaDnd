/** @jest-environment node */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import postcss from 'postcss';

// Contrato do CSS: jsdom não calcula dimensões nem rolagem de flex/grid.
const folha = postcss.parse(readFileSync(resolve(process.cwd(), 'src/features/areaMestre/ui/prepararCombate.css'), 'utf8'));
function propriedades(seletor: string, mobile = false): Record<string, string> {
  const resultado: Record<string, string> = {};
  folha.walkRules(seletor, regra => {
    const emMedia = regra.parent?.type === 'atrule';
    if (emMedia !== mobile) return;
    regra.walkDecls(declaracao => { resultado[declaracao.prop] = declaracao.value; });
  });
  return resultado;
}
test('dimensões da preparação dependem da viewport e o diálogo não rola', () => {
  expect(propriedades('.am-dialog.am-preparacao-modal')).toMatchObject({ width: 'min(1100px,100%)', height: '88dvh', 'max-height': '88dvh', overflow: 'hidden' });
  expect(propriedades('.am-dialog.am-preparacao-modal', true)).toMatchObject({ height: '90dvh', 'max-height': '90dvh' });
});
test('somente o conteúdo das listas rola e a cadeia flex/grid permite encolher', () => {
  expect(propriedades('.am-preparacao-lista')).toMatchObject({ 'overflow-y': 'auto', 'min-height': '0', flex: '1' });
  for (const seletor of ['.am-preparacao-conteudo', '.am-preparacao-regioes', '.am-preparacao-regioes section']) expect(propriedades(seletor)).toMatchObject({ 'min-height': '0' });
  for (const seletor of ['.am-preparacao-cabecalho', '.am-preparacao-painel-cabecalho', '.am-preparacao-rodape']) expect(propriedades(seletor)).toMatchObject({ 'flex-shrink': '0' });
});
test('mobile usa um painel por vez e elementos ocultos ficam fora do layout', () => {
  expect(propriedades('.am-preparacao-regioes', true)).toMatchObject({ 'grid-template-columns': 'minmax(0,1fr)' });
  expect(propriedades('.am-preparacao-navegacao', true)).toMatchObject({ display: 'flex' });
  expect(propriedades('.am-preparacao-modal [hidden]')).toMatchObject({ display: 'none' });
});
