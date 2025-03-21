export class Raca {
    nome: string;
    tamanho?: string;
    velocidade?: number;
    idiomas?: string[];
    atributos?: { atributo: string[], bonus: number[] };
    tracos?: { traco: string; descricao: string }[];
    proeficiencias?: string[];
    pericia?: string[];
    subOpcoes?: Raca[];
  
    constructor(
      nome: string,
      tamanho: string,
      velocidade: number,
      idiomas: string[],
      atributos: { atributo: string[], bonus: number[] },
      tracos: { traco: string; descricao: string }[],
      proeficiencias: string[] = [],
      subOpcoes: Raca[] = [],
      pericia: string[] = []
    ) {
      this.nome = nome;
      this.tamanho = tamanho;
      this.velocidade = velocidade;
      this.idiomas = idiomas;
      this.atributos = atributos;
      this.tracos = tracos;
      this.proeficiencias = proeficiencias;
      this.subOpcoes = subOpcoes;
      this.pericia = pericia
    }
  }
  