import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class DominioDaGuerra extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Domínio da Guerra",
            "A guerra tem muitas manifestações. Ela pode tornar pessoas comuns em heróis. Ela pode ser desesperadora e horripilante, com atos de crueldade e covardia obscurecendo momentos de bravura e coragem. Em ambos os casos, os deuses da guerra zelam pelos guerreiros e os recompensa pelos seus grandes feitos. Os clérigos de tais deuses se sobressaem em batalha, inspirando os outros a lutar o bom combate ou oferecendo atos de violência como suas orações. Entre os deuses da guerra estão inclusos campeões da honra e bravura (como Torm, Heironeous e Kir-Jolith) assim como deuses da destruição e pilhagem (como Erythnul, a Fúria, Gruumsh e Ares) e deuses da conquista e dominação (como Bane, Hextor e Maglubiyet). Outros deuses da guerra (como Tempus, Nike e Nuada) tomam uma postura mais neutra, promovendo a guerra em todas as suas manifestações e apoiando os guerreiros em qualquer circunstância."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Magias do Domínio da Guerra",
                nivel: 1,
                descricao: `
                    Nível de Clérigo | Magias
                    1°               | auxílio divino, escudo da fé
                    3°               | arma mágica, arma espiritual
                    5°               | manto do cruzado, espíritos guardiões
                    7°               | movimentação livre, pele de pedra
                    9°               | coluna de chamas, imobilizar monstro
                `
            },
            {
                nome: "Proficiência Adicional",
                nivel: 1,
                descricao: "No 1° nível, você adquire proficiência em armas marciais e em armaduras pesadas."
            },
            {
                nome: "Sacerdote da Guerra",
                nivel: 1,
                descricao: `
                    A partir do 1° nível, seu deus envia rajadas de inspiração a você quando você está engajado em combate. Quando você usa a ação de Ataque, você pode realizar um ataque com arma, com uma ação bônus. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (mínimo uma vez). Você recupera todos os usos gastos após terminar um descanso longo.
                `
            },
            {
                nome: "Canalizar Divindade: Ataque Dirigido",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode usar seu Canalizar Divindade para golpear com precisão sobrenatural. Quando você realiza uma jogada de ataque, você pode usar seu Canalizar Divindade para receber +10 de bônus na jogada. Você realiza essa escolha depois de ver a rolagem, mas antes do Mestre dizer se o ataque atingiu ou errou.
                `
            },
            {
                nome: "Canalizar Divindade: Bênção do Deus da Guerra",
                nivel: 6,
                descricao: `
                    No 6° nível, quando uma criatura a até 9 metros de você realizar uma jogada de ataque, você pode usar sua reação para conceder à criatura +10 de bônus nessa jogada, usando seu Canalizar Divindade. Você realiza essa escolha depois de ver a rolagem, mas antes do Mestre dizer se o ataque atingiu ou errou.
                `
            },
            {
                nome: "Golpe Divino",
                nivel: 8,
                descricao: `
                    No 8º nível, você ganha a habilidade de imbuir seus ataques com energia divina. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você pode fazer o ataque causar 1d8 de dano extra do mesmo tipo do dano da arma ao alvo. Quando alcançar o 14º nível, o dano extra aumenta para 2d8.
                `
            },
            {
                nome: "Avatar da Batalha",
                nivel: 17,
                descricao: `
                    A partir do 17° nível, você ganha resistência a dano de concussão, cortante e perfurante de ataques não-mágicos.
                `
            }
        ];
    }
}