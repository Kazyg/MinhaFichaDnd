import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Espadachim extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Espadachim",
            "Duelistas elegantes que combinam esgrima com carisma, transformando o combate em uma performance. Especialistas em combate individual e movimentos acrobáticos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Passo Elegante e Audácia Devassa",
                nivel: 3,
                descricao: `
                    Passo Elegante:
                    - Após ataque corpo-a-corpo, o alvo não pode fazer ataques de oportunidade contra você neste turno
                    
                    Audácia Devassa:
                    - Bônus de iniciativa = modificador de Carisma
                    - Nova forma de Ataque Furtivo: pode usar sem vantagem se:
                      * Estiver a 1.5m do alvo
                      * Nenhuma outra criatura a 1.5m
                      * Sem desvantagem no ataque
                `
            },
            {
                nome: "Penachar",
                nivel: 9,
                descricao: `
                    Ação: teste de Persuasão vs Intuição da criatura (deve compartilhar idioma)
                    
                    Contra hostis:
                    - Desvantagem em ataques contra outros
                    - Não pode fazer ataques de oportunidade contra outros
                    - Dura 1 minuto ou até aliado atacar/alvo ser afetado por magia/afastar 18m
                    
                    Contra não-hostis:
                    - Encantado por 1 minuto
                    - Efeito termina se prejudicado por você ou aliados
                `
            },
            {
                nome: "Manobra Elegante",
                nivel: 13,
                descricao: `
                    Ação bônus: vantagem no próximo teste de Acrobacia ou Atletismo no mesmo turno
                `
            },
            {
                nome: "Mestre Duelista",
                nivel: 17,
                descricao: `
                    Ao errar um ataque: pode rerrolar com vantagem
                    - Recarrega com descanso curto/longo
                `
            }
        ];
    }
}