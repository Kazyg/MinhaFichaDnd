// equipamentos/Armaduras.ts
export class Armaduras_equip {
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

// Array de armaduras
export const armaduras_equip: Armaduras_equip[] = [
    new Armaduras_equip(
        "Acolchoada",                // nome
        "Armadura Leve",             // categoria   
        11,                          // ac
        0,                           // forca necessaria
        "Desvantagem",               // furtividade
        5,                           // custo em moedas de ouro
        4                            // peso em kg
    ),

    new Armaduras_equip(
        "Couro",                     // nome
        "Armadura Leve",             // categoria   
        11,                          // ac
        0,                           // forca necessaria
        "",                          // furtividade
        10,                          // custo em moedas de ouro
        5                            // peso em kg
    ),

    new Armaduras_equip(
        "Couro Batido",              // nome
        "Armadura Leve",             // categoria   
        12,                          // ac
        0,                           // forca necessaria
        "",                          // furtividade
        45,                          // custo em moedas de ouro
        6.5                          // peso em kg
    ),

    // Armaduras Médias em ordem alfabética

    new Armaduras_equip(
        "Gibão de Peles",            // nome
        "Armadura Média",            // categoria   
        12,                          // ac (máx. +2 de Des)
        0,                           // forca necessaria
        "",                          // furtividade
        10,                          // custo em moedas de ouro
        6                            // peso em kg
    ),

    new Armaduras_equip(
        "Camisão de Malha",          // nome
        "Armadura Média",            // categoria   
        13,                          // ac (máx. +2 de Des)
        0,                           // forca necessaria
        "",                          // furtividade
        50,                          // custo em moedas de ouro
        10                           // peso em kg
    ),

    new Armaduras_equip(
        "Brunea",                    // nome
        "Armadura Média",            // categoria   
        14,                          // ac (máx. +2 de Des)
        0,                           // forca necessaria
        "Desvantagem",               // furtividade
        50,                          // custo em moedas de ouro
        22.5                         // peso em kg
    ),

    new Armaduras_equip(
        "Peitoral",                  // nome
        "Armadura Média",            // categoria   
        14,                          // ac (máx. +2 de Des)
        0,                           // forca necessaria
        "",                          // furtividade
        400,                         // custo em moedas de ouro
        10                           // peso em kg
    ),

    new Armaduras_equip(
        "Meia-Armadura",             // nome
        "Armadura Média",            // categoria   
        15,                          // ac (máx. +2 de Des)
        0,                           // forca necessaria
        "Desvantagem",               // furtividade
        750,                         // custo em moedas de ouro
        20                           // peso em kg
    ),

    // Armaduras Pesadas em ordem alfabética

    new Armaduras_equip(
        "Cota de Anéis",             // nome
        "Armadura Pesada",           // categoria   
        14,                          // ac
        0,                           // forca necessaria
        "Desvantagem",               // furtividade
        30,                          // custo em moedas de ouro
        20                           // peso em kg
    ),

    new Armaduras_equip(
        "Cota de Malha",             // nome
        "Armadura Pesada",           // categoria   
        16,                          // ac
        13,                          // forca necessaria
        "Desvantagem",               // furtividade
        75,                          // custo em moedas de ouro
        27.5                         // peso em kg
    ),

    new Armaduras_equip(
        "Cota de Talas",             // nome
        "Armadura Pesada",           // categoria   
        17,                          // ac
        15,                          // forca necessaria
        "Desvantagem",               // furtividade
        200,                         // custo em moedas de ouro
        30                           // peso em kg
    ),

    new Armaduras_equip(
        "Placas",                    // nome
        "Armadura Pesada",           // categoria   
        18,                          // ac
        15,                          // forca necessaria
        "Desvantagem",               // furtividade
        1500,                        // custo em moedas de ouro
        32.5                         // peso em kg
    ),

    // Escudos

    new Armaduras_equip(
        "Escudo",                    // nome
        "Escudo",                    // categoria   
        2,                           // ac (bônus de +2)
        0,                           // forca necessaria
        "",                          // furtividade
        10,                          // custo em moedas de ouro
        3                            // peso em kg
    ),
];

