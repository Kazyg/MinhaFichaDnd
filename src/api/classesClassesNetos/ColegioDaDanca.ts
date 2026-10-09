import { SubClasses } from "../classesPrincipais/SubClasses";

export class ColegioDaDanca extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Colégio da Dança", "Bardos do Colégio da Dança entendem que as Palavras de Criação transcendem fala e canção, manifestando-se nos movimentos dos corpos celestes e das criaturas.");
        this.niveis = [
            {
                nome: "Ginga Fascinante",
                nivel: 3,
                descricao: "Enquanto você não estiver vestindo armadura ou empunhando Escudo, você ganha Dança Virtuosa, tendo Vantagem em testes de Carisma (Atuação) envolvendo dança; Dano de Bardo, podendo usar Destreza em ataques desarmados e causar dano Contundente igual ao dado da Inspiração de Bardo + modificador de Destreza; Defesa sem Armadura, com CA base igual a 10 + Destreza + Carisma; e Golpes Ágeis, permitindo realizar um Ataque Desarmado quando gastar Inspiração de Bardo como parte de ação, Ação Bônus ou Reação."
            },
            {
                nome: "Gingado Coordenado",
                nivel: 6,
                descricao: "Ao jogar Iniciativa, você pode gastar um uso da sua Inspiração de Bardo se não estiver Incapacitado. Jogue o dado da Inspiração; você e cada aliado a até 9 metros que puder ver ou ouvir você recebem bônus na Iniciativa igual ao número jogado."
            },
            {
                nome: "Movimento Inspirador",
                nivel: 6,
                descricao: "Quando um inimigo à sua vista encerra o turno a até 1,5 metro de você, você pode executar uma Reação e gastar um uso da Inspiração de Bardo para se mover até metade do seu Deslocamento. Em seguida, um aliado à sua escolha a até 9 metros também pode se mover até metade do Deslocamento dele usando a própria Reação. Esses movimentos não provocam Ataques de Oportunidade."
            },
            {
                nome: "Evasão Liderada",
                nivel: 14,
                descricao: "Se você for alvo de um efeito que permita salvaguarda de Destreza para receber metade do dano, não recebe dano se for bem-sucedido e apenas metade se falhar. Se criaturas a até 1,5 metro de você também realizarem a salvaguarda, você pode compartilhar esse benefício com elas. Você não pode usar esta característica se estiver Incapacitado."
            }
        ];
    }
}
