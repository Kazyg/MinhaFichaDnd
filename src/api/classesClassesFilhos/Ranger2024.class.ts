import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { AndarilhoFeerico2024 } from "../classesClassesNetos/AndarilhoFeerico2024";
import { Cacador2024 } from "../classesClassesNetos/Cacador2024";
import { SenhorDasFeras2024 } from "../classesClassesNetos/SenhorDasFeras2024";
import { VigilanteDasSombras2024 } from "../classesClassesNetos/VigilanteDasSombras2024";

export class Ranger2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        caracteristicas: string[];
        inimigoFavorito: number;
        magiasConhecidas: number;
        espacosMagia: number[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Patrulheiro",
            10,
            ["Armadura leve", "armadura média", "escudos"],
            ["Armas simples", "armas marciais"],
            [],
            ["Força", "Destreza"],
            3,
            ["Atletismo", "Furtividade", "Adestrar Animais", "Intuição", "Investigação", "Natureza", "Percepção", "Sobrevivência"],
            ["Armadura leve", "armadura média", "escudos", "armas marciais"]
        );
        this.level = 0;
        this.niveis = [
            { nivel: 1, proeficiencia: 2, caracteristicas: ["Conjuração de Guardião", "Inimigo Favorito", "Maestria em Arma"], inimigoFavorito: 2, magiasConhecidas: 2, espacosMagia: [2, 0, 0, 0, 0] },
            { nivel: 2, proeficiencia: 2, caracteristicas: ["Estilo de Luta Guardião", "Explorador Hábil"], inimigoFavorito: 2, magiasConhecidas: 3, espacosMagia: [2, 0, 0, 0, 0] },
            { nivel: 3, proeficiencia: 2, caracteristicas: ["Subclasse de Guardião"], inimigoFavorito: 2, magiasConhecidas: 4, espacosMagia: [3, 0, 0, 0, 0] },
            { nivel: 4, proeficiencia: 2, caracteristicas: ["Aumento no Valor de Atributo"], inimigoFavorito: 2, magiasConhecidas: 5, espacosMagia: [3, 0, 0, 0, 0] },
            { nivel: 5, proeficiencia: 3, caracteristicas: ["Ataque Extra"], inimigoFavorito: 3, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0] },
            { nivel: 6, proeficiencia: 3, caracteristicas: ["Errante"], inimigoFavorito: 3, magiasConhecidas: 6, espacosMagia: [4, 2, 0, 0, 0] },
            { nivel: 7, proeficiencia: 3, caracteristicas: ["Característica de Subclasse"], inimigoFavorito: 3, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0] },
            { nivel: 8, proeficiencia: 3, caracteristicas: ["Aumento no Valor de Atributo"], inimigoFavorito: 3, magiasConhecidas: 7, espacosMagia: [4, 3, 0, 0, 0] },
            { nivel: 9, proeficiencia: 4, caracteristicas: ["Especialista"], inimigoFavorito: 4, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0] },
            { nivel: 10, proeficiencia: 4, caracteristicas: ["Incansável"], inimigoFavorito: 4, magiasConhecidas: 9, espacosMagia: [4, 3, 2, 0, 0] },
            { nivel: 11, proeficiencia: 4, caracteristicas: ["Característica de Subclasse"], inimigoFavorito: 4, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0] },
            { nivel: 12, proeficiencia: 4, caracteristicas: ["Aumento no Valor de Atributo"], inimigoFavorito: 4, magiasConhecidas: 10, espacosMagia: [4, 3, 3, 0, 0] },
            { nivel: 13, proeficiencia: 5, caracteristicas: ["Predador Implacável"], inimigoFavorito: 5, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0] },
            { nivel: 14, proeficiencia: 5, caracteristicas: ["Véu da Natureza"], inimigoFavorito: 5, magiasConhecidas: 11, espacosMagia: [4, 3, 3, 1, 0] },
            { nivel: 15, proeficiencia: 5, caracteristicas: ["Característica de Subclasse"], inimigoFavorito: 5, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0] },
            { nivel: 16, proeficiencia: 5, caracteristicas: ["Aumento no Valor de Atributo"], inimigoFavorito: 5, magiasConhecidas: 12, espacosMagia: [4, 3, 3, 2, 0] },
            { nivel: 17, proeficiencia: 6, caracteristicas: ["Caçador Preciso"], inimigoFavorito: 6, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1] },
            { nivel: 18, proeficiencia: 6, caracteristicas: ["Sentidos Selvagens"], inimigoFavorito: 6, magiasConhecidas: 14, espacosMagia: [4, 3, 3, 3, 1] },
            { nivel: 19, proeficiencia: 6, caracteristicas: ["Dádiva Épica"], inimigoFavorito: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2] },
            { nivel: 20, proeficiencia: 6, caracteristicas: ["Matador de Inimigos Favoritos"], inimigoFavorito: 6, magiasConhecidas: 15, espacosMagia: [4, 3, 3, 3, 2] }
        ];
        this.subClasse = [
            new AndarilhoFeerico2024(),
            new Cacador2024(),
            new SenhorDasFeras2024(),
            new VigilanteDasSombras2024()
        ];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        } else {
            console.log("O guardião já atingiu o nível máximo (20).");
        }
    }
}
