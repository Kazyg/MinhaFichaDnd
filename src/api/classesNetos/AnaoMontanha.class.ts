import { Anao } from "../classesFilhos/Anao.class.ts";

export class AnaoMontanha extends Anao {
  constructor() {
    super();
    this.nome = "Anão da Montanha";
    this.atributos?.atributo.push("forca");
    this.atributos?.bonus.push(2);
    this.tracos?.push({
      traco: "Treinamento Anão com Armaduras",
      descricao: "Você adquire proficiência em armaduras leves e médias."
  });
  }
}