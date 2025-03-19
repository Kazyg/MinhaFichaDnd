import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDoConhecimento extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio do Conhecimento",
            "Os deuses do conhecimento – como Oghma, Boccob, Gilean, Aureon e Thoth – valorizam o estudo e compreensão acima de tudo. Alguns ensinam que o conhecimento deve ser coletado e partilhado em bibliotecas e universidades ou promovem o conhecimento prático do artesanato e da invenção. Algumas divindades escondem conhecimentos e os mantêm em segredo para si mesmos. E outros prometem a seus seguidores que eles ganharão poderes tremendos se desvendarem os segredos do multiverso. Os seguidores desses deuses estudam conhecimento exotérico, coletam tomos antigos, escavam locais secretos da terra e aprendem tudo que podem. Alguns deuses do conhecimento que promovem a prática de ofícios e criação incluem deuses da forja como Gond, Reorx, Onatar, Moradin, Hefesto e Goibhniu."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio do Conhecimento",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | comando, identificação
                    3°               | augúrio, sugestão
                    5°               | dificultar detecção, falar com os mortos
                    7°               | olho arcano, confusão
                    9°               | conhecimento lendário, vidência
                `
            },
            {
                nome: "Bênçãos do Conhecimento",
                nivel: 1,
                descricao: `
                    No 1° nível, você aprende dois idiomas, à sua escolha. Você também se torna proficiente em duas perícias, à sua escolha, dentre as seguintes: Arcanismo, História, Natureza ou Religião. Seu bônus de proficiência é dobrado em qualquer teste de habilidade que você fizer usando qualquer dessas perícias.
                `
            },
            {
                nome: "Canalizar Divindade: Conhecimento das Eras",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode usar seu Canalizar Divindade para beber da fonte divina do conhecimento. Com uma ação, você escolhe uma perícia ou ferramenta. Por 10 minutos, você terá proficiência com a perícia ou ferramenta escolhida.
                `
            },
            {
                nome: "Canalizar Divindade: Ler Pensamentos",
                nivel: 6,
                descricao: `
                    No 6° nível, você pode usar seu Canalizar Divindade para ler a mente de uma criatura. Você pode, então, usar seu acesso à mente da criatura para comandá-la. Com uma ação, escolha uma criatura que você possa ver que esteja a até 18 metros de você. Essa criatura deve realizar um teste de resistência de Sabedoria, se for bem sucedida nesse teste, você não poderá usar essa característica contra ela novamente até terminar um descanso longo. Se a criatura falhar no teste, você pode ler seus pensamentos superficiais (aqueles mais atuais, que refletem suas emoções e no que você está pensando constantemente) quando estiver a até 18 metros de você. Esse efeito dura por 1 minuto. Durante esse tempo, você pode usar sua ação para terminar esse efeito e conjurar a magia sugestão na criatura sem gastar um espaço de magia. O alvo falha automaticamente no teste de resistência contra essa magia.
                `
            },
            {
                nome: "Conjuração Poderosa",
                nivel: 8,
                descricao: `
                    A partir do 8° nível, você adiciona seu modificador de Sabedoria no dano causado por qualquer truque de clérigo.
                `
            },
            {
                nome: "Visões do Passado",
                nivel: 17,
                descricao: `
                    A partir do 17° nível, você pode convocar visões do passado relacionadas a um objeto que você esteja segurando ou sobre o ambiente ao seu redor. Você gasta pelo menos 1 minuto meditando e rezando, então, recebe oníricos vislumbres turvos dos eventos recentes. Você pode meditar dessa maneira por um número de minutos igual ao seu valor de Sabedoria e deve manter a concentração durante esse tempo, como se você estivesse conjurando uma magia. Quando você usa essa característica, você não pode usá-la novamente até terminar um descanso curto ou longo.
                    Leitura de Objeto. Ao segurar um objeto enquanto medita, você pode ter visões do dono anterior do objeto. Depois de meditar por 1 minuto, você descobre como o antigo dono adquiriu e perdeu o objeto, assim como o evento recente mais significativo envolvendo o objeto e seu dono. Se o objeto foi portado por outra criatura num passado recente (dentro de um número de dias igual ao seu valor de Sabedoria), você pode gastar 1 minuto adicional, por cada dono, para descobrir as mesmas informações sobre essa criatura.
                    Leitura Local. À medida que você medita, você tem visões dos eventos recentes nas suas vizinhanças próximas (uma sala, rua, túnel, clareira, ou similar, de até 15 metros cúbicos), voltando um número de dias igual ao seu valor de Sabedoria. Para cada minuto que você meditar, você descobre sobre um evento significativo, a partir dos mais recentes. Eventos significativos, normalmente envolvem emoções fortes, como batalhas e traições, casamentos e assassinatos, nascimentos e funerais. No entanto, também podem incluir eventos mais mundanos, que podem ser, no entanto, relevantes na sua situação atual.
                `
            }
        ];
    }
}