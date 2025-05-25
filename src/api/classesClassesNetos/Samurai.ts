import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Samurai extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Samurai",
            "Guerreiros de espírito indomável que combinam disciplina marcial com elegância social. Sua determinação inabalável lhes permite superar desafios que derrubariam guerreiros comuns."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Bônus de Proficiência e Espírito Guerreiro (5 PV Temp)",
                nivel: 3,
                descricao: `
                    Bônus de Proficiência: Ganha proficiência em História, Intuição, Atuação ou Persuasão, ou um idioma.
                    
                    Espírito Guerreiro:
                    - Ação bônus: vantagem em ataques com armas até fim do turno + 5 PV temporários
                    - 3 usos, recarrega em descanso longo
                    - PV temporários aumentam para 10 (10° nível) e 15 (15° nível)
                `
            },
            {
                nome: "Cortesão Elegante",
                nivel: 7,
                descricao: `
                    - Bônus em Persuasão = mod. Sabedoria
                    - Proficiência em testes de resistência de Sabedoria (ou Inteligência/Carisma se já tiver)
                `
            },
            {
                nome: "Espírito Incansável e Espírito Guerreiro (10 PV Temp)",
                nivel: 10,
                descricao: `
                    Espírito Incansável: Se iniciar combate sem usos de Espírito Guerreiro, recupera 1 uso
                    
                    Espírito Guerreiro: Agora concede 10 PV temporários
                `
            },
            {
                nome: "Golpe Rápido e Espírito Guerreiro (15 PV Temp)",
                nivel: 15,
                descricao: `
                    Golpe Rápido: Ao fazer Ataque com vantagem, pode renunciar à vantagem para fazer 1 ataque adicional (1x/turno)
                    
                    Espírito Guerreiro: Agora concede 15 PV temporários
                `
            },
            {
                nome: "Força Diante da Morte",
                nivel: 18,
                descricao: `
                    Reação ao ser reduzido a 0 PV (sem morrer):
                    - Ganha 1 turno extra imediatamente
                    - Durante turno extra em 0 PV: dano = falha automática em teste contra morte
                    - 3 falhas ainda podem matar
                    - Após turno extra, cai inconsciente se ainda com 0 PV
                    - Recarrega em descanso longo
                `
            }
        ];
    }
}