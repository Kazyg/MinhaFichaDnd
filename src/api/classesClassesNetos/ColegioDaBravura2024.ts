import { SubClasses } from "../classesPrincipais/SubClasses";

export class ColegioDaBravura2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Colégio da Bravura", "Bardos do Colégio da Bravura são narradores ousados cujas histórias preservam a memória dos grandes heróis do passado e inspiram novas gerações a alcançar feitos grandiosos.");
        this.niveis = [
            {
                nome: "Inspiração em Combate",
                nivel: 3,
                descricao: "Uma criatura que possui um dado de Inspiração de Bardo seu pode usá-lo defensivamente, jogando o dado como Reação para adicionar o resultado à própria CA contra uma jogada de ataque que a atingiu, ou ofensivamente, adicionando o resultado ao dano imediatamente após atingir um alvo com uma jogada de ataque."
            },
            {
                nome: "Treinamento Marcial",
                nivel: 3,
                descricao: "Você adquire proficiência com armas Marciais, armaduras Médias e treinamento com Escudos. Além disso, pode usar uma arma Simples ou Marcial como Foco de Conjuração para conjurar magias da sua lista de magias de Bardo."
            },
            {
                nome: "Ataque Extra",
                nivel: 6,
                descricao: "Você pode atacar duas vezes, em vez de uma, sempre que executar a ação Atacar no seu turno. Além disso, pode conjurar um de seus truques que tenha tempo de conjuração de uma ação no lugar de um desses ataques."
            },
            {
                nome: "Magia de Batalha",
                nivel: 14,
                descricao: "Após conjurar uma magia que tenha tempo de conjuração de uma ação, você pode realizar um ataque com uma arma como uma Ação Bônus."
            }
        ];
    }
}
