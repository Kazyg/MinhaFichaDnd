import { Raca } from "../classesPrincipais/Raca.class.ts";

export class Draconato extends Raca {
  ancestralidade: string;
  constructor(
    ancestralidade: string
  ) {
    super("Draconato", "Médio", 30, ["Comum", "Dracônico"], { atributo:["forca", "carisma"], bonus:[2,1] },[
      {
          traco: "Ancestral Dracônico",
          descricao: "Você possui um ancestral dracônico. Escolha um tipo de dragão da tabela Ancestral Dracônico. Sua arma de sopro e resistência a dano são determinadas pelo tipo de dragão, como mostrado na tabela."
      },
      {
          traco: "Arma de Sopro",
          descricao: "Você pode usar uma ação para exalar energia destrutiva. Seu ancestral dracônico determina o tamanho, forma e tipo de dano que você expele. Quando você usa sua arma de sopro, cada criatura na área exalada deve realizar um teste de resistência, o tipo do teste é determinado pelo seu ancestral dracônico. A CD do teste de resistência é 8 + seu modificador de Constituição + seu bônus de proficiência. Uma criatura sofre 2d6 de dano num fracasso e metade desse dano num sucesso. O dano aumenta para 3d6 no 6° nível, 4d6 no 11° nível e 5d6 no 16° nível. Depois de usar sua arma de sopro, você não poderá utilizá-la novamente até completar um descanso curto ou longo."
      }
  ]);
  this.ancestralidade = ancestralidade;
  }
}

export const dracoes = [
  {
    nome: "Azul",
    tipoDano: "Elétrico",
    armaSopro: "Linha de 1,5m/9m",
    teste: "Destreza",
  },
  {
    nome: "Branco",
    tipoDano: "Frio",
    armaSopro: "Cone de 4,5m",
    teste: "Constituição",
  },
  {
    nome: "Bronze",
    tipoDano: "Elétrico",
    armaSopro: "Linha de 1,5m/9m",
    teste: "Destreza",
  },
  {
    nome: "Cobre",
    tipoDano: "Ácido",
    armaSopro: "Linha de 1,5m/9m",
    teste: "Destreza",
  },
  {
    nome: "Latão",
    tipoDano: "Fogo",
    armaSopro: "Linha de 1,5m/9m",
    teste: "Destreza",
  },
  {
    nome: "Negro",
    tipoDano: "Ácido",
    armaSopro: "Linha de 1,5m/9m",
    teste: "Destreza",
  },
  {
    nome: "Ouro",
    tipoDano: "Fogo",
    armaSopro: "Cone de 4,5m",
    teste: "Destreza",
  },
  {
    nome: "Prata",
    tipoDano: "Frio",
    armaSopro: "Cone de 4,5m",
    teste: "Constituição",
  },
  {
    nome: "Verde",
    tipoDano: "Veneno",
    armaSopro: "Cone de 4,5m",
    teste: "Constituição",
  },
  {
    nome: "Vermelho",
    tipoDano: "Fogo",
    armaSopro: "Cone de 4,5m",
    teste: "Destreza",
  },
];
