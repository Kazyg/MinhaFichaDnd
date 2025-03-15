import { Gnomo } from "../classesFilhos/Gnomo.class.ts";

export class GnomoFloresta extends Gnomo {
    constructor() {
      super();
      this.nome = "Gnomo da Floresta";
      this.atributos?.atributo.push("destreza");
      this.atributos?.bonus.push(1);
      this.tracos?.push(
        {
          traco: "Ilusionista Nato",
          descricao: "Você conhece o truque ilusão menor. Inteligência é a sua habilidade usada para conjurá-la."
      },
      {
          traco: "Falar com Bestas Pequenas",
          descricao: "Através de sons e gestos, você pode comunicar ideias simples para Bestas pequenas ou menores. Gnomos da floresta amam os animais e normalmente possuem esquilos, doninhas, coelhos, toupeiras, pica-paus e outras criaturas como amados animais de estimação."
      }
      );
    }
  }