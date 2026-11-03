import { SubClasses } from "../classesPrincipais/SubClasses";

export class FeiticariaDraconica2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Feitiçaria Dracônica", "Sua magia inata provém da dádiva de um dragão, de um ancestral dracônico ou de um local impregnado por poder dracônico.");
        this.niveis = [
            {
                nome: "Magias Dracônicas",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Alterar-se, Comando, Orbe Cromático e Sopro de Dragão; no nível 5, Medo e Voo; no nível 7, Enfeitiçar Monstro e Olho Arcano; no nível 9, Invocar Dragão e Lendas e Histórias."
            },
            {
                nome: "Resiliência Dracônica",
                nivel: 3,
                descricao: "Seus Pontos de Vida máximos aumentam em 3 e aumentam em 1 sempre que você ganha outro nível de Feiticeiro. Enquanto não estiver usando armadura, sua Classe de Armadura base é 10 + seu modificador de Destreza + seu modificador de Carisma."
            },
            {
                nome: "Afinidade Elemental",
                nivel: 6,
                descricao: "Escolha um tipo de dano associado à sua magia dracônica: Ácido, Elétrico, Gélido, Ígneo ou Venenoso. Você tem Resistência a esse tipo de dano e, ao conjurar uma magia que cause esse dano, pode adicionar seu modificador de Carisma a uma jogada de dano da magia."
            },
            {
                nome: "Asas de Dragão",
                nivel: 14,
                descricao: "Como Ação Bônus, você manifesta asas dracônicas por 1 hora ou até encerrar o efeito. Pela duração, você tem Deslocamento de Voo de 18 metros. Você recupera o uso ao completar Descanso Longo ou gastando 3 Pontos de Feitiçaria."
            },
            {
                nome: "Companheiro Dracônico",
                nivel: 18,
                descricao: "Você pode conjurar Invocar Dragão sem componente Material e pode conjurá-la uma vez sem gastar espaço de magia, recuperando esse uso ao completar Descanso Longo. Ao começar a conjurar a magia, pode modificá-la para não exigir Concentração e ter duração de 1 minuto nesta conjuração."
            }
        ];
    }
}
