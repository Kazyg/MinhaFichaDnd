import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Criminal extends BackGround {
    constructor() {
        super("criminal", ["Enganação", "Furtividade"], 0, ["pé de cabra", "conjunto de roupas escuras comuns com capuz", "algibeira contendo 15 po"],
            ["kit de jogo", "ferramentas de ladrão"],
            {
                nome: "CONTATO CRIMINAL",
                descricao: `
                  Você possui contatos de confiança que agem como seus informantes em uma rede criminosa. Você sabe como se comunicar com eles mesmo em grandes distâncias. Você conhece em especial os mensageiros locais, mestres de caravana corruptos, e marinheiros escusos que podem transmitir seus recados.
                `,
            })
    }
}