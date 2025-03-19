import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class MagiaSelvagem extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Magia Selvagem",
            "Sua magia inata vem das forças selvagens do caos que constituem a base da ordem da criação. Você deve ter sido exposto a algum tipo de magia bruta, talvez de um portal planar que levava ao Limbo, a Planos Elementais ou ao misterioso Reino Distante. Talvez você tenha sido abençoado por uma poderosa criatura feérica ou marcado por um corruptor. Ou sua magia pode ser uma casualidade do seu nascimento, sem qualquer razão aparente. No entanto, ela existe, essa magia caótica fervilha dentro de você, esperando por qualquer brecha."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Surto de Magia Selvagem",
                nivel: 1,
                descricao: `
                    A partir do momento que você escolhe essa origem, no 1° nível, sua conjuração pode liberar surtos de magia selvagem. Imediatamente após você conjurar uma magia de feiticeiro de 1° nível ou superior, o Mestre pode solicitar que você role um d20. Se você rolar um 1, role na tabela Surto de Magia Selvagem para criar um efeito mágico aleatório. Um surto só pode ocorrer uma vez por turno. Se o efeito de um surto for uma magia, ela é muito selvagem para ser afetada por Metamagia. Se ela normalmente exige concentração, nesse caso não será necessário; a magia permanece por sua duração total.
                `
            },
            {
                nome: "Marés de Caos",
                nivel: 1,
                descricao: `
                    A partir do 1° nível, você pode manipular as forças do acaso e do caos para ganhar vantagem em uma jogada de ataque, teste de habilidade ou teste de resistência. Quando o fizer, você deve finalizar um descanso longo antes de poder usar essa característica novamente. A qualquer momento, antes de recuperar o uso dessa característica, o Mestre pode rolar na tabela Surto de Magia Selvagem, imediatamente após você conjurar uma magia de feiticeiro de 1° nível ou superior. Após isso, você recupera o uso dessa característica.
                `
            },
            {
                nome: "Dobrar a Sorte",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, você adquire a habilidade de mudar o destino usando sua magia selvagem. Quando outra criatura que você possa ver realizar uma jogada de ataque, um teste de habilidade ou um teste de resistência, você pode usar sua reação para gastar 2 pontos de feitiçaria para rolar 1d4 e aplicar o número rolado como um bônus ou uma penalidade (à sua escolha) na jogada da criatura. Você pode fazer isso depois da criatura fazer a jogada, mas antes do efeito ocorrer.
                `
            },
            {
                nome: "Caos Controlado",
                nivel: 14,
                descricao: `
                    No 14° nível, você ganha um controle módico sobre seus surtos de magia selvagem. Sempre que você rolar a tabela Surto de Magia Selvagem, você pode rolar duas vezes e usar qualquer resultado.
                `
            },
            {
                nome: "Bombardeio de Magia",
                nivel: 18,
                descricao: `
                    A partir do 18° nível, a energia nociva das suas magias se intensifica. Quando você rolar o dano de uma magia e rolar o maior dano possível em qualquer dado, escolha um desses dados, role ele novamente e adicione o valor rolado ao dano. Você pode usar essa característica apenas uma vez por rodada.
                `
            }
        ];
    }
}