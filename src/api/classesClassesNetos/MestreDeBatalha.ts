import { SubClasses } from "../classesPrincipais/SubClasses.ts";

export class MestreDeBatalha extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super(
            "Mestre de Batalha",
            "Aqueles que emulam o arquétipo de Mestre de Batalha empregam técnicas marciais passadas de geração em geração. Para um Mestre de Batalha, o combate é um campo acadêmico, às vezes, incluindo assuntos além da batalha, como forjaria e caligrafia. Nem todo guerreiro absorve as lições de história, teoria e arte que são refletidas no arquétipo de Mestre de Batalha, mas aqueles que conseguem, tornam-se guerreiros bem-sucedidos de grande perícia e conhecimento."
        );
        this.niveis = this.preencherNiveis();
    }

    private preencherNiveis() {
        return [
            {
                nome: "Superioridade em Combate",
                nivel: 3,
                descricao: `
                    Quando você escolhe esse arquétipo, no 3° nível, você aprende manobras que são abastecidas com dados especiais chamados dados de superioridade.

                    **Manobras.** Você aprende três manobras, à sua escolha, que são detalhadas em “Manobras”, a seguir. Muitas manobras aprimoram um ataque de várias formas. Você só pode usar uma manobra por ataque. Você aprende duas manobras adicionais, à sua escolha, no 7°, 10° e 15° nível. A cada vez que você aprende uma nova manobra, você pode substituir uma manobra conhecida por uma diferente.

                    **Dados de Superioridade.** Você tem quatro dados de superioridade, que são d8s. Um dado de superioridade é gasto quando você o usa. Você recupera todos os dados de superioridade gastos quando terminar um descanso curto ou longo. Você adquire outro dado de superioridade no 7° nível e mais um no 15° nível.

                    **Teste de Resistência.** Algumas das suas manobras exigem que o alvo realize um teste de resistência contra o efeito da manobra. A CD do teste de resistência é calculada a seguir:

                    **CD para suas manobras = 8 + bônus de proficiência + seu modificador de Força ou Destreza (à sua escolha)**
                `
            },
            {
                nome: "Estudioso da Guerra",
                nivel: 3,
                descricao: `
                    No 3° nível, você ganha proficiência com um tipo de ferramenta de artesão, à sua escolha.
                `
            },
            {
                nome: "Conheça Seu Inimigo",
                nivel: 7,
                descricao: `
                    A partir do 7° nível, se você gastar, pelo menos, 1 minuto observando ou interagindo com outra criatura fora de combate, você pode aprender certas informações sobre as capacidades dela comparadas às suas. O Mestre conta a você se a criatura é igual, superior ou inferior a você a respeito de duas das seguintes características, à sua escolha:
                    - Valor de Força
                    - Valor de Destreza
                    - Valor de Constituição
                    - Classe de Armadura
                    - Pontos de Vida atuais
                    - Nível total de classe (se possuir)
                    - Níveis da classe guerreiro (se possuir)
                `
            },
            {
                nome: "Superioridade em Combate Aprimorada",
                nivel: 10,
                descricao: `
                    No 10° nível, seus dados de superioridade se tornam d10s. No 18° nível, eles se tornam d12s.
                `
            },
            {
                nome: "Implacável",
                nivel: 15,
                descricao: `
                    No 15° nível, quando você rolar iniciativa e não tiver nenhum dado de superioridade restante, você recupera um dado de superioridade.
                `
            }
        ];
    }
}