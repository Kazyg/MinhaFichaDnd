import { SubClasses } from "../classesPrincipais/SubClasses";

export class CombatenteDasSombras2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Combatente das Sombras", "Combatentes das Sombras praticam furtividade e subterfúgios, usando o poder do Sombral para se esconder, fugir e assumir formas fantasmagóricas.");
        this.niveis = [
            { nome: "Artes das Sombras", nivel: 3, descricao: "Você pode gastar 1 Ponto de Foco para conjurar Escuridão sem componentes de magia, podendo ver na área da magia e movê-la para um espaço a até 18 metros de si no início de cada um dos seus turnos. Você conhece Ilusão Menor, usando Sabedoria como atributo de conjuração. Você também adquire Visão no Escuro de 18 metros ou aumenta seu alcance em 18 metros se já a possuir." },
            { nome: "Passo da Sombra", nivel: 6, descricao: "Enquanto estiver inteiramente em Meia-luz ou Escuridão, você pode executar uma Ação Bônus para se teleportar até 18 metros para um espaço desocupado à sua vista também sob Meia-luz ou Escuridão. Você tem Vantagem no próximo ataque corpo a corpo que realizar antes do final do turno atual." },
            { nome: "Passo da Sombra Aprimorado", nivel: 11, descricao: "Ao usar Passo da Sombra, você pode gastar 1 Ponto de Foco para remover o requisito de iniciar ou encerrar o teleporte em Meia-luz ou Escuridão. Como parte desta Ação Bônus, você pode realizar um Ataque Desarmado imediatamente após se teleportar." },
            { nome: "Manto da Sombra", nivel: 17, descricao: "Como uma ação Usar Magia enquanto estiver inteiramente em Meia-luz ou Escuridão, você pode gastar 3 Pontos de Foco para envolver-se em sombras por 1 minuto, até ficar Incapacitado ou encerrar seu turno em Luz Plena. Enquanto durar, você tem a condição Invisível, pode se mover por espaços ocupados como Terreno Difícil e pode usar Torrente de Golpes sem gastar Pontos de Foco." }
        ];
    }
}
