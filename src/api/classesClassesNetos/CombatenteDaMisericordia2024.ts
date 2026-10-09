import { SubClasses } from "../classesPrincipais/SubClasses";

export class CombatenteDaMisericordia2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Combatente da Misericórdia", "Combatentes da Misericórdia controlam a força vital dos outros, atuando como curandeiros errantes e eliminando rapidamente seus inimigos.");
        this.niveis = [
            { nome: "Implementos de Misericórdia", nivel: 3, descricao: "Você adquire proficiência nas perícias Intuição e Medicina e proficiência com o Kit de Herbalismo." },
            { nome: "Mão de Cura", nivel: 3, descricao: "Com uma ação Usar Magia, você pode gastar 1 Ponto de Foco para tocar uma criatura e restaurar Pontos de Vida iguais a uma jogada de seu dado de Artes Marciais mais seu modificador de Sabedoria. Ao usar Torrente de Golpes, você pode substituir um dos Ataques Desarmados por esta cura sem gastar Ponto de Foco para ela." },
            { nome: "Mão de Dolo", nivel: 3, descricao: "Uma vez por turno, ao atingir uma criatura com um Ataque Desarmado e causar dano, você pode gastar 1 Ponto de Foco para causar dano Necrótico adicional igual a uma jogada de seu dado de Artes Marciais mais seu modificador de Sabedoria." },
            { nome: "Toque de Médico", nivel: 6, descricao: "Ao usar Mão de Cura, você também pode encerrar uma das seguintes condições na criatura curada: Atordoado, Cego, Envenenado, Paralisado ou Surdo. Ao usar Mão de Dolo, você também pode impor ao alvo a condição Envenenado até o final do seu próximo turno." },
            { nome: "Torrente de Cura e Dolo", nivel: 11, descricao: "Ao usar Torrente de Golpes, você pode substituir cada Ataque Desarmado pelo uso da Mão de Cura sem gastar Pontos de Foco para a cura. Além disso, ao realizar um Ataque Desarmado com Torrente de Golpes e causar dano, você pode usar Mão de Dolo com esse ataque sem gastar Ponto de Foco para Mão de Dolo. Você pode usar esses benefícios um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, e recupera todos os usos ao completar Descanso Longo." },
            { nome: "Mão da Misericórdia Final", nivel: 17, descricao: "Como uma ação Usar Magia, você pode tocar o cadáver de uma criatura que morreu nas últimas 24 horas e gastar 5 Pontos de Foco. A criatura retorna à vida com Pontos de Vida iguais a 4d10 mais seu modificador de Sabedoria e remove Atordoado, Cego, Envenenado, Paralisado e Surdo, se aplicável. Você recupera o uso ao completar Descanso Longo." }
        ];
    }
}
