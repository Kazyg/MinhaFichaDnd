import { SubClasses } from "../classesPrincipais/SubClasses";

export class Ilusionista2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Ilusionista", "Você se especializa em magia que deslumbra os sentidos e engana a mente, fazendo o impossível parecer real.");
        this.niveis = [
            { nome: "Ilusões Aprimoradas", nivel: 3, descricao: "Você pode conjurar magias de Ilusão sem fornecer componentes Verbais e, se uma magia de Ilusão que você conjurar tiver alcance de 3 metros ou mais, o alcance aumenta em 18 metros. Você também conhece Ilusão Menor; se já o conhece, aprende outro truque de Mago. Esse truque não conta para seu número de truques conhecidos. Você pode criar som e imagem com uma única conjuração de Ilusão Menor e pode conjurá-la como Ação Bônus." },
            { nome: "Versado em Ilusão", nivel: 3, descricao: "Escolha duas magias de Mago da escola de Ilusão de 2º círculo ou inferior e adicione-as gratuitamente ao seu livro de magias. Além disso, ao adquirir acesso a um novo círculo de espaços de magia nesta classe, você pode adicionar gratuitamente uma magia de Mago de Ilusão de um círculo para o qual tenha espaços." },
            { nome: "Criaturas Espectrais", nivel: 6, descricao: "Você sempre tem Convocar Feérico e Invocar Fera preparadas. Ao conjurar qualquer uma delas, pode mudar sua escola para Ilusão, fazendo a criatura parecer espectral. Você pode conjurar a versão de Ilusão de cada magia sem gastar espaço de magia, mas isso reduz pela metade os Pontos de Vida da criatura. Após conjurar qualquer uma sem espaço, deve completar um Descanso Longo antes de conjurar novamente essa magia dessa forma." },
            { nome: "Autoimagem Ilusória", nivel: 10, descricao: "Ao ser atingido pela jogada de ataque de uma criatura, você pode usar uma Reação para criar uma duplicata ilusória de si entre você e o atacante. O ataque erra automaticamente e a ilusão se dissipa. Você recupera o uso ao completar um Descanso Curto ou Longo, ou gastando um espaço de magia de 2º círculo ou superior." },
            { nome: "Realidade Ilusória", nivel: 14, descricao: "Ao conjurar uma magia de Ilusão com um espaço de magia, você pode escolher um objeto inanimado e não mágico que faça parte da ilusão e torná-lo real. Você pode fazer isso no seu turno como Ação Bônus enquanto a magia estiver em andamento. O objeto permanece real por 1 minuto, mas não pode causar dano nem conferir condições." }
        ];
    }
}
