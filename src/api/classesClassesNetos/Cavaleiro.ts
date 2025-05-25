import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Cavaleiro extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Cavaleiro",
            "Guerreiros nobres especializados em combate montado e proteção de aliados. Mestres em controle de campo de batalha, usam táticas de cavalaria mesmo quando desmontados, marcando inimigos e protegendo os mais fracos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Bônus de Proficiência, Nascido Para a Sela, Marca Inabalável",
                nivel: 3,
                descricao: `
                    Bônus de Proficiência: Ganha proficiência em uma habilidade (Lidar com Animais, História, Intuição, Atuação ou Persuasão) ou um idioma.
                    
                    Nascido Para a Sela:
                    - Vantagem em testes para não cair da montaria
                    - Cair de até 3m = cair em pé (se não incapacitado)
                    - Montar/desmontar custa apenas 1.5m de movimento
                    
                    Marca Inabalável:
                    - Ao acertar ataque corpo-a-corpo, marca criatura até seu próximo turno
                    - Marcado tem desvantagem para atacar outros
                    - Se marcado ferir aliado: ação bônus para atacar com vantagem + dano extra (metade do nível)
                    - Usos = mod. Força (mínimo 1), recarrega em descanso longo
                `
            },
            {
                nome: "Manobra de Proteção",
                nivel: 7,
                descricao: `
                    Reação quando você ou aliado a 1.5m for atingido:
                    - Role 1d8 para aumentar CA contra o ataque
                    - Se ainda acertar, resistência ao dano
                    - Usos = mod. Constituição (mínimo 1), recarrega em descanso longo
                `
            },
            {
                nome: "Mantenha a Formação",
                nivel: 10,
                descricao: `
                    - Inimigos provocam ataque de oportunidade ao mover 1.5m+ dentro do seu alcance
                    - Ataque de oportunidade bem-sucedido reduz velocidade do alvo para 0 até fim do turno
                `
            },
            {
                nome: "Investida Feroz",
                nivel: 15,
                descricao: `
                    Ao mover 3m+ em linha reta e acertar ataque:
                    - Alvo faz teste de Força (CD 8 + proficiência + Força) ou cai no chão
                    - 1x/turno
                `
            },
            {
                nome: "Defensor Vigilante",
                nivel: 18,
                descricao: `
                    Reação especial em cada turno (exceto o seu):
                    - Pode fazer 1 ataque de oportunidade por turno de inimigo
                    - Não conta como reação normal
                `
            }
        ];
    }
}