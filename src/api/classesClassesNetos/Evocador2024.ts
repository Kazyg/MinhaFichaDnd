import { SubClasses } from "../classesPrincipais/SubClasses";

export class Evocador2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Evocador", "Seus estudos se concentram em magia que cria poderosos efeitos elementais, como frio, chamas, trovões, relâmpagos e ácido.");
        this.niveis = [
            { nome: "Truque Potente", nivel: 3, descricao: "Ao conjurar um truque que causa dano em uma criatura e errar o ataque ou o alvo ser bem-sucedido na salvaguarda contra o truque, ele sofre metade do dano, se houver, mas não sofre efeitos adicionais do truque." },
            { nome: "Versado em Evocação", nivel: 3, descricao: "Escolha duas magias de Mago da escola de Evocação de 2º círculo ou inferior e adicione-as gratuitamente ao seu livro de magias. Além disso, ao adquirir acesso a um novo círculo de espaços de magia nesta classe, você pode adicionar gratuitamente uma magia de Mago de Evocação de um círculo para o qual tenha espaços." },
            { nome: "Esculpir Magias", nivel: 6, descricao: "Ao conjurar uma magia de Evocação que afeta criaturas à sua vista, você pode escolher um número delas igual a 1 mais o círculo da magia. As criaturas escolhidas são bem-sucedidas automaticamente em suas salvaguardas e não sofrem dano se normalmente sofreriam metade do dano em caso de sucesso." },
            { nome: "Evocação Potencializada", nivel: 10, descricao: "Ao conjurar uma magia de Mago da escola de Evocação, você pode adicionar seu modificador de Inteligência a uma jogada de dano dessa magia." },
            { nome: "Sobrecarga", nivel: 14, descricao: "Ao conjurar uma magia de Mago que cause dano com um espaço de magia de 1º a 5º círculo, você pode causar dano máximo com essa magia no turno em que a conjurar. Na primeira vez, não sofre efeito adverso. Se usar novamente antes de completar um Descanso Longo, sofre 2d12 de dano Necrótico para cada círculo do espaço usado, ignorando Resistência e Imunidade; cada novo uso antes do descanso aumenta o dano por círculo em 1d12." }
        ];
    }
}
