import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaForja extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Forja",
            "Clerigos que veneram deuses da metalurgia e artesanato, combinando criação divina com maestria marcial. Transformam metal bruto em armas sagradas e armaduras abençoadas, protegendo os fracos com fogo e aço."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias de Domínio, Proficiência Bônus, Benção da Forja",
                nivel: 1,
                descricao: `
                    Magias de Domínio: identificação, destruição lancinante (1°), esquentar metal, arma mágica (3°), proteção contra energia, arma elemental (5°), fabricar, muralha de fogo (7°), animar objetos, criação (9°).
                    
                    Proficiência Bônus: Armadura pesada e ferramentas de ferreiro.
                    
                    Benção da Forja: Após descanso longo, toque uma arma/armadura não-mágica para torná-la mágica (+1 CA ou +1 ataque/dano) até seu próximo descanso longo ou morte.
                `
            },
            {
                nome: "Canalizar Divindade: Benção do Artesão",
                nivel: 2,
                descricao: `
                    Ritual de 1 hora para criar item não-mágico contendo metal (arma, armadura, munição, ferramentas, etc.) até 100 po de valor. Requer metal equivalente em valor. Pode duplicar itens existentes.
                `
            },
            {
                nome: "Alma da Forja",
                nivel: 6,
                descricao: `
                    - Resistência a dano de fogo
                    - +1 de bônus em CA enquanto vestindo armadura pesada
                `
            },
            {
                nome: "Impacto Divino (1d8)",
                nivel: 8,
                descricao: `
                    1x/turno, adicione 1d8 de dano de fogo ao acertar um ataque com arma. Aumenta para 2d8 no 14° nível.
                `
            },
            {
                nome: "Santo da Forja e Fogo",
                nivel: 17,
                descricao: `
                    - Imunidade a dano de fogo
                    - Resistência a dano cortante, concussão e perfurante de ataques não-mágicos enquanto vestindo armadura pesada
                `
            }
        ];
    }
}