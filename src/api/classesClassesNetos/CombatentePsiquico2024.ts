import { SubClasses } from "../classesPrincipais/SubClasses";

export class CombatentePsiquico2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Combatente Psíquico", "Você desperta o poder da mente para aprimorar suas habilidades físicas com energia psiônica, telecinesia e barreiras mentais.");
        this.niveis = [
            { nome: "Poder Psiônico", nivel: 3, descricao: "Você possui Dados de Energia Psiônica que alimentam seus poderes: no nível 3, 4d6; nível 5, 6d8; nível 9, 8d8; nível 11, 8d10; nível 13, 10d10; nível 17, 12d12. Você recupera um dado gasto ao completar Descanso Curto e todos ao completar Descanso Longo. Seus poderes incluem Golpe Psiônico, Movimento Telecinético e Vínculo Protetivo." },
            { nome: "Adepto Telecinético", nivel: 7, descricao: "Ao causar dano com Golpe Psiônico, você pode forçar salvaguarda de Força contra CD 8 + Inteligência + Proficiência; em falha, impõe Caído ou move o alvo horizontalmente até 3 metros. Como Ação Bônus, você também pode adquirir Deslocamento de Voo igual ao dobro do seu Deslocamento até o fim do turno, recuperando o uso em descanso ou gastando Dado de Energia Psiônica." },
            { nome: "Resguardo Mental", nivel: 10, descricao: "Você tem Resistência a dano Psíquico. Além disso, ao iniciar seu turno Amedrontado ou Enfeitiçado, pode gastar um Dado de Energia Psiônica para encerrar todos os efeitos em você que imponham essas condições." },
            { nome: "Baluarte de Energia", nivel: 15, descricao: "Como Ação Bônus, escolha criaturas a até 9 metros, incluindo você, em número até seu modificador de Inteligência, mínimo uma. Cada criatura escolhida tem Cobertura Parcial por 1 minuto ou até você ficar Incapacitado. Você recupera o uso em Descanso Longo ou gastando Dado de Energia Psiônica." },
            { nome: "Mestre Telecinético", nivel: 18, descricao: "Você sempre tem Telecinese preparada e pode conjurá-la sem espaço de magia ou componentes, usando Inteligência como atributo de conjuração. Em cada turno enquanto mantém Concentração nela, incluindo o turno em que a conjura, você pode realizar um ataque com arma como Ação Bônus. Você recupera o uso em Descanso Longo ou gastando Dado de Energia Psiônica." }
        ];
    }
}
