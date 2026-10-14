import { SubClasses } from "../classesPrincipais/SubClasses";

export class PatronoInfero2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Patrono Ínfero", "Seu pacto se fundamenta nos Planos Inferiores, reinos de perdição, e no poder de entidades malignas que buscam corrupção ou destruição.");
        this.niveis = [
            {
                nome: "Bênção do Tenebroso",
                nivel: 3,
                descricao: "Ao reduzir um inimigo a 0 Pontos de Vida, você recebe Pontos de Vida Temporários iguais ao seu modificador de Carisma + seu nível de Bruxo, mínimo 1. Você também recebe esse benefício se outra pessoa reduzir um inimigo a até 3 metros de você a 0 Pontos de Vida."
            },
            {
                nome: "Magias de Pacto do Ínfero",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Comando, Mãos Flamejantes, Raio Ardente e Sugestão; no nível 5, Bola de Fogo e Nuvem Fétida; no nível 7, Escudo Ardente e Muralha de Fogo; no nível 9, Missão e Praga de Insetos."
            },
            {
                nome: "A Sorte do Próprio Tenebroso",
                nivel: 6,
                descricao: "Ao realizar um teste de atributo ou uma salvaguarda, você pode adicionar 1d10 à jogada após vê-la, mas antes de seus efeitos. Você pode usar essa característica um número de vezes igual ao seu modificador de Carisma, mínimo uma vez, e restaura todos os usos ao completar Descanso Longo."
            },
            {
                nome: "Resistência Ínfera",
                nivel: 10,
                descricao: "Ao completar um Descanso Curto ou Longo, escolha um tipo de dano, exceto Energético. Você tem Resistência a esse tipo de dano até escolher outro com esta característica."
            },
            {
                nome: "Lançar no Inferno",
                nivel: 14,
                descricao: "Uma vez por turno, ao atingir uma criatura com uma jogada de ataque, você pode forçá-la a realizar salvaguarda de Carisma contra sua CD de magia. Se falhar, ela desaparece, sofre 8d10 de dano Psíquico se não for Ínfero e fica Incapacitada até o final do seu próximo turno, quando retorna. Você recupera o uso ao completar Descanso Longo ou gastando espaço de Magia de Pacto."
            }
        ];
    }
}
