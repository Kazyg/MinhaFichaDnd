import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Criminal extends BackGround {
    constructor(){
        super("criminal", ["Engano", "Furtividade"], 0, ["Conjunto de jogo", "ferramentas de ladrão"], ["Contato Criminal"])
    }
}