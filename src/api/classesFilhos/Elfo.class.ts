import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Elfo extends Raca {
  constructor(subOpcoes: Raca[] = []) {
    super("Elfo", "Médio", 30, ["Comum", "Élfico"],{ atributo: ["destreza"], bonus: [2] }, 
      [
        {
            traco: "Visão no Escuro",
            descricao: "Acostumado às florestas crepusculares e ao céu noturno, você possui uma visão superior em condições de escuridão e na penumbra. Você pode enxergar na penumbra a até 18 metros como se fosse na luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza."
        },
        {
            traco: "Sentidos Aguçados",
            descricao: "Você tem proficiência na perícia Percepção."
        },
        {
            traco: "Ancestral Feérico",
            descricao: "Você tem vantagem nos testes de resistência para resistir a ser enfeitiçado e magias não podem colocá-lo para dormir."
        },
        {
            traco: "Transe",
            descricao: "Elfos não precisam dormir. Ao invés disso, eles meditam profundamente, permanecendo semiconscientes, durante 4 horas por dia. (A palavra em idioma comum para tal meditação é 'transe'.) Enquanto medita, um elfo é capaz de sonhar de certo modo. Esses sonhos na verdade são exercícios mentais que se tornam reflexos através de anos de prática. Depois de descansar dessa forma, você ganha os mesmos benefícios que um humano depois de 8 horas de sono."
        }
    ], subOpcoes);
  }
}