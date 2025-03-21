import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class LadraoDasSombras extends BackGround {
    constructor() {
        super("Membro da Guilda dos Ladrões das Sombras", ["Furtividade", "Enganação"], 1,
            ["Duas adagas", "Kit de Disfarce", "Ferramentas de Ladrão", "conjunto de roupas comuns", "conjunto de roupas de viajante", "roupas finas", "folhas de papel (5 a 9)", "pena", "frascos de tinta preta, vermelha e invisível", "capa preta com o símbolo dos Ladrões das Sombras em cinza", "algibeira contendo 20 po"],
            ["Kit de disfarce", "ferramentas de ladrão"],
            {
                nome: "LADRÃO DAS SOMBRAS",
                descricao: `
                  Assim como um artesão pertence a uma guilda, você faz parte de uma organização criminosa. Você vive um estilo de vida confortável sem precisar pagar por isso, e sua guilda oferece proteção contra acusações de crimes. No entanto, para continuar sendo membro, você deve entregar 10 peças de ouro por mês para a guilda. Além disso, sua organização cobre os custos de manutenção das suas armas e sua alimentação enquanto estiver longe da sede.
                `,
            })
    }
}