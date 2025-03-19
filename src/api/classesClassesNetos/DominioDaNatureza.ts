import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaNatureza extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Natureza",
            "Os deuses da natureza são tão variados como a própria natureza do mundo, desde deuses inescrutáveis de profundas florestas (como Silvanus, Obad-Hai, Chislev, Balinor e Pã) até divindades amigáveis associadas a alguma fonte ou bosque em particular (como Eldath). Druidas reverenciam a natureza como um todo e podem vir a servir essas divindades, praticando ritos misteriosos e recitando orações a muito esquecidas em sua própria língua secreta. Porém, muitos desses deuses também possuem clérigos, campeões que têm um papel mais ativo em promover os interesses particulares de um deus da natureza. Esses clérigos devem caçar monstruosidades malignas que usurpam dos bosques, abençoar a colheita dos fiéis ou murchar a cultura dos que irritarem seus deuses."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio da Natureza",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | amizade animal, falar com animais
                    3°               | pele de árvore, crescer espinhos
                    5°               | ampliar plantas, muralha de vento
                    7°               | dominar besta, vinha esmagadora
                    9°               | praga de insetos, caminhar em árvores
                `
            },
            {
                nome: "Acólito da Natureza",
                nivel: 1,
                descricao: `
                    No 1° nível, você aprende um truque de druida, à sua escolha. Você também ganha proficiência em uma das seguintes perícias, à sua escolha: Adestrar Animais, Natureza ou Sobrevivência.
                `
            },
            {
                nome: "Proficiência Adicional",
                nivel: 1,
                descricao: "Também a partir do 1° nível, você adquire proficiência com armaduras pesadas."
            },
            {
                nome: "Canalizar Divindade: Enfeitiçar Animais e Plantas",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode usar seu Canalizar Divindade para enfeitiçar animais e plantas. Com uma ação, você ergue seu símbolo sagrado e invoca o nome do seu deus. Cada besta ou criatura-planta que puder ver você num raio de 9 metros deve realizar um teste de resistência de Sabedoria. Se a criatura falhar, ela estará enfeitiçada por você durante 1 minuto ou até sofrer dano. Enquanto estiver enfeitiçada por você, ela será amistosa a você e às criaturas que você designar.
                `
            },
            {
                nome: "Amortecer Elementos",
                nivel: 6,
                descricao: `
                    No 6° nível, quando você ou uma criatura a até 9 metros de você sofrer dano de ácido, frio, fogo, elétrico ou trovão, você pode usar sua reação para conceder resistência à criatura contra aquele tipo de dano.
                `
            },
            {
                nome: "Golpe Divino",
                nivel: 8,
                descricao: `
                    No 8º nível, você ganha a habilidade de imbuir seus ataques com energia divina. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você pode fazer o ataque causar 1d8 de dano de frio, fogo ou elétrico (à sua escolha) extra ao alvo. Quando alcançar o 14º nível, o dano extra aumenta para 2d8.
                `
            },
            {
                nome: "Senhor da Natureza",
                nivel: 17,
                descricao: `
                    A partir do 17° nível, você ganha a habilidade de comandar animais e criaturas-planta. Enquanto a criatura estiver enfeitiçada pela sua característica Enfeitiçar Animais e Plantas, você pode usar uma ação bônus no seu turno para dizer verbalmente o que cada uma dessas criaturas deve fazer no próximo turno delas.
                `
            }
        ];
    }
}