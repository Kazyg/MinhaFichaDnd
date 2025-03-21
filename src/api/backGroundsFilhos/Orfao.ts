import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Orfao extends BackGround {
    constructor() {
        super("Orfão", ["Furtividade", "Prestidigitação"], 0, ["faca pequena", "mapa da cidade", "rato de estimação", "pequeno objeto para lembrar dos seus pais", "conjunto de roupas comuns", "algibeira contendo 10 po"],
            ["Kit de disfarce", "ferramentas de ladrão"],
            {
                nome: "SEGREDOS DA CIDADE",
                descricao: `
                  Você conhece os padrões secretos e o fluxo das cidades e pode encontrar passagens através da expansão urbana que os outros deixariam passar. Quando você não estiver em combate, você (e os companheiros que você guiar) podem viajar entre dois locais quaisquer na cidade com o dobro da velocidade normalmente permitida.
                `,
            })
    }
}