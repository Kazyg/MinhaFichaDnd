import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoDaSombra extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Caminho da Sombra",
            "Monges do Caminho da Sombra seguem uma tradição que valoriza furtividade e subterfúgio. Esses monges devem ser chamados de ninjas ou dançarinos das sombras e eles servem como espiões e assassinos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Artes Sombrias",
                nivel: 3,
                descricao: `
                    Começando quando você escolhe essa tradição, no 3° nível, você pode usar seu chi para simular o efeito de certas magias. Com uma ação, você pode gastar 2 pontos de chi para conjurar escuridão, visão no escuro, passos sem pegadas ou silêncio, sem precisar de componentes materiais. Além disso, você ganha o truque ilusão menor, se você ainda não o conhecia.
                `
            },
            {
                nome: "Passo das Sombras",
                nivel: 6,
                descricao: `
                    No 6° nível, você ganha a habilidade de entrar em uma sombra e sair em outra. Quando você estiver sob penumbra ou na escuridão, com uma ação bônus, você pode se teletransportar a até 18 metros para um espaço desocupado que você possa ver que também esteja sob penumbra ou escuridão. Você, então, terá vantagem no primeiro ataque corpo-a-corpo que você fizer antes do final do seu turno.
                `
            },
            {
                nome: "Manto de Sombras",
                nivel: 11,
                descricao: `
                    No 11° nível, você aprendeu a se tornar uno com as sombras. Quando você estiver em uma área de penumbra ou escuridão, você pode usar sua ação para se tornar invisível. Você permanece invisível até realizar um ataque, conjurar uma magia ou se mover para uma área de luz plena.
                `
            },
            {
                nome: "Oportunista",
                nivel: 17,
                descricao: `
                    No 17° nível, você pode explorar um momento de distração de uma criatura quando ela é atingida por um ataque. Toda vez que uma criatura a até 1,5 metro de você for atingida por um ataque realizado por outra criatura diferente de você, você pode usar sua reação para realizar um ataque corpo-a-corpo contra essa criatura.
                `
            }
        ];
    }
}
