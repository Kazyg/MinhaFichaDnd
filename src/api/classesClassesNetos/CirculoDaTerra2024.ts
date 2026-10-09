import { SubClasses } from "../classesPrincipais/SubClasses";

export class CirculoDaTerra2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Círculo da Terra", "O Círculo da Terra reúne místicos e sábios que preservam conhecimentos e rituais ancestrais ligados aos terrenos naturais.");
        this.niveis = [
            {
                nome: "Auxílio da Terra",
                nivel: 3,
                descricao: "Como ação Usar Magia, você pode gastar um uso de Forma Selvagem e escolher um ponto a até 18 metros. Flores e espinhos surgem em uma Esfera de 3 metros; criaturas à sua escolha nela realizam salvaguarda de Constituição contra sua CD de magia, sofrendo 2d6 de dano Necrótico se falharem ou metade em sucesso. Uma criatura à sua escolha na área restaura 2d6 Pontos de Vida. O dano e a cura aumentam para 3d6 no nível 10 e 4d6 no nível 14."
            },
            {
                nome: "Magias do Círculo da Terra",
                nivel: 3,
                descricao: "Sempre que completar Descanso Longo, escolha um terreno: árido, polar, temperado ou tropical. Você tem preparadas as magias do terreno escolhido de seu nível de Druida ou inferior. Árido: Mãos Flamejantes, Raio de Fogo, Turvar, Bola de Fogo, Malogro e Muralha de Pedra. Polar: Névoa Obscurecente, Paralisar Pessoa, Raio de Gelo, Nevasca, Tempestade Glacial e Cone de Frio. Temperado: Passo Nebuloso, Sono, Toque Chocante, Relâmpago, Movimentação Livre e Passo Arbóreo. Tropical: Bolha Ácida, Raio Nauseante, Teia, Nuvem Fétida, Polimorfia e Praga de Insetos."
            },
            {
                nome: "Recuperação Natural",
                nivel: 6,
                descricao: "Você pode conjurar uma das magias de 1º círculo ou superior preparadas por Magias do Círculo Druídico sem gastar espaço de magia e recupera esse uso ao completar Descanso Longo. Além disso, ao completar Descanso Curto, pode recuperar espaços de magia gastos cuja soma de círculos seja menor ou igual à metade do seu nível de Druida, arredondado para cima, sem recuperar espaços de 6º círculo ou superior. Depois disso, só pode recuperar espaços novamente com esta característica após Descanso Longo."
            },
            {
                nome: "Proteção Natural",
                nivel: 10,
                descricao: "Você é imune à condição Envenenado e tem Resistência a um tipo de dano conforme o terreno escolhido em Magias do Círculo Druídico: Árido concede Ígneo, Polar concede Gélido, Temperado concede Elétrico e Tropical concede Venenoso."
            },
            {
                nome: "Santuário Natural",
                nivel: 14,
                descricao: "Como ação Usar Magia, você pode gastar um uso de Forma Selvagem e criar árvores e vinhas espectrais em um Cubo de 4,5 metros no chão a até 36 metros. Elas duram 1 minuto ou até você morrer ou ficar Incapacitado. Você e seus aliados têm Cobertura Parcial na área, e seus aliados recebem sua Resistência atual de Proteção Natural enquanto estiverem nela. Como Ação Bônus, você pode mover o Cubo até 18 metros para o chão a até 36 metros."
            }
        ];
    }
}
