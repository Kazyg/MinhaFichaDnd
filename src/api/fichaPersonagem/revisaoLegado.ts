import type { Ficha } from './FichaPersonagem';
import { erroDistribuicao } from '../rulesets/progressao';
import { arquivarEscolha } from './escolhasProgressao';

export function pendenciasLegadas(f: Ficha) {
  const pendencias: { id: string; motivo: string; valor: unknown }[] = [];
  (f.efeitos ?? []).filter(e => !e.origemTipo).forEach(e => pendencias.push({ id: `efeito:${e.id}`, valor: e,
    motivo: `${e.tituloEfeito || e.id}: efeito sem origem. Editar níveis não identifica nem remove sua origem histórica.` }));
  if (f.idiomas?.length && f.idiomasLivres == null) pendencias.push({ id: 'idiomas', valor: { idiomas: f.idiomas }, motivo: 'Idiomas antigos sem proveniência. Não é possível distinguir escolhas livres de ajustes manuais.' });
  if (f.atributosPersonagem && !f.distribuicaoAtributos) pendencias.push({ id: 'atributos', valor: f.atributosPersonagem, motivo: 'Atributos sem método ou rolagens originais. Os valores salvos são mantidos.' });
  if (f.distribuicaoAtributos) {
    const erro = erroDistribuicao(f);
    if (erro || (f.distribuicaoAtributos.metodo === 'Rolagem de Dados' && !f.distribuicaoAtributos.gerados)) pendencias.push({ id: 'distribuicao', valor: f.distribuicaoAtributos,
      motivo: erro ?? 'Rolagem sem conjunto original. Não gere resultados para justificar os valores antigos.' });
  }
  if (f.subRaca && f.speed != null) pendencias.push({ id: 'deslocamento', valor: { speed: f.speed, subRaca: f.subRaca }, motivo: 'Deslocamento e snapshot de linhagem salvos: confira com a mesa; o catálogo atual não certifica sua origem.' });
  return pendencias.filter(p => !f.escolhasAnteriores?.some(e => e.tipo === `revisao-legado:manter:${p.id}` && JSON.stringify(e.valor) === JSON.stringify(p.valor)));
}
export function revisarLegado(f: Ficha, id: string, acao: 'manter' | 'arquivar') {
  const p = pendenciasLegadas(f).find(p => p.id === id);
  if (!p || (acao === 'arquivar' && !id.startsWith('efeito:'))) return false;
  arquivarEscolha(f, `revisao-legado:${acao}:${id}`, p.valor);
  if (acao === 'arquivar') f.efeitos = f.efeitos?.filter(e => `efeito:${e.id}` !== id) ?? null;
  return true;
}
