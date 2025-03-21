import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Heroi extends BackGround {
    constructor() {
        super("Heroi Injustiçado", ["Intimidação", "Intuição"], 1, ["diário dos seus dias de glória no passado", "conjunto de roupas comuns", "algibeira contendo 20 po"],
            ["Kit de Disfarce"],
            {
                nome: "HERÓI NUNCA MAIS",
                descricao: `
                  Seu antigo nome era conhecido em diferentes graus. Para escapar da perseguição, você criou uma identidade reserva para evitar chamar atenção e se escondeu em uma vida mais comum e tranquila. Você se mistura muito bem entre praticamente qualquer plebeu em uma cidade, desde que eles sejam de uma raça semelhante à sua.
                `,
            })
    }
}