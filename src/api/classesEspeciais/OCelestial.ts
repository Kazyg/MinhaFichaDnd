import { Patronos } from "./Patronos.class.ts";

export class Celestial extends Patronos {
    constructor() {
        super("O Celestial",
            [
                {
                    nome: "LISTA DE MAGIAS EXPANDIDA",
                    descricao: "O Celestial permite que você escolha uma lista expandida de magias quando aprende uma magia de bruxo. As seguintes magias são adicionadas à sua lista de magias de bruxo."
                },
                {
                    nome: "TRUQUES ADICIONAIS",
                    descricao: "No 1° nível, você aprende os truques luz e chama sagrada. Eles contam como truques de bruxo para você, mas não contam para o seu número de truques conhecidos."
                },
                {
                    nome: "ILUMINAÇÃO CURATIVA",
                    descricao: `No 1° nível, você ganha a capacidade de canalizar energia celestial para curar ferimentos. Você tem um conjunto de d6s que você gasta para alimentar essa cura. O número de dados reserva é igual a 1 + seu nível de bruxo. Como uma ação bônus, você pode curar uma criatura que possa ver a 18 metros de alcance gastando dados dessa reserva. O número máximo de dados que pode gastar ao mesmo tempo é igual ao seu modificador Carisma (mínimo de um dado). Role os dados que gastou, some-os e restaure a quantidade somada em pontos de vida. Sua reserva recupera todos os dados gastos quando você terminar um descanso longo.`
                },
                {
                    nome: "ALMA RADIANTE",
                    descricao: `A partir do 6° nível, sua conexão com o Celestial permite que você sirva como um canal para a energia radiante. Você tem resistência ao dano radiante e quando conjurar uma magia que cause dano radiante ou de fogo, pode adicionar seu modificador de Carisma aos testes de dano radiante ou de dano de fogo dessa magia contra um dos alvos.`
                },
                {
                    nome: "RESILIÊNCIA CELESTIAL",
                    descricao: `A partir do 10° nível, você ganha pontos de vida temporários sempre que terminar um descanso curto ou longo. Esses pontos de vida temporários equivalem ao seu nível bruxo + seu modificador Carisma. Além disso, escolha até cinco criaturas que possa ver no final deste descanso. Essas criaturas ganham, cada uma, pontos de vida temporários iguais a metade do seu nível de bruxo + seu modificador Carisma.`
                },
                {
                    nome: "VINGANÇA ARDENTE",
                    descricao: `A partir do 14° nível, a energia radiante que você canaliza o permite que resista à morte. Quando tiver que realizar um teste de resistência contra a morte no início do seu turno, pode, em vez disso, se levantar com uma explosão de energia radiante. Você recupera pontos de vida iguais à metade do seu ponto de vida máximo, e então se levanta se assim o desejar. Cada criatura de sua escolha que esteja dentro do alcance de 9 metros recebe dano radiante igual a 2d8 + seu modificador Carisma, e está cega até o final do turno atual. Depois de usar esta característica, não pode usá-la novamente até terminar um descanso longo.`
                }
            ],
            [
                "curar ferimentos", "raio guiador",
                "esfera flamejante", "restauração menor",
                "luz do dia", "revivificar",
                "guardião da fé", "muralha de fogo",
                "coluna de chamas", "restauração maior"
            ],
            [
                {
                    nivel: 1,
                    caracteristicas: ["LISTA DE MAGIAS EXPANDIDA", "TRUQUES ADICIONAIS", "ILUMINAÇÃO CURATIVA"]
                },
                {
                    nivel: 6,
                    caracteristicas: ["ALMA RADIANTE"]
                },
                {
                    nivel: 10,
                    caracteristicas: ["RESILIÊNCIA CELESTIAL"]
                },
                {
                    nivel: 14,
                    caracteristicas: ["VINGANÇA ARDENTE"]
                }
            ]
        )
    }
}