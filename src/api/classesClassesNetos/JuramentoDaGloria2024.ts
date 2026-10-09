import { SubClasses } from "../classesPrincipais/SubClasses";

export class JuramentoDaGloria2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Juramento da Glória", "Paladinos do Juramento da Glória acreditam que eles e seus companheiros estão destinados à glória por meio de atos heroicos.");
        this.niveis = [
            { nome: "Atleta Inigualável", nivel: 3, descricao: "Como uma Ação Bônus, você pode gastar um uso de Canalizar Divindade para aprimorar seu atletismo por 1 hora. Você tem Vantagem em testes de Força (Atletismo) e Destreza (Acrobacia), e a distância de seus Saltos Longos e Saltos em Altura aumenta em 3 metros." },
            { nome: "Destruição Inspiradora", nivel: 3, descricao: "Imediatamente após conjurar Destruição Divina, você pode gastar um uso de Canalizar Divindade e distribuir Pontos de Vida Temporários para criaturas à sua escolha a até 9 metros, incluindo você. O total é igual a 2d8 mais seu nível de Paladino, dividido como preferir." },
            { nome: "Magias do Juramento da Glória", nivel: 3, descricao: "Você sempre tem preparadas as magias do juramento conforme seu nível de Paladino: nível 3, Heroísmo e Raio Guia; nível 5, Aprimorar Atributo e Arma Mágica; nível 9, Celeridade e Proteção contra Energia; nível 13, Compulsão e Movimentação Livre; nível 17, Lendas e Histórias e Presença Régia de Yolande." },
            { nome: "Aura de Vivacidade", nivel: 7, descricao: "Seu Deslocamento aumenta em 3 metros. Além disso, sempre que um aliado entra em sua Aura de Proteção pela primeira vez em um turno ou inicia o turno nela, o Deslocamento dele aumenta em 3 metros até o final do próximo turno dele." },
            { nome: "Defesa Gloriosa", nivel: 15, descricao: "Quando você ou outra criatura à sua vista a até 3 metros é atingida por uma jogada de ataque, você pode executar uma Reação para conceder bônus à CA do alvo contra esse ataque igual ao seu modificador de Carisma, mínimo +1. Se o ataque falhar, você pode realizar um ataque com arma contra o atacante como parte da Reação se ele estiver no alcance. Você pode usar esta característica um número de vezes igual ao seu modificador de Carisma, mínimo uma vez, e recupera todos os usos no Descanso Longo." },
            { nome: "Lenda Viva", nivel: 20, descricao: "Como uma Ação Bônus, você recebe por 10 minutos Vantagem em todos os testes de Carisma, pode transformar um erro com ataque de arma em acerto uma vez por turno, e pode usar sua Reação para jogar novamente uma salvaguarda falha, usando o novo resultado. Você recupera o uso ao completar Descanso Longo ou gastando um espaço de magia de 5º círculo." }
        ];
    }
}
