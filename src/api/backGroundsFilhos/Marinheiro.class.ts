import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Marinheiro extends BackGround {
    constructor() {
        super("marinheiro", ["Atletismo", "Percepção"], 0, ["malagueta (clava)", "15 metros de corda de seda", "amuleto da sorte", "conjunto de trajes comuns", "algibeira contendo 10 po"],
            ["Ferramentas do navegador", "veículos (aquático)"],
            {
                "nome": "Passagem de Navio",
                "descricao": "Quando você precisar, você pode conseguir passagem de graça em um navio para você e seus companheiros de aventura. Você precisa viajar no navio em que você trabalhou ou em outro navio com o qual você teve boas relações (talvez um comandado por um ex-companheiro de tripulação). Por ser um favor, você não pode solicitar uma programação ou rota que atenda a todas as suas necessidades. Seu Mestre determina quanto tempo levará para chegar aonde você quer ir. Em troca da passagem grátis, espera-se que você e seus companheiros ajudem a tripulação durante a viagem."
            })
    }
}