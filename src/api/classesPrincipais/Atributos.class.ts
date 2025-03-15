export class Atributos {
  forca: { nome: string; valor: number };
  destreza: { nome: string; valor: number };
  constituicao: { nome: string; valor: number };
  inteligencia: { nome: string; valor: number };
  sabedoria: { nome: string; valor: number };
  carisma: { nome: string; valor: number };

  constructor(
    forca: number = 8,
    destreza: number = 8,
    constituicao: number = 8,
    inteligencia: number = 8,
    sabedoria: number = 8,
    carisma: number = 8
  ) {
    this.forca = { nome: "FOR", valor: forca };
    this.destreza = { nome: "DES", valor: destreza };
    this.constituicao = { nome: "CON", valor: constituicao };
    this.inteligencia = { nome: "INT", valor: inteligencia };
    this.sabedoria = { nome: "SAB", valor: sabedoria };
    this.carisma = { nome: "CAR", valor: carisma };
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