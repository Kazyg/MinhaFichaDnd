import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ExterminadorDeMonstros extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Exterminador de Monstros",
            "Caçadores especializados em eliminar criaturas sobrenaturais como vampiros, dragões e demônios. Mestres em identificar e explorar as fraquezas de seus inimigos mágicos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magia do Exterminador de Monstros, Sentido do Caçador e Exterminador de Presas",
                nivel: 3,
                descricao: `
                    Magias Adicionais:
                    - 3°: proteção contra o bem e mal
                    - 5°: zona da verdade
                    - 9°: círculo mágico
                    - 13°: banimento
                    - 17°: imobilizar monstro
                    
                    Sentido do Caçador:
                    - Ação para detectar imunidades/resistências/vulnerabilidades de criatura a 18m
                    - Usos = mod. Sabedoria (mínimo 1), recarrega em descanso longo
                    
                    Exterminador de Presas:
                    - Ação bônus: marca criatura a 18m
                    - 1x/turno: +1d6 de dano ao acertar a presa
                    - Dura até descanso curto/longo ou mudar de alvo
                `
            },
            {
                nome: "Defesa Sobrenatural",
                nivel: 7,
                descricao: `
                    - Contra presa marcada: adiciona 1d6 em:
                      * Testes de resistência forçados por ela
                      * Testes para escapar dela
                `
            },
            {
                nome: "Nêmeses do Conjurador",
                nivel: 11,
                descricao: `
                    - Reação quando vê criatura conjurando magia/teleportando a 18m:
                      * Teste de Sabedoria (CD suas magias) ou anula o efeito
                    - Recarrega com descanso curto/longo
                `
            },
            {
                nome: "Contra-Ataque do Exterminador",
                nivel: 15,
                descricao: `
                    - Reação quando presa marcada força teste de resistência:
                      * Ataque contra ela antes do teste
                      * Se acertar: teste automaticamente bem-sucedido
                `
            }
        ];
    }
}