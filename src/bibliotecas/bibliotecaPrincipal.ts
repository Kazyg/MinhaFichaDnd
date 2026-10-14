import { caracteristicasDeClasse } from "./CaracteristicasClasse";
import { Talentos } from "./Talentos";
import type { RulesetVersion } from '../api/rulesets/types';

export function descricaoCaracteristica(nome: string, edicao: RulesetVersion = 'DND_2014'): string {
  if (!['DND_2014', 'DND_2024'].includes(edicao)) return 'Edição desconhecida; descrição indisponível.';
  const chave = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const entrada = caracteristicasDeClasse.find(c => chave(c.nome) === chave(nome) && c.versaoRegras === edicao)
    ?? (edicao === 'DND_2014' ? caracteristicasDeClasse.find(c => chave(c.nome) === chave(nome) && !c.versaoRegras) : undefined);
  return entrada ? `${entrada.descricao}\nCatálogo ${edicao.replace('DND_', '')}: fonte, revisão e licença pendentes de verificação.`
    : 'Descrição desta edição não catalogada. Nenhum texto de outra edição foi aplicado.';
}

export const bibliotecaPrincipal = {
  // Acervo legado para os consumidores 2014. Seleções novas usam rulesets/conteudo.
  procedencia: { natureza: 'nao-verificado', licenca: 'pendente', revisao: 'legado-local-1' },
  caracteristicasDeClasse,
  Talentos
};
