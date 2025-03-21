import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Charlatao extends BackGround {
    constructor() {
        super("Charlatao", ["Enganação", "Prestidigitação"], 0, ["conjunto de roupas finas", "m kit de disfarce", "ferramentas de trapaça", "algibeira contendo 15po"],
            ["Kit de disfarce", "kit de falsificação"],
            {
                nome: "IDENTIDADE FALSA",
                descricao: `
              Você criou uma segunda identidade que inclui documentos, conhecidos estabelecidos e disfarces que possibilitam que você assuma essa persona. Além disso, você pode forjar documentos, incluindo papéis oficiais e cartas pessoais, contanto que você tenha visto um exemplo desse tipo de documento ou a caligrafia de quem você está tentando copiar.
            `,
            })
    }
}