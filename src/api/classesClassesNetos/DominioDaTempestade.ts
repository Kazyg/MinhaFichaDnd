import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaTempestade extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Tempestade",
            "Deuses cujo portfólio contenha o domínio da Tempestade – como Talos, Umberlee, Kord, Zeboim, o Devorador, Zeus e Thor – governam tormentas, mares e céus. Estão inclusos deuses dos relâmpagos e trovões, deuses dos terremotos, alguns deuses do fogo e certos deuses da violência, força física e coragem. Em alguns panteões, um deus com esse domínio comanda os outros deuses e é conhecido pela justiça rápida levada através de relâmpagos. Nos panteões de povos marítimos e navegantes, deuses com esse domínio são divindades do oceano e patrono dos marinheiros. Deuses da tempestade enviam seus clérigos para inspirar pavor no povo comum, tanto para mantê-los no caminho da justiça e coragem quanto para oferecer sacrifícios de propiciação para afastar a ira divina."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio da Tempestade",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | névoa obscurecente, onda trovejante
                    3°               | lufada de vento, despedaçar
                    5°               | convocar relâmpagos, nevasca
                    7°               | controlar a água, tempestade de gelo
                    9°               | onda destrutiva, praga de insetos
                `
            },
            {
                nome: "Proficiência Adicional",
                nivel: 1,
                descricao: "A partir do 1° nível, você adquire proficiência em armas marciais e armaduras pesadas."
            },
            {
                nome: "Ira da Tormenta",
                nivel: 1,
                descricao: `
                    Também a partir do 1° nível, você pode repreender ataques violentamente. Quando uma criatura a 1,5 metro de você que você possa ver, atingir você com um ataque, você pode usar sua reação para forçar a criatura a realizar um teste de resistência de Destreza. A criatura sofre 2d8 de dano elétrico ou de trovão (à sua escolha) caso falhe no teste, e metade desse dano caso seja bem sucedido. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (mínimo uma vez). Você recupera todos os usos gastos após terminar um descanso longo.
                `
            },
            {
                nome: "Canalizar Divindade: Ira Destruidora",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode usar seu Canalizar Divindade para empunhar o poder da tormenta com ferocidade desmedida. Quando você rolar dano elétrico ou trovejante, você pode usar seu Canalizar Divindade para causar o máximo de dano, ao invés de rolá-lo.
                `
            },
            {
                nome: "Golpe de Relâmpago",
                nivel: 6,
                descricao: `
                    No 6° nível, quando você causa dano elétrico a uma criatura Grande ou menor, você também pode empurrá-la para até 3 metros de distância de você.
                `
            },
            {
                nome: "Golpe Divino",
                nivel: 8,
                descricao: `
                    No 8º nível, você ganha a habilidade de imbuir seus ataques com energia divina. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você pode fazer o ataque causar 1d8 de dano trovejante extra ao alvo. Quando alcançar o 14º nível, o dano extra aumenta para 2d8.
                `
            },
            {
                nome: "Filho da Tormenta",
                nivel: 17,
                descricao: `
                    A partir do 17° nível, você adquire deslocamento de voo igual a seu deslocamento de caminhada contanto que você não esteja no subterrâneo ou em local fechado.
                `
            }
        ];
    }
}