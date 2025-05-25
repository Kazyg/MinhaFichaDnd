import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ArqueiroArcano extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Arqueiro Arcano",
            "Guerreiros élficos que combinam arquearia com magia, criando efeitos sobrenaturais em seus disparos. Guardiões das fronteiras élficas, seus métodos foram adotados por outras raças capazes de unir precisão arcana ao arco e flecha."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Tradição do Arqueiro Arcano e Disparo Arcano (2 opções)",
                nivel: 3,
                descricao: `
                    Tradição do Arqueiro Arcano:
                    - Proficiência em Arcanismo ou Natureza
                    - Aprende truque Prestidigitação ou Druidismo
                    
                    Disparo Arcano:
                    - 2 opções de Disparo Arcano
                    - 2 usos por descanso curto/longo
                    - 1x/turno ao acertar com arco curto/longo
                `
            },
            {
                nome: "Tiro Curvado, Flecha Mágica e Disparo Arcano (3 opções)",
                nivel: 7,
                descricao: `
                    Tiro Curvado: Ação bônus para rerrolar ataque errado contra novo alvo a 18m
                    
                    Flecha Mágica: Flechas não-mágicas tornam-se mágicas para superar resistências
                    
                    Disparo Arcano: Ganha 1 opção adicional (total 3)
                `
            },
            {
                nome: "Disparo Arcano (4 opções)",
                nivel: 10,
                descricao: `
                    Disparo Arcano: Ganha 1 opção adicional (total 4)
                `
            },
            {
                nome: "Disparo Sempre Pronto e Disparo Arcano (5 opções)",
                nivel: 15,
                descricao: `
                    Disparo Sempre Pronto: Se iniciar combate sem usos, recupera 1 uso
                    
                    Disparo Arcano: Ganha 1 opção adicional (total 5)
                `
            },
            {
                nome: "Disparo Arcano (6 opções, disparos aperfeiçoados)",
                nivel: 18,
                descricao: `
                    Disparo Arcano: Ganha 1 opção adicional (total 6) e todas opções são aprimoradas
                `
            }
        ];
    }
}