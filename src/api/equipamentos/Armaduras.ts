
export class Armaduras_equip {
    magica?: boolean;
    origemConcessao?: import('../fichaPersonagem/fichaConcessoesIniciais').OrigemEquipamento;
    id: string;
    nome: string;
    categoria: string;
    ac: number;
    forca: number;
    furtividade: string;
    custo: number;
    peso: number;

    constructor(
        nome: string,
        categoria: string,
        ac: number,
        forca: number,
        furtividade: string,
        custo: number,
        peso: number
    ) {
        this.id = this.gerarIdUnico();
        this.nome = nome;
        this.categoria = categoria;
        this.ac = ac;
        this.forca = forca;
        this.furtividade = furtividade;
        this.custo = custo;
        this.peso = peso;
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
}


export const armaduras_equip: Armaduras_equip[] = [
    new Armaduras_equip(
        "Acolchoada",
        "Armadura Leve",
        11,
        0,
        "Desvantagem",
        5,
        4
    ),

    new Armaduras_equip(
        "Couro",
        "Armadura Leve",
        11,
        0,
        "",
        10,
        5
    ),

    new Armaduras_equip(
        "Couro Batido",
        "Armadura Leve",
        12,
        0,
        "",
        45,
        6.5
    ),



    new Armaduras_equip(
        "Gibão de Peles",
        "Armadura Média",
        12,
        0,
        "",
        10,
        6
    ),

    new Armaduras_equip(
        "Camisão de Malha",
        "Armadura Média",
        13,
        0,
        "",
        50,
        10
    ),

    new Armaduras_equip(
        "Brunea",
        "Armadura Média",
        14,
        0,
        "Desvantagem",
        50,
        22.5
    ),

    new Armaduras_equip(
        "Peitoral",
        "Armadura Média",
        14,
        0,
        "",
        400,
        10
    ),

    new Armaduras_equip(
        "Meia-Armadura",
        "Armadura Média",
        15,
        0,
        "Desvantagem",
        750,
        20
    ),



    new Armaduras_equip(
        "Cota de Anéis",
        "Armadura Pesada",
        14,
        0,
        "Desvantagem",
        30,
        20
    ),

    new Armaduras_equip(
        "Cota de Malha",
        "Armadura Pesada",
        16,
        13,
        "Desvantagem",
        75,
        27.5
    ),

    new Armaduras_equip(
        "Cota de Talas",
        "Armadura Pesada",
        17,
        15,
        "Desvantagem",
        200,
        30
    ),

    new Armaduras_equip(
        "Placas",
        "Armadura Pesada",
        18,
        15,
        "Desvantagem",
        1500,
        32.5
    ),



    new Armaduras_equip(
        "Escudo",
        "Escudos",
        2,
        0,
        "",
        10,
        3
    ),
];

