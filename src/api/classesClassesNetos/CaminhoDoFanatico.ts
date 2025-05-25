import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoDoFanatico extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Caminho do Fanático",
            "Bárbaros fanáticos-guerreiros que canalizam sua fúria em demonstrações de poder divino. Inspirados por divindades de combate, destruição e violência, esses guerreiros abraçam uma fúria sagrada que os sustenta mesmo além da morte."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Fúria Divina e Guerreiro dos Deuses",
                nivel: 3,
                descricao: `
                    Fúria Divina: No 3° nível, enquanto furioso, a primeira criatura que você acertar em cada turno com um ataque de arma recebe dano extra igual a 1d6 + metade do seu nível de bárbaro (dano necrótico ou radiante, escolhido ao adquirir esta habilidade).
                    
                    Guerreiro dos Deuses: Sua alma está marcada para batalha infinita. Magias como reviver mortos não requerem componentes materiais quando usadas em você (desde que não o tornem um morto-vivo).
                `
            },
            {
                nome: "Foco Fanático",
                nivel: 6,
                descricao: `
                    No 6° nível, se falhar em um teste de resistência enquanto furioso, pode refazê-lo (uma vez por fúria). Deve usar o novo resultado.
                `
            },
            {
                nome: "Presença Zelosa",
                nivel: 10,
                descricao: `
                    No 10° nível, como ação bônus, você emite um grito de batalha divino. Até 10 criaturas escolhidas dentro de 18m que possam te ouvir ganham vantagem em ataques e testes de resistência até o início do seu próximo turno. Usar esta habilidade requer um descanso longo para ser usada novamente.
                `
            },
            {
                nome: "Fúria Além da Morte",
                nivel: 14,
                descricao: `
                    No 14° nível, enquanto furioso:
                    - Ter 0 PV não o deixa inconsciente
                    - Ainda faz testes de resistência contra morte normalmente
                    - Se morreria por falhas nos testes, só morre quando a fúria terminar (e ainda estiver com 0 PV)
                `
            }
        ];
    }
}