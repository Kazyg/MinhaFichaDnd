import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EstiloDaAlmaSolar extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Estilo da Alma Solar",
            "Monges que canalizam sua energia vital em poderosos raios solares, tornando-se fontes de luz radiante e calor abrasador no campo de batalha."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Raio Solar Radiante",
                nivel: 3,
                descricao: `
                    - Ataque especial à distância (9m) que causa dano radiante
                    - Proficiente, usa Destreza para ataque/dano
                    - Dano inicia em 1d4, escala com nível de monge
                    - Pode gastar 1 ki para atacar 2x como ação bônus
                    - Funciona com Ataque Extra em níveis mais altos
                `
            },
            {
                nome: "Golpe do Arco Abrasador",
                nivel: 6,
                descricao: `
                    - Após ação de Ataque, gasta 2 ki para conjurar Mãos Flamejantes como ação bônus
                    - Pode aumentar nível da magia gastando ki adicional (máximo = metade do nível de monge)
                `
            },
            {
                nome: "Explosão Calcinante",
                nivel: 11,
                descricao: `
                    - Ação para criar orbe em ponto a 45m
                    - 8m de raio: teste de Constituição ou 2d6 de dano radiante
                    - Pode gastar até 3 ki para aumentar dano (+2d6 por ponto)
                `
            },
            {
                nome: "Escudo Solar",
                nivel: 17,
                descricao: `
                    - Aura de luz (9m luz plena + 9m penumbra)
                    - Pode ativar/desativar como ação bônus
                    - Reação quando atingido: causa 5 + mod. Sabedoria de dano radiante
                `
            }
        ];
    }
}