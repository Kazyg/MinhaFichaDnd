import { SubClasses } from "../classesPrincipais/SubClasses";

export class TrilhaDoCoracaoSelvagem extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Trilha do Coração Selvagem", "Bárbaros que seguem a Trilha do Coração Selvagem se consideram parentes dos animais, aprendendo meios mágicos de se comunicar com eles e canalizar seu poder sobrenatural.");
        this.niveis = [
            {
                nome: "Arauto da Fauna",
                nivel: 3,
                descricao: "Você pode conjurar as magias Falar com Animais e Sentido Feral, mas apenas como Rituais. Sabedoria é seu atributo de conjuração para elas."
            },
            {
                nome: "Fúria dos Selvagens",
                nivel: 3,
                descricao: "Sempre que você ativar sua Fúria, escolha Águia, Lobo ou Urso. Águia permite Correr e Desengajar como parte da Ação Bônus de Fúria e depois como Ação Bônus enquanto a Fúria durar. Lobo concede Vantagem aos aliados em ataques contra inimigos seus a até 1,5 metro. Urso concede Resistência a todos os tipos de dano, exceto Energético, Necrótico, Psíquico e Radiante."
            },
            {
                nome: "Aspecto dos Selvagens",
                nivel: 6,
                descricao: "Você recebe uma opção à sua escolha, alterável ao completar Descanso Longo. Coruja concede Visão no Escuro de 18 metros ou aumenta a existente em 18 metros. Pantera concede Deslocamento de Escalada igual ao seu Deslocamento. Salmão concede Deslocamento de Natação igual ao seu Deslocamento."
            },
            {
                nome: "Arauto da Natureza",
                nivel: 10,
                descricao: "Você pode conjurar Comunhão com a Natureza, mas apenas como Ritual. Sabedoria é seu atributo de conjuração para isso."
            },
            {
                nome: "Poder dos Selvagens",
                nivel: 14,
                descricao: "Sempre que ativar sua Fúria, escolha Carneiro, Falcão ou Leão. Carneiro permite impor Caído a uma criatura Grande ou menor quando você a atinge com ataque corpo a corpo. Falcão concede Deslocamento de Voo igual ao seu Deslocamento se não estiver usando armadura. Leão impõe Desvantagem a inimigos a até 1,5 metro em ataques contra alvos que não sejam você ou outro Bárbaro com essa opção."
            }
        ];
    }
}
