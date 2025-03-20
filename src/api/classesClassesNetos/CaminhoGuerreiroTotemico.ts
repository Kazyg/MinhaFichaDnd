import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoGuerreiroTotemico extends SubClasses {
    niveis: {
        nome: string
        nivel: number;
        descricao: string;
        opcoes: { nome: string, descricao: string }[] | null;
    }[];
    constructor() {
        super("Caminho do Guerreiro Totêmico", `
                O Caminho do Guerreiro Totêmico é uma jornada
                espiritual, à partir do momento que o bárbaro aceita um
                espirito animal como seu guia, protetor e inspiração. Em
                batalha, seu espirito totêmico preenche você com força
                sobrenatural, adicionando combustível mágico a sua fúria
                bárbara.
                A maioria das tribos bárbaras consideram que um
                animal totêmico possui parentesco a um clã em
                particular. Em tais casos, é incomum a um indivíduo
                possuir mais de um espirito animal totêmico, apesar de
                existirem exceções.
                `);
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Conselheiro Espiritual",
                nivel: 3,
                descricao: `
                            Seu caminho é buscar a sintonia com o mundo natural,
                            concedendo a você uma afinidade com as bestas. A partir
                            do 3° nível, quando você toma esse caminho, você recebe a
                            habilidade de conjurar as magias sentido bestial e falar
                            com animais, mas apenas na forma de rituais, como
                            descrito no capítulo 10.
                        `,
                opcoes: null
            },
            {
                nome: "Totem Espiritual",
                nivel: 3,
                descricao: `
                            A partir do 3° nível, quando você adota esse caminho,
                            você escolhe um totem espiritual e ganha suas
                            características. Você deve fazer ou adquirir um objeto
                            físico como totem – um amuleto ou adorno similar – que
                            incorpora o pelo ou penas, garras, dente ou ossos do
                            animal totêmico. Se você quiser, você também adquire
                            pequenos atributos físicos que o assemelham ao seu totem
                            espiritual. Por exemplo, se você tiver o totem espiritual do
                            urso, você seria incomumente peludo e de pele grossa, ou
                            se o seu totem for a águia, seu olhos teriam um brilho
                            amarelado.
                            Seu totem animal deve ser um animal relacionado aos
                            listados aqui, mas pode ser um mais apropriado a sua
                            terra natal. Por exemplo, você poderia escolher falcão ou
                            abutre ao invés de águia.
                        `,
                opcoes: [
                    {
                        nome: "Águia",
                        descricao: `
                                    Quando estiver em fúria e não estiver vestindo
                                    uma armadura pesada, as outras criaturas terão
                                    desvantagem nas jogadas de ataque de oportunidade
                                    contra você e você pode usar a ação de Disparada como
                                    uma ação bônus no seu turno. O espirito da águia torna
                                    você um predador que pode vagar pelo meio da briga com
                                    facilidade.
                                `
                    },
                    {
                        nome: "Lobo",
                        descricao: `
                                    Quando estiver em fúria, seus amigos tem
                                    vantagem nas jogadas de ataque corpo-a-corpo realizadas
                                    contra qualquer criatura a 1,5 metro de você que seja
                                    hostil a você. O espirito do lobo transforma você em um
                                    líder de caça.
                                `
                    },
                    {
                        nome: "Urso",
                        descricao: `
                                    Quando em fúria, você adquire resistência a
                                    todos os tipos de dano, exceto dano psíquico. O espirito do
                                    urso torna você vigoroso o suficiente para permanecer de
                                    pé diante de qualquer castigo.
                                `
                    }
                ]
            },
            {
                nome: "Aspecto da Besta",
                nivel: 6,
                descricao: `
                            No 6° nível, você adquire um benefício místico baseado no
                            totem que você escolheu. Você pode escolher o mesmo
                            animal que selecionou no 3° nível ou um diferente.
                        `,
                opcoes: [
                    {
                        nome: "Águia",
                        descricao: `
                                    Você ganha a visão aguçada de uma águia.
                                    Você pode ver a até 1,6 km sem dificuldade, sendo capaz
                                    de discernir até os menores detalhes quando estiver
                                    olhando para algo a menos de 30 metros de você. Além
                                    disso, penumbra não impõem desvantagem nos seus
                                    testes de Sabedoria (Percepção).
                                `
                    },
                    {
                        nome: "Lobo",
                        descricao: `
                                    Você ganha a sensibilidade predatória de um
                                    lobo. Você pode rastrear outras criaturas quando estiver
                                    viajando a passo rápido e você pode se mover
                                    furtivamente quando estiver viajando a passo normal
                                    (veja o capítulo 8 para as regras de passo de viagem).
                                `
                    },
                    {
                        nome: "Urso",
                        descricao: `
                                    Você ganha a força de um urso. Sua capacidade
                                    de carga (incluindo carga máxima e capacidade de erguer)
                                    é dobrada e você tem vantagem em testes de Força
                                    realizados para empurrar, puxar, erguer ou quebrar
                                    objetos.
                                `
                    }
                ]
            },
            {
                nome: "Andarilho Espiritual",
                nivel: 10,
                descricao: `
                            No 10° nível, você pode conjurar a magia comunhão com a
                            natureza, mas apenas como um ritual. Quando o fizer,
                            uma versão espiritual de um dos animais que você
                            escolheu como Totem Espiritual ou Aspecto da Besta
                            aparece para você para transmitir a informação que você
                            busca.
                        `,
                        opcoes: null
            },
            {
                nome: "Sintonia Totêmica",
                nivel: 14,
                descricao: `
                            No 14° nível, você ganha um benefício magico baseado em
                            um totem animal, à sua escolha. Você pode escolher o
                            mesmo animal que selecionou anteriormente ou um
                            diferente.
                        `,
                opcoes: [
                    {
                        nome: "Águia",
                        descricao: `
                                    Quando estiver em fúria, você adquire um
                                    deslocamento de voo igual ao seu deslocamento de
                                    caminhada. Esse benefício funciona apenas em pequenos
                                    explosões: você cai se terminar seu turno no ar e não tiver
                                    nada em que possa se agarrar.
                                `
                    },
                    {
                        nome: "Lobo",
                        descricao: `
                                    Quando estiver em fúria, você pode usar uma
                                    ação bônus no seu turno para derrubar uma criatura
                                    Grande ou menor no chão quando você atingi-la com um
                                    ataque corpo-a-corpo com arma.
                                `
                    },
                    {
                        nome: "Urso",
                        descricao: `
                                    Quando estiver em fúria, qualquer criatura a
                                    até 1,5 metro de você que for hostil a você terá
                                    desvantagem nas jogadas de ataque contra outros alvos
                                    além de você ou outro personagem com essa
                                    característica. Um inimigo é imune a esse efeito se ele
                                    não puder ver ou ouvir você ou caso ele não possa ser
                                    amedrontado.
                                `
                    }
                ]
            }
        ]
    }

}
