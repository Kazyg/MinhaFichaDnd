export class Raca {
    nome: string;
    tamanho?: string;
    velocidade?: number;
    idiomas?: string[];
    atributos?: { atributo: string[], bonus: number[] };
    tracos?: { traco: string; descricao: string }[];
    subOpcoes?: Raca[];
  
    constructor(
      nome: string,
      tamanho: string,
      velocidade: number,
      idiomas: string[],
      atributos: { atributo: string[], bonus: number[] },
      tracos: { traco: string; descricao: string }[],
      subOpcoes: Raca[] = []
    ) {
      this.nome = nome;
      this.tamanho = tamanho;
      this.velocidade = velocidade;
      this.idiomas = idiomas;
      this.atributos = atributos;
      this.tracos = tracos;
      this.subOpcoes = subOpcoes;
    }
  }
  