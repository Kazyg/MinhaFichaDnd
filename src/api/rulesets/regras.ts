import type { RulesetData, RulesetVersion } from "./types";

export const getRulesetVersion = (version?: RulesetVersion | null): RulesetVersion => {
  if (version === undefined) return "DND_2014";
  if (version === "DND_2014" || version === "DND_2024") return version;
  throw new Error(`Versão de regras não suportada: ${String(version)}`);
};

// Only configuration: no character instances, generated IDs or catalog copies.
// Return fresh arrays so callers cannot mutate another character's configuration.
export function getRulesetConfig(version?: RulesetVersion | null): Pick<RulesetData, 'version' | 'regras'> {
  const edition = getRulesetVersion(version);
  return { version: edition, regras: edition === 'DND_2014' ? {
    labelRacaOuEspecie: "Raça",
    labelSubRacaOuOpcao: "Sub-raça",
    labelBackgroundOuOrigem: "Background",
    especieConcedeAtributos: true,
    backgroundConcedeAtributos: false,
    backgroundConcedeTalentoOrigem: false,
    backgroundPermiteEscolhaBonusAtributo: false,
    nivelPadraoSubclasse: 3,
    usaTalentosRevisados: false,
    suportaWeaponMastery: false,
    idiomasObrigatorios: [],
    quantidadeIdiomasLivres: 0,
    idiomasDisponiveis: [],
    especieConcedeIdiomas: true
  } : {
    labelRacaOuEspecie: "Espécie",
    labelSubRacaOuOpcao: "Opção de espécie",
    labelBackgroundOuOrigem: "Origem",
    especieConcedeAtributos: false,
    backgroundConcedeAtributos: true,
    backgroundConcedeTalentoOrigem: true,
    backgroundPermiteEscolhaBonusAtributo: true,
    nivelPadraoSubclasse: 3,
    usaTalentosRevisados: true,
    suportaWeaponMastery: true,
    idiomasObrigatorios: ["Comum"],
    quantidadeIdiomasLivres: 2,
    idiomasDisponiveis: ["Língua de Sinais Comum", "Dracônico", "Anão", "Élfico", "Gigante", "Gnômico", "Goblin", "Pequenino", "Orc"],
    especieConcedeIdiomas: false
  } };
}
