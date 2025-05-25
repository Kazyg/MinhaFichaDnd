import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Inquiridor extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Inquiridor",
            "Detetives magistrais e desvendadores de mistérios que combinam percepção aguçada com intuição sobrenatural. Especialistas em expor mentiras e revelar verdades ocultas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Ouvir do Enganador, Olhar do Detalhe e Combatente Perspicaz",
                nivel: 3,
                descricao: `
                    Ouvir do Enganador:
                    - Em testes de Intuição para detectar mentiras, trata resultados 7 ou menos no d20 como 8
                    
                    Olhar do Detalhe:
                    - Ação bônus para fazer teste de Percepção (detectar objetos/criaturas) ou Investigação (descobrir pistas)
                    
                    Combatente Perspicaz:
                    - Ação bônus: teste de Intuição vs Enganação do alvo
                    - Se bem-sucedido, pode usar Ataque Furtivo sem vantagem (mas não com desvantagem)
                    - Dura 1 minuto ou até usar em outro alvo
                `
            },
            {
                nome: "Olhar Constante",
                nivel: 9,
                descricao: `
                    Vantagem em testes de Percepção ou Investigação se não tiver se movido mais que metade do deslocamento no turno
                `
            },
            {
                nome: "Olhar Inflexível",
                nivel: 13,
                descricao: `
                    Ação para detectar em 9m:
                    - Ilusões
                    - Metamorfos disfarçados
                    - Outras magias de engano
                    - Sabe que há engano, mas não vê a verdade
                    - Usos = mod. Sabedoria (mínimo 1), recarrega em descanso longo
                `
            },
            {
                nome: "Olhar da Fraqueza",
                nivel: 17,
                descricao: `
                    Ao estudar alvo, aumenta Ataque Furtivo em 3d6
                `
            }
        ];
    }
}