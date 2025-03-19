import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CirculoDaLua extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Círculo da Lua",
            "Os druidas do Círculo da Lua são ferrenhos guardiões da natureza. Sua ordem se reúne nas noites de lua cheia para partilhar notícias e trocar informações. Eles assombram as partes mais profundas das florestas, onde podem passar semanas sem cruzar o caminho de outro humanoide, muito menos outro druida. Tão mutável quanto a lua, um druida desse círculo pode espreitar como um grande felino, voar sobre a copa das árvores como uma águia no dia seguinte e mergulhar pela vegetação rasteira como um urso para expulsar um monstro invasor. A selvageria está no sangue do druida."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Forma Selvagem de Combate",
                nivel: 2,
                descricao: `
                    Quando você escolhe esse círculo, no 2° nível, você recebe a habilidade de usar sua Forma Selvagem no seu turno com uma ação bônus, ao invés de com uma ação. Além disso, enquanto você estiver transformado pela sua Forma Selvagem, você pode usar uma ação bônus para gastar um espaço de magia e ganhar 1d8 pontos de vida por nível do espaço de magia gasto.
                `
            },
            {
                nome: "Formas de Círculo",
                nivel: 2,
                descricao: `
                    Os ritos do seu círculo garantem a você a habilidade de se transformar em formas animais mais poderosas. A partir do 2° nível, você pode usar sua Forma Selvagem para se transformar em uma besta com nível de desafio até 1 (você ignora a coluna ND Max da tabela Formas de Besta, mas ainda deve acatar as limitações descritas lá). A partir do 6° nível, você pode se transformar em uma besta com nível de desafio tão alto quanto seu nível de druida dividido por 3, arredondado para baixo.
                `
            },
            {
                nome: "Ataque Primordial",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, seus ataques na forma de besta contam como mágicos com os propósitos de ultrapassar resistência e imunidade a ataques e danos não-mágicos.
                `
            },
            {
                nome: "Forma Selvagem de Elemental",
                nivel: 10,
                descricao: `
                    No 10° nível, você pode gastar dois usos da sua Forma Selvagem, ao mesmo tempo, para se transformar em um elemental da água, elemental do ar, elemental do fogo ou elemental da terra.
                `
            },
            {
                nome: "Mil Formas",
                nivel: 14,
                descricao: `
                    No 14° nível, você aprende a usar magia para alterar sua forma física de formas mais sutis. Você pode conjurar a magia alterar-se à vontade.
                `
            }
        ];
    }
}