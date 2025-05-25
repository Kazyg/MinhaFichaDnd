import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CirculoDosSonhos extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
        magias: { terreno: string; magias: string[] }[];
    }[];

    constructor() {
        super(
            "Círculo dos Sonhos",
            "Os druidas que são membros do Círculo dos Sonhos são provenientes de regiões que têm fortes laços com a Agrestia das Fadas e seus reinos de sonho. A tutela dos druidas do mundo natural faz com que uma aliança natural entre eles e fadas de bom alinhamento. Esses druidas procuram preencher o mundo com uma maravilha sonhadora. Sua magia cura feridas e traz alegria aos corações abatidos, e os reinos que eles protegem são lugares reluzentes e frutíferos, onde os sonhos e a realidade se misturam e onde os cansados podem encontrar o descanso."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Bálsamo da Corte de Verão",
                nivel: 2,
                descricao: `
                    No 2° nível, você fica imbuído das bênçãos da Corte de Verão. Você é uma fonte de energia que oferece um descanso para ferimentos. Você tem uma infusão de energia feérica representada por um número de d6 igual ao seu nível de druida.
                    
                    Como uma ação de bônus, você pode escolher uma criatura que possa ver dentro de 36 metros de alcance e gastar uma série desses dados igual à metade do seu nível de druida ou menos. Role os dados gastos e adicione-os. O alvo recupera um número de pontos de vida igual ao total. O alvo também ganha um ponto de vida temporário por dado gasto. Você recupera todos os dados gastos quando terminar um descanso longo.
                `,
                magias: []
            },
            {
                nome: "Lareira de Sombra e Luar",
                nivel: 6,
                descricao: `
                    No 6° nível, sua casa pode estar onde quer que esteja. Durante um descanso curto ou longo, você pode invocar o poder sombrio da Corte do Crepúsculo para ajudar a proteger seu descanso. No início do seu descanso, você toca um ponto no espaço, e surge uma esfera de magia invisível de 9 metros de raio, centrada nesse ponto. A cobertura total bloqueia a esfera.
                    
                    Enquanto estiver dentro da esfera, você e seus aliados ganham um bônus de +5 em Destreza (Furtividade) e Sabedoria (Percepção), e qualquer luz dentro da esfera (uma fogueira, tochas ou similares) não são visíveis de fora dela. A esfera desaparece ao final do descanso ou quando saírem da esfera.
                `,
                magias: []
            },
            {
                nome: "Caminhos Ocultos",
                nivel: 10,
                descricao: `
                    A partir do 10° nível, você pode usar os caminhos escondidos e mágicos que algumas fadas usam para atravessar o espaço em um piscar de olhos. Como uma ação de bônus no seu turno, você pode se teleportar até 18 metros para um espaço desocupado que possa ver. Alternativamente, pode usar sua ação para teleportar uma criatura disposta que você toque até 9 metros para um espaço desocupado que possa ver.
                    
                    Pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (no mínimo uma vez) e recupera todas as utilizações gastas quando terminar um descanso longo.
                `,
                magias: []
            },
            {
                nome: "Caminhante dos Sonhos",
                nivel: 14,
                descricao: `
                    No 14° nível, a magia da Agrestia das Fadas lhe concede a capacidade de viajar mentalmente ou fisicamente através dos países dos sonhos.
                    
                    Quando terminar um pequeno descanso, você pode conjurar uma das seguintes magias, sem gastar um espaço de magia ou exigir componentes materiais: sonho (com você atuando como o mensageiro), vidência ou círculo de teleporte.
                    
                    Este uso do círculo de teleporte é especial. Ao invés de abrir um portal para um círculo de teleporte permanente, ele abre um portal para o último local onde terminou um descanso longo no seu plano de existência atual. Se você não descansou muito no seu plano atual, a magia falhará, mas não será desperdiçada.
                    
                    Depois de usar esta característica, não pode usá-la novamente até terminar um descanso longo.
                `,
                magias: []
            }
        ];
    }
}