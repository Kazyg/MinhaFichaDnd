import { SubClasses } from "../classesPrincipais/SubClasses";

export class TrilhaDoFanatico2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Trilha do Fanático", "Bárbaros que seguem a Trilha do Fanático recebem bênçãos de um deus ou panteão e experimentam sua Fúria como um êxtase divino.");
        this.niveis = [
            {
                nome: "Campeão dos Deuses",
                nivel: 3,
                descricao: "Você tem uma reserva de quatro d12s que pode gastar para se curar. Como uma Ação Bônus, você pode gastar dados da reserva, jogá-los e recuperar Pontos de Vida iguais ao total. A reserva restaura todos os dados gastos ao completar Descanso Longo. O máximo aumenta para 5 dados no nível 6, 6 dados no nível 12 e 7 dados no nível 17."
            },
            {
                nome: "Fúria Divina",
                nivel: 3,
                descricao: "Em cada um dos seus turnos, enquanto sua Fúria estiver ativa, a primeira criatura que você atingir com uma arma ou Ataque Desarmado sofre dano adicional igual a 1d6 + metade do seu nível de Bárbaro, arredondado para baixo. O dano é Necrótico ou Radiante, à sua escolha cada vez que causar dano."
            },
            {
                nome: "Concentração Fanática",
                nivel: 6,
                descricao: "Uma vez por Fúria ativa, se você falhar em uma salvaguarda, pode jogá-la novamente com um bônus igual ao seu bônus de Dano da Fúria e deve usar o novo resultado."
            },
            {
                nome: "Presença Zelosa",
                nivel: 10,
                descricao: "Como uma Ação Bônus, você libera um grito de batalha infundido com energia divina. Até dez outras criaturas à sua escolha a até 18 metros de você obtêm Vantagem em jogadas de ataque e salvaguardas até o início do seu próximo turno. Você recupera o uso ao completar Descanso Longo ou ao gastar um uso de Fúria."
            },
            {
                nome: "Fúria dos Deuses",
                nivel: 14,
                descricao: "Quando ativa sua Fúria, você pode assumir uma forma divina por 1 minuto ou até atingir 0 Pontos de Vida. Enquanto estiver nessa forma, você tem Resistência a dano Necrótico, Psíquico e Radiante; pode usar Reação para gastar uma Fúria e fazer uma criatura a até 9 metros que cairia a 0 Pontos de Vida ficar com Pontos de Vida iguais ao seu nível de Bárbaro; e tem Deslocamento de Voo igual ao seu Deslocamento, podendo pairar."
            }
        ];
    }
}
