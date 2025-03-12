export class BackGround{
    nome: string;
    proeficienciasHabilidades: string[];
    idiomas: number;
    proeficienciaFerramentas: string[];
    caracteristicas: string[];

    constructor(
        nome: string,
        proeficienciasHabilidades: string[],
        idiomas: number,
        proeficienciasFerramentas: string[],
        caracteristicas: string[]
    ){
        this.nome = nome;
        this.proeficienciasHabilidades = proeficienciasHabilidades;
        this.idiomas = idiomas;
        this.proeficienciaFerramentas = proeficienciasFerramentas;
        this.caracteristicas = caracteristicas;
    }
}