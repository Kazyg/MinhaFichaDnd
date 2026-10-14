import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { PatronoArquifada2024 } from "../classesClassesNetos/PatronoArquifada2024";
import { PatronoCelestial2024 } from "../classesClassesNetos/PatronoCelestial2024";
import { PatronoGrandeAntigo2024 } from "../classesClassesNetos/PatronoGrandeAntigo2024";
import { PatronoInfero2024 } from "../classesClassesNetos/PatronoInfero2024";

export class Bruxo2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        invocacoesConhecidas: number;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number;
        nivelMagia: string;
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Bruxo",
            8,
            ["Armadura leve"],
            ["Armas simples"],
            [],
            ["Sabedoria", "Carisma"],
            2,
            [
                "Arcanismo",
                "Enganação",
                "História",
                "Intimidação",
                "Investigação",
                "Natureza",
                "Religião"
            ],
            ["Armadura leve"]
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Invocações Místicas", "Magia de Pacto"], invocacoesConhecidas: 1, truquesConhecidos: 2, magiasConhecidas: 2, espacosMagia: 1, nivelMagia: "1°" },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Astúcia Mágica"], invocacoesConhecidas: 3, truquesConhecidos: 2, magiasConhecidas: 3, espacosMagia: 2, nivelMagia: "1°" },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse de Bruxo"], invocacoesConhecidas: 3, truquesConhecidos: 2, magiasConhecidas: 4, espacosMagia: 2, nivelMagia: "2°" },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], invocacoesConhecidas: 3, truquesConhecidos: 3, magiasConhecidas: 5, espacosMagia: 2, nivelMagia: "2°" },
            { nivel: 5, proeficiencia: 3, caracteristicas: [], invocacoesConhecidas: 5, truquesConhecidos: 3, magiasConhecidas: 6, espacosMagia: 2, nivelMagia: "3°" },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], invocacoesConhecidas: 5, truquesConhecidos: 3, magiasConhecidas: 7, espacosMagia: 2, nivelMagia: "3°" },
            { nivel: 7, proeficiencia: 3, caracteristicas: [], invocacoesConhecidas: 6, truquesConhecidos: 3, magiasConhecidas: 8, espacosMagia: 2, nivelMagia: "4°" },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], invocacoesConhecidas: 6, truquesConhecidos: 3, magiasConhecidas: 9, espacosMagia: 2, nivelMagia: "4°" },
            { nivel: 9, proeficiencia: 4, caracteristicas: ["Contatar Patrono"], invocacoesConhecidas: 7, truquesConhecidos: 3, magiasConhecidas: 10, espacosMagia: 2, nivelMagia: "5°" },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Subclasse"], invocacoesConhecidas: 7, truquesConhecidos: 4, magiasConhecidas: 10, espacosMagia: 2, nivelMagia: "5°" },
            { nivel: 11, proeficiencia: 4, caracteristicas: ["Arcana Mística (6º círculo)"], invocacoesConhecidas: 7, truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], invocacoesConhecidas: 8, truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 13, proeficiencia: 5, caracteristicas: ["Arcana Mística (7º círculo)"], invocacoesConhecidas: 8, truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], invocacoesConhecidas: 8, truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 15, proeficiencia: 5, caracteristicas: ["Arcana Mística (8º círculo)"], invocacoesConhecidas: 9, truquesConhecidos: 4, magiasConhecidas: 13, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], invocacoesConhecidas: 9, truquesConhecidos: 4, magiasConhecidas: 13, espacosMagia: 3, nivelMagia: "5°" },
            { nivel: 17, proeficiencia: 6, caracteristicas: ["Arcana Mística (9º círculo)"], invocacoesConhecidas: 9, truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: 4, nivelMagia: "5°" },
            { nivel: 18, proeficiencia: 6, caracteristicas: [], invocacoesConhecidas: 10, truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: 4, nivelMagia: "5°" },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], invocacoesConhecidas: 10, truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: 4, nivelMagia: "5°" },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Mestre Místico"], invocacoesConhecidas: 10, truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: 4, nivelMagia: "5°" }
        ];
        this.subClasse = [
            new PatronoArquifada2024(),
            new PatronoCelestial2024(),
            new PatronoGrandeAntigo2024(),
            new PatronoInfero2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O bruxo já atingiu o nível máximo (20).");
        }
    }
}
