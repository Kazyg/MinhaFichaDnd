import { BackGround } from "../classesPrincipais/BackGrounds.class.ts"

export class Eremita extends BackGround {
    constructor() {
        super("eremita", ["Medicina", "Religião"], 1, ["estojo de pergaminho cheio de notas dos seus estudos e orações", "cobertor de inverno", "conjunto de roupas comuns", "kit de herbalismo", "5 po"],
            ["Kit de herbalismo"],
            {
                nome: "DESCOBERTA",
                descricao: `
                  A calma reclusão do seu eremitério prolongado lhe deu acesso a descobertas únicas e poderosas. A natureza exata dessas revelações depende da natureza da sua reclusão. Poderia ser uma grande verdade sobre o cosmos, os deuses, os poderosos seres de outros planos ou as forças da natureza. Poderia ser um local nunca visto por mais ninguém. Você pode ter descoberto um fato que há muito foi esquecido, ou desenterrado uma relíquia do passado que poderia reescrever a história. Poderia ser uma informação que seria prejudicial para as pessoas responsáveis pelo seu exílio, consequentemente, a razão que fez você voltar para a sociedade.
            
                  Converse com o Mestre para determinar os detalhes da sua descoberta e o impacto na campanha.
                `,
            })
    }
}