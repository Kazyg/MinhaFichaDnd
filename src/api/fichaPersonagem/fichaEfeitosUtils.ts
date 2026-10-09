import { resolverConteudo } from '../rulesets/conteudo';
import { Efeitos } from "../classesPrincipais/Efeitos";
import { Itens } from "../../bibliotecas/Itens";
import type { Ficha } from "./FichaPersonagem";
import { chaveClasse, nivelDaClasse } from '../rulesets/progressao';

export type AtributoChave = "forca" | "destreza" | "constituicao" | "inteligencia" | "sabedoria" | "carisma";

const MAPA_ATRIBUTOS: Record<string, AtributoChave> = {
  forca: "forca",
  força: "forca",
  strength: "forca",
  destreza: "destreza",
  dexterity: "destreza",
  constituicao: "constituicao",
  constituição: "constituicao",
  constitution: "constituicao",
  inteligencia: "inteligencia",
  inteligência: "inteligencia",
  intelligence: "inteligencia",
  sabedoria: "sabedoria",
  wisdom: "sabedoria",
  carisma: "carisma",
  charisma: "carisma",
};

const MAPA_SIGLAS: Record<string, AtributoChave> = {
  FOR: "forca",
  DES: "destreza",
  CON: "constituicao",
  INT: "inteligencia",
  SAB: "sabedoria",
  CAR: "carisma",
};

const MAPA_CLASSES: Record<string, string> = {
  wizard: "mago",
  warlock: "bruxo",
  bard: "bardo",
  cleric: "clerigo",
  druid: "druida",
  paladin: "paladino",
  sorcerer: "feiticeiro",
  ranger: "patrulheiro",
  mago: "mago",
  bruxo: "bruxo",
  bardo: "bardo",
  clerigo: "clerigo",
  clérigo: "clerigo",
  druida: "druida",
  paladino: "paladino",
  feiticeiro: "feiticeiro",
  patrulheiro: "patrulheiro",
};

export const normalizarTexto = (texto: string = "") =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const criarEfeitoBaseDoItem = (item: Itens) => {
  const efeito = new Efeitos();
  efeito.setTituloEfeito(item.nome);
  efeito.setOrigemTipo("item");
  efeito.setOrigemId(item.id);
  efeito.setLevel(0);
  return efeito;
};

const extrairClasseRelacionada = (textoNormalizado: string): string | null => {
  const match = textoNormalizado.match(/(?:magias|feiticos) de ([a-z]+)|your ([a-z]+) spells/);
  if (match) return MAPA_CLASSES[match[1] ?? match[2]] ?? null;
  return null;
};

const extrairBonusPorRegex = (textoNormalizado: string, regexes: RegExp[]) => {
  for (const regex of regexes) {
    const match = textoNormalizado.match(regex);
    if (match) {
      return Number(match[1]);
    }
  }
  return null;
};

export const extrairEfeitosDoItem = (item: Itens): Efeitos[] => {
  if (item.efeitosExplicitos) return item.efeitosExplicitos.map((e, i) => Object.assign(criarEfeitoBaseDoItem(item), e, { id: `item:${item.id}:${i}`, origemTipo: 'item', origemId: item.id }));
  const efeitos: Efeitos[] = [];
  const descricaoNormalizada = normalizarTexto(item.descricao ?? "");
  const nomeNormalizado = normalizarTexto(item.nome ?? "");
  const classeRelacionada = extrairClasseRelacionada(`${nomeNormalizado} ${descricaoNormalizada}`);

  const regexAtributoFixo = [
    /(?:seu valor de|o valor da sua|o valor do seu)\s+(forca|destreza|constituicao|inteligencia|sabedoria|carisma)\s+(?:muda para|torna-se|passa a ser|e)\s+(\d+)/,
    /(?:sua|seu)\s+(forca|destreza|constituicao|inteligencia|sabedoria|carisma)\s+(?:muda para|torna-se|passa a ser|e)\s+(\d+)/,
    /(?:your)\s+(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+score\s+is\s+(\d+)/,
    /(?:your)\s+(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+score\s+becomes\s+(\d+)/,
  ];

  regexAtributoFixo.forEach((regex) => {
    const match = descricaoNormalizada.match(regex);
    if (match) {
      const atributo = MAPA_ATRIBUTOS[match[1]];
      const valor = Number(match[2]);
      if (atributo && !Number.isNaN(valor)) {
        const efeito = criarEfeitoBaseDoItem(item);
        efeito.setTipoEfeito("atributo_fixo");
        efeito.setAtributo(atributo);
        efeito.setValorFixo(valor);
        efeitos.push(efeito);
      }
    }
  });

  const regexBonusAtributo = [
    /bonus de \+(\d+) (?:em|na|no) (forca|destreza|constituicao|inteligencia|sabedoria|carisma)/,
    /ganha \+(\d+) (?:em|na|no) (forca|destreza|constituicao|inteligencia|sabedoria|carisma)/,
    /your (strength|dexterity|constitution|intelligence|wisdom|charisma) score increases by (\d+)/,
  ];

  regexBonusAtributo.forEach((regex) => {
    const match = descricaoNormalizada.match(regex);
    if (match) {
      const ingles = regex.source.startsWith("your ");
      const bonus = Number(match[ingles ? 2 : 1]);
      const atributo = MAPA_ATRIBUTOS[match[ingles ? 1 : 2]];
      if (atributo && !Number.isNaN(bonus)) {
        const efeito = criarEfeitoBaseDoItem(item);
        efeito.setTipoEfeito("bonus_atributo");
        efeito.setAtributo(atributo);
        efeito.setBonus(bonus);
        efeitos.push(efeito);
      }
    }
  });

  const bonusCA = extrairBonusPorRegex(`${nomeNormalizado} ${descricaoNormalizada}`, [
    /bonus de \+(\d+) na ca/,
    /recebe um bonus de \+(\d+) na ca/,
    /gain a \+(\d+) bonus to ac/,

  ]);

  if (bonusCA !== null) {
    const efeito = criarEfeitoBaseDoItem(item);
    efeito.setTipoEfeito("ca_item");
    efeito.setCa("CA");
    efeito.setBonus(bonusCA);
    efeitos.push(efeito);
  }

  const bonusAtaqueMagia = extrairBonusPorRegex(`${nomeNormalizado} ${descricaoNormalizada}`, [
    /bonus de \+(\d+) nas jogadas de ataque (?:com feiticos|magico|de magia)/,
    /ganha \+(\d+) de bonus nas jogadas de ataque magico/,
    /gain a \+(\d+) bonus to spell attack rolls/,
  ]);

  if (bonusAtaqueMagia !== null) {
    const efeito = criarEfeitoBaseDoItem(item);
    efeito.setTipoEfeito("ataque_magia");
    efeito.setArma("ataque_magia");
    efeito.setBonus(bonusAtaqueMagia);
    efeito.setClasseNome(classeRelacionada ?? "todas");
    efeitos.push(efeito);
  }

  const bonusCDMagia = extrairBonusPorRegex(`${nomeNormalizado} ${descricaoNormalizada}`, [
    /bonus de \+(\d+) nas cds dos testes de resistencia de (?:seus|suas) (?:feiticos|magias)/,
    /bonus de \+(\d+) nas cds dos testes de resistencia de suas magias de [a-zçãéíóú]+/,
    /gain a \+(\d+) bonus to the saving throw dcs of your spells/,
    /gain a \+(\d+) bonus to the saving throw dcs of your [a-z]+ spells/,
  ]);

  if (bonusCDMagia !== null) {
    const efeito = criarEfeitoBaseDoItem(item);
    efeito.setTipoEfeito("cd_magia");
    efeito.setArma("cd_magia");
    efeito.setBonus(bonusCDMagia);
    efeito.setClasseNome(classeRelacionada ?? "todas");
    efeitos.push(efeito);
  }

  // Weapon-local attack/damage requires explicit, scoped data; never grant
  // a global benefit from a weapon name or an isolated attack phrase.

  if (
    descricaoNormalizada.includes("se sintonizar com ate quatro itens magicos") ||
    descricaoNormalizada.includes("attune to up to four magic items")
  ) {
    const efeito = criarEfeitoBaseDoItem(item);
    efeito.setTipoEfeito("limite_sintonizacao");
    efeito.setBonus(1);
    efeitos.push(efeito);
  }

  return efeitos.map((e, i) => Object.assign(e, { id: `item:${item.id}:${i}` }));
};

export const listarEfeitosAtivos = (ficha: Ficha | null | undefined): Efeitos[] => {
  if (!ficha?.efeitos) return [];
  return ficha.efeitos.filter((efeito) => {
    if (efeito.conteudo && (efeito.conteudo.edicao !== ficha.versaoRegras || !resolverConteudo(efeito.conteudo))) return false;
    if (efeito.nivelClasseOrigem && efeito.classeNome && nivelDaClasse(ficha, chaveClasse(efeito.classeNome)) < efeito.nivelClasseOrigem) return false;
    if (efeito.level === undefined || efeito.level === null) return true;
    return efeito.level <= (ficha.levelTotal || 0);
  });
};

const normalizarAtributo = (atributo: string): AtributoChave | null => {
  const atributoNormalizado = normalizarTexto(atributo);
  return MAPA_ATRIBUTOS[atributoNormalizado] ?? MAPA_SIGLAS[atributo.toUpperCase()] ?? null;
};

export const selecionarAtributo = (ficha: Ficha | null | undefined, atributo: string) => {
  const atributoChave = normalizarAtributo(atributo);
  if (!atributoChave) return { base: 10, total: 10, explicacao: 'Atributo não informado' };

  const valorBase = ficha?.atributosPersonagem?.[atributoChave]?.valor ?? 10;
  const efeitos = listarEfeitosAtivos(ficha).filter((efeito) => normalizarAtributo(efeito.atributo ?? "") === atributoChave);

  const bonusTotal = efeitos.reduce((acc, efeito) => acc + (efeito.bonus ?? 0), 0);
  const valorComBonus = valorBase + bonusTotal;
  const valoresFixos = efeitos
    .map((efeito) => efeito.valorFixo ?? null)
    .filter((valor): valor is number => typeof valor === "number");

  const total = Math.max(valorComBonus, ...valoresFixos);
  const fontes = efeitos.map(e => `${e.tituloEfeito || e.origemTipo || 'Efeito sem fonte informada'}: ${e.valorFixo > 0 ? `mínimo ${e.valorFixo}` : `${e.bonus >= 0 ? '+' : ''}${e.bonus || 0}`}`);
  return { base: valorBase, total, explicacao: `Base ${valorBase}; ${fontes.join('; ')}; final ${total}` };
};

export const calcularValorAtributoFinal = (ficha: Ficha | null | undefined, atributo: string): number => selecionarAtributo(ficha, atributo).total;

const classeCorresponde = (efeito: Efeitos, classeNome?: string) => {
  const classeEfeito = normalizarTexto(efeito.classeNome ?? "todas");
  if (!classeNome || classeEfeito === "todas" || classeEfeito === "") return true;
  return classeEfeito === normalizarTexto(classeNome);
};

export const calcularBonusMagiaPorClasse = (
  ficha: Ficha | null | undefined,
  tipo: "ataque_magia" | "cd_magia",
  classeNome?: string
): number => {
  return listarEfeitosAtivos(ficha)
    .filter((efeito) => efeito.tipoEfeito === tipo || efeito.arma === tipo)
    .filter((efeito) => classeCorresponde(efeito, classeNome))
    .reduce((acc, efeito) => acc + (efeito.bonus ?? 0), 0);
};

export const calcularLimiteSintonizacao = (ficha: Ficha | null | undefined): number => {
  const base = ficha?.limiteSintonizacao ?? 3;
  const bonus = listarEfeitosAtivos(ficha)
    .filter((efeito) => efeito.tipoEfeito === "limite_sintonizacao")
    .reduce((acc, efeito) => acc + (efeito.bonus ?? 0), 0);

  return base + bonus;
};
