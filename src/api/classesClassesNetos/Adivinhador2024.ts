import { SubClasses } from "../classesPrincipais/SubClasses";

export class Adivinhador2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Adivinhador", "Como Adivinhador, você domina magias de discernimento, visão remota, conhecimento sobrenatural e previsão para desvendar os véus do espaço, tempo e consciência.");
        this.niveis = [
            { nome: "Prodígio", nivel: 3, descricao: "Ao completar um Descanso Longo, jogue dois d20s e registre os resultados. Você pode substituir qualquer Teste de D20 realizado por você ou por uma criatura à sua vista por uma dessas jogadas de previsão, escolhendo antes da jogada. Você pode substituir uma jogada desse modo apenas uma vez por turno, e cada jogada de previsão pode ser usada apenas uma vez." },
            { nome: "Versado em Adivinhação", nivel: 3, descricao: "Escolha duas magias de Mago da escola de Adivinhação de 2º círculo ou inferior e adicione-as gratuitamente ao seu livro de magias. Além disso, ao adquirir acesso a um novo círculo de espaços de magia nesta classe, você pode adicionar gratuitamente uma magia de Mago de Adivinhação de um círculo para o qual tenha espaços." },
            { nome: "Perito em Adivinhação", nivel: 6, descricao: "Ao conjurar uma magia de Adivinhação usando um espaço de magia de 2º círculo ou superior, você recupera um espaço de magia gasto. O espaço recuperado deve ser de um círculo inferior ao espaço usado e não pode ser superior ao 5º círculo." },
            { nome: "O Terceiro Olho", nivel: 10, descricao: "Como uma Ação Bônus, escolha um benefício que dura até você iniciar um Descanso Curto ou Longo: ler qualquer idioma, conjurar Ver o Invisível sem gastar espaço de magia, ou adquirir Visão no Escuro com alcance de 36 metros. Você recupera o uso ao completar um Descanso Curto ou Longo." },
            { nome: "Prodígio Maior", nivel: 14, descricao: "Você joga três d20s para sua característica Prodígio em vez de dois." }
        ];
    }
}
