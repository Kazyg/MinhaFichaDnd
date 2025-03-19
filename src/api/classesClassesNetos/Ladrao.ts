import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class Ladrao extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Ladrão",
            "Você aprimorou suas habilidades na arte do furto de pequenos itens. Gatunos, bandidos, batedores de carteira e outros criminosos geralmente seguem esse arquétipo, mas também aqueles ladinos que preferem se ver como caçadores de tesouro profissionais, exploradores de masmorras e investigadores. Além de aprimorar sua agilidade e furtividade, você aprende perícias úteis para desbravar ruínas antigas, ler idiomas incomuns e usar itens mágicos que normalmente não poderia."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Mãos Rápidas",
                nivel: 3,
                descricao: `
                    A partir do 3º nível, você pode usar a sua ação bônus concedida pela Ação Ardilosa para fazer um teste de Destreza (Prestidigitação), usar suas ferramentas de ladrão para desarmar uma armadilha ou abrir uma fechadura, ou realizar a ação de Usar um Objeto.
                `
            },
            {
                nome: "Andarilho de Telhados",
                nivel: 3,
                descricao: `
                    No 3º nível, você adquire a habilidade de escalar mais rápido que o normal. Escalar agora não possui custo adicional de movimento para você.
                    Além disso, quando você fizer um salto com corrida, o alcance que pode saltar aumenta um número de metros igual a 0,3 vezes o seu modificador de Destreza.
                `
            },
            {
                nome: "Furtividade Suprema",
                nivel: 9,
                descricao: `
                    A partir do 9º nível, você tem vantagem no teste de Destreza (Furtividade) se você não mover-se mais do que a metade de seu deslocamento em um turno.
                `
            },
            {
                nome: "Usar Instrumento Mágico",
                nivel: 13,
                descricao: `
                    No 13º nível, você aprende o suficiente sobre como a magia funciona e pode improvisar o uso de itens que nem mesmo foram destinados a você. Você ignora todos os requisitos de classes, raças e níveis para uso de qualquer item mágico.
                `
            },
            {
                nome: "Reflexos de Ladrão",
                nivel: 17,
                descricao: `
                    Quando atinge o 17º nível, você se torna adepto em fazer emboscadas e fugas rápidas de situações perigosas. Você pode realizar dois turnos durante o primeiro turno de cada combate. Você realiza seu primeiro turno na sua iniciativa e o segundo na ordem de sua iniciativa menos 10.
                    Você não pode usar essa característica quando está surpreso.
                `
            }
        ];
    }
}
