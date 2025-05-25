import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoDoGuardiaoAncestral extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Caminho do Guardião Ancestral",
            "Alguns bárbaros saem de culturas que reverenciam seus antepassados. Essas tribos ensinam que os guerreiros do passado permanecem no mundo como espíritos poderosos, que podem guiar e proteger a vida. Quando um bárbaro que segue este caminho se enfurece, ele entra em contato com o mundo espiritual e convoca esses espíritos guardiões para ajuda."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Protetor Ancestral",
                nivel: 3,
                descricao: `
                    Começando quando você escolhe esse caminho no 3° nível, os guerreiros espectrais aparecem quando você entra em fúria. Enquanto você está em fúria, a primeira criatura que você acertou com um ataque no seu turno torna-se o alvo dos guerreiros, o que dificulta seus ataques. Até o início do seu próximo turno, esse alvo tem desvantagem em qualquer jogada de ataque que não seja contra você, e quando o alvo atingir uma criatura diferente de você com um ataque, essa criatura tem resistência ao dano causado pelo ataque. O efeito sobre o alvo acaba mais cedo se sua fúria termina.
                `
            },
            {
                nome: "Escudo Espiritual (2d6)",
                nivel: 6,
                descricao: `
                    Começando no 6° nível, os guardiões espirituais que te protegem podem prover uma defesa sobrenatural para aqueles que você defende. Se você estiver em fúria e outra criatura que possa ver a até 9 metros receber dano, você pode usar sua reação para reduzir esse dano em 2d6.
                `
            },
            {
                nome: "Consultar os Espíritos",
                nivel: 10,
                descricao: `
                    No 10° nível você ganha a habilidade de se consultar com seus espíritos ancestrais. Quando você o faz, pode conjurar as magias augúrio ou clarividência, sem usar espaços de magia ou componentes materiais. Em vez de criar um sensor esférico, esse uso da clarividência invoca invisivelmente um de seus espíritos ancestrais para o local escolhido. Sabedoria é a sua habilidade para conjurar essa magia.
                    Depois de conjurar qualquer magia desta forma, você não pode usar essa característica novamente até terminar um descanso curto ou longo.
                `
            },
            {
                nome: "Escudo Espiritual (3d6)",
                nivel: 10,
                descricao: `
                    No 10° nível, seu Escudo Espiritual melhora e agora reduz o dano em 3d6.
                `
            },
            {
                nome: "Ancestral Vingativo",
                nivel: 14,
                descricao: `
                    No 14° nível, seus espíritos ancestrais aumentam de poder o suficiente e conseguem retaliar. Quando você usa seu Escudo Espiritual para reduzir o dano de um ataque, o atacante recebe uma quantidade de dano de energia igual ao dano que seu Escudo Espiritual reduziu.
                `
            },
            {
                nome: "Escudo Espiritual (4d6)",
                nivel: 14,
                descricao: `
                    No 14° nível, seu Escudo Espiritual melhora novamente e agora reduz o dano em 4d6.
                `
            }
        ];
    }
}