import { itensIngles } from "./ItensIngles.ts";

export class ItensTraduzidos {
    id: string;
    nome: string;

    constructor(nome: string) {
        this.id = this.gerarIdUnico();
        this.nome = nome;
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    }
}

const traducoesExatas = new Map<string, string>([
    ["Abacus", "Ábaco"],
    ["Acid (vial)", "Ácido (frasco)"],
    ["Airship", "Dirigível"],
    ["Alchemist's Fire (flask)", "Fogo de Alquimista (frasco)"],
    ["Alchemist's Supplies", "Suprimentos de Alquimista"],
    ["Alchemy Jug", "Jarro Alquímico"],
    ["Animated Shield", "Escudo Animado"],
    ["Antitoxin (vial)", "Antitoxina (frasco)"],
    ["Apparatus of Kwalish", "Aparato de Kwalish"],
    ["Arrow-Catching Shield", "Escudo Atrai-Flechas"],
    ["Assassin's Blood (Ingested)", "Sangue de Assassino (ingerido)"],
    ["Backpack", "Mochila"],
    ["Backpack Parachute", "Paraquedas de Mochila"],
    ["Bag of Beans", "Bolsa de Feijões"],
    ["Bag of Devouring", "Bolsa Devoradora"],
    ["Bag of Holding", "Bolsa de Carga"],
    ["Bagpipes", "Gaita de Foles"],
    ["Ball Bearing", "Esfera de Rolamento"],
    ["Ball Bearings (bag of 1,000)", "Esferas de Rolamento (saco com 1.000)"],
    ["Barding", "Bardana"],
    ["Barking Box", "Caixa Latidora"],
    ["Barrel", "Barril"],
    ["Bedroll", "Colchão de Dormir"],
    ["Bell", "Sino"],
    ["Bit and bridle", "Freio e Brida"],
    ["Blanket", "Cobertor"],
    ["Block and tackle", "Roldana e Talha"],
    ["Book", "Livro"],
    ["Bottle, glass", "Garrafa de Vidro"],
    ["Bucket", "Balde"],
    ["Caltrops (bag of 20)", "Estrepes (saco com 20)"],
    ["Candle", "Vela"],
    ["Case, crossbow bolt", "Estojo de Virotes de Besta"],
    ["Case, map or scroll", "Estojo de Mapa ou Pergaminho"],
    ["Chain (10 feet)", "Corrente (3 metros)"],
    ["Chalk (1 piece)", "Giz (1 peça)"],
    ["Chest", "Baú"],
    ["Climber's Kit", "Kit de Escalada"],
    ["Clothes, common", "Roupas Comuns"],
    ["Clothes, costume", "Fantasia"],
    ["Clothes, fine", "Roupas Finas"],
    ["Clothes, traveler's", "Roupas de Viajante"],
    ["Component Pouch", "Bolsa de Componentes"],
    ["Crowbar", "Pé de Cabra"],
    ["Crystal", "Cristal"],
    ["Drum", "Tambor"],
    ["Emblem", "Emblema"],
    ["Grappling Hook", "Gancho de Escalada"],
    ["Hammer", "Martelo"],
    ["Hammer, sledge", "Marreta"],
    ["Holy Water (flask)", "Água Benta (frasco)"],
    ["Hourglass", "Ampulheta"],
    ["Hunting trap", "Armadilha de Caça"],
    ["Jug or pitcher", "Jarro ou Jarra"],
    ["Ladder (10-foot)", "Escada (3 metros)"],
    ["Lamp", "Lamparina"],
    ["Lantern, bullseye", "Lanterna Focal"],
    ["Lantern, hooded", "Lanterna Coberta"],
    ["Lock", "Cadeado"],
    ["Mess kit", "Kit de Refeição"],
    ["Mirror, steel", "Espelho de Aço"],
    ["Oil (flask)", "Óleo (frasco)"],
    ["Orb", "Orbe"],
    ["Paper (one sheet)", "Papel (uma folha)"],
    ["Parchment (one sheet)", "Pergaminho (uma folha)"],
    ["Perfume (vial)", "Perfume (frasco)"],
    ["Pick, miner's", "Picareta de Minerador"],
    ["Piton", "Píton"],
    ["Poison, basic (vial)", "Veneno Básico (frasco)"],
    ["Pole (10-foot)", "Vara (3 metros)"],
    ["Pot, iron", "Panela de Ferro"],
    ["Potion of Healing", "Poção de Cura"],
    ["Pouch", "Bolsa"],
    ["Quiver", "Aljava"],
    ["Rations (1 day)", "Rações (1 dia)"],
    ["Robe", "Manto"],
    ["Rope of Climbing", "Corda da Escalada"],
    ["Rope of Entanglement", "Corda do Emaranhamento"],
    ["Sack", "Saco"],
    ["Saddle, exotic", "Sela Exótica"],
    ["Saddle, military", "Sela Militar"],
    ["Saddle, pack", "Sela de Carga"],
    ["Saddle, riding", "Sela de Montaria"],
    ["Saddlebags", "Alforjes"],
    ["Sending Stone", "Pedra de Envio"],
    ["Sending Stones", "Pedras de Envio"],
    ["Shield of Missile Attraction", "Escudo da Atração de Mísseis"],
    ["Signet Ring", "Anel de Sinete"],
    ["Slippers of Spider Climbing", "Pantufas da Escalada de Aranha"],
    ["Spell Scroll", "Pergaminho de Magia"],
    ["Staff of Power", "Cajado do Poder"],
    ["Staff of Striking", "Cajado do Golpe"],
    ["Staff of the Magi", "Cajado do Mago"],
    ["Stone of Good Luck", "Pedra da Boa Sorte"],
    ["Sun Blade", "Lâmina Solar"],
    ["Tent, two-person", "Tenda para Duas Pessoas"],
    ["Tinderbox", "Pederneira"],
    ["Torch", "Tocha"],
    ["Vial", "Frasco"],
    ["Wand of Fireballs", "Varinha de Bolas de Fogo"],
    ["Wand of Lightning Bolts", "Varinha de Relâmpagos"],
    ["Wand of Magic Detection", "Varinha de Detecção de Magia"],
    ["Wand of Magic Missiles", "Varinha de Mísseis Mágicos"],
    ["Wand of Paralysis", "Varinha da Paralisia"],
    ["Wand of Polymorph", "Varinha da Polimorfia"],
    ["Wand of Secrets", "Varinha dos Segredos"],
    ["Wand of Web", "Varinha de Teia"],
    ["Wand of Wonder", "Varinha da Maravilha"],
    ["Waterskin", "Odre"],
    ["Whetstone", "Pedra de Amolar"],
    ["Winged Boots", "Botas Aladas"]
]);

const traducoesTermos: Array<[string, string]> = [
    ["All-Purpose", "Multiuso"],
    ["Adamantine", "Adamantina"],
    ["Adjustable", "Ajustável"],
    ["Adventurer's", "do Aventureiro"],
    ["Alchemist's", "do Alquimista"],
    ["Amulet", "Amuleto"],
    ["Ancient", "Antigo"],
    ["Animated", "Animado"],
    ["Antitoxin", "Antitoxina"],
    ["Apparatus", "Aparato"],
    ["Arcane", "Arcano"],
    ["Armor", "Armadura"],
    ["Arrow", "Flecha"],
    ["Axe", "Machado"],
    ["Backpack", "Mochila"],
    ["Badge", "Insígnia"],
    ["Bag", "Bolsa"],
    ["Ball Bearings", "Esferas de Rolamento"],
    ["Ball Bearing", "Esfera de Rolamento"],
    ["Barding", "Bardana"],
    ["Barking Box", "Caixa Latidora"],
    ["Barrel", "Barril"],
    ["Battleaxe", "Machado de Guerra"],
    ["Bedroll", "Colchão de Dormir"],
    ["Bell", "Sino"],
    ["Belt", "Cinto"],
    ["Black", "Negro"],
    ["Blade", "Lâmina"],
    ["Blood", "Sangue"],
    ["Blue", "Azul"],
    ["Boat", "Barco"],
    ["Book", "Livro"],
    ["Boots", "Botas"],
    ["Box", "Caixa"],
    ["Bracers", "Braçadeiras"],
    ["Breastplate", "Peitoral"],
    ["Brooch", "Broche"],
    ["Broom", "Vassoura"],
    ["Brown", "Marrom"],
    ["Cage", "Gaiola"],
    ["Candle", "Vela"],
    ["Cap", "Gorro"],
    ["Carpet", "Tapete"],
    ["Cart", "Carroça"],
    ["Chain", "Corrente"],
    ["Chalice", "Cálice"],
    ["Charm", "Encanto"],
    ["Chest", "Baú"],
    ["Circlet", "Diadema"],
    ["Cloak", "Capa"],
    ["Club", "Clava"],
    ["Coin", "Moeda"],
    ["Compass", "Bússola"],
    ["Crystal", "Cristal"],
    ["Dagger", "Adaga"],
    ["Deck", "Baralho"],
    ["Defense", "Defesa"],
    ["Devouring", "Devoradora"],
    ["Disguise", "Disfarce"],
    ["Dragon", "Dragão"],
    ["Drum", "Tambor"],
    ["Dust", "Pó"],
    ["Dwarven", "Anão"],
    ["Eagle", "Águia"],
    ["Elven", "Élfico"],
    ["Elixir", "Elixir"],
    ["Eyes", "Olhos"],
    ["Feather", "Pena"],
    ["Figurine", "Estatueta"],
    ["Fireballs", "Bolas de Fogo"],
    ["Fire", "Fogo"],
    ["Flask", "Frasco"],
    ["Flying", "Voadora"],
    ["Force", "Força"],
    ["Free", "Livre"],
    ["Gem", "Gema"],
    ["Giant", "Gigante"],
    ["Gloves", "Luvas"],
    ["Gold", "Ouro"],
    ["Gray", "Cinza"],
    ["Green", "Verde"],
    ["Hammer", "Martelo"],
    ["Hat", "Chapéu"],
    ["Headband", "Tiara"],
    ["Health", "Saúde"],
    ["Helm", "Elmo"],
    ["Holy", "Sagrado"],
    ["Horn", "Chifre"],
    ["Hourglass", "Ampulheta"],
    ["Immovable", "Imóvel"],
    ["Instant", "Instantânea"],
    ["Invisibility", "Invisibilidade"],
    ["Iron", "Ferro"],
    ["Ivory", "Marfim"],
    ["Jug", "Jarro"],
    ["Key", "Chave"],
    ["Lantern", "Lanterna"],
    ["Leadership", "Liderança"],
    ["Life", "Vida"],
    ["Lightning", "Relâmpago"],
    ["Lock", "Cadeado"],
    ["Luck", "Sorte"],
    ["Mace", "Maça"],
    ["Magic", "Magia"],
    ["Manual", "Manual"],
    ["Medallion", "Medalhão"],
    ["Mind", "Mente"],
    ["Missile", "Míssil"],
    ["Moon", "Lua"],
    ["Necklace", "Colar"],
    ["Night", "Noite"],
    ["Orb", "Orbe"],
    ["Paralysis", "Paralisia"],
    ["Pearl", "Pérola"],
    ["Periapt", "Periápto"],
    ["Philter", "Filtro"],
    ["Pike", "Pique"],
    ["Planes", "Planos"],
    ["Plate", "Placas"],
    ["Potion", "Poção"],
    ["Power", "Poder"],
    ["Protection", "Proteção"],
    ["Quiver", "Aljava"],
    ["Ram", "Carneiro"],
    ["Red", "Vermelho"],
    ["Regeneration", "Regeneração"],
    ["Resistance", "Resistência"],
    ["Ring", "Anel"],
    ["Robe", "Manto"],
    ["Rod", "Vara"],
    ["Rope", "Corda"],
    ["Rust", "Ferrugem"],
    ["Saddle", "Sela"],
    ["Scroll", "Pergaminho"],
    ["Secrets", "Segredos"],
    ["Secret", "Segredo"],
    ["Sending", "Envio"],
    ["Shadow", "Sombra"],
    ["Shield", "Escudo"],
    ["Silver", "Prata"],
    ["Skull", "Caveira"],
    ["Slippers", "Pantufas"],
    ["Speed", "Velocidade"],
    ["Spell", "Magia"],
    ["Spider", "Aranha"],
    ["Staff", "Cajado"],
    ["Star", "Estrela"],
    ["Stone", "Pedra"],
    ["Strength", "Força"],
    ["Sword", "Espada"],
    ["Telepathy", "Telepatia"],
    ["Tent", "Tenda"],
    ["Thought", "Pensamento"],
    ["Three", "Três"],
    ["Token", "Talismã"],
    ["Tome", "Tomo"],
    ["Torch", "Tocha"],
    ["Tower", "Torre"],
    ["Tricks", "Truques"],
    ["Universal", "Universal"],
    ["Vial", "Frasco"],
    ["Wand", "Varinha"],
    ["War", "Guerra"],
    ["Water", "Água"],
    ["Web", "Teia"],
    ["White", "Branco"],
    ["Winged", "Aladas"],
    ["Wonder", "Maravilha"],
    ["Wondrous", "Maravilhoso"],
    ["Wound", "Ferida"],
    ["X-Ray", "Raio-X"],
    ["Yellow", "Amarelo"],
    [" of ", " de "],
    [" the ", " o "],
    [" and ", " e "],
    [" against ", " contra "],
    [" from ", " de "],
    [" with ", " com "],
    [" for ", " para "],
    [" to ", " para "]
];

const palavrasParaManter = new Set([
    "Azuredge",
    "Kwalish",
    "Daern",
    "Quaal",
    "Valhalla",
    "Vorpal",
    "Magi",
    "Aparato",
    "Azorius",
    "Simic",
    "Selesnya",
    "Orzhov",
    "Gruul",
    "Izzet",
    "Boros",
    "Dimir",
    "Rakdos",
    "Golgari",
    "Strixhaven",
    "Tasha",
    "Zariel",
    "Kas",
    "Orcus"
]);

function escaparRegex(valor: string) {
    return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ajustarCapitalizacao(nome: string) {
    return nome
        .split(" ")
        .map((parte) => {
            if (!parte) return parte;
            if (palavrasParaManter.has(parte)) return parte;
            if (/^[IVXLCM]+$/.test(parte)) return parte;
            return parte.charAt(0).toUpperCase() + parte.slice(1);
        })
        .join(" ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s+,/g, ",");
}

function traduzirNomeItem(nome: string) {
    const traducaoExata = traducoesExatas.get(nome);
    if (traducaoExata) {
        return traducaoExata;
    }

    let traduzido = nome;

    for (const [origem, destino] of traducoesTermos.sort((a, b) => b[0].length - a[0].length)) {
        traduzido = traduzido.replace(new RegExp(escaparRegex(origem), "g"), destino);
    }

    traduzido = traduzido
        .replace(/\bGray\b/g, "Cinza")
        .replace(/\bTan\b/g, "Castanho")
        .replace(/\bRust\b/g, "Ferrugem")
        .replace(/\bBullseye\b/g, "Focal")
        .replace(/\bHooded\b/g, "Coberta")
        .replace(/\bTraveler's\b/g, "de Viajante")
        .replace(/\bFine\b/g, "Fino")
        .replace(/\bCommon\b/g, "Comum")
        .replace(/\bCostume\b/g, "Fantasia")
        .replace(/\bMilitary\b/g, "Militar")
        .replace(/\bRiding\b/g, "de Montaria")
        .replace(/\bPack\b/g, "de Carga")
        .replace(/\bExotic\b/g, "Exótica")
        .replace(/\bTwo-Person\b/g, "para Duas Pessoas")
        .replace(/\bone sheet\b/gi, "uma folha")
        .replace(/\b1 day\b/gi, "1 dia")
        .replace(/\bbag of 1,000\b/gi, "saco com 1.000")
        .replace(/\b10-foot\b/gi, "3 metros")
        .replace(/\b10 feet\b/gi, "3 metros")
        .replace(/\b20 feet\b/gi, "6 metros")
        .replace(/\bglass\b/gi, "vidro")
        .replace(/\bsteel\b/gi, "aço")
        .replace(/\bbasic\b/gi, "básico")
        .replace(/\bingested\b/gi, "ingerido")
        .replace(/\s+/g, " ")
        .trim();

    return ajustarCapitalizacao(traduzido);
}

export const itensTraduzidos: ItensTraduzidos[] = itensIngles.map(
    (item) => new ItensTraduzidos(traduzirNomeItem(item.nome))
);

export { traduzirNomeItem };
