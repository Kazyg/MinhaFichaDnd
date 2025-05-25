import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ColegioDosSussurros extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Colégio dos Sussurros",
            "Bardos que usam sua arte como arma psicológica, extraindo segredos e manipulando mentes. Lobos em pele de ovelha que se infiltram em círculos de poder para extorquir e controlar através do medo e informação."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Lâminas Psíquicas e Palavras de Terror",
                nivel: 3,
                descricao: `
                    Lâminas Psíquicas: Ao acertar um ataque de arma, gaste 1 Inspiração para causar 2d6 de dano psíquico extra (1x/turno). Aumenta para 3d6 (5°), 5d6 (10°) e 8d6 (15°).
                    
                    Palavras de Terror: Após 1 minuto de conversa privada, force teste de Sabedoria (CD magia) ou alvo ficará amedrontado por 1 hora (você ou criatura escolhida). Recarrega com descanso curto/longo.
                `
            },
            {
                nome: "Manto de Sussurros",
                nivel: 6,
                descricao: `
                    Quando humanoide morre a 9m, use reação para capturar sua sombra. Como ação, transforme-se na pessoa morta por 1 hora (ou ação bônus para terminar). 
                    Acesso a informações básicas da vida do alvo. +5 em Enganação contra Percepção para manter disfarce. Recarrega com descanso curto/longo.
                `
            },
            {
                nome: "Conhecimento das Sombras",
                nivel: 14,
                descricao: `
                    Como ação, sussurre magicamente para uma criatura a 9m (deve entender sua língua). Teste de Sabedoria (CD magia) ou ficará encantado por 8h, convencido que você sabe seu segredo mais profundo. 
                    Obedecerá comandos não-ameaçadores por medo de exposição. Efeito termina se for atacado ou forçado a teste. Recarrega com descanso longo.
                `
            }
        ];
    }
}