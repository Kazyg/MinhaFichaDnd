import { Classes } from "../classesPrincipais/Classes.class.ts";
import { SubClasses } from "../classesPrincipais/SubClasses.ts";
import { Assassino, Ladrao, TrapaceiroArcano } from "../classesPrincipais/SubClassesExport.ts";

export class Rogue extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    ataqueFurtivo: string;
    caracteristicas: string[];
  }[];
  subClasse: SubClasses[];

  constructor() {
    super(
      "Ladino",
      8,
      ["Armaduras leves"],
      ["Armas simples", "besta de mão", "espada curta", "espada longa", "florete", "arco curto"],
      ["Ferramentas de ladrões"],
      ["Destreza", "Inteligência"],
      4,
      ["Acrobacia", "Atletismo", "Atuação", "Enganação", "Furtividade", "Intimidação", "Intuição", "Investigação", "Percepção", "Persuasão", "Prestidigitação"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
    this.subClasse = [new Assassino(), new Ladrao(), new TrapaceiroArcano() ]
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O ladino já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, ataqueFurtivo: "1d6", caracteristicas: ["Ataque Furtivo", "Gíria de Ladrão"] },
      { nivel: 2, proeficiencia: 2, ataqueFurtivo: "1d6", caracteristicas: ["Ação Ardilosa"] },
      { nivel: 3, proeficiencia: 2, ataqueFurtivo: "2d6", caracteristicas: ["Arquétipo de Ladino"] },
      { nivel: 4, proeficiencia: 2, ataqueFurtivo: "2d6", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 5, proeficiencia: 3, ataqueFurtivo: "3d6", caracteristicas: ["Esquiva Sobrenatural"] },
      { nivel: 6, proeficiencia: 3, ataqueFurtivo: "3d6", caracteristicas: ["Especialização"] },
      { nivel: 7, proeficiencia: 3, ataqueFurtivo: "4d6", caracteristicas: [] },
      { nivel: 8, proeficiencia: 3, ataqueFurtivo: "4d6", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 9, proeficiencia: 4, ataqueFurtivo: "5d6", caracteristicas: ["Talento Confiável"] },
      { nivel: 10, proeficiencia: 4, ataqueFurtivo: "5d6", caracteristicas: ["Característica de Arquétipo de Ladino"] },
      { nivel: 11, proeficiencia: 4, ataqueFurtivo: "6d6", caracteristicas: [] },
      { nivel: 12, proeficiencia: 4, ataqueFurtivo: "6d6", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, ataqueFurtivo: "7d6", caracteristicas: ["Evasão"] },
      { nivel: 14, proeficiencia: 5, ataqueFurtivo: "7d6", caracteristicas: ["Sentido Cego"] },
      { nivel: 15, proeficiencia: 5, ataqueFurtivo: "8d6", caracteristicas: ["Característica de Arquétipo de Ladino"] },
      { nivel: 16, proeficiencia: 5, ataqueFurtivo: "8d6", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, ataqueFurtivo: "9d6", caracteristicas: ["Mente Escorregadia"] },
      { nivel: 18, proeficiencia: 6, ataqueFurtivo: "9d6", caracteristicas: ["Elusivo"] },
      { nivel: 19, proeficiencia: 6, ataqueFurtivo: "10d6", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, ataqueFurtivo: "10d6", caracteristicas: ["Golpe de Sorte"] }
    ];
  }
}