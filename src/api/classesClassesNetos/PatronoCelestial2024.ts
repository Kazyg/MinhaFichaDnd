import { SubClasses } from "../classesPrincipais/SubClasses";

export class PatronoCelestial2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Patrono Celestial", "Seu pacto é fundamentado nos Planos Superiores, permitindo que você experimente uma fração da luz sagrada que ilumina o multiverso.");
        this.niveis = [
            {
                nome: "Luz Medicinal",
                nivel: 3,
                descricao: "Você tem uma reserva de d6s igual a 1 + seu nível de Bruxo. Como Ação Bônus, pode curar a si ou uma criatura à sua vista a até 18 metros, gastando dados da reserva até um máximo igual ao seu modificador de Carisma, mínimo um dado. Você restaura todos os dados gastos ao completar Descanso Longo."
            },
            {
                nome: "Magia de Pacto do Celestial",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Auxílio, Chama Sagrada, Curar Ferimentos, Luz, Raio Guia e Restauração Menor; no nível 5, Luz do Dia e Revivificar; no nível 7, Defensor da Fé e Muralha de Fogo; no nível 9, Convocar Celestial e Restauração Maior."
            },
            {
                nome: "Alma Radiante",
                nivel: 6,
                descricao: "Você tem Resistência a dano Radiante. Uma vez por turno, quando conjurar uma magia que cause dano Ígneo ou Radiante, pode adicionar seu modificador de Carisma ao dano dessa magia contra um dos alvos."
            },
            {
                nome: "Resiliência Celestial",
                nivel: 10,
                descricao: "Você recebe Pontos de Vida Temporários sempre que usa Astúcia Mágica ou completa Descanso Curto ou Longo, em quantidade igual ao seu nível de Bruxo + seu modificador de Carisma. Além disso, até cinco criaturas à sua vista recebem Pontos de Vida Temporários iguais à metade do seu nível de Bruxo + seu modificador de Carisma."
            },
            {
                nome: "Vingança Calcinante",
                nivel: 14,
                descricao: "Quando você ou um aliado a até 18 metros estiver prestes a realizar uma Salvaguarda Contra Morte, você pode restaurar Pontos de Vida da criatura iguais à metade de seus Pontos de Vida máximos e encerrar a condição Caído nela. Criaturas à sua escolha a até 9 metros sofrem 2d8 + seu modificador de Carisma de dano Radiante e ficam Cegas até o final do turno atual. Você recupera o uso ao completar Descanso Longo."
            }
        ];
    }
}
