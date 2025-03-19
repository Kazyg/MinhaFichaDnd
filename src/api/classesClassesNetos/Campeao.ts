import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Campeao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Campeão",
            "O arquétipo Campeão foca no desenvolvimento da pura força física acompanhada por uma perfeição mortal. Aqueles que trilham o caminho desse arquétipo combinam rigorosos treinamentos com excelência física para desferir golpes devastadores."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Crítico Aprimorado",
                nivel: 3,
                descricao: `
                    A partir do 3º nível, seus ataques com armas adquirem uma margem de acerto crítico de 19 a 20 nas jogadas de ataque.
                `
            },
            {
                nome: "Atletismo Extraordinário",
                nivel: 7,
                descricao: `
                    A partir do 7º nível, você adiciona metade de seu bônus de proficiência (arredondado para cima) em qualquer teste de Força, Destreza ou Constituição que você já não aplique seu bônus de proficiência. Além disso, quando você fizer um salto longo com corrida, o alcance em metros que poderá saltar aumenta em 0,3 vezes o seu modificador de Força.
                `
            },
            {
                nome: "Estilo de Luta Adicional",
                nivel: 10,
                descricao: `
                    No 10º nível, você pode escolher um segundo Estilo de Combate da sua característica de classe.
                `
            },
            {
                nome: "Crítico Superior",
                nivel: 15,
                descricao: `
                    A partir do 15º nível, seus ataques com armas adquirem uma margem de acerto crítico de 18 a 20 nas jogadas de ataque.
                `
            },
            {
                nome: "Sobrevivente",
                nivel: 18,
                descricao: `
                    No 18º nível, você alcança o topo da resiliência em batalha. No começo de cada um de seus turnos, você recupera uma quantidade de pontos de vida igual a 5 + seu modificador de Constituição se não estiver com mais que metade de seus pontos de vida. Você não recebe esse benefício se estiver com 0 pontos de vida.
                `
            }
        ];
    }
}