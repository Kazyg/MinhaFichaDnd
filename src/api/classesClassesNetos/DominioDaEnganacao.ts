import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaEnganacao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Enganação",
            "Deuses da enganação – como Tymora, Beshaba, Olidammara, o Viajante, Garl Glittergold e Loki – são causadores de travessuras e instigadores que se mantêm como um desafio constante para a aceitação das ordens tanto de mortais quanto dos deuses. Eles são patronos dos ladrões, trapaceiros, apostadores, rebeldes e libertadores. Seus clérigos são uma força intrometida no mundo, ferindo orgulhos, zombando de tiranos, roubando dos ricos, libertando cativos e desrespeitando tradições vazias. Eles preferem subterfúgio, trapaças, enganação e roubo no lugar do confronto direto."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio da Enganação",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | enfeitiçar pessoa, disfarçar-se
                    3°               | reflexos, passos sem pegadas
                    5°               | piscar, dissipar magia
                    7°               | porta dimensional, metamorfose
                    9°               | dominar pessoa, modificar memória
                `
            },
            {
                nome: "Bênção do Trapaceiro",
                nivel: 1,
                descricao: `
                    A partir do momento em que você escolhe esse domínio, no 1° nível, você pode usar sua ação para tocar uma criatura voluntária além de você mesmo para conceder vantagem em testes de Destreza (Furtividade). Essa bênção dura por 1 hora ou até você usar essa característica novamente.
                `
            },
            {
                nome: "Canalizar Divindade: Invocar Duplicidade",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode usar seu Canalizar Divindade para criar uma duplicata ilusória de si mesmo. Com uma ação, você cria uma ilusão perfeita de si mesmo que dura por 1 minuto ou até você perder sua concentração (como se você estivesse se concentrando em uma magia). A ilusão aparece em um espaço desocupado que você possa ver a até 9 metros de você. Com uma ação bônus, no seu turno, você pode mover a ilusão até 9 metros para um espaço que você possa ver, mas ela deve permanecer a até 36 metros de você. Pela duração, você pode conjurar magias como se você estivesse no espaço ocupado pela ilusão, mas você deve usar seus próprios sentidos. Além disso, quando ambos você e sua ilusão estiverem a 1,5 metro de uma criatura que possa ver a ilusão, você tem vantagem nas jogadas de ataque contra essa criatura, devido à distração causada no alvo pela ilusão.
                `
            },
            {
                nome: "Canalizar Divindade: Manto de Sombras",
                nivel: 6,
                descricao: `
                    No 6° nível, você pode usar seu Canalizar Divindade para desaparecer. Com uma ação, você se torna invisível até o final do seu próximo turno. Você se torna visível se atacar ou conjurar uma magia.
                `
            },
            {
                nome: "Golpe Divino",
                nivel: 8,
                descricao: `
                    No 8º nível, você ganha a habilidade de imbuir seus ataques com arma com veneno – uma dádiva da sua divindade. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você pode fazer o ataque causar 1d8 de dano de veneno extra ao alvo. Quando alcançar o 14º nível, o dano extra aumenta para 2d8.
                `
            },
            {
                nome: "Duplicidade Aprimorada",
                nivel: 17,
                descricao: `
                    A partir do 17° nível, você pode criar até quatro duplicatas de você, ao invés de uma, quando usar Invocar Duplicidade. Com uma ação bônus, no seu turno, você pode mover quantas duplicatas quiser até 9 metros, até no máximo de 36 metros de distância.
                `
            }
        ];
    }
}