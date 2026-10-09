import { SubClasses } from "../classesPrincipais/SubClasses";

export class Abjurador2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Abjurador", "Seu estudo da magia concentra-se em bloqueio, banimento e proteção, eliminando efeitos nocivos e defendendo aliados contra ameaças mágicas.");
        this.niveis = [
            { nome: "Proteção Arcana", nivel: 3, descricao: "Ao conjurar uma magia de Abjuração com um espaço de magia, você pode criar uma proteção mágica que dura até completar um Descanso Longo. Ela tem Pontos de Vida máximos iguais ao dobro do seu nível de Mago mais seu modificador de Inteligência e absorve dano no seu lugar. Ao conjurar Abjuração com espaço de magia, a proteção recupera Pontos de Vida iguais ao dobro do círculo do espaço. Como Ação Bônus, você também pode gastar um espaço de magia para restaurar a proteção na mesma proporção. Após criar a proteção, você não pode criá-la novamente até completar um Descanso Longo." },
            { nome: "Versado em Abjuração", nivel: 3, descricao: "Escolha duas magias de Mago da escola de Abjuração de 2º círculo ou inferior e adicione-as gratuitamente ao seu livro de magias. Além disso, ao adquirir acesso a um novo círculo de espaços de magia nesta classe, você pode adicionar gratuitamente uma magia de Mago de Abjuração de um círculo para o qual tenha espaços." },
            { nome: "Proteção Projetada", nivel: 6, descricao: "Quando uma criatura à sua vista a até 9 metros sofrer dano, você pode executar uma Reação para que sua Proteção Arcana absorva esse dano. Se a proteção for reduzida a 0 Pontos de Vida, a criatura protegida sofre qualquer dano restante." },
            { nome: "Rompe-Magia", nivel: 10, descricao: "Você sempre tem Contramagia e Dissipar Magia preparadas. Você pode conjurar Dissipar Magia como uma Ação Bônus e adicionar seu Bônus de Proficiência ao teste de atributo. Ao conjurar uma dessas magias com espaço de magia, o espaço não é gasto se a magia falhar em interromper outra magia." },
            { nome: "Resistência à Magia", nivel: 14, descricao: "Você tem Vantagem em salvaguardas contra magias e Resistência ao dano proveniente de magias." }
        ];
    }
}
