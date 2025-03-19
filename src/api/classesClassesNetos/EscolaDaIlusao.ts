import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeIlusao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Ilusão",
            "Você focou seus estudos em magias que ofuscam os sentidos, confundem a mente e enganam até mesmo os povos mais sábios. Sua mágica é sutil, mas as ilusões criadas pela sua mente afiada fazem o impossível parecer real. Alguns ilusionistas – incluindo muitos magos gnomos – são vigaristas benignos que usam suas magias para entreter. Outros são mestres mais sinistros da enganação, usando suas ilusões para apavorar e iludir os outros para ganhos pessoais."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Ilusão Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de ilusão em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Ilusão Menor Aprimorada",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, quando você escolhe essa escola, você aprende o truque ilusão menor. Se você já conhece esse truque, você aprende um truque de mago diferente, à sua escolha. O truque não conta no número de truque que você conhece.
                    Quando você conjurar ilusão menor, você pode criar tanto um som quanto uma imagem com uma única conjuração da magia.
                `
            },
            {
                nome: "Ilusões Moldáveis",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, quando você conjura uma magia de ilusão que tenha duração de 1 minuto ou maior, você pode usar sua ação para mudar a natureza da ilusão (usando os parâmetros normais da magia para a ilusão), considerando que você pode ver a ilusão.
                `
            },
            {
                nome: "Eu Ilusório",
                nivel: 10,
                descricao: `
                    Começando no 10° nível, você pode criar uma duplicata ilusória de si mesmo em um instante, como uma reação instintiva ao perigo. Quando uma criatura realizar uma jogada de ataque contra você, você pode usar sua reação para interpor a duplicata ilusória entre o atacante e você. O ataque erra você automaticamente, e então, a ilusão se dissipa.
                    Uma vez que você usa essa característica, não pode usá-la novamente até terminar um descanso longo.
                `
            },
            {
                nome: "Realidade Ilusória",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, você aprendeu o segredo de como tecer magia sombria em suas ilusões para torná-las semirreais. Quando você conjura uma magia de ilusão de 1° nível ou superior, você pode escolher um objeto inanimado e não-mágico que é parte da ilusão e tornar esse objeto real. Você pode fazer isso no seu turno, com uma ação bônus, enquanto a magia estiver em efeito. O objeto permanece real por 1 minuto. Por exemplo, você pode criar uma ilusão de uma ponte sobre um abismo e depois torná-la real tempo suficiente para que seus aliados a atravessem.
                    O objeto não pode causar dano ou qualquer tipo de ferimento direto a ninguém.
                `
            }
        ];
    }
}