import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeNecromancia extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Necromancia",
            "A Escola de Necromancia explora as forças cósmicas da vida, morte e morte-vida. À medida que você foca seus estudos nessa tradição, você aprende a manipular a energia que anima todas as coisas vivas. Enquanto progride, você aprende a retirar a força vital de uma criatura enquanto sua magia destrói seu corpo, transformando a energia vital em poder mágico que você pode manipular. A maioria das pessoas veem necromantes como ameaças, ou até mesmo vilões, devido a sua associação intima com a morte. Nem todos os necromantes são malignos, mas as forças que eles manipulam são consideradas tabu por diversas sociedades."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Necromancia Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de necromancia em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Colheita Sinistra",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você ganha a habilidade de ceifar a energia vital das criaturas que você mata com suas magias. Uma vez por turno, quando você matar uma ou mais criaturas com uma magia de 1° nível ou superior, você recupera uma quantidade de pontos de vida igual ao dobro do nível da magia ou o triplo do seu nível, se a magia pertencer a Escola de Necromancia. Você não recebe esse benefício por matar constructos ou mortos-vivos.
                `
            },
            {
                nome: "Escravos Mortos-Vivos",
                nivel: 6,
                descricao: `
                    No 6° nível, você adiciona a magia animar mortos ao seu grimório se você ainda não a possuir. Quando você conjurar animar mortos, você pode escolher um corpo ou pilha de ossos adicional, criando outro zumbi ou esqueleto, como apropriado. Toda vez que você criar um morto-vivo através de uma magia de necromancia, ele terá benefícios adicionais:
                    - O máximo de pontos de vida da criatura aumenta numa quantidade igual a seu nível de mago.
                    - A criatura adiciona seu bônus de proficiência as suas jogadas de dano.
                `
            },
            {
                nome: "Acostumado à Morte-Vida",
                nivel: 10,
                descricao: `
                    A partir do 10° nível, você terá resistência a dano necrótico e seu máximo de pontos de vida não pode ser reduzido. Você gastou tanto tempo lidando com mortos-vivos e com as forças que os animam que você se acostumou a alguns dos seus piores efeitos.
                `
            },
            {
                nome: "Comandar Mortos-Vivos",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, você pode usar magia para trazer mortos-vivos ao seu controle, até os criados por outros magos. Com uma ação, você pode escolher um morto-vivo que você possa ver a até 18 metros. Essa criatura deve realizar um teste de resistência de Carisma com CD igual das suas magias de mago. Se ela for bem sucedida, você não poderá usar essa característica nela novamente. Se ela falhar, ela se tornará amistosa a você e obedecerá seus comandos até você usar essa característica novamente. Mortos-vivos inteligentes são difíceis de controlar dessa forma. Se o alvo tiver Inteligência 8 ou superior, ele terá vantagem no teste de resistência. Se ele fracassar no teste de resistência e tiver Inteligência 12 ou superior, ele poderá repetir o teste de resistência ao final de cada hora até que obtenha sucesso e se liberte.
                `
            }
        ];
    }
}