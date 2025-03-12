import { Elfo } from "../classesFilhos/Elfo.class.ts";

export class ElfoAlto extends Elfo {
    constructor() {
      super();
      this.nome = "Elfo Alto";
      this.atributos?.atributo.push("inteligencia");
      this.atributos?.bonus.push(1);
      this.tracos?.push({
        traco: "Treinamento Élfico com Armas",
        descricao: "Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos."
    });
    }
  }