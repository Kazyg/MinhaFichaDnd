import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class LinhagemDraconica extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Linhagem Dracônica",
            "Sua magia inata vem de magia dracônica que foi misturada ao seu sangue ou ao sangue dos seus ancestrais. Geralmente, os feiticeiros com essa origem traçam sua descendência de poderosos feiticeiros da antiguidade que fizeram uma barganha com um dragão ou que tenham um dragão como parente. Algumas dessas linhagens estão bem definidas no mundo, mas a maioria é obscura. Qualquer feiticeiro pode ser o primeiro de uma nova linhagem, como resultado de um pacto ou de outra circunstância excepcional."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Ancestral Dracônico",
                nivel: 1,
                descricao: `
                    No 1° nível, você escolhe um tipo de dragão como seu ancestral. O tipo de dano associado a cada dragão será usado por características que você ganhará posteriormente.

                    **Dragão** | **Tipo de Dano**
                    --- | ---
                    Azul | Elétrico
                    Branco | Frio
                    Bronze | Elétrico
                    Cobre | Ácido
                    Latão | Fogo
                    Negro | Ácido
                    Ouro | Fogo
                    Prata | Frio
                    Verde | Veneno
                    Vermelho | Fogo

                    Você pode falar, ler e escrever em Dracônico. Além disso, sempre que você fizer um teste de Carisma quando estiver interagindo com dragões, seu bônus de proficiência será dobrado se ele se aplicar a esse teste.
                `
            },
            {
                nome: "Resiliência Dracônica",
                nivel: 1,
                descricao: `
                    A medida que a magia flui pelo seu corpo, ela faz com que os traços físicos do seu ancestral dracônico surjam. No 1° nível, seu máximo de pontos de vida aumenta em 1 e aumenta em mais 1 sempre que você ganhar um nível na classe.

                    Além disso, partes da sua pele são cobertas com minúsculas escamas lustrosas de dragão. Quando você não estiver utilizando armadura, sua CA será igual a 13 + seu modificador de Destreza.
                `
            },
            {
                nome: "Afinidade Elemental",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, quando você conjurar uma magia que cause dano do tipo associado ao seu ancestral dracônico, adicione seu modificador de Carisma ao dano. Ao mesmo tempo, você pode gastar 1 ponto de feitiçaria para ganhar resistência a esse tipo de dano por 1 hora. O bônus de dano se aplica a uma única rolagem de dano da magia, não à diversas rolagens.
                `
            },
            {
                nome: "Asas de Dragão",
                nivel: 14,
                descricao: `
                    No 14° nível, você adquire a habilidade de brotar um par de asas de dragão das suas costas, ganhando deslocamento de voo igual ao seu deslocamento atual. Você pode criar essas asas com uma ação bônus, no seu turno. Elas duram até que você as dissipe, com uma ação bônus no seu turno.

                    Você não pode manifestar suas asas quando estiver vestindo uma armadura, a não ser que a armadura seja feita para acomodá-las, e roupas que não forem feitas para se acomodar às suas asas devem ser destruídas quando você manifestá-las.
                `
            },
            {
                nome: "Presença Dracônica",
                nivel: 18,
                descricao: `
                    A partir do 18° nível, você pode canalizar a assustadora presença do seu ancestral dracônico, fazendo com que aqueles que o rodeiam fiquem impressionados ou amedrontados. Com uma ação, você pode gastar 5 pontos de feitiçaria para recorrer a esse poder e exalar uma aura de admiração ou medo (à sua escolha) a uma distância de 18 metros. Por 1 minuto ou até você perder sua concentração (como se você tivesse conjurado uma magia de concentração), cada criatura hostil que começar seu turno nessa aura, deve ser bem sucedido num teste de resistência de Sabedoria ou ficará enfeitiçada (se você escolheu admiração) ou amedrontada (se você escolheu medo) até a aura terminar. Uma criatura que seja bem sucedida no teste de resistência ficará imune a sua aura por 24 horas.
                `
            }
        ];
    }
}