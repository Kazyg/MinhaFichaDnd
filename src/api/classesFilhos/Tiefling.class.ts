import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Tiefling extends Raca {
  constructor() {
    super("Tiefling", "Médio", 30, ["Comum", "Infernal"], {atributo:["carisma", "inteligencia"], bonus:[2,1]}, ["Resistência Infernal", "Magia Infernal"]);
  }
}