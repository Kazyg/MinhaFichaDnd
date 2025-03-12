import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Druida extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    caracteristicas: string[];
    truquesConhecidos: number;
    espacosMagia: number[];
  }[];

  constructor() {
    super(
      "Druida",
      8,
      ["Armadura leve", "armadura média", "escudos"],
      ["Clava", "punhal", "dardo", "dardo", "maça", "cajado", "cimitarra", "foice", "funda", "lança"],
      ["Kit de Herbalismo"],
      ["Inteligência", "Sabedoria"],
      2,
      ["Arcana", "Manejo de Animais", "Insight", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O druida já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, caracteristicas: ["Druídico", "Conjuração"], truquesConhecidos: 2, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 2, proeficiencia: 2, caracteristicas: ["Círculo Druídico", "Forma Selvagem"], truquesConhecidos: 2, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 3, proeficiencia: 2, caracteristicas: [], truquesConhecidos: 2, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 4, proeficiencia: 2, caracteristicas: ["Aprimoramento de Forma Selvagem", "Incremento no Valor de Habilidade"], truquesConhecidos: 3, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 5, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 3, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
      { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Círculo Druídico"], truquesConhecidos: 3, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
      { nivel: 7, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 3, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
      { nivel: 8, proeficiencia: 3, caracteristicas: ["Aprimoramento de Forma Selvagem", "Incremento no Valor de Habilidade"], truquesConhecidos: 3, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { nivel: 9, proeficiencia: 4, caracteristicas: [], truquesConhecidos: 3, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
      { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Círculo Druídico"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
      { nivel: 11, proeficiencia: 4, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 13, proeficiencia: 5, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Círculo Druídico"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 15, proeficiencia: 5, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 17, proeficiencia: 6, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
      { nivel: 18, proeficiencia: 6, caracteristicas: ["Corpo Atemporal", "Magias da Besta"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
      { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
      { nivel: 20, proeficiencia: 6, caracteristicas: ["Arquidruida"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
    ];
  }
}