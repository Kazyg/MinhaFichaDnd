import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoDoArautoDaTempestade extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Caminho do Arauto da Tempestade",
            "Bárbaros que seguem o Caminho do Arauto da Tempestade aprendem a transformar sua fúria em um manto de magia primal, que permeia envolta deles. Quando em fúria, um bárbaro desse caminho toca as forças da natureza para criar poderosos efeitos mágicos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Aura da Tempestade",
                nivel: 3,
                descricao: `
                    No 3° nível, você emana uma aura tempestuosa e mágica enquanto enfurecido. A aura se estende a 3 metros em todas as direções. Escolha entre deserto, mar ou tundra. O efeito pode ser ativado ao entrar em fúria e em cada turno como ação bônus:
                    
                    Deserto: Todas as outras criaturas na aura recebem 2 de dano de fogo (aumenta para 3 no 5° nível, 4 no 10° nível, 5 no 15° nível e 6 no 20° nível).
                    
                    Mar: Escolha uma criatura na aura para fazer um teste de Destreza (CD 8 + profic. + Constituição) ou sofrer 1d6 de dano elétrico (aumenta para 2d6 no 10° nível, 3d6 no 15° nível, 4d6 no 20° nível).
                    
                    Tundra: Criaturas de sua escolha na aura ganham 2 PV temporários (aumenta para 3 no 5° nível, 4 no 10° nível, 5 no 15° nível e 6 no 20° nível).
                `
            },
            {
                nome: "Alma da Tempestade",
                nivel: 6,
                descricao: `
                    No 6° nível, você ganha benefícios baseados no ambiente escolhido:
                    
                    Deserto: Resistência a dano de fogo, imunidade a calor extremo e pode incendiar objetos com uma ação.
                    
                    Mar: Resistência a dano elétrico, respiração aquática e deslocamento de natação de 9 metros.
                    
                    Tundra: Resistência a dano de frio, imunidade a frio extremo e pode congelar água (cubo de 1,5m) com uma ação.
                `
            },
            {
                nome: "Tempestade Protetora",
                nivel: 10,
                descricao: `
                    No 10° nível, criaturas de sua escolha em sua Aura da Tempestade ganham a mesma resistência a dano que você obteve com Alma da Tempestade.
                `
            },
            {
                nome: "Tempestade Furiosa",
                nivel: 14,
                descricao: `
                    No 14° nível, você ganha efeitos adicionais baseados no ambiente:
                    
                    Deserto: Como reação quando atingido, force o atacante a fazer teste de Destreza ou sofra dano de fogo igual à metade do seu nível de bárbaro.
                    
                    Mar: Como reação ao acertar um ataque, force o alvo a fazer teste de Força ou seja derrubado.
                    
                    Tundra: Quando a aura está ativa, pode reduzir o deslocamento de uma criatura para 0 até seu próximo turno (teste de Força para resistir).
                `
            }
        ];
    }
}