import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Gnomo extends Raca {
  constructor(subOpcoes: Raca[] = []) {
    super("Gnomo", "Pequeno", 25, ["Comum", "Gnômico"],{atributo:["inteligencia"], bonus:[2]}, 
      [
        {
            traco: "Visão no Escuro",
            descricao: "Acostumado à vida subterrânea, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza."
        },
        {
            traco: "Esperteza Gnômica",
            descricao: "Você possui vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia."
        }
    ], subOpcoes);
  }
}