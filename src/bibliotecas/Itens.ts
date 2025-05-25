export class Itens {
    id: string;
    nome: string;
    tipo: string;
    preco: number;
    peso: number;
    raridade: string;
    sintonizavel: boolean;
    descricao: string;

    constructor(
        nome: string,
        tipo: string,
        preco: number,
        peso: number,
        raridade: string,
        sintonizavel: boolean,
        descricao: string
    ) {
        this.id = this.gerarIdUnico();
        this.nome = nome;
        this.tipo = tipo;
        this.peso = peso;
        this.preco = preco;
        this.raridade = raridade;
        this.sintonizavel = sintonizavel;
        this.descricao = descricao;
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
}

export const itens: Itens[] = [
    new Itens(
        "Abacus",
        "Adventuring Gear",
        2,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Acid",
        "Adventuring Gear",
        25,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Adamantine Ammunition",
        "Ammunition, Generic Variant",
        0, // Valor não fornecido (—)
        0, // Peso não fornecido (—)
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Adamantine Bar",
        "Trade Good",
        1000,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Adjustable Stifts",
        "Other",
        0, // Valor não fornecido (—)
        8,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Aerenal Trinket",
        "Adventuring Gear",
        0, // Valor não fornecido (—)
        0, // Peso não fornecido (—)
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Airship",
        "Vehicle (Air)",
        40000,
        0, // Peso não fornecido (—)
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Alchemist's Doom",
        "Adventuring Gear",
        0, // Valor não fornecido (—)
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Fogo de Alquimista",
        "Equipamento de Aventura",
        50,
        1,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Suprimentos de Alquimista",
        "Ferramentas de Artesão",
        50,
        8,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Cerveja (galão)",
        "Comida e Bebida",
        0.2, // 2 sp = 0.2 gp
        0,
        "Comum",
        true,
        "PHB'14"
    ),
    new Itens(
        "Cerveja (caneca)",
        "Comida e Bebida",
        0.04, // 4 cp = 0.04 gp
        0,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Amuleto",
        "Foco de Conjuração",
        5,
        1,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Antitoxina",
        "Equipamento de Aventura",
        50,
        0,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Foco Arcano",
        "Foco de Conjuração",
        0,
        0,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Bugiganga de Argonnessen",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        "ERLW"
    ),
    new Itens(
        "Flecha",
        "Munição",
        0.05, // 5 cp = 0.05 gp
        0.05, // 0.8 oz ≈ 0.05 lb
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Flechas (20)",
        "Munição",
        1,
        1,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Ferramentas de Artesão",
        "Ferramentas de Artesão",
        0,
        0,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Sangue de Assassino",
        "Equipamento de Aventura, Veneno",
        150,
        0,
        "Comum",
        true,
        "DMG'24"
    ),
    new Itens(
        "Avestruz Bélica",
        "Montaria",
        50,
        0,
        "Comum",
        false,
        "IDRoF"
    ),

    // Segunda tabela
    new Itens(
        "Mochila",
        "Equipamento de Aventura",
        2,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Paraquedas de Mochila",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Gaita de Foles",
        "Instrumento Musical",
        30,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Esfera de Rolamento",
        "Equipamento de Aventura",
        0.001, // 0.1 cp ≈ 0.001 gp
        0.002, // 0.032 oz ≈ 0.002 lb
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Esferas de Rolamento (saco)",
        "Equipamento de Aventura",
        1,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bardana",
        "Arreios e Selas",
        0, // "×4" (valor relativo)
        0, // "×2" (valor relativo)
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Caixa Latidora",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Barril",
        "Equipamento de Aventura",
        2,
        70,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Equipamento de Pesca Básico",
        "Equipamento de Aventura",
        0.1, // 1 sp = 0.1 gp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Veneno Básico",
        "Equipamento de Aventura, Veneno",
        100,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Cesto",
        "Equipamento de Aventura",
        0.4, // 4 sp = 0.4 gp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Machado de Batalha",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Saco de Dormir",
        "Equipamento de Aventura",
        1,
        7,
        "Comum",
        false,
        ""
    ),
    // Tabela 1 (Backpack até Bedroll)
    new Itens(
        "Mochila",
        "Equipamento de Aventura",
        2,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Paraquedas de Mochila",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Gaita de Foles",
        "Instrumento Musical",
        30,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Esfera de Rolamento (unidade)",
        "Equipamento de Aventura",
        0.001, // 0.1 cp
        0.002, // 0.032 oz
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Esferas de Rolamento (saco)",
        "Equipamento de Aventura",
        1,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bardana (Armadura para Montaria)",
        "Arreios e Selas",
        0, // "×4" (valor relativo)
        0, // "×2" (valor relativo)
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Caixa Latidora",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Barril",
        "Equipamento de Aventura",
        2,
        70,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Equipamento de Pesca Básico",
        "Equipamento de Aventura",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Veneno Básico",
        "Equipamento de Aventura, Veneno",
        100,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Cesto",
        "Equipamento de Aventura",
        0.4, // 4 sp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Machado de Batalha",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Saco de Dormir",
        "Equipamento de Aventura",
        1,
        7,
        "Comum",
        false,
        ""
    ),

    // Tabela 2 (Bell até Druride Focus)
    new Itens(
        "Sino",
        "Equipamento de Aventura",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Flauta de Pássaro",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Freio e Bridão",
        "Arreios e Selas",
        2,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Respiração de Biza",
        "Equipamento de Aventura, Veneno",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Semente de Orquídea Fantasma Negra",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Cobertor",
        "Equipamento de Aventura",
        0.5, // 5 sp
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cadernal",
        "Equipamento de Aventura",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Zarabatana",
        "Arma Marcial, Arma de Longo Alcance",
        10,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Virote (unidade)",
        "Munição",
        0.05, // 5 cp
        0.075, // 1.2 oz
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Virotes (20)",
        "Munição",
        1,
        1.5,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Bomba",
        "Explosivo",
        100,
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Bombarda",
        "Veículo (Espacial)",
        50000,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 3 (Book até Candle)
    new Itens(
        "Livro",
        "Equipamento de Aventura",
        25,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pão (unidade)",
        "Comida e Bebida",
        0.02, // 2 cp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Peitoral",
        "Armadura Média",
        400,
        20,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Suprimentos de Cervejeiro",
        "Ferramentas de Artesão",
        20,
        9,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Balde",
        "Equipamento de Aventura",
        0.05, // 5 cp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lanterne de Foco",
        "Equipamento de Aventura",
        10,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Ladrão",
        "Equipamento de Aventura",
        16,
        47.75, // 47¾ lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Fumaça de Othurr",
        "Equipamento de Aventura, Veneno",
        500,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Suprimentos de Calígrafo",
        "Ferramentas de Artesão",
        10,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Caltrop (unidade)",
        "Equipamento de Aventura",
        0.05, // 5 cp
        0.1, // 1.6 oz
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Caltrops (saco)",
        "Equipamento de Aventura",
        1,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Camelo",
        "Montaria",
        50,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vela",
        "Equipamento de Aventura",
        0.01, // 1 cp
        0,
        "Comum",
        true,
        ""
    ),

    // Tabela 4 (Chariot até Common Wine)
    new Itens(
        "Carroça de Guerra",
        "Veículo (Terrestre)",
        250,
        100,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Queijo (fatia)",
        "Comida e Bebida",
        0.1, // 1 sp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Baú",
        "Equipamento de Aventura",
        5,
        25,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Galinha",
        "Bem Comercial",
        0.02, // 2 cp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pedaço de Carne",
        "Comida e Bebida",
        0.3, // 3 sp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Canela",
        "Bem Comercial",
        2,
        1, // "11b." corrigido para 1 lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Escalada",
        "Equipamento de Aventura",
        25,
        12,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Roupa de Frio",
        "Equipamento de Aventura",
        10,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cravo-da-índia",
        "Bem Comercial",
        3,
        1, // "11b." corrigido para 1 lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Clava",
        "Arma Simples, Arma de Corpo a Corpo",
        0.1, // 1 sp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Sapateiro",
        "Ferramentas de Artesão",
        5,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Roupas Comuns",
        "Equipamento de Aventura",
        0.5, // 5 sp
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vinho Comum (garrafa)",
        "Comida e Bebida",
        0.2, // 2 sp
        0,
        "Comum",
        true,
        ""
    ),

    // Tabela 5 (Canoe até Chalk)
    new Itens(
        "Canoa",
        "Veículo (Aquático)",
        50,
        100,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lona (1 m²)",
        "Bem Comercial",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Carpinteiro",
        "Ferramentas de Artesão",
        8,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carruagem",
        "Veículo (Terrestre)",
        100,
        600,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Muco de Rastejador de Carniça",
        "Equipamento de Aventura, Veneno",
        200,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Carrinho de Mão",
        "Veículo (Terrestre)",
        15,
        200,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Cartógrafo",
        "Ferramentas de Artesão",
        15,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Munição de Catapulta",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Corrente",
        "Equipamento de Aventura",
        5,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cota de Malha",
        "Armadura Pesada",
        75,
        55,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Camisa de Malha",
        "Armadura Média",
        50,
        20,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Giz (unidade)",
        "Equipamento de Aventura",
        0.01, // 1 cp
        0,
        "Comum",
        true,
        ""
    ),

    // Tabela 6 (Damselfly Ship até Dreamlily)
    new Itens(
        "Nave Libélula",
        "Veículo (Espacial)",
        20000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Dardo",
        "Arma Simples, Arma de Longo Alcance",
        0.05, // 5 cp
        0.5,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Conjunto de Dados",
        "Kit de Jogo",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Diplomata",
        "Equipamento de Aventura",
        39,
        39,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Disfarce",
        "Ferramenta",
        25,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Trenó de Cães",
        "Veículo (Terrestre)",
        20,
        300,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Burro",
        "Montaria",
        8,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cimitarra de Lâmina Dupla",
        "Arma Marcial, Arma de Corpo a Corpo",
        100,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cavalo de Tração",
        "Montaria",
        50,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sangue de Dragão",
        "Outro",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Conjunto de Xadrez Élfico",
        "Kit de Jogo",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Dreamlily (planta alucinógena)",
        "Outro",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Foco Druride",
        "Foco de Conjuração",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 7 (Alchemists Fire até Axe Beak)
    new Itens(
        "Fogo de Alquimista",
        "Equipamento de Aventura",
        50,
        1,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Suprimentos de Alquimista",
        "Ferramentas de Artesão",
        50,
        8,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Cerveja (galão)",
        "Comida e Bebida",
        0.2, // 2 sp
        0,
        "Comum",
        true,
        "PHB'14"
    ),
    new Itens(
        "Cerveja (caneca)",
        "Comida e Bebida",
        0.04, // 4 cp
        0,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Amuleto",
        "Foco de Conjuração",
        5,
        1,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Antitoxina",
        "Equipamento de Aventura",
        50,
        0,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Foco Arcano",
        "Foco de Conjuração",
        0,
        0,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Bugiganga de Argonnessen",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        "ERLW"
    ),
    new Itens(
        "Flecha (unidade)",
        "Munição",
        0.05, // 5 cp
        0.05, // 0.8 oz
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Flechas (20)",
        "Munição",
        1,
        1,
        "Comum",
        true,
        "PHB'24"
    ),
    new Itens(
        "Ferramentas de Artesão (genéricas)",
        "Ferramentas de Artesão",
        0,
        0,
        "Comum",
        false,
        "PHB'24"
    ),
    new Itens(
        "Sangue de Assassino",
        "Equipamento de Aventura, Veneno",
        150,
        0,
        "Comum",
        true,
        "DMG'24"
    ),
    new Itens(
        "Avestruz Bélica",
        "Montaria",
        50,
        0,
        "Comum",
        false,
        "IDRoF"
    ),
    // Tabela 8 (Druidic Focus até Feed)
    new Itens(
        "Foco Druídico",
        "Foco de Conjuração",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tambor",
        "Instrumento Musical",
        6,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Dulcimer",
        "Instrumento Musical",
        25,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Explorador de Masmorras",
        "Equipamento de Aventura",
        12,
        55,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Elefante",
        "Montaria",
        200,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Élfica",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Emblema",
        "Foco de Conjuração",
        5,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Artista",
        "Equipamento de Aventura",
        40,
        88.5, // 88½ lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Essência de Éter",
        "Equipamento de Aventura, Veneno",
        300,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Sela Exótica",
        "Arreios e Selas",
        60,
        40,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Explorador",
        "Equipamento de Aventura",
        10,
        55,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Fargab (Item Élfico)",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ração Animal (por dia)",
        "Arreios e Selas",
        0.05, // 5 cp
        10,
        "Comum",
        true,
        ""
    ),

    // Tabela 9 (Hour até Glass Bottle)
    new Itens(
        "Hora (Relógio Mecânico)",
        "Bem Comercial",
        2,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Flauta",
        "Instrumento Musical",
        2,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Peixe-Voador",
        "Veículo (Espacial)",
        20000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Falsificação",
        "Ferramenta",
        15,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Frostfell e Everice",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Galé",
        "Veículo (Aquático)",
        30000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Jogo Genérico",
        "Kit de Jogo",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga do Guardião do Portal",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Gigante",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Gengibre",
        "Bem Comercial",
        1,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Glaive",
        "Arma Marcial, Arma de Corpo a Corpo",
        20,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garrafa de Vidro",
        "Equipamento de Aventura",
        2,
        2,
        "Comum",
        false,
        ""
    ),

    // Tabela 10 (Common Wine até Dagger)
    new Itens(
        "Vinho Comum (garrafa)",
        "Comida e Bebida",
        0.2, // 2 sp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Bolsa de Componentes",
        "Equipamento de Aventura",
        25,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Granada de Concussão",
        "Explosivo",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Utensílios de Cozinha",
        "Ferramentas de Artesão",
        1,
        8,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cobre (barra)",
        "Bem Comercial",
        0.5, // 5 sp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Traje",
        "Equipamento de Aventura",
        5,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tecido de Algodão (1 m²)",
        "Bem Comercial",
        0.5, // 5 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vaca",
        "Bem Comercial",
        10,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Crampons (Garras para Gelo)",
        "Equipamento de Aventura",
        2,
        0.25, // ¼ lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Estojo de Virotes",
        "Equipamento de Aventura",
        1,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pé de Cabra",
        "Equipamento de Aventura",
        2,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cristal",
        "Foco de Conjuração",
        10,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Adaga",
        "Arma Simples, Arma de Corpo a Corpo",
        2,
        1,
        "Comum",
        false,
        ""
    ),

    // Tabela 11 (Feywild Trinket até Flensing Claws)
    new Itens(
        "Bugiganga do Feywild",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Roupas Finas",
        "Equipamento de Aventura",
        15,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vinho Fino (garrafa)",
        "Comida e Bebida",
        10,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Bala de Arma de Fogo (unidade)",
        "Munição",
        0.3, // 3 sp
        0.5,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Balas de Arma de Fogo (10)",
        "Munição",
        3,
        2,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Equipamento de Pesca",
        "Equipamento de Aventura",
        1,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Flarl (Arma Élfica)",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Frasco",
        "Equipamento de Aventura",
        0.02, // 2 cp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garras Esfoladoras (Pequenas)",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garras Esfoladoras (Médias)",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garras Esfoladoras (Grandes)",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garras Esfoladoras (Enormes)",
        "Outro",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 12 (Glassblower’s Tools até Half Plate Armor)
    new Itens(
        "Ferramentas de Vidraceiro",
        "Ferramentas de Artesão",
        30,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Glaur (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cabra",
        "Bem Comercial",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ouro (barra)",
        "Bem Comercial",
        50,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Ovo de Ganso",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Gancho de Escalada",
        "Equipamento de Aventura",
        2,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Machado Grande",
        "Arma Marcial, Arma de Corpo a Corpo",
        30,
        7,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Clava Grande",
        "Arma Simples, Arma de Corpo a Corpo",
        0.2, // 2 sp
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espada Grande",
        "Arma Marcial, Arma de Corpo a Corpo",
        50,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pólvora (barril)",
        "Explosivo",
        250,
        20,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Pólvora (chifre)",
        "Explosivo",
        35,
        2,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Alabarda",
        "Arma Marcial, Arma de Corpo a Corpo",
        20,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Meia-Placa",
        "Armadura Média",
        750,
        40,
        "Comum",
        false,
        ""
    ),

    // Tabela 13 (Hammer até Hooked Lantern)
    new Itens(
        "Martelo",
        "Equipamento de Aventura",
        1,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Cabeça de Martelo",
        "Veículo (Espacial)",
        40000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Besta de Mão",
        "Arma Marcial, Arma de Longo Alcance",
        75,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tamborim",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Machadinha",
        "Arma Simples, Arma de Corpo a Corpo",
        5,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Cura",
        "Equipamento de Aventura",
        5,
        3,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Besta Pesada",
        "Arma Marcial, Arma de Longo Alcance",
        50,
        18,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Herbalismo",
        "Ferramenta",
        5,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Couro",
        "Armadura Média",
        10,
        12,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Símbolo Sagrado",
        "Foco de Conjuração",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Água Benta",
        "Equipamento de Aventura",
        25,
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Lanterne com Capuz",
        "Equipamento de Aventura",
        5,
        2,
        "Comum",
        false,
        ""
    ),

    // Tabela 14 (Hooded Lantern até Iron Ball)
    new Itens(
        "Lanterne com Capuz",
        "Equipamento de Aventura",
        5,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lança Curta com Gancho",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Hoopak (Arma Élfica)",
        "Arma Marcial, Arma de Corpo a Corpo",
        0.1, // 1 sp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Trompa",
        "Instrumento Musical",
        3,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga do Horror",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ampulheta",
        "Equipamento de Aventura",
        25,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadilha de Caça",
        "Equipamento de Aventura",
        5,
        25,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Icewind Dale",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tinta",
        "Equipamento de Aventura",
        10,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pena de Escrever",
        "Equipamento de Aventura",
        0.02, // 2 cp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Repelente de Insetos (incenso)",
        "Equipamento de Aventura",
        0.1, // 1 sp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Repelente de Insetos (pomada)",
        "Equipamento de Aventura",
        1,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Ferro (barra)",
        "Bem Comercial",
        0.1, // 1 sp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bola de Ferro",
        "Arma Simples, Arma de Longo Alcance",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 15 (Iron Pot até Lamp)
    new Itens(
        "Panela de Ferro",
        "Equipamento de Aventura",
        2,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espeto de Ferro",
        "Equipamento de Aventura",
        0.1, // 1 sp
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espetos de Ferro (10)",
        "Equipamento de Aventura",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sussurro de Ivana",
        "Equipamento de Aventura, Veneno",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Javelina",
        "Arma Simples, Arma de Corpo a Corpo",
        0.5, // 5 sp
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Joalheiro",
        "Ferramentas de Artesão",
        25,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Jarra",
        "Equipamento de Aventura",
        0.02, // 2 cp
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Keelboat (Barco de Fundo Chato)",
        "Veículo (Aquático)",
        3000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Barril de Fogo de Alquimista",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Bugiganga de Khyber",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Escada",
        "Equipamento de Aventura",
        0.1, // 1 sp
        25,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lâmpada",
        "Equipamento de Aventura",
        0.5, // 5 sp
        1,
        "Comum",
        false,
        ""
    ),

    // Tabela 16 (Lamprey Ship até Longhorn)
    new Itens(
        "Nave Lampreia",
        "Veículo (Espacial)",
        20000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lança",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Couro",
        "Armadura Leve",
        10,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Coureiro",
        "Ferramentas de Artesão",
        5,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Besta Leve",
        "Arma Simples, Arma de Longo Alcance",
        25,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Martelo Leve",
        "Arma Simples, Arma de Corpo a Corpo",
        2,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Besta Leve Repetidora",
        "Arma Simples, Arma de Longo Alcance",
        0,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Linho (1 m²)",
        "Bem Comercial",
        5,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Viva",
        "Veículo (Espacial)",
        25000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cadeado",
        "Equipamento de Aventura",
        10,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferrão de Loitrise",
        "Equipamento de Aventura, Veneno",
        200,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Arco Longo",
        "Arma Marcial, Arma de Longo Alcance",
        50,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Longhorn (Instrumento)",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    // Tabela 17 (Longhorn até Mason’s Tools)
    new Itens(
        "Longhorn",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Navio Longo",
        "Veículo (Aquático)",
        10000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espada Longa",
        "Arma Marcial, Arma de Corpo a Corpo",
        15,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Lorehold",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Alaúde",
        "Instrumento Musical",
        35,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lira",
        "Instrumento Musical",
        30,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Maça",
        "Arma Simples, Arma de Corpo a Corpo",
        5,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lupa",
        "Equipamento de Aventura",
        100,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Malícia",
        "Equipamento de Aventura, Veneno",
        250,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Algemas",
        "Equipamento de Aventura",
        2,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Mapa",
        "Equipamento de Aventura",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Estojo para Mapa ou Pergaminho",
        "Equipamento de Aventura",
        1,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Pedreiro",
        "Ferramentas de Artesão",
        10,
        8,
        "Comum",
        false,
        ""
    ),

    // Tabela 18 (Mastiff até Mournland Trinket)
    new Itens(
        "Mastim",
        "Montaria",
        25,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cachimbo Inigualável",
        "Outro",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Malho",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Folhas de Menga (1 onça)",
        "Equipamento de Aventura",
        2,
        0.0625, // 1 oz = 0.0625 lb
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Balança de Mercador",
        "Equipamento de Aventura",
        5,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Refeições",
        "Equipamento de Aventura",
        0.2, // 2 sp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lágrimas da Meia-Noite",
        "Equipamento de Aventura, Veneno",
        1500,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Sela Militar",
        "Arreios e Selas",
        20,
        30,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Picareta de Mineiro",
        "Equipamento de Aventura",
        2,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espelho",
        "Equipamento de Aventura",
        5,
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Caçador de Monstros",
        "Equipamento de Aventura",
        33,
        48.5, // 48½ lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Maça de Espinhos",
        "Arma Marcial, Arma de Corpo a Corpo",
        15,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Mournland",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),

    // Tabela 19 (Mule até Nimblewright Detector)
    new Itens(
        "Mula",
        "Montaria",
        8,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Elixir da Vida de Murgaxor",
        "Equipamento de Aventura",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Instrumento Musical Genérico",
        "Instrumento Musical",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Mosquete",
        "Arma Marcial, Arma de Longo Alcance, Arma de Fogo",
        500,
        10,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Narycrash (Item Élfico)",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Nautiloide",
        "Veículo (Espacial)",
        50000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Navegação",
        "Ferramenta",
        25,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Agulha (unidade)",
        "Munição",
        0.02, // 2 cp
        0.02, // 0.32 oz ≈ 0.02 lb
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Agulhas (50)",
        "Munição",
        1,
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Rede",
        "Equipamento de Aventura",
        1,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Aranha Noturna",
        "Veículo (Espacial)",
        50000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Detector de Nimblewright",
        "Outro",
        0,
        0,
        "Incomum",
        false,
        ""
    ),

    // Tabela 20 (Oil até Pepper)
    new Itens(
        "Óleo",
        "Equipamento de Aventura",
        0.1, // 1 sp
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Óleo de Taggit",
        "Equipamento de Aventura, Veneno",
        400,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Orbe",
        "Foco de Conjuração",
        20,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Arco Longo Sobredimensionado",
        "Arma Marcial, Arma de Longo Alcance",
        0,
        2,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Boi",
        "Bem Comercial",
        15,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sela de Carga",
        "Arreios e Selas",
        5,
        15,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura Acolchoada",
        "Armadura Leve",
        5,
        8,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Suprimentos de Pintor",
        "Ferramentas de Artesão",
        10,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tintura Pálida",
        "Equipamento de Aventura, Veneno",
        250,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Flauta de Pã",
        "Instrumento Musical",
        12,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Papel",
        "Equipamento de Aventura",
        0.2, // 2 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pergaminho",
        "Equipamento de Aventura",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pimenta",
        "Bem Comercial",
        2,
        1,
        "Comum",
        false,
        ""
    ),

    // Tabela 21 (Perfume até Pole)
    new Itens(
        "Perfume",
        "Equipamento de Aventura",
        5,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Porco",
        "Bem Comercial",
        3,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pique",
        "Arma Marcial, Arma de Corpo a Corpo",
        5,
        18,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pistola",
        "Arma Marcial, Arma de Longo Alcance, Arma de Fogo",
        250,
        3,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Jarro",
        "Equipamento de Aventura",
        0.02, // 2 cp
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pitão",
        "Equipamento de Aventura",
        0.05, // 5 cp
        0.25, // ¼ lb
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga do Filósofo Planar",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Placas",
        "Armadura Pesada",
        1500,
        65,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Platina (barra)",
        "Bem Comercial",
        500,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Baralho",
        "Kit de Jogo",
        0.5, // 5 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Envenenador",
        "Ferramenta",
        50,
        2,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poste",
        "Equipamento de Aventura",
        0.05, // 5 cp
        7,
        "Comum",
        false,
        ""
    ),

    // Tabela 22 (Pony até Rapier)
    new Itens(
        "Pônei",
        "Montaria",
        30,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Aríete Portátil",
        "Equipamento de Aventura",
        4,
        35,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Oleiro",
        "Ferramentas de Artesão",
        10,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bolsa",
        "Equipamento de Aventura",
        0.5, // 5 sp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Sacerdote",
        "Equipamento de Aventura",
        33,
        29,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Prismart",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Lâmina Psíquica",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Veneno de Verme Roxo",
        "Equipamento de Aventura, Veneno",
        2000,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Bugiganga de Quandrix",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cajado",
        "Arma Simples, Arma de Corpo a Corpo",
        0.2, // 2 sp
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Aljava",
        "Equipamento de Aventura",
        1,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Coletor de Chuva",
        "Equipamento de Aventura",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Rapieira",
        "Arma Marcial, Arma de Corpo a Corpo",
        25,
        2,
        "Comum",
        false,
        ""
    ),

    // Tabela 23 (Rations até Saddlebags)
    new Itens(
        "Rações (1 dia)",
        "Equipamento de Aventura",
        0.5, // 5 sp
        2,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Relicário",
        "Foco de Conjuração",
        5,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cavalo de Montaria",
        "Montaria",
        75,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sela de Montaria",
        "Arreios e Selas",
        10,
        25,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cota de Anéis",
        "Armadura Pesada",
        30,
        40,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Robe",
        "Equipamento de Aventura",
        1,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha",
        "Foco de Conjuração",
        10,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Corda (50 pés)",
        "Equipamento de Aventura",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Barco a Remo",
        "Veículo (Aquático)",
        50,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Raiz de Ryath",
        "Equipamento de Aventura",
        50,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Saco",
        "Equipamento de Aventura",
        0.01, // 1 cp
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Alforjes",
        "Arreios e Selas",
        4,
        8,
        "Comum",
        false,
        ""
    ),

    // Tabela 24 (Saffron até Shawn)
    new Itens(
        "Açafrão",
        "Bem Comercial",
        15,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Navio à Vela",
        "Veículo (Aquático)",
        10000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sal",
        "Bem Comercial",
        5,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Sarlona",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cota de Escamas",
        "Armadura Média",
        50,
        45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Kit de Estudioso",
        "Equipamento de Aventura",
        40,
        22,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cimitarra",
        "Arma Marcial, Arma de Corpo a Corpo",
        25,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Escorpião",
        "Veículo (Espacial)",
        25000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cera de Selar",
        "Equipamento de Aventura",
        0.5, // 5 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga de Secondhand Steal",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Veneno de Serpente",
        "Equipamento de Aventura, Veneno",
        200,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Graveto Estilhaçado",
        "Outro",
        0,
        4,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Shawn (Instrumento Élfico)",
        "Instrumento Musical",
        2,
        1,
        "Incomum",
        false,
        ""
    ),

    // Tabela 25 (Sheep até Silver)
    new Itens(
        "Ovelha",
        "Bem Comercial",
        2,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Escudo",
        "Escudo",
        10,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Arco Curto",
        "Arma Simples, Arma de Longo Alcance",
        25,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Espada Curta",
        "Arma Marcial, Arma de Corpo a Corpo",
        10,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pá",
        "Equipamento de Aventura",
        2,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Shrike",
        "Veículo (Espacial)",
        20000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Foice",
        "Arma Simples, Arma de Corpo a Corpo",
        1,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Apito de Sinalização",
        "Equipamento de Aventura",
        0.05, // 5 cp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Anel de Sinete",
        "Equipamento de Aventura",
        5,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Seda (1 m²)",
        "Bem Comercial",
        10,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Corda de Seda (50 pés)",
        "Equipamento de Aventura",
        10,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Prata (barra)",
        "Bem Comercial",
        5,
        1,
        "Comum",
        false,
        ""
    ),

    // Tabela 26 (Silvered Ammunition até Snowshoes)
    new Itens(
        "Munição Prateada",
        "Munição, Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Bugiganga de Silverquill",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Bagas de Sinda (10)",
        "Equipamento de Aventura",
        5,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Trenó",
        "Veículo (Terrestre)",
        20,
        300,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cão de Trenó",
        "Montaria",
        50,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Marreta",
        "Equipamento de Aventura",
        2,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Granada de Sono",
        "Explosivo",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Funda",
        "Arma Simples, Arma de Longo Alcance",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Projétil de Funda (unidade)",
        "Munição",
        0.002, // 0.2 cp
        0.075, // 1.2 oz ≈ 0.075 lb
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Projéteis de Funda (20)",
        "Munição",
        0.04, // 4 cp
        1.5,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Ferramentas de Ferreiro",
        "Ferramentas de Artesão",
        20,
        8,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Granada de Fumaça",
        "Explosivo",
        50,
        2,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Sapatos de Neve",
        "Equipamento de Aventura",
        2,
        4,
        "Comum",
        false,
        ""
    ),

    // Tabela 27 (Soap até Staff)
    new Itens(
        "Sabão",
        "Equipamento de Aventura",
        0.02, // 2 cp
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Songhorn (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Galé Espacial",
        "Veículo (Espacial)",
        30000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Lança",
        "Arma Simples, Arma de Corpo a Corpo",
        1,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Livro de Feitiços",
        "Equipamento de Aventura",
        50,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Espinhos",
        "Armadura Média",
        75,
        45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Lâminas",
        "Armadura Pesada",
        200,
        60,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ramo de Visco",
        "Foco de Conjuração",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Telescópio",
        "Equipamento de Aventura",
        1000,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Nave Lula",
        "Veículo (Espacial)",
        25000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estabulamento (por dia)",
        "Arreios e Selas",
        0.05, // 5 cp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cajado",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        5,
        4,
        "Comum",
        false,
        ""
    ),

    // Tabela 28 (Star Moth até Tinderbox)
    new Itens(
        "Mariposa Estelar",
        "Veículo (Espacial)",
        40000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Corda",
        "Equipamento de Aventura",
        0.1, // 1 sp
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Couro Batido",
        "Armadura Leve",
        45,
        13,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Manto de Sobrevivência",
        "Armadura Média",
        0,
        40,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Granada de Emaranhamento",
        "Outro",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Caneco",
        "Equipamento de Aventura",
        0.02, // 2 cp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tantan (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tej (Bebida Élfica)",
        "Comida e Bebida",
        0,
        5,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Tenda",
        "Equipamento de Aventura",
        2,
        20,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "As Incantações de Inolarthas",
        "Equipamento de Aventura",
        0,
        3,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Thelarr (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Ladrão",
        "Ferramenta",
        25,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Conjunto de Três Dragões Ante",
        "Kit de Jogo",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Caixa de Isqueiros",
        "Equipamento de Aventura",
        0.5, // 5 sp
        1,
        "Comum",
        false,
        ""
    ),

    // Tabela 29 (Tinderbox até Trinket)
    new Itens(
        "Caixa de Isqueiros",
        "Equipamento de Aventura",
        0.5, // 5 sp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Tinker",
        "Ferramentas de Artesão",
        50,
        10,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tocken (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tomo de Strahd",
        "Equipamento de Aventura",
        0,
        5,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Tocha",
        "Equipamento de Aventura",
        1,
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Torpor",
        "Equipamento de Aventura, Veneno",
        800,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Totem",
        "Foco de Conjuração",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Roupas de Viajante",
        "Equipamento de Aventura",
        2,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tridente",
        "Arma Marcial, Arma de Corpo a Corpo",
        5,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Genérica",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Genérica",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Genérica",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Bugiganga Genérica",
        "Equipamento de Aventura",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 30 (Truth Serum até Warship)
    new Itens(
        "Soro da Verdade",
        "Equipamento de Aventura, Veneno",
        150,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Nave Tartaruga",
        "Veículo (Espacial)",
        40000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Nave Tirana",
        "Veículo (Espacial)",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Frasco",
        "Equipamento de Aventura",
        1,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Frasco de Poeira Estelar",
        "Outro",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Viola",
        "Instrumento Musical",
        30,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carroça",
        "Veículo (Terrestre)",
        35,
        400,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha",
        "Foco de Conjuração",
        10,
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Picareta de Guerra",
        "Arma Marcial, Arma de Corpo a Corpo",
        5,
        2,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Wargong (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Martelo de Guerra",
        "Arma Marcial, Arma de Corpo a Corpo",
        15,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cavalo de Guerra",
        "Montaria",
        400,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Navio de Guerra",
        "Veículo (Aquático)",
        25000,
        0,
        "Comum",
        false,
        ""
    ),

    // Tabela 31 (Warship até Wukka Nut)
    new Itens(
        "Navio de Guerra",
        "Veículo (Aquático)",
        25000,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Nave Vespa",
        "Veículo (Espacial)",
        20000,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Odre",
        "Equipamento de Aventura",
        2,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Tecelão",
        "Ferramentas de Artesão",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Trigo",
        "Bem Comercial",
        0.01, // 1 cp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pedra de Amolar",
        "Equipamento de Aventura",
        0.01, // 1 cp
        1,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Chicote",
        "Arma Marcial, Arma de Corpo a Corpo",
        2,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Semente de Orquídea Fantasma Branca",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Wildroot (Planta Mágica)",
        "Equipamento de Aventura",
        25,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Bugiganga de Witherbloom",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Ferramentas de Entalhador",
        "Ferramentas de Artesão",
        1,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cajado de Madeira",
        "Arma Simples, Foco de Conjuração",
        5,
        4,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Noz de Wukka",
        "Equipamento de Aventura",
        1,
        0,
        "Incomum",
        true,
        ""
    ),

    // Tabela 32 (Wyvern Poison até Zulkoon)
    new Itens(
        "Veneno de Wyvern",
        "Equipamento de Aventura, Veneno",
        1200,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Bugiganga de Xen'drik",
        "Equipamento de Aventura",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Yahcha (Item Élfico)",
        "Equipamento de Aventura",
        1,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Yarting (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Teixo",
        "Foco de Conjuração",
        10,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Yikwa (Arma Élfica)",
        "Arma Simples, Arma de Corpo a Corpo",
        1,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Zabou (Item Élfico)",
        "Equipamento de Aventura",
        10,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Zulkoon (Instrumento Élfico)",
        "Instrumento Musical",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    // +1 Items
    new Itens(
        "Ferramenta Multiuso +1",
        "Item Maravilhoso",
        0,
        0, // Weight: —
        "Incomum",
        true, // Attunement
        ""
    ),
    new Itens(
        "Munição +1",
        "Munição, Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Anuleto do Devoto +1",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Grimório Arcano +1",
        "Item Maravilhoso",
        0,
        3,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura +1",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Frasco do Poço Sanguíneo +1",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cinto de Couro de Dragão +1",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Baralho do Destino +1",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Foice Lunar +1",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Tambor do Criador de Ritmo +1",
        "Item Maravilhoso, Instrumento",
        0,
        3,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado do Guardião do Pacto +1",
        "Cajado",
        0,
        2,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Escudo +1 (*)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha do Mago de Guerra +1",
        "Varinha",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Arma +1",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Arma +1 (sem dano)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Bandagens do Poder Desarmado +1",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),

    // +2 Items
    new Itens(
        "Ferramenta Multiuso +2",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Munição +2",
        "Munição, Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anuleto do Devoto +2",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Grimório Arcano +2",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura +2",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Frasco do Poço Sanguíneo +2",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cinto de Couro de Dragão +2",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Baralho do Destino +2",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Foice Lunar +2",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tambor do Criador de Ritmo +2",
        "Item Maravilhoso, Instrumento",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado do Guardião do Pacto +2",
        "Cajado",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo +2 (*)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha do Mago de Guerra +2",
        "Varinha",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arma +2",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Arma +2 (sem dano)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Bandagens do Poder Desarmado +2",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),

    // +3 Items
    new Itens(
        "Ferramenta Multiuso +3",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Munição +3",
        "Munição, Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Anuleto do Devoto +3",
        "Item Maravilhoso",
        0,
        1,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Grimório Arcano +3",
        "Item Maravilhoso",
        0,
        3,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura +3",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Frasco do Poço Sanguíneo +3",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cinto de Couro de Dragão +3",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Baralho do Destino +3",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Foice Lunar +3",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tambor do Criador de Ritmo +3",
        "Item Maravilhoso, Instrumento",
        0,
        3,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado do Guardião do Pacto +3",
        "Cajado",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo +3 (*)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha do Mago de Guerra +3",
        "Varinha",
        0,
        1,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Arma +3",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Arma +3 (sem dano)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Bandagens do Poder Desarmado +3",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),

    // Other Magical Items
    new Itens(
        "Abracadabrus",
        "Item Maravilhoso",
        0,
        25,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem Absorvente",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Absorvedora de Ácido",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Armadura de Adamante",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Arma de Adamante",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Enxó de Annam",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        7,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Akmon, Martelo de Purphoros",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Compêndio Alquímico",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Jarra Alquímica",
        "Item Maravilhoso",
        0,
        12,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Jarra Alquímica (Azul)",
        "Item Maravilhoso",
        0,
        12,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Jarra Alquímica (Laranja)",
        "Item Maravilhoso",
        0,
        12,
        "Incomum",
        false,
        ""
    ),
    // Jarra Alquímica e Itens Relacionados
    new Itens(
        "Jarra Alquímica (Laranja)",
        "Item Maravilhoso",
        0,
        12,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Magnetita de Ametista",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Munição de Aniquilação",
        "Munição, Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anuleto de Saúde",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anuleto à Prova de Detecção e Localização",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anuleto de Proteção contra Virada",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anuleto da Caveira Negra",
        "Item Maravilhoso",
        0,
        1,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anuleto dos Planos",
        "Item Maravilhoso",
        0,
        1,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo Animado",
        "Escudo",
        0,
        6,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Antimagia",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Aparelho de Kwalish",
        "Item Maravilhoso",
        0,
        500,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Caixa de Música do Arcanaloth",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Braço de Propulsão Arcana",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Lâmina de Braço",
        "Variante Genérica",
        0,
        0,
        "Conectável",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Ácido",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),

    // Armaduras de Resistência
    new Itens(
        "Armadura de Resistência a Trovão",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Vulnerabilidade",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Vulnerabilidade (Concussão)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Vulnerabilidade (Perfuração)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Vulnerabilidade (Corte)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura da Leveza",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Escudo Capturador de Flechas",
        "Escudo",
        0,
        6,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Vaso do Dragão Ascendente",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Arma da Ira do Dragão Ascendente",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Foco Tocado pelo Dragão Ascendente",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Ornamento Escamoso Ascendente",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Fragmento Astral",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arquivo de Astronomia",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Atlas dos Horizontes Infinitos",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),

    // Cinturões de Força de Gigante
    new Itens(
        "Cinturão da Força do Gigante das Nuvens",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Cinturão do Povo Anão",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante de Fogo",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante de Gelo",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante da Colina",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante de Pedra",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cinturão da Força do Gigante da Tempestade",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Machado Berserker",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Bracelete Beneficente de Bigby",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Rosa Cromática Negra",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tabuleta de Cristal Negra",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Máscara do Dragão Negro",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão Negro",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Blackrazor",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        6,
        "Artefato",
        true,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Carta do Equilíbrio",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Equilíbrio da Harmonia",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Garra Funesta",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Mochila de Balões",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Estandarte da Runa Krig",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Barreira (Grande)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Barreira (Média)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Barreira (Pequena)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Estandarte de Batalha do Poder Interno",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Conta de Força",
        "Item Maravilhoso",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Conta de Nutrição",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Conta de Refresco",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Coroa do Observador de Belashyra",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Ramo de Sinos",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),

    // Itens do Boros e outros
    new Itens(
        "Chave-runa do Boros",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Garrafa de Café Infinito",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sopro Engarrafado",
        "Poção",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Arco da Conflagração",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arco das Melodias",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tigela de Comando de Elementais da Água",
        "Item Maravilhoso",
        0,
        24,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Bracelete da Magia da Rocha",
        "Item Maravilhoso",
        0,
        1,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Braçadeira dos Adagas Voadoras",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Braçadeiras de Arqueirismo",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Braçadeiras da Celeridade",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Braçadeiras de Defesa",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão de Bronze",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Brasão de Comando de Elementais do Fogo",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Peitoral do Equilíbrio",
        "Armadura Média",
        0,
        20,
        "Raro",
        true,
        ""
    ),

    // Itens de Voo e outros
    new Itens(
        "Broche de Blindagem",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Vassoura Voadora",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Maça de Vela",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Vela de Invocação",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vela das Profundezas",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Capuz de Respiração Aquática",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Capa de Ampliação",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Capa do Mambembe",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Baralho do Trapaceiro",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tapete Voador",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tapete Voador (3 pés × 5 pés)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tapete Voador (4 pés × 6 pés)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tapete Voador (5 pés × 7 pés)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tapete Voador (6 pés × 9 pés)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Estojo de Mapas do Cartógrafo",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Armadura Descartável",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Caldeirão da Abundância",
        "Item Maravilhoso",
        0,
        50,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Caldeirão do Renascimento",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Candeiro de Controle de Elementais do Ar",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Dado do Charlatão",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Amuleto de Comando de Plantas",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Varinha Carbonizada de Mísseis Mágicos",
        "Varinha",
        0,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Baú da Preservação",
        "Item Maravilhoso",
        0,
        25,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sino do Exílio",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Sino de Abertura",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Rosa Cromática",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cromolômetro",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Coroa de Mentiras",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Coroa do Arauto da Fúria",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Coroa dos Cometas Giratórios",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),

    // Itens de Cristal
    new Itens(
        "Espada Curta do Cruzado",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Bola de Cristal",
        "Item Maravilhoso",
        0,
        3,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Bola de Cristal (Versão Lendária)",
        "Item Maravilhoso",
        0,
        3,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Bola de Cristal da Leitura Mental",
        "Item Maravilhoso",
        0,
        3,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Bola de Cristal da Telepatia",
        "Item Maravilhoso",
        0,
        3,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Bola de Cristal da Visão Verdadeira",
        "Item Maravilhoso",
        0,
        3,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Lâmina de Cristal",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Crônica Cristalina",
        "Item Maravilhoso",
        0,
        3,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Cubo de Força",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cubo de Invocação",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Portal Cúbico",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Mascote Fofo de Strixhaven",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pedra da Sorte Amaldiçoada",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Fortaleza Instantânea de Daern",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Adaga da Visão às Cegas",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Raro",
        true,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Adaga dos Solos de Guitarra",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Adaga de Veneno",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Fruta do Macaco Dançante",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Espada Dançante",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Lanterna Maravilhosa de Daoud",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Anuleto do Fragmento Sombrio",
        "Item Maravilhoso",
        0,
        1,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Destruidor",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Decantador de Água Infinita",
        "Item Maravilhoso",
        0,
        2,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Baralho das Dimensões",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Baralho de Ilusões",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Baralho de Muitas Coisas a Mais",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Baralho de Muitas Coisas",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Baralho de Variedades",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Baralho dos Oráculos",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Baralho de Cartas Selvagens",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),

    // Itens de Dragão
    new Itens(
        "Cota de Escamas de Dragão",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Espada Longa de Detecção de Dragão",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Matador de Dragões",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Clava de Fêmur de Dragão",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        250,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Vaso do Dragão",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Arco de Asa de Dragão",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arma da Ira do Dragão",
        "Variante Genérica",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Foco Tocado pelo Dragão",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Brilho de Dragão",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        3,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Guarda Dragão",
        "Armadura Média",
        0,
        20,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Lança Dragônica",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cajado Dragônico de Ahghairon",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Adaga de Dente de Dragão",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Elmo do Pavor",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sanguessuga Seca",
        "Munição, Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Amuleto de Relógio",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Relógio",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cão de Relógio",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Roupas de Remendo",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem de Garra Enrolada",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Moeda da Decisão",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção de Frio",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Cometa",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Amuleto de Comando",
        "Outro",
        0,
        1,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Glamourweave Comum",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Concha de Teletransporte",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Retrato de Constantino",
        "Item Maravilhoso",
        0,
        15,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão de Cobre",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Globo Flutuante Rachado",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cajado de Ruo",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),

    // Itens de Devastação
    new Itens(
        "Orbe de Devastação de Fogo",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Orbe de Devastação de Água",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Cajado de Golpear de Devlin",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Candeiro de Devolee",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Laço Dimensional",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Grilhões Dimensionais",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Dimir",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Chave-runa do Dimir",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Docent",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pasta de Documentos",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Dodecaedro da Perdição",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Carta do Calabouço",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Esfera de Ruptura de Donjon",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Corneta Dragônica",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Espada Longa Dragônica",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Blackstaff",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Lâmina de Avernus",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Cetro da Explosão",
        "Varinha",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Óculos Explodidos",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pedra de Sangue",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem da Fúria de Sangue",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Lança de Sangue",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        3,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Machado Grande da Fúria Sanguinária",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        7,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Munição Sedenta de Sangue",
        "Munição, Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Lâmina do Derramamento de Sangue",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Rosa Cromática Azul",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Máscara do Dragão Azul",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão Azul",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Bob",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        4,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Frio",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Armadura de Resistência a Fogo",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Força",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Esporos Fúngicos",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Armadura Brilhante",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Armadura da Invulnerabilidade",
        "Armadura Pesada",
        0,
        65,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Relâmpagos",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Necrótico",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Veneno",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Psíquico",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência a Radiante",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Resistência",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura da Salvaguarda",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura dos Caídos",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Atlas dos Horizontes Infinitos",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Machado dos Lordes Anões",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        4,
        "Artefato",
        true,
        ""
    ),

    // Itens Diversos
    new Itens(
        "Sinete da Guilda Azorius",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Chave-runa do Azorius",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Azuredge",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        4,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Vassoura Dançante de Baba Yaga",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pilão e Almofariz de Baba Yaga",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Pilão de Baba Yaga",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Distintivo da Vigia",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Saco de Feijões",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Saco de Devoção",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Saco de Holding",
        "Item Maravilhoso",
        0,
        5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques, Cinza",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques, Ferrugem",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques, Bege",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques, Branco",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Saco de Truques, Verde",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Globo Flutuante",
        "Item Maravilhoso",
        0,
        0.45, // 1 lb = ~0.45 kg
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Armadura Élfica +1",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Arma Élfica +1",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Armadura Élfica +2",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Arma Élfica +2",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Armadura Élfica +3",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Arma Élfica +3",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Chicote de Tentáculo de Dyrm",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.36, // 3 lb = ~1.36 kg
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Apito de Águia",
        "Item Maravilhoso",
        0,
        0.45, // 1 lb = ~0.45 kg
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Gema Elemental",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Gema Elemental (Safira Azul)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Elixir da Saúde",
        "Poção",
        0,
        0.23, // 0.5 lb = ~0.23 kg
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cota Élfica",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Arremessador Élfico",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1.36, // 3 lb = ~1.36 kg
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada",
        "Variante Genérica",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Truque)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 1)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 2)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 3)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 4)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 5)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 6)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 7)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Armadura Encantada (Nível 8)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81, // 4 lb = ~1.81 kg
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Truque)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 1)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 2)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 3)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 4)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 5)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 6)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 7)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cajado Encantado (Nível 8)",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada",
        "Variante Genérica",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Truque)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 1)",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 2)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 3)",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 4)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 5)",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 6)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 7)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Arma Encantada (Nível 8)",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Ephixis, Arco de Mylea",
        "Arma Simples, Arma de Alcance",
        0,
        0.91, // 2 lb = ~0.91 kg
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Olho Ersatz",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carta de Entryal",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Escudo de Euryale",
        "Escudo",
        0,
        2.72, // 6 lb = ~2.72 kg
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Lanterna Everbright",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Garrafa de Fumaça Perpétua",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Machado do Carrasco",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Olho e Mão de Vecna",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Olho de Vecna",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Olhos do Encantamento",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Olhos da Visão Minuciosa",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Olhos da Águia",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Gema Fabutista",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pó de Fada",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Varinha de Experimento Falhado",
        "Varinha",
        0,
        0.45, // 1 lb = ~0.45 kg
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Elmo da Teimosia de Falkir",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Devorador de Fanes",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.81, // 4 lb = ~1.81 kg
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Engrenagem Distante",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço do Plano Elemental",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tesouras Corta-Destino",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        0.45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Destino",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pena de Invocação de Diatryma",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pena Token",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Estilhaço do Feywild",
        "Item Maravilhoso",
        0,
        0.45,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura Feérica",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Grifo de Bronze)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Mosca de Ébano)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Leões Dourados)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Cabras de Marfim)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Elefante de Mármore)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Corcel de Obsidiana)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Cão de Ônix)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Coruja Serpentina)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Poder Maravilhoso (Corvo de Prata)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Óculos do Localizador",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção de Fogo",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Traje de Peixe",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Flâmula de Tiamat",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        0.91, // 2 lb = ~0.91 kg
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Língua de Fogo",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Espada Curta Língua de Fogo da Ganância",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        0.91,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Carta das Chamas",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Matador de Flageladores",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3.18, // 7 lb = ~3.18 kg
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carruagem Voadora",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo da Cidadela Voadora",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Barco Dobrável",
        "Item Maravilhoso",
        0,
        1.81, // 4 lb = ~1.81 kg
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Pé",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Lâmina do Pé",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção de Força",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Arma Quebrador de Força",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Marca Gélida",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tratado Fulminante",
        "Item Maravilhoso",
        0,
        1.36, // 3 lb = ~1.36 kg
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Manoplas da Fúria Flamejante",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Manoplas do Poder Oculto",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Gema Elemental (Esmeralda)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Gema Elemental (Coríndon Vermelho)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Gema Elemental (Diamante Amarelo)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Caneta de Esmeralda",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Livro de Feitiços Durável",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Arco de Energia",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Chifre de Escuta",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Verme Auditivo",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Garrafa de Efreeti",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Corrente de Efreeti",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Glossografia do Cartógrafo Ancião",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem de Garra Sobrenatural",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado Sobrenatural",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Elemental",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Elemental (Ar)",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Elemental (Terra)",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Elemental (Fogo)",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Elemental (Água)",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pó de Corrosão",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pó de Desaparecimento",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pó de Secura",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pó de Espirros e Engasgos",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Placa Anã",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Arremessador Anão",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2.27, // 5 lb = ~2.27 kg
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Manuscrito Duplicador",
        "Item Maravilhoso",
        0,
        1.36,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Lâmina do Louco",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço do Reino Distante",
        "Item Maravilhoso",
        0,
        0.45,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Flâmula de Tiamat",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        0.91,
        "Lendário",
        true,
        ""
    ),
    // Primeira parte dos itens
    new Itens(
        "Manoplas de Poder de Ogro",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Malho da Runa Venn",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carta de Gema",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Gema de Brilho",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Gema da Visão",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Lanterna Fantasma",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem do Passo Fantasma",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Matador de Gigantes",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Tecido de Ilusão",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Couro Batido Glamoroso",
        "Armadura Leve",
        0,
        13,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Arco Lunar Cintilante",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Gloomwrought",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Luvas de Aparar Mísseis",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Luvas de Captura de Alma",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Luvas de Natação e Escalada",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Máscara do Dragão Verde",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas de Dragão Verde",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Gruul",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Gruul",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Emblema do Guardião",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune de Guilda",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Sinete de Guilda",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado de Guthitas",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Machado Grande de Gurf",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        325,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Olho de Bruxa",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Martelo do Foco Rúnico",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Martelo dos Trovões",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Rede de Mundos",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Mão de Vecna",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Mordida de Harkon",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Harpa da Abundância Dourada",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Chapéu do Disfarce",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Chapéu de Muitos Feitiços",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Chapéu de Vernin",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Chapéu da Feitiçaria",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Hazirawn",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        6,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Bandana do Intelecto",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Primer do Tecelão de Corações",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra do Coração",
        "Outro",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Manto do Cão Infernal",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Arma do Fogo Infernal",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Elmo do Brilho",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo da Compreensão de Idiomas",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Elmo do Comando de Demônios",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo do Potencial Perfeito",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Item do Potencial Perfeito",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Elmo da Telepatia",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Elmo do Teletransporte",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo dos Deuses",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo do Catador",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Elmo da Ação Subaquática",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Herético",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Hew",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        4,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Algibeira Mágica de Heward",
        "Item Maravilhoso",
        0,
        5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pote de Especiarias Mágico de Heward",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vingador Sagrado",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Símbolo Sagrado de Ravenkind",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Gancho do Prazer do Pescador",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cubo Quebra-Cabeça do Horizonte",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Corneta da Explosão",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Corneta do Alarme Silencioso",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Corneta do Labirinto Infinito",
        "Item Maravilhoso",
        0,
        2,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Corneta de Valhalla",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Corneta de Valhalla (Latão)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Corneta de Valhalla (Bronze)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Corneta de Valhalla (Ferro)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Corneta de Valhalla (Prata)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel Chifrudo",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Ferraduras do Zéfiro",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Ferraduras da Velocidade",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Casa de Cartas",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Ícone de Ravenloft",
        "Item Maravilhoso",
        0,
        10,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Caldeirão de Iggwilv",
        "Item Maravilhoso",
        0,
        80,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Chifre de Iggwilv",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem do Iluminador",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Braceletes do Ilusionista",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Cinza Fernian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Pau-rosa Irian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Máquina Kythrian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Carvalho Lamannian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Ébano Maharan)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Pinho Risian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Bétula Shavarran)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Madeira Imbuída (Wenge Xorian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Foco de Madeira Imbuída",
        "Item Maravilhoso, Foco de Conjuração",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Vara Inamovível",
        "Vara",
        0,
        2,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Caixa de Quebra-Cabeça Interna",
        "Item Maravilhoso",
        0,
        3,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tack Interno",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Barra da Runa Skold",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Insígnia das Garras",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Instrumento das Ilusões",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Instrumento da Escrita",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Harpa Anstruth)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Bandolim Canatth)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Lira Cith)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Alaúde Doss)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Bandolim Fochlucan)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Cítara Mac-Fuirmidh)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Instrumento dos Bardos (Harpa Ollamh)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Absorção",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Agilidade",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Consciência",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Fortitude",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Absorção Maior",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Intuição",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Intelecto",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Liderança",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Maestria",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Proteção",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Regeneração",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Reserva",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Força",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra Ioun de Sustento",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cintas de Ferro de Bilarro",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Frasco de Ferro",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Ironfang",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Izzet",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Izzet",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado da Serpente de Jade",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Cajado de Gelo de Jakariom",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Dardo da Traição",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Dardo do Relâmpago",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Carta do Bobo",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Máscara do Bobo",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Adaga +1 Junky",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Manto da Floresta Kagonesti",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pomada de Keoghtom",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Carta da Chave",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Amuleto da Chave",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Khrusor, Lança de Heliod",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        3,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Tapa-olho do Patife",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Cavaleiro",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cetro de Korolnor",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Lodo de Kyran",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Lanterna da Revelação",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Lanterna do Rastreamento",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Chicote da Imolação",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Rede de Mundos Menor",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Livro das Almas e da Carne",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem do Poço de Vida",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Portadora da Luz",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção de Relâmpago",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura Viva",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Luvas Vivas",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Saco de Saque Vivo",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Pedra de Carga",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Fechadura da Trapaça",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Arco Longo do Lar Curativo",
        "Arma Marcial, Arma de Alcance",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Traje do Lorde",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Primer de Lorehold",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Coroa Perdida de Besilmer",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Tarokka de Almas de Luba",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Lâmina da Sorte",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Picareta de Guerra Luminosa",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Alaúde do Trovejar Trovejante",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        2,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Lira da Construção",
        "Item Maravilhoso, Instrumento",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Maça da Ruptura",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Maça da Destruição",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Maça do Terror",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Macuahuitl",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Elmo de Maddgott",
        "Outro",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Manto da Resistência a Magia",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Manual da Saúde Corporal",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual dos Golems de Barro",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual dos Golems de Carne",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual do Exercício Lucrativo",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual dos Golems",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual dos Golems de Ferro",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual da Rapidez de Ação",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Manual dos Golems de Pedra",
        "Item Maravilhoso",
        0,
        5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Armadura do Marinheiro",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Máscara da Fera",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Máscara da Rainha dos Dragões",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Amuleto de Máscara",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem de Mascarado",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Mashx, Chicote de Érebos",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Matalotok",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Medalhão dos Pensamentos",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Servo Poderoso de Leuk-o",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Minnir",
        "Item Maravilhoso",
        0,
        5,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Lâmina Mental",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Carapaça Mental",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cristal Mental",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Cuidadoso)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Distante)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Empoderado)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Estendido)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Elevado)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Acelerado)",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cristal Mental (Sutil)",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Crânio de Mind Flayer",
        "Outro",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Chicote Mental",
        "Arma de Corpo a Corpo",
        0,
        3,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Chapéu da Explosão Mental",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Coroa do Guardião Mental",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Espelho de Aprisionamento de Vida",
        "Item Maravilhoso",
        0,
        50,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Espelho dos Passados Refletidos",
        "Item Maravilhoso",
        0,
        25,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Espelho do Passado",
        "Item Maravilhoso",
        0,
        1,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Manto do Mistral",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Mithril +1",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Armadura de Mithril",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Aparelho de Mizzium",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura de Mizzium",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Argamassa de Mizzium",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pele de Bronze Derretido",
        "Variante Genérica",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tinta do Humor",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carta da Lua",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Espada Tocada pela Lua",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lâmina Lunar",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Torre de Lama",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Orbe de Murgaxor",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Chave Misteriosa",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Manto da Natureza",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Orbe de Navegação",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Colar de Adaptação",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Colar de Bola de Fogo",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Colar de Contas de Oração",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção Necrótica",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Nepenthe",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pergaminho Nether de Azumar",
        "Pergaminho",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel de Proteção Netherese",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Chamador Noturno",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Coroa de Nimbus",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Ladrão de Nove Vidas",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pigmentos Maravilhosos de Noizur",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Arco do Juramento",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Placa de Dragão de Obsidiana",
        "Armadura Pesada",
        0,
        65,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Lentes do Obturador",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Ábaco Ocultante",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Óleo da Etherealidade",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Óleo da Nitidez",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Óleo da Escorregadia",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Opala da Runa Ild",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Orbe da Direção",
        "Item Maravilhoso",
        0,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Orbe dos Dragões",
        "Item Maravilhoso",
        0,
        3,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Orbe do Gong",
        "Item Maravilhoso",
        0,
        5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Orbe da Proteção",
        "Item Maravilhoso, Foco de Conjuração",
        0,
        3,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Basalto Fernian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Quartzo Irian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Skarn Kythrian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Sílex Lamannian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Obsidiana Mabaran)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Xisto Risian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Chert Shavarran)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe da Proteção (Mármore Xorian)",
        "Item Maravilhoso, Variante Genérica",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Orbe de Skoraeus",
        "Item Maravilhoso",
        0,
        8,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Orbe da Runa Stein",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Orbe do Tempo",
        "Item Maravilhoso",
        0,
        3,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pedra Orc",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cuspideira de Orc",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        7,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Estatueta de Orcus",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Ornitóptero de Voo",
        "Item Maravilhoso",
        0,
        25,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Orrery do Viajante",
        "Item Maravilhoso, Outro",
        0,
        0,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Orzhov",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Orzhov",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência de Lontra",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Externa",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Externa (Caótico)",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Externa (Mal)",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Externa (Bem)",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Essência Externa (Leal)",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pássaro de Papel",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Escudo do Pária",
        "Escudo",
        0,
        6,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Machado Grande do Desbravador",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        7,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Pérola do Poder",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pérola da Detecção de Mortos-Vivos",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Estandarte da Runa Vind",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Máscara do Peregrino",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Perfume do Encantamento",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Amuleto da Saúde",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Amuleto à Prova de Veneno",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Amuleto à Prova de Veneno",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Amuleto do Fechamento de Feridas",
        "Item Maravilhoso",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Ovo Petrificado de Grung",
        "Outro",
        0,
        0,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Filtro do Amor",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Perfurador",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cachimbo da Lembrança",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cachimbo dos Monstros de Fumaça",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Flautas da Assombração",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Flautas dos Esgotos",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Piwafwi (Manto da Gentileza Élfica)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Piwafwi da Resistência ao Fogo",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pó de Fada",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Códice do Chamador de Planos",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura de Placa da Etherealidade",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Placa da Irmandade do Cavaleiro",
        "Armadura Pesada",
        0,
        65,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cachecol de Platina",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção de Veneno",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vara de Pesca",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Vara de Colapso",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Buraco Portátil",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Bússola do Portal",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Portfólio Guardião",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Pote do Despertar",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência a Ácido",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Vantagem",
        "Poção",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Amizade Animal",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Forma Aquosa",
        "Poção",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Clarividência",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Escalada",
        "Poção",
        0,
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante das Nuvens",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência ao Frio",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Compreensão",
        "Poção",
        0,
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Poção de Diminuição",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção da Majestade do Dragão",
        "Poção",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Poção de Sopro de Fogo",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante do Fogo",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência ao Fogo",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Voo",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência à Força",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante do Gelo",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção da Forma Gasosa",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção do Tamanho Gigante",
        "Poção",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Poção da Força do Gigante",
        "Poção",
        0,
        0.5,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Poção de Cura Superior",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Invisibilidade Superior",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Crescimento",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Cura",
        "Poção",
        0,
        0.5,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Poção de Cura",
        "Poção",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Poção do Heroísmo",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante da Colina",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Invisibilidade",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção da Invulnerabilidade",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência ao Relâmpago",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Longevidade",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção do Controle Mental",
        "Poção",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Poção do Controle Mental (besta)",
        "Poção",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção do Controle Mental (humanoide)",
        "Poção",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção do Controle Mental (monstro)",
        "Poção",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção da Leitura Mental",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência Necrótica",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Veneno",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção de Resistência a Veneno",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção do Policromismo",
        "Poção",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Fortitude Psíquica",
        "Poção",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Resistência Psíquica",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção do Pugilismo",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Resistência Radiante",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Resistência",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Velocidade",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante da Pedra",
        "Poção",
        0,
        0.5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poção de Força de Gigante da Tempestade",
        "Poção",
        0,
        0.5,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Poção da Cura Superior",
        "Poção",
        0,
        0.5,
        "Rare",
        false,
        ""
    ),
    new Itens(
        "Poção da Cura Suprema",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção da Resistência ao Trovão",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poção da Vitalidade",
        "Poção",
        0,
        0.5,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Poção do Descanso Vigilante",
        "Poção",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Poção da Respiração Aquática",
        "Poção",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Poções de Cura",
        "Poção",
        0,
        0.5,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Estatueta Maravilhosa Pré-Histórica",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Estatueta Maravilhosa Pré-Histórica (Triceratops de Cornalina)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta Maravilhosa Pré-Histórica (Tiranossauro Rex de Jaspe)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Estatueta Maravilhosa Pré-Histórica (Pteranodonte de Kyantie)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Estatueta Maravilhosa Pré-Histórica (Plesiossauro de Pirita)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cápsula de Pressão",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Projeto Primário",
        "Outro",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Primer do Prisioneiro",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Orbe do Professor",
        "Item Maravilhoso",
        0,
        5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Manto do Professor",
        "Item Maravilhoso",
        0,
        5,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Elmo do Propulsor",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Membro Prostético",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Versos Protetores",
        "Item Maravilhoso",
        0,
        3,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cristal de Estimação",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção Psíquica",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Quebra-Cabeça",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Piroconvergente",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pyxis do Pandemônio",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Âncora)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Pássaro)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Leque)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Barco Cisne)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Árvore)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pena Token de Quaal (Chicote)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Primer de Quandrix",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Cajado do Acrobata",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Aljava de Ehlonna",
        "Item Maravilhoso",
        0,
        2,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Radiance",
        "Varinha",
        0,
        0,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Tatuagem de Absorção Radiante",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Rakdos",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Rakdos",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Faca Ritual Rakdos",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Grito do Ceifador",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        4,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Rosa Cromática Vermelha",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Máscara do Dragão Vermelho",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas do Dragão Vermelho",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Reszur",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Concertina do Festeiro",
        "Item Maravilhoso, Instrumento",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Resistência a Ácido",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Amizade",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Influência Animal",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Resistência ao Frio",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Convocação de Djinni",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel do Comando Elemental",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel do Comando Elemental (Ar)",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel do Comando Elemental (Terra)",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel do Comando Elemental (Fogo)",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel do Comando Elemental (Água)",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel da Evasão",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel do Exterior",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Queda Suave",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Resistência ao Fogo",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência à Força",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Ação Livre",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel da Invisibilidade",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anel do Salto",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência ao Relâmpago",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anel da Proteção Mental",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência Necrótica",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência a Veneno",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Proteção",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência Psíquica",
        "Anel",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Anel da Sagacidade do Rouxinol",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência Radiante",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Regeneração",
        "Anel",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Anel da Regeneração",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anel da Resistência",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel das Estrelas Cadentes",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anel do Armazenamento de Magia",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel do Retorno de Magia",
        "Anel",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Anel da Natação",
        "Anel",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Anel da Telecinesia",
        "Anel",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Anel do Orador",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anel do Carneiro",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Anel dos Três Desejos",
        "Anel",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Anel da Resistência ao Trovão",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel da Verdade",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anel do Calor",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Anel da Caminhada sobre a Água",
        "Anel",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Anel do Inverno",
        "Anel",
        0,
        1,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Anel da Visão de Raio-X",
        "Anel",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Moeda Rival",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Manto dos Olhos",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Manto das Cores Cintilantes",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Manto das Serpentes",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Manto das Estrelas",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Manto do Verão",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Manto do Arquimago",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Manto de Itens Úteis",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Vara da Absorção",
        "Vara",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vara da Alerta",
        "Vara",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vara das Chamas Infernais",
        "Vara",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vara do Poder Senhorial",
        "Vara",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Vara da Ressurreição",
        "Vara",
        0,
        2,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Vara do Governo",
        "Vara",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Vara da Segurança",
        "Vara",
        0,
        2,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Vara das Sete Partes",
        "Arma Simples, Vara",
        0,
        4,
        "Artefato",
        true,
        ""
    ),
    new Itens(
        "Vara do Guardião do Pacto",
        "Vara",
        0,
        2,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Vara do Vomindod",
        "Vara",
        0,
        100,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carta do Ladino",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Manto do Ladino",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Corda da Escalada",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Corda do Emaranhamento",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Corda do Remendo",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Rotador do Retorno",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Rubi do Mago de Guerra",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Gema da Trama Rubi",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Carta do Rum",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Mangual Rumoso",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra do Rum",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Sela do Cavaleiro",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Carta do Sábio",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Urso)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Cervo)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Leão)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Serpente)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Pássaro Canoro)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Sinete do Sábio (Lobo)",
        "Anel",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Fêmur de Santa Markovia",
        "Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Amuleto do Santuário",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Broquel de Safira",
        "Escudo",
        0,
        6,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Ornamento Escamado",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Escaravelho da Proteção",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Escaravelho da Proteção",
        "Item Maravilhoso",
        0,
        1,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Cimitarra da Velocidade",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tesouras do Transporte das Sombras",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Armadura do Escorpião",
        "Armadura Pesada",
        0,
        65,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Caneta do Escriba",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Aberrações)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Bestas)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Celestiais)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Constructos)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Dragões)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Elementais)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Fadas)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Demônios)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Gigantes)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Humanoides)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Monstruosidades)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Lodos)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Plantas)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Proteção (Mortos-Vivos)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho do Cometa",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Senhor Animal)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Bolha da Aniquilação)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Colosso)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Cataclismo Elemental)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Empíreo)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Kraken)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pergaminho da Convocação de Titãs (Tarrasque)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Dardo Buscador",
        "Arma Simples, Arma de Alcance",
        0,
        0.25,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Estatueta de Adoração de Sekolah",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Sinete da Guilda Selesnya",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Selesnya",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Pedra de Envio",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pedras de Envio",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pedra Sensorial",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Escudo Sentinela",
        "Escudo",
        0,
        6,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Armadura de Escamas de Serpente",
        "Armadura Média",
        0,
        45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Presa da Serpente",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Tatuagem da Marca do Shadowfell",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço do Shadowfell",
        "Item Maravilhoso",
        0,
        1,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço da Runa Ise",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Estilhaço de Xeluan",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço (Safira Negra)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço (Diamante)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço (Jacinto)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço (Pérola Arco-Íris)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Solitaire do Estilhaço (Rubi)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Espada Estilhaçante",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        3,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Amuleto do Guardião de Escudo",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo da Expressão",
        "Escudo",
        0,
        6,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Escudo da Visão à Distância",
        "Escudo",
        0,
        6,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Escudo do Atraente de Mísseis",
        "Escudo",
        0,
        6,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo da Audiência Divina",
        "Escudo",
        0,
        6,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo do Grito",
        "Escudo",
        0,
        6,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Escudo do Dreadnought Ardente",
        "Escudo",
        0,
        6,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Escudo do Cavaleiro",
        "Escudo",
        0,
        6,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo do Senhor Oculto",
        "Escudo",
        0,
        6,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Escudo do Dragão de Prata",
        "Escudo",
        0,
        6,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Escudo do Jabuti",
        "Escudo",
        0,
        6,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Escudo da Runa Uven",
        "Escudo",
        0,
        6,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Tecido de Shirl",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        true,
        ""
    ),
    new Itens(
        "Grevas Gritantes",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Cota de Escamas do Dragão de Prata",
        "Armadura Média",
        0,
        45,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Espada de Prata",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        6,
        "Desconhecido",
        true,
        ""
    ),
    new Itens(
        "Arma Prateada",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Primer de Silverquill",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Sinete da Guilda Simic",
        "Anel",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Keyrune da Guilda Simic",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Lira do Canto da Sereia",
        "Item Maravilhoso, Instrumento",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Carta da Caveira",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Elmo da Caveira",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Cajado do Cegador Celeste",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Balas de Funda de Althemone",
        "Munição",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Funda do Derrubador de Gigantes",
        "Arma Simples, Arma de Alcance",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Sapatos da Escalada de Aranha",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Vaso do Dragão Adormecido",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Arma da Ira do Dragão Adormecido",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Foco do Toque do Dragão Adormecido",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Ornamento Escamado Adormecido",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Pólvora Fumegante",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Armadura Fumegante",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Snicker-Snack",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        6,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Bolsa de Almas",
        "Outro",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Moeda da Alma",
        "Item Maravilhoso",
        0,
        0.5,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cola Soberana",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Pedra Falante",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Lança da Traição",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        3,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Âmbar)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Heliotrópio)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Diamante)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Jade)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Lápis-lazúli)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Obsidiana)",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Quartzo)",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Rubi)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Rubi Estrela)",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Gema de Feitiço (Topázio)",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço",
        "Pergaminho",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Truque)",
        "Pergaminho",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 1)",
        "Pergaminho",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 2)",
        "Pergaminho",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 3)",
        "Pergaminho",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 4)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 5)",
        "Pergaminho",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 6)",
        "Pergaminho",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 7)",
        "Pergaminho",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 8)",
        "Pergaminho",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Pergaminho de Feitiço (Nível 9)",
        "Pergaminho",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Escudo do Guardião de Feitiços",
        "Escudo",
        0,
        6,
        "Muito Raro",
        true,
        ""
    ),
    new Itens(
        "Elmo de Navegação Espacial",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Fragmento de Feitiço",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Nível 1)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Nível 2)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Nível 3)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Nível 4)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Nível 5)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Tatuagem Feitiçada (Truque)",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Esfera de Aniquilação",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Cajado da Aranha",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        4,
        "Raro",
        true,
        ""
    ),
    new Itens(
        "Murmúrio dos Espiões",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        true,
        ""
    ),
    new Itens(
        "Fuso do Destino",
        "Varinha",
        0,
        0,
        "Lendário",
        true,
        ""
    ),
    new Itens(
        "Tabuleiro dos Espíritos",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Luneta da Clarividência",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    // VARINHAS (WANDS)
    new Itens(
        "Varinha do Medo",
        "Varinha",
        0,
        0.45, // 1 lb
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Bola de Fogo",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Raios",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Detecção de Magia",
        "Varinha",
        0,
        0.45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Mísseis Mágicos",
        "Varinha",
        0,
        0.45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Orcus",
        "Arma Simples, Varinha, Arma Mágica",
        0,
        1.81, // 4 lb
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Varinha de Paralisia",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Polimorfia",
        "Varinha",
        0,
        0.45,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Pirotecnia",
        "Varinha",
        0,
        0.45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Cenho",
        "Varinha",
        0,
        0.45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha dos Segredos",
        "Varinha",
        0,
        0.45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Sorrisos",
        "Varinha",
        0,
        0.45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha do Mago de Guerra",
        "Varinha",
        0,
        0.45,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Varinha de Globos Viscosos",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Teia",
        "Varinha",
        0,
        0.45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Varinha do Inverno",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha da Maravilha",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Bainha para Varinha",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),

    // ARMAS (WEAPONS)
    new Itens(
        "Espada da Afiação",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Espada dos Paruns",
        "Arma Marcial, Arma Mágica",
        0,
        1.36, // 3 lb
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Espada dos Planos",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Espada da Vingança",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Espada da Hemorragia",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Espada de Zariel",
        "Arma Marcial, Arma Mágica",
        0,
        1.36,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Garra Silvestre",
        "Variante Genérica",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Talamth",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Talismã do Bem Puro",
        "Item Maravilhoso",
        0,
        0.45,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Talismã da Esfera",
        "Item Maravilhoso",
        0,
        0.45,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Talismã do Mal Supremo",
        "Item Maravilhoso",
        0,
        0.45,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Boneca Falante",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carta das Garras",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Caneca da Abundância",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Caneca da Sobriedade",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Roda do Vento e Água",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Whelm",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2.27, // 5 lb
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Pote Sussurrante",
        "Item Maravilhoso",
        0,
        0,
        "Variável",
        false,
        ""
    ),
    new Itens(
        "Rosa Cromática Branca",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Capa do Dragão Branco",
        "Outro",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Máscara do Dragão Branco",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Cota de Escamas do Dragão Branco",
        "Armadura Média",
        0,
        20.41, // 45 lb
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Orrery do Espaço Selvagem",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Leque do Vento",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cata-Vento",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        1.36,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Munição Alada",
        "Munição, Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Botas Aladas",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Asas do Voo",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Traje Alado",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Cata-Vento da Luz das Bruxas",
        "Arma de Corpo a Corpo",
        0,
        1.36,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Barco Rastejante de Tasha",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tearulai",
        "Arma Marcial, Arma Mágica",
        0,
        1.36,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Dentes de Dahlver-Nar",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Anel do Teleporte",
        "Anel",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Transportador Telescópico",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Cajado Tentacular",
        "Vara",
        0,
        0.91, // 2 lb
        "Raro",
        false,
        ""
    ),
    new Itens(
        "O Codicilo Branco",
        "Item Maravilhoso",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Cubo Térmico",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Carta do Trono",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Tatuagem da Absorção do Trovão",
        "Item Maravilhoso, Tatuagem",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Grande Clava Trovejante",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        4.54, // 10 lb
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tridente do Chamado das Marés",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.81,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Relógio das Viagens",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tinderstrike",
        "Arma Simples, Arma de Corpo a Corpo",
        0,
        0.45,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Tomo do Pensamento Claro",
        "Item Maravilhoso",
        0,
        2.27, // 5 lb
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tomada do Comando do Trono",
        "Variante Genérica",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Arma do Aviso",
        "Variante Genérica",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tanque Estranho",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Poço de Muitos Mundos",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Roda das Estrelas",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Espada Vorpal",
        "Variante Genérica",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Kit de Votação",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Cajado do Viajante",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Vaso do Dragão Despertado",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Espada do Sol",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.36,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Espada da Resposta",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.36,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Espada de Kas",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.36,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Espada da Sucção de Vida",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Chifre de Guerra do Valor",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Chave Mestra do Guerreiro",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Elmo Vigilante",
        "Item Maravilhoso",
        0,
        0,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Onda",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.81,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Botas do Viajante",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Waythe",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        2.72, // 6 lb
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Armadura Voidwalker",
        "Armadura Leve",
        0,
        5.90, // 13 lb
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Ligação",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Regência",
        "Varinha",
        0,
        0.45,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Varinha de Detecção de Inimigos",
        "Varinha",
        0,
        0.45,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Varinha de Emaranhar",
        "Varinha",
        0,
        0.45,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tomo da Liderança e Influência",
        "Item Maravilhoso",
        0,
        2.27,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Tomo da Língua Silenciada",
        "Item Maravilhoso",
        0,
        2.27,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Tomo do Entendimento",
        "Item Maravilhoso",
        0,
        2.27,
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Aniquilador Topázio",
        "Arma de Fogo",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Kit Alquímico de Viagem",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Tridente do Comando de Peixes",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.81,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Funda dos Dois Pássaros",
        "Arma Simples, Arma à Distância",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Flecha Inquebrável",
        "Munição",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Tecido de Ilusão Incomum",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Solvente Universal",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Camisa de Mithral de Vanrak",
        "Armadura Média",
        0,
        9.07, // 20 lb
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pulmões Verificadores",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Bengala do Veterano",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Arma Viciosa +1",
        "Variante Genérica",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Arma Viciosa",
        "Variante Genérica",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Forjador do Sol",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        0.91,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Ornamento Escamado Agitado",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pedra de Controle dos Elementos da Terra",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Pedra de Golorr",
        "Item Maravilhoso",
        0,
        0,
        "Artefato",
        false,
        ""
    ),
    new Itens(
        "Pedra da Boa Sorte",
        "Item Maravilhoso",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Pedra do Azar",
        "Item Maravilhoso",
        0,
        0.45, // 1 lb
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Peitoral do Quebrador de Pedras",
        "Armadura Média",
        0,
        9.07, // 20 lb
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Picareta de Guerra do Criador de Pedras",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        0.91, // 2 lb
        "Muito Raro",
        false,
        ""
    ),
    new Itens(
        "Cristal do Falante das Pedras",
        "Item Maravilhoso",
        0,
        0,
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Anel do Stonky",
        "Anel",
        0,
        0,
        "Desconhecido",
        false,
        ""
    ),
    new Itens(
        "Bumerangue da Tempestade",
        "Arma Simples, Arma à Distância",
        0,
        0,
        "Incomum",
        false,
        ""
    ),
    new Itens(
        "Estandarte de Strixhaven",
        "Item Maravilhoso",
        0,
        0,
        "Comum",
        false,
        ""
    ),
    new Itens(
        "Lâmina do Sol",
        "Arma Marcial, Arma de Corpo a Corpo",
        0,
        1.36, // 3 lb
        "Raro",
        false,
        ""
    ),
    new Itens(
        "Carta do Sol",
        "Item Maravilhoso",
        0,
        0,
        "Lendário",
        false,
        ""
    ),
    new Itens(
        "Cajado do Sol",
        "Cajado, Arma Simples, Arma de Corpo a Corpo",
        0,
        1.81, // 4 lb
        "Raro",
        false,
        ""
    )
]