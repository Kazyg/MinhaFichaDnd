import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class EscolaDeAdivinhacao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Escola de Adivinhação",
            "Os conselhos de um adivinho são procurados tanto pela realeza quanto pelos plebeus comuns, por todos que buscam uma compreensão mais clara do passado, presente e futuro. Como um adivinho, você se esforça para separar os véus do espaço, tempo e da consciência, de modo que você possa ver claramente. Você trabalha para dominar magias de discernimento, visão remota, conhecimento sobrenatural e previsão."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Adivinhação Instruída",
                nivel: 2,
                descricao: `
                    Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de adivinhação em seu grimório é reduzido à metade.
                `
            },
            {
                nome: "Prodígio",
                nivel: 2,
                descricao: `
                    Começando no 2° nível, vislumbres do futuro começam a aparecer em sua consciência. Quando você termina um descanso longo, role dois d20s e anote os números rolados. Você pode substituir qualquer jogada de ataque, teste de resistência ou teste de habilidade feito por você ou por outra criatura que você possa ver por uma das rolagens de premonição.
                    
                    Você deve escolher fazer isso antes da rolagem e pode substituir uma rolagem dessa forma apenas uma vez por rodada.
                    
                    Cada rolagem de premonição pode ser usada apenas uma vez. Quando você termina um descanso longo, você perde qualquer rolagem de premonição que não tenha sido usada.
                `
            },
            {
                nome: "Especialista em Adivinhação",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, conjurar magias de adivinhação se tornou tão fácil para você que isso requer apenas uma fração do seu esforço de conjuração. Quando você conjura uma magia de adivinhação de 2° nível ou superior usando um espaço de magia, você recupera um espaço de magia gasto. O espaço de magia que você recupera deve ser de um nível inferior ao da magia conjurada e não pode ser maior que 5° nível.
                `
            },
            {
                nome: "O Terceiro Olho",
                nivel: 10,
                descricao: `
                    A partir do 10° nível, você pode usar sua ação para aumentar seus poderes de percepção. Quando o fizer, escolha um dos benefícios a seguir, que dura até você ficar incapacitado ou realizar um descanso curto ou longo. Você não pode usar essa característica novamente até ter terminado um descanso longo.
                    
                    - **Visão no Escuro:** Você adquire visão no escuro com alcance de 18 metros.
                    - **Visão Etérea:** Você pode ver no Plano Etéreo com alcance de 18 metros.
                    - **Compreensão Maior:** Você pode ler qualquer idioma.
                    - **Ver Invisibilidade:** Você pode ver criaturas e objetos invisíveis a até 3 metros de você aos quais você tenha linha de visão.
                `
            },
            {
                nome: "Prodígio Maior",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, as visões em seus sonhos se intensificam e pintam um quadro mais preciso na sua mente do que está para acontecer. Você rola três d20s para a sua característica Prodígio, ao invés de dois.
                `
            }
        ];
    }
}
