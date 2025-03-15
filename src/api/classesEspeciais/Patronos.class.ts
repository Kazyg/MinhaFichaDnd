export class Patronos {
    nome: string;
    habilidades: {nome: string, descricao: string}[];
    magias: string[];
    niveis: {
        nivel: number;
        caracteristicas: string[];
      }[];
    
    constructor(
        nome: string,
        habilidades: {nome: string, descricao: string}[],
        magias: string[],
        niveis: {
            nivel: number;
            caracteristicas: string[];
          }[]
    ){
        this.nome = nome;
        this.habilidades = habilidades;
        this.magias = magias;
        this.niveis = niveis;
    }
}