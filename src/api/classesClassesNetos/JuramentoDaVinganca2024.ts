import { SubClasses } from "../classesPrincipais/SubClasses";

export class JuramentoDaVinganca2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Juramento da Vingança", "O Juramento de Vingança é um compromisso solene de punir quem comete graves atos imorais e combater injustiças a qualquer custo.");
        this.niveis = [
            { nome: "Magias do Juramento da Vingança", nivel: 3, descricao: "Você sempre tem preparadas as magias do juramento conforme seu nível de Paladino: nível 3, Marca do Predador e Perdição; nível 5, Paralisar Pessoa e Passo Nebuloso; nível 9, Celeridade e Proteção contra Energia; nível 13, Banimento e Porta Dimensional; nível 17, Paralisar Monstro e Vidência." },
            { nome: "Voto de Inimizade", nivel: 3, descricao: "Ao executar a ação Atacar, você pode gastar um uso de Canalizar Divindade para proferir um voto contra uma criatura à sua vista a até 9 metros. Você tem Vantagem em jogadas de ataque contra a criatura por 1 minuto ou até usar esta característica novamente. Se a criatura cair a 0 Pontos de Vida antes do fim do voto, você pode transferi-lo para outra criatura a até 9 metros, sem ação." },
            { nome: "Vingador Implacável", nivel: 7, descricao: "Ao atingir uma criatura com um Ataque de Oportunidade, você pode reduzir o Deslocamento dela para 0 até o final do turno atual. Então, pode se mover até metade do seu Deslocamento como parte da mesma Reação, sem provocar Ataques de Oportunidade." },
            { nome: "Alma Vingativa", nivel: 15, descricao: "Imediatamente após uma criatura sob efeito do seu Voto de Inimizade acertar ou errar com uma jogada de ataque, você pode executar uma Reação para realizar um ataque corpo a corpo contra essa criatura se ela estiver ao seu alcance." },
            { nome: "Anjo Vingador", nivel: 20, descricao: "Como uma Ação Bônus, você ganha por 10 minutos uma Aura Amedrontadora e asas espectrais. Inimigos que iniciam o turno em sua Aura de Proteção devem passar em salvaguarda de Sabedoria ou ficam Amedrontados por 1 minuto ou até sofrer dano, e ataques contra eles têm Vantagem. Você também recebe Deslocamento de Voo de 18 metros e pode pairar. Você recupera o uso ao completar Descanso Longo ou gastando um espaço de magia de 5º círculo." }
        ];
    }
}
