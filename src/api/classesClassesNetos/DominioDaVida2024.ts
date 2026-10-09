import { SubClasses } from "../classesPrincipais/SubClasses";

export class DominioDaVida2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Domínio da Vida", "O Domínio da Vida se concentra na energia positiva que sustenta a vida, tornando seus clérigos mestres da cura.");
        this.niveis = [
            {
                nome: "Magias de Domínio da Vida",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Auxílio, Bênção, Curar Ferimentos e Restauração Menor; no nível 5, Palavra Curativa em Massa e Revivificar; no nível 7, Aura de Vida e Proteção Contra a Morte; no nível 9, Curar Ferimentos em Massa e Restauração Maior."
            },
            {
                nome: "Discípulo da Vida",
                nivel: 3,
                descricao: "Ao conjurar uma magia com espaço de magia que restaura Pontos de Vida em uma criatura, essa criatura recupera Pontos de Vida adicionais no turno da conjuração. Os Pontos de Vida adicionais são iguais a 2 + o círculo do espaço de magia."
            },
            {
                nome: "Preservar a Vida",
                nivel: 3,
                descricao: "Com uma ação Usar Magia, você exibe seu Símbolo Sagrado e usa Canalizar Divindade para restaurar um total de Pontos de Vida igual a cinco vezes seu nível de Clérigo. Escolha criaturas Sangrando a até 9 metros, incluindo você se quiser, e divida esses Pontos de Vida entre elas. Esta característica não pode restaurar uma criatura a mais que metade dos Pontos de Vida máximos dela."
            },
            {
                nome: "Curandeiro Abençoado",
                nivel: 6,
                descricao: "Imediatamente após conjurar uma magia com espaço de magia que restaure Pontos de Vida em uma criatura que não seja você, você recupera Pontos de Vida iguais a 2 + o círculo do espaço de magia."
            },
            {
                nome: "Cura Suprema",
                nivel: 17,
                descricao: "Ao usar uma magia ou Canalizar Divindade para restaurar Pontos de Vida em uma criatura, não jogue os dados normalmente; em vez disso, use o maior resultado possível de cada dado."
            }
        ];
    }
}
