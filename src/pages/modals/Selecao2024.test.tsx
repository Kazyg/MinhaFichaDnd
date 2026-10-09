import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalSelecaoTalento from "./ModalSelecaoTalento";
import ModalMagias from "./ModalMagias";
import { Ficha } from "../../api/fichaPersonagem/FichaPersonagem";
import { Atributos } from "../../api/classesPrincipais/Atributos.class";
import { Mago } from "../../api/classesClassesFilhos/Mago.class";
import { Talentos } from "../../bibliotecas/Talentos";
import { Magias2024 } from "../../bibliotecas/Catalogo2024";

const mockFicha = new Ficha({
  levelTotal: 4,
  atributosPersonagem: new Atributos(14, 14, 14, 14, 14, 14),
  classePrincipal: new Mago(),
});
jest.mock("../../api/fichaPersonagem/FichaContext", () => ({
  useFicha: () => ({ ficha: mockFicha, refreshKey: 0, forceUpdate: jest.fn() }),
}));

test("talent UI requires choices and passes them to the selection callback", () => {
  const onSelect = jest.fn();
  render(
    <ModalSelecaoTalento
      opcoes={Talentos}
      titulo="Talentos"
      onClose={() => {}}
      onSelect={onSelect}
      talentoInicial={null}
      nivel={4}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Adepto Elemental" }));
  const confirmar = screen.getByRole("button", {
    name: "Escolher Adepto Elemental",
  });
  expect(confirmar).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Atributo aumentado 1"), {
    target: { value: "inteligencia" },
  });
  fireEvent.change(screen.getByLabelText("Domínio Elemental 1"), {
    target: { value: "Ígneo" },
  });
  expect(confirmar).toBeEnabled();
  fireEvent.click(confirmar);
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({
      nome: "2024: Adepto Elemental",
      escolhasTalento: { atributo: ["inteligencia"], elemento: ["Ígneo"] },
    }),
  );
});

test("spell search combines edition, accent-insensitive text, class and cantrip filters", () => {
  const onSelect = jest.fn();
  render(
    <ModalMagias
      titulo="Magias"
      onClose={() => {}}
      onSelect={onSelect}
      magiaSelect={null}
    />,
  );
  fireEvent.change(screen.getByPlaceholderText("Filtrar magias..."), {
    target: { value: "Mãos" },
  });
  fireEvent.click(screen.getByAltText("Abrir filtros"));
  fireEvent.change(screen.getByDisplayValue("Selecione uma Classe.."), {
    target: { value: "Magias de Mago" },
  });
  fireEvent.change(screen.getByDisplayValue("Selecione um nivel.."), {
    target: { value: "0" },
  });
  const itens = screen.getAllByRole("listitem");
  expect(itens).toHaveLength(1);
  expect(itens[0]).toHaveTextContent("Mãos Mágicas");
  fireEvent.click(itens[0]);
  fireEvent.click(
    screen.getByRole("button", { name: "Escolher Mãos Mágicas" }),
  );
  expect(onSelect).toHaveBeenCalledWith("2024: Mãos Mágicas");
});

test("editing a legacy spell retains its original edition and reference", () => {
  const onSelect = jest.fn();
  render(
    <ModalMagias
      titulo="Magias"
      onClose={() => {}}
      onSelect={onSelect}
      magiaSelect="Bola de Fogo"
    />,
  );
  expect(screen.getByLabelText("Edição das magias")).toHaveValue("legado");
  fireEvent.click(
    screen.getByRole("button", { name: "Escolher Bola de Fogo" }),
  );
  expect(onSelect).toHaveBeenCalledWith("Bola de Fogo");
});

test("magic initiate class change clears stale spells", () => {
  render(
    <ModalSelecaoTalento
      opcoes={Talentos}
      titulo="Talentos"
      onClose={() => {}}
      onSelect={() => {}}
      talentoInicial={null}
      nivel={1}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Iniciado em Magia" }));
  fireEvent.change(screen.getByLabelText("Lista de magias 1"), {
    target: { value: "Mago" },
  });
  fireEvent.change(screen.getByLabelText("Dois truques 1"), {
    target: { value: "2024: Mãos Mágicas" },
  });
  fireEvent.change(screen.getByLabelText("Lista de magias 1"), {
    target: { value: "Clérigo" },
  });
  expect(screen.getByLabelText("Dois truques 1")).toHaveValue("");
  expect(
    Magias2024.some((m) => m.nivel === 0 && m.classes.includes("Clérigo")),
  ).toBe(true);
});
