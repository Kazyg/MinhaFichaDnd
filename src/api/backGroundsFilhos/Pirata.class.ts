import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Pirata extends BackGround {
    constructor() {
        super("Pirata Bêbado", ["Persuasão", "Atuação"], 0, ["duas garrafas de cerveja", "sacola contendo 6 garrafas vazias de cerveja", "Trajes de pirata", "carteira vazia", "cutelo que exala cheiro de álcool"],
            ["Ferramentas de Navegação", "Veículos (Aquáticos)"],
            {
                nome: "CACHORRO DO MAR BÊBADO",
                descricao: `
                  Você tem dificuldades para funcionar quando está sóbrio. No entanto, ao estar sob efeito do álcool, consegue se lembrar de certas informações esquecidas. Após falhar em um teste de Constituição ao beber, você pode fazer uma pergunta menor, que o Mestre pode responder de forma específica ou vaga, conforme desejar.
                `,
            })
    }
}