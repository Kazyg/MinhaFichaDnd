import type { Ficha } from './FichaPersonagem';
import { nivelDaClasse, normalizarChave } from '../rulesets/progressao';
import { listarEfeitosAtivos } from './fichaEfeitosUtils';
import { talentoDoEfeito } from './talentosConteudo';
import { arquivarEscolha } from './escolhasProgressao';

export type Especializacao = { fonte: string; pericia: string; nivelAquisicao: number; edicao: string };
export const periciasEspecializacao = ['Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'];
// SRD 5.1: Bard/Expertise, Rogue/Expertise. SRD 5.2.1: Bard, Ranger, Rogue, Wizard/Scholar.
export function fontesEspecializacao(edicao: string) {
  const marcos = edicao === 'DND_2014' ? [['bardo', 3, 2], ['bardo', 10, 2], ['ladino', 1, 2], ['ladino', 6, 2]] as const
    : edicao === 'DND_2024' ? [['bardo', 2, 2], ['bardo', 9, 2], ['ladino', 1, 2], ['ladino', 6, 2], ['patrulheiro', 2, 1], ['patrulheiro', 9, 2], ['mago', 2, 1]] as const : [];
  return marcos.map(([classe, nivel, quantidade]) => ({ id: `${edicao}:${classe}:${nivel}`, classe, nivel, quantidade,
    elegiveis: classe === 'mago' ? ['Arcanismo', 'História', 'Investigação', 'Medicina', 'Natureza', 'Religião'] : periciasEspecializacao }));
}
export function temTreinamento(ficha: Ficha, pericia: string, nivel: number) {
  const chave = normalizarChave(pericia);
  // Legacy flat training has no acquisition history; retain its explicit assertion.
  if (ficha.pericias?.some(p => normalizarChave(p) === chave)) return true;
  return listarEfeitosAtivos({ ...ficha, levelTotal: nivel } as Ficha).some(e =>
    (normalizarChave(e.pericia ?? '') === chave && (!e.tipoEfeito || e.tipoEfeito === 'proficiencia')) ||
    (talentoDoEfeito(e)?.escolha === 'treinamentos' && e.escolhasTalento?.some(p => normalizarChave(p) === chave)));
}
export function erroEspecializacao(ficha: Ficha, escolha: Especializacao, outras = ficha.especializacoesOficiais ?? []): string | null {
  const fonte = fontesEspecializacao(ficha.versaoRegras).find(f => f.id === escolha.fonte);
  if (!fonte || escolha.edicao !== ficha.versaoRegras) return 'Fonte ou edição não suportada.';
  if (!Number.isInteger(escolha.nivelAquisicao) || escolha.nivelAquisicao < 1 || escolha.nivelAquisicao > (ficha.levelTotal ?? 0) || nivelDaClasse(ficha, fonte.classe, escolha.nivelAquisicao) < fonte.nivel) return 'Fonte indisponível no nível ativo ou de aquisição.';
  if (!fonte.elegiveis.includes(escolha.pericia)) return 'Perícia não elegível para esta fonte.';
  if (!temTreinamento(ficha, escolha.pericia, escolha.nivelAquisicao)) return 'Exige treinamento independente de especialização no nível de aquisição.';
  if (outras.some(e => e.pericia === escolha.pericia)) return 'Esta perícia já tem uma escolha oficial registrada.';
  if (listarEfeitosAtivos(ficha).some(e => e.tipoEfeito === 'especializacao' && normalizarChave(e.pericia) === normalizarChave(escolha.pericia))) return 'Já existe especialização manual ou legada nesta perícia; revise-a explicitamente.';
  if (outras.filter(e => e.fonte === fonte.id).length >= fonte.quantidade) return 'Quantidade de escolhas desta fonte esgotada.';
  return null;
}
export function especializacoesAtivas(ficha: Ficha) {
  const aceitas: Especializacao[] = [];
  for (const escolha of ficha.especializacoesOficiais ?? []) {
    if (!erroEspecializacao(ficha, escolha, aceitas)) aceitas.push(escolha);
  }
  return aceitas;
}
export function selecionarEspecializacao(ficha: Ficha, escolha: Especializacao) {
  const erro = erroEspecializacao(ficha, escolha);
  if (erro) return erro;
  ficha.especializacoesOficiais = [...(ficha.especializacoesOficiais ?? []), { ...escolha }];
  return null;
}
export function arquivarEspecializacao(ficha: Ficha, index: number) {
  const escolha = ficha.especializacoesOficiais?.[index];
  if (!escolha) return;
  arquivarEscolha(ficha, 'especializacao-oficial', escolha);
  ficha.especializacoesOficiais = ficha.especializacoesOficiais?.filter((_, i) => i !== index);
}
