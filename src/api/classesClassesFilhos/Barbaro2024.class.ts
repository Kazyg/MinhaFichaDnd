import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { TrilhaDaArvoreDoMundo } from "../classesClassesNetos/TrilhaDaArvoreDoMundo";
import { TrilhaDoBerserker2024 } from "../classesClassesNetos/TrilhaDoBerserker2024";
import { TrilhaDoCoracaoSelvagem } from "../classesClassesNetos/TrilhaDoCoracaoSelvagem";
import { TrilhaDoFanatico2024 } from "../classesClassesNetos/TrilhaDoFanatico2024";

export class Barbaro2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        furias: number;
        danoFuria: number;
        maestriaArma: number;
    }[];
    subClasse: SubClasses[];

    constructor() {
        super("barbaro", 12, ["Armadura leve", "armadura média", "escudos"], ["Armas simples", "armas marciais"], [], ["Força", "Constituição"], 2,
            ["Atletismo", "Adestrar Animais", "Intimidação", "Natureza", "Percepção", "Sobrevivência"], ["Escudos", "armas marciais"]);
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Defesa sem Armadura", "Fúria", "Maestria em Arma"], furias: 2, danoFuria: 2, maestriaArma: 2 },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Ataque Imprudente", "Sentido de Perigo"], furias: 2, danoFuria: 2, maestriaArma: 2 },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Conhecimento Primordial", "Subclasse Bárbaro"], furias: 3, danoFuria: 2, maestriaArma: 2 },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], furias: 3, danoFuria: 2, maestriaArma: 3 },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Ataque Extra", "Movimento Rápido"], furias: 3, danoFuria: 2, maestriaArma: 3 },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], furias: 4, danoFuria: 2, maestriaArma: 3 },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Bote Instintivo", "Instintos Primitivos"], furias: 4, danoFuria: 2, maestriaArma: 3 },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], furias: 4, danoFuria: 2, maestriaArma: 3 },
            { nivel: 9, proeficiencia: 4, caracteristicas: ["Golpe Brutal"], furias: 4, danoFuria: 3, maestriaArma: 3 },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Subclasse"], furias: 4, danoFuria: 3, maestriaArma: 4 },
            { nivel: 11, proeficiencia: 4, caracteristicas: ["Fúria Implacável"], furias: 4, danoFuria: 3, maestriaArma: 4 },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], furias: 5, danoFuria: 3, maestriaArma: 4 },
            { nivel: 13, proeficiencia: 5, caracteristicas: ["Golpe Brutal Fortalecido"], furias: 5, danoFuria: 3, maestriaArma: 4 },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], furias: 5, danoFuria: 3, maestriaArma: 4 },
            { nivel: 15, proeficiencia: 5, caracteristicas: ["Fúria Persistente"], furias: 5, danoFuria: 3, maestriaArma: 4 },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], furias: 5, danoFuria: 4, maestriaArma: 4 },
            { nivel: 17, proeficiencia: 6, caracteristicas: ["Golpe Brutal Fortalecido"], furias: 6, danoFuria: 4, maestriaArma: 4 },
            { nivel: 18, proeficiencia: 6, caracteristicas: ["Força Indomável"], furias: 6, danoFuria: 4, maestriaArma: 4 },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], furias: 6, danoFuria: 4, maestriaArma: 4 },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Campeão Primitivo"], furias: 6, danoFuria: 4, maestriaArma: 4 }
        ];
        this.subClasse = [
            new TrilhaDaArvoreDoMundo(),
            new TrilhaDoBerserker2024(),
            new TrilhaDoCoracaoSelvagem(),
            new TrilhaDoFanatico2024()
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
