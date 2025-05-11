import { Patronos } from "./Patronos.class.ts";

export class LaminaMaldita extends Patronos {
    constructor() {
        super("Lamina Maldita",
            [
                {
                    nome: "LISTA DE MAGIAS EXPANDIDA",
                    descricao: "A Lâmina Maldita permite que você escolha uma lista expandida de magias quando aprende uma magia de bruxo. As seguintes magias são adicionadas à sua lista de magias de bruxo: escudo arcano, destruição colérica (1º), nublar, marca da punição (2º), piscar, arma elemental (3º), assassino fantasmagórico, destruição estonteante (4º), destruição banidora, cone de frio (5º)."
                },
                {
                    nome: "MALDIÇÃO DA LÂMINA MALDITA",
                    descricao: `Começando no 1º nível, você ganha a habilidade de colocar uma maldição perniciosa em alguém. Como uma ação bônus, escolha uma criatura que possa ver até 9 metros de alcance. O alvo é amaldiçoado por 1 minuto. A maldição termina mais cedo se o alvo morrer, você morrer, ou se você estiver incapacitado.
                    
Até a maldição terminar, você ganha os seguintes benefícios:
- Você ganha um bônus para testes de dano contra o alvo amaldiçoado. O bônus é igual ao seu bônus de proficiência.
- Qualquer ataque que você faça contra o alvo amaldiçoado é um golpe crítico em um resultado de 19 ou 20 no d20.
- Se o alvo amaldiçoado morrer, você recupera pontos de vida iguais ao seu nível de bruxo + seu modificador de Carisma (mínimo de 1 ponto de vida).

Você não pode usar essa característica novamente até terminar um descanso curto ou longo.`
                },
                {
                    nome: "GUERREIRO MALDITO",
                    descricao: `No 1º nível, você adquire o treinamento necessário para se armar efetivamente para a batalha. Você ganha proficiência em armaduras médias, escudos e armas marciais.

A influência de seu patrono também permite que canalize sua vontade através de uma arma específica. Sempre que terminar um descanso longo, pode tocar uma arma com a qual seja proficiente e que não possua a propriedade de duas mãos. Quando atacar com essa arma, pode usar seu modificador de Carisma, em vez de Força ou Destreza, para os testes de ataque e danos. Esse benefício dura até terminar um descanso longo. Se ganhar mais tarde a característica Pacto da Lâmina, esse benefício se estende a todas as armas de pacto que conjure com essa característica, independente do tipo da arma.`
                },
                {
                    nome: "ESPECTRO AMALDIÇOADO",
                    descricao: `A partir do 6º nível, você pode amaldiçoar a alma de uma pessoa que mata, vinculando-a temporariamente aos seus serviços. Quando você mata um humanoide, pode fazer com que seu espectro se levante de seu cadáver como um espectro (estatísticas no Manual dos Monstros). Quando o espectro aparece, ele ganha pontos de vida temporários iguais à metade do seu nível de bruxo. Role iniciativa para o espectro, que tem seus próprios turnos. Ele obedece aos seus comandos verbais e ganha um bônus especial em seus testes de ataque iguais ao seu modificador de Carisma (mínimo de +0).

O espectro permanece aos seus serviços até o final do próximo descanso longo, momento em que se anula para a vida após a morte. Depois de vincular um espectro com essa característica, não pode usá-la novamente até terminar um descanso longo.`
                },
                {
                    nome: "ARMADURA DE MALDIÇÕES",
                    descricao: `No 10º nível, suas maldições são mais poderosas. Se o alvo amaldiçoado pela Maldição da Lâmina Maldita o atingir com um teste de ataque, pode usar sua reação para rolar um d6. Em um 4 ou superior, o ataque instantaneamente falha sobre você, independentemente do resultado.`
                },
                {
                    nome: "MESTRE DAS MALDIÇÕES",
                    descricao: `A partir do 14º nível, você pode espalhar sua Maldição da Lâmina Maldita de uma criatura morta para outra criatura. Quando a criatura amaldiçoada pela Maldição da Lâmina Maldita morre, você pode aplicar a maldição a uma criatura diferente que possa ver a até 9 metros de alcance, desde que não esteja incapacitado. Quando aplica a maldição dessa maneira, não recupera pontos de vida da morte da criatura anteriormente amaldiçoada.`
                }
            ],
            [
                "escudo arcano", "destruição colérica", "nublar", "marca da punição",
                "piscar", "arma elemental", "assassino fantasmagórico", "destruição estonteante",
                "destruição banidora", "cone de frio"
            ],
            [
                {
                    nivel: 1,
                    caracteristicas: ["LISTA DE MAGIAS EXPANDIDA", "MALDIÇÃO DA LÂMINA MALDITA", "GUERREIRO MALDITO"]
                },
                {
                    nivel: 6,
                    caracteristicas: ["ESPECTRO AMALDIÇOADO"]
                },
                {
                    nivel: 10,
                    caracteristicas: ["ARMADURA DE MALDIÇÕES"]
                },
                {
                    nivel: 14,
                    caracteristicas: ["MESTRE DAS MALDIÇÕES"]
                }
            ]
        )
    }
}