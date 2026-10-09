import { SubClasses } from "../classesPrincipais/SubClasses";

export class TrilhaDoBerserker2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Trilha do Berserker", "Bárbaros que seguem a Trilha do Berserker direcionam sua Fúria principalmente para a violência e se deleitam no caos da batalha.");
        this.niveis = [
            {
                nome: "Frenesi",
                nivel: 3,
                descricao: "Se você usar Ataque Imprudente enquanto sua Fúria estiver ativa, você causa dano adicional ao primeiro alvo atingido no seu turno com um ataque baseado em Força. O dano adicional é um número de d6s igual ao seu bônus de Dano da Fúria e tem o mesmo tipo da arma ou Ataque Desarmado utilizado."
            },
            {
                nome: "Fúria Irracional",
                nivel: 6,
                descricao: "Você tem Imunidade às condições Amedrontado e Enfeitiçado enquanto sua Fúria estiver ativa. Se você estiver sob efeito de uma dessas condições ao entrar em Fúria, a condição encerra."
            },
            {
                nome: "Retaliação",
                nivel: 10,
                descricao: "Quando você sofrer dano de uma criatura que esteja a até 1,5 metro de você, pode executar uma Reação para realizar um ataque corpo a corpo contra essa criatura, usando uma arma ou um Ataque Desarmado."
            },
            {
                nome: "Presença Intimidante",
                nivel: 14,
                descricao: "Como uma Ação Bônus, você pode causar terror em criaturas à sua escolha em uma Emanação de 9 metros originada de você. Cada alvo deve realizar uma salvaguarda de Sabedoria contra CD 8 + seu modificador de Força + seu Bônus de Proficiência. Se falhar, fica Amedrontado por 1 minuto, repetindo a salvaguarda no final de cada turno. Você recupera o uso ao completar Descanso Longo ou ao gastar um uso de Fúria."
            }
        ];
    }
}
