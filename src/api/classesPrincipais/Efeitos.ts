export class Efeitos {
    id: string;
    tituloEfeito: string;
    tipoEfeito: string;
    origemTipo: string;
    origemId: string;
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
    valorFixo: number;
    level: number;
    constructor() {
        this.id = this.gerarIdUnico();
        this.tituloEfeito = "";
        this.tipoEfeito = "";
        this.origemTipo = "";
        this.origemId = "";
        this.classeNome = "";
        this.proeficienciasRaca = [];
        this.proeficienciasBackGround = [];
        this.proeficienciasClasse = [];
        this.proficienciasMulticlasse = [];
        this.atributo = "";
        this.talento = "";
        this.pericia = "";
        this.arma = "";
        this.ca = "";
        this.bonus = 0;
        this.valorFixo = 0;
        this.level = 0;
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

    setProeficienciasClasse(proeficiencias: string[]) {
        this.proeficienciasClasse = [...proeficiencias];
    }

    setProeficienciasBackGround(proeficiencias: string[]) {
        this.proeficienciasBackGround = [...proeficiencias];
    }

    setProeficienciasMulticlasse(proficiencias: string[]) {
        this.proficienciasMulticlasse = [...proficiencias];
    }

    setLevel(level: number) {
        this.level = level;
    }

    setTituloEfeito(titulo: string) {
        this.tituloEfeito = titulo;
    }

    setTipoEfeito(tipoEfeito: string) {
        this.tipoEfeito = tipoEfeito;
    }

    setOrigemTipo(origemTipo: string) {
        this.origemTipo = origemTipo;
    }

    setOrigemId(origemId: string) {
        this.origemId = origemId;
    }

    setPericia(pericia: string) {
        this.pericia = pericia;
    }

    setClasseNome(nome: string) {
        this.classeNome = nome;
    }

    setAtributo(atributo: string) {
        this.atributo = atributo;
    }

    setBonus(bonus: number) {
        this.bonus = bonus;
    }

    setValorFixo(valorFixo: number) {
        this.valorFixo = valorFixo;
    }

    setTalento(talento: string) {
        this.talento = talento;
    }

    setCa(ca: string) {
        this.ca = ca;
    }

    setArma(arma: string) {
        this.arma = arma;
    }
}