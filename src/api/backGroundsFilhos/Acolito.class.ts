import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Acolito extends BackGround {
    constructor() {
        super("acolito", ["Intuição", "Religião"], 2, ["símbolo sagrado", "livro de preces", "5 varetas de incenso", "vestimentas", "conjunto de roupas comuns", "algibeira contendo 15 po"],
            [],
            {
                nome: "ABRIGO DOS FIÉIS",
                descricao: `
              Como um acólito, você detém o respeito daqueles que compartilham de sua fé, e você pode realizar cerimônias de sua divindade. Você e seus companheiros de aventura podem até receber cura e caridade de um templo, santuário ou outro posto de sua fé, embora devam fornecer quaisquer componentes materiais necessários para as magias. Aqueles que compartilham de sua religião vão garantir a você (mas apenas você), custeando um estilo de vida modesto.
          
              Você também pode possuir laços com um templo específico devotado à sua divindade ou panteão, e fixar residência nele. Pode ser o templo que você está acostumado a servir, se ainda tiver boas relações com ele, ou um templo no qual você encontrou um novo lar. Enquanto frequentar as redondezas desse templo, você pode solicitar os sacerdotes para assisti-lo, desde que essa assistência não seja de alguma forma perigosa e que você sempre esteja em uma boa relação com seu templo.
            `,
            })
    }
}