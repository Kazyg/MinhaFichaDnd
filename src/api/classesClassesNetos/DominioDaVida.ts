import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaVida extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Vida",
            "O domínio da vida foca na vívida energia positiva – uma das forças fundamentais do universo – que sustenta toda a vida. Os deuses da vida promovem a vitalidade e a saúde, curando os doentes e feridos, cuidando dos necessitados, além de afastar as forças da morte e hordas de mortos-vivos. Quase toda divindade não maligna pode alegar influência sobre esse domínio. Em particular divindades da agricultura (como Chauntea, Arawai e Demeter), do sol (como Lathander, Pelor e Re-Horakhty), da cura ou resistência (como Ilmater, Mishakal, Apolo e Diancecht), e do lar e comunidade (como Hestia, Hathor e Boldrei)."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio da Vida",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | bênção, curar ferimentos
                    3°               | restauração menor, arma espiritual
                    5°               | sinal de esperança, revivificar
                    7°               | proteção contra a morte, guardião da fé
                    9°               | curar ferimentos em massa, reviver os mortos
                `
            },
            {
                nome: "Proficiência Adicional",
                nivel: 1,
                descricao: "Quando você escolhe este domínio no 1º nível, você ganha proficiência com armaduras pesadas."
            },
            {
                nome: "Discípulo da Vida",
                nivel: 1,
                descricao: `
                    Também no 1º nível, suas magias de cura são mais efetivas. Sempre que você conjurar uma magia de cura para recuperar pontos de vida, o alvo daquela magia recupera pontos de vida adicionais iguais a 2 + nível da magia.
                `
            },
            {
                nome: "Canalizar Divindade: Preservar a Vida",
                nivel: 2,
                descricao: `
                    A partir do 2º nível, você pode usar seu Canalizar Divindade para curar os feridos. Como uma ação, você usa seu símbolo sagrado para invocar energia que pode recuperar um total de 5 vezes seu nível de clérigo em pontos de vida. Você escolhe quaisquer criaturas a até 9 metros de você e divide esses pontos entre elas. Essa característica só pode curar as criaturas a até metade de seu máximo de pontos de vida. Você não pode usar essa característica em um morto-vivo ou constructo.
                `
            },
            {
                nome: "Curandeiro Abençoado",
                nivel: 6,
                descricao: `
                    A partir do 6º nível, as magias que você conjurar para curar os outros também curam você. Quando conjurar uma magia de cura em outra criatura, você também recupera pontos de vida, em um total de 2 + nível da magia.
                `
            },
            {
                nome: "Golpe Divino",
                nivel: 8,
                descricao: `
                    No 8º nível, você ganha a habilidade de imbuir seus ataques com poder divino. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você pode fazer o ataque causar 1d8 de dano radiante extra ao alvo. Quando alcançar o 14º nível, o dano extra aumenta para 2d8.
                `
            },
            {
                nome: "Cura Suprema",
                nivel: 17,
                descricao: `
                    A partir do 17º nível, quando você jogaria normalmente um ou mais dados para recuperar pontos de vida com uma magia, você usa o maior resultado possível nos dados. Por exemplo, ao invés de recuperar 2d6 pontos de vida, você recupera 12.
                `
            }
        ];
    }
}