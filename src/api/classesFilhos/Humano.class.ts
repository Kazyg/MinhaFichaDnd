import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Humano extends Raca {
  constructor() {
    super("Humano", "Médio", 30, ["Comum", "Outro Idioma à Escolha"], {atributo: ["constituicao", "forca", "carisma", "inteligencia", "sabedoria", "destreza"], bonus: [1,1,1,1,1,1]}, 
      [
        {
            traco: "Perícia",
            descricao: "Você ganha proficiência em uma perícia, à sua escolha."
        },
        {
            traco: "Talento",
            descricao: "Você adquire um talento de sua escolha."
        }
    ]
    );
  }
}