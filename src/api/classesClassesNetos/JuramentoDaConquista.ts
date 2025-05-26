import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class JuramentoDaConquista extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Juramento da Conquista",
            "Paladinos que buscam dominar e subjugar seus inimigos através do medo e força implacável. Cavaleiros tirânicos que esmagam a esperança e governam com punho de ferro."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias de Juramento e Canalizar Divindade",
                nivel: 3,
                descricao: `
                    Magias de Juramento:
                    - 3°: armadura de agathys, comando
                    - 7°: imobilizar pessoa, arma espiritual
                    - 15°: rogar maldição, medo
                    - 18°: dominar besta, pele rochosa
                    - 20°: névoa mortal, dominar pessoa
                    
                    Canalizar Divindade:
                    - Presença Conquistadora: Ação para forçar criaturas a 9m a teste de Sabedoria ou ficam amedrontadas por 1 minuto
                    - Ataque Guiado: +10 em uma rolagem de ataque (pode decidir após ver o resultado)
                `
            },
            {
                nome: "Aura da Conquista (3m)",
                nivel: 7,
                descricao: `
                    - Aura de 3m (aumenta para 9m no 18° nível)
                    - Criaturas amedrontadas na aura:
                      * Velocidade reduzida a 0
                      * Toma dano psíquico = metade do nível de paladino ao iniciar turno na aura
                `
            },
            {
                nome: "Repreensão Arrogante",
                nivel: 15,
                descricao: `
                    - Quando atingido: atacante toma dano psíquico = mod. Carisma (mínimo 1)
                `
            },
            {
                nome: "Conquistador Invencível",
                nivel: 20,
                descricao: `
                    - Ação para ativar por 1 minuto:
                      * Resistência a todo dano
                      * Ataques extras ao usar ação de Ataque
                      * Crítico em 19-20
                    - Recarrega com descanso longo
                `
            }
        ];
    }
}