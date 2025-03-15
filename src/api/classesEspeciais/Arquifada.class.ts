import { Patronos } from "./Patronos.class.ts";

export class Arquifada extends Patronos{
    constructor(){
        super("A Arquifada", 
            [
                {
                    nome: "LISTA DE MAGIA EXPANDIDA", 
                    descricao: "A Arquifada permite que você escolha magias de uma lista expandida quando você for aprender magias de bruxo. As seguintes magias são adicionadas a sua lista de magias de bruxo."
                },
                {
                    nome: "PRESENÇA FEÉRICA",
                    descricao: `A partir do 1° nível, seu patrono concede a você a habilidade de projetar a sedução e temeridade da presença da fada. Com uma ação, você pode fazer com que cada criatura num cubo de 3 metros centrado em você, faça um teste de resistência de Sabedoria com uma CD igual a de sua magia de bruxo. As criaturas que falharem no teste ficaram enfeitiçadas ou amedrontadas por você (à sua escolha) até o início do seu próximo turno. Quando você usar essa característica, você não poderá utilizá-la novamente antes de realizar um descanso curto ou longo.`
                },
                {
                    nome: "NÉVOA DE FUGA",
                    descricao: `A partir do 6° nível, você pode desaparecer em uma lufada de névoa em resposta a alguma ofensa. Quando você sofrer dano, você pode usar sua reação para ficar invisível e se teletransportar a até 18 metros para um espaço desocupado que você possa ver. Você permanece invisível até o início do seu próximo turno ou até realizar um ataque ou conjurar uma magia. Após usar essa características, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.`
                },
                {
                    nome: "DEFESA SEDUTORA",
                    descricao: `A partir do 10° nível, seu patrono ensina você como voltar as magias de efeito mental dos seus inimigos contra eles. Você não pode ser enfeitiçado e, quando outra criatura tenta enfeitiçá-lo, você pode usar sua reação para tentar reverter o encanto de volta aquela criatura. A criatura deve ser bem sucedida num teste de resistência de Sabedoria contra a CD da sua magia de bruxo ou ficara enfeitiçada por 1 minuto ou até a criatura sofrer dano.`
                },
                {
                    nome: "DELÍRIO SOMBRIO",
                    descricao: `Começando no 14° nível, você pode imergir uma criatura num reino ilusório. Com um ação, escolha uma criatura que você possa ver a até 18 metros de você. Ela deve ser bem sucedida num teste de resistência de Sabedoria contra a CD da sua magia de bruxo. Se ela falhar, ela ficará enfeitiçada ou amedrontada por você (à sua escolha) por 1 minuto ou até você quebrar sua concentração (como se você estivesse se concentrando em uma magia). Esse efeito termina prematuramente se a criatura sofrer dano. Até que essa ilusão termine, a criatura acredita que está perdida num reino enevoado, a aparência desse reino fica a seu critério. A criatura só pode ver e ouvir a si mesma, a você e a sua ilusão. Você deve terminar um descanso curto ou longo antes de poder usar essa característica novamente.`
                }
            ],
            ["fogo das fadas", "sono", "acalmar emoções", "força fantasmagórica", "piscar", "ampliar plantas", "dominar besta", " invisibilidade maior", "dominar pessoa", "similaridade"],
            [
                {
                    nivel: 1,
                    caracteristicas: ["LISTA DE MAGIA EXPANDIDA", "PRESENÇA FEÉRICA"]
                },
                {
                    nivel: 6,
                    caracteristicas: ["NÉVOA DE FUGA"]
                },
                {
                    nivel: 10,
                    caracteristicas: ["DEFESA SEDUTORA"]
                },
                {
                    nivel: 14,
                    caracteristicas: ["DELÍRIO SOMBRIO"]
                }
            ]
        )
    }
}