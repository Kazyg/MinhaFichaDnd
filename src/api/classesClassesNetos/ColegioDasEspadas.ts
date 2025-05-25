import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ColegioDasEspadas extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Colégio das Espadas",
            "Bardos especialistas em proezas marciais que entretêm através de façanhas com armas. Conhecidos como Lâminas, combinam habilidades de performance com técnicas de combate letais, seja para justiça ou propósitos nefastos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Proficiência Bônus, Estilo de Luta e Floreio de Lâminas",
                nivel: 3,
                descricao: `
                    Proficiência Bônus: Ganha proficiência com armadura média e cimitarras. Pode usar armas simples/marciais como foco de feitiço.
                    
                    Estilo de Luta: Escolha entre:
                    - Duelo (+2 no dano com arma empunhada em uma mão)
                    - Combate com Duas Armas (adiciona mod. de habilidade no dano do segundo ataque)
                    
                    Floreio de Lâminas: Ao usar ação de Ataque:
                    - +3m de movimento no turno
                    - Escolha um floreio ao acertar um ataque:
                      * Defensivo: Gaste Inspiração para dano extra e aumentar CA (valor do dado)
                      * Cortante: Gaste Inspiração para dano extra no alvo e criaturas adjacentes
                      * Móvel: Gaste Inspiração para dano extra, empurrar alvo e mover-se como reação
                `
            },
            {
                nome: "Ataque Extra",
                nivel: 6,
                descricao: `
                    No 6° nível, pode atacar duas vezes (em vez de uma) quando usa a ação Atacar.
                `
            },
            {
                nome: "Floreio de Mestre",
                nivel: 14,
                descricao: `
                    No 14° nível, ao usar Floreio de Lâminas, pode rolar um d6 em vez de gastar um dado de Inspiração de Bardo.
                `
            }
        ];
    }
}