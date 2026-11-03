import { SubClasses } from "../classesPrincipais/SubClasses";

export class CombatenteDosElementos2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Combatente dos Elementos", "Combatentes dos Elementos aproveitam o poder dos Planos Elementais e canalizam energia do Caos Elemental para fortalecer seus golpes e explosões de poder.");
        this.niveis = [
            { nome: "Manipular Elementos", nivel: 3, descricao: "Você conhece a magia Elementalismo. Sabedoria é seu atributo de conjuração para ela." },
            { nome: "Sintonia Elemental", nivel: 3, descricao: "No início do seu turno, você pode gastar 1 Ponto de Foco para imbuir-se de energia elemental por 10 minutos ou até ficar Incapacitado. Enquanto ativa, seus Ataques Desarmados podem causar dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante em vez do dano normal; ao causar um desses tipos, você pode forçar salvaguarda de Força e mover o alvo até 3 metros em sua direção ou para longe. Além disso, o alcance de seus Ataques Desarmados aumenta em 3 metros." },
            { nome: "Explosão Elemental", nivel: 6, descricao: "Como uma ação Usar Magia, você pode gastar 2 Pontos de Foco para criar uma Esfera de 6 metros de raio centrada em um ponto a até 36 metros. Escolha dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante. Cada criatura na Esfera realiza salvaguarda de Destreza, sofrendo dano igual a três jogadas de seus dados de Artes Marciais em falha ou metade em sucesso." },
            { nome: "Passo dos Elementos", nivel: 11, descricao: "Enquanto sua Sintonia Elemental estiver ativa, você também tem Deslocamento de Natação e de Voo iguais ao seu Deslocamento." },
            { nome: "Ápice Elemental", nivel: 17, descricao: "Enquanto sua Sintonia Elemental estiver ativa, uma vez em cada um dos seus turnos você pode causar dano adicional a um alvo igual a uma jogada de seu dado de Artes Marciais ao atingi-lo com um Ataque Desarmado. Ao usar Passo do Vento, seu Deslocamento aumenta em 6 metros até o final do turno e criaturas à sua escolha sofrem dano elemental igual a uma jogada de seu dado de Artes Marciais quando você entra em um espaço a até 1,5 metro delas, uma vez por turno por criatura. Você também adquire Resistência a dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante, podendo alterar a escolha no início de cada turno." }
        ];
    }
}
