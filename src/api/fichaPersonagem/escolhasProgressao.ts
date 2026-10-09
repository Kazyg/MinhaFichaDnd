import type { Ficha } from './FichaPersonagem';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { atributosChaves, chaveClasse, erroDistribuicao, nivelDaClasse, normalizarChave, recursosNoNivel } from '../rulesets/progressao';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { erroTalento, registrarTalento, talentosDisponiveis, talentoDoEfeito } from './talentosConteudo';
import { buscarTalentoConteudo } from '../rulesets/conteudo';

export function arquivarEscolha(ficha: Ficha, tipo: string, valor: unknown) {
  if (valor == null) return;
  ficha.escolhasAnteriores = [...(ficha.escolhasAnteriores ?? []), { tipo, valor: JSON.parse(JSON.stringify(valor)) }];
}

export function efeitosDoAvanco(ficha: Ficha, nivel: number): Efeitos[] {
  const classe = ficha.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe;
  return (ficha.efeitos ?? []).filter(e => e.level === nivel && (
    e.origemId === `avanco:${classe && chaveClasse(classe)}:${classe && nivelDaClasse(ficha, classe, nivel)}` ||
    [`selecionadoAtributo${nivel}`, `selecionadoTalento${nivel}`, `TalentoEscolhido${nivel}`,
      `atributo1Classe${classe?.nome}${nivel}`, `atributo2Classe${classe?.nome}${nivel}`].includes(e.tituloEfeito)));
}

export function erroASI(ficha: Ficha, nivel: number, escolhas: string[]): string | null {
  const classe = ficha.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe;
  if (!classe || nivel > (ficha.levelTotal ?? 0) || !recursosNoNivel(classe, nivelDaClasse(ficha, classe, nivel), ficha.versaoRegras).length) return 'Este nível de classe não concede aumento de atributos.';
  if (escolhas.length !== 2 || escolhas.some(a => !atributosChaves.includes(normalizarChave(a) as typeof atributosChaves[number]))) return 'Escolha os dois aumentos de +1.';
  const anteriores = efeitosDoAvanco(ficha, nivel);
  const semEscolha = { ...ficha, efeitos: (ficha.efeitos ?? []).filter(e => !anteriores.includes(e)), levelTotal: nivel } as Ficha;
  for (const atributo of atributosChaves) {
    const bonus = escolhas.filter(a => normalizarChave(a) === atributo).length;
    if (bonus && calcularValorAtributoFinal(semEscolha, atributo) + bonus > 20) return 'Este aumento não pode elevar um atributo acima de 20.';
    if (bonus) {
      for (const posterior of semEscolha.efeitos ?? []) {
        if (posterior.level <= nivel || normalizarChave(posterior.atributo ?? '') !== atributo || !(posterior.tipoEfeito === 'asi' || /^atributo[12]Classe/.test(posterior.tituloEfeito) || talentoDoEfeito(posterior)?.escolha === 'atributo-agarrador')) continue;
        if (calcularValorAtributoFinal({ ...semEscolha, levelTotal: posterior.level } as Ficha, atributo) + bonus > 20) return 'Revise os aumentos posteriores: esta alteração ultrapassaria 20.';
      }
    }
  }
  return null;
}

export function aplicarASI(ficha: Ficha, nivel: number, escolhas: string[]): boolean {
  if (erroASI(ficha, nivel, escolhas)) return false;
  const classe = ficha.multiclasses!.find(m => m.nivelEscolhido.includes(nivel))!.classe;
  const anteriores = efeitosDoAvanco(ficha, nivel);
  arquivarEscolha(ficha, `avanco:${nivel}`, anteriores);
  ficha.efeitos = (ficha.efeitos ?? []).filter(e => !anteriores.includes(e));
  escolhas.forEach((atributo, i) => {
    const efeito = new Efeitos();
    efeito.atributo = normalizarChave(atributo);
    efeito.bonus = 1;
    efeito.level = nivel;
    efeito.classeNome = classe.nome;
    efeito.nivelClasseOrigem = nivelDaClasse(ficha, classe, nivel);
    efeito.origemTipo = 'nivel';
    efeito.origemId = `avanco:${chaveClasse(classe)}:${efeito.nivelClasseOrigem}`;
    efeito.tipoEfeito = 'asi';
    efeito.tituloEfeito = `atributo${i + 1}Classe${classe.nome}${nivel}`;
    ficha.setEfeitos(efeito);
  });
  return true;
}

export function talentosElegiveis(ficha: Ficha, nivel: number) {
  return talentosDisponiveis(ficha, nivel, undefined, efeitosDoAvanco(ficha, nivel));
}

export function selecionarTalentoAvanco(ficha: Ficha, nivel: number, nome: string, escolhas: string[] = []): boolean {
  const classe = ficha.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe;
  if (!classe || nivel > (ficha.levelTotal ?? 0) || !recursosNoNivel(classe, nivelDaClasse(ficha, classe, nivel), ficha.versaoRegras).length || !talentosElegiveis(ficha, nivel).some(t => t.nome === nome)) return false;
  const anteriores = efeitosDoAvanco(ficha, nivel);
  const talento = buscarTalentoConteudo(ficha.versaoRegras, nome)!;
  if (erroTalento(ficha, nivel, talento, escolhas, undefined, anteriores)) return false;
  arquivarEscolha(ficha, `avanco:${nivel}`, anteriores);
  ficha.efeitos = (ficha.efeitos ?? []).filter(e => !anteriores.includes(e));
  const efeito = new Efeitos();
  registrarTalento(efeito, talento, escolhas);
  efeito.level = nivel;
  efeito.classeNome = classe.nome;
  efeito.nivelClasseOrigem = nivelDaClasse(ficha, classe, nivel);
  efeito.origemTipo = 'nivel';
  efeito.origemId = `avanco:${chaveClasse(classe)}:${efeito.nivelClasseOrigem}`;
  efeito.tituloEfeito = `TalentoEscolhido${nivel}`;
  ficha.setEfeitos(efeito);
  return true;
}

export function concluirDistribuicao(ficha: Ficha): boolean {
  if (erroDistribuicao(ficha)) return false;
  const d = ficha.distribuicaoAtributos!;
  const valores = { ...d.atributos };
  const origem = (ficha.versaoRegras === 'DND_2024' ? ficha.backGround : ficha.subRaca ?? ficha.racaPrincipal) as unknown as { atributos?: { atributo: string[]; bonus: number[] } };
  if (!origem?.atributos) return false;
  for (const [i, nome] of (origem?.atributos?.atributo ?? []).entries()) {
    const a = normalizarChave(nome);
    if (!atributosChaves.includes(a as typeof atributosChaves[number])) return false;
    const bonus = ficha.versaoRegras === 'DND_2024'
      ? d.modo === 'todos' ? 1 : a === normalizarChave(d.maior) ? 2 : a === normalizarChave(d.menor) ? 1 : 0
      : origem.atributos!.bonus[i];
    if (!Number.isInteger(bonus) || bonus < 0 || valores[a] + bonus > 20) return false;
    valores[a] += bonus;
  }
  const novos = new Atributos(valores.forca, valores.destreza, valores.constituicao, valores.inteligencia, valores.sabedoria, valores.carisma);
  for (const efeito of ficha.efeitos ?? []) {
    if ((efeito.tipoEfeito === 'asi' || /^atributo[12]Classe/.test(efeito.tituloEfeito) || talentoDoEfeito(efeito)?.escolha === 'atributo-agarrador') && calcularValorAtributoFinal({ ...ficha, atributosPersonagem: novos, levelTotal: efeito.level } as Ficha, efeito.atributo) > 20) return false;
  }
  arquivarEscolha(ficha, 'atributos-iniciais', ficha.atributosPersonagem);
  ficha.setAtributosPersonagem(novos);
  return true;
}
