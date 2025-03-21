import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Sabio extends BackGround {
    constructor() {
        super("sabio", ["Arcanismo", "História"], 2, ["vidro de tinta escura", "pena", "faca pequena", "carta de um falecido colega perguntando a você algo que você nunca terá a chance de responder", "conjunto de roupas comuns", "algibeira contendo 10 po"],
            [""],
            {
                nome: "PESQUISADOR",
                descricao: `
                  Quando tentar obter ou recuperar um fragmento de conhecimento que você não saiba, você descobre aonde e com quem pode obter essa informação. Normalmente ela será adquirida em bibliotecas, arquivos de escribas, universidades ou outros sábios e pessoas aptas. Seu Mestre pode decidir que o conhecimento que busca está escondido em algum lugar quase inacessível, ou é simplesmente impossível de se obter. Desvendar os segredos mais profundos do multiverso pode requerer uma campanha inteira.
                `,
            })
    }
}