import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeEncantamento extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Encantamento",
            "Como um membro da Escola de Encantamento, você afiou sua habilidade de entrar magicamente e seduzir outras pessoas e monstros. Alguns encantadores são pacifistas que fascinam os violentos para que larguem suas armas e enfeitiçam os cruéis para mostrar misericórdia. Outros são tiranos que dominam magicamente os involuntários, obrigando-os a servi-lo. A maioria dos encantadores está em algum lugar entre esses extremos."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Encantamento Instruído",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de encantamento em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Olhar Hipnotizante",
                nivel: 2,
                descricao: `
                    Com uma ação, escolha uma criatura que você possa ver a até 1,5 metro. Se o alvo puder ver ou ouvir você, ele deve ser bem sucedido num teste de resistência de Sabedoria contra uma CD igual das suas magias de mago, ou ficará enfeitiçado por você até o final do seu próximo turno. O deslocamento da criatura enfeitiçada cai para 0 e a criatura está incapacitada e visivelmente aturdida.

                    Nos turnos subsequentes, você pode usar sua ação para manter esse efeito, estendendo sua duração até o final do seu próximo turno. O efeito termina se você se afastar mais de 1,5 metro da criatura, se a criatura não puder nem ver nem ouvir você ou se a criatura sofrer dano.
                `
            },
            {
                nome: "Encanto Instintivo",
                nivel: 6,
                descricao: `
                    Quando uma criatura que você puder ver a até 9 metros realizar uma jogada de ataque contra você, você pode usar sua reação para desviar o ataque, contanto que exista outra criatura no alcance do ataque. O atacante deve realizar um teste de resistência de Sabedoria contra uma CD igual das suas magias de mago. Caso falhe, o atacante deve atacar a criatura mais próxima dele, excluindo você ou ele mesmo.
                `
            },
            {
                nome: "Dividir Encantamento",
                nivel: 10,
                descricao: `
                    Quando você conjurar uma magia de encantamento de 1° nível ou superior que tenha uma única criatura como alvo, você pode fazer com que ela afete uma segunda criatura.
                `
            },
            {
                nome: "Alterar Memórias",
                nivel: 14,
                descricao: `
                    Quando você conjura uma magia de encantamento para enfeitiçar uma ou mais criaturas, você pode alterar a compreensão de uma criatura para que ela continue sem saber que está sendo enfeitiçada.

                    Além disso, assim que a magia expirar, você pode usar sua ação para tentar fazer com que a criatura escolhida esqueça parte do tempo que permaneceu enfeitiçada. A criatura deve ser bem sucedida num teste de resistência de Inteligência contra uma CD igual das suas magias de mago ou perderá uma quantidade de horas da sua memória igual a 1 + seu modificador de Carisma (mínimo 1).
                `
            }
        ];
    }
}
