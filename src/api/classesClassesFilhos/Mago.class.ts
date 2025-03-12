import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Mago extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    truquesConhecidos: number;
    espacosMagia: number[];
    caracteristicas: string[];
  }[];

  constructor() {
    super(
      "Mago",
      6,
      [""],
      ["Adaga", "dardo", "funda", "cajado", "besta leve"],
      [""],
      ["Inteligência", "Sabedoria"],
      2,
      ["Arcana", "História", "Insight", "Investigação", "Medicina", "Religião"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O mago já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, truquesConhecidos: 3, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Conjuração", "Recuperação Arcana"] },
      { nivel: 2, proeficiencia: 2, truquesConhecidos: 3, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Tradição Arcana"] },
      { nivel: 3, proeficiencia: 2, truquesConhecidos: 3, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0], caracteristicas: [] },
      { nivel: 4, proeficiencia: 2, truquesConhecidos: 4, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 5, proeficiencia: 3, truquesConhecidos: 4, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0], caracteristicas: [] },
      { nivel: 6, proeficiencia: 3, truquesConhecidos: 4, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0], caracteristicas: ["Característica de Tradição Arcana"] },
      { nivel: 7, proeficiencia: 3, truquesConhecidos: 4, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0], caracteristicas: [] },
      { nivel: 8, proeficiencia: 3, truquesConhecidos: 4, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 9, proeficiencia: 4, truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0], caracteristicas: [] },
      { nivel: 10, proeficiencia: 4, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0], caracteristicas: ["Característica de Tradição Arcana"] },
      { nivel: 11, proeficiencia: 4, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0], caracteristicas: [] },
      { nivel: 12, proeficiencia: 4, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0], caracteristicas: [] },
      { nivel: 14, proeficiencia: 5, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0], caracteristicas: ["Característica de Tradição Arcana"] },
      { nivel: 15, proeficiencia: 5, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0], caracteristicas: [] },
      { nivel: 16, proeficiencia: 5, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1], caracteristicas: [] },
      { nivel: 18, proeficiencia: 6, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1], caracteristicas: ["Dominar Magia"] },
      { nivel: 19, proeficiencia: 6, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1], caracteristicas: ["Assinatura Mágica"] }
    ];
  }
}