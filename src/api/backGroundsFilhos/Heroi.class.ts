import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Heroi extends BackGround {
    constructor(){
        super("Heroi", ["Manejo de animais", "sobrevivência"], 0, ["Ferramentas de artesão", "veículos (terrestres)"], ["Hospitalidade Rústica"])
    }
}