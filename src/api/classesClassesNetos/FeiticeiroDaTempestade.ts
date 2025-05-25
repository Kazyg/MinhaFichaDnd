import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class FeiticeiroDaTempestade extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Feiticeiro da Tempestade",
            "Feiticeiros cuja magia emana do poder elemental do ar, seja por sobrevivência à Grande Tormenta, nascimento em tempestades lendárias ou linhagem djinni. Controlam ventos e tempestades, sendo valiosos em navegações e combates aquáticos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Orador do Vento e Magia Tempestuosa",
                nivel: 1,
                descricao: `
                    Orador do Vento: Pode falar, ler e escrever Primordial (incluindo dialetos Aquan, Auran, Ignan e Terran).
                    
                    Magia Tempestuosa: Ação bônus ao conjurar magia de 1°+ para voar 3m sem provocar ataques de oportunidade (antes ou depois da magia).
                `
            },
            {
                nome: "Coração da Tempestade e Guia da Tempestade",
                nivel: 6,
                descricao: `
                    Coração da Tempestade:
                    - Resistência a dano elétrico e trovejante
                    - Ao conjurar magia elétrica/trovejante de 1°+, causa dano = metade do seu nível em criaturas a 3m
                    
                    Guia da Tempestade:
                    - Ação para parar chuva em 6m de raio (ação bônus para encerrar)
                    - Ação bônus para direcionar vento em 30m de raio (dura até próximo turno)
                `
            },
            {
                nome: "Fúria da Tempestade",
                nivel: 14,
                descricao: `
                    Reação ao ser atingido em corpo-a-corpo:
                    - Causa dano elétrico = seu nível
                    - Atacante faz teste de Força (CD magia) ou é empurrado 6m
                `
            },
            {
                nome: "Alma do Vento",
                nivel: 18,
                descricao: `
                    - Imunidade a dano elétrico e trovejante
                    - Voo 18m
                    - Como ação: reduza voo para 9m por 1h e conceda voo 9m para 3 + mod. Carisma aliados a 9m
                    - Recarrega com descanso curto/longo
                `
            }
        ];
    }
}