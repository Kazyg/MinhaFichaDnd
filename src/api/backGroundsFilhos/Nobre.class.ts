import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Nobre extends BackGround {
    constructor() {
        super("nobre", ["História", "Persuasão"], 1, ["conjunto de trajes finos", "anel de sinete", "pergaminho de linhagem", "algibeira contendo 25 po"],
            ["kit de jogos"],
            {
                nome: "POSIÇÃO PRIVILEGIADA",
                descricao: `
                  Graças à sua origem nobre, as pessoas tendem a pensar o melhor de você. Você é bem-vindo na alta sociedade e as pessoas assumem que você tem o direito de estar onde está. As pessoas comuns fazem todos os esforços para acomodá-lo e evitar seu desprazer, e outros nobres o tratam como um membro da mesma classe social. Você pode conseguir uma audiência com um nobre local se precisar.
                `,
            })
    }
}