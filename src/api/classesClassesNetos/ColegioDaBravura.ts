import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ColegioDaBravura extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Colégio da Bravura",
            "Os bardos do Colégio da Bravura são escaldos destemidos de quem os contos mantêm viva a memória dos grandes heróis do passado, dessa forma inspirando uma nova geração de heróis. Esses bardos se reúnem em salões de hidromel ou ao redor de fogueiras para cantar os feitos dos grandiosos, tanto do passado quanto do presente. Eles viajam pelos lugares para testemunhar grandes eventos em primeira mão e para garantir que a memória desses eventos não se perca nesse mundo. Com suas canções, eles inspiram outros a alcançar o mesmo patamar de realizações dos antigos heróis."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Proficiência Adicional",
                nivel: 3,
                descricao: "Quando você se junta ao Colégio da Bravura no 3° nível, você adquire proficiência com armaduras médias, escudos e armas marciais."
            },
            {
                nome: "Inspiração em Combate",
                nivel: 3,
                descricao: `
                    Também no 3° nível, você aprende a inspirar os outros em batalha. Uma criatura que possuir um dado de Inspiração de Bardo seu, pode rolar esse dado e adicionar o número rolado a uma jogada de dano que ele tenha acabado de fazer. Alternativamente, quando uma jogada de ataque for realizada contra essa criatura, ela pode usar sua reação para rolar o dado de Inspiração de Bardo e adicionar o número rolado a sua CA contra esse ataque, depois da rolagem ser feita, mas antes de saber se errou ou acertou.
                `
            },
            {
                nome: "Ataque Extra",
                nivel: 6,
                descricao: "A partir do 6° nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno."
            },
            {
                nome: "Magia de Batalha",
                nivel: 14,
                descricao: `
                    No 14° nível, você dominou a arte de tecer a conjuração e usar armas em um ato harmonioso. Quando você usar sua ação para conjurar uma magia de bardo, você pode realizar um ataque com arma com uma ação bônus.
                `
            }
        ];
    }
}