import { Halfling } from "../classesFilhos/Halfling.class.ts";

export class HalflingLeve extends Halfling {
    constructor() {
      super();
      this.nome = "Halfling Leve";
      this.atributos?.atributo.push("carisma");
      this.atributos?.bonus.push(1);
      this.tracos?.push(
        {
          traco: "Furtividade Natural",
          descricao: "Você pode tentar se esconder mesmo quando possuir apenas a cobertura de uma criatura que for no mínimo um tamanho maior que o seu."
      }
      );
    }
  }