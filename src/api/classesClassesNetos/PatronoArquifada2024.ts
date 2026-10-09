import { SubClasses } from "../classesPrincipais/SubClasses";

export class PatronoArquifada2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Patrono Arquifada", "Seu pacto é fundamentado no poder de Faéria, firmado com uma Arquifada ou espectro feérico enigmático e excêntrico.");
        this.niveis = [
            {
                nome: "Magias de Pacto da Arquifada",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Acalmar Emoções, Fogo das Fadas, Força Espectral, Passo Nebuloso e Sono; no nível 5, Crescimento de Plantas e Piscar; no nível 7, Dominar Fera e Invisibilidade Maior; no nível 9, Dominar Pessoa e Similaridade."
            },
            {
                nome: "Passos Feéricos",
                nivel: 3,
                descricao: "Você pode conjurar Passo Nebuloso sem gastar espaço de magia um número de vezes igual ao seu modificador de Carisma, mínimo uma vez, recuperando usos ao completar Descanso Longo. Ao conjurar essa magia, pode escolher Passo Provocante, impondo salvaguarda de Sabedoria a criaturas próximas do espaço que deixou para evitar Desvantagem contra outros alvos, ou Passo Revigorante, concedendo 1d10 Pontos de Vida Temporários a você ou uma criatura próxima."
            },
            {
                nome: "Fuga em Névoa",
                nivel: 6,
                descricao: "Você pode conjurar Passo Nebuloso como Reação ao sofrer dano. Além disso, adiciona Passo Desvanecedor, ficando Invisível até o início do próximo turno ou até atacar, causar dano ou conjurar magia, e Passo Terrível, causando 2d10 de dano Psíquico a criaturas próximas que falhem em salvaguarda de Sabedoria."
            },
            {
                nome: "Defesas Sedutoras",
                nivel: 10,
                descricao: "Você é imune à condição Enfeitiçado. Além disso, após uma criatura à sua vista acertá-lo com um ataque, você pode usar Reação para reduzir o dano pela metade e forçar o atacante a realizar salvaguarda de Sabedoria; se falhar, ele sofre dano Psíquico igual ao dano que você sofreu. Você recupera o uso ao completar Descanso Longo ou gastando espaço de Magia de Pacto."
            },
            {
                nome: "Magia Sedutora",
                nivel: 14,
                descricao: "Imediatamente após conjurar uma magia de Encantamento ou Ilusão usando uma ação e um espaço de magia, você pode conjurar Passo Nebuloso como parte da mesma ação e sem gastar espaço de magia."
            }
        ];
    }
}
