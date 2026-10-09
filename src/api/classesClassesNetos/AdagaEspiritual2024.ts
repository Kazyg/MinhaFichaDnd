import { SubClasses } from "../classesPrincipais/SubClasses";

export class AdagaEspiritual2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Adaga Espiritual", "Um Adaga Espiritual ataca mentalmente, rompendo barreiras físicas e psíquicas, canalizando poder psiônico para realizar atos ardilosos.");
        this.niveis = [
            { nome: "Lâminas Psíquicas", nivel: 3, descricao: "Ao executar a ação Atacar ou realizar um Ataque de Oportunidade, você pode manifestar uma Lâmina Psíquica em sua mão livre. Ela é uma arma simples corpo a corpo, causa 1d6 de dano Psíquico mais o modificador usado no ataque, possui Acuidade e Arremesso 18/36 metros, e usa a maestria Afligir sem contar no limite de Maestria em Armas. Após atacar com ela no seu turno, você pode realizar um ataque com uma segunda lâmina como Ação Bônus se a outra mão estiver livre; esse ataque causa 1d4 em vez de 1d6." },
            { nome: "Poder Psiônico", nivel: 3, descricao: "Você possui Dados de Energia Psiônica: no nível 3, 4d6; nível 5, 6d8; nível 9, 8d8; nível 11, 8d10; nível 13, 10d10; nível 17, 12d12. Você recupera um dado gasto ao completar Descanso Curto e todos ao completar Descanso Longo. Seus poderes incluem Aptidão Reforçada Psiquicamente, para adicionar um dado a testes de perícia ou ferramenta em que tenha proficiência, e Sussurros Psíquicos, para estabelecer comunicação telepática com criaturas à vista." },
            { nome: "Lâminas da Alma", nivel: 9, descricao: "Você ganha Golpes Teleguiados, permitindo jogar um Dado de Energia Psiônica e adicioná-lo a uma jogada de ataque errada com Lâmina Psíquica, gastando o dado apenas se transformar o erro em acerto. Você também ganha Teleporte Psíquico, manifestando e arremessando uma lâmina como Ação Bônus para se teleportar até um espaço desocupado à vista a uma distância em metros igual a 3 vezes o resultado do dado gasto." },
            { nome: "Véu Psíquico", nivel: 13, descricao: "Como uma ação Usar Magia, você tem a condição Invisível por 1 hora ou até encerrar o efeito, causar dano ou forçar uma criatura a realizar uma salvaguarda. Você recupera o uso ao completar Descanso Longo ou pode usá-lo novamente gastando um Dado de Energia Psiônica." },
            { nome: "Rasgar Mente", nivel: 17, descricao: "Ao causar dano de Ataque Furtivo com uma Lâmina Psíquica, você pode forçar o alvo a realizar uma salvaguarda de Sabedoria contra CD 8 + seu modificador de Destreza + seu Bônus de Proficiência. Em falha, o alvo fica Atordoado por 1 minuto e repete a salvaguarda no final de cada turno. Você recupera o uso ao completar Descanso Longo ou pode usá-lo novamente gastando três Dados de Energia Psiônica." }
        ];
    }
}
