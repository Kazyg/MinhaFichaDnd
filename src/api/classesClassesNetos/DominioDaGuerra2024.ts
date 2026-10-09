import { SubClasses } from "../classesPrincipais/SubClasses";

export class DominioDaGuerra2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Domínio da Guerra", "Clérigos do Domínio da Guerra se destacam em batalhas, inspirando outros a lutar pelo bem ou convertendo atos de violência em orações.");
        this.niveis = [
            {
                nome: "Magias de Domínio da Guerra",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Arma Espiritual, Arma Mágica, Escudo da Fé e Raio Guia; no nível 5, Guardiões Espirituais e Manto do Cruzado; no nível 7, Escudo Ardente e Movimentação Livre; no nível 9, Golpe de Aço e Paralisar Monstro."
            },
            {
                nome: "Ataque Direcionado",
                nivel: 3,
                descricao: "Quando você ou uma criatura a até 9 metros erra uma jogada de ataque, você pode gastar um uso de Canalizar Divindade para conceder +10 à jogada, potencialmente transformando o erro em acerto. Para conceder o bônus a outra criatura, você usa sua Reação."
            },
            {
                nome: "Sacerdote da Guerra",
                nivel: 3,
                descricao: "Como Ação Bônus, você pode realizar um ataque com uma arma ou Ataque Desarmado. Você pode usar essa Ação Bônus um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, e recupera todos os usos gastos ao completar Descanso Curto ou Longo."
            },
            {
                nome: "Bênção do Deus da Guerra",
                nivel: 6,
                descricao: "Você pode gastar um uso de Canalizar Divindade para conjurar Arma Espiritual ou Escudo da Fé em vez de gastar espaço de magia. A magia conjurada dessa forma não requer Concentração e dura 1 minuto, encerrando se você conjurá-la novamente, ficar Incapacitado ou morrer."
            },
            {
                nome: "Avatar da Guerra",
                nivel: 17,
                descricao: "Você adquire Resistência a dano Contundente, Cortante e Perfurante."
            }
        ];
    }
}
