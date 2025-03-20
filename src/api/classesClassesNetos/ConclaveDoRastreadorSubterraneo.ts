import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class ConclaveDoRastreadorSubterrâneo extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Conclave do Rastreador Subterrâneo",
            "Muitos povos descem para as profundezas do Subterrâneo apenas sob as condições mais urgentes, empreendendo alguma busca desesperada ou seguindo promessas de vastas riquezas. Com demasiada frequência, males antigos ocultos abaixo da terra e patrulheiros do Conclave dos Rastreadores Subterrâneos se esforçam para descobrir e derrotar tais ameaças antes que elas possam alcançar a superfície."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Batedor do Subterrâneo",
                nivel: 3,
                descricao: `
                    No 3° nível, você domina a arte da emboscada. No seu primeiro turno durante o combate, você ganha +3 metros de bônus no seu deslocamento e, se você usar a ação de Ataque nesse turno, você pode realizar um ataque adicional.
                    Você também é especialista em evitar criaturas que contam com visão no escuro. Tais criaturas não ganham qualquer benefício quando tentarem detectar você em condições de escuridão ou penumbra. Além disso, quando o Mestre determina se você pode se esconder de uma criatura, tal criatura não ganham qualquer benefício devido a visão no escuro dela.
                `
            },
            {
                nome: "Magia do Rastreador Subterrâneo",
                nivel: 3,
                descricao: `
                    A partir do 3° nível, você ganha visão no escuro com um alcance de 27 metros. Você também ganha acesso a magias adicionais no 3°, 5°, 9°, 13° e 17° níveis. Uma vez que tenha adquirido uma magia de rastreador subterrâneo, ela conta como uma magia de patrulheiro para você, mas não conta na quantidade de magias de patrulheiro que você conhece.
                    - **3° nível**: disfarçar-se.
                    - **5° nível**: truque de corda.
                    - **9° nível**: glifo de vigilância.
                    - **13° nível**: invisibilidade maior.
                    - **17° nível**: similaridade.
                `
            },
            {
                nome: "Ataque Extra",
                nivel: 5,
                descricao: `
                    A partir do 5° nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno.
                `
            },
            {
                nome: "Mente de Aço",
                nivel: 7,
                descricao: `
                    No 7° nível, você ganha proficiência em testes de resistência de Sabedoria.
                `
            },
            {
                nome: "Rajada do Rastreador",
                nivel: 11,
                descricao: `
                    A partir do 11° nível, uma vez em cada um dos seus turnos quando você errar um ataque, você pode realizar outro ataque.
                `
            },
            {
                nome: "Esquiva do Rastreador",
                nivel: 15,
                descricao: `
                    No 15° nível, sempre que uma criatura atacar você e não tiver vantagem, você pode usar sua reação para impor desvantagem na jogada de ataque da criatura contra você. Você pode usar essa característica antes ou depois da jogada de ataque ser feita, mas deve ser usada antes do resultado da jogada ser determinado.
                `
            }
        ];
    }
}