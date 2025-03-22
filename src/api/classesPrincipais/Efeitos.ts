export class Efeitos {
    id: string;
    tituloEfeito: string;
    classeNome: string;
    proeficienciasRaca: string[];
    proeficienciasBackGround: string[];
    proeficienciasClasse: string[];
    proficienciasMulticlasse: string[];
    atributo: string;
    talento: string;
    pericia: string;
    arma: string;
    ca: string;
    bonus: number;
    level: number;
    constructor() {
        this.id = this.gerarIdUnico();
    }

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };
    setProeficienciasRaca(proeficiencias: string[] | []) {
        if (!this.proeficienciasRaca || this.proeficienciasRaca.length === 0) {
            this.proeficienciasRaca = [...proeficiencias];
        } else {
            const novasProeficiencias = proeficiencias.filter(
                (proeficiencia) => !this.proeficienciasRaca.includes(proeficiencia)
            );
            this.proeficienciasRaca = [...this.proeficienciasRaca, ...novasProeficiencias];
        }
    }
    setProeficienciasClasse(proeficiencias: string []){
        this.proeficienciasClasse = [...proeficiencias];
    }
    setProeficienciasBackGround(proeficiencias: string []){
        this.proeficienciasBackGround = [...proeficiencias];
    }
    setProeficienciasMulticlasse(proficiencias: string []){
        this.proficienciasMulticlasse = [...proficiencias];
    }
    setLevel(level: number){
        this.level = level;
    }
    setTituloEfeito(titulo: string){
        this.tituloEfeito = titulo;
    }
    setPericia(pericia: string){
        this.pericia = pericia;
    }
    setClasseNome(nome: string){
        this.classeNome = nome;
    }
    setAtributo(atributo: string){
        this.atributo = atributo;
    }
    setBonus(bonus: number){
        this.bonus = bonus;
    }
    setTalento(talento: string){
        this.talento = talento;
    }
    setCa(ca: string){
        this.ca = ca;
    }
    setArma(arma: string){
        this.arma = arma;
    }
}