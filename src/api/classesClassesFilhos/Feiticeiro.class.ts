import { Classes } from "../classesPrincipais/Classes.class.ts";
import { SubClasses } from "../classesPrincipais/SubClasses.ts";
import { AdeptoDasSombras, AlmaFavorecida, FeiticeiroDaTempestade, LinhagemDraconica, MagiaSelvagem } from "../classesPrincipais/SubClassesExport.ts";

export class Feiticeiro extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    pontosFeiticaria: number;
    caracteristicas: string[];
    truquesConhecidos: number;
    magiasConhecidas: number;
    espacosMagia: number[];
  }[];
  subClasse: SubClasses[];

  constructor() {
    super(
      "Feiticeiro",
      6,
      [""],
      ["Adaga", "dardo", "funda", "cajado", "besta leve"],
      [""],
      ["Constituição", "Carisma"],
      2,
      ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
      []
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
    this.subClasse = [new LinhagemDraconica(), new MagiaSelvagem(), new AlmaFavorecida(), new AdeptoDasSombras(), new FeiticeiroDaTempestade()];
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O feiticeiro já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, pontosFeiticaria: 0, caracteristicas: ["Conjuração de Feiticeiro", "Origem de Feitiçaria"], truquesConhecidos: 4, magiasConhecidas: 2, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 2, proeficiencia: 2, pontosFeiticaria: 2, caracteristicas: ["Fonte de Magia"], truquesConhecidos: 4, magiasConhecidas: 3, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 3, proeficiencia: 2, pontosFeiticaria: 3, caracteristicas: ["Metamágica"], truquesConhecidos: 4, magiasConhecidas: 4, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 4, proeficiencia: 2, pontosFeiticaria: 4, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 5, magiasConhecidas: 5, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 5, proeficiencia: 3, pontosFeiticaria: 5, caracteristicas: [], truquesConhecidos: 5, magiasConhecidas: 6, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
      { nivel: 6, proeficiencia: 3, pontosFeiticaria: 6, caracteristicas: ["Característica de Origem de Feitiçaria"], truquesConhecidos: 5, magiasConhecidas: 7, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
      { nivel: 7, proeficiencia: 3, pontosFeiticaria: 7, caracteristicas: [], truquesConhecidos: 5, magiasConhecidas: 8, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
      { nivel: 8, proeficiencia: 3, pontosFeiticaria: 8, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 5, magiasConhecidas: 9, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { nivel: 9, proeficiencia: 4, pontosFeiticaria: 9, caracteristicas: [], truquesConhecidos: 5, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
      { nivel: 10, proeficiencia: 4, pontosFeiticaria: 10, caracteristicas: ["Metamágica"], truquesConhecidos: 6, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
      { nivel: 11, proeficiencia: 4, pontosFeiticaria: 11, caracteristicas: [], truquesConhecidos: 6, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 12, proeficiencia: 4, pontosFeiticaria: 12, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 6, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 13, proeficiencia: 5, pontosFeiticaria: 13, caracteristicas: [], truquesConhecidos: 6, magiasConhecidas: 13, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 14, proeficiencia: 5, pontosFeiticaria: 14, caracteristicas: ["Característica de Origem de Feitiçaria"], truquesConhecidos: 6, magiasConhecidas: 13, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 15, proeficiencia: 5, pontosFeiticaria: 15, caracteristicas: [], truquesConhecidos: 6, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 16, proeficiencia: 5, pontosFeiticaria: 16, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 6, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 17, proeficiencia: 6, pontosFeiticaria: 17, caracteristicas: ["Metamágica"], truquesConhecidos: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
      { nivel: 18, proeficiencia: 6, pontosFeiticaria: 18, caracteristicas: ["Característica de Origem de Feitiçaria"], truquesConhecidos: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
      { nivel: 19, proeficiencia: 6, pontosFeiticaria: 19, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
      { nivel: 20, proeficiencia: 6, pontosFeiticaria: 20, caracteristicas: ["Restauração Mística"], truquesConhecidos: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
    ];
  }
}