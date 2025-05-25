import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class AlmaFavorecida extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Alma Favorecida",
            "Feiticeiros com uma centelha divina em sua alma, abençoados por conexões ancestrais com seres celestiais ou profecias. Combinam magia arcana com poder sagrado, sendo vistos tanto como escolhidos quanto como ameaças às hierarquias religiosas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magia Divina e Favorecido pelos Deuses",
                nivel: 1,
                descricao: `
                    Magia Divina:
                    - Pode aprender magias da lista de clérigo
                    - Escolha uma afinidade divina (Bem/Mal/Ordem/Caos/Neutralidade) e ganhe uma magia adicional:
                      * Bem: curar ferimentos
                      * Mal: infligir ferimentos
                      * Ordem: benção
                      * Caos: perdição
                      * Neutralidade: proteção contra o mal e o bem
                    
                    Favorecido pelos Deuses:
                    - Quando falhar teste de resistência ou errar ataque, role 2d4 e adicione ao resultado
                    - Recarrega com descanso curto/longo
                `
            },
            {
                nome: "Cura Fortalecida",
                nivel: 6,
                descricao: `
                    Quando você ou aliado a 1,5m rolar dados de cura, gaste 1 ponto de feitiçaria para rerrolar qualquer número desses dados. 1x/turno.
                `
            },
            {
                nome: "Asas Transcendentais",
                nivel: 14,
                descricao: `
                    Ação bônus para manifestar asas espectrais (voo 9m). Dura até ficar incapacitado, morrer ou desfazer (ação bônus). Aparência varia conforme afinidade:
                    - Bem/Ordem: asas de águia
                    - Mal/Caos: asas de morcego
                    - Neutralidade: asas de libélula
                `
            },
            {
                nome: "Recuperação Sublime",
                nivel: 18,
                descricao: `
                    Ação bônus quando abaixo da metade dos PV máximos: recupere metade dos PV máximos. Recarrega com descanso longo.
                `
            }
        ];
    }
}