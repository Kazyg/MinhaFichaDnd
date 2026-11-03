import { SubClasses } from "../classesPrincipais/SubClasses";

export class Assassino2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Assassino", "O treinamento de um Assassino se concentra em usar furtividade, veneno e disfarce para eliminar inimigos com eficiência mortal.");
        this.niveis = [
            { nome: "Assassinar", nivel: 3, descricao: "Você tem Vantagem nas jogadas de Iniciativa. Durante a primeira rodada de cada combate, você tem Vantagem em jogadas de ataque contra qualquer criatura que ainda não tenha realizado o turno. Caso seu Ataque Furtivo atinja qualquer alvo nessa rodada, o alvo sofre dano adicional do tipo da arma igual ao seu nível de Ladino." },
            { nome: "Ferramentas de Assassino", nivel: 3, descricao: "Você adquire um Kit de Disfarce e um Kit de Veneno, e tem proficiência com eles." },
            { nome: "Especialista em Infiltração", nivel: 9, descricao: "Você pode imitar perfeitamente a fala, a caligrafia ou ambas de outra pessoa se tiver passado pelo menos 1 hora estudando-as. Além disso, ao usar Mira Firme, seu Deslocamento não é reduzido a 0." },
            { nome: "Armas Venenosas", nivel: 13, descricao: "Ao usar a opção Envenenar do seu Golpe Astuto, o alvo também sofre 2d6 pontos de dano Venenoso sempre que falhar na salvaguarda. Esse dano ignora Resistência a dano Venenoso." },
            { nome: "Golpe Mortal", nivel: 17, descricao: "Ao acertar com seu Ataque Furtivo na primeira rodada de um combate, o alvo deve ser bem-sucedido em uma salvaguarda de Constituição contra CD 8 + seu modificador de Destreza + seu Bônus de Proficiência ou o dano do ataque é dobrado contra ele." }
        ];
    }
}
