import { SubClasses } from "../classesPrincipais/SubClasses";

export class ColegioDoConhecimento2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Colégio do Conhecimento", "Bardos do Colégio do Conhecimento colecionam magias e segredos de fontes diversas, expondo corrupção, desvendando mentiras e satirizando figuras de autoridade.");
        this.niveis = [
            {
                nome: "Palavras de Interrupção",
                nivel: 3,
                descricao: "Quando uma criatura à sua vista a até 18 metros realizar uma jogada de dano, ou for bem-sucedida em um teste de atributo ou jogada de ataque, você pode executar uma Reação para gastar uma Inspiração de Bardo. Jogue o dado e subtraia o resultado da jogada da criatura, reduzindo o dano ou transformando potencialmente o sucesso em fracasso."
            },
            {
                nome: "Proficiências Bônus",
                nivel: 3,
                descricao: "Você adquire proficiência em três perícias à sua escolha."
            },
            {
                nome: "Descobertas Mágicas",
                nivel: 6,
                descricao: "Você aprende duas magias à sua escolha das listas de Clérigo, Druida ou Mago, ou uma combinação dessas listas. A magia escolhida deve ser um truque ou uma magia para a qual você tenha espaços de magia disponíveis. Você sempre tem as magias escolhidas preparadas e pode substituí-las ao adquirir novo nível de Bardo."
            },
            {
                nome: "Perícia Inigualável",
                nivel: 14,
                descricao: "Quando você realizar um teste de atributo ou uma jogada de ataque e falhar, pode gastar um uso da Inspiração de Bardo; jogue o dado e adicione o resultado ao d20, transformando potencialmente a falha em sucesso. Se ainda falhar, o uso da Inspiração de Bardo não é gasto."
            }
        ];
    }
}
