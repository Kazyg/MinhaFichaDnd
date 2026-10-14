import { SubClasses } from "../classesPrincipais/SubClasses";

export class TrapaceiroArcano2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];
    magiasEspacos: { nivel: number; truques: number; magias: number; espacosMagia: { nivel: number; espacos: number }[] }[];

    constructor() {
        super("Trapaceiro Arcano", "Alguns Ladinos aprimoram suas habilidades de furtividade e agilidade com magia, aprendendo truques que os auxiliam em seu ofício.");
        this.niveis = [
            { nome: "Conjuração", nivel: 3, descricao: "Você conhece três truques: Mãos Mágicas e dois outros truques à sua escolha da lista de magias de Mago. Ao alcançar um nível de Ladino, pode substituir um truque, exceto Mãos Mágicas, por outro truque de Mago. Ao atingir o nível 10 de Ladino, aprende mais um truque de Mago. Você prepara magias de Mago conforme a tabela de Conjuração de Trapaceiro Arcano, recupera espaços gastos ao completar Descanso Longo, usa Inteligência como atributo de conjuração e pode usar um Foco Arcano como Foco de Conjuração." },
            { nome: "Mãos Mágicas Ligeiras", nivel: 3, descricao: "Ao conjurar Mãos Mágicas, você pode conjurá-la como uma Ação Bônus e tornar a mão espectral Invisível. Você pode controlar a mão como uma Ação Bônus e, através dela, realizar testes de Destreza (Prestidigitação)." },
            { nome: "Emboscada Mágica", nivel: 9, descricao: "Se você tem a condição Invisível quando conjura uma magia em uma criatura, ela tem Desvantagem em qualquer salvaguarda que fizer contra a magia no mesmo turno." },
            { nome: "Trapaceiro Versátil", nivel: 13, descricao: "Ao usar a opção Golpe Astuto em seu ataque contra uma criatura, você também pode usar essa opção em outra criatura a até 1,5 metro da mão espectral de Mãos Mágicas." },
            { nome: "Ladrão de Magias", nivel: 17, descricao: "Imediatamente após uma criatura conjurar uma magia que tenha você como alvo ou o inclua em sua área de efeito, você pode executar uma Reação para forçá-la a realizar uma salvaguarda de Inteligência contra sua CD de magia. Em falha, você nega o efeito contra si e rouba o conhecimento da magia se ela for de 1º círculo ou de um círculo que você possa conjurar. Por 8 horas, você a terá preparada, e a criatura não poderá conjurá-la. Você recupera o uso ao completar Descanso Longo." }
        ];
        this.magiasEspacos = [
            { nivel: 3, truques: 3, magias: 3, espacosMagia: [{ nivel: 1, espacos: 2 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 4, truques: 3, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 5, truques: 3, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 6, truques: 3, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 7, truques: 3, magias: 5, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 8, truques: 3, magias: 6, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 9, truques: 3, magias: 6, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 10, truques: 4, magias: 7, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 11, truques: 4, magias: 8, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 12, truques: 4, magias: 8, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 13, truques: 4, magias: 9, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 14, truques: 4, magias: 10, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 15, truques: 4, magias: 10, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 16, truques: 4, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 17, truques: 4, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 18, truques: 4, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 19, truques: 4, magias: 12, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 1 }] },
            { nivel: 20, truques: 4, magias: 13, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 1 }] }
        ];
    }
}
