import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FichaProvider, useFicha } from "./FichaContext";
import { Ficha } from "./FichaPersonagem";
import { Efeitos } from "../classesPrincipais/Efeitos";

function Editor() {
  const { ficha, forceUpdate } = useFicha();
  if (!ficha) return <p>Carregando</p>;
  return (
    <>
      <p>
        {ficha.efeitos?.find((e) => e.tituloEfeito === "origem")
          ?.escolhasTalento?.lista?.[0] || "Sem talento"}
      </p>
      <button
        onClick={() => {
          const e = new Efeitos();
          e.tituloEfeito = "origem";
          e.level = 1;
          e.talento = "2024: Iniciado em Magia";
          e.escolhasTalento = {
            lista: ["Mago"],
            conjuracao: ["carisma"],
            truques: ["2024: Luz", "2024: Mãos Mágicas"],
            magias: ["2024: Alarme"],
          };
          ficha.setEfeitos(e);
          forceUpdate();
        }}
      >
        Adquirir
      </button>
    </>
  );
}

test("a saved character persists new talent choices after refresh and browser reload", async () => {
  localStorage.clear();
  const ficha = new Ficha({
    id: "persistencia",
    levelTotal: 1,
    talentos: ["ALERTA"],
    magiasEscolhidas: [{ classe: "Mago", magia: ["Bola de Fogo"] }],
  });
  localStorage.setItem("fichas", JSON.stringify([ficha]));
  localStorage.setItem("ficha", ficha.id);
  const view = render(
    <FichaProvider>
      <Editor />
    </FichaProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Adquirir" }));
  await waitFor(() =>
    expect(
      JSON.parse(localStorage.getItem("fichas")!)[0].efeitos[0].escolhasTalento
        .lista,
    ).toEqual(["Mago"]),
  );
  view.unmount();
  render(
    <FichaProvider>
      <Editor />
    </FichaProvider>,
  );
  expect(await screen.findByText("Mago")).toBeInTheDocument();
  const recuperada = JSON.parse(localStorage.getItem("fichas")!)[0];
  expect(recuperada.talentos).toEqual(["ALERTA"]);
  expect(recuperada.magiasEscolhidas).toEqual([
    { classe: "Mago", magia: ["Bola de Fogo"] },
  ]);
  localStorage.clear();
});
