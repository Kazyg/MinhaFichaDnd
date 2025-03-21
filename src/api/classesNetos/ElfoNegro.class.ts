import { Elfo } from "../classesFilhos/Elfo.class.ts";

export class ElfoNegro extends Elfo {
    constructor() {
      super();
      this.nome = "Elfo Negro";
      this.tracos?.push(
        {
          traco: "Visão no Escuro Superior",
          descricao: "Sua visão no escuro tem alcance de 36 metros de raio."
      },
      {
          traco: "Sensibilidade à Luz Solar",
          descricao: "Você possui desvantagem nas jogadas de ataque e testes de Sabedoria (Percepção) relacionados a visão quando você, o alvo do seu ataque, ou qualquer coisa que você está tentando perceber, esteja sob luz solar direta."
      },
      {
          traco: "Magia Drow",
          descricao: "Você possui o truque globos de luz. Quando você alcança o 3° nível, você pode conjurar a magia fogo das fadas. Quando você alcança o 5° nível, você pode conjurar escuridão. Você precisa terminar um descanso longo para poder conjurar as magias desse traço novamente. Carisma é sua habilidade chave para conjurar essas magias."
      },
      {
          traco: "Treinamento Drow com Armas",
          descricao: "Você possui proficiência com rapieiras, espadas curtas e bestas de mão."
      }
      );
      this.atributos?.atributo.push("carisma");
      this.atributos?.bonus.push(1);
      this.proeficiencias?.push("rapieiras", "espadas curtas", "bestas de mão");
    }
  }