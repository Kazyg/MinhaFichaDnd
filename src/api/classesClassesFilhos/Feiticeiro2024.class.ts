import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { FeiticariaAberrante2024 } from "../classesClassesNetos/FeiticariaAberrante2024";
import { FeiticariaDraconica2024 } from "../classesClassesNetos/FeiticariaDraconica2024";
import { FeiticariaMecanica2024 } from "../classesClassesNetos/FeiticariaMecanica2024";
import { FeiticariaSelvagem2024 } from "../classesClassesNetos/FeiticariaSelvagem2024";

export class Feiticeiro2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        pontosFeiticaria: number;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Feiticeiro",
            6,
            [],
            ["Armas simples"],
            [],
            ["Constituição", "Carisma"],
            2,
            ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
            []
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração de Feiticeiro", "Feitiçaria Inata"], pontosFeiticaria: 0, truquesConhecidos: 4, magiasConhecidas: 2, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Fonte de Magia", "Metamagia", "Opções de Metamagia"], pontosFeiticaria: 2, truquesConhecidos: 4, magiasConhecidas: 4, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse de Feiticeiro"], pontosFeiticaria: 3, truquesConhecidos: 4, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], pontosFeiticaria: 4, truquesConhecidos: 5, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Restauração Feiticeira"], pontosFeiticaria: 5, truquesConhecidos: 5, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], pontosFeiticaria: 6, truquesConhecidos: 5, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Feitiçaria Encarnada"], pontosFeiticaria: 7, truquesConhecidos: 5, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], pontosFeiticaria: 8, truquesConhecidos: 5, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
            { nivel: 9, proeficiencia: 4, caracteristicas: [], pontosFeiticaria: 9, truquesConhecidos: 5, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Metamagia"], pontosFeiticaria: 10, truquesConhecidos: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
            { nivel: 11, proeficiencia: 4, caracteristicas: [], pontosFeiticaria: 11, truquesConhecidos: 6, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], pontosFeiticaria: 12, truquesConhecidos: 6, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 13, proeficiencia: 5, caracteristicas: [], pontosFeiticaria: 13, truquesConhecidos: 6, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], pontosFeiticaria: 14, truquesConhecidos: 6, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 15, proeficiencia: 5, caracteristicas: [], pontosFeiticaria: 15, truquesConhecidos: 6, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], pontosFeiticaria: 16, truquesConhecidos: 6, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 17, proeficiencia: 6, caracteristicas: ["Metamagia"], pontosFeiticaria: 17, truquesConhecidos: 6, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
            { nivel: 18, proeficiencia: 6, caracteristicas: ["Característica de Subclasse"], pontosFeiticaria: 18, truquesConhecidos: 6, magiasConhecidas: 20, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], pontosFeiticaria: 19, truquesConhecidos: 6, magiasConhecidas: 21, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Apoteose Arcana"], pontosFeiticaria: 20, truquesConhecidos: 6, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
        ];
        this.subClasse = [
            new FeiticariaAberrante2024(),
            new FeiticariaDraconica2024(),
            new FeiticariaMecanica2024(),
            new FeiticariaSelvagem2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O feiticeiro já atingiu o nível máximo (20).");
        }
    }
}
