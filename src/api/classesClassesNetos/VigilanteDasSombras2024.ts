import { SubClasses } from "../classesPrincipais/SubClasses";

export class VigilanteDasSombras2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Vigilante das Sombras", "Você aproveita magia extraída do Sombral para combater inimigos que se escondem na escuridão.");
        this.niveis = [
            { nome: "Emboscador das Sombras", nivel: 3, descricao: "Ao jogar Iniciativa, você pode adicionar seu modificador de Sabedoria. Uma vez por turno ao atingir com arma, pode causar 2d6 de dano Psíquico adicional; pode usar isso um número de vezes igual ao seu modificador de Sabedoria, mínimo uma vez, recuperando os usos ao completar Descanso Longo. No início do seu primeiro turno de cada combate, seu Deslocamento aumenta em 3 metros até o final do turno." },
            { nome: "Magias do Vigilante das Sombras", nivel: 3, descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Disfarçar-se; no nível 5, Corda Extradimensional; no nível 9, Medo; no nível 13, Invisibilidade Maior; no nível 17, Similaridade." },
            { nome: "Visão Umbrosa", nivel: 3, descricao: "Você adquire Visão no Escuro de 18 metros. Se já possui Visão no Escuro, o alcance aumenta em 18 metros. Enquanto estiver inteiramente na Escuridão, você fica Invisível para criaturas que dependam de Visão no Escuro para vê-lo nessa Escuridão." },
            { nome: "Mente de Ferro", nivel: 7, descricao: "Você adquire proficiência em salvaguardas de Sabedoria. Se já tem essa proficiência, adquire proficiência em salvaguardas de Carisma ou Inteligência, à sua escolha." },
            { nome: "Torrente do Vigilante", nivel: 11, descricao: "O dano psíquico de Golpe Terrível torna-se 2d8. Além disso, ao usar o Golpe Terrível de Emboscador das Sombras, pode aplicar Golpe Repentino para realizar outro ataque com a mesma arma contra criatura diferente a até 1,5 metro do alvo original e no alcance, ou Medo em Massa para forçar o alvo e criaturas a até 3 metros a fazerem salvaguarda de Sabedoria contra sua CD de magia, ficando Amedrontadas até o início do seu próximo turno em caso de falha." },
            { nome: "Esquiva Sombria", nivel: 15, descricao: "Quando uma criatura realiza uma jogada de ataque contra você, você pode usar sua Reação para impor Desvantagem nessa jogada. Acerte ou erre, você pode se teleportar até 9 metros para um espaço desocupado à sua vista." }
        ];
    }
}
