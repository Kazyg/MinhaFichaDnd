import { SubClasses } from "../classesPrincipais/SubClasses";

export class CirculoDaLua2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Círculo da Lua", "Druidas do Círculo da Lua canalizam a magia lunar para se transformar e proteger a vida selvagem em formas animais poderosas.");
        this.niveis = [
            {
                nome: "Formas Animais dos Círculos Druídicos",
                nivel: 3,
                descricao: "Ao assumir Forma Selvagem, o Nível de Desafio máximo da forma é igual ao seu nível de Druida dividido por 3, arredondado para baixo. Sua CA pode se tornar 13 + seu modificador de Sabedoria se isso for maior que a CA da Fera, e você recebe Pontos de Vida Temporários iguais a três vezes seu nível de Druida."
            },
            {
                nome: "Magias do Círculo da Lua",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Curar Ferimentos, Fagulha Estelar e Raio Lunar; no nível 5, Invocar Animais; no nível 7, Fonte do Luar; no nível 9, Curar Ferimentos em Massa. Você pode conjurar essas magias enquanto está em Forma Selvagem."
            },
            {
                nome: "Formas Animais dos Círculos Druídicos Aprimorada",
                nivel: 6,
                descricao: "Enquanto estiver em Forma Selvagem, seus ataques podem causar o tipo de dano normal ou dano Radiante, à sua escolha quando acerta. Você também pode adicionar seu modificador de Sabedoria às suas salvaguardas de Constituição."
            },
            {
                nome: "Passo Lunar",
                nivel: 10,
                descricao: "Como Ação Bônus, você se teleporta até 9 metros para um espaço desocupado à sua vista e tem Vantagem na próxima jogada de ataque que realizar antes do final do turno. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, recuperando os usos ao completar Descanso Longo. Também pode recuperar usos gastando espaços de magia de 2º círculo ou superior."
            },
            {
                nome: "Forma Lunar",
                nivel: 14,
                descricao: "Uma vez por turno, você pode causar 2d10 de dano Radiante adicional a um alvo atingido por um ataque da Forma Selvagem. Além disso, sempre que usar Passo Lunar, pode teleportar uma criatura voluntária a até 3 metros de você para um espaço desocupado à sua vista a até 3 metros do seu destino."
            }
        ];
    }
}
