export class Atributos {
  forca: { id: number, nome: string; valor: number, tipo: string };
  destreza: { id: number, nome: string; valor: number, tipo: string };
  constituicao: { id: number, nome: string; valor: number, tipo: string };
  inteligencia: { id: number, nome: string; valor: number , tipo: string};
  sabedoria: { id: number, nome: string; valor: number, tipo: string };
  carisma: { id: number, nome: string; valor: number, tipo: string };

  constructor(
    forca: number = 8,
    destreza: number = 8,
    constituicao: number = 8,
    inteligencia: number = 8,
    sabedoria: number = 8,
    carisma: number = 8
  ) {
    this.forca = { id: 1, nome: "FOR", valor: forca, tipo: "Resistir a efeitos físicos, como ser derrubado ou empurrado." };
    this.destreza = { id: 2, nome: "DES", valor: destreza, tipo: "Esquivar-se de ataques ou efeitos que exigem reflexos rápidos." };
    this.constituicao = { id: 3, nome: "CON", valor: constituicao, tipo: "Resistir a venenos, doenças ou fadiga." };
    this.inteligencia = { id: 4, nome: "INT", valor: inteligencia , tipo: "Resistir a efeitos mentais ou ilusões."};
    this.sabedoria = { id: 5, nome: "SAB", valor: sabedoria, tipo: "Resistir a efeitos mentais, como medo ou encantamento." };
    this.carisma = { id: 6, nome: "CAR", valor: carisma, tipo: "Resistir a efeitos que afetam a força de vontade, como possessão." };
  }

  setAtributos(atributos: Atributos) {
    this.forca = atributos.forca;
    this.carisma = atributos.carisma;
    this.constituicao = atributos.constituicao;
    this.destreza = atributos.destreza;
    this.inteligencia = atributos.inteligencia;
    this.sabedoria = atributos.sabedoria;
  }

  // Método para somar um bônus a um atributo específico
  somarAtributo(atributo: string, bonus: number) {
    switch (atributo.toLowerCase()) {
      case "forca":
        this.forca.valor += bonus;
        break;
      case "destreza":
        this.destreza.valor += bonus;
        break;
      case "constituicao":
        this.constituicao.valor += bonus;
        break;
      case "inteligencia":
        this.inteligencia.valor += bonus;
        break;
      case "sabedoria":
        this.sabedoria.valor += bonus;
        break;
      case "carisma":
        this.carisma.valor += bonus;
        break;
      default:
        console.error(`Atributo "${atributo}" não encontrado.`);
    }
  }
}