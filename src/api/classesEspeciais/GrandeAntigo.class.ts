import { Patronos } from "./Patronos.class.ts";

export class GrandeAntigo extends Patronos {
    constructor() {
        super(
            "O Grande Antigo",
            [
                {
                    nome: "LISTA DE MAGIA EXPANDIDA",
                    descricao: "O Grande Antigo permite que você escolha magias de uma lista expandida quando você for aprender magias de bruxo. As seguintes magias são adicionadas a sua lista de magias de bruxo. "
                },
                {
                    nome: "DESPERTAR A MENTE",
                    descricao: `A partir do 1° nível, seu conhecimento alienígena concede a você a habilidade de tocar a mente de outras criaturas. Você pode se comunicar telepaticamente com qualquer criatura que você possa ver a até 18 metros de você. Você não precisa partilhar um idioma com a criatura para compreender suas expressões telepáticas, mas a criatura deve ser capaz de compreender pelo menos um idioma.`
                },
                {
                    nome: "PROTEÇÃO ENTRÓPICA",
                    descricao: `A partir do 6° nível, você aprende a se proteger magicamente contra ataques e a transformar os ataques mal sucedidos de seus inimigos em boa sorte pra você. Quando uma criatura realizar uma jogada de ataque contra você, você pode usar sua reação para impor desvantagem nessa jogada. Se o ataque errar você, sua próxima jogada de ataque contra essa criatura recebe vantagem se você o fizer antes do final do seu próximo turno. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.`
                },
                {
                    nome: "ESCUDO DE PENSAMENTOS",
                    descricao: `A partir do 10° nível, seus pensamentos não podem ser lidos através de telepatia ou outros meios, a não ser que você permita. Você também adquire resistência a dano psíquico e, toda vez que uma criatura causar dano psíquico a você, essa criatura sofre a mesma quantidade de dano que você sofreu.`
                },
                {
                    nome: "CRIAR LACAIO",
                    descricao: `No 14° nível, você adquire a habilidade de infectar a mente de um humanoide com a magia alienígena do seu patrono. Você pode usar sua ação para tocar um humanoide incapacitado. Essa criatura então, ficará enfeitiçada por você até que a magia remover maldição seja conjurada sobre ela, a condição enfeitiçado seja removida dela ou você use essa característica novamente. Você pode se comunicar telepaticamente com a criatura enfeitiçada contanto que ambos estejam no mesmo plano de existência.`
                }
            ],
            [
                "Sussurros Dissonantes",
                "Riso Histérico de Tasha",
                "Detectar Pensamentos",
                "Força Fantasmagórica",
                "Clarividência",
                "Enviar Mensagem",
                "Dominar Besta",
                "Tentáculos Negros de Evard",
                "Dominar Pessoa",
                "Telecinésia"
            ],
            [
                {
                    nivel: 1,
                    caracteristicas: ["LISTA DE MAGIA EXPANDIDA", "DESPERTAR A MENTE"]
                },
                {
                    nivel: 6,
                    caracteristicas: ["PROTEÇÃO ENTRÓPICA"]
                },
                {
                    nivel: 10,
                    caracteristicas: ["ESCUDO DE PENSAMENTOS"]
                },
                {
                    nivel: 14,
                    caracteristicas: ["CRIAR LACAIO"]
                }
            ]
        )
    }
}