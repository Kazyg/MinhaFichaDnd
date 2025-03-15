import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Artista extends BackGround {
    constructor(){
        super("artista", ["Acrobacia", "Performance"], 0, ["Kit de disfarce", "instrumento musical"], ["Por demanda popular"])
    }
}