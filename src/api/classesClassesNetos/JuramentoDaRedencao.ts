import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class JuramentoDaRedencao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Juramento da Redenção",
            "Paladinos pacifistas que buscam redimir até os piores criminosos, usando a violência apenas como último recurso. Idealistas que acreditam no poder da compaixão e do perdão."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias de Juramento e Canalizar Divindade",
                nivel: 3,
                descricao: `
                    Magias de Juramento:
                    - 3°: santuário, sono
                    - 7°: imobilizar pessoa, acalmar emoções
                    - 15°: contramágica, padrão hipnótico
                    - 18°: esfera resiliente de otiluke, pele rochosa
                    - 20°: imobilizar monstro, muralha de energia
                    
                    Canalizar Divindade:
                    - Emissário da Paz: Ação bônus para +5 em Persuasão por 10 minutos
                    - Repreendendo a Violência: Reação quando criatura a 9m causa dano a outro - atacante faz teste de Sabedoria ou recebe dano radiante igual ao causado (metade se passar)
                `
            },
            {
                nome: "Aura do Guardião (3m)",
                nivel: 7,
                descricao: `
                    - Reação quando aliado a 3m sofre dano: assume o dano você mesmo (aumenta para 9m no 18° nível)
                    - Não transfere outros efeitos do dano
                `
            },
            {
                nome: "Espírito Protetor",
                nivel: 15,
                descricao: `
                    - Se terminar turno em combate com menos da metade dos PV: recupera 1d6 + metade do nível de paladino
                `
            },
            {
                nome: "Emissário da Redenção",
                nivel: 20,
                descricao: `
                    - Resistência a todo dano de outras criaturas
                    - Quando atingido: atacante recebe dano radiante = metade do dano causado
                    - Perde benefícios se atacar/causar dano a criatura até descanso longo
                `
            }
        ];
    }
}