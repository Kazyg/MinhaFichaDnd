import React from "react";
import { render, screen } from "@testing-library/react";
import DescricaoCaracteristica from "./DescricaoCaracteristica";

test("resume a conjuração 2014 e preserva o texto completo", () => {
  render(<DescricaoCaracteristica nome="Conjuração de Mago" versao="DND_2014" descricao="Texto original completo" />);
  expect(screen.getByText(/comece com 6 magias/)).toBeTruthy();
  expect(screen.getByText(/mínimo 1/)).toBeTruthy();
  expect(screen.getByText("Texto original completo")).toBeInTheDocument();
});

test("não aplica o resumo 2014 ao conteúdo 2024", () => {
  render(<DescricaoCaracteristica nome="Conjuração de Mago" versao="DND_2024" descricao="Regra específica de 2024" />);
  expect(screen.getByText("Regra específica de 2024")).toBeTruthy();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("remove a introdução da visão no escuro preservando alcance e cores", () => {
  render(<DescricaoCaracteristica nome="Visão no Escuro" descricao="Graças ao seu sangue élfico. Você enxerga na penumbra a até 18 metros como luz plena; no escuro, como penumbra, apenas tons de cinza." />);
  expect(screen.getByRole("listitem").textContent).toBe("Você enxerga na penumbra a até 18 metros como luz plena; no escuro, como penumbra, apenas tons de cinza.");
});

test("resume características longas de qualquer nome e mantém todas as regras acessíveis", () => {
  const descricao = "Você pode usar uma ação bônus. O efeito dura 1 minuto. Você recebe resistência a fogo. Só recupera o uso após um descanso longo. " + "Descrição adicional. ".repeat(25);
  render(<DescricaoCaracteristica nome="Característica de outra classe" versao="DND_2024" descricao={descricao} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByText(descricao.trim())).toBeInTheDocument();
  expect(screen.getByText("Descrição completa e demais regras")).toBeTruthy();
});
