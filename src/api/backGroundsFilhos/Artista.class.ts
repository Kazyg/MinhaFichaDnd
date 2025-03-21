import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Artista extends BackGround {
    constructor(){
        super("artista", ["Acrobacia", "Atuação"], 0,[" instrumento musical", "presente de um admirador", "traje", "algibeira contendo 15 po "],
            ["Kit de disfarce", "instrumento musical"], 
            {
            nome: "PELA DEMANDA POPULAR",
            descricao: `
              Você sempre encontra um lugar para atuar, geralmente em tavernas ou estalagens mas, possivelmente em circos, teatros ou até em cortes nobres. Em tais lugares, você recebe alojamento e comida modesta ou de patrões confortáveis, de graça (dependendo da qualidade do estabelecimento), contanto que você atue a cada noite. Além disso, sua atuação torna você um tipo de figura local. Quando estranhos reconhecerem você em uma cidade em que você já tenha atuado, eles geralmente gostaram de você.
            `,
          })
    }
}