import { Magias2024, Talentos2024, camposTalento } from "./Catalogo2024";
import { Magias, magiasMago, magiasClerigo, magiasPatrulheiro } from "./Magia";
import { Talentos } from "./Talentos";

test("complete 2024 catalogs with separate legacy references", () => {
  expect(Magias2024).toHaveLength(391);
  expect(Talentos2024).toHaveLength(75);
  expect(new Set(Magias2024.map((m) => m.nome)).size).toBe(391);
  expect(new Set(Talentos2024.map((t) => t.nome)).size).toBe(75);
  expect(Magias.some((m) => m.nome === "Curar Ferimentos")).toBe(true);
  expect(Magias.some((m) => m.nome === "2024: Curar Ferimentos")).toBe(true);
  expect(Talentos.some((t) => t.nome === "ALERTA")).toBe(true);
  expect(Talentos.some((t) => t.nome === "2024: Alerta")).toBe(true);
});

test.each(Magias2024.map((m) => [m.nome, m]))(
  "%s has usable metadata and description",
  (_, m) => {
    expect(m.classes.length).toBeGreaterThan(0);
    expect(
      m.classes.every((c) =>
        [
          "Bardo",
          "Bruxo",
          "Clérigo",
          "Druida",
          "Feiticeiro",
          "Mago",
          "Paladino",
          "Patrulheiro",
        ].includes(c),
      ),
    ).toBe(true);
    expect(m.nivel).toBeGreaterThanOrEqual(0);
    expect(m.nivel).toBeLessThanOrEqual(9);
    expect(m.conjuracao).toBeTruthy();
    expect(m.duracao).toBeTruthy();
    expect(
      m.componentes.componentes.every((c) => ["V", "S", "M"].includes(c)),
    ).toBe(true);
    expect(m.descricao.length).toBeGreaterThan(20);
    expect(m.descricao).not.toMatch(/CAPÍTULO|Tempo de Conjuração:/);
  },
);

test.each(Talentos2024.map((t) => [t.nome, t]))(
  "%s has category, prerequisites and required attribute choices",
  (_, t) => {
    expect(["Origem", "Geral", "Estilo de Luta", "Dádiva Épica"]).toContain(
      t.categoria,
    );
    expect(t.descricao.length).toBeGreaterThan(20);
    if (t.categoria === "Geral") expect(t.preRequisito).toMatch(/Nível 4/);
    if (t.categoria === "Dádiva Épica")
      expect(t.preRequisito).toMatch(/Nível 19/);
    if (t.categoria === "Geral" || t.categoria === "Dádiva Épica")
      expect(camposTalento(t, {}).some((c) => c.chave === "atributo")).toBe(
        true,
      );
  },
);

test("2024 class lists and updated spell rules come from the supplied book", () => {
  expect(magiasMago.some((m) => m.nome === "2024: Bola de Fogo")).toBe(true);
  expect(
    magiasClerigo.some((m) => m.nome === "2024: Acudir os Moribundos"),
  ).toBe(true);
  expect(magiasPatrulheiro.some((m) => m.nome === "2024: Alarme")).toBe(true);
  expect(
    Magias2024.find((m) => m.nomeExibicao === "Curar Ferimentos")?.descricao,
  ).toMatch(/2d8/);
  expect(
    Magias2024.find((m) => m.nomeExibicao === "Palavra Curativa")?.descricao,
  ).toMatch(/2d4/);
  expect(
    Talentos2024.find((t) => t.nomeExibicao === "Alerta")?.descricao,
  ).toMatch(/Bônus de Proficiência/);
});
