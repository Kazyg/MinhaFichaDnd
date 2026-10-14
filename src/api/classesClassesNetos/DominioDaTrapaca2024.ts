import { SubClasses } from "../classesPrincipais/SubClasses";

export class DominioDaTrapaca2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Domínio da Trapaça", "O Domínio da Trapaça fornece magias de enganação, ilusão e furtividade para pregar peças, zombar de tiranos e desafiar autoridades.");
        this.niveis = [
            {
                nome: "Magias de Domínio da Trapaça",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Disfarçar-se, Enfeitiçar Pessoa, Invisibilidade e Passo Sem Rastro; no nível 5, Indetectável e Padrão Hipnótico; no nível 7, Confusão e Porta Dimensional; no nível 9, Dominar Pessoa e Modificar Memória."
            },
            {
                nome: "Bênção do Trapaceiro",
                nivel: 3,
                descricao: "Com uma ação Usar Magia, você escolhe a si ou uma criatura voluntária a até 9 metros para ter Vantagem em testes de Destreza (Furtividade). A bênção permanece até você completar Descanso Longo ou usar esta característica novamente."
            },
            {
                nome: "Invocar Duplicidade",
                nivel: 3,
                descricao: "Como Ação Bônus, você pode gastar um uso de Canalizar Divindade para criar uma ilusão visual perfeita de si em um espaço desocupado à sua vista a até 9 metros. Ela dura 1 minuto e permite conjurar magias como se estivesse no espaço da ilusão, obter Vantagem contra criaturas próximas dela e movê-la até 9 metros como Ação Bônus."
            },
            {
                nome: "Transposição do Trapaceiro",
                nivel: 6,
                descricao: "Ao executar a Ação Bônus para criar ou mover a ilusão de Invocar Duplicidade, você pode se teleportar, trocando de lugar com a ilusão."
            },
            {
                nome: "Duplicidade Aprimorada",
                nivel: 17,
                descricao: "Sua ilusão de Invocar Duplicidade concede Vantagem também aos ataques dos seus aliados contra criaturas a até 1,5 metro da ilusão. Além disso, quando a ilusão termina, você ou uma criatura à sua escolha a até 1,5 metro dela recupera Pontos de Vida iguais ao seu nível de Clérigo."
            }
        ];
    }
}
