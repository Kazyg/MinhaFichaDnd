import { Elfo } from "../classesFilhos/Elfo.class.ts";

export class ElfoFloresta extends Elfo {
    constructor() {
      super();
      this.nome = "Elfo da Floresta";
      this.tracos?.push(
        {
          traco: "Treinamento Élfico com Armas",
          descricao: "Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos."
      },
      {
          traco: "Pés Ligeiros",
          descricao: "Seu deslocamento base de caminhada aumenta para 10,5 metros."
      },
      {
          traco: "Máscara da Natureza",
          descricao: "Você pode tentar se esconder mesmo quando você está apenas levemente obscurecido por folhagem, chuva forte, neve caindo, névoa ou outro fenômeno natural."
      }
      );
      this.atributos?.atributo.push("sabedoria");
      this.atributos?.bonus.push(1);
      this.proeficiencias?.push("espadas longas", "espadas curtas", "arcos longos", "arcos curtos");
    }
  }