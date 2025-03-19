import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeEvocacao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Evocação",
            "Você foca seu estudo para criar poderosos efeitos elementais, como um frio cortante, uma chama intensa, um trovão estrondoso, um relâmpago devastador e ácido ardente. Alguns evocadores encontram emprego nas forças militares, servindo como artilharia para explodir fileiras inimigas de longe. Outros usam seu poder espetacular para proteger os fracos, enquanto alguns buscam o ganho próprio como bandidos, aventureiros ou aspirantes de tiranos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Evocação Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de evocação em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Esculpir Magias",
                nivel: 2,
                descricao: `
                    A partir do 2º nível, você pode criar bolsões de segurança relativa contra os efeitos de suas magias de evocação. Quando você conjurar uma magia de evocação que afeta outras criaturas que você possa ver, você pode escolher um número delas igual a 1 + o nível da magia. As criaturas escolhidas passam automaticamente em seus testemunhos de resistência contra a magia conjurada e elas não sofrem dano se normalmente sofreriam metade em um sucesso no teste de resistência.
                `
            },
            {
                nome: "Truque Potente",
                nivel: 6,
                descricao: `
                    A partir do 6º nível, seus truques de dano afetam até mesmo as criaturas que evitariam a força daquele efeito. Quando uma criatura passa em um teste de resistência de seus truques, ela sofre metade do dano (se existir), mas não sofre nenhum efeito adicional.
                `
            },
            {
                nome: "Evocação Potencializada",
                nivel: 10,
                descricao: `
                    A partir do 10º nível, você pode adicionar seu modificador de Inteligência no resultado das jogadas de dano de qualquer magia de evocação de mago que você conjurar. O bônus de dano se aplica a uma rolagem de dano da magia, não à múltiplas rolagens.
                `
            },
            {
                nome: "Sobrecarga",
                nivel: 14,
                descricao: `
                    A partir do 14º nível, você pode aumentar o poder de suas magias mais simples. Quando você conjurar uma magia de mago de 5º nível ou inferior (exceto truques) que cause dano, a magia causa o dano máximo.

                    A primeira vez que fizer isso, você não sofre qualquer efeito adverso. Porém, se usar de novo essa característica antes de terminar um descanso longo, você sofre 2d12 de dano necrótico para cada nível de magia, imediatamente após conjurá-la. Cada vez que você usar essa característica antes de terminar um descanso longo, o dano necrótico por nível da magia aumenta em 1d12. Esse dano ignora qualquer resistência ou imunidade.
                `
            }
        ];
    }
}