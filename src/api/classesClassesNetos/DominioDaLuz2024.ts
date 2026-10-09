import { SubClasses } from "../classesPrincipais/SubClasses";

export class DominioDaLuz2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Domínio da Luz", "O Domínio da Luz destaca o poder divino de gerar labaredas e revelação, afastando mentiras e dissipando trevas.");
        this.niveis = [
            {
                nome: "Brilho do Amanhecer",
                nivel: 3,
                descricao: "Como ação Usar Magia, você ergue seu Símbolo Sagrado e gasta um uso de Canalizar Divindade para emitir luz em uma Emanação de 9 metros. Escuridão mágica na área é dissipada. Cada criatura à sua escolha na área deve realizar salvaguarda de Constituição, sofrendo dano Radiante igual a 2d10 + seu nível de Clérigo se falhar, ou metade em caso de sucesso."
            },
            {
                nome: "Labareda Protetora",
                nivel: 3,
                descricao: "Quando uma criatura à sua vista a até 9 metros realiza uma jogada de ataque, você pode executar uma Reação para impor Desvantagem nessa jogada. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, e recupera todos os usos gastos ao completar Descanso Longo."
            },
            {
                nome: "Magias de Domínio da Luz",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Fogo das Fadas, Mãos Ardentes, Raio Ardente e Ver o Invisível; no nível 5, Bola de Fogo e Luz do Dia; no nível 7, Muralha de Fogo e Olho Arcano; no nível 9, Coluna de Chamas e Vidência."
            },
            {
                nome: "Labareda Protetora Aprimorada",
                nivel: 6,
                descricao: "Você restaura todos os usos gastos de Labareda Protetora ao completar Descanso Curto ou Longo. Além disso, sempre que usar Labareda Protetora, pode conceder ao alvo do ataque um número de Pontos de Vida Temporários igual a 2d6 + seu modificador de Sabedoria."
            },
            {
                nome: "Coroa de Luz",
                nivel: 17,
                descricao: "Como ação Usar Magia, você emite uma aura de luz solar por 1 minuto ou até encerrá-la. Você emite Luz Plena em 18 metros e Meia-luz por mais 9 metros. Inimigos na Luz Plena têm Desvantagem em salvaguardas contra seu Brilho do Amanhecer e contra magias suas que causem dano Ígneo ou Radiante. Você pode usar esta característica um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, e recupera todos os usos ao completar Descanso Longo."
            }
        ];
    }
}
