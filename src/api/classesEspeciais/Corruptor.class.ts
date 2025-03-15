import { Patronos } from "./Patronos.class.ts";

export class Corruptor extends Patronos {
    constructor(){
        super(
            "O Corruptor",
            [
                {
                    nome: "LISTA DE MAGIA EXPANDIDA",
                    descricao: "O Corruptor permite que você escolha magias de uma lista expandida quando você for aprender magias de bruxo. As seguintes magias são adicionadas a sua lista de magias de bruxo."
                },
                {
                    nome: "BÊNÇÃO DO OBSCURO",
                    descricao: `A partir do 1° nível, quando você reduzir uma criatura hostil a 0 pontos de vida, você ganha uma quantidade de pontos de vida temporários igual ao seu modificador de Carisma + seu nível de bruxo (mínimo 1).`
                },
                {
                    nome: "SORTE DO PRÓPRIO OBSCURO",
                    descricao: `A partir do 6° nível, você pode pedir ao seu patrono para alterar o destino em seu favor. Quando você realizar um teste de habilidade ou um teste de resistência, você pode usar essa característica para adicionar 1d10 a sua jogada. Você pode fazer isso após ver sua jogada inicial, mas antes que qualquer efeito da jogada ocorra. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.`
                },
                {
                    nome: "RESISTÊNCIA DEMONÍACA",
                    descricao: `A partir do 10° nível, você pode escolher um tipo de dano quando você terminar um descanso curto ou longo. Você adquire resistência contra esse tipo de dano até você escolher um tipo de dano diferente com essa característica. Dano causado por armas mágicas ou armas de prata ignoram essa resistência.`
                },
                {
                    nome: "LANÇAR NO INFERNO",
                    descricao: `A partir do 14° nível, quando você atingir uma criatura com um ataque, você pode usar essa característica para, instantaneamente, transportar o alvo para os planos inferiores. A criatura desaparece e é jogada para um lugar similar a um pesadelo. No final do seu turno, o alvo retorna ao lugar que ela ocupava anteriormente, ou para o espaço desocupado mais próximo. Se o alvo não for um corruptor, ele sofre 10d10 de dano psíquico à medida que toma conta da experiência traumática. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.`
                }
            ],
            ["mãos flamejantes", "comando", "cegueira", "surdez", "raio ardente", "bola de fogo", "névoa fétida", "escudo de fogo", "muralha de fogo", "coluna de chamas", "consagrar"],
            [
                {
                    nivel: 1,
                    caracteristicas: ["LISTA DE MAGIA EXPANDIDA", "BÊNÇÃO DO OBSCURO"]
                },
                {
                    nivel: 6,
                    caracteristicas: ["SORTE DO PRÓPRIO OBSCURO"]
                },
                {
                    nivel: 10,
                    caracteristicas: ["RESISTÊNCIA DEMONÍACA"]
                },
                {
                    nivel: 14,
                    caracteristicas: ["LANÇAR NO INFERNO"]
                }
            ]
        )
    }
}