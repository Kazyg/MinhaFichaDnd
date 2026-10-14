import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { Campeao2024 } from "../classesClassesNetos/Campeao2024";
import { CavaleiroMistico2024 } from "../classesClassesNetos/CavaleiroMistico2024";
import { CombatentePsiquico2024 } from "../classesClassesNetos/CombatentePsiquico2024";
import { MestreDeBatalha2024 } from "../classesClassesNetos/MestreDeBatalha2024";

export class Lutador2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        recuperarFolego: number;
        maestriaArma: number;
        caracteristicas: string[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Guerreiro",
            10,
            ["Todas as armaduras", "escudos"],
            ["Armas simples", "armas marciais"],
            [""],
            ["Força", "Constituição"],
            2,
            ["Acrobacia", "Atletismo", "Adestrar Animais", "História", "Intimidação", "Intuição", "Percepção", "Sobrevivência"],
            ["Armadura leve", "armadura média", "escudos", "armas marciais"]
        );
        this.level = 0;
        this.niveis = this.preencherNiveis();
        this.subClasse = [new Campeao2024(), new CavaleiroMistico2024(), new CombatentePsiquico2024(), new MestreDeBatalha2024()];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        }
    }

    private preencherNiveis() {
        return [
            { nivel: 1, proeficiencia: 2, recuperarFolego: 2, maestriaArma: 3, caracteristicas: ["Estilo de Luta", "Maestria em Arma", "Recuperar Fôlego"] },
            { nivel: 2, proeficiencia: 2, recuperarFolego: 2, maestriaArma: 3, caracteristicas: ["Mente Tática", "Surto de Ação"] },
            { nivel: 3, proeficiencia: 2, recuperarFolego: 2, maestriaArma: 3, caracteristicas: ["Subclasse de Guerreiro"] },
            { nivel: 4, proeficiencia: 2, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 5, proeficiencia: 3, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Ajuste Tático", "Ataque Extra"] },
            { nivel: 6, proeficiencia: 3, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 7, proeficiencia: 3, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 8, proeficiencia: 3, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 9, proeficiencia: 4, recuperarFolego: 3, maestriaArma: 4, caracteristicas: ["Indomável", "Mestre Tático"] },
            { nivel: 10, proeficiencia: 4, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 11, proeficiencia: 4, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Dois Ataques Extras"] },
            { nivel: 12, proeficiencia: 4, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 13, proeficiencia: 5, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Ataques Estudados", "Indomável"] },
            { nivel: 14, proeficiencia: 5, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 15, proeficiencia: 5, recuperarFolego: 4, maestriaArma: 5, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 16, proeficiencia: 5, recuperarFolego: 4, maestriaArma: 6, caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 17, proeficiencia: 6, recuperarFolego: 4, maestriaArma: 6, caracteristicas: ["Indomável", "Surto de Ação"] },
            { nivel: 18, proeficiencia: 6, recuperarFolego: 4, maestriaArma: 6, caracteristicas: ["Característica de Subclasse"] },
            { nivel: 19, proeficiencia: 6, recuperarFolego: 4, maestriaArma: 6, caracteristicas: ["Dádiva Épica"] },
            { nivel: 20, proeficiencia: 6, recuperarFolego: 4, maestriaArma: 6, caracteristicas: ["Três Ataques Extras"] }
        ];
    }
}
