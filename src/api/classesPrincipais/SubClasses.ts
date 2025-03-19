export class SubClasses {
    id: string;
    nome: string;
    descricao: string;
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
      }[];

    constructor(
        nome: string,
        descricao: string        
    ){
        this.id = this.gerarIdUnico();
        this.nome = nome;
        this.descricao = descricao;
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
}