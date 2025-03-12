import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class ArtesaoGuilda extends BackGround {
    constructor(){
        super("artesão da guilda", ["Insight", "Persuasão"], 1, ["Ferramentas de artesão"], ["Negócios da Guilda"])
    }
}