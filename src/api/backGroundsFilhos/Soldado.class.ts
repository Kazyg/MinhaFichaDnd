import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Soldado extends BackGround {
    constructor(){
        super("soldado", ["Atletismo", "Intimidação"], 0, ["Conjunto de jogos", "veículos (terrestres)"], ["Posto Militar"])
    }
}