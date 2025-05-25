import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class CirculoDoPastor extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
        magias: { terreno: string; magias: string[] }[];
    }[];

    constructor() {
        super(
            "Círculo do Pastor",
            "Os Druidas do Círculo do Pastor comungam com os espíritos da natureza, especialmente os espíritos dos animais e das fadas, e chamam a esses espíritos para ajudar. Esses druidas reconhecem que todos os seres vivos desempenham um papel no mundo natural, no entanto, eles se concentram em proteger animais e criaturas feéricas que têm dificuldade em se defender. Os pastores, como são conhecidos, veem essas criaturas como suas responsabilidades. Eles impedem os monstros que os ameaçam, repreendem os caçadores que matam mais presas do que o necessário e impedem a civilização de invadir os habitats raros dos animais e os locais sagrados para as fadas."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Voz da Natureza",
                nivel: 2,
                descricao: `
                    No 2° nível, você ganha a capacidade de conversar com bestas e muitos feéricos.
                    
                    Você aprende a falar, ler e escrever Silvestre. Além disso, os animais podem entender o seu discurso, e você ganha a capacidade de decifrar seus ruídos e movimentos. A maioria dos animais não tem inteligência para transmitir ou entender conceitos sofisticados, mas uma besta amigável pode transmitir o que viu ou ouviu no passado recente. Esta habilidade não lhe concede amizade com bestas, embora você possa combinar essa habilidade com presentes para angariar favores com eles como faria com qualquer NPC.
                `,
                magias: []
            },
            {
                nome: "Espírito Totêmico",
                nivel: 2,
                descricao: `
                    A partir do 2° nível, você pode chamar espíritos da natureza para influenciar o mundo ao seu redor. Com uma ação bônus, você pode invocar magicamente um espírito incorpóreo até um ponto que possa ver em até 18 metros de alcance. O espírito cria uma aura em um raio de 9 metros em torno desse ponto. Ele conta como nem uma criatura nem um objeto, embora tenha a aparência espectral da criatura que representa.
                    
                    Como uma ação bônus, você pode mover o espírito até 18 metros em um ponto que possa ver. O espírito persiste por 1 minuto ou até você ficar incapacitado. Depois de usar essa característica, não pode usá-la novamente até terminar um descanso curto ou longo.
                    
                    O efeito da aura do espírito depende do tipo de espírito que você convoca:
                    
                    - Espírito do Urso: Concede pontos de vida temporários (5 + seu nível de druida) e vantagem em testes de Força.
                    - Espírito do Falcão: Permite conceder vantagem em ataques como reação e vantagem em Percepção.
                    - Espírito do Unicórnio: Vantagem em detectar criaturas e cura adicional quando você cura aliados.
                `,
                magias: []
            },
            {
                nome: "Invocador Poderoso",
                nivel: 6,
                descricao: `
                    A partir do 6° nível, bestas e feéricos que você conjure são mais resistentes do que o normal. Qualquer besta ou feérico convocado ou criado por uma magia que tenha usado ganha os seguintes benefícios:
                    
                    - A criatura surge com mais pontos de vida do que o normal: 2 pontos de vida adicionais por cada Dado de Vida que ela tenha.
                    - O dano de suas armas naturais será considerado mágico com o objetivo de superar a imunidade e resistência a ataques e danos não mágicos.
                `,
                magias: []
            },
            {
                nome: "Espírito Guardião",
                nivel: 10,
                descricao: `
                    A partir do 10° nível, o seu Espírito Totêmico protege os animais e feéricos que invoque com sua magia. Quando uma besta ou feérico que tenha convocado ou criado com uma magia termina seu turno na aura do Espírito Totêmico, essa criatura recupera pontos de vida iguais a metade do nível de druida.
                `,
                magias: []
            },
            {
                nome: "Chamado de Fidelidade",
                nivel: 14,
                descricao: `
                    A partir do 14° nível, os espíritos da natureza com os quais você comunga o protegem quando estiver mais indefeso. Se você for reduzido a 0 pontos de vida ou estiver incapacitado contra sua vontade, pode ganhar imediatamente os benefícios da magia conjurar animais, como se fosse conjurado usando um espaço de magias do nível 9.
                    
                    Convoca quatro bestas de sua escolha, desde que sejam de um nível de desafio 2 ou inferior. Os animais conjurados aparecem em até 6 metros de alcance. Se eles não recebem nenhum comando seu, eles o protegem contra danos e atacam seus inimigos. A magia dura 1 hora, não requer nenhuma concentração, ou até que a descarte (não é necessária nenhuma ação).
                    
                    Depois de usar esta característica, não pode usá-la novamente até terminar um descanso longo.
                `,
                magias: []
            }
        ];
    }
}