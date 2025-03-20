import { Classes } from "./Classes.class";

export class Multiclasses {
    id: string;
    classe: Classes;
    nivelClasse: number;
    nivelEscolhido: number[];
    constructor(
        classe: Classes,
        nivelClasse: number,
        nivelEscolhido: number
    ){
        this.id = this.gerarIdUnico();
        this.classe = classe;
        this.nivelClasse = nivelClasse;
        this.nivelEscolhido = [nivelEscolhido];
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
}