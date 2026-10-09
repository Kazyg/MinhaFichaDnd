import { Ficha } from "./FichaPersonagem";
import { Atributos } from "../classesPrincipais/Atributos.class";
import { Efeitos } from "../classesPrincipais/Efeitos";
import { Mago } from "../classesClassesFilhos/Mago.class";
import {
  validarEscolhasTalento,
  requisitosTalento,
  talento2024,
  magiasConcedidas,
  temPericia,
  temEspecializacao,
  temSalvaguarda,
  bonusVidaTalentos,
  bonusIniciativaTalentos,
  usarMagiaTalento,
  restaurarMagiasTalento,
} from "./talentos2024Utils";
import { calcularValorAtributoFinal } from "./fichaEfeitosUtils";

const fichaBase = () =>
  new Ficha({
    levelTotal: 4,
    atributosPersonagem: new Atributos(14, 14, 14, 14, 14, 14),
    classePrincipal: new Mago(),
  });
const talento = (nome: string) => talento2024(`2024: ${nome}`)!;
function adquirir(
  ficha: Ficha,
  nome: string,
  escolhas: Record<string, string[]>,
  titulo = "teste",
  nivel = 4,
) {
  const registro = new Efeitos();
  registro.talento = `2024: ${nome}`;
  registro.escolhasTalento = escolhas;
  registro.tituloEfeito = titulo;
  registro.level = nivel;
  ficha.setEfeitos(registro);
  return registro;
}

test("level, ability, spellcasting, armor and fighting-style prerequisites", () => {
  const ficha = fichaBase();
  expect(requisitosTalento(talento("Ator"), ficha, 1)).not.toEqual([]);
  ficha.atributosPersonagem!.carisma.valor = 12;
  expect(requisitosTalento(talento("Ator"), ficha, 4)).not.toEqual([]);
  expect(requisitosTalento(talento("Agressor"), ficha, 4)).toEqual([]);
  expect(requisitosTalento(talento("Conjurador Bélico"), ficha, 4)).toEqual([]);
  ficha.classePrincipal = null;
  expect(requisitosTalento(talento("Conjurador Bélico"), ficha, 4)).not.toEqual(
    [],
  );
  expect(requisitosTalento(talento("Arquearia"), ficha, 4)).not.toEqual([]);
  expect(
    requisitosTalento(talento("Especialista em Armaduras Pesadas"), ficha, 4),
  ).not.toEqual([]);
  adquirir(ficha, "Especialista em Armaduras Médias", { atributo: ["forca"] });
  expect(
    requisitosTalento(talento("Especialista em Armaduras Pesadas"), ficha, 4),
  ).toEqual([]);
});

test("magic initiate requires distinct cantrips and a first-level spell from its chosen list", () => {
  const ficha = fichaBase();
  const escolhas = {
    lista: ["Mago"],
    conjuracao: ["carisma"],
    truques: ["2024: Luz", "2024: Mãos Mágicas"],
    magias: ["2024: Alarme"],
  };
  expect(
    validarEscolhasTalento(talento("Iniciado em Magia"), escolhas, ficha, 1),
  ).toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Iniciado em Magia"),
      { ...escolhas, truques: ["2024: Luz", "2024: Luz"] },
      ficha,
      1,
    ),
  ).not.toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Iniciado em Magia"),
      { ...escolhas, magias: ["2024: Curar Ferimentos"] },
      ficha,
      1,
    ),
  ).not.toEqual([]);
});

test("repetition restrictions and editing an existing acquisition", () => {
  const ficha = fichaBase();
  adquirir(
    ficha,
    "Adepto Elemental",
    { atributo: ["inteligencia"], elemento: ["Ígneo"] },
    "primeiro",
  );
  expect(
    validarEscolhasTalento(
      talento("Adepto Elemental"),
      { atributo: ["inteligencia"], elemento: ["Ígneo"] },
      ficha,
      4,
    ),
  ).not.toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Adepto Elemental"),
      { atributo: ["inteligencia"], elemento: ["Gélido"] },
      ficha,
      4,
    ),
  ).toEqual([]);
  adquirir(ficha, "Ator", { atributo: ["carisma"] }, "ator");
  expect(requisitosTalento(talento("Ator"), ficha, 4)).not.toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Ator"),
      { atributo: ["carisma"] },
      ficha,
      4,
      "ator",
    ),
  ).toEqual([]);
});

test("ability grants, caps and replacement do not accumulate bonuses", () => {
  const ficha = fichaBase();
  adquirir(ficha, "Atleta", { atributo: ["destreza"] });
  expect(calcularValorAtributoFinal(ficha, "destreza")).toBe(15);
  ficha.excluirEfeitoPorTitulo("teste");
  expect(calcularValorAtributoFinal(ficha, "destreza")).toBe(14);
  adquirir(ficha, "Atleta", { atributo: ["forca"] });
  expect(calcularValorAtributoFinal(ficha, "forca")).toBe(15);
  ficha.atributosPersonagem!.forca.valor = 20;
  expect(calcularValorAtributoFinal(ficha, "forca")).toBe(20);
  expect(
    validarEscolhasTalento(
      talento("Atleta"),
      { atributo: ["forca"] },
      ficha,
      4,
      "teste",
    ),
  ).not.toEqual([]);
});

test("ability improvement supports two points on one ability; epic boons cap at thirty", () => {
  const ficha = fichaBase();
  const escolhas = { atributo: ["destreza"], atributo2: ["destreza"] };
  expect(
    validarEscolhasTalento(
      talento("Aumento no Valor de Atributo"),
      escolhas,
      ficha,
      4,
    ),
  ).toEqual([]);
  adquirir(ficha, "Aumento no Valor de Atributo", escolhas);
  expect(calcularValorAtributoFinal(ficha, "destreza")).toBe(16);
  ficha.levelTotal = 19;
  ficha.atributosPersonagem!.forca.valor = 29;
  adquirir(ficha, "Dádiva da Fortitude", { atributo: ["forca"] }, "epico", 19);
  expect(calcularValorAtributoFinal(ficha, "forca")).toBe(30);
  expect(bonusVidaTalentos(ficha)).toBe(40);
});

test("skills, expertise, tools and saving throws are owned by the feat", () => {
  const ficha = fichaBase();
  ficha.pericias = ["Percepção"];
  adquirir(ficha, "Analítico", {
    atributo: ["sabedoria"],
    pericia: ["Percepção"],
  });
  expect(temEspecializacao(ficha, "Percepção")).toBe(true);
  ficha.excluirEfeitoPorTitulo("teste");
  expect(temPericia(ficha, "Percepção")).toBe(true);
  expect(temEspecializacao(ficha, "Percepção")).toBe(false);
  adquirir(ficha, "Habilidoso", {
    proficiencias: ["Atletismo", "Furtividade", "Kit de Veneno"],
  });
  expect(temPericia(ficha, "Atletismo")).toBe(true);
  ficha.excluirEfeitoPorTitulo("teste");
  expect(temPericia(ficha, "Atletismo")).toBe(false);
  adquirir(ficha, "Resiliente", { atributo: ["destreza"] });
  expect(temSalvaguarda(ficha, "Destreza")).toBe(true);
});

test("ritual and school-limited spells reject invalid choices", () => {
  const ficha = fichaBase();
  expect(
    validarEscolhasTalento(
      talento("Conjurador Ritualista"),
      {
        atributo: ["inteligencia"],
        magias: ["2024: Alarme", "2024: Detectar Magia"],
      },
      ficha,
      4,
    ),
  ).toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Conjurador Ritualista"),
      {
        atributo: ["inteligencia"],
        magias: ["2024: Alarme", "2024: Bola de Fogo"],
      },
      ficha,
      4,
    ),
  ).not.toEqual([]);
  expect(
    validarEscolhasTalento(
      talento("Tocado Por Fadas"),
      { atributo: ["sabedoria"], magias: ["2024: Curar Ferimentos"] },
      ficha,
      4,
    ),
  ).not.toEqual([]);
});

test("granted spells, independent free uses and choices survive JSON round-trip", () => {
  let ficha = fichaBase();
  adquirir(ficha, "Tocado Por Fadas", {
    atributo: ["carisma"],
    magias: ["2024: Enfeitiçar Pessoa"],
  });
  ficha.setMagiaEscolhidas({ classe: "Mago", magia: "Bola de Fogo" });
  expect(magiasConcedidas(ficha).map((r) => r.magia.nome)).toEqual([
    "2024: Enfeitiçar Pessoa",
    "2024: Passo Nebuloso",
  ]);
  expect(usarMagiaTalento(ficha, "teste", "2024: Passo Nebuloso")).toBe(true);
  ficha = new Ficha(JSON.parse(JSON.stringify(ficha)));
  expect(usarMagiaTalento(ficha, "teste", "2024: Passo Nebuloso")).toBe(false);
  expect(usarMagiaTalento(ficha, "teste", "2024: Enfeitiçar Pessoa")).toBe(
    true,
  );
  restaurarMagiasTalento(ficha);
  expect(usarMagiaTalento(ficha, "teste", "2024: Passo Nebuloso")).toBe(true);
  ficha.excluirEfeitoPorTitulo("teste");
  expect(magiasConcedidas(ficha)).toEqual([]);
  expect(ficha.magiasEscolhidas).toEqual([
    { classe: "Mago", magia: ["Bola de Fogo"] },
  ]);
});

test("level-dependent grants change dynamically and inactive talents grant nothing", () => {
  const ficha = fichaBase();
  adquirir(ficha, "Vigoroso", {}, "vida", 1);
  adquirir(ficha, "Alerta", {}, "alerta", 1);
  expect(bonusVidaTalentos(ficha)).toBe(8);
  expect(bonusIniciativaTalentos(ficha)).toBe(2);
  ficha.levelTotal = 5;
  expect(bonusVidaTalentos(ficha)).toBe(10);
  expect(bonusIniciativaTalentos(ficha)).toBe(3);
  adquirir(ficha, "Telepático", { atributo: ["sabedoria"] }, "futuro", 8);
  expect(magiasConcedidas(ficha)).toEqual([]);
});

test("rapid ritual shares one free use across all granted rituals", () => {
  const ficha = fichaBase();
  adquirir(ficha, "Conjurador Ritualista", {
    atributo: ["inteligencia"],
    magias: ["2024: Alarme", "2024: Detectar Magia"],
  });
  expect(usarMagiaTalento(ficha, "teste", "2024: Alarme")).toBe(true);
  expect(usarMagiaTalento(ficha, "teste", "2024: Detectar Magia")).toBe(false);
  restaurarMagiasTalento(ficha);
  expect(usarMagiaTalento(ficha, "teste", "2024: Detectar Magia")).toBe(true);
});

test("a later ability increase cannot meet an earlier feat prerequisite", () => {
  const ficha = fichaBase();
  ficha.levelTotal = 8;
  ficha.atributosPersonagem!.carisma.valor = 12;
  adquirir(
    ficha,
    "Aumento no Valor de Atributo",
    { atributo: ["carisma"], atributo2: ["carisma"] },
    "futuro",
    8,
  );
  expect(requisitosTalento(talento("Ator"), ficha, 4)).not.toEqual([]);
  expect(requisitosTalento(talento("Ator"), ficha, 8)).toEqual([]);
});
