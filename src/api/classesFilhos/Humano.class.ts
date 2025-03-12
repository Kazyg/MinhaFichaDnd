import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Humano extends Raca {
  constructor() {
    super("Humano", "Médio", 30, ["Comum", "Outro Idioma à Escolha"], {atributo: ["constituicao", "forca", "carisma", "inteligencia", "sabedoria", "destreza"], bonus: [1,1,1,1,1,1]}, 
      []
    );
  }
}