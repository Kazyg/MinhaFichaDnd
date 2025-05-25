import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EstiloDoMestreBebado extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Estilo do Mestre Bêbado",
            "Monges que usam movimentos erráticos e imprevisíveis para confundir inimigos. Sua aparente falta de jeito esconde técnicas marciais refinadas e uma agilidade surpreendente."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Proficiências Bônus e Técnica Bêbada",
                nivel: 3,
                descricao: `
                    Proficiências Bônus:
                    - Ganha proficiência em Atuação (se não tiver)
                    - Ganha proficiência com suprimento do cervejeiro (se não tiver)
                    
                    Técnica Bêbada:
                    - Ao usar Rajada de Golpes:
                      * Ganha benefício da ação Desengajar
                      * +3m no deslocamento até fim do turno
                `
            },
            {
                nome: "Balanço Bêbado",
                nivel: 6,
                descricao: `
                    Levantar do Chão:
                    - Pode levantar-se usando apenas 3m de movimento (em vez de metade)
                    
                    Redirecionar Ataque:
                    - Reação quando inimigo erra ataque corpo-a-corpo: gasta 1 ponto de ki
                    - Faz ataque errar acertar outra criatura visível a 1.5m
                `
            },
            {
                nome: "Sorte do Bêbado",
                nivel: 11,
                descricao: `
                    Ao fazer teste com desvantagem:
                    - Pode gastar 2 pontos de ki para cancelar a desvantagem
                `
            },
            {
                nome: "Frenesi do Bêbado",
                nivel: 17,
                descricao: `
                    Ao usar Rajada de Golpes:
                    - Pode fazer até 5 ataques (em vez de 2)
                    - Cada ataque adicional deve ser contra criatura diferente
                `
            }
        ];
    }
}