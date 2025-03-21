import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Forasteiro extends BackGround {
    constructor() {
        super("Forasteiro", ["Atletismo", "Sobrevivência"], 1, ["bordão", "armadilha de caça", "fetiche de um animal que você matou", "conjunto de roupas de viajante", "algibeira contendo 10 po"],
            ["instrumento musical"],
            {
                nome: "ANDARILHO",
                descricao: `
                  Você tem uma memória excelente para mapas e geografia, e você sempre pode recobrar o plano geral de terrenos, assentamentos ou outras características ao seu redor. Além disso, você pode encontrar comida e água fresca para você e até cinco outras pessoas a cada dia, considerando que a terra ofereça bagas, pequenas frutas, água e similares.
                `,
            })
    }
}