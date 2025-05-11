import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class PactoCorrente extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Pacto da Corrente",""
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Pacto da Corrente",
                nivel: 3,
                descricao: `
                    Você aprende a magia convocar familiar e pode conjurá-la
como um ritual. Essa magia não conta no número de
magias que você conhece.
Quando você conjura essa magia, você pode escolher
uma das formas convencionais para o seu familiar ou uma
das seguintes formas especiais: diabrete, pseudodragão,
quasit ou sprite.
Além disso, quando você realiza a ação de Ataque, você
pode renunciar s um dos seus ataques para permitir que
seu familiar realize um ataque, com a reação dele. 

                `
            }
        ];
    }
}