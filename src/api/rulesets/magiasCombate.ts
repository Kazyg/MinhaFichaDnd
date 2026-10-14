import type { MagiaConteudo, RulesetVersion } from './types';
import revisadas from './magiasRevisadas.json';
import aliases from './magiasAliases.json';

type RevisaoMagia = Partial<MagiaConteudo> & { ingles: string; pagina: number };
const dados = revisadas as unknown as Record<RulesetVersion, Record<string, RevisaoMagia>>;
const nomes = aliases as Record<RulesetVersion, Record<string, string>>;
const normalizar = (nome: string) => nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const revisoes = new Set(['legado-local-1', 'phb2024-ha6-20250813-1', 'srd-5.1-pt-resumo-1', 'srd-5.2.1-pt-resumo-1', 'srd-magias-20261014-1']);

export function nomeCanonicoMagia(edicao: RulesetVersion, nome: string) {
  return nomes[edicao]?.[nome] ?? nome;
}

export function dadosRevisadosMagia(edicao: RulesetVersion, nome: string) {
  const canonico = nomeCanonicoMagia(edicao, nome);
  const chave = Object.keys(dados[edicao] ?? {}).find(n => normalizar(n) === normalizar(canonico));
  return chave ? dados[edicao][chave] : undefined;
}

export function complementarCombate(magia: MagiaConteudo): MagiaConteudo {
  if (!revisoes.has(magia.revisao)) return magia;
  const revisada = dadosRevisadosMagia(magia.edicao, magia.nome);
  if (!revisada) return magia;
  const { ingles, pagina, ...campos } = revisada;
  return { ...magia, ...campos };
}
