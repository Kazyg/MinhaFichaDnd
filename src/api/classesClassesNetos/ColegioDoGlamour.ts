import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ColegioDoGlamour extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Colégio do Glamour",
            "Bardos que dominaram seus ofícios no vibrante reino de Agrestia das Fadas. Usam magia feérica para deleitar e cativar, podendo acalmar dragões furiosos ou inspirar admiração lendária. Suas performances são materiais para lendas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Manto da Inspiração e Performance Deslumbrante",
                nivel: 3,
                descricao: `
                    Manto da Inspiração: Como ação bônus, gaste 1 Inspiração de Bardo para conceder a aliados (até mod. Carisma) 5 PV temporários e movimento sem provocar ataques de oportunidade (aumenta para 8 no 5° nível, 11 no 10° nível, 14 no 15° nível).
                    
                    Performance Deslumbrante: Após 1 minuto de performance, encante humanoides (CD Sabedoria). Encantados o idolatram por 1 hora (até sofrerem dano ou testemunharem seus ataques). Recarrega com descanso curto/longo.
                `
            },
            {
                nome: "Manto de Majestade",
                nivel: 6,
                descricao: `
                    Como ação bônus, conjure Comando sem gastar espaço de magia e ganhe aparência sobrenatural por 1 minuto (concentração). Durante este tempo, pode continuar conjurando Comando como ação bônus. Criaturas encantadas falham automaticamente contra Comando. Recarrega com descanso longo.
                `
            },
            {
                nome: "Majestade Inquebrável",
                nivel: 14,
                descricao: `
                    Como ação bônus, assuma presença majestosa por 1 minuto. Criaturas que tentarem atacá-lo pela primeira vez em um turno devem passar em teste de Carisma (CD magia) ou não poderão atacá-lo naquele turno. Se passarem, terão desvantagem contra suas magias no próximo turno. Recarrega com descanso curto/longo.
                `
            }
        ];
    }
}