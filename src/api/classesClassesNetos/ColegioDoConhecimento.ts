import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ColegioDoConhecimento extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Colégio do Conhecimento",
            "Bardos do Colégio do Conhecimento conhecem algo sobre a maioria das coisas, coletando pedaços de conhecimento de fontes tão diversas quanto tomos eruditos ou contos de camponeses. Quer seja cantando baladas populares em taverna, quer seja elaborando composições para cortes reais, esses bardos usam seus dons para manter a audiência enfeitiçada. Quando os aplausos acabam, os membros da audiência vão estar se questionando se tudo que eles creem é verdade, desde sua crença no sacerdócio do templo local até sua lealdade ao rei."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Proficiência Adicional",
                nivel: 3,
                descricao: "Quando você se junta ao Colégio do Conhecimento no 3° nível, você ganha proficiência em três perícias, à sua escolha."
            },
            {
                nome: "Palavras de Interrupção",
                nivel: 3,
                descricao: `
                    Também no 3° nível, você aprende como usar sua perspicácia para distrair, confundir e, de outras formas, atrapalhar a confiança e competência de outros. Quando uma criatura que você pode ver a até 18 metros de você realizar uma jogada de ataque, um teste de habilidade ou uma jogada de dano, você pode usar sua reação para gastar um uso de Inspiração de Bardo, rolando o dado de Inspiração de Bardo e subtraindo o número rolado da rolagem da criatura. Você escolhe usar essa característica depois da criatura fazer a rolagem, mas antes do Mestre determinar se a jogada de ataque ou teste de habilidade foi bem ou mal sucedido, ou antes da criatura causar dano. A criatura será imune se não puder ouvir ou se não puder ser enfeitiçada.
                `
            },
            {
                nome: "Segredos Mágicos Adicionais",
                nivel: 6,
                descricao: `
                    No 6° nível, você aprende duas magias, à sua escolha, de qualquer classe. As magias que você escolher devem ser de um nível que você possa conjurar, como mostrado na tabela O Bardo, ou um truque. As magias escolhidas contam como magias de bardo pra você, mas não contam no número de magias de bardo que você conhece.
                `
            },
            {
                nome: "Perícia Inigualável",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, quando você fizer um teste de habilidade, você pode gastar um uso de Inspiração de Bardo. Role o dado de Inspiração de Bardo e adicione o número rolado ao seu teste de habilidade. Você pode escolher fazer isso depois de rolar o dado do teste de habilidade, mas antes do Mestre dizer se foi bem ou mal sucedido.
                `
            }
        ];
    }
}