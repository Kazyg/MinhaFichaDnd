import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CirculoDaTerra extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
        magias?: { terreno: string; magias: string[] }[];
    }[];

    constructor() {
        super(
            "Círculo da Terra",
            "O Círculo da Terra é constituído por místicos e sábios que salvaguardam conhecimento e ritos antigos através de uma vasta tradição oral. Esses druidas se encontram em círculos sagrados de árvores ou monólitos para sussurrar segredos primordiais em Druídico. Os membros mais sábios do círculo presidem como os sacerdotes-dirigentes de comunidades que creem na Crença Antiga, e servem como conselheiros para os governantes desses povos. Como membro desse círculo, sua magia é influenciada pela terra onde você é iniciado nos ritos misteriosos do círculo."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Truque Adicional",
                nivel: 2,
                descricao: "Quando você escolhe esse círculo no 2° nível, você aprende um truque de druida adicional, à sua escolha."
            },
            {
                nome: "Recuperação Natural",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode recuperar parte da sua energia mágica parando para fazer uma meditação e comunhão com a natureza. Durante um descanso curto, você escolhe espaços de magia gastos para recuperar. O espaço de magia pode ter um nível combinado igual ou menor que metade do seu nível de druida (arredondado para baixo) e, nenhum dos espaços pode ser de uma magia de 6° nível ou superior. Você não pode usar essa característica novamente até terminar um descanso longo. Por exemplo, quando você for um druida de 4° nível, você pode recuperar até dois níveis em espaços de magia. Você pode recuperar, tanto uma magia de 2° nível, quanto duas magias de 1° nível.
                `
            },
            {
                nome: "Magias de Círculo",
                nivel: 3,
                descricao: `
                    Sua conexão mística com a terra infunde você com a habilidade de conjurar certas magias. No 3°, 5°, 7° e 9° nível, você ganha acesso a magias de círculo ligadas ao terreno em que você se tornou druida. Escolha o terreno – ártico, costa, deserto, floresta, montanha, pântano, planície ou subterrâneo – e consulte a lista de magias associada. Uma vez que você tenha acesso a uma magia de círculo, você sempre poderá prepará-la e ela não conta no número de magias que você pode preparar a cada dia. Se você tiver acesso a uma magia que não aparece na lista de magias de druida, a magia, no entanto, será uma magia de druida para você.
                `,
                magias: [
                    {
                        terreno: "Ártico",
                        magias: ["Imobilizar Pessoa", "Crescer Espinho"]
                    },
                    {
                        terreno: "Costa",
                        magias: ["Passo Nebuloso", "Reflexos"]
                    },
                    {
                        terreno: "Deserto",
                        magias: ["Nublar", "Silêncio"]
                    },
                    {
                        terreno: "Floresta",
                        magias: ["Patas de Aranha", "Pele de Árvore"]
                    },
                    {
                        terreno: "Montanha",
                        magias: ["Crescer Espinho", "Patas de Aranha"]
                    },
                    {
                        terreno: "Pântano",
                        magias: ["Escuridão", "Flecha Ácida"]
                    },
                    {
                        terreno: "Planície",
                        magias: ["Invisibilidade", "Passos sem Pegadas"]
                    },
                    {
                        terreno: "Subterrâneo",
                        magias: ["Patas de Aranha", "Teia"]
                    }
                ]
            },
            {
                nome: "Magias de Círculo",
                nivel: 5,
                descricao: "",
                magias: [
                    {
                        terreno: "Ártico",
                        magias: ["Nevasca", "Lentidão"]
                    },
                    {
                        terreno: "Costa",
                        magias: ["Andar na Água", "Respirar Água"]
                    },
                    {
                        terreno: "Deserto",
                        magias: ["Criar Alimentos", "Proteção contra Energia"]
                    },
                    {
                        terreno: "Floresta",
                        magias: ["Convocar Relâmpagos", "Crescer Plantas"]
                    },
                    {
                        terreno: "Montanha",
                        magias: ["Mesclar-se às Rochas", "Relâmpago"]
                    },
                    {
                        terreno: "Pântano",
                        magias: ["Andar na Água", "Névoa Fétida"]
                    },
                    {
                        terreno: "Planície",
                        magias: ["Luz do Dia", "Velocidade"]
                    },
                    {
                        terreno: "Subterrâneo",
                        magias: ["Forma Gasosa", "Névoa Fétida"]
                    }
                ]
            },
            {
                nome: "Magias de Círculo",
                nivel: 7,
                descricao: "",
                magias: [
                    {
                        terreno: "Ártico",
                        magias: ["Movimentação Livre", "Tempestade de Gelo"]
                    },
                    {
                        terreno: "Costa",
                        magias: ["Movimentação Livre", "Controlar Água"]
                    },
                    {
                        terreno: "Deserto",
                        magias: ["Praga", "Terreno Alucinógeno"]
                    },
                    {
                        terreno: "Floresta",
                        magias: ["Adivinhação", "Movimentação Livre"]
                    },
                    {
                        terreno: "Montanha",
                        magias: ["Moldar Rochas", "Pele de Pedra"]
                    },
                    {
                        terreno: "Pântano",
                        magias: ["Localizar Criatura", "Movimentação Livre"]
                    },
                    {
                        terreno: "Planície",
                        magias: ["Adivinhação", "Movimentação Livre"]
                    },
                    {
                        terreno: "Subterrâneo",
                        magias: ["Invisibilidade Maior", "Moldar Rochas"]
                    }
                ]
            },
            {
                nome: "Magias de Círculo",
                nivel: 9,
                descricao: "",
                magias: [
                    {
                        terreno: "Ártico",
                        magias: ["Comunhão com a Natureza", "Cone de Frio"]
                    },
                    {
                        terreno: "Costa",
                        magias: ["Vidência", "Conjurar Elemental"]
                    },
                    {
                        terreno: "Deserto",
                        magias: ["Muralha de Pedra", "Praga de Insetos"]
                    },
                    {
                        terreno: "Floresta",
                        magias: ["Comunhão com a Natureza", "Passo de Árvore"]
                    },
                    {
                        terreno: "Montanha",
                        magias: ["Criar Passagem", "Muralha de Pedra"]
                    },
                    {
                        terreno: "Pântano",
                        magias: ["Vidência", "Praga de Insetos"]
                    },
                    {
                        terreno: "Planície",
                        magias: ["Praga de Insetos", "Sonho"]
                    },
                    {
                        terreno: "Subterrâneo",
                        magias: ["Praga de Insetos", "Névoa Mortal"]
                    }
                ]
            },
            {
                nome: "Caminho da Floresta",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, mover-se através de terreno difícil não-mágico não te custará nenhum movimento extra. Você também pode passar através de plantas não-mágicas sem ser atrasado por elas e sem sofrer dano delas se elas tiverem espinhos, espinhas ou perigos similares. Além disso, você tem vantagem em testes de resistência contra plantas criadas magicamente ou manipuladas para impedir movimentação, como as criadas pela magia constrição.
                `
            },
            {
                nome: "Proteção Natural",
                nivel: 10,
                descricao: `
                    Quando você atingir o 10° nível, você não pode ser enfeitiçado ou amedrontado por elementais ou fadas e você se torna imune a venenos e doenças.
                `
            },
            {
                nome: "Santuário Natural",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, as criaturas do mundo natural sentem sua ligação com a natureza e hesitarão em atacar você. Quando uma besta ou planta atacar você, essa criatura deverá fazer um teste de resistência de Sabedoria contra uma CD igual a das suas magias de druida. Em uma falha, a criatura deve escolher um alvo diferente ou o ataque erra automaticamente. Em um sucesso, a criatura se torna imune a esse efeito por 24 horas. A criatura está ciente deste efeito antes de resolver atacar você.
                `
            }
        ];
    }
}