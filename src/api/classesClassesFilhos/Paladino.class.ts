import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Paladino extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    espacosMagia: number[];
    caracteristicas: string[];
  }[];

  constructor() {
    super(
      "Paladino",
      10,
      ["Todas as armaduras", "escudos"],
      ["Armas simples", "armas marciais"],
      [""],
      ["Sabedoria", "Carisma"],
      2,
      ["Atletismo", "Intimidação", "Intuição", "Medicina", "Persuasão", "Religião"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O paladino já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, espacosMagia: [0, 0, 0, 0, 0], caracteristicas: ["Sentido Divino", "Cura pelas Mãos"] },
      { nivel: 2, proeficiencia: 2, espacosMagia: [2, 0, 0, 0, 0], caracteristicas: ["Estilo de Luta Paladino", "Conjuração", "Destruição Divina"] },
      { nivel: 3, proeficiencia: 2, espacosMagia: [3, 0, 0, 0, 0], caracteristicas: ["Saúde Divina", "Juramento Sagrado"] },
      { nivel: 4, proeficiencia: 2, espacosMagia: [3, 0, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 5, proeficiencia: 3, espacosMagia: [4, 2, 0, 0, 0], caracteristicas: ["Ataque Extra"] },
      { nivel: 6, proeficiencia: 3, espacosMagia: [4, 2, 0, 0, 0], caracteristicas: ["Aura de Proteção"] },
      { nivel: 7, proeficiencia: 3, espacosMagia: [4, 3, 0, 0, 0], caracteristicas: ["Característica de Juramento Sagrado"] },
      { nivel: 8, proeficiencia: 3, espacosMagia: [4, 3, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 9, proeficiencia: 4, espacosMagia: [4, 3, 2, 0, 0], caracteristicas: [] },
      { nivel: 10, proeficiencia: 4, espacosMagia: [4, 3, 2, 0, 0], caracteristicas: ["Aura da Coragem"] },
      { nivel: 11, proeficiencia: 4, espacosMagia: [4, 3, 3, 0, 0], caracteristicas: ["Destruição Divina Aprimorada"] },
      { nivel: 12, proeficiencia: 4, espacosMagia: [4, 3, 3, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, espacosMagia: [4, 3, 3, 1, 0], caracteristicas: [] },
      { nivel: 14, proeficiencia: 5, espacosMagia: [4, 3, 3, 1, 0], caracteristicas: ["Toque Purificador"] },
      { nivel: 15, proeficiencia: 5, espacosMagia: [4, 3, 3, 2, 0], caracteristicas: ["Característica de Juramento Sagrado"] },
      { nivel: 16, proeficiencia: 5, espacosMagia: [4, 3, 3, 2, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, espacosMagia: [4, 3, 3, 3, 1], caracteristicas: [] },
      { nivel: 18, proeficiencia: 6, espacosMagia: [4, 3, 3, 3, 1], caracteristicas: ["Aprimoramentos de Aura"] },
      { nivel: 19, proeficiencia: 6, espacosMagia: [4, 3, 3, 3, 2], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, espacosMagia: [4, 3, 3, 3, 2], caracteristicas: ["Característica de Juramento Sagrado"] }
    ];
  }
}