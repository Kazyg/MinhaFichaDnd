import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class TrapaceiroArcano extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Trapaceiro Arcano",
            "Alguns ladinos aprimoram suas finas perícias de furtividade e agilidade com magia, aprendendo truques de encantamento e ilusão. Esses ladinos incluem não somente batedores de carteira e assaltantes, mas também trapaceiros, enganadores e um número significativo de aventureiros."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Conjuração",
                nivel: 3,
                descricao: `
                    Quando você alcançar o 3° nível, você adquire a habilidade de conjurar magias. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de mago.

                    **Truques.** Você aprende três truques: mãos mágicas e outros dois truques, à sua escolha, da lista de magias de mago. Você aprende um truque de mago adicional, à sua escolha, no 10° nível.

                    **Espaços de Magia.** A tabela Conjuração de Trapaceiro Arcano mostra quantos espaços de magia de 1° nível e superiores você possui disponíveis para conjuração. Para conjurar uma dessas magias, você deve gastar um espaço de magia do nível da magia ou superior. Você recobra todos os espaços de magia gastos quando você completa um descanso longo.

                    **Magias Conhecidas de 1° Nível e Superiores.** Você conhece três magias de 1° nível, à sua escolha, as quais duas delas você deve escolher das magias de encantamento e ilusão da lista de magias de mago.

                    **Habilidade de Conjuração.** Sua habilidade de conjuração é Inteligência para suas magias de mago, portanto, você usa sua Inteligência sempre que alguma magia se referir à sua habilidade de conjurar magias. Além disso, você usa o seu modificador de Inteligência para definir a CD dos testes de resistência para as magias de mago que você conjura e quando você realiza uma jogada de ataque com uma magia.

                    **CD para suas magias = 8 + bônus de proficiência + seu modificador de Inteligência**

                    **Modificador de ataque de magia = seu bônus de proficiência + seu modificador de Inteligência**
                `
            },
            {
                nome: "Mãos Mágicas Malabaristas",
                nivel: 3,
                descricao: `
                    A partir do 3° nível, quando você conjurar mãos mágicas, você pode fazer a mão espectral ficar invisível e poderá realizar as seguintes tarefas adicionais:
                    - Você pode guardar um objeto que a mão estiver segurando em um recipiente vestido ou carregado por outra criatura.
                    - Você pode recuperar um objeto guardado em um recipiente vestido ou carregado por outra criatura.
                    - Você pode usar ferramentas de ladrão para abrir fechaduras ou desarmar armadilhas à distância.

                    Você pode realizar qualquer dessas tarefas sem ser notado por uma criatura se for bem sucedido num teste de Destreza (Prestidigitação) resistido por um teste de Sabedoria (Percepção) da criatura.

                    Além disso, você pode usar a ação bônus concedida por sua Ação Ardilosa para controlar a mão.
                `
            },
            {
                nome: "Emboscada Mágica",
                nivel: 9,
                descricao: `
                    A partir do 9° nível, se você estiver escondido de uma criatura quando conjurar uma magia nela, a criatura terá desvantagem em qualquer teste de resistência que ela fizer contra a magia nesse turno.
                `
            },
            {
                nome: "Trapaceiro Versátil",
                nivel: 13,
                descricao: `
                    No 13° nível, você ganha a habilidade de distrair alvos com suas mãos mágicas. Com uma ação bônus, no seu turno, você pode designar uma criatura a até 1,5 metro da mão espectral criada por essa magia. Fazer isso, lhe concede vantagem nas jogadas de ataque contra essa criatura até o final do turno.
                `
            },
            {
                nome: "Ladrão de Magia",
                nivel: 17,
                descricao: `
                    No 17° nível, você ganha a habilidade de, magicamente, roubar o conhecimento de como conjurar uma magia de outro conjurador.

                    Imediatamente depois de uma criatura conjurar uma magia que tenha você como alvo ou inclua você na sua área de efeito, você pode usar sua reação para forçar a criatura a realizar um teste de resistência com o modificador de habilidade de conjuração dele. A CD é igual a CD das suas magias. Numa falha, você ignora o efeito da magia sobre você e rouba o conhecimento da magia, se ela for de, pelo menos, 1° nível e de um nível que você possa conjurar (não precisa ser uma magia de mago). Pelas próximas 8 horas, você conhece a magia e pode conjurá-la usando seus espaços de magia. A criatura não pode conjurar a magia até que 8 horas tenham se passado.

                    Uma vez que você tenha usado essa característica, você não pode usá-la novamente até ter terminado um descanso longo.
                `
            }
        ];
    }
}