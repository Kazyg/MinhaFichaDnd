import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class JuramentoDosAnciões extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Juramento dos Anciões",
            "O Juramento dos Anciões é tão antigo quanto a raça dos elfos e os rituais dos druidas. Algumas vezes chamados de cavaleiros feéricos, cavaleiros verdejantes ou cavaleiros dos chifres, paladinos que fazem esse juramento lançam sua sorte com o lado da luz na batalha cósmica contra as trevas, porque eles amam as coisas belas e vivificantes do mundo, não necessariamente porque eles acreditam em princípios de honra, coragem e justiça. Eles adornam suas armaduras e roupas com imagens de coisas que crescem – folhas, galhadas ou flores – para refletir seu comprometimento em preservar a vida e a luz no mundo."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Dogmas dos Anciões",
                nivel: 3,
                descricao: `
                    Os dogmas do Juramento dos Anciões têm sido preservados por incontáveis séculos. Esse juramento enfatiza os princípios do bem acima de qualquer interesse de ordem ou caos. Seus quatro princípios centrais são simples:
                    - **Acenda a Luz**: Através dos seus atos de misericórdia, gentileza e piedade, acenda a luz da esperança no mundo, afastando o desespero.
                    - **Abrigue a Luz**: Onde houver bem, beleza, amor e riso no mundo, mantenha-se contra a maldade que pode engolir isso. Onde a vida floresce, mantenha-se contra as forças que podem torná-la estéril.
                    - **Preserve Sua Própria Luz**: Deleite-se com música e risadas, beleza e arte. Se você permitir que a luz morra em seu coração, você não poderá preservá-la no mundo.
                    - **Seja a Luz**: Seja um glorioso guia para todos que vivem em desespero. Deixe a luz da sua alegria e coragem brilhar através de todos os seus feitos.
                `
            },
            {
                nome: "Magias de Juramento",
                nivel: 3,
                descricao: `
                    Você ganha magias de juramento nos níveis de paladino descritos:
                    - **3° nível**: golpe constritor, falar com animais.
                    - **5° nível**: raio lunar, passo nebuloso.
                    - **9° nível**: ampliar plantas, proteção contra energia.
                    - **13° nível**: tempestade de gelo, pele de pedra.
                    - **17° nível**: comunhão com a natureza, caminhar em árvores.
                `
            },
            {
                nome: "Canalizar Divindade",
                nivel: 3,
                descricao: `
                    Quando você faz esse juramento, no 3° nível, você ganha as duas opções seguintes de Canalizar Divindade:
                    - **Fúria da Natureza**: Você pode usar seu Canalizar Divindade para invocar forças primitivas para enredar um oponente. Com uma ação, você pode fazer com que vinhas espectrais cresçam e alcancem uma criatura a até 3 metros de você, que você possa ver. A criatura deve ser bem sucedida num teste de resistência de Força ou Destreza (a escolha dela) ou ficará impedida. Enquanto estiver impedida pelas vinhas, a criatura repete o teste de resistência no final de cada turno dela. Se obtiver sucesso, ela se liberta e as vinhas desaparecem.
                    - **Expulsar os Infiéis**: Você pode usar seu Canalizar Divindade para pronunciar palavras antigas que são dolorosas para fadas e corruptores que as ouvem. Com uma ação, você ergue seu símbolo sagrado e cada fada ou corruptor que puder ver ou ouvir você e esteja a até 9 metros, deve realizar um teste de resistência de Sabedoria. Se a criatura falhar no teste de resistência, ela será expulsa por 1 minuto ou até sofrer dano. Uma criatura expulsa deve gastar seu turno tentando se mover para longe de você da melhor forma possível e não pode, voluntariamente, se mover para um espaço a menos de 9 metros de você. Ela também não pode realizar reações. Nas ações delas, elas só poderão realizar a ação de Disparada ou tentar escapar de um efeito que as impeça de se mover. Se não houver lugar para se mover, a criatura pode usar a ação de Esquivar.
                `
            },
            {
                nome: "Aura de Vigilância",
                nivel: 7,
                descricao: `
                    A partir do 7° nível, a magia antiga fica tão profunda em você que ela forma uma proteção mística. Você e as criaturas amistosas a até 3 metros têm resistência ao dano de magias.
                    No 18° nível, o alcance dessa aura aumenta para 9 metros.
                `
            },
            {
                nome: "Sentinela Imortal",
                nivel: 15,
                descricao: `
                    A partir do 15° nível, quando você for reduzido a 0 pontos de vida, mas não morrer totalmente, você pode escolher cair para 1 ponto de vida no lugar. Uma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo.
                    Além disso, você não sofre nenhum efeito colateral por envelhecer e você não pode envelhecer magicamente.
                `
            },
            {
                nome: "Campeão dos Anciões",
                nivel: 20,
                descricao: `
                    No 20° nível, você pode assumir a forma de uma antiga força da natureza, tomando a aparência que desejar. Por exemplo, sua pele poderia ficar verde ou adquirir uma textura de casca de árvore, seu cabelo poderia ficar com aparência de folhas ou musgo ou poderia crescer galhadas ou uma juba como a de um leão.
                    Usando sua ação, você sofre uma transformação. Por 1 minuto, você ganha os seguintes benefícios:
                    - No início de cada um dos seus turnos, você recupera 10 pontos de vida.
                    - Sempre que você for conjurar uma magia de paladino que tiver um tempo de conjuração de 1 ação, você pode conjurá-la usando uma ação bônus, ao invés.
                    - Criaturas inimigas a até 3 metros de você têm desvantagem em testes de resistência contra suas magias de paladino e as opções de Canalizar Divindade.
                    Uma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo.
                `
            }
        ];
    }
}