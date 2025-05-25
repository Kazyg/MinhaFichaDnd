import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Batedor extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Batedor",
            "Especialistas em sobrevivência e furtividade em ambientes selvagens. Patrulheiros, caçadores e emboscadores que se movem como sombras pela natureza."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Escaramuça e Sobrevivente",
                nivel: 3,
                descricao: `
                    Escaramuça:
                    - Reação quando inimigo termina turno a 1.5m: move metade do deslocamento sem provocar ataques de oportunidade
                    
                    Sobrevivente:
                    - Proficiência em Natureza e Sobrevivência
                    - Bônus de proficiência dobrado para essas perícias
                `
            },
            {
                nome: "Mobilidade Superior",
                nivel: 9,
                descricao: `
                    - +3m no deslocamento de caminhada
                    - Aplica-se também a deslocamento de escalada/natação se tiver
                `
            },
            {
                nome: "Mestre da Emboscada",
                nivel: 13,
                descricao: `
                    - Vantagem em testes de iniciativa
                    - Primeiro alvo atingido na 1° rodada: ataques contra ele têm vantagem até seu próximo turno
                `
            },
            {
                nome: "Golpe Súbito",
                nivel: 17,
                descricao: `
                    Ao usar ação Ataque:
                    - Ação bônus para ataque adicional
                    - Pode usar Ataque Furtivo novamente (se for o único ataque contra esse alvo no turno)
                `
            }
        ];
    }
}