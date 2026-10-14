import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { AdagaEspiritual2024 } from "../classesClassesNetos/AdagaEspiritual2024";
import { Assassino2024 } from "../classesClassesNetos/Assassino2024";
import { Ladrao2024 } from "../classesClassesNetos/Ladrao2024";
import { TrapaceiroArcano2024 } from "../classesClassesNetos/TrapaceiroArcano2024";

export class Ladino2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        ataqueFurtivo: string;
        maestriaArma: number;
        caracteristicas: string[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Ladino",
            8,
            ["Armadura leve"],
            ["Armas simples", "armas marciais com propriedade Acuidade ou Leve"],
            ["Ferramentas de ladrão"],
            ["Destreza", "Inteligência"],
            4,
            ["Acrobacia", "Atletismo", "Atuação", "Enganação", "Furtividade", "Intimidação", "Intuição", "Investigação", "Percepção", "Persuasão", "Prestidigitação"],
            ["Armadura leve", "ferramentas de ladrão", "uma perícia de Ladino"]
        );
        this.level = 0;
        this.niveis = this.preencherNiveis();
        this.subClasse = [new AdagaEspiritual2024(), new Assassino2024(), new Ladrao2024(), new TrapaceiroArcano2024()];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        }
    }

    private preencherNiveis() {
        return [
            { nivel: 1, proeficiencia: 2, ataqueFurtivo: "1d6", maestriaArma: 2, caracteristicas: ["Ataque Furtivo", "Especialização", "Gíria dos Ladrões", "Maestria em Arma"] },
            { nivel: 2, proeficiencia: 2, ataqueFurtivo: "1d6", maestriaArma: 2, caracteristicas: ["Ação Ardilosa"] },
            { nivel: 3, proeficiencia: 2, ataqueFurtivo: "2d6", maestriaArma: 2, caracteristicas: ["Mira Firme", "Subclasse de Ladino"] },
            { nivel: 4, proeficiencia: 2, ataqueFurtivo: "2d6", maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 5, proeficiencia: 3, ataqueFurtivo: "3d6", maestriaArma: 3, caracteristicas: ["Esquiva Sobrenatural", "Golpe Astuto"] },
            { nivel: 6, proeficiencia: 3, ataqueFurtivo: "3d6", maestriaArma: 3, caracteristicas: ["Especialização"] },
            { nivel: 7, proeficiencia: 3, ataqueFurtivo: "4d6", maestriaArma: 3, caracteristicas: ["Evasão", "Talento Confiável"] },
            { nivel: 8, proeficiencia: 3, ataqueFurtivo: "4d6", maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 9, proeficiencia: 4, ataqueFurtivo: "5d6", maestriaArma: 3, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 10, proeficiencia: 4, ataqueFurtivo: "5d6", maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 11, proeficiencia: 4, ataqueFurtivo: "6d6", maestriaArma: 4, caracteristicas: ["Golpe Astuto Aprimorado"] },
            { nivel: 12, proeficiencia: 4, ataqueFurtivo: "6d6", maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 13, proeficiencia: 5, ataqueFurtivo: "7d6", maestriaArma: 4, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 14, proeficiencia: 5, ataqueFurtivo: "7d6", maestriaArma: 4, caracteristicas: ["Golpes Sujos"] },
            { nivel: 15, proeficiencia: 5, ataqueFurtivo: "8d6", maestriaArma: 4, caracteristicas: ["Mente Escorregadia"] },
            { nivel: 16, proeficiencia: 5, ataqueFurtivo: "8d6", maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 17, proeficiencia: 6, ataqueFurtivo: "9d6", maestriaArma: 4, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 18, proeficiencia: 6, ataqueFurtivo: "9d6", maestriaArma: 4, caracteristicas: ["Elusivo"] },
            { nivel: 19, proeficiencia: 6, ataqueFurtivo: "10d6", maestriaArma: 4, caracteristicas: ["Dádiva Épica"] },
            { nivel: 20, proeficiencia: 6, ataqueFurtivo: "10d6", maestriaArma: 4, caracteristicas: ["Golpe de Sorte"] }
        ];
    }
}
