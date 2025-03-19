import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoDaMaoAberta extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Caminho da Mão Aberta",
            "Monges do Caminho da Mão Aberta são os mestres supremos das artes de combate marcial, tanto armado quanto desarmado. Eles aprendem técnicas para empurrar e derrubar seus oponentes, manipulando o chi para curar os ferimentos dos seus corpos e praticando uma meditação avançada que os protege de mazelas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Técnica da Mão Aberta",
                nivel: 3,
                descricao: `
                    Começando quando você escolhe essa tradição, no 3° nível, você pode manipular o chi do seu inimigo quando você controla o seu. Toda vez que você atingir uma criatura com um dos seus ataques garantidos por sua Rajada de Golpes, você pode impor um dos seguintes efeitos no alvo:
                    - Ele deve ser bem sucedido num teste de resistência de Destreza ou cairá no chão.
                    - Ele deve realizar um teste de resistência de Força. Se falhar, você pode empurrá-lo 4,5 metros para longe de você.
                    - Ele não pode realizar reações até o final do seu próximo turno.
                `
            },
            {
                nome: "Integridade Corporal",
                nivel: 6,
                descricao: `
                    No 6° nível, você ganha a habilidade de se curar. Com uma ação, você recupera uma quantidade de pontos de vida igual a três vezes seu nível de monge. Você deve terminar um descanso longo antes de poder usar essa característica novamente.
                `
            },
            {
                nome: "Tranquilidade",
                nivel: 11,
                descricao: `
                    A partir do 11° nível, você pode entrar num estado especial de meditação que rodeia você com uma aura pacífica. No final de um descanso longo, você ganha o efeito da magia santuário que dura até o começo do seu próximo descanso longo (a magia pode terminar prematuramente, como normal). A CD do teste de resistência para a magia é 8 + seu modificador de Sabedoria + seu bônus de proficiência.
                `
            },
            {
                nome: "Palma Vibrante",
                nivel: 17,
                descricao: `
                    No 17° nível, você ganha a habilidade de criar vibrações letais no corpo de alguém. Quando você atingir uma criatura com um golpe desarmado, você pode gastar 3 pontos de chi para começar essas vibrações imperceptíveis, que duram por um número de dias igual ao seu nível de monge. As vibrações são inofensivas, a não ser que você use sua ação para terminá-las. Para tanto, você e o alvo devem estar no mesmo plano de existência.
                    Quando você usa essa ação, a criatura deve realizar um teste de resistência de Constituição. Se ela falhar, ela será reduzida a 0 pontos de vida. Se ela passar, ela sofrerá 10d10 de dano necrótico.
                    Você pode ter apenas uma criatura sob o efeito dessa característica por vez. Você pode escolher terminar as vibrações inofensivamente, sem usar uma ação.
                `
            }
        ];
    }
}