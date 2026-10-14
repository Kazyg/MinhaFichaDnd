import { SubClasses } from "../classesPrincipais/SubClasses";

export class Campeao2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Campeão", "Um Campeão foca no desenvolvimento de habilidades marciais em sua busca incessante pela vitória.");
        this.niveis = [
            { nome: "Atleta Extraordinário", nivel: 3, descricao: "Você tem Vantagem em jogadas de Iniciativa e testes de Força (Atletismo). Além disso, imediatamente após obter um Acerto Crítico, você pode se mover até metade do seu Deslocamento sem provocar Ataques de Oportunidade." },
            { nome: "Crítico Aprimorado", nivel: 3, descricao: "Suas jogadas de ataque com armas e Ataques Desarmados obtêm Acerto Crítico em resultados 19 ou 20 no d20." },
            { nome: "Estilo de Luta Adicional", nivel: 7, descricao: "Você adquire outro talento de Estilo de Luta à sua escolha." },
            { nome: "Combatente Heroico", nivel: 10, descricao: "Durante o combate, você pode se conceder Inspiração Heroica sempre que começar seu turno sem ela." },
            { nome: "Crítico Superior", nivel: 15, descricao: "Suas jogadas de ataque com armas e Ataques Desarmados obtêm Acerto Crítico em resultados 18 a 20 no d20." },
            { nome: "Sobrevivente", nivel: 18, descricao: "Você tem Vantagem em Salvaguardas Contra Morte e, ao obter 18–20 nelas, obtém 20 como resultado. No início de cada um dos seus turnos, você recupera Pontos de Vida iguais a 5 + seu modificador de Constituição se estiver Sangrando e tiver ao menos 1 Ponto de Vida." }
        ];
    }
}
