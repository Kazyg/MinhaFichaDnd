import type { Ficha } from "./FichaPersonagem";
import { Efeitos } from "../classesPrincipais/Efeitos.ts";
import { armas } from "../equipamentos/Armas.ts";
import {
  Talentos2024,
  Magias2024,
  EscolhasTalento,
  Talento2024,
  normalizarRegra,
  atributos2024,
  pericias2024,
  camposTalento,
} from "../../bibliotecas/Catalogo2024.ts";

export const talento2024 = (nome: string) =>
  Talentos2024.find((t) => t.nome === nome);
const ativos = (ficha?: Ficha | null, ignorarTitulo?: string) =>
  (ficha?.efeitos || []).filter(
    (e) =>
      e.level <= (ficha?.levelTotal || 1) &&
      e.tituloEfeito !== ignorarTitulo &&
      e.origemId !== ignorarTitulo,
  );
export const proficiencia2024 = (ficha?: Ficha | null) =>
  2 + Math.floor((Math.max(1, ficha?.levelTotal || 1) - 1) / 4);
export function proficienciasDaFicha(
  ficha?: Ficha | null,
  ignorarTitulo?: string,
): string[] {
  return [
    ...(ficha?.pericias || []),
    ...(ficha?.classePrincipal?.armaduras || []),
    ...(ficha?.classePrincipal?.armas || []),
    ...(ficha?.classePrincipal?.ferramentas || []),
    ...ativos(ficha, ignorarTitulo).flatMap((e) => [
      ...(e.proeficienciasRaca || []),
      ...(e.proeficienciasBackGround || []),
      ...(e.proeficienciasClasse || []),
      ...(e.proficienciasMulticlasse || []),
    ]),
  ];
}
const possui = (lista: string[], valor: string) =>
  lista.some((p) => normalizarRegra(p) === normalizarRegra(valor));
export const temPericia = (ficha: Ficha | null | undefined, nome: string) =>
  possui(proficienciasDaFicha(ficha), nome);
export const temEspecializacao = (
  ficha: Ficha | null | undefined,
  nome: string,
  ignorarTitulo?: string,
) =>
  ativos(ficha, ignorarTitulo).some(
    (e) =>
      e.tipoEfeito === "especializacao" &&
      normalizarRegra(e.pericia) === normalizarRegra(nome),
  );
export const temSalvaguarda = (
  ficha: Ficha | null | undefined,
  atributo: string,
  ignorarTitulo?: string,
) =>
  possui(ficha?.classePrincipal?.testesResistencias || [], atributo) ||
  ativos(ficha, ignorarTitulo).some(
    (e) =>
      e.tipoEfeito === "salvaguarda" &&
      normalizarRegra(e.atributo) === normalizarRegra(atributo),
  );
export function valorAtributoSemTalento(
  ficha: Ficha | null | undefined,
  atributo: string,
  titulo?: string,
  nivel?: number,
) {
  const chave = normalizarRegra(atributo) as keyof NonNullable<
    Ficha["atributosPersonagem"]
  >;
  const base =
    (ficha?.atributosPersonagem?.[chave] as { valor: number } | undefined)
      ?.valor ?? 10;
  return ativos(ficha, titulo)
    .filter(
      (e) =>
        normalizarRegra(e.atributo || "") === chave &&
        (nivel === undefined || e.level <= nivel),
    )
    .reduce(
      (v, e) =>
        Math.max(
          v +
            (e.limiteAtributo
              ? Math.max(0, Math.min(e.bonus || 0, e.limiteAtributo - v))
              : e.bonus || 0),
          e.valorFixo || 0,
        ),
      base,
    );
}
export function requisitosTalento(
  t: Talento2024,
  ficha: Ficha | null | undefined,
  nivel: number,
  titulo?: string,
): string[] {
  const erros: string[] = [];
  const req = normalizarRegra(t.preRequisito);
  const minimo = Number(req.match(/nivel (\d+)/)?.[1] || 1);
  if (nivel < minimo) erros.push(`Requer nível ${minimo}.`);
  const atributoReq = req.match(
    /(?:, )((?:forca|destreza|constituicao|inteligencia|sabedoria|carisma)(?:,? (?:ou )?(?:forca|destreza|constituicao|inteligencia|sabedoria|carisma))*) (\d+) ou superior/,
  );
  if (
    atributoReq &&
    !atributos2024
      .filter((a) => atributoReq[1].includes(a))
      .some(
        (a) =>
          valorAtributoSemTalento(ficha, a, titulo, nivel) >=
          Number(atributoReq[2]),
      )
  )
    erros.push(t.preRequisito);
  const profs = proficienciasDaFicha(ficha, titulo).map(normalizarRegra);
  const treinamento = req.match(
    /treinamento com (armadura (?:leve|media|pesada)|escudo)/,
  )?.[1];
  if (
    treinamento &&
    !profs.some(
      (p) =>
        p.includes(treinamento) ||
        (treinamento !== "escudo" && p === "todas as armaduras"),
    )
  )
    erros.push(`Requer ${treinamento}.`);
  const classes = [
    ficha?.classePrincipal?.nome,
    ...(ficha?.multiclasses || [])
      .filter((m) => m.nivelEscolhido.some((n) => n <= nivel))
      .map((m) => m.classe.nome),
  ]
    .filter(Boolean)
    .map((n) => normalizarRegra(n!));
  const caracteristicas = (ficha?.multiclasses || [])
    .flatMap(
      (m) =>
        m.classe.niveis
          ?.filter(
            (n) => n.nivel <= m.nivelEscolhido.filter((v) => v <= nivel).length,
          )
          .flatMap((n) => n.caracteristicas) || [],
    )
    .map(normalizarRegra);
  const conjuracao =
    classes.some((c) =>
      ["bardo", "clerigo", "druida", "feiticeiro", "mago"].includes(c),
    ) ||
    (nivel >= 2 &&
      classes.some((c) =>
        ["paladino", "patrulheiro", "guardiao"].includes(c),
      )) ||
    caracteristicas.some((c) => c.includes("conjuracao")) ||
    ficha?.subClasse?.some(
      (s) =>
        ["Cavaleiro Arcano", "Trapaceiro Arcano"].includes(s.subclasse.nome) &&
        nivel >= 3,
    );
  if (
    req.includes("conjuracao") &&
    !conjuracao &&
    !(req.includes("magia de pacto") && classes.includes("bruxo"))
  )
    erros.push(
      "Requer a característica Conjuração ou Magia de Pacto indicada.",
    );
  if (
    req.includes("estilo de luta") &&
    !caracteristicas.some((c) => c.includes("estilo de luta")) &&
    !(
      (classes.includes("guerreiro") && nivel >= 1) ||
      (nivel >= 2 &&
        classes.some((c) => ["paladino", "patrulheiro"].includes(c)))
    )
  )
    erros.push("Requer a característica Estilo de Luta.");
  const iguais = ativos(ficha, titulo).filter((e) => e.talento === t.nome);
  if (!t.repetivel && (iguais.length || ficha?.talentos?.includes(t.nome)))
    erros.push("Este talento já foi adquirido e não é repetível.");
  return erros;
}
export function validarEscolhasTalento(
  t: Talento2024,
  escolhas: EscolhasTalento,
  ficha: Ficha | null | undefined,
  nivel: number,
  titulo?: string,
): string[] {
  const erros = requisitosTalento(t, ficha, nivel, titulo);
  for (const campo of camposTalento(t, escolhas, proficiencia2024(ficha))) {
    const valores = escolhas[campo.chave] || [];
    if (
      valores.length !== campo.quantidade ||
      new Set(valores).size !== valores.length ||
      valores.some((v) => !campo.opcoes.includes(v))
    )
      erros.push(`Complete ${campo.rotulo} (${campo.quantidade}).`);
  }
  const nome = t.nomeExibicao;
  const aumentos = [
    ...(escolhas.atributo || []),
    ...(escolhas.atributo2 || []),
  ];
  const limite = t.categoria === "Dádiva Épica" ? 30 : 20;
  for (const atributo of new Set(aumentos))
    if (
      valorAtributoSemTalento(ficha, atributo, titulo) +
        aumentos.filter((a) => a === atributo).length >
      limite
    )
      erros.push(`O aumento de ${atributo} excede ${limite}.`);
  if (
    nome === "Resiliente" &&
    escolhas.atributo?.some((a) => temSalvaguarda(ficha, a, titulo))
  )
    erros.push("Escolha uma salvaguarda sem proficiência.");
  const profs = proficienciasDaFicha(ficha, titulo);
  if (
    nome === "Especialista em Perícia" &&
    escolhas.pericia?.some((p) => possui(profs, p))
  )
    erros.push("Escolha uma nova proficiência em perícia.");
  for (const p of escolhas.especializacao || []) {
    if (
      !possui([...profs, ...(escolhas.pericia || [])], p) &&
      nome !== "Dádiva da Proficiência em Perícia"
    )
      erros.push("Especialização requer proficiência na perícia.");
    if (temEspecializacao(ficha, p, titulo))
      erros.push("A perícia já possui Especialização.");
  }
  if (
    ["Analítico", "Mente Aguçada"].includes(nome) &&
    escolhas.pericia?.some((p) => temEspecializacao(ficha, p, titulo))
  )
    erros.push("A perícia já possui Especialização.");
  const repeticoes = ativos(ficha, titulo).filter((e) => e.talento === t.nome);
  const chave =
    nome === "Iniciado em Magia"
      ? "lista"
      : nome === "Adepto Elemental"
        ? "elemento"
        : undefined;
  if (
    chave &&
    repeticoes.some(
      (e) => e.escolhasTalento?.[chave]?.[0] === escolhas[chave]?.[0],
    )
  )
    erros.push(`Escolha ${chave} diferente das aquisições anteriores.`);
  const armaElegivel = (nomeArma: string) =>
    armas.some(
      (arma) =>
        arma.nome === nomeArma &&
        (possui(profs, arma.nome) || possui(profs, arma.categoria)),
    );
  if (
    nome === "Mestre das Armas" &&
    escolhas.maestria?.some((a) => !armaElegivel(a))
  )
    erros.push("A maestria exige proficiência com a arma.");
  return [...new Set(erros)];
}

export function criarConcessoesTalento(
  registro: Efeitos,
  ficha: Ficha,
): Efeitos[] {
  const t = talento2024(registro.talento);
  if (!t) return [];
  const escolhas = registro.escolhasTalento || {};
  const saida: Efeitos[] = [];
  const add = (tipo: string, bonus = 0) => {
    const e = new Efeitos();
    e.tituloEfeito = `${registro.tituloEfeito}:concessao:${saida.length}`;
    e.origemTipo = "talento2024";
    e.origemId = registro.tituloEfeito;
    e.level = registro.level;
    e.tipoEfeito = tipo;
    e.bonus = bonus;
    saida.push(e);
    return e;
  };
  for (const a of [
    ...(escolhas.atributo || []),
    ...(escolhas.atributo2 || []),
  ]) {
    const e = add("atributo", 1);
    e.atributo = a;
    e.limiteAtributo = t.categoria === "Dádiva Épica" ? 30 : 20;
  }
  const profs = [
    ...(escolhas.proficiencias || []),
    ...(escolhas.pericia || []),
  ];
  const fixas: Record<string, string[]> = {
    Chef: ["Utensílios de Cozinheiro"],
    Envenenador: ["Kit de Veneno"],
    "Especialista em Armaduras Leves": ["armadura leve", "escudos"],
    "Especialista em Armaduras Médias": ["armadura media"],
    "Especialista em Armaduras Pesadas": ["armadura pesada"],
    "Treinamento com Armas Marciais": ["Armas Marciais"],
    "Valentão de Taverna": ["armas improvisadas"],
    "Dádiva da Proficiência em Perícia": pericias2024,
  };
  profs.push(...(fixas[t.nomeExibicao] || []));
  if (profs.length)
    add("proficiencia").proeficienciasClasse = [...new Set(profs)];
  const especializacoes = [...(escolhas.especializacao || [])];
  if (["Analítico", "Mente Aguçada"].includes(t.nomeExibicao))
    especializacoes.push(
      ...(escolhas.pericia || []).filter((p) =>
        possui(proficienciasDaFicha(ficha, registro.tituloEfeito), p),
      ),
    );
  especializacoes.forEach((p) => {
    add("especializacao").pericia = p;
  });
  if (t.nomeExibicao === "Resiliente")
    add("salvaguarda").atributo = escolhas.atributo?.[0] || "";
  if (t.nomeExibicao === "Alerta") add("iniciativa_proficiencia");
  if (t.nomeExibicao === "Vigoroso") add("vida_por_nivel", 2);
  if (t.nomeExibicao === "Dádiva da Fortitude") add("vida", 40);
  if (t.nomeExibicao === "Velocista") add("deslocamento", 10);
  if (t.nomeExibicao === "Dádiva da Velocidade") add("deslocamento", 30);
  if (t.nomeExibicao === "Defensivo") add("defensivo", 1);
  if (t.nomeExibicao === "Mestre em Armaduras Médias")
    add("limite_destreza_armadura", 3);
  for (const r of escolhas.resistencia || []) add("resistencia").arma = r;
  if (escolhas.maestria?.[0]) add("maestria").arma = escolhas.maestria[0];
  return saida;
}

export function magiasConcedidas(ficha: Ficha | null | undefined) {
  return ativos(ficha)
    .filter((e) => talento2024(e.talento))
    .flatMap((e) => {
      const nome = talento2024(e.talento)!.nomeExibicao;
      const escolhas = e.escolhasTalento || {};
      const fixas: Record<string, string[]> = {
        Telecinético: ["Mãos Mágicas"],
        Telepático: ["Detectar Pensamentos"],
        "Tocado Pelas Sombras": ["Invisibilidade"],
        "Tocado Por Fadas": ["Passo Nebuloso"],
      };
      const refs = [
        ...(escolhas.truques || []),
        ...(escolhas.magias || []),
        ...(fixas[nome] || []).map((n) => "2024: " + n),
      ];
      return refs
        .map((ref) => ({
          origem: e.tituloEfeito,
          talento: e.talento,
          magia: Magias2024.find((m) => m.nome === ref)!,
          atributo: escolhas.conjuracao?.[0] || escolhas.atributo?.[0],
          chaveUso: nome === "Conjurador Ritualista" ? "ritualRapido" : ref,
          usosSemEspaco: [
            "Iniciado em Magia",
            "Telepático",
            "Tocado Pelas Sombras",
            "Tocado Por Fadas",
            "Conjurador Ritualista",
          ].includes(nome)
            ? 1
            : 0,
        }))
        .filter((r) => r.magia);
    });
}
export const bonusVidaTalentos = (ficha: Ficha | null | undefined) =>
  ativos(ficha).reduce(
    (sum, e) =>
      sum +
      (e.tipoEfeito === "vida"
        ? e.bonus
        : e.tipoEfeito === "vida_por_nivel"
          ? e.bonus * (ficha?.levelTotal || 1)
          : 0),
    0,
  );
export const bonusDeslocamentoTalentos = (ficha: Ficha | null | undefined) =>
  ativos(ficha)
    .filter((e) => e.tipoEfeito === "deslocamento")
    .reduce((sum, e) => sum + e.bonus, 0);
export const bonusIniciativaTalentos = (ficha: Ficha | null | undefined) =>
  ativos(ficha).some((e) => e.tipoEfeito === "iniciativa_proficiencia")
    ? proficiencia2024(ficha)
    : 0;
export const limiteDestrezaArmaduraMedia = (ficha: Ficha | null | undefined) =>
  ativos(ficha).some((e) => e.tipoEfeito === "limite_destreza_armadura")
    ? 3
    : 2;

export function usarMagiaTalento(
  ficha: Ficha,
  origem: string,
  magia: string,
): boolean {
  const registro = magiasConcedidas(ficha).find(
    (r) => r.origem === origem && r.magia.nome === magia,
  );
  const efeito = ficha.efeitos?.find((e) => e.tituloEfeito === origem);
  if (
    !registro ||
    !efeito ||
    !registro.usosSemEspaco ||
    registro.magia.nivel === 0
  )
    return false;
  const usados = efeito.usosMagiaTalento?.[registro.chaveUso] || 0;
  if (usados >= registro.usosSemEspaco) return false;
  efeito.usosMagiaTalento = {
    ...efeito.usosMagiaTalento,
    [registro.chaveUso]: usados + 1,
  };
  return true;
}
export function restaurarMagiasTalento(ficha: Ficha) {
  ficha.efeitos
    ?.filter((e) => talento2024(e.talento))
    .forEach((e) => {
      e.usosMagiaTalento = {};
    });
}
