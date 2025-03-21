import { Arquifada } from "../classesEspeciais/Arquifada.class.ts";
import { Corruptor } from "../classesEspeciais/Corruptor.class.ts";
import { GrandeAntigo } from "../classesEspeciais/GrandeAntigo.class.ts";
import { Patronos } from "../classesEspeciais/Patronos.class.ts";
import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Bruxo extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    caracteristicas: string[];
    truquesConhecidos: number;
    magiasConhecidas: number;
    espacosMagia: number;
    nivelMagia: string;
    invocacoesConhecidas: number;
  }[];
  patronos: Patronos[];

  constructor() {
    super(
      "Bruxo",
      8,
      ["Armadura leve"],
      ["Armas simples"],
      [""],
      ["Sabedoria", "Carisma"],
      2,
      [
        "Arcanismo",
        "Enganação",
        "História",
        "Intimidação",
        "Investigação",
        "Natureza",
        "Religião",
    ],
    ["Armadura leve", "armas simples"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
    this.patronos = [new Arquifada(), new Corruptor(), new GrandeAntigo()]
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O bruxo já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, caracteristicas: ["Patrono Transcendental", "Magia de Pacto"], truquesConhecidos: 2, magiasConhecidas: 2, espacosMagia: 1, nivelMagia: "1°", invocacoesConhecidas: 0 },
      { nivel: 2, proeficiencia: 2, caracteristicas: ["Invocações Místicas"], truquesConhecidos: 2, magiasConhecidas: 3, espacosMagia: 2, nivelMagia: "1°", invocacoesConhecidas: 2 },
      { nivel: 3, proeficiencia: 2, caracteristicas: ["Dádiva do Pacto"], truquesConhecidos: 2, magiasConhecidas: 4, espacosMagia: 2, nivelMagia: "2°", invocacoesConhecidas: 2 },
      { nivel: 4, proeficiencia: 2, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 3, magiasConhecidas: 5, espacosMagia: 2, nivelMagia: "2°", invocacoesConhecidas: 3 },
      { nivel: 5, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 3, magiasConhecidas: 6, espacosMagia: 2, nivelMagia: "3°", invocacoesConhecidas: 3 },
      { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Patrono Transcendental"], truquesConhecidos: 3, magiasConhecidas: 7, espacosMagia: 2, nivelMagia: "3°", invocacoesConhecidas: 4 },
      { nivel: 7, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 3, magiasConhecidas: 8, espacosMagia: 2, nivelMagia: "4°", invocacoesConhecidas: 4 },
      { nivel: 8, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 3, magiasConhecidas: 9, espacosMagia: 2, nivelMagia: "4°", invocacoesConhecidas: 4 },
      { nivel: 9, proeficiencia: 4, caracteristicas: [], truquesConhecidos: 3, magiasConhecidas: 10, espacosMagia: 2, nivelMagia: "5°", invocacoesConhecidas: 5 },
      { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Patrono Transcendental"], truquesConhecidos: 4, magiasConhecidas: 10, espacosMagia: 2, nivelMagia: "5°", invocacoesConhecidas: 5 },
      { nivel: 11, proeficiencia: 4, caracteristicas: ["Arcana Mística (6° nível)"], truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 5 },
      { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 6 },
      { nivel: 13, proeficiencia: 5, caracteristicas: ["Arcana Mística (7° nível)"], truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 6 },
      { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Patrono Transcendental"], truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 6 },
      { nivel: 15, proeficiencia: 5, caracteristicas: ["Arcana Mística (8° nível)"], truquesConhecidos: 4, magiasConhecidas: 13, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 7 },
      { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 13, espacosMagia: 3, nivelMagia: "5°", invocacoesConhecidas: 7 },
      { nivel: 17, proeficiencia: 6, caracteristicas: ["Arcana Mística (9° nível)"], truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: 4, nivelMagia: "5°", invocacoesConhecidas: 7 },
      { nivel: 18, proeficiencia: 6, caracteristicas: [], truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: 4, nivelMagia: "5°", invocacoesConhecidas: 8 },
      { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: 4, nivelMagia: "5°", invocacoesConhecidas: 8 },
      { nivel: 20, proeficiencia: 6, caracteristicas: ["Mestre Místico"], truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: 4, nivelMagia: "5°", invocacoesConhecidas: 8 }
    ];
  }
}