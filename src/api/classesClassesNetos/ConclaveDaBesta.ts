import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ConclaveDaBesta extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Conclave da Besta",
            "Muitos patrulheiros sentem-se mais à vontade no ambiente selvagem que na civilização, ao ponto de animais consideram-nos como semelhantes. Patrulheiros do Conclave da Besta desenvolvem um vínculo poderoso com uma besta, posteriormente fortalecendo esse vínculo com o uso de magia."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Companheiro Animal",
                nivel: 3,
                descricao: `
                    No 3° nível, você aprende a usar sua magia para criar um poderoso vínculo com uma criatura do mundo natural. Com 8 horas de trabalho e o gasto de 50 po em ervas raras e comida boa, você invoca um animal do ambiente selvagem para servir como um companheiro leal. Você geralmente escolhe seu companheiro dentre os seguintes animais: um arminho gigante, um javali, um gorila, um lobo, uma mula, uma pantera, um texugo gigante ou urso negro. Porém, seu Mestre pode escolher um desses animais para você baseado nos terrenos ao redor e em que tipos de criaturas logicamente poderiam estar presentes na área.
                    Ao final das 8 horas, seu companheiro animal aparece e adquire todos os benefícios da sua habilidade Vínculo com o Companheiro. Você só pode ter um companheiro animal por vez.
                    Se o seu companheiro animal for morto, o vínculo mágico que vocês compartilham permite que você o traga de volta à vida. Com 8 horas de trabalho e o gasto de 25 po em ervas raras e comida boa, você pode invocar o espírito do seu companheiro e usar sua mágica para criar um novo corpo para ele. Você pode trazer um companheiro animal de volta à vida dessa forma mesmo que você não possua qualquer parte do corpo dele.
                    Se você usar essa habilidade para trazer um companheiro animal antigo de volta à vida enquanto você já tiver outro companheiro animal, seu companheiro animal atual abandona você e é substituído pelo companheiro animal ressuscitado.
                `
            },
            {
                nome: "Vínculo com o Companheiro",
                nivel: 3,
                descricao: `
                    Seu companheiro animal ganha uma variedade de benefícios enquanto estiver vinculado a você:
                    - O companheiro animal perde a ação Ataques Múltiplos, caso ele possua.
                    - O companheiro obedece seus comandos da melhor forma possível. Ele rola iniciativa como qualquer outra criatura, mas você determina suas ações, decisões, atitudes e afins. Se você estiver incapacitado ou ausente, seu companheiro age por conta própria.
                    - Quando estiver usando sua característica Explorador Natural, você e seu companheiro animal podem se mover furtivamente com ritmo normal.
                    - Seu companheiro animal tem habilidades e estatísticas de jogo em parte determinadas pelo seu nível. Seu companheiro usa seu bônus de proficiência ao invés do próprio. Além das áreas onde ele normalmente aplicaria o bônus de proficiência dele, um companheiro animal também adiciona o bônus de proficiência a CA e jogadas de dano dele.
                    - Seu companheiro animal ganha proficiência em duas perícias de sua escolha. Ele também se torna proficiente em todos os testes de resistência.
                    - Para cada nível que você adquirir após o 3°, seu companheiro animal ganha um dado de vida adicional e aumenta os pontos de vida dele apropriadamente.
                    - Sempre que você ganhar a característica de classe Incremento no Valor de Habilidade, as habilidades do seu companheiro também aumentam. Seu companheiro pode aumentar um valor de habilidade de sua escolha em 2, ou ele pode aumentar dois valores de habilidade de sua escolha em 1. Como normalmente, seu companheiro não pode aumentar um valor de habilidade acima de 20 usando essa característica a não ser que sua descrição diga o contrário.
                    - Seu companheiro partilha de sua tendência e possui um traço de personalidade e um defeito das tabelas abaixo. Seu companheiro partilha do seu ideal e o vínculo dele sempre é “O patrulheiro que viaja comigo é um companheiro adorado por quem eu daria minha vida de bom grado.”
                    - Seu companheiro animal ganha os benefícios da sua característica Inimigo Favorito e Inimigo Favorito Maior, quando você ganha essa característica no 6° nível. Ele usa o inimigo favorito escolhido por você para essas características.
                `
            },
            {
                nome: "Ataque Coordenado",
                nivel: 5,
                descricao: `
                    A partir do 5° nível, você e seu companheiro animal formam um time de luta mais poderoso. Quando você usar a ação de Ataque no seu turno, se o seu companheiro puder ver você, ele pode usar a reação dele para realizar um ataque corpo-a-corpo.
                `
            },
            {
                nome: "Defesa da Besta",
                nivel: 7,
                descricao: `
                    No 7° nível, enquanto seu companheiro puder ver você, ele tem vantagem em todos os testes de resistência.
                `
            },
            {
                nome: "Tempestade de Garras e Presas",
                nivel: 11,
                descricao: `
                    A partir do 11° nível, seu companheiro pode usar a ação dele para realizar um ataque corpo-a-corpo contra cada criatura, a escolha dele, a até 1,5 metro dele, com uma jogada de ataque separada para cada alvo.
                `
            },
            {
                nome: "Defesa da Besta Superior",
                nivel: 15,
                descricao: `
                    A partir do 15° nível, sempre que um atacante que seu companheiro puder ver atingi-lo com um ataque, ele pode usar a reação dele para reduzir o dano desse ataque à metade.
                `
            }
        ];
    }
}