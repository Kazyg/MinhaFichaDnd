import { Raca } from "../classesPrincipais/Raca.class.ts";

export class MeioOrc extends Raca {
  constructor() {
    super("Meio-Orc", "Médio", 30, ["Comum", "Orc"],{atributo:["forca", "constituicao"], bonus:[2,1]} , 
      [
        {
            traco: "Visão no Escuro",
            descricao: "Graças ao seu sangue orc, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza."
        },
        {
            traco: "Ameaçador",
            descricao: "Você adquire proficiência na perícia Intimidação."
        },
        {
            traco: "Resistência Implacável",
            descricao: "Quando você é reduzido a 0 pontos de vida mas não é completamente morto, você pode voltar para 1 ponto de vida. Você não pode usar essa característica novamente até completar um descanso longo."
        },
        {
            traco: "Ataques Selvagens",
            descricao: "Quando você atinge um ataque crítico com uma arma corpo-a-corpo, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra causado pelo acerto crítico."
        }
    ]);
  }
}