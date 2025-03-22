import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Classes {
    nome: string;
    dadosVida: number;
    armaduras: string[];
    armas: string[];
    ferramentas: string[];
    testesResistencias: string[];
    habilidade: number;
    habilidades: string[];
    niveis: {
        nivel: number;
        caracteristicas: string[];
      }[];
    subClasse: SubClasses[];
    proficienciaMulticlasse: string[];

    constructor(
        nome: string,
        dadosVida: number,
        armaduras: string[],
        armas: string[],
        ferramentas: string[],
        testesResistencias: string[],
        habilidade: number,
        habilidades: string[],
        proficienciaMulticlasse: string[]
    ){
        this.nome = nome;
        this.dadosVida = dadosVida;
        this.armaduras = armaduras;
        this.armas = armas;
        this.ferramentas = ferramentas;
        this.testesResistencias = testesResistencias;
        this.habilidade = habilidade;
        this.habilidades = habilidades;
        this.proficienciaMulticlasse = proficienciaMulticlasse;
    }
}