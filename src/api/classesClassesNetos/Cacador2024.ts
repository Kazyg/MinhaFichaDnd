import { SubClasses } from "../classesPrincipais/SubClasses";

export class Cacador2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Caçador", "Você persegue presas nos ermos e em outros lugares, protegendo a natureza e as pessoas de forças destrutivas.");
        this.niveis = [
            { nome: "Conhecimento do Caçador", nivel: 3, descricao: "Enquanto uma criatura está marcada por sua Marca do Predador, você sabe se ela possui Imunidades, Resistências ou Vulnerabilidades e quais são." },
            { nome: "Presa do Caçador", nivel: 3, descricao: "Escolha uma opção, podendo substituí-la ao completar Descanso Curto ou Longo. Assassino de Colossos causa 1d8 de dano adicional uma vez por turno ao atingir com arma uma criatura abaixo dos Pontos de Vida máximos. Destruidor de Hordas permite, uma vez por turno ao atacar com arma, realizar outro ataque com a mesma arma contra criatura diferente a 1,5 metro do alvo original, dentro do alcance da arma e que você ainda não atacou neste turno." },
            { nome: "Táticas Defensivas", nivel: 7, descricao: "Escolha uma opção, podendo substituí-la ao completar Descanso Curto ou Longo. Defesa Contra Ataques Múltiplos impõe Desvantagem em todos os outros ataques de uma criatura contra você no turno após ela acertar você. Escapar de Hordas faz ataques de oportunidade terem Desvantagem contra você." },
            { nome: "Presa do Caçador Superior", nivel: 11, descricao: "Uma vez por turno, ao causar dano a uma criatura marcada pela Marca do Predador, você também pode causar o dano adicional dessa magia a uma criatura diferente à sua vista e a até 9 metros da primeira criatura." },
            { nome: "Defesa do Caçador Superior", nivel: 15, descricao: "Ao sofrer dano, você pode usar sua Reação para conceder a si mesmo Resistência a esse dano e a qualquer outro dano do mesmo tipo até o final do turno atual." }
        ];
    }
}
