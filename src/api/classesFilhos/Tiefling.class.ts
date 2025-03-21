import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Tiefling extends Raca {
  constructor() {
    super("Tiefling", "Médio", 30, ["Comum", "Infernal"], { atributo: ["carisma", "inteligencia"], bonus: [2, 1] },
      [
        {
          traco: "Resistência Infernal",
          descricao: "Você possui resistência a dano de fogo.",
        },
        {
          traco: "Legado Infernal",
          descricao: `
          Você conhece o truque taumaturgia. Quando você atingir o 3° nível, você poderá conjurar a magia repreensão infernal como uma magia de 2° nível. 
          Quando você atingir o 5° nível, você também poderá conjurar a magia escuridão. Você precisa terminar um descanso longo para poder usar as magias 
          desse traço novamente. Sua habilidade de conjuração para essas magias é Carisma.
        `,
        },
      ]);
  }
}