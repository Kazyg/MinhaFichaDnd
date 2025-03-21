import { Raca } from "../classesPrincipais/Raca.class.ts";

export class MeioElfo extends Raca {
  constructor(atributo1: string, atributo2: string, pericia1: string, pericia2: string) {
    super("Meio-Elfo", "Médio", 30, ["Comum", "Élfico"],{atributo:["carisma", atributo1, atributo2], bonus:[2,1,1]} , [
      {
          traco: "Visão no Escuro",
          descricao: "Graças ao seu sangue élfico, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza."
      },
      {
          traco: "Ancestral Feérico",
          descricao: "Você possui vantagem em testes de resistência contra encantamento e magia não pode colocar você pra dormir."
      },
      {
          traco: "Versatilidade em Perícia",
          descricao: "Você ganha proficiência em duas perícias, à sua escolha."
      }
  ]);
  this.pericia = [pericia1, pericia2];
  }
}