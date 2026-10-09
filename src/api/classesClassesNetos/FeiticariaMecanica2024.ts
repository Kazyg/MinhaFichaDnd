import { SubClasses } from "../classesPrincipais/SubClasses";

export class FeiticariaMecanica2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Feitiçaria Mecânica", "A força cósmica da ordem envolveu você em magia, conectando sua alma a Mecanos ou a um reino semelhante de precisão absoluta.");
        this.niveis = [
            {
                nome: "Magias Mecânicas",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Alarme, Auxílio, Proteção Contra o Bem e o Mal e Restauração Menor; no nível 5, Dissipar Magia e Proteção contra Energia; no nível 7, Invocar Constructo e Movimentação Livre; no nível 9, Muralha de Energia e Restauração Maior. Sua conexão com a ordem também pode se manifestar visualmente por engrenagens, relógios, equações, brilho acobreado ou tiquetaques."
            },
            {
                nome: "Restaurar Equilíbrio",
                nivel: 3,
                descricao: "Quando uma criatura à sua vista a até 18 metros estiver prestes a jogar um d20 com Vantagem ou Desvantagem, você pode usar sua Reação para impedir que a jogada seja afetada por Vantagem e Desvantagem. Você pode usar essa característica um número de vezes igual ao seu modificador de Carisma, mínimo uma vez, recuperando os usos ao completar Descanso Longo."
            },
            {
                nome: "Bastião da Lei",
                nivel: 6,
                descricao: "Como ação Usar Magia, você pode gastar de 1 a 5 Pontos de Feitiçaria para criar uma proteção mágica em você ou em outra criatura à sua vista a até 9 metros. A proteção tem um número de d8s igual aos pontos gastos. Quando a criatura protegida sofre dano, ela pode gastar dados, jogá-los e reduzir o dano pelo resultado. A proteção dura até você completar Descanso Longo ou usar esta característica novamente."
            },
            {
                nome: "Transe da Ordem",
                nivel: 14,
                descricao: "Como Ação Bônus, você entra em um estado de ordem por 1 minuto. Pela duração, jogadas de ataque contra você não podem se beneficiar de Vantagem e, sempre que realizar um Teste de D20, pode tratar resultado 9 ou menor no d20 como 10. Você recupera o uso ao completar Descanso Longo ou gastando 5 Pontos de Feitiçaria."
            },
            {
                nome: "Cavalgada Mecânica",
                nivel: 18,
                descricao: "Como ação Usar Magia, você convoca espíritos de ordem em um Cubo de 9 metros originado em você. Eles restauram até 100 Pontos de Vida divididos entre criaturas à sua escolha no Cubo, encerram magias de 6º círculo ou inferior em criaturas e objetos à sua escolha no Cubo, e reparam instantaneamente objetos danificados inteiramente no Cubo. Você recupera o uso ao completar Descanso Longo ou gastando 7 Pontos de Feitiçaria."
            }
        ];
    }
}
