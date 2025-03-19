import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ConclaveDoCaçador extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Conclave do Caçador",
            "Alguns patrulheiros buscam dominar armas para proteger melhor a civilização dos terrores do ambiente selvagem. Membros do Conclave do Caçador aprendem técnicas especializadas de luta usadas contra as mais terríveis ameaças, desde ogros enfurecidos e hordas de orcs até enormes gigantes e dragões aterradores."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Presa do Caçador",
                nivel: 3,
                descricao: `
                    No 3° nível, você ganha uma das seguintes características, à sua escolha:
                    - **Assassino de Colossos**: Sua tenacidade pode derrubar os mais poderosos oponentes. Quando você atinge uma criatura com um ataque com arma, a criatura sofre 1d8 de dano extra, se ela estiver abaixo do máximo de pontos de vida dela. Você só pode causar esse dano extra uma vez por turno.
                    - **Matador de Gigantes**: Quando uma criatura Grande ou maior a até 1,5 metro de você atingir ou errar um ataque contra você, você pode usar sua reação para atacar a criatura, imediatamente após o ataque dela, considerando que você possa ver a criatura.
                    - **Destruidor de Hordas**: Uma vez em cada um dos seus turnos, quando você fizer um ataque com arma, você pode realizar outro ataque com a mesma arma contra uma criatura diferente que esteja a até 1,5 metro do alvo original e esteja no alcance da sua arma.
                `
            },
            {
                nome: "Ataque Extra",
                nivel: 5,
                descricao: `
                    A partir do 5° nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno.
                `
            },
            {
                nome: "Táticas Defensivas",
                nivel: 7,
                descricao: `
                    No 7° nível, você ganha uma das seguintes características, à sua escolha:
                    - **Escapar da Horda**: Ataques de oportunidade contra você são feitos com desvantagem.
                    - **Defesa Contra Múltiplos Ataques**: Quando uma criatura atinge você com um ataque, você recebe +4 de bônus na CA contra todos os ataques subsequentes feitos por essa criatura no resto do turno.
                    - **Vontade de Aço**: Você tem vantagem em testes de resistência para evitar ser amedrontado.
                `
            },
            {
                nome: "Ataque Múltiplo",
                nivel: 11,
                descricao: `
                    No 11° nível, você ganha uma das seguintes características, à sua escolha:
                    - **Saraivada**: Você pode usar sua ação para realizar um ataque à distância contra qualquer número de criatura a até 3 metros de um ponto que você possa ver, no alcance da sua arma. Você deve ter munição para cada alvo, como normal, e você realiza uma jogada de ataque separada para cada alvo.
                    - **Ataque Giratório**: Você pode usar sua ação para realizar um ataque corpo-a-corpo contra qualquer número de criaturas a até 1,5 metro de você, realizando uma jogada de ataque separada para cada alvo.
                `
            },
            {
                nome: "Defesa de Caçador Superior",
                nivel: 15,
                descricao: `
                    No 15° nível, você ganha uma das seguintes características, à sua escolha:
                    - **Evasão**: Você pode esquivar-se agilmente de certos efeitos em área, como o sopro de fogo de um dragão vermelho ou uma magia relâmpago. Quando você for alvo de um efeito que exige um teste de resistência de Destreza para sofrer metade do dano, você não sofre dano algum se passar, e somente metade do dano se falhar.
                    - **Manter-se Contra a Maré**: Quando uma criatura hostil errar você com um ataque corpo-a-corpo, você pode usar sua reação para forçar a criatura a repetir o mesmo ataque contra outra criatura (que não ela mesma), à sua escolha.
                    - **Esquiva Sobrenatural**: Quando um atacante que você possa ver, atinge você com um ataque, você pode usar sua reação para reduzir o dano causado pelo ataque à metade.
                `
            }
        ];
    }
}