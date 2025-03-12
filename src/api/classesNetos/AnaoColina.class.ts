import { Anao } from "../classesFilhos/Anao.class.ts";

export class AnaoColina extends Anao {
  constructor() {
    super();
    this.nome = "Anão da Colina";
    this.atributos?.atributo.push("Sabedoria");
    this.atributos?.bonus.push(1);
    this.tracos?.push(
      {
          traco: "Tenacidade Anã",
          descricao: "Seu máximo de pontos de vida aumentam em 1, e cada vez que o anão da colina sobe um nível, ele recebe 1 ponto de vida adicional."
      }
  );
  }
}