export class Armas {
    magica?: boolean;
    origemConcessao?: import('../fichaPersonagem/fichaConcessoesIniciais').OrigemEquipamento;
    id: string;
    nome: string;
    categoria: string;
    dano: { dano_1: string; dano_2: string };
    dano_tipo: string;
    dano_atributo: string[];
    custo: number;
    peso: number;
    propriedades: string;
    distancia: string;

    constructor(
        nome: string,
        categoria: string,
        dano: { dano_1: string; dano_2: string },
        dano_tipo: string,
        dano_atributo: string[],
        custo: number,
        peso: number,
        propriedades: string,
        distancia: string
    ) {
        this.id = this.gerarIdUnico();
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

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
}






export const armas: Armas[] = [
    new Armas(
        "Adaga",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Perfurante",
        ["Força", "Destreza"],
        2,
        0.5,
        "Acuidade, Leve, Arremesso (6/18)",
        "não"
    ),

    new Armas(
        "Azagaia",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "" },
        "Perfurante",
        ["Força"],
        0.5,
        1,
        "Arremesso (9/36)",
        "não"
    ),

    new Armas(
        "Bordão",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "1d8" },
        "Concussão",
        ["Força"],
        0.2,
        2,
        "Versátil (1d8), Arremesso (9/36)",
        "não"
    ),

    new Armas(
        "Clava Grande",
        "Armas Simples",
        { dano_1: "1d8", dano_2: "" },
        "Concussão",
        ["Força"],
        0.2,
        5,
        "Pesada, Duas Mãos",
        "não"
    ),

    new Armas(
        "Foice Curta",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Cortante",
        ["Força"],
        1,
        5,
        "Leve",
        "não"
    ),

    new Armas(
        "Lança",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "1d8" },
        "Perfurante",
        ["Força"],
        1,
        1.5,
        "Arremesso (6/18), Versátil (1d8)",
        "não"
    ),

    new Armas(
        "Maça",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "" },
        "Concussão",
        ["Força"],
        5,
        2,
        "",
        "não"
    ),

    new Armas(
        "Machadinha",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "" },
        "Cortante",
        ["Força"],
        5,
        1,
        "Leve, Arremesso (6/18)",
        "não"
    ),

    new Armas(
        "Martelo Leve",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Concussão",
        ["Força"],
        2,
        1,
        "Leve, Arremesso (6/18)",
        "não"
    ),

    new Armas(
        "Porrete",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Concussão",
        ["Força"],
        0.1,
        1,
        "Leve",
        "não"
    ),



    new Armas(
        "Arco Curto",
        "Armas Simples",
        { dano_1: "1d6", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        25,
        1,
        "Munição (24/96), Duas Mãos",
        "sim"
    ),

    new Armas(
        "Besta Leve",
        "Armas Simples",
        { dano_1: "1d8", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        25,
        2.5,
        "Munição (24/96), Duas Mãos, Recarga",
        "sim"
    ),

    new Armas(
        "Dardo",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        0.05,
        0.1,
        "Acuidade, Arremesso (6/18)",
        "sim"
    ),

    new Armas(
        "Funda",
        "Armas Simples",
        { dano_1: "1d4", dano_2: "" },
        "Concussão",
        ["Destreza"],
        0.1,
        0,
        "Munição (9/36)",
        "sim"
    ),



    new Armas(
        "Alabarda",
        "Armas Marciais",
        { dano_1: "1d10", dano_2: "" },
        "Cortante",
        ["Força"],
        20,
        3,
        "Pesada, Alcance, Duas Mãos",
        "não"
    ),

    new Armas(
        "Cimitarra",
        "Armas Marciais",
        { dano_1: "1d6", dano_2: "" },
        "Cortante",
        ["Força", "Destreza"],
        25,
        1.5,
        "Acuidade, Leve",
        "não"
    ),

    new Armas(
        "Chicote",
        "Armas Marciais",
        { dano_1: "1d4", dano_2: "" },
        "Cortante",
        ["Força", "Destreza"],
        25,
        2,
        "Acuidade, Leve",
        "não"
    ),

    new Armas(
        "Espada Curta",
        "Armas Marciais",
        { dano_1: "1d6", dano_2: "" },
        "Perfurante",
        ["Força", "Destreza"],
        10,
        1,
        "Acuidade, Leve",
        "não"
    ),

    new Armas(
        "Espada Grande",
        "Armas Marciais",
        { dano_1: "2d6", dano_2: "" },
        "Cortante",
        ["Força"],
        50,
        3,
        "Pesada, Duas Mãos",
        "não"
    ),

    new Armas(
        "Espada Longa",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "1d10" },
        "Cortante",
        ["Força"],
        15,
        1.5,
        "Versátil (1d10)",
        "não"
    ),

    new Armas(
        "Glaive",
        "Armas Marciais",
        { dano_1: "1d10", dano_2: "" },
        "Cortante",
        ["Força"],
        20,
        3,
        "Pesada, Alcance, Duas Mãos",
        "não"
    ),

    new Armas(
        "Lança de Montaria",
        "Armas Marciais",
        { dano_1: "1d12", dano_2: "" },
        "Perfurante",
        ["Força"],
        10,
        3,
        "Alcance, Especial",
        "não"
    ),

    new Armas(
        "Lança Longa",
        "Armas Marciais",
        { dano_1: "1d10", dano_2: "" },
        "Perfurante",
        ["Força"],
        5,
        4,
        "Pesada, Alcance, Duas Mãos",
        "não"
    ),

    new Armas(
        "Maça Estrela",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "" },
        "Perfurante",
        ["Força"],
        15,
        2,
        "",
        "não"
    ),

    new Armas(
        "Machado Grande",
        "Armas Marciais",
        { dano_1: "1d12", dano_2: "" },
        "Cortante",
        ["Força"],
        30,
        3.5,
        "Pesada, Duas Mãos",
        "não"
    ),

    new Armas(
        "Machado de Batalha",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "1d10" },
        "Cortante",
        ["Força"],
        10,
        2,
        "Versátil (1d10)",
        "não"
    ),

    new Armas(
        "Malho",
        "Armas Marciais",
        { dano_1: "2d6", dano_2: "" },
        "Concussão",
        ["Força"],
        10,
        5,
        "Pesada, Duas Mãos",
        "não"
    ),

    new Armas(
        "Mangual",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "" },
        "Concussão",
        ["Força"],
        10,
        1,
        "",
        "não"
    ),

    new Armas(
        "Martelo de Guerra",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "1d10" },
        "Concussão",
        ["Força"],
        15,
        5,
        "Versátil (1d10)",
        "não"
    ),

    new Armas(
        "Picareta de Guerra",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "" },
        "Perfurante",
        ["Força"],
        5,
        1,
        "",
        "não"
    ),

    new Armas(
        "Rapieira",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "" },
        "Perfurante",
        ["Força", "Destreza"],
        5,
        1,
        "",
        "não"
    ),

    new Armas(
        "Tridente",
        "Armas Marciais",
        { dano_1: "1d6", dano_2: "1d8" },
        "Perfurante",
        ["Força", "Destreza"],
        5,
        2,
        "Arremessável (6/18), Versátil (1d8)",
        "não"
    ),



    new Armas(
        "Arco Longo",
        "Armas Marciais",
        { dano_1: "1d8", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        50,
        1,
        "Munição (Distancia: 45/180), Pesada, Duas Mãos",
        "sim"
    ),

    new Armas(
        "Besta de Mão",
        "Armas Marciais",
        { dano_1: "1d6", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        75,
        1.5,
        "Munição (Distancia: 9/36), Leve, Recarga",
        "sim"
    ),

    new Armas(
        "Besta Pesada",
        "Armas Marciais",
        { dano_1: "1d10", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        50,
        4.5,
        "Munição (Distância: 30/120), Pesada, Recarga, Duas Mãos",
        "sim"
    ),

    new Armas(
        "Rede",
        "Armas Marciais",
        { dano_1: "", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        1,
        1.5,
        "Especial, Arremesso (1.5/4.5)",
        "sim"
    ),

    new Armas(
        "Zarabatana",
        "Armas Marciais",
        { dano_1: "1", dano_2: "" },
        "Perfurante",
        ["Destreza"],
        10,
        0.5,
        "Munição (Distância: 7.5/30), Recarga",
        "sim"
    ),
];
