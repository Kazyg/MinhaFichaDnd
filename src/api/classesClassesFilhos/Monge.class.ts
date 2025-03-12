import { Classes } from "../classesPrincipais/Classes.class.ts";

export class Monge extends Classes {
  level: number;
  niveis: {
    nivel: number;
    proeficiencia: number;
    artesMarciais: string;
    pontosChi: number;
    deslocamento: string;
    caracteristicas: string[];
  }[];

  constructor() {
    super(
      "Monge",
      8,
      [""],
      ["Armas simples", "espada curta"],
      ["Ferramentas de artesão"],
      ["Força", "Destreza"],
      2,
      ["Acrobacia", "Atletismo", "Furtividade", "História", "Insight", "Religião"]
    );
    this.level = 0; // Nível inicial
    this.niveis = this.preencherNiveis(); // Preenche a tabela de níveis
  }

  // Método para aumentar o nível
  aumentarNivel(): void {
    if (this.level < 20) {
      this.level += 1;
    } else {
      console.log("O monge já atingiu o nível máximo (20).");
    }
  }

  // Método para preencher a tabela de níveis
  private preencherNiveis() {
    return [
      { nivel: 1, proeficiencia: 2, artesMarciais: "1d4", pontosChi: 0, deslocamento: "+0m", caracteristicas: ["Defesa sem Armadura", "Artes Marciais"] },
      { nivel: 2, proeficiencia: 2, artesMarciais: "1d4", pontosChi: 2, deslocamento: "+3m", caracteristicas: ["Chi", "Movimento sem Armadura"] },
      { nivel: 3, proeficiencia: 2, artesMarciais: "1d4", pontosChi: 3, deslocamento: "+3m", caracteristicas: ["Tradição Monástica", "Defletir Projéteis"] },
      { nivel: 4, proeficiencia: 2, artesMarciais: "1d4", pontosChi: 4, deslocamento: "+3m", caracteristicas: ["Incremento no Valor de Habilidade", "Queda Lenta"] },
      { nivel: 5, proeficiencia: 3, artesMarciais: "1d6", pontosChi: 5, deslocamento: "+3m", caracteristicas: ["Ataque Extra", "Ataque Atordoante"] },
      { nivel: 6, proeficiencia: 3, artesMarciais: "1d6", pontosChi: 6, deslocamento: "+4.5m", caracteristicas: ["Golpes de Chi", "Característica de Tradição Monástica"] },
      { nivel: 7, proeficiencia: 3, artesMarciais: "1d6", pontosChi: 7, deslocamento: "+4.5m", caracteristicas: ["Evasão", "Mente Tranquila"] },
      { nivel: 8, proeficiencia: 3, artesMarciais: "1d6", pontosChi: 8, deslocamento: "+4.5m", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 9, proeficiencia: 4, artesMarciais: "1d6", pontosChi: 9, deslocamento: "+4.5m", caracteristicas: ["Aprimoramento de Movimento sem Armadura"] },
      { nivel: 10, proeficiencia: 4, artesMarciais: "1d6", pontosChi: 10, deslocamento: "+6m", caracteristicas: ["Pureza Corporal"] },
      { nivel: 11, proeficiencia: 4, artesMarciais: "1d8", pontosChi: 11, deslocamento: "+6m", caracteristicas: ["Característica de Tradição Monástica"] },
      { nivel: 12, proeficiencia: 4, artesMarciais: "1d8", pontosChi: 12, deslocamento: "+6m", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 13, proeficiencia: 5, artesMarciais: "1d8", pontosChi: 13, deslocamento: "+6m", caracteristicas: ["Idiomas do Sol e da Lua"] },
      { nivel: 14, proeficiencia: 5, artesMarciais: "1d8", pontosChi: 14, deslocamento: "+7.5m", caracteristicas: ["Alma de Diamante"] },
      { nivel: 15, proeficiencia: 5, artesMarciais: "1d8", pontosChi: 15, deslocamento: "+7.5m", caracteristicas: ["Corpo Atemporal Monge"] },
      { nivel: 16, proeficiencia: 5, artesMarciais: "1d8", pontosChi: 16, deslocamento: "+7.5m", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 17, proeficiencia: 6, artesMarciais: "1d10", pontosChi: 17, deslocamento: "+7.5m", caracteristicas: ["Característica de Tradição Monástica"] },
      { nivel: 18, proeficiencia: 6, artesMarciais: "1d10", pontosChi: 18, deslocamento: "+9m", caracteristicas: ["Corpo Vazio"] },
      { nivel: 19, proeficiencia: 6, artesMarciais: "1d10", pontosChi: 19, deslocamento: "+9m", caracteristicas: ["Incremento no Valor de Habilidade"] },
      { nivel: 20, proeficiencia: 6, artesMarciais: "1d10", pontosChi: 20, deslocamento: "+9m", caracteristicas: ["Auto Aperfeiçoamento"] }
    ];
  }
}