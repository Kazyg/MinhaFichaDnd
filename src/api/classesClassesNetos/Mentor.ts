import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Mentor extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Mentor",
            "Mestres da manipulação e intriga que usam palavras como armas. Especialistas em influência social, disfarces e estratégia, acumulando segredos e favores como moeda de poder."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Mestre da Intriga e Mestre de Tática",
                nivel: 3,
                descricao: `
                    Mestre da Intriga:
                    - Proficiência em kit de disfarce, kit de falsificação e um jogo
                    - Aprende 2 idiomas adicionais
                    - Pode imitar perfeitamente padrões de fala e sotaques após ouvir por 1 minuto
                    
                    Mestre de Tática:
                    - Pode usar Ajuda como ação bônus
                    - Ao usar Ajuda, aliado pode estar a 9m (em vez de 1.5m) se puder te ver/ouvir
                `
            },
            {
                nome: "Manipulador Perspicaz",
                nivel: 9,
                descricao: `
                    Após 1 minuto observando/interagindo fora de combate, pode comparar:
                    - Valores de Inteligência, Sabedoria ou Carisma
                    - Nível de classe (se aplicável)
                    - Opcionalmente: conhece um traço de personalidade ou parte do histórico
                `
            },
            {
                nome: "Redirecionar",
                nivel: 13,
                descricao: `
                    Reação quando atacado com criatura fornecendo cobertura a 1.5m:
                    - Redireciona o ataque para a criatura que fornecia cobertura
                `
            },
            {
                nome: "Alma do Enganador",
                nivel: 17,
                descricao: `
                    - Imune a leitura de pensamentos não autorizada
                    - Pode enviar pensamentos falsos (teste de Enganação vs Intuição)
                    - Magias de detecção de verdade sempre indicam que está sendo sincero (se desejar)
                    - Não pode ser compelido a dizer a verdade magicamente
                `
            }
        ];
    }
}