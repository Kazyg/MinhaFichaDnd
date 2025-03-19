import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CaminhoFurioso extends SubClasses {
    niveis: {
        nome: string
        nivel: number;
        descricao: string;
      }[];
    constructor(){
        super("Caminho do Furioso", "Para alguns bárbaros, a fúria é um meio para um fim – esse fim é a violência. O Caminho do Furioso é um caminho de fúria livre, entumecido em sangue. A medida que você entra na fúria de um furioso, você vibra no caos da batalha, despreocupado com a sua própria saúde ou bem-estar. ");
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Frenesi",
                nivel: 3,
                descricao: "Começando no momento que você escolhe esse caminho no 3° nível, você pode entrar num frenesi quando estiver em fúria. Se você desejar, pela duração da sua fúria, você pode realizar um único ataque corpo-a-corpo com arma, com uma ação bônus, em cada um de seus turnos após esse. Quando sua fúria acabar, você sofrerá um nível de exaustão (como descrito no apêndice A)."
            },
            {
                nome: "Fúria Inconsciente",
                nivel: 6,
                descricao: "A partir do 6° nível, você não pode ser enfeitiçado ou amedrontado enquanto estiver em fúria. Se você estava enfeitiçado ou amedrontado quando entrou em fúria, o efeito é suspenso pela duração da fúria."
            },
            {
                nome: "Presença Intimidante",
                nivel: 10,
                descricao: "A partir do 10° nível, você pode usar sua ação para amedrontar alguém com sua presença intimidante. Quando o fizer, escolha uma criatura que você possa ver a 9 metros. Se a criatura puder ver ou ouvir você, ela deve ser bem sucedida num teste de resistência de Sabedoria (CD igual a 8 + seu bônus de proficiência + seu modificador de Carisma) ou ficará com medo de você até o fim do seu próximo turno. Nos turnos seguintes, você pode usar sua ação para estender a duração desse efeito na criatura amedrontada até o início do seu próximo turno. Esse efeito termina se a criatura terminar seu turno fora da sua linha de visão ou a mais de 18 metros de você. Se a criatura for bem sucedida no teste de resistência, você não poderá usar essa característica nessa criatura novamente por 24 horas."
            },
            {
                nome: "Retaliação",
                nivel: 14,
                descricao: "A partir do 14° nível, quando você sofrer dano de uma criatura que esteja a até 1,5 metro de você, você pode usar sua reação para realizar um ataque corpo-a-corpo com arma contra essa criatura."
            }
        ]
    }
}