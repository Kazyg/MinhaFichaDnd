import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Lutador extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    caracteristicas: string[];
  }[];

  constructor() {
    super(
      "Guerreiro",
      10,
      ["Todas as armaduras", "escudos"],
      ["Armas simples", "armas marciais"],
      [""],
      ["Força", "Constituição"],
      2,
      ["Acrobacia", "Atletismo", "Manejo de Animais", "História", "Intimidação", "Insight", "Percepção", "Sobrevivência"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O lutador já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, caracteristicas: ["Estilo de Luta Guerreiro", "Retomar o Fôlego"] },
      { nivel: 2, proeficiencia: 2, caracteristicas: ["Surto de Ação (um uso)"] },
      { nivel: 3, proeficiencia: 2, caracteristicas: ["Arquétipo Marcial"] },
      { nivel: 4, proeficiencia: 2, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 5, proeficiencia: 3, caracteristicas: ["Ataque Extra Guerreiro"] },
      { nivel: 6, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 7, proeficiencia: 3, caracteristicas: ["Característica de Arquétipo Marcial"] },
      { nivel: 8, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 9, proeficiencia: 4, caracteristicas: ["Indomável (um uso)"] },
      { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Arquétipo Marcial"] },
      { nivel: 11, proeficiencia: 4, caracteristicas: ["Ataque Extra Guerreiro"] },
      { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, caracteristicas: ["Indomável (dois usos)"] },
      { nivel: 14, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 15, proeficiencia: 5, caracteristicas: ["Característica de Arquétipo Marcial"] },
      { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, caracteristicas: ["Surto de Ação (dois usos)", "Indomável (três usos)"] },
      { nivel: 18, proeficiencia: 6, caracteristicas: ["Característica de Arquétipo Marcial"] },
      { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, caracteristicas: ["Ataque Extra Guerreiro"] }
    ];
  }
}