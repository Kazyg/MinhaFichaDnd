import { SubClasses } from "../classesPrincipais/SubClasses";

export class FeiticariaAberrante2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Feitiçaria Aberrante", "Uma influência alienígena envolveu sua mente, concedendo poder psiônico para tocar outras mentes e distorcer a realidade ao seu redor.");
        this.niveis = [
            {
                nome: "Fala Telepática",
                nivel: 3,
                descricao: "Como Ação Bônus, escolha uma criatura à sua vista e a até 9 metros. Você e ela podem se comunicar telepaticamente enquanto estiverem a até 1,5 quilômetro vezes seu modificador de Carisma, mínimo 1,5 quilômetro. A conexão dura minutos iguais ao seu nível de Feiticeiro e termina cedo se você se conectar a outra criatura."
            },
            {
                nome: "Magias Psiônicas",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Acalmar Emoções, Braços de Hadar, Detectar Pensamentos, Sussurros Dissonantes e Talho Mental; no nível 5, Fome de Hadar e Remeter; no nível 7, Invocar Aberração e Tentáculos Negros de Evard; no nível 9, Ligação Telepática de Rary e Telecinese."
            },
            {
                nome: "Defesas Psíquicas",
                nivel: 6,
                descricao: "Você tem Resistência a dano Psíquico e Vantagem em salvaguardas para evitar ou encerrar as condições Amedrontado ou Enfeitiçado."
            },
            {
                nome: "Feitiçaria Psiônica",
                nivel: 6,
                descricao: "Ao conjurar uma magia de 1º círculo ou superior de Magias Psiônicas, você pode conjurá-la com espaço de magia ou gastando Pontos de Feitiçaria iguais ao círculo da magia. Se conjurar com Pontos de Feitiçaria, ela não requer componentes Verbais ou Somáticos, nem Materiais exceto se consumidos ou com custo detalhado."
            },
            {
                nome: "Revelação em Carne",
                nivel: 14,
                descricao: "Como Ação Bônus, você pode gastar 1 ou mais Pontos de Feitiçaria para alterar magicamente seu corpo por 10 minutos. Para cada ponto gasto, escolha um benefício: respirar debaixo d'água e nadar, mover-se por espaços mínimos e escapar de restrições não mágicas, ver criaturas Invisíveis a até 18 metros, ou adquirir Deslocamento de Voo igual ao seu Deslocamento e pairar."
            },
            {
                nome: "Implosão de Distorção",
                nivel: 18,
                descricao: "Como ação Usar Magia, você se teleporta para um espaço desocupado à sua vista a até 36 metros. Cada criatura a até 9 metros do espaço que você deixou faz salvaguarda de Força contra sua CD de magia; se falhar, sofre 3d10 de dano Energético e é puxada para o espaço abandonado, terminando no espaço desocupado mais próximo. Em sucesso, sofre metade do dano. Você recupera o uso em Descanso Longo ou gastando 5 Pontos de Feitiçaria."
            }
        ];
    }
}
