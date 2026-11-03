import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { Abjurador2024 } from "../classesClassesNetos/Abjurador2024";
import { Adivinhador2024 } from "../classesClassesNetos/Adivinhador2024";
import { Evocador2024 } from "../classesClassesNetos/Evocador2024";
import { Ilusionista2024 } from "../classesClassesNetos/Ilusionista2024";

export class Mago2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number[];
        caracteristicas: string[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Mago",
            6,
            [],
            ["Armas simples"],
            [],
            ["Inteligência", "Sabedoria"],
            2,
            ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Natureza", "Religião"],
            []
        );
        this.level = 0;
        this.niveis = this.preencherNiveis();
        this.subClasse = [new Abjurador2024(), new Adivinhador2024(), new Evocador2024(), new Ilusionista2024()];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        }
    }

    private preencherNiveis() {
        return [
            { nivel: 1, proeficiencia: 2, truquesConhecidos: 3, magiasConhecidas: 4, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Adepto de Ritual", "Conjuração", "Recuperação Arcana"] },
            { nivel: 2, proeficiencia: 2, truquesConhecidos: 3, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Acadêmico"] },
            { nivel: 3, proeficiencia: 2, truquesConhecidos: 3, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Subclasse de Mago"] },
            { nivel: 4, proeficiencia: 2, truquesConhecidos: 4, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0], caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 5, proeficiencia: 3, truquesConhecidos: 4, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0], caracteristicas: ["Memorizar Magia"] },
            { nivel: 6, proeficiencia: 3, truquesConhecidos: 4, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0], caracteristicas: ["Característica de Subclasse"] },
            { nivel: 7, proeficiencia: 3, truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0], caracteristicas: [] },
            { nivel: 8, proeficiencia: 3, truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0], caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 9, proeficiencia: 4, truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0], caracteristicas: [] },
            { nivel: 10, proeficiencia: 4, truquesConhecidos: 5, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0], caracteristicas: ["Característica de Subclasse"] },
            { nivel: 11, proeficiencia: 4, truquesConhecidos: 5, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0], caracteristicas: [] },
            { nivel: 12, proeficiencia: 4, truquesConhecidos: 5, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0], caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 13, proeficiencia: 5, truquesConhecidos: 5, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0], caracteristicas: [] },
            { nivel: 14, proeficiencia: 5, truquesConhecidos: 5, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0], caracteristicas: ["Característica de Subclasse"] },
            { nivel: 15, proeficiencia: 5, truquesConhecidos: 5, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0], caracteristicas: [] },
            { nivel: 16, proeficiencia: 5, truquesConhecidos: 5, magiasConhecidas: 21, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0], caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 17, proeficiencia: 6, truquesConhecidos: 5, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1], caracteristicas: [] },
            { nivel: 18, proeficiencia: 6, truquesConhecidos: 5, magiasConhecidas: 23, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1], caracteristicas: ["Maestria de Magias"] },
            { nivel: 19, proeficiencia: 6, truquesConhecidos: 5, magiasConhecidas: 24, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1], caracteristicas: ["Dádiva Épica"] },
            { nivel: 20, proeficiencia: 6, truquesConhecidos: 5, magiasConhecidas: 25, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1], caracteristicas: ["Assinatura Mágica"] }
        ];
    }
}
