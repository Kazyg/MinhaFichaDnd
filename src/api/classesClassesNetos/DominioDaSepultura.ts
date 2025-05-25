import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaSepultura extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Sepultura",
            "Clerigos que guardam a fronteira entre vida e morte, assegurando o ciclo natural e combatendo os mortos-vivos. Manipulam a energia vital para proteger os moribundos e punir aqueles que perturbam o descanso eterno."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias de Domínio, Círculo da Mortalidade, Olhos da Sepultura",
                nivel: 1,
                descricao: `
                    Magias de Domínio: falsa vitalidade, perdição (1°), raio do enfraquecimento, repouso tranquilo (3°), revivificar, toque vampírico (5°), malogro, proteger contra a morte (7°), cúpula antivida, reviver os mortos (9°).
                    
                    Círculo da Mortalidade:
                    - Maximiza dados de cura em criaturas com 0 PV
                    - Aprende truque estabilizar (9m de alcance, pode conjurar como ação bônus)
                    
                    Olhos da Sepultura: Como ação, detecte mortos-vivos em 18m por 1 rodada. Usos = mod. Sabedoria (mínimo 1), recarrega em descanso longo.
                `
            },
            {
                nome: "Canalizar Divindade: Caminho da Sepultura",
                nivel: 2,
                descricao: `
                    Como ação, amaldiçoe criatura a 9m até fim da próxima rodada. Próximo ataque contra ela causa dano com vulnerabilidade (dobrado).
                `
            },
            {
                nome: "Sentinela na Porta da Morte",
                nivel: 6,
                descricao: `
                    Como reação, transforme acerto crítico contra você ou aliado a 9m em acerto normal. Usos = mod. Sabedoria (mínimo 1), recarrega em descanso longo.
                `
            },
            {
                nome: "Conjuração Potente",
                nivel: 8,
                descricao: `
                    Adicione seu modificador de Sabedoria ao dano causado por qualquer truque.
                `
            },
            {
                nome: "Guardião das Almas",
                nivel: 17,
                descricao: `
                    Quando inimigo morre a 18m, você ou aliado a 18m recupera PV = dados de vida do inimigo. 1x/rodada, não pode usar incapacitado.
                `
            }
        ];
    }
}