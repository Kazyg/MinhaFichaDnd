import { SubClasses } from "../classesPrincipais/SubClasses";

export class FeiticariaSelvagem2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Feitiçaria Selvagem", "Sua magia inata provém das forças do caos que sustentam a criação, aguardando uma oportunidade para se manifestar de modo imprevisível.");
        this.niveis = [
            {
                nome: "Marés do Caos",
                nivel: 3,
                descricao: "Você pode manipular o caos para obter Vantagem em um Teste de D20 antes de jogá-lo. Após usar esta característica, você deve conjurar uma magia de Feiticeiro com espaço de magia ou completar Descanso Longo para recuperá-la. Além disso, ao conjurar uma magia de Feiticeiro com espaço de magia antes de completar Descanso Longo, ocorre automaticamente um Surto de Magia Selvagem e Marés do Caos é recarregada."
            },
            {
                nome: "Surto de Magia Selvagem",
                nivel: 3,
                descricao: "Uma vez por turno, imediatamente após conjurar uma magia de Feiticeiro com espaço de magia, você pode jogar 1d20. Se o resultado for 20, jogue na tabela Surto de Magia Selvagem para criar um efeito mágico. Se o efeito for uma magia, ele é selvagem demais para ser afetado por Metamagia."
            },
            {
                nome: "Distorcer a Sorte",
                nivel: 6,
                descricao: "Imediatamente após outra criatura à sua vista jogar o d20 para um Teste de D20, você pode usar sua Reação e gastar 1 Ponto de Feitiçaria para jogar 1d4 e aplicar o resultado como bônus ou penalidade, à sua escolha, no teste de d20."
            },
            {
                nome: "Caos Controlado",
                nivel: 14,
                descricao: "Ao jogar na tabela Surto de Magia Selvagem, você pode jogar duas vezes e usar qualquer um dos resultados."
            },
            {
                nome: "Surto Controlado",
                nivel: 18,
                descricao: "Imediatamente após conjurar uma magia de Feiticeiro com espaço de magia, você pode criar um efeito à sua escolha da tabela Surto de Magia Selvagem em vez de jogar na tabela. Você pode escolher qualquer efeito exceto a linha final; se o efeito envolver uma jogada, você deve realizá-la. Você recupera o uso ao completar Descanso Longo."
            }
        ];
    }
}
