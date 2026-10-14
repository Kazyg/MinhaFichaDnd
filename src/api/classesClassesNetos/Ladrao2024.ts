import { SubClasses } from "../classesPrincipais/SubClasses";

export class Ladrao2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Ladrão", "Uma mistura de ladrão, caçador de tesouros e explorador, você é o resumo de um aventureiro que adentra ruínas e aproveita ao máximo itens mágicos.");
        this.niveis = [
            { nome: "Andarilho de Telhados", nivel: 3, descricao: "Você adquire um Deslocamento de Escalada igual ao seu Deslocamento e pode determinar sua distância de salto usando sua Destreza em vez de sua Força." },
            { nome: "Mão Leve", nivel: 3, descricao: "Como uma Ação Bônus, você pode realizar um teste de Destreza (Prestidigitação) para abrir uma fechadura ou desarmar uma armadilha com Ferramentas de Ladrão, roubar um bolso, executar a ação Usar Objeto ou executar a ação Usar Magia para utilizar um item mágico que exija essa ação." },
            { nome: "Furtividade Suprema", nivel: 9, descricao: "Você adquire a opção Ataque Escondido para Golpe Astuto. Ataque Escondido custa 1d6 e, se você tem a condição Invisível da ação Esconder, esse ataque não encerra a condição se você encerrar seu turno atrás de Cobertura de Três Quartos ou Cobertura Total." },
            { nome: "Usar Dispositivo Mágico", nivel: 13, descricao: "Você pode sintonizar até quatro itens mágicos ao mesmo tempo. Sempre que usar uma propriedade de item mágico que gaste cargas, jogue 1d6; em um 6, você usa a propriedade sem gastar cargas. Você também pode usar qualquer Pergaminho Mágico usando Inteligência como atributo de conjuração; para magias acima do 1º círculo, deve passar em um teste de Inteligência (Arcanismo) com CD 10 + círculo da magia." },
            { nome: "Reflexos de Ladrão", nivel: 17, descricao: "Em combate, você realiza dois turnos na primeira rodada: o primeiro conforme sua Iniciativa normal e o segundo em sua Iniciativa menos 10." }
        ];
    }
}
