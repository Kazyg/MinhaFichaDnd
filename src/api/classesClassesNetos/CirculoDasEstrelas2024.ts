import { SubClasses } from "../classesPrincipais/SubClasses";

export class CirculoDasEstrelas2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Círculo das Estrelas", "O Círculo das Estrelas segue padrões celestiais e busca dominar os poderes do cosmos através dos segredos ocultos nas constelações.");
        this.niveis = [
            {
                nome: "Forma Estrelada",
                nivel: 3,
                descricao: "Como Ação Bônus, você pode gastar um uso de Forma Selvagem para assumir uma forma estrelada por 10 minutos. Você mantém suas estatísticas, emite Luz Plena em 3 metros e Meia-luz por mais 3 metros, e escolhe uma constelação: Arqueiro permite realizar um ataque mágico à distância como Ação Bônus causando 1d8 + Sabedoria de dano Radiante; Dragão trata resultados 9 ou menores no d20 como 10 em testes de Inteligência ou Sabedoria e salvaguardas de Constituição para Concentração; Taça cura você ou outra criatura a até 9 metros em 1d8 + Sabedoria quando conjura magia com espaço que restaura Pontos de Vida."
            },
            {
                nome: "Mapa Estelar",
                nivel: 3,
                descricao: "Você cria um Mapa Estelar, um objeto Minúsculo que pode usar como Foco de Conjuração de Druida. Enquanto o segura, você tem Orientação e Raio Guia preparadas e pode conjurar Raio Guia sem gastar espaço de magia um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, recuperando usos ao completar Descanso Longo. Se perder o mapa, pode criar um substituto com uma cerimônia de 1 hora durante Descanso Curto ou Longo."
            },
            {
                nome: "Presságio Cósmico",
                nivel: 6,
                descricao: "Sempre que completar Descanso Longo, consulte seu Mapa Estelar e jogue um dado. Até o próximo Descanso Longo, você recebe uma Reação especial: Prosperidade em resultado par permite adicionar 1d6 ao Teste de D20 de uma criatura à sua vista a até 9 metros; Infortúnio em resultado ímpar permite subtrair 1d6. Você pode usar essa Reação um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez."
            },
            {
                nome: "Constelações Cintilantes",
                nivel: 10,
                descricao: "As constelações da Forma Estrelada melhoram. O d8 do Arqueiro e da Taça torna-se 2d8, e enquanto o Dragão estiver ativo você adquire Deslocamento de Voo de 6 metros e pode pairar. Além disso, no início de cada um dos seus turnos em Forma Estrelada, pode alterar qual constelação brilha em seu corpo."
            },
            {
                nome: "Repleto de Estrelas",
                nivel: 14,
                descricao: "Enquanto estiver em Forma Estrelada, você se torna parcialmente incorpóreo e tem Resistência a dano Contundente, Cortante e Perfurante."
            }
        ];
    }
}
