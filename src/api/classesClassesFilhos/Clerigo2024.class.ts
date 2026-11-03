import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { DominioDaGuerra2024 } from "../classesClassesNetos/DominioDaGuerra2024";
import { DominioDaLuz2024 } from "../classesClassesNetos/DominioDaLuz2024";
import { DominioDaTrapaca2024 } from "../classesClassesNetos/DominioDaTrapaca2024";
import { DominioDaVida2024 } from "../classesClassesNetos/DominioDaVida2024";

export class Clerigo2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        canalizarDivindade: number;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Clerigo",
            8,
            ["Armadura leve", "armadura média", "escudos"],
            ["Armas simples"],
            [],
            ["Sabedoria", "Carisma"],
            2,
            ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
            ["Armadura leve", "armadura média", "escudos"]
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração de Clérigo", "Ordem Divina"], canalizarDivindade: 0, truquesConhecidos: 3, magiasConhecidas: 4, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Canalizar Divindade"], canalizarDivindade: 2, truquesConhecidos: 3, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse Clérigo"], canalizarDivindade: 2, truquesConhecidos: 3, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], canalizarDivindade: 2, truquesConhecidos: 4, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Fulminar Mortos-Vivos"], canalizarDivindade: 2, truquesConhecidos: 4, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], canalizarDivindade: 3, truquesConhecidos: 4, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Golpes Abençoados"], canalizarDivindade: 3, truquesConhecidos: 4, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], canalizarDivindade: 3, truquesConhecidos: 4, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
            { nivel: 9, proeficiencia: 4, caracteristicas: [], canalizarDivindade: 3, truquesConhecidos: 4, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Intervenção Divina"], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
            { nivel: 11, proeficiencia: 4, caracteristicas: [], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 13, proeficiencia: 5, caracteristicas: [], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Golpes Abençoados Aprimorado"], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 15, proeficiencia: 5, caracteristicas: [], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 17, proeficiencia: 6, caracteristicas: ["Característica de Subclasse"], canalizarDivindade: 3, truquesConhecidos: 5, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
            { nivel: 18, proeficiencia: 6, caracteristicas: [], canalizarDivindade: 4, truquesConhecidos: 5, magiasConhecidas: 20, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], canalizarDivindade: 4, truquesConhecidos: 5, magiasConhecidas: 21, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Intervenção Divina Maior"], canalizarDivindade: 4, truquesConhecidos: 5, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
        ];
        this.subClasse = [
            new DominioDaGuerra2024(),
            new DominioDaLuz2024(),
            new DominioDaTrapaca2024(),
            new DominioDaVida2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O clérigo já atingiu o nível máximo (20).");
        }
    }
}
