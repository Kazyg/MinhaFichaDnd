import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CavaleiroArcano extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];
    magiasEspacos: {nivel: number, truques: number, magias: number, espacosMagia: {nivel: number, espacos: number}[]}[];

    constructor() {
        super(
            "Cavaleiro Arcano",
            "O arquétipo de Cavaleiro Arcano combina a maestria marcial comum a todos os guerreiros, com um cuidadoso estudo de magia. Os cavaleiros arcanos usam técnicas mágicas similares as praticadas pelos magos. Eles focam seu estudo em duas das oito escolas: abjuração e evocação. As magias de abjuração concedem proteção adicional em batalha ao Cavaleiro Arcano, e as magias de evocação causam dano a vários oponentes de uma vez, estendendo o alcance do guerreiro em combate. Esses cavaleiros aprendem, comparativamente, um pequeno número de magias, guardando-as na memória ao invés de mantê-las em um grimório."
        );
        this.niveis = this.preencherNiveis();
        this.magiasEspacos = this.preencherMagias();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Conjuração",
                nivel: 3,
                descricao: `
                    Quando você alcançar o 3° nível, você amplia o seu poderio marcial com a habilidade de conjurar magias. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de mago.

                    **Truques.** Você aprende dois truques, à sua escolha, da lista de magias de mago. Você aprende um truque de mago adicional, à sua escolha, no 10° nível.

                    **Espaços de Magia.** A tabela Conjuração de Cavaleiro Arcano mostra quantos espaços de magia de 1° nível e superiores você possui disponíveis para conjuração. Para conjurar uma dessas magias, você deve gastar um espaço de magia do nível da magia ou superior. Você recobra todos os espaços de magia gastos quando você completa um descanso longo.

                    **Magias Conhecidas de 1° Nível e Superiores.** Você conhece três magias de 1° nível, à sua escolha, as quais duas delas você deve escolher das magias de abjuração e evocação da lista de magias de mago.

                    **Habilidade de Conjuração.** Sua habilidade de conjuração é Inteligência para suas magias de mago, portanto, você usa sua Inteligência sempre que alguma magia se referir à sua habilidade de conjurar magias. Além disso, você usa o seu modificador de Inteligência para definir a CD dos testes de resistência para as magias de mago que você conjura e quando você realiza uma jogada de ataque com uma magia.

                    **CD para suas magias = 8 + bônus de proficiência + seu modificador de Inteligência**

                    **Modificador de ataque de magia = seu bônus de proficiência + seu modificador de Inteligência**
                `
            },
            {
                nome: "Vínculo com Arma",
                nivel: 3,
                descricao: `
                    No 3° nível, você aprende um ritual que cria um vínculo mágico entre você e uma arma. Você realiza esse ritual no curso de 1 hora, que pode ser realizada durante um descanso curto. A arma deve estar ao seu alcance ao decorrer do ritual, ao concluí-lo, você toca a arma e forja o elo.

                    Uma vez que você tenha vinculado uma arma a você, você não pode ser desarmado dessa arma, a menos que você esteja incapacitado. Se ela estiver no mesmo plano de existência, você pode invocar essa arma com uma ação bônus, no seu turno, fazendo-a se teletransportar instantaneamente para a sua mão.

                    Você pode ter até duas armas vinculadas, mas só pode invocar uma por vez com sua ação bônus. Se você quiser criar um elo com uma terceira arma, você deve quebrar o vínculo com uma das outras duas.
                `
            },
            {
                nome: "Magia de Guerra",
                nivel: 7,
                descricao: `
                    A partir do 7° nível, quando você usar sua ação para conjurar um truque, você pode realizar um ataque com arma, com uma ação bônus.
                `
            },
            {
                nome: "Golpe Místico",
                nivel: 10,
                descricao: `
                    No 10° nível, você aprende como fazer com que os seus golpes com arma penetrem a resistência de uma criatura às suas magias. Quando você atingir uma criatura com um ataque com arma, aquela criatura terá desvantagem no próximo teste de resistência que ela fizer contra uma magia que você conjurar antes do final do seu próximo turno.
                `
            },
            {
                nome: "Investida Arcana",
                nivel: 15,
                descricao: `
                    No 15° nível, você ganha a capacidade de se teletransportar até 9 metros para um espaço desocupado que você possa ver, quando você usar seu Surto de Ação. Você pode se teletransportar antes ou depois da ação adicional.
                `
            },
            {
                nome: "Magia de Guerra Aprimorada",
                nivel: 18,
                descricao: `
                    A partir do 18° nível, quando você usar sua ação para conjurar uma magia, você pode realizar um ataque com arma, com uma ação bônus.
                `
            }
        ];
    }
    private preencherMagias() {
        return [
            { nivel: 3, truques: 2, magias: 3, espacosMagia: [{nivel: 1, espacos: 2}, {nivel: 2, espacos: 0}] },
            { nivel: 4, truques: 2, magias: 4, espacosMagia: [{nivel: 1, espacos: 3}, {nivel: 2, espacos: 0}] },
            { nivel: 5, truques: 2, magias: 4, espacosMagia: [{nivel: 1, espacos: 3}, {nivel: 2, espacos: 0}] },
            { nivel: 6, truques: 2, magias: 4, espacosMagia: [{nivel: 1, espacos: 3}, {nivel: 2, espacos: 0}] },
            { nivel: 7, truques: 2, magias: 5, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 2}] },
            { nivel: 8, truques: 2, magias: 6, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 2}] },
            { nivel: 9, truques: 2, magias: 6, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 2}] },
            { nivel: 10, truques: 3, magias: 7, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}] },
            { nivel: 11, truques: 3, magias: 8, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}] },
            { nivel: 12, truques: 3, magias: 8, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}] },
            { nivel: 13, truques: 3, magias: 9, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 2}] },
            { nivel: 14, truques: 3, magias: 10, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 2}] },
            { nivel: 15, truques: 3, magias: 10, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 2}] },
            { nivel: 16, truques: 3, magias: 11, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 3}] },
            { nivel: 17, truques: 3, magias: 11, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 3}] },
            { nivel: 18, truques: 3, magias: 11, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 3}] },
            { nivel: 19, truques: 3, magias: 12, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 3}, {nivel: 4, espacos: 1}] },
            { nivel: 20, truques: 3, magias: 13, espacosMagia: [{nivel: 1, espacos: 4}, {nivel: 2, espacos: 3}, {nivel: 3, espacos: 3}, {nivel: 4, espacos: 1}] }
        ];
    }
}