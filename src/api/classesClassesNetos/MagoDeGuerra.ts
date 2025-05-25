import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class MagoDeGuerra extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Mago de Guerra",
            "Especialistas em magia de combate que combinam ofensiva poderosa com defesa sólida. Adeptos do controle tático do campo de batalha, transformando magia em arma e armadura."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Deflexão Arcana e Astúcia Tática",
                nivel: 2,
                descricao: `
                    Deflexão Arcana:
                    - Reação quando atingido ou falha em teste de resistência:
                      * +2 CA contra o ataque OU +4 no teste de resistência
                    - Restrição: Não pode conjurar magias não-truque até fim do próximo turno
                    
                    Astúcia Tática:
                    - Bônus de iniciativa = modificador de Inteligência
                `
            },
            {
                nome: "Surto de Poder",
                nivel: 6,
                descricao: `
                    - Armazena surtos = mod. Inteligência (mínimo 1)
                    - Ganha 1 surto ao:
                      * Terminar descanso longo sem surtos
                      * Concluir dissipar magia/contramágica com sucesso
                    - 1x/turno ao causar dano com magia: gasta surto para dano extra = metade do nível
                `
            },
            {
                nome: "Magia Duradoura",
                nivel: 10,
                descricao: `
                    Enquanto mantém concentração:
                    - +2 CA
                    - +2 em todos os testes de resistência
                `
            },
            {
                nome: "Blindagem Defletora",
                nivel: 14,
                descricao: `
                    Ao usar Deflexão Arcana:
                    - Causa dano de energia = metade do nível em até 3 criaturas a 18m
                `
            }
        ];
    }
}