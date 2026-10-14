import { SubClasses } from "../classesPrincipais/SubClasses";

export class JuramentoDaDevocao2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Juramento da Devoção", "O Juramento da Devoção conecta Paladinos aos ideais de justiça e ordem, representando o arquétipo do cavaleiro de armadura brilhante.");
        this.niveis = [
            { nome: "Magias do Juramento da Devoção", nivel: 3, descricao: "Você sempre tem preparadas as magias do juramento conforme seu nível de Paladino: nível 3, Escudo da Fé e Proteção Contra o Bem e o Mal; nível 5, Auxílio e Zona da Verdade; nível 9, Dissipar Magia e Sinal de Esperança; nível 13, Defensor da Fé e Movimentação Livre; nível 17, Coluna de Chamas e Comunhão." },
            { nome: "Arma Sagrada", nivel: 3, descricao: "Ao executar a ação Atacar, você pode gastar um uso de Canalizar Divindade para imbuir uma arma Corpo a Corpo que esteja empunhando com energia positiva por 10 minutos ou até usar esta característica novamente. Você adiciona seu modificador de Carisma às jogadas de ataque com a arma, mínimo +1, e cada acerto causa o dano normal da arma ou dano Radiante. A arma emite Luz Plena em 6 metros e Meia-luz por mais 6 metros." },
            { nome: "Aura de Devoção", nivel: 7, descricao: "Você e seus aliados têm Imunidade à condição Enfeitiçado enquanto estiverem em sua Aura de Proteção. Se um aliado Enfeitiçado entrar na aura, essa condição não tem efeito sobre ele enquanto permanecer nela." },
            { nome: "Destruição Protetora", nivel: 15, descricao: "Ao conjurar Destruição Divina, você e seus aliados têm Cobertura Parcial enquanto estiverem em sua Aura de Proteção. A aura mantém este benefício até o início do seu próximo turno." },
            { nome: "Resplendor Sagrado", nivel: 20, descricao: "Como uma Ação Bônus, você pode imbuir sua Aura de Proteção com poder sagrado por 10 minutos. Inimigos que iniciam o turno na aura sofrem dano Radiante igual ao seu modificador de Carisma mais seu Bônus de Proficiência; a aura é preenchida com Luz Plena que é luz solar; e você tem Vantagem em salvaguardas impostas por Ínferos ou Mortos-Vivos. Você recupera o uso ao completar Descanso Longo ou gastando um espaço de magia de 5º círculo." }
        ];
    }
}
