import { Classes } from "../classesPrincipais/Classes.class";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { CombatenteDaMaoEspalmada2024 } from "../classesClassesNetos/CombatenteDaMaoEspalmada2024";
import { CombatenteDaMisericordia2024 } from "../classesClassesNetos/CombatenteDaMisericordia2024";
import { CombatenteDasSombras2024 } from "../classesClassesNetos/CombatenteDasSombras2024";
import { CombatenteDosElementos2024 } from "../classesClassesNetos/CombatenteDosElementos2024";

export class Monge2024 extends Classes {
    level: number;
    niveis: {
        nivel: number;
        proeficiencia: number;
        artesMarciais: string;
        pontosFoco: number;
        deslocamento: string;
        caracteristicas: string[];
    }[];
    subClasse: SubClasses[];

    constructor() {
        super(
            "Monge",
            8,
            [],
            ["Armas simples corpo a corpo", "armas marciais corpo a corpo com propriedade Leve"],
            [],
            ["Força", "Destreza"],
            2,
            ["Acrobacia", "Atletismo", "Furtividade", "História", "Intuição", "Religião"],
            []
        );
        this.level = 0;
        this.niveis = this.preencherNiveis();
        this.subClasse = [new CombatenteDaMaoEspalmada2024(), new CombatenteDaMisericordia2024(), new CombatenteDasSombras2024(), new CombatenteDosElementos2024()];
    }

    aumentarNivel(): void {
        if (this.level < 20) {
            this.level += 1;
        }
    }

    private preencherNiveis() {
        return [
            { nivel: 1, proeficiencia: 2, artesMarciais: "1d6", pontosFoco: 0, deslocamento: "+0m", caracteristicas: ["Artes Marciais", "Defesa sem Armadura"] },
            { nivel: 2, proeficiencia: 2, artesMarciais: "1d6", pontosFoco: 2, deslocamento: "+3m", caracteristicas: ["Foco do Monge", "Movimento sem Armadura", "Metabolismo Incomum"] },
            { nivel: 3, proeficiencia: 2, artesMarciais: "1d6", pontosFoco: 3, deslocamento: "+3m", caracteristicas: ["Defletir Ataques", "Subclasse de Monge"] },
            { nivel: 4, proeficiencia: 2, artesMarciais: "1d6", pontosFoco: 4, deslocamento: "+3m", caracteristicas: ["Aumento no Valor de Atributo", "Queda Lenta"] },
            { nivel: 5, proeficiencia: 3, artesMarciais: "1d8", pontosFoco: 5, deslocamento: "+3m", caracteristicas: ["Ataque Extra", "Golpe Atordoante"] },
            { nivel: 6, proeficiencia: 3, artesMarciais: "1d8", pontosFoco: 6, deslocamento: "+4.5m", caracteristicas: ["Ataques Potencializados", "Característica de Subclasse"] },
            { nivel: 7, proeficiencia: 3, artesMarciais: "1d8", pontosFoco: 7, deslocamento: "+4.5m", caracteristicas: ["Evasão"] },
            { nivel: 8, proeficiencia: 3, artesMarciais: "1d8", pontosFoco: 8, deslocamento: "+4.5m", caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 9, proeficiencia: 4, artesMarciais: "1d8", pontosFoco: 9, deslocamento: "+4.5m", caracteristicas: ["Movimento Acrobático"] },
            { nivel: 10, proeficiencia: 4, artesMarciais: "1d8", pontosFoco: 10, deslocamento: "+6m", caracteristicas: ["Restauro Pessoal", "Foco Aprimorado"] },
            { nivel: 11, proeficiencia: 4, artesMarciais: "1d10", pontosFoco: 11, deslocamento: "+6m", caracteristicas: ["Característica de Subclasse"] },
            { nivel: 12, proeficiencia: 4, artesMarciais: "1d10", pontosFoco: 12, deslocamento: "+6m", caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 13, proeficiencia: 5, artesMarciais: "1d10", pontosFoco: 13, deslocamento: "+6m", caracteristicas: ["Defletir Energia"] },
            { nivel: 14, proeficiencia: 5, artesMarciais: "1d10", pontosFoco: 14, deslocamento: "+7.5m", caracteristicas: ["Sobrevivente Disciplinado"] },
            { nivel: 15, proeficiencia: 5, artesMarciais: "1d10", pontosFoco: 15, deslocamento: "+7.5m", caracteristicas: ["Foco Perfeito"] },
            { nivel: 16, proeficiencia: 5, artesMarciais: "1d10", pontosFoco: 16, deslocamento: "+7.5m", caracteristicas: ["Aumento no Valor de Atributo"] },
            { nivel: 17, proeficiencia: 6, artesMarciais: "1d12", pontosFoco: 17, deslocamento: "+7.5m", caracteristicas: ["Característica de Subclasse"] },
            { nivel: 18, proeficiencia: 6, artesMarciais: "1d12", pontosFoco: 18, deslocamento: "+9m", caracteristicas: ["Defesa Superior"] },
            { nivel: 19, proeficiencia: 6, artesMarciais: "1d12", pontosFoco: 19, deslocamento: "+9m", caracteristicas: ["Dádiva Épica"] },
            { nivel: 20, proeficiencia: 6, artesMarciais: "1d12", pontosFoco: 20, deslocamento: "+9m", caracteristicas: ["Corpo e Mente"] }
        ];
    }
}
