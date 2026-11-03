import { SubClasses } from "../classesPrincipais/SubClasses";

export class ColegioDoGlamour2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Colégio do Glamour", "O Colégio do Glamour remonta à magia encantadora de Faéria, entrelaçando beleza e terror em canções e histórias.");
        this.niveis = [
            {
                nome: "Magia Fascinante",
                nivel: 3,
                descricao: "Você sempre tem Enfeitiçar Pessoa e Reflexos preparadas. Além disso, imediatamente após conjurar uma magia de Encantamento ou Ilusão usando espaço de magia, pode fazer uma criatura à sua vista a até 18 metros realizar salvaguarda de Sabedoria contra sua CD de magia. Se falhar, o alvo fica Amedrontado ou Enfeitiçado por 1 minuto, repetindo a salvaguarda ao final de cada turno. Você recupera o uso ao completar Descanso Longo ou gastando Inspiração de Bardo."
            },
            {
                nome: "Manto de Inspiração",
                nivel: 3,
                descricao: "Como uma Ação Bônus, você pode usar uma Inspiração de Bardo e jogar o dado. Escolha um número de criaturas a até 18 metros igual ao seu modificador de Carisma, mínimo uma. Cada criatura recebe Pontos de Vida Temporários iguais a duas vezes o número jogado e pode executar uma Reação para se mover até o máximo do Deslocamento sem provocar Ataques de Oportunidade."
            },
            {
                nome: "Manto de Majestade",
                nivel: 6,
                descricao: "Você sempre tem Comando preparada. Como uma Ação Bônus, pode conjurar Comando sem gastar espaço de magia e assumir uma aparência sobrenatural por 1 minuto ou até sua Concentração se quebrar. Durante esse tempo, pode conjurar Comando como Ação Bônus sem gastar espaço. Criaturas Enfeitiçadas por você falham automaticamente contra o Comando desta característica. Você recupera o uso ao completar Descanso Longo ou gastando espaço de magia de 3º círculo ou superior."
            },
            {
                nome: "Majestade Inquebrável",
                nivel: 14,
                descricao: "Como uma Ação Bônus, você assume uma presença majestosamente mágica por 1 minuto ou até ficar Incapacitado. Durante a duração, sempre que uma criatura o atingir com uma jogada de ataque pela primeira vez em um turno, o atacante deve ser bem-sucedido em salvaguarda de Carisma contra sua CD de magia ou o ataque falha. Você recupera o uso ao completar Descanso Curto ou Longo."
            }
        ];
    }
}
