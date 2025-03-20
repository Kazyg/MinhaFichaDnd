import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeAbjuracao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Abjuração",
            "A Escola de Abjuração enfatiza magias que bloqueiam, expulsam ou protegem. Detratores dessa escola dizem que sua tradição trata de contradição, negação, ao invés de asserções positivas. Você compreende, no entanto, que terminar efeitos nocivos, proteger os fracos e banir influências malignas é tudo, menos um vazio filosófico. É uma vocação de orgulho e respeito. Chamados de abjuradores, membros dessa escola são procurados quando espíritos sinistros precisam ser exorcizados, quando locais importantes devem ser guardados contra espionagem mágica e quando portais para outros planos de existência precisam ser selados."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Abjuração Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de abjuração em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Proteção Arcana",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode tecer a magia a sua volta para proteção. Quando você conjura uma magia de abjuração de 1° nível ou superior, você pode, simultaneamente, usar uma vertente do poder da magia para criar uma proteção mágica em si mesmo, que dura até você terminar um descanso longo. A proteção tem pontos de vida iguais ao dobro do seu nível de mago + seu modificador de Inteligência. Sempre que você sofrer dano, a proteção sofrerá o dano no lugar. Se o dano reduzir a proteção a 0 pontos de vida, você sofre qualquer dano remanescente.

                    Quando a proteção estiver com 0 pontos de vida, ela não poderá mais absorver dano, mas a mágica permanece. Toda vez que você conjurar uma magia de abjuração de 1° nível ou superior, a proteção recupera um número de pontos de vida igual ao dobro do nível da magia.

                    Uma vez que você tenha criado a proteção, você não pode criá-la novamente até terminar um descanso longo.
                `
            },
            {
                nome: "Proteção Projetada",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, quando uma criatura que você possa ver a até 9 metros sofrer dano, você pode usar sua reação para fazer com que sua Proteção Arcana absorva aquele dano. Se esse dano reduzir a proteção a 0 pontos de vida, a criatura protegida sofrerá qualquer dano remanescente.
                `
            },
            {
                nome: "Abjuração Aprimorada",
                nivel: 10,
                descricao: `
                    A partir do 10° nível, quando você conjurar uma magia de abjuração que requeira que você realize um teste de habilidade como parte da conjuração da magia (como em contramágica e dissipar magia), você adiciona seu bônus de proficiência a esse teste de habilidade.
                `
            },
            {
                nome: "Resistência à Magia",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, você tem vantagem em testes de resistência contra magia. Além disso, você tem resistência contra o dano de magias.
                `
            }
        ];
    }
}