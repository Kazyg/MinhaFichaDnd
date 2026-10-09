import { SubClasses } from "../classesPrincipais/SubClasses";

export class AndarilhoFeerico2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Andarilho Feérico", "Uma mística feérica o envolve, graças à bênção de uma arquifada ou a um local em Faéria que o transformou.");
        this.niveis = [
            { nome: "Glamour Transcendental", nivel: 3, descricao: "Sempre que você realiza um teste de Carisma, recebe um bônus no teste igual ao seu modificador de Sabedoria, mínimo +1. Você também adquire proficiência em Atuação, Enganação ou Persuasão." },
            { nome: "Golpes Terríveis", nivel: 3, descricao: "Uma vez por turno, ao atingir uma criatura com uma arma, você pode causar 1d4 de dano Psíquico adicional ao alvo. O dano aumenta para 1d6 no nível 11 de Guardião." },
            { nome: "Magias do Andarilho Feérico", nivel: 3, descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Enfeitiçar Pessoa; no nível 5, Passo Nebuloso; no nível 9, Convocar Feérico; no nível 13, Porta Dimensional; no nível 17, Despistar. Você também possui uma bênção feérica, como manifestações ilusórias, fragrâncias naturais, chifres, galhadas ou mudanças de cor." },
            { nome: "Detalhe Sedutor", nivel: 7, descricao: "Você tem Vantagem em salvaguardas para evitar ou encerrar Amedrontado ou Enfeitiçado. Além disso, quando você ou uma criatura à sua vista a até 36 metros tiver sucesso contra essas condições, você pode usar sua Reação para forçar outra criatura à sua vista a até 36 metros a fazer salvaguarda de Sabedoria contra sua CD de magia. Se falhar, ela fica Amedrontada ou Enfeitiçada por 1 minuto, à sua escolha, repetindo a salvaguarda ao fim de cada turno." },
            { nome: "Reforços Feéricos", nivel: 11, descricao: "Você pode conjurar Convocar Feérico sem componente Material. Também pode conjurá-la uma vez sem gastar espaço de magia, recuperando esse uso ao completar Descanso Longo. Ao conjurá-la, pode modificá-la para não exigir Concentração e durar 1 minuto nesta conjuração." },
            { nome: "Andarilho Nebuloso", nivel: 15, descricao: "Você pode conjurar Passo Nebuloso sem gastar espaço de magia um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, recuperando os usos ao completar Descanso Longo. Sempre que conjurar Passo Nebuloso, pode levar uma criatura voluntária à sua vista a até 1,5 metro, teleportando-a para um espaço desocupado a até 1,5 metro do seu destino." }
        ];
    }
}
