import { SubClasses } from "../classesPrincipais/SubClasses";

export class MestreDeBatalha2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Mestre de Batalha", "Você domina manobras sofisticadas, equilibrando habilidades marciais com estudos em história, teoria e artes.");
        this.niveis = [
            { nome: "Estudioso da Guerra", nivel: 3, descricao: "Você adquire proficiência com um tipo de Ferramentas de Artesão à sua escolha e proficiência em uma perícia à sua escolha das perícias disponíveis para Guerreiros no nível 1." },
            { nome: "Superioridade em Combate", nivel: 3, descricao: "Você aprende três manobras e usa Dados de Superioridade d8 para alimentá-las. Você tem quatro dados, recuperados ao completar Descanso Curto ou Longo. Aprende duas manobras adicionais nos níveis 7, 10 e 15, podendo substituir manobras conhecidas. A CD das manobras é 8 + modificador de Força ou Destreza + Bônus de Proficiência." },
            { nome: "Conheça Seu Inimigo", nivel: 7, descricao: "Como Ação Bônus, examine uma criatura à sua vista a até 9 metros; você sabe se ela tem Imunidades, Resistências ou Vulnerabilidades e quais são. Você recupera o uso ao completar Descanso Longo ou gastando um Dado de Superioridade." },
            { nome: "Superioridade em Combate Aprimorada", nivel: 10, descricao: "Seu Dado de Superioridade se torna um d10." },
            { nome: "Implacável", nivel: 15, descricao: "Uma vez por turno, ao usar uma manobra, você pode jogar 1d8 e usar o resultado em vez de gastar um Dado de Superioridade." },
            { nome: "Superioridade em Combate Suprema", nivel: 18, descricao: "Seu Dado de Superioridade se torna um d12." },
            { nome: "Opções de Manobra", nivel: 3, descricao: "As manobras incluem Aparar, Ataque Ameaçador, Ataque de Varredura, Ataque Estendido, Ataque para Distrair, Ataque Preciso, Ataque Provocante, Avaliação Tática, Contra-ataque, Desarme, Emboscada, Encontrão, Finta, Gato Por Lebre, Golpe do Comandante, Manobrar, Movimentação Evasiva, Presença de Autoridade, Prostrar e Recuperar Energia." }
        ];
    }
}
