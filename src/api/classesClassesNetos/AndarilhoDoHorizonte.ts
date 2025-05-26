import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class AndarilhoDoHorizonte extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Andarilho do Horizonte",
            "Patrulheiros que protegem o mundo material contra ameaças interplanares. Vigias de portais dimensionais que viajam entre planos para caçar criaturas de outros mundos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magia do Andarilho do Horizonte, Detectar Portais e Guerreiro Planar (1d8)",
                nivel: 3,
                descricao: `
                    Magias Adicionais:
                    - 3°: proteção contra o bem e mal
                    - 5°: passo nebuloso
                    - 9°: velocidade
                    - 13°: banimento
                    - 17°: círculo de teleporte
                    
                    Detectar Portais:
                    - Ação para detectar portal planar mais próximo em 1.5km
                    - Recarrega com descanso curto/longo
                    
                    Guerreiro Planar:
                    - Ação bônus: escolha criatura a 9m
                    - Próximo ataque nesse turno:
                      * Todo dano vira dano de energia
                      * +1d8 de dano de energia (aumenta para 2d8 no 11° nível)
                `
            },
            {
                nome: "Passo Etéreo",
                nivel: 7,
                descricao: `
                    - Ação bônus: conjura forma etérea (dura até fim do turno)
                    - Recarrega com descanso curto/longo
                `
            },
            {
                nome: "Ataque Distante e Guerreiro Planar (2d8)",
                nivel: 11,
                descricao: `
                    Ataque Distante:
                    - Ao atacar: pode teleportar 3m antes de cada ataque
                    - Se atacar 2+ criaturas diferentes: pode fazer 1 ataque adicional contra 3ª criatura
                    
                    Guerreiro Planar:
                    - Dano adicional aumenta para 2d8
                `
            },
            {
                nome: "Defesa Espectral",
                nivel: 15,
                descricao: `
                    - Reação ao sofrer dano: resistência a todo dano do ataque neste turno
                `
            }
        ];
    }
}