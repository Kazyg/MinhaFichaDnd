import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { CirculoDaLua2024 } from "../classesClassesNetos/CirculoDaLua2024";
import { CirculoDaTerra2024 } from "../classesClassesNetos/CirculoDaTerra2024";
import { CirculoDasEstrelas2024 } from "../classesClassesNetos/CirculoDasEstrelas2024";
import { CirculoDoMar2024 } from "../classesClassesNetos/CirculoDoMar2024";

export class Druida2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        formaSelvagem: number;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Druida",
            8,
            ["Armadura leve", "escudos"],
            ["Armas simples"],
            ["Kit de Herbalismo"],
            ["Inteligência", "Sabedoria"],
            2,
            ["Arcanismo", "Adestrar Animais", "Intuição", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"],
            ["Armadura leve", "escudos"]
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração de Druida", "Idioma Druídico", "Ordem Primal"], formaSelvagem: 0, truquesConhecidos: 2, magiasConhecidas: 4, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Companheiro Selvagem", "Forma Selvagem"], formaSelvagem: 2, truquesConhecidos: 2, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse de Druida"], formaSelvagem: 2, truquesConhecidos: 2, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], formaSelvagem: 2, truquesConhecidos: 3, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Ressurgimento Selvagem"], formaSelvagem: 2, truquesConhecidos: 3, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], formaSelvagem: 3, truquesConhecidos: 3, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Fúria Elemental"], formaSelvagem: 3, truquesConhecidos: 3, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], formaSelvagem: 3, truquesConhecidos: 3, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
            { nivel: 9, proeficiencia: 4, caracteristicas: [], formaSelvagem: 3, truquesConhecidos: 3, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Característica de Subclasse"], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
            { nivel: 11, proeficiencia: 4, caracteristicas: [], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 13, proeficiencia: 5, caracteristicas: [], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 15, proeficiencia: 5, caracteristicas: ["Fúria Elemental Aprimorada"], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], formaSelvagem: 3, truquesConhecidos: 4, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 17, proeficiencia: 6, caracteristicas: [], formaSelvagem: 4, truquesConhecidos: 4, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
            { nivel: 18, proeficiencia: 6, caracteristicas: ["Magias Bestiais"], formaSelvagem: 4, truquesConhecidos: 4, magiasConhecidas: 20, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], formaSelvagem: 4, truquesConhecidos: 4, magiasConhecidas: 21, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Arquidruida"], formaSelvagem: 4, truquesConhecidos: 4, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
        ];
        this.subClasse = [
            new CirculoDaLua2024(),
            new CirculoDaTerra2024(),
            new CirculoDasEstrelas2024(),
            new CirculoDoMar2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O druida já atingiu o nível máximo (20).");
        }
    }
}
