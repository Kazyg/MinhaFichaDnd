import { Classes } from "../classesPrincipais/Classes.class.ts";
import { SubClasses } from "../classesPrincipais/SubClasses.ts";
import { DominioDaLuz, DominioDoConhecimento, DominioDaVida, DominioDaTempestade, DominioDaEnganacao, DominioDaGuerra, DominioDaNatureza, DominioDaForja, DominioDaSepultura } from "../classesPrincipais/SubClassesExport.ts";

export class Clerigo extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    caracteristicas: string[];
    truquesConhecidos: number;
    espacosMagia: number[];
  }[];
  subClasse: SubClasses[];

  constructor() {
    super(
      "Clerigo",
      8,
      ["Armadura leve", "armadura média", "escudos"],
      ["Armas simples"],
      [""],
      ["Sabedoria", "Carisma"],
      2,
      ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
      ["Armadura leve", "armadura média", "escudos"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
    this.subClasse = [
      new DominioDaLuz(), 
      new DominioDoConhecimento(), 
      new DominioDaVida(), 
      new DominioDaTempestade(), 
      new DominioDaEnganacao(), 
      new DominioDaGuerra(), 
      new DominioDaNatureza(), 
      new DominioDaForja(),
      new DominioDaSepultura()
  ];
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O clérigo já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração de Clérigo", "Domínio Divino"], truquesConhecidos: 3, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 2, proeficiencia: 2, caracteristicas: ["Canalizar Divindade (1/descanso)", "Característica de Domínio Divino"], truquesConhecidos: 3, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 3, proeficiencia: 2, caracteristicas: [], truquesConhecidos: 3, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 4, proeficiencia: 2, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 4, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
      { nivel: 5, proeficiencia: 3, caracteristicas: ["Destruir Mortos-Vivos (ND 1/2)"], truquesConhecidos: 4, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
      { nivel: 6, proeficiencia: 3, caracteristicas: ["Canalizar Divindade (2/descanso)", "Característica de Domínio Divino"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
      { nivel: 7, proeficiencia: 3, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
      { nivel: 8, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade", "Destruir Mortos-Vivos (ND 1)", "Característica de Domínio Divino"], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { nivel: 9, proeficiencia: 4, caracteristicas: [], truquesConhecidos: 4, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
      { nivel: 10, proeficiencia: 4, caracteristicas: ["Intervenção Divina"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
      { nivel: 11, proeficiencia: 4, caracteristicas: ["Destruir Mortos-Vivos (ND 2)"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
      { nivel: 13, proeficiencia: 5, caracteristicas: [], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 14, proeficiencia: 5, caracteristicas: ["Destruir Mortos-Vivos (ND 3)"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
      { nivel: 15, proeficiencia: 5, caracteristicas: [], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
      { nivel: 17, proeficiencia: 6, caracteristicas: ["Destruir Mortos-Vivos (ND 4)", "Característica de Domínio Divino"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
      { nivel: 18, proeficiencia: 6, caracteristicas: ["Canalizar Divindade (3/descanso)"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
      { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
      { nivel: 20, proeficiencia: 6, caracteristicas: ["Aprimoramento de Intervenção Divina"], truquesConhecidos: 5, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
    ];
  }
}