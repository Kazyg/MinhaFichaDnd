import { Raca } from "../classesPrincipais/Raca.class.ts";

export class HumanoVariante extends Raca {
  constructor(atributo1: string, atributo2: string) {
    super("Humano Variante", "Médio", 30, ["Comum", "Outro Idioma à Escolha"], {atributo: [atributo1, atributo2], bonus: [1,1]}, 
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