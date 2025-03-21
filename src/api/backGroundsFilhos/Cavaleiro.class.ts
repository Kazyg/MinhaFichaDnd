import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Cavaleiro extends BackGround {
    constructor() {
        super("cavaleiro", ["História", "Persuasão"], 2, ["sela (montaria)", "cavalo de montaria", "roupas de viajante"],
            ["Ferramentas de curtidor de couro", "Veículos (terrestres)"],
            {
                nome: "UMA MONTARIA POR OUTRO NOME",
                descricao: `
                  Embora você comece com um cavalo como montaria, certos terrenos exigirão diferentes meios de transporte. Você é capaz de adaptar as habilidades que aprendeu com cavalos para montar criaturas mais exóticas. Como cavaleiro, nenhuma montaria o intimida. Além disso, sua capacidade de lutar enquanto montado não é afetada pela criatura que estiver montando no momento.
                `,
            })
    }
}