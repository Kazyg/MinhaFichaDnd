import { SubClasses } from "../classesPrincipais/SubClasses";

export class CirculoDoMar2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Círculo do Mar", "Druidas do Círculo do Mar canalizam as forças tempestuosas dos oceanos e tormentas, tornando-se unos com marés e tempestades.");
        this.niveis = [
            {
                nome: "Ira do Mar",
                nivel: 3,
                descricao: "Como Ação Bônus, você pode gastar um uso de Forma Selvagem para manifestar uma Emanação de 1,5 metro ao seu redor por 10 minutos. Ao manifestá-la e como Ação Bônus em turnos seguintes, escolha uma criatura à sua vista na Emanação. Ela realiza salvaguarda de Constituição contra sua CD de magia ou sofre dano Gélido igual a um número de d6s igual ao seu modificador de Sabedoria, mínimo um dado, e se for Grande ou menor é empurrada até 4,5 metros para longe de você."
            },
            {
                nome: "Magias do Círculo do Mar",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Despedaçar, Lufada de Vento, Névoa Obscurecente, Onda Trovejante e Raio de Gelo; no nível 5, Relâmpago e Respirar na Água; no nível 7, Controlar Água e Tempestade Glacial; no nível 9, Invocar Elemental e Paralisar Monstro."
            },
            {
                nome: "Afinidade Aquática",
                nivel: 6,
                descricao: "O tamanho da Emanação criada por Ira do Mar aumenta para 3 metros. Além disso, você adquire Deslocamento de Natação igual ao seu Deslocamento."
            },
            {
                nome: "Filho da Tempestade",
                nivel: 10,
                descricao: "Enquanto sua Ira do Mar estiver ativa, você adquire Deslocamento de Voo igual ao seu Deslocamento e Resistência a dano Elétrico, Gélido e Trovejante."
            },
            {
                nome: "Manifestação Oceânica",
                nivel: 14,
                descricao: "Em vez de manifestar a Emanação de Ira do Mar ao seu redor, você pode manifestá-la ao redor de uma criatura voluntária a até 18 metros. Essa criatura recebe todos os benefícios da Emanação, usando sua CD de magia e seu modificador de Sabedoria. Você também pode manifestar a Emanação ao redor de si e da outra criatura ao gastar dois usos de Forma Selvagem em vez de um."
            }
        ];
    }
}
