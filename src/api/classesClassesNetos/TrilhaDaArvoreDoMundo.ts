import { SubClasses } from "../classesPrincipais/SubClasses";

export class TrilhaDaArvoreDoMundo extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Trilha da Árvore do Mundo", "Bárbaros que seguem a Trilha da Árvore do Mundo conectam-se à árvore cósmica Yggdrasil por meio de sua Fúria, extraindo vitalidade e poder para viajar entre dimensões.");
        this.niveis = [
            {
                nome: "Vitalidade da Árvore",
                nivel: 3,
                descricao: "Sua Fúria se conecta à força vital da Árvore do Mundo. No início de cada um dos seus turnos enquanto sua Fúria estiver ativa, você pode escolher outra criatura a até 3 metros de você para receber Pontos de Vida Temporários. Para determinar a quantidade, jogue um número de d6s igual ao seu bônus de Dano da Fúria. Ao ativar sua Fúria, você também recebe Pontos de Vida Temporários iguais ao seu nível de Bárbaro."
            },
            {
                nome: "Ramos da Árvore",
                nivel: 6,
                descricao: "Sempre que uma criatura que você pode ver começar o turno a até 9 metros de você enquanto sua Fúria estiver ativa, você pode executar uma Reação para convocar ramos espectrais da Árvore do Mundo. O alvo deve ser bem-sucedido em uma salvaguarda de Força contra CD 8 + seu modificador de Força + seu Bônus de Proficiência ou é teleportado para um espaço desocupado à sua vista a até 1,5 metro de você ou no espaço desocupado mais próximo. Depois disso, você pode reduzir o Deslocamento dele a 0 até o final do turno atual."
            },
            {
                nome: "Raízes Devastadoras",
                nivel: 10,
                descricao: "Durante o seu turno, seu alcance é 3 metros maior com qualquer arma corpo a corpo que tenha a propriedade Pesada ou Versátil. Quando você atinge com tal arma no seu turno, pode ativar a propriedade de maestria Derrubar ou Empurrar, além de outra propriedade de maestria que você estiver utilizando com a arma."
            },
            {
                nome: "Percorrer a Árvore",
                nivel: 14,
                descricao: "Ao ativar sua Fúria e, como uma Ação Bônus enquanto ela estiver ativa, você pode se teleportar a até 18 metros para um espaço desocupado à sua vista. Uma vez por Fúria, você pode aumentar esse alcance para 45 metros e levar até seis criaturas voluntárias a até 3 metros de você."
            }
        ];
    }
}
