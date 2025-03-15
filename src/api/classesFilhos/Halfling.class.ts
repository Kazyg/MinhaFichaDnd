import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Halfling extends Raca {
  constructor(subOpcoes: Raca[] = []) {
    super("Halfling", "Pequeno", 25, ["Comum", "Halfling"],{atributo:["destreza"], bonus: [2]}, 
      [
        {
            traco: "Sortudo",
            descricao: "Quando você obtiver um 1 natural em uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar de novo o dado e deve utilizar o novo resultado."
        },
        {
            traco: "Bravura",
            descricao: "Você tem vantagem em testes de resistência contra ficar amedrontado."
        },
        {
            traco: "Agilidade Halfling",
            descricao: "Você pode mover-se através do espaço de qualquer criatura que for de um tamanho maior que o seu."
        }
    ], subOpcoes);
  }
}