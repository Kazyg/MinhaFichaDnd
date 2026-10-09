import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { ColegioDaBravura2024 } from "../classesClassesNetos/ColegioDaBravura2024";
import { ColegioDaDanca } from "../classesClassesNetos/ColegioDaDanca";
import { ColegioDoConhecimento2024 } from "../classesClassesNetos/ColegioDoConhecimento2024";
import { ColegioDoGlamour2024 } from "../classesClassesNetos/ColegioDoGlamour2024";

export class Bardo2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        dadoInspiracao: string;
        truquesConhecidos: number;
        magiasConhecidas: number;
        espacosMagia: number[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Bardo",
            8,
            ["Armadura leve"],
            ["Armas simples"],
            ["Instrumento musical", "instrumento musical", "instrumento musical"],
            ["Destreza", "Carisma"],
            3,
            [
                "Acrobacia",
                "Arcanismo",
                "Atletismo",
                "Enganação",
                "Furtividade",
                "História",
                "Intuição",
                "Intimidação",
                "Investigação",
                "Medicina",
                "Natureza",
                "Percepção",
                "Persuasão",
                "Prestidigitação",
                "Religião",
                "Sobrevivência"
            ],
            ["Armadura leve"]
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Inspiração de Bardo", "Conjuração"], dadoInspiracao: "D6", truquesConhecidos: 2, magiasConhecidas: 4, espacosMagia: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Especialista", "Pau pra Toda Obra"], dadoInspiracao: "D6", truquesConhecidos: 2, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse de Bardo"], dadoInspiracao: "D6", truquesConhecidos: 2, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], dadoInspiracao: "D6", truquesConhecidos: 3, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Fonte de Inspiração"], dadoInspiracao: "D8", truquesConhecidos: 3, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], dadoInspiracao: "D8", truquesConhecidos: 3, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0, 0, 0, 0, 0] },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Contra-Encantamento"], dadoInspiracao: "D8", truquesConhecidos: 3, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0, 0, 0, 0, 0] },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], dadoInspiracao: "D8", truquesConhecidos: 3, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
            { nivel: 9, proeficiencia: 4, caracteristicas: ["Especialização"], dadoInspiracao: "D8", truquesConhecidos: 3, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1, 0, 0, 0, 0] },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Segredos Mágicos"], dadoInspiracao: "D10", truquesConhecidos: 4, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2, 0, 0, 0, 0] },
            { nivel: 11, proeficiencia: 4, caracteristicas: [], dadoInspiracao: "D10", truquesConhecidos: 4, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], dadoInspiracao: "D10", truquesConhecidos: 4, magiasConhecidas: 16, espacosMagia: [4, 3, 3, 3, 2, 1, 0, 0, 0] },
            { nivel: 13, proeficiencia: 5, caracteristicas: [], dadoInspiracao: "D10", truquesConhecidos: 4, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], dadoInspiracao: "D10", truquesConhecidos: 4, magiasConhecidas: 17, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 0, 0] },
            { nivel: 15, proeficiencia: 5, caracteristicas: [], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 18, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 0] },
            { nivel: 17, proeficiencia: 6, caracteristicas: [], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 19, espacosMagia: [4, 3, 3, 3, 2, 1, 1, 1, 1] },
            { nivel: 18, proeficiencia: 6, caracteristicas: ["Inspiração Superior"], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 20, espacosMagia: [4, 3, 3, 3, 3, 1, 1, 1, 1] },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 21, espacosMagia: [4, 3, 3, 3, 3, 2, 1, 1, 1] },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Palavras de Criação"], dadoInspiracao: "D12", truquesConhecidos: 4, magiasConhecidas: 22, espacosMagia: [4, 3, 3, 3, 3, 2, 2, 1, 1] }
        ];
        this.subClasse = [
            new ColegioDaBravura2024(),
            new ColegioDaDanca(),
            new ColegioDoConhecimento2024(),
            new ColegioDoGlamour2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O bardo já atingiu o nível máximo (20).");
        }
    }
}
