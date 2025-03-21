import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class ArtesaoGuilda extends BackGround {
    constructor() {
        super("artesão da guilda", ["Insight", "Persuasão"], 1, [" conjunto de ferramentas de artesão", "carta de apresentação da sua guilda", " conjunto de roupas de viajante", "algibeira com 15 po"], 
            ["Ferramentas de artesão"],
            {
                "nome": "Negócios da Guilda",
                "descricao": "Guildas são encontradas, geralmente, em cidades grandes o suficiente para suportar inúmeros artesãos praticando o mesmo negócio. No entanto, sua guilda, ao invés disso, pode ser uma rede de artesãos, cada um trabalhando em uma vila diferente dentro de um reino maior. Converse com o Mestre para determinar a natureza da sua guilda. Você pode escolher seu negócio da guilda da tabela Negócios da Guilda ou rolar aleatoriamente. Como um membro da sua guilda, você conhece as perícias necessárias para criar itens completos a partir de matéria-prima (refletido na sua proficiência em um certo tipo de ferramenta de artesão), assim como os princípios de comércio e boas práticas comerciais. A questão agora é se você abandona seu comércio para se aventurar ou faz um esforço extra para tentar manter aventuras e comércio juntos."
            }

        )
    }
}