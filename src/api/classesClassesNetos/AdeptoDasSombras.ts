import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class AdeptoDasSombras extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Adepto das Sombras",
            "Feiticeiros cuja magia emana do próprio Pendor das Sombras, com existência entre a vida e a morte. Sua aura sombria e peculiaridades físicas revelam sua conexão com o plano das sombras."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Olhos da Escuridão e Força do Túmulo",
                nivel: 1,
                descricao: `
                    Olhos da Escuridão: Visão no escuro de 36m. No 3° nível, aprende magia escuridão (pode conjurar com 2 pontos de feitiçaria ou espaço de magia; se usar pontos, pode ver através dela).
                    
                    Força do Túmulo: Ao ser reduzido a 0 PV, teste de Carisma (CD 5 + dano) para ficar com 1 PV. Não funciona contra dano radiante ou golpes críticos. Recarrega com descanso longo.
                `
            },
            {
                nome: "Cão do Mal Presságio",
                nivel: 6,
                descricao: `
                    Ação bônus (gaste 3 pontos de feitiçaria) para invocar um cão sombrio (lobo atroz modificado) que persegue um alvo a 36m:
                    - Tamanho Médio, tipo Monstruosidade
                    - PV temporários = metade do seu nível
                    - Move-se através de criaturas/objetos
                    - Conhece sempre a localização do alvo
                    - Alvo tem desvantagem em testes contra suas magias quando próximo
                    - Dura até 5 minutos, 0 PV ou alvo cair
                `
            },
            {
                nome: "Caminhar nas Sombras",
                nivel: 14,
                descricao: `
                    Em luz fraca/escuridão: ação bônus para teleportar até 36m para outro espaço com luz fraca/escuridão.
                `
            },
            {
                nome: "Forma Umbral",
                nivel: 18,
                descricao: `
                    Ação bônus (gaste 6 pontos de feitiçaria) para se transformar em sombra por 1 minuto:
                    - Resistência a todos os danos (exceto energia/radiante)
                    - Move-se através de criaturas/objetos
                    - 5 de dano se terminar turno dentro de objeto
                    - Pode terminar com ação bônus
                `
            }
        ];
    }
}