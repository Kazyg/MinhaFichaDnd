export class BackGround{
    nome: string;
    proeficienciasHabilidades: string[];
    idiomas: number;
    equipamentos: string[]
    proeficienciaFerramentas: string[];
    caracteristicas: {nome: string, descricao: string};

    constructor(
        nome: string,
        proeficienciasHabilidades: string[],
        idiomas: number,
        equipamentos: string[],
        proeficienciasFerramentas: string[],
        caracteristicas: {nome: string, descricao: string}
    ){
        this.nome = nome;
        this.proeficienciasHabilidades = proeficienciasHabilidades;
        this.idiomas = idiomas;
        this.equipamentos = equipamentos;
        this.proeficienciaFerramentas = proeficienciasFerramentas;
        this.caracteristicas = caracteristicas;
    }
}