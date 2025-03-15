import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Anao extends Raca {
  constructor(subOpcoes: Raca[] = []) {
    super("Anão", "Médio", 25, ["Comum", "Anão"], { atributo: ["constituicao"], bonus: [2] } ,
      [
        {
            traco: "Visão no Escuro",
            descricao: "Acostumado à vida subterrânea, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza."
        },
        {
            traco: "Resiliência Anã",
            descricao: "Você possui vantagem em testes de resistência contra venenos e resistência contra dano de veneno (explicado no capítulo 9)."
        },
        {
            traco: "Treinamento Anão em Combate",
            descricao: "Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra."
        },
        {
            traco: "Proficiência com Ferramentas",
            descricao: "Você tem proficiência em uma ferramenta de artesão à sua escolha entre: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro."
        },
        {
            traco: "Especialização em Rochas",
            descricao: "Sempre que você realizar um teste de Inteligência (História) relacionado à origem de um trabalho em pedra, você é considerado proficiente na perícia História e adiciona o dobro do seu bônus de proficiência ao teste, ao invés do seu bônus de proficiência normal."
        }
    ], subOpcoes);
  }
}