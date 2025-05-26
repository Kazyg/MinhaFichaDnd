import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class PerseguidorObscuro extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Perseguidor Obscuro",
            "Patrulheiros que prosperam nas sombras, especialistas em emboscadas e caçadas nas trevas. Guardiões que protegem o mundo das ameaças que se escondem na escuridão."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magia do Perseguidor Obscuro, Emboscador Terrível e Visão Umbral",
                nivel: 3,
                descricao: `
                    Magias Adicionais:
                    - 3°: disfarçar
                    - 5°: truque de corda
                    - 9°: medo
                    - 13°: invisibilidade maior
                    - 17°: similaridade
                    
                    Emboscador Terrível:
                    - Bônus de iniciativa = mod. Sabedoria
                    - 1° turno de combate: +3m de deslocamento
                    - Se atacar no 1° turno: ataque adicional com +1d8 de dano
                    
                    Visão Umbral:
                    - Visão no escuro 18m (ou +9m se já tiver)
                    - Nas trevas: invisível para criaturas com visão no escuro
                `
            },
            {
                nome: "Mente de Ferro",
                nivel: 7,
                descricao: `
                    - Proficiência em testes de Sabedoria
                    - Se já tiver: proficiencia em Inteligência ou Carisma
                `
            },
            {
                nome: "Agitação Perseguidora",
                nivel: 11,
                descricao: `
                    - 1x/turno: ao errar ataque com arma, pode tentar novamente
                `
            },
            {
                nome: "Evasiva Sombria",
                nivel: 15,
                descricao: `
                    - Reação quando atacado sem vantagem: impõe desvantagem no ataque
                    - Deve usar antes de saber o resultado
                `
            }
        ];
    }
}