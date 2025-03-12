import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Ranger extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    magiasConhecidas: number;
    espacosMagia: number[];
    caracteristicas: string[];
  }[];

  constructor() {
    super(
      "Patrulheiro",
      10,
      ["Armadura leve", "armadura média", "escudos"],
      ["Armas simples", "armas marciais"],
      [""],
      ["Força", "Destreza"],
      3,
      ["Atletismo", "Furtividade", "Manejo de animais", "Insight", "Investigação", "Natureza", "Percepção", "Sobrevivência"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O patrulheiro já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, magiasConhecidas: 0, espacosMagia: [0, 0, 0, 0, 0], caracteristicas: ["Inimigo Favorito", "Explorador Natural"] },
      { nivel: 2, proeficiencia: 2, magiasConhecidas: 2, espacosMagia: [2, 0, 0, 0, 0], caracteristicas: ["Estilo de Luta Patrulheiro", "Conjuração"] },
      { nivel: 3, proeficiencia: 2, magiasConhecidas: 3, espacosMagia: [3, 0, 0, 0, 0], caracteristicas: ["Conclave de Patrulheiro", "Consciência Primitiva"] },
      { nivel: 4, proeficiencia: 2, magiasConhecidas: 3, espacosMagia: [3, 0, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 5, proeficiencia: 3, magiasConhecidas: 4, espacosMagia: [4, 2, 0, 0, 0], caracteristicas: ["Característica de Conclave de Patrulheiro"] },
      { nivel: 6, proeficiencia: 3, magiasConhecidas: 4, espacosMagia: [4, 2, 0, 0, 0], caracteristicas: ["Inimigo Favorito Maior"] },
      { nivel: 7, proeficiencia: 3, magiasConhecidas: 5, espacosMagia: [4, 3, 0, 0, 0], caracteristicas: ["Característica de Conclave de Patrulheiro"] },
      { nivel: 8, proeficiencia: 3, magiasConhecidas: 5, espacosMagia: [4, 3, 0, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade", "Pés Rápidos"] },
      { nivel: 9, proeficiencia: 4, magiasConhecidas: 6, espacosMagia: [4, 3, 2, 0, 0], caracteristicas: [] },
      { nivel: 10, proeficiencia: 4, magiasConhecidas: 6, espacosMagia: [4, 3, 2, 0, 0], caracteristicas: ["Mimetismo"] },
      { nivel: 11, proeficiencia: 4, magiasConhecidas: 7, espacosMagia: [4, 3, 3, 0, 0], caracteristicas: ["Característica de Conclave de Patrulheiro"] },
      { nivel: 12, proeficiencia: 4, magiasConhecidas: 7, espacosMagia: [4, 3, 3, 0, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, magiasConhecidas: 8, espacosMagia: [4, 3, 3, 1, 0], caracteristicas: [] },
      { nivel: 14, proeficiencia: 5, magiasConhecidas: 8, espacosMagia: [4, 3, 3, 1, 0], caracteristicas: ["Desaparecer"] },
      { nivel: 15, proeficiencia: 5, magiasConhecidas: 9, espacosMagia: [4, 3, 3, 2, 0], caracteristicas: ["Característica de Conclave de Patrulheiro"] },
      { nivel: 16, proeficiencia: 5, magiasConhecidas: 9, espacosMagia: [4, 3, 3, 2, 0], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 3, 1], caracteristicas: [] },
      { nivel: 18, proeficiencia: 6, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 3, 1], caracteristicas: ["Sentidos Selvagens"] },
      { nivel: 19, proeficiencia: 6, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 3, 2], caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 3, 2], caracteristicas: ["Matador de Inimigos"] }
    ];
  }
}