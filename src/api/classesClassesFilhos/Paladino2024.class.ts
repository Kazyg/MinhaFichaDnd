import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { JuramentoDaDevocao2024 } from "../classesClassesNetos/JuramentoDaDevocao2024";
import { JuramentoDaGloria2024 } from "../classesClassesNetos/JuramentoDaGloria2024";
import { JuramentoDaVinganca2024 } from "../classesClassesNetos/JuramentoDaVinganca2024";
import { JuramentoDosAncioes2024 } from "../classesClassesNetos/JuramentoDosAncioes2024";

export class Paladino2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        canalizarDivindade: number;
        magiasConhecidas: number;
        espacosMagia: number[];
        maestriaArma: number;
        caracteristicas: string[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Paladino",
            10,
            ["Armadura leve", "armadura média", "armadura pesada", "escudos"],
            ["Armas simples", "armas marciais"],
            [],
            ["Sabedoria", "Carisma"],
            2,
            ["Atletismo", "Intimidação", "Intuição", "Medicina", "Persuasão", "Religião"],
            ["Armadura leve", "armadura média", "escudos", "armas marciais"]
        );
        this.level = 0;
        this.niveis = this.preencherNiveis();
        this.subClasse = [new JuramentoDaDevocao2024(), new JuramentoDaGloria2024(), new JuramentoDaVinganca2024(), new JuramentoDosAncioes2024()];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        }
    }

    private preencherNiveis() {
        return [
            { nivel: 1, proeficiencia: 2, canalizarDivindade: 0, magiasConhecidas: 2, espacosMagia: [2, 0, 0, 0, 0], maestriaArma: 2, caracteristicas: ["Conjuração", "Maestria em Arma", "Mãos Consagradas"] },
            { nivel: 2, proeficiencia: 2, canalizarDivindade: 0, magiasConhecidas: 3, espacosMagia: [2, 0, 0, 0, 0], maestriaArma: 2, caracteristicas: ["Destruição do Paladino", "Estilo de Luta"] },
            { nivel: 3, proeficiencia: 2, canalizarDivindade: 2, magiasConhecidas: 4, espacosMagia: [3, 0, 0, 0, 0], maestriaArma: 2, caracteristicas: ["Canalizar Divindade", "Subclasse de Paladino"] },
            { nivel: 4, proeficiencia: 2, canalizarDivindade: 2, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0], maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 5, proeficiencia: 3, canalizarDivindade: 2, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0], maestriaArma: 3, caracteristicas: ["Ataque Extra", "Montaria Fiel"] },
            { nivel: 6, proeficiencia: 3, canalizarDivindade: 2, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0], maestriaArma: 3, caracteristicas: ["Aura de Proteção"] },
            { nivel: 7, proeficiencia: 3, canalizarDivindade: 2, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0], maestriaArma: 3, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 8, proeficiencia: 3, canalizarDivindade: 2, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0], maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 9, proeficiencia: 4, canalizarDivindade: 2, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0], maestriaArma: 3, caracteristicas: ["Repudiar Inimigos"] },
            { nivel: 10, proeficiencia: 4, canalizarDivindade: 2, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0], maestriaArma: 3, caracteristicas: ["Aura de Coragem"] },
            { nivel: 11, proeficiencia: 4, canalizarDivindade: 3, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0], maestriaArma: 3, caracteristicas: ["Golpes Radiantes"] },
            { nivel: 12, proeficiencia: 4, canalizarDivindade: 3, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0], maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 13, proeficiencia: 5, canalizarDivindade: 3, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0], maestriaArma: 3, caracteristicas: [] },
            { nivel: 14, proeficiencia: 5, canalizarDivindade: 3, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0], maestriaArma: 3, caracteristicas: ["Toque Restaurador"] },
            { nivel: 15, proeficiencia: 5, canalizarDivindade: 3, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0], maestriaArma: 3, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 16, proeficiencia: 5, canalizarDivindade: 3, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0], maestriaArma: 3, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 17, proeficiencia: 6, canalizarDivindade: 3, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1], maestriaArma: 3, caracteristicas: [] },
            { nivel: 18, proeficiencia: 6, canalizarDivindade: 3, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1], maestriaArma: 3, caracteristicas: ["Aura Expandida"] },
            { nivel: 19, proeficiencia: 6, canalizarDivindade: 3, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2], maestriaArma: 3, caracteristicas: ["Dádiva Épica"] },
            { nivel: 20, proeficiencia: 6, canalizarDivindade: 3, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2], maestriaArma: 3, caracteristicas: ["Característica de Subclasse"] }
        ];
    }
}
