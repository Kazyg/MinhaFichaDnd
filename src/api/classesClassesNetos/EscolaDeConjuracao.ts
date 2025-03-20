import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeConjuracao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Conjuração",
            "Como um conjurador, você prefere magias que produzam objetos e criaturas do nada. Você pode conjurar nuvens esvoaçantes de gás mortal ou invocar criaturas de outros lugares para lutar por você. À medida que seu domínio cresce, você aprende magias de teletransportação e pode se teletransportar por vastas distâncias, até mesmo para outros planos de existência, em um instante."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Conjuração Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de conjuração em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Conjuração Menor",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, quando você escolhe essa escola, você pode usar sua ação para conjurar até um objeto inanimado em sua mão ou no chão, em um espaço desocupado que você possa ver, a até 3 metros de você. Esse objeto não pode ter mais de 90 centímetros de largura nem pesar mais de 5 quilos e sua forma deve ser de um objeto não-mágico que você tenha visto. O objeto é visivelmente mágico, emanando penumbra a 1,5 metro. O objeto desaparece depois de 1 hora, quando você usa essa característica novamente ou se ele sofrer qualquer dano.
                `
            },
            {
                nome: "Transposição Benigna",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, você pode usar sua ação para se teletransportar até 9 metros em um espaço desocupado que você possa ver. Alternativamente, você pode escolher um espaço ao alcance que seja ocupado por uma criatura Pequena ou Média. Se essa criatura for voluntária, vocês dois teletransportam-se, trocando de lugar.

                    Uma vez que você usa essa característica, não pode usá-la novamente até terminar um descanso longo ou até conjurar uma magia de conjuração de 1° nível ou superior.
                `
            },
            {
                nome: "Conjuração Focada",
                nivel: 10,
                descricao: `
                    Começando no 10° nível, enquanto você estiver concentrado em uma magia de conjuração, sua concentração não pode ser interrompida como resultado de ter sofrido dano.
                `
            },
            {
                nome: "Invocações Resistentes",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, qualquer criatura que você invocar ou criar com uma magia de conjuração, terá 30 pontos de vida temporários.
                `
            }
        ];
    }
}