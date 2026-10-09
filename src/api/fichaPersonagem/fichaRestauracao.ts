import { getRulesetData } from '../rulesets/getRulesetData';
import type { Ficha } from './FichaPersonagem';
import { Classes } from '../classesPrincipais/Classes.class';
import { SubClasses } from '../classesPrincipais/SubClasses';
import { Raca } from '../classesPrincipais/Raca.class';
import { BackGround } from '../classesPrincipais/BackGrounds.class';
import { Patronos } from '../classesEspeciais/Patronos.class';
import { Multiclasses } from '../classesPrincipais/Multiclasses';
import { chaveClasse } from '../rulesets/progressao';

// Catalogs identify prototypes only. Never replace persisted snapshots or IDs
// with current catalog data: those snapshots may contain manual/legacy edits.
export function restaurarModelos(data: any) {
  const rules = getRulesetData(data.versaoRegras);
  const restore = (value: any, options: any[], fallback: object): any => {
    if (!value) return value;
    const template = options.find(o => o.nome === value.nome);
    return Object.assign(Object.create(template ? Object.getPrototypeOf(template) : fallback), value);
  };
  const findClass = (name: string) => rules.classes.find(c => chaveClasse(c) === chaveClasse(name));
  const restoreClass = (value: any) => {
    const template = value && rules.classes.find(c => chaveClasse(c) === chaveClasse(value));
    const result = value && Object.assign(Object.create(template ? Object.getPrototypeOf(template) : Classes.prototype), value);
    // Old snapshots keep their serialized shape; missing keys resolve through
    // the same alias boundary. New catalog choices persist their stable key.
    if (result?.subClasse) result.subClasse = result.subClasse.map((s: any) =>
      restore(s, findClass(value.nome)?.subClasse ?? [], SubClasses.prototype));
    return result;
  };
  const races = rules.racasOuEspecies.flatMap(r => [r, ...(r.subOpcoes ?? [])]);
  const restoreRace = (value: any) => {
    const result = restore(value, races, Raca.prototype);
    if (result?.subOpcoes) result.subOpcoes = result.subOpcoes.map(restoreRace);
    return result;
  };
  return { ...data,
    classePrincipal: restoreClass(data.classePrincipal),
    multiclasses: data.multiclasses?.map((m: any) => Object.assign(Object.create(Multiclasses.prototype), m, { classe: restoreClass(m.classe) })) ?? null,
    subClasse: data.subClasse?.map((s: any) => ({ ...s, classe: restoreClass(s.classe),
      subclasse: restore(s.subclasse, findClass(s.classe.nome)?.subClasse ?? [], SubClasses.prototype) })) ?? null,
    racaPrincipal: restoreRace(data.racaPrincipal), subRaca: restoreRace(data.subRaca),
    patrono: restore(data.patrono, [], Patronos.prototype),
    backGround: restore(data.backGround, rules.backgroundsOuOrigens, BackGround.prototype),
  };
}

export function idiomasEscolhidos(ficha: Ficha): string[] {
  if (ficha.idiomasLivres) return ficha.idiomasLivres;
  // A saved language's position does not identify its source. Keep the original
  // idiomas array; the review panel asks for an explicit decision.
  return [];
}
