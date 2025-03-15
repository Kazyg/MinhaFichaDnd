import { Halfling } from "../classesFilhos/Halfling.class.ts";

export class HalflingRobusto extends Halfling {
    constructor() {
      super();
      this.nome = "Halfling Robusto";
      this.atributos?.atributo.push("Constituição");
      this.atributos?.bonus.push(1);
      this.tracos?.push(
        {
          traco: "Resiliência dos Robustos",
          descricao: "Você tem vantagem em testes de resistência contra veneno e tem resistência contra dano de veneno."
      }
      );
    }
  }