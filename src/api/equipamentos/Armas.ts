// equipamentos/Armas.ts
export class Armas {
    nome: string;
    categoria: string;
    dano: { dano_1: string; dano_2: string }; // Objeto para dano
    dano_tipo: string;
    dano_atributo: string[];
    custo: number;
    peso: number;
    propriedades: string;
    distancia: string; // Nova propriedade para indicar se é à distância

    constructor(
        nome: string,
        categoria: string,
        dano: { dano_1: string; dano_2: string },
        dano_tipo: string,
        dano_atributo: string[],
        custo: number,
        peso: number,
        propriedades: string,
        distancia: string // Nova propriedade
    ) {
        this.nome = nome;
        this.categoria = categoria;
        this.dano = dano;
        this.dano_tipo = dano_tipo;
        this.dano_atributo = dano_atributo;
        this.custo = custo;
        this.peso = peso;
        this.propriedades = propriedades;
        this.distancia = distancia;
    }
}

// Exemplo de utilização: 
// import { Armas, armas } from "./equipamentos/Armas.ts";

// Armas Simples Melee por órdem alfabética

export const armas: Armas[] = [
    new Armas(
        "Adaga",                 // nome
        "Armas Simples",         // categoria
        { dano_1: "1d4", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força", "Destreza"],  // dano_atributo
        2,                      // custo (em moedas de ouro)
        0.5,                    // peso (em kg)
        "Acuidade, Leve, Arremesso (6/18)", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Azagaia",              // nome
        "Armas Simples",        // categoria
        { dano_1: "1d6", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        0.5,                    // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Arremesso (9/36)",     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Bordão",               // nome
        "Armas Simples",        // categoria
        { dano_1: "1d6", dano_2: "1d8" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        0.2,                    // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "Versátil (1d8), Arremesso (9/36)", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Clava Grande",         // nome
        "Armas Simples",        // categoria
        { dano_1: "1d8", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        0.2,                    // custo (em moedas de ouro)
        5,                      // peso (em kg)
        "Pesada, Duas Mãos",    // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Foice Curta",          // nome
        "Armas Simples",        // categoria
        { dano_1: "1d4", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        1,                      // custo (em moedas de ouro)
        5,                      // peso (em kg)
        "Leve",                 // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Lança",                // nome
        "Armas Simples",        // categoria
        { dano_1: "1d6", dano_2: "1d8" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        1,                      // custo (em moedas de ouro)
        1.5,                    // peso (em kg)
        "Arremesso (6/18), Versátil (1d8)", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Maça",                 // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        5,                      // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "",                     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Machadinha",           // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        5,                      // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Leve, Arremesso (6/18)", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Martelo Leve",         // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d4", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        2,                      // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Leve, Arremesso (6/18)", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Porrete",              // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d4", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        0.1,                    // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Leve",                 // propriedades
        "não"                   // distancia
    ),

    // Armas simples - DISTANCIA - ordem alfabética

    new Armas(
        "Arco Curto",           // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        25,                     // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Munição (24/96), Duas Mãos", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Besta Leve",           // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        25,                     // custo (em moedas de ouro)
        2.5,                    // peso (em kg)
        "Munição (24/96), Duas Mãos, Recarga", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Dardo",                // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d4", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        0.05,                   // custo (em moedas de ouro)
        0.1,                    // peso (em kg)
        "Acuidade, Arremesso (6/18)", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Funda",                // nome
        "Armas Simples",        // categoria     
        { dano_1: "1d4", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Destreza"],           // dano_atributo
        0.1,                    // custo (em moedas de ouro)
        0,                      // peso (em kg)
        "Munição (9/36)",       // propriedades
        "sim"                   // distancia
    ),

    // Armas Marciais Corpo a corpo - ordem alfabética

    new Armas(
        "Alabarda",             // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d10", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        20,                     // custo (em moedas de ouro)
        3,                      // peso (em kg)
        "Pesada, Alcance, Duas Mãos", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Cimitarra",            // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força", "Destreza"],  // dano_atributo (Acuidade)
        25,                     // custo (em moedas de ouro)
        1.5,                    // peso (em kg)
        "Acuidade, Leve",       // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Chicote",              // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d4", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força", "Destreza"],  // dano_atributo (Acuidade)
        25,                     // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "Acuidade, Leve",       // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Espada Curta",         // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força", "Destreza"],  // dano_atributo (Acuidade)
        10,                     // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Acuidade, Leve",       // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Espada Grande",        // nome
        "Armas Marciais",       // categoria     
        { dano_1: "2d6", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        50,                     // custo (em moedas de ouro)
        3,                      // peso (em kg)
        "Pesada, Duas Mãos",    // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Espada Longa",         // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "1d10" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        15,                     // custo (em moedas de ouro)
        1.5,                    // peso (em kg)
        "Versátil (1d10)",      // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Glaive",               // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d10", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        20,                     // custo (em moedas de ouro)
        3,                      // peso (em kg)
        "Pesada, Alcance, Duas Mãos", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Lança de Montaria",    // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d12", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        10,                     // custo (em moedas de ouro)
        3,                      // peso (em kg)
        "Alcance, Especial",    // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Lança Longa",          // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d10", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        5,                      // custo (em moedas de ouro)
        4,                      // peso (em kg)
        "Pesada, Alcance, Duas Mãos", // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Maça Estrela",         // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        15,                     // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "",                     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Machado Grande",       // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d12", dano_2: "" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        30,                     // custo (em moedas de ouro)
        3.5,                    // peso (em kg)
        "Pesada, Duas Mãos",    // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Machado de Batalha",   // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "1d10" }, // dano
        "Cortante",             // dano_tipo
        ["Força"],              // dano_atributo
        10,                     // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "Versátil (1d10)",      // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Malho",                // nome
        "Armas Marciais",       // categoria     
        { dano_1: "2d6", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        10,                     // custo (em moedas de ouro)
        5,                      // peso (em kg)
        "Pesada, Duas Mãos",    // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Mangual",              // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        10,                     // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "",                     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Martelo de Guerra",    // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "1d10" }, // dano
        "Concussão",            // dano_tipo
        ["Força"],              // dano_atributo
        15,                     // custo (em moedas de ouro)
        5,                      // peso (em kg)
        "Versátil (1d10)",      // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Picareta de Guerra",   // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força"],              // dano_atributo
        5,                      // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "",                     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Rapieira",             // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Força", "Destreza"],  // dano_atributo
        5,                      // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "",                     // propriedades
        "não"                   // distancia
    ),

    new Armas(
        "Tridente",             // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d6", dano_2: "1d8" }, // dano
        "Perfurante",           // dano_tipo
        ["Força", "Destreza"],  // dano_atributo
        5,                      // custo (em moedas de ouro)
        2,                      // peso (em kg)
        "Arremessável (6/18), Versátil (1d8)", // propriedades
        "não"                   // distancia
    ),

    // Armas Marciais a distância

    new Armas(
        "Arco Longo",           // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d8", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        50,                     // custo (em moedas de ouro)
        1,                      // peso (em kg)
        "Munição (Distancia: 45/180), Pesada, Duas Mãos", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Besta de Mão",         // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d6", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        75,                     // custo (em moedas de ouro)
        1.5,                    // peso (em kg)
        "Munição (Distancia: 9/36), Leve, Recarga", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Besta Pesada",         // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1d10", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        50,                     // custo (em moedas de ouro)
        4.5,                    // peso (em kg)
        "Munição (Distância: 30/120), Pesada, Recarga, Duas Mãos", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Rede",                 // nome
        "Armas Marciais",       // categoria     
        { dano_1: "", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        1,                      // custo (em moedas de ouro)
        1.5,                    // peso (em kg)
        "Especial, Arremesso (1.5/4.5)", // propriedades
        "sim"                   // distancia
    ),

    new Armas(
        "Zarabatana",           // nome
        "Armas Marciais",       // categoria     
        { dano_1: "1", dano_2: "" }, // dano
        "Perfurante",           // dano_tipo
        ["Destreza"],           // dano_atributo
        10,                     // custo (em moedas de ouro)
        0.5,                    // peso (em kg)
        "Munição (Distância: 7.5/30), Recarga", // propriedades
        "sim"                   // distancia
    ),
];