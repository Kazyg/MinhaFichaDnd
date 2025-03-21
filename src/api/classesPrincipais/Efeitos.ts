export class Efeitos {
    id: string;
    proeficienciasRaca: string[];
    proeficienciasBackGround: string[];
    proeficienciasClasse: string[];
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
}