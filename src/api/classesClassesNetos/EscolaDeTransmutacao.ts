import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeTransmutacao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Transmutação",
            "Você é um estudante de magias que modificam energia e matéria. Para você, o mundo não é uma coisa fixa, mas sim eminentemente mutável e você se deleita em ser um agente da mudança. Você empunha a matéria-prima da criação e aprendeu tanto formas físicas quanto qualidades mentais. Sua magia lhe dá as ferramentas para se tornar o ferreiro na forja da realidade. Alguns transmutadores são vigaristas ou brincalhões, transformando pessoas em sapos e transformando cobre em prata por diversão e lucro ocasional. Outros perseguem seus estudos mágicos com uma seriedade mórbida, buscando o poder dos deuses de criar e destruir mundos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Transmutação Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de transmutação em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Alquimia Menor",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, quando você escolhe essa escola, você pode alterar temporariamente as propriedades físicas de um objeto não-mágico, alterando-o de uma substância para outra. Você realiza um procedimento alquímico especial em um objeto composto inteiramente de madeira, pedra (mas não uma pedra preciosa), ferro, cobre ou prata, transformando-o em um material diferente dentre esses. Para cada 10 minutos que você gastar realizando esse procedimento, você pode transformar 30 centímetros cúbicos de material. Após 1 hora, ou até você perder sua concentração (como se estivesse se concentrando em uma magia), o material reverte à sua substância original.
                `
            },
            {
                nome: "Pedra de Transmutador",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, você pode gastar 8 horas criando uma pedra de transmutador que armazena magia de transmutação. Você pode se beneficiar da pedra ou dá-la para outra criatura. Uma criatura ganha um benefício, à sua escolha, enquanto a pedra estiver em sua posse. Quando você cria a pedra, escolha um benefício dentre as opções a seguir:
                    - Visão no escuro com alcance de 18 metros, como descrito no capítulo 8.
                    - Um aumento de 3 metros no deslocamento enquanto a criatura não estiver sobrecarregada.
                    - Proficiência em testes de resistência de Constituição.
                    - Resistência a dano de ácido, frio, fogo, elétrico ou trovejante (escolhido por você quando escolhe esse benefício).
                    Cada vez que você conjurar uma magia de conjuração de 1° nível ou superior, você pode mudar o efeito da sua pedra, se ela estiver em sua posse.
                    Se você criar uma nova pedra de transmutador, a anterior para de funcionar.
                `
            },
            {
                nome: "Metamorfo",
                nivel: 10,
                descricao: `
                    No 10° nível, você adiciona a magia metamorfose ao seu grimório, se você ainda não a possuir. Você pode conjurar metamorfose sem gastar um espaço de magia. Quando o fizer, você só pode escolher a si mesmo como alvo e se transforma em uma besta com nível de desafio 1 ou menor.
                    Quando você conjurar metamorfose dessa forma, você não poderá fazê-lo novamente até terminar um descanso curto ou longo, apesar de ainda poder conjurá-la normalmente usando espaços de magia disponíveis.
                `
            },
            {
                nome: "Mestre Transmutador",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, você pode usar sua ação para consumir a reserva de magia de transmutação armazenada dentro da sua pedra de transmutador em uma única explosão. Quando o fizer, escolha um dos seguintes efeitos. Sua pedra de transmutador é destruída e não pode ser refeita até você terminar um descanso longo.
                    - **Transformação Maior**: Você pode transmutar um objeto não-mágico – não maior que 1,5 metro cúbico – em outro objeto não-mágico de tamanho e massa similares e de valor igual ou inferior. Você deve gastar 10 minutos manipulando o objeto para transformá-lo.
                    - **Panaceia**: Você remove todas as maldições, doenças e venenos afetando uma criatura que você tocar com sua pedra de transmutador. A criatura também recupera todos os seus pontos de vida.
                    - **Restaurar Vida**: Você pode conjurar reviver mortos em uma criatura que você tocar com sua pedra de transmutador, sem gastar espaço de magia ou precisar ter a magia no seu grimório.
                    - **Restaurar Juventude**: Você toca a pedra de transmutador em uma criatura voluntária e a idade aparente da criatura é reduzida em 3d10 anos, para o mínimo de 13 anos. Esse efeito não estende a vida útil da criatura.
                `
            }
        ];
    }
}