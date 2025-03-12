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
      this.forca = { nome: "Força", valor: forca };
      this.destreza = { nome: "Destreza", valor: destreza };
      this.constituicao = { nome: "Constituição", valor: constituicao };
      this.inteligencia = { nome: "Inteligência", valor: inteligencia };
      this.sabedoria = { nome: "Sabedoria", valor: sabedoria };
      this.carisma = { nome: "Carisma", valor: carisma };
    }
  
    // Método para somar um bônus a um atributo específico
    somarAtributo(atributo: string, bonus: number) {
      switch (atributo.toLowerCase()) {
        case "força":
          this.forca.valor += bonus;
          break;
        case "destreza":
          this.destreza.valor += bonus;
          break;
        case "constituição":
          this.constituicao.valor += bonus;
          break;
        case "inteligência":
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