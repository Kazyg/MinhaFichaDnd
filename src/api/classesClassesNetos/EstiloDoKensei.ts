import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EstiloDoKensei extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Estilo do Kensei",
            "Monges que elevam armas à perfeição marcial, tratando-as como extensões de seu corpo. Artistas marciais que combinam armas tradicionais com técnicas de combate refinadas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Caminho do Kensei (2 armas)",
                nivel: 3,
                descricao: `
                    Armas Kensei:
                    - Escolha 1 arma corpo-a-corpo e 1 à distância (simples/marcial sem pesada/especial)
                    - Ganha proficiência se não tiver
                    - Contam como armas de monge
                    
                    Esquiva Rápida:
                    - Após ataque desarmado segurando arma Kensei corpo-a-corpo: +2 CA até próximo turno
                    
                    Tiro do Kensei:
                    - Ação bônus: ataques à distância com arma Kensei causam +1d4 de dano até fim do turno
                    
                    Caminho do Pincel:
                    - Proficiência em Suprimentos de Caligrafia ou Ferramentas de Pintor
                `
            },
            {
                nome: "Uno Com a Lâmina e Caminho do Kensei (3 armas)",
                nivel: 6,
                descricao: `
                    Uno Com a Lâmina:
                    - Armas Kensei contam como mágicas para superar resistências
                    - Ao acertar com arma Kensei: gasta 1 ki para dano extra = dado de Artes Marciais (1x/turno)
                    
                    Caminho do Kensei:
                    - Escolha mais 1 arma (total 3)
                `
            },
            {
                nome: "Aguçar a Lâmina e Caminho do Kensei (4 armas)",
                nivel: 11,
                descricao: `
                    Aguçar a Lâmina:
                    - Ação bônus: gasta até 3 ki para dar bônus igual em ataques/danos com arma Kensei (dura 1 minuto)
                    - Não afeta armas já mágicas
                    
                    Caminho do Kensei:
                    - Escolha mais 1 arma (total 4)
                `
            },
            {
                nome: "Precisão Infalível e Caminho do Kensei (5 armas)",
                nivel: 17,
                descricao: `
                    Precisão Infalível:
                    - Ao errar ataque com arma de monge: pode atacar novamente (1x/turno)
                    
                    Caminho do Kensei:
                    - Escolha mais 1 arma (total 5)
                `
            }
        ];
    }
}