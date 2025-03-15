import { Classes } from "../classesPrincipais/Classes.class.ts"

export class Barbaro extends Classes {
    level: number;
    niveis: {
      nivel: number;
      proeficiencia: number;
      caracteristicas: string[];
      furias: number;
      danoFuria: number;
    }[];
  
    constructor() {
      super("barbaro", 12, ["Armadura leve", "armadura média", "escudos"], ["Armas simples", "armas marciais"], [""], ["Força", "Constituição"], 2, ["Atletismo", "Adestrar Animais", "Intimidação", "Natureza", "Percepção", "Sobrevivência"]);
      this.level = 0;
      this.niveis = [
        { nivel: 1, proeficiencia: 2, caracteristicas: ["Fúria", "Defesa sem Armadura"], furias: 2, danoFuria: 2 },
        { nivel: 2, proeficiencia: 2, caracteristicas: ["Ataque Descuidado", "Sentido de Perigo"], furias: 2, danoFuria: 2 },
        { nivel: 3, proeficiencia: 2, caracteristicas: ["Caminho Primitivo"], furias: 3, danoFuria: 2 },
        { nivel: 4, proeficiencia: 2, caracteristicas: ["Incremento no Valor de Habilidade"], furias: 3, danoFuria: 2 },
        { nivel: 5, proeficiencia: 3, caracteristicas: ["Ataque Extra", "Movimento Rápido"], furias: 3, danoFuria: 2 },
        { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Caminho Primitivo"], furias: 4, danoFuria: 2 },
        { nivel: 7, proeficiencia: 3, caracteristicas: ["Instinto Selvagem"], furias: 4, danoFuria: 2 },
        { nivel: 8, proeficiencia: 3, caracteristicas: ["Incremento no Valor de Habilidade"], furias: 4, danoFuria: 2 },
        { nivel: 9, proeficiencia: 4, caracteristicas: ["Crítico Brutal (+1 dado)"], furias: 4, danoFuria: 3 },
        { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Caminho Primitivo"], furias: 4, danoFuria: 3 },
        { nivel: 11, proeficiencia: 4, caracteristicas: ["Fúria Implacável"], furias: 4, danoFuria: 3 },
        { nivel: 12, proeficiencia: 4, caracteristicas: ["Incremento no Valor de Habilidade"], furias: 5, danoFuria: 3 },
        { nivel: 13, proeficiencia: 5, caracteristicas: ["Crítico Brutal (+2 dados)"], furias: 5, danoFuria: 3 },
        { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Caminho Primitivo"], furias: 5, danoFuria: 3 },
        { nivel: 15, proeficiencia: 5, caracteristicas: ["Fúria Persistente"], furias: 5, danoFuria: 3 },
        { nivel: 16, proeficiencia: 5, caracteristicas: ["Incremento no Valor de Habilidade"], furias: 5, danoFuria: 4 },
        { nivel: 17, proeficiencia: 6, caracteristicas: ["Crítico Brutal (+3 dados)"], furias: 6, danoFuria: 4 },
        { nivel: 18, proeficiencia: 6, caracteristicas: ["Força Indomável"], furias: 6, danoFuria: 4 },
        { nivel: 19, proeficiencia: 6, caracteristicas: ["Incremento no Valor de Habilidade"], furias: 6, danoFuria: 4 },
        { nivel: 20, proeficiencia: 6, caracteristicas: ["Campeão Primitivo"], furias: Infinity, danoFuria: 4 }
      ];
    }
  
    aumentarNivel(): void {
      if (this.level < 20) {
        this.level += 1;
      } else {
        console.log("O bárbaro já atingiu o nível máximo (20).");
      }
    }
}