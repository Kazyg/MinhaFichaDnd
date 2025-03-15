import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Marinheiro extends BackGround {
    constructor(){
        super("marinheiro", ["Atletismo", "Percepção"], 0, ["Ferramentas do navegador", "veículos (água)"], ["Passagem do Navio"])
    }
}