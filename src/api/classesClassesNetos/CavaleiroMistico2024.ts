import { SubClasses } from "../classesPrincipais/SubClasses";

export class CavaleiroMistico2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];
    magiasEspacos: { nivel: number; truques: number; magias: number; espacosMagia: { nivel: number; espacos: number }[] }[];

    constructor() {
        super("Cavaleiro Místico", "Cavaleiros Místicos unem habilidades marciais de Guerreiros a um estudo aprofundado da magia arcana.");
        this.niveis = [
            { nome: "Conjuração", nivel: 3, descricao: "Você conhece dois truques de Mago e aprende outro no nível 10 de Guerreiro. Você prepara magias de Mago conforme a tabela de Conjuração de Cavaleiro Místico, recupera espaços gastos ao completar Descanso Longo, usa Inteligência como atributo de conjuração e pode usar um Foco Arcano como Foco de Conjuração." },
            { nome: "Vínculo com Arma", nivel: 3, descricao: "Você aprende um ritual de 1 hora para criar vínculo com uma arma ao seu alcance. A arma vinculada não pode ser desarmada de você enquanto não estiver Incapacitado e, se estiver no mesmo plano, você pode invocá-la como Ação Bônus. Você pode ter até dois vínculos com armas." },
            { nome: "Magia de Guerra", nivel: 7, descricao: "Ao executar a ação Atacar no seu turno, você pode substituir um dos ataques pela conjuração de um truque de Mago que tenha tempo de conjuração de uma ação." },
            { nome: "Golpe Místico", nivel: 10, descricao: "Ao atingir uma criatura com um ataque usando uma arma, ela sofre Desvantagem na próxima salvaguarda que realizar contra uma magia que você conjurar antes do final do seu próximo turno." },
            { nome: "Investida Mística", nivel: 15, descricao: "Ao usar Surto de Ação, você pode se teleportar até 9 metros para um espaço desocupado à sua vista, antes ou depois da ação adicional." },
            { nome: "Magia de Guerra Aprimorada", nivel: 18, descricao: "Ao executar a ação Atacar no seu turno, você pode substituir dois ataques pela conjuração de uma das suas magias de Mago de 1º ou 2º círculo que tenha tempo de conjuração de uma ação." }
        ];
        this.magiasEspacos = [
            { nivel: 3, truques: 2, magias: 3, espacosMagia: [{ nivel: 1, espacos: 2 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 4, truques: 2, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 5, truques: 2, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 6, truques: 2, magias: 4, espacosMagia: [{ nivel: 1, espacos: 3 }, { nivel: 2, espacos: 0 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 7, truques: 2, magias: 5, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 8, truques: 2, magias: 6, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 9, truques: 2, magias: 6, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 2 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 10, truques: 3, magias: 7, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 11, truques: 3, magias: 8, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 12, truques: 3, magias: 8, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 0 }, { nivel: 4, espacos: 0 }] },
            { nivel: 13, truques: 3, magias: 9, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 14, truques: 3, magias: 10, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 15, truques: 3, magias: 10, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 2 }, { nivel: 4, espacos: 0 }] },
            { nivel: 16, truques: 3, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 17, truques: 3, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 18, truques: 3, magias: 11, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 0 }] },
            { nivel: 19, truques: 3, magias: 12, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 1 }] },
            { nivel: 20, truques: 3, magias: 13, espacosMagia: [{ nivel: 1, espacos: 4 }, { nivel: 2, espacos: 3 }, { nivel: 3, espacos: 3 }, { nivel: 4, espacos: 1 }] }
        ];
    }
}
