import { getRulesetConfig } from "../regras";
import { Anao } from "../../classesFilhos/Anao.class";
import { Draconato } from "../../classesFilhos/Draconato.class";
import { Elfo } from "../../classesFilhos/Elfo.class";
import { Gnomo } from "../../classesFilhos/Gnomo.class";
import { Halfling } from "../../classesFilhos/Halfling.class";
import { Humano } from "../../classesFilhos/Humano.class";
import { HumanoVariante } from "../../classesFilhos/HumanoVariante.class";
import { MeioElfo } from "../../classesFilhos/MeioElfo.class";
import { MeioOrc } from "../../classesFilhos/MeioOrc.class";
import { Tiefling } from "../../classesFilhos/Tiefling.class";
import { AnaoColina } from "../../classesNetos/AnaoColina.class";
import { AnaoMontanha } from "../../classesNetos/AnaoMontanha.class";
import { ElfoAlto } from "../../classesNetos/ElfoAlto.class";
import { ElfoFloresta } from "../../classesNetos/ElfoFloresta.class";
import { ElfoNegro } from "../../classesNetos/ElfoNegro.class";
import { GnomoFloresta } from "../../classesNetos/GnomoFloresta.class";
import { GnomoRocha } from "../../classesNetos/GnomoRocha.class";
import { HalflingLeve } from "../../classesNetos/HalflingLeve.class";
import { HalflingRobusto } from "../../classesNetos/HalflingRobusto.class";
import { Paladino } from "../../classesClassesFilhos/Paladino.class";
import { Barbaro } from "../../classesClassesFilhos/Barbaro.class";
import { Bardo } from "../../classesClassesFilhos/Bardo.class";
import { Bruxo } from "../../classesClassesFilhos/Bruxo.class";
import { Clerigo } from "../../classesClassesFilhos/Clerigo.class";
import { Druida } from "../../classesClassesFilhos/Druida.class";
import { Feiticeiro } from "../../classesClassesFilhos/Feiticeiro.class";
import { Lutador } from "../../classesClassesFilhos/Lutador.class";
import { Mago } from "../../classesClassesFilhos/Mago.class";
import { Monge } from "../../classesClassesFilhos/Monge.class";
import { Ranger } from "../../classesClassesFilhos/Ranger.class";
import { Rogue } from "../../classesClassesFilhos/Rogue.class";
import { Soldado } from "../../backGroundsFilhos/Soldado.class";
import { Acolito } from "../../backGroundsFilhos/Acolito.class";
import { ArtesaoGuilda } from "../../backGroundsFilhos/ArtesaoGuilda.class";
import { Artista } from "../../backGroundsFilhos/Artista.class";
import { Cavaleiro } from "../../backGroundsFilhos/Cavaleiro.class";
import { Charlatao } from "../../backGroundsFilhos/Charlatao.class";
import { Criminal } from "../../backGroundsFilhos/Criminal.class";
import { Eremita } from "../../backGroundsFilhos/Eremita.class";
import { Heroi } from "../../backGroundsFilhos/Heroi.class";
import { Marinheiro } from "../../backGroundsFilhos/Marinheiro.class";
import { Nobre } from "../../backGroundsFilhos/Nobre.class";
import { LadraoDasSombras } from "../../backGroundsFilhos/LadraoDasSombras";
import { Forasteiro } from "../../backGroundsFilhos/Forasteiro";
import { Pirata } from "../../backGroundsFilhos/Pirata.class";
import { Sabio } from "../../backGroundsFilhos/Sabio.class";
import { Orfao } from "../../backGroundsFilhos/Orfao";
import { getTalentosConteudo, getMagiasConteudo } from '../conteudo';
import { RulesetData } from "../types";

export const createDnd2014Ruleset = (): RulesetData => ({
  racasOuEspecies: [
    new Anao([new AnaoColina(), new AnaoMontanha()]),
    new Draconato(""),
    new Halfling([new HalflingLeve(), new HalflingRobusto()]),
    new Humano(),
    new HumanoVariante("", "", ""),
    new Elfo([new ElfoAlto(), new ElfoFloresta(), new ElfoNegro()]),
    new Gnomo([new GnomoFloresta(), new GnomoRocha()]),
    new MeioElfo("", "", "", ""),
    new MeioOrc(""),
    new Tiefling()
  ],
  classes: [
    new Paladino(),
    new Barbaro(),
    new Bardo(),
    new Bruxo(),
    new Clerigo(),
    new Druida(),
    new Feiticeiro(),
    new Mago(),
    new Lutador(),
    new Monge(),
    new Ranger(),
    new Rogue()
  ],
  backgroundsOuOrigens: [
    new Soldado(),
    new Acolito(),
    new ArtesaoGuilda(),
    new Artista(),
    new Cavaleiro(),
    new Charlatao(),
    new Criminal(),
    new Eremita(),
    new Heroi(),
    new Marinheiro(),
    new Nobre(),
    new LadraoDasSombras(),
    new Forasteiro(),
    new Sabio(),
    new Pirata(),
    new Orfao()
  ],
  // Content APIs return independent copies only when the caller requests them.
  get talentos() { return getTalentosConteudo("DND_2014"); },
  armas: [],
  armaduras: [],
  itens: [],
  get magias() { return getMagiasConteudo("DND_2014"); },
  ...getRulesetConfig("DND_2014")
});
