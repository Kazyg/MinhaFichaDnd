import { SubClasses } from "../classesPrincipais/SubClasses";

export class CombatenteDaMaoEspalmada2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Combatente da Mão Espalmada", "Combatentes da Mão Espalmada são mestres do combate desarmado, capazes de empurrar, derrubar oponentes e manipular a própria energia para resistir a danos.");
        this.niveis = [
            { nome: "Técnica da Mão Espalmada", nivel: 3, descricao: "Ao atingir uma criatura com um ataque concedido por sua Torrente de Golpes, você pode impor um efeito: Derrubar, forçando salvaguarda de Destreza ou deixando o alvo Caído; Desorientar, impedindo Ataques de Oportunidade até o início do próximo turno dele; ou Empurrar, forçando salvaguarda de Força ou empurrando o alvo até 4,5 metros para longe de você." },
            { nome: "Integridade Corporal", nivel: 6, descricao: "Como uma Ação Bônus, você pode jogar seu dado de Artes Marciais e recuperar Pontos de Vida iguais ao resultado mais seu modificador de Sabedoria, mínimo 1. Você pode usar esta característica um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, e recupera todos os usos ao completar um Descanso Longo." },
            { nome: "Passo Veloz", nivel: 11, descricao: "Ao executar uma Ação Bônus diferente de Passo do Vento, você também pode usar Passo do Vento imediatamente após essa Ação Bônus." },
            { nome: "Palma Vibrante", nivel: 17, descricao: "Ao acertar uma criatura com um Ataque Desarmado, você pode gastar 4 Pontos de Foco para iniciar vibrações imperceptíveis que duram um número de dias igual ao seu nível de Monge. Você pode encerrá-las com uma Ação ou renunciando a um ataque da ação Atacar; o alvo deve realizar salvaguarda de Constituição, sofrendo 10d12 de dano Energético em falha ou metade em sucesso. Você pode ter apenas uma criatura sob este efeito por vez." }
        ];
    }
}
