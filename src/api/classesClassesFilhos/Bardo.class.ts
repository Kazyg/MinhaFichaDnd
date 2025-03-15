import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Bardo extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    caracteristicas: string[];
    truquesConhecidos: number;
    magiasConhecidas: number;
    espacosMagia: number[];
  }[];

  constructor() {
    super(
      "Bardo",
      8,
      ["Armaduras leves"],
      ["Armas simples", "besta de mão", "espada longa", "espada curta", "florete"],
      ["Instrumento musical", "instrumento musical", "instrumento musical"],
      ["Destreza", "Carisma"],
      3,
      [
        "Acrobacia",
        "Arcanismo",
        "Atletismo",
        "Enganação",
        "Furtividade",
        "História",
        "Intuição",
        "Intimidação",
        "Investigação",
        "Medicina",
        "Natureza",
        "Percepção",
        "Persuasão",
        "Prestidigitação",
        "Religião",
        "Sobrevivência",
    ]
    );
    this.level = 0;
    this.niveis = this.preencherNiveis();
  }

  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O bardo já atingiu o nível máximo (20).");
    }
  }

  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração", "Inspiração de Bardo (d6)"], truquesConhecidos: 2, magiasConhecidas: 4, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 2, proeficiencia: 2, caracteristicas: ["Versatilidade", "Canção do Descanso (d6)"], truquesConhecidos: 2, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 3, proeficiencia: 2, caracteristicas: ["Colégio de Bardo", "Aptidão"], truquesConhecidos: 2, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 4, proeficiencia: 2, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 3, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 5, proeficiencia: 3, caracteristicas: ["Inspiração de Bardo (d8)", "Fonte de Inspiração"], truquesConhecidos: 3, magiasConhecidas: 8, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
      { nivel: 6, proeficiencia: 3, caracteristicas: ["Habilidade de Colégio de Bardo", "Canção de Proteção"], truquesConhecidos: 3, magiasConhecidas: 9, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
      { nivel: 7, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 3, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
      { nivel: 8, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 3, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { nivel: 9, proeficiencia: 4, caracteristicas: ["Canção do Descanso (d8)"], truquesConhecidos: 3, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
      { nivel: 10, proeficiencia: 4, caracteristicas: ["Inspiração de Bardo (d10)", "Aptidão", "Segredos Mágicos"], truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
      { nivel: 11, proeficiencia: 4, caracteristicas: [], truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 13, proeficiencia: 5, caracteristicas: ["Canção do Descanso (d10)"], truquesConhecidos: 4, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 14, proeficiencia: 5, caracteristicas: ["Habilidade de Colégio de Bardo", "Segredos Mágicos"], truquesConhecidos: 4, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 15, proeficiencia: 5, caracteristicas: ["Inspiração de Bardo (d12)"], truquesConhecidos: 4, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 17, proeficiencia: 6, caracteristicas: ["Canção do Descanso (d12)"], truquesConhecidos: 4, magiasConhecidas: 20, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
      { nivel: 18, proeficiencia: 6, caracteristicas: ["Segredos Mágicos"], truquesConhecidos: 4, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
      { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
      { nivel: 20, proeficiencia: 6, caracteristicas: ["Inspiração Superior"], truquesConhecidos: 4, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
    ];
  }
}