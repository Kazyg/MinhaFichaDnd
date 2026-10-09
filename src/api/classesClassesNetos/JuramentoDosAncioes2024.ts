import { SubClasses } from "../classesPrincipais/SubClasses";

export class JuramentoDosAncioes2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Juramento dos Anciões", "O Juramento dos Anciões valoriza a luz e as belezas vivificantes do mundo, preservando a vida, a esperança, a arte e a alegria.");
        this.niveis = [
            { nome: "A Ira da Natureza", nivel: 3, descricao: "Como uma ação Usar Magia, você pode gastar um uso de Canalizar Divindade para conjurar videiras espectrais em torno de criaturas próximas. Cada criatura à sua escolha a até 4,5 metros deve passar em salvaguarda de Força ou fica Contida por 1 minuto. A criatura repete a salvaguarda no final de cada turno, encerrando o efeito em sucesso." },
            { nome: "Magias do Juramento dos Anciões", nivel: 3, descricao: "Você sempre tem preparadas as magias do juramento conforme seu nível de Paladino: nível 3, Falar com Animais e Golpe Constritor; nível 5, Passo Nebuloso e Raio Lunar; nível 9, Crescimento de Plantas e Proteção contra Energia; nível 13, Pele-Rocha e Tempestade Glacial; nível 17, Comunhão com a Natureza e Passo Arbóreo." },
            { nome: "Aura de Resistência", nivel: 7, descricao: "Você e seus aliados têm Resistência a dano Necrótico, Psíquico e Radiante enquanto estiverem em sua Aura de Proteção." },
            { nome: "Sentinela Imortal", nivel: 15, descricao: "Ao ser reduzido a 0 Pontos de Vida e não morto imediatamente, você fica com 1 Ponto de Vida e recupera Pontos de Vida iguais a três vezes seu nível de Paladino. Você recupera o uso ao completar Descanso Longo. Além disso, você não pode envelhecer magicamente e sua aparência não envelhece." },
            { nome: "Campeão Ancestral", nivel: 20, descricao: "Como uma Ação Bônus, você imbui sua Aura de Proteção por 1 minuto. Inimigos na aura têm Desvantagem em salvaguardas contra suas magias e opções de Canalizar Divindade; sempre que conjurar uma magia com tempo de conjuração de uma ação, pode conjurá-la usando uma Ação Bônus; e no início de cada turno você recupera 10 Pontos de Vida. Você recupera o uso ao completar Descanso Longo ou gastando um espaço de magia de 5º círculo." }
        ];
    }
}
