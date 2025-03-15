import React, { useState } from "react";
import iconRaca from "../../imagens/icon_ancestry.png"
import iconClass from "../../imagens/icon_class.png"
import iconBackGround from "../../imagens/icon_background.png"
import "../css/CriacaoFicha.css";
import "../css/ModalRacas.css";
import ModalSelecao from "../modals/ModalSelecao.tsx";
import ModalSelecaoClasse from "../modals/ModalSelecaoClasse.tsx";
import ModalSelecaoBackGround from "../modals/ModalSelecaoBackGround.tsx";
import ModalSelecaoIdioma from "../modals/ModalSelecaoIdiomas.tsx";
import LevelOneSetup from "../../leveis/LevelUm.tsx";
import { Raca } from "../../api/classesPrincipais/Raca.class.ts";
import { Anao } from "../../api/classesFilhos/Anao.class.ts";
import { Draconato } from "../../api/classesFilhos/Draconato.class.ts";
import { Elfo } from "../../api/classesFilhos/Elfo.class.ts";
import { Gnomo } from "../../api/classesFilhos/Gnomo.class.ts";
import { Halfling } from "../../api/classesFilhos/Halfling.class.ts";
import { Humano } from "../../api/classesFilhos/Humano.class.ts";
import { HumanoVariante } from "../../api/classesFilhos/HumanoVariante.class.ts";
import { MeioElfo } from "../../api/classesFilhos/MeioElfo.class.ts";
import { MeioOrc } from "../../api/classesFilhos/MeioOrc.class.ts";
import { Tiefling } from "../../api/classesFilhos/Tiefling.class.ts";
import { AnaoColina } from "../../api/classesNetos/AnaoColina.class.ts";
import { AnaoMontanha } from "../../api/classesNetos/AnaoMontanha.class.ts";
import { ElfoAlto } from "../../api/classesNetos/ElfoAlto.class.ts";
import { ElfoFloresta } from "../../api/classesNetos/ElfoFloresta.class.ts";
import { ElfoNegro } from "../../api/classesNetos/ElfoNegro.class.ts";
import { GnomoFloresta } from "../../api/classesNetos/GnomoFloresta.class.ts";
import { GnomoRocha } from "../../api/classesNetos/GnomoRocha.class.ts";
import { HalflingLeve } from "../../api/classesNetos/HalflingLeve.class.ts";
import { HalflingRobusto } from "../../api/classesNetos/HalflingRobusto.class.ts";
import { Classes } from "../../api/classesPrincipais/Classes.class.ts";
import { Paladino } from "../../api/classesClassesFilhos/Paladino.class.ts"
import { Barbaro } from "../../api/classesClassesFilhos/Barbaro.class.ts"
import { Bardo } from "../../api/classesClassesFilhos/Bardo.class.ts"
import { Bruxo } from "../../api/classesClassesFilhos/Bruxo.class.ts"
import { Clerigo } from "../../api/classesClassesFilhos/Clerigo.class.ts"
import { Druida } from "../../api/classesClassesFilhos/Druida.class.ts"
import { Feiticeiro } from "../../api/classesClassesFilhos/Feiticeiro.class.ts"
import { Lutador } from "../../api/classesClassesFilhos/Lutador.class.ts"
import { Mago } from "../../api/classesClassesFilhos/Mago.class.ts"
import { Monge } from "../../api/classesClassesFilhos/Monge.class.ts"
import { Ranger } from "../../api/classesClassesFilhos/Ranger.class.ts"
import { Rogue } from "../../api/classesClassesFilhos/Rogue.class.ts"
import { BackGround } from "../../api/classesPrincipais/BackGrounds.class.ts"
import { Soldado } from "../../api/backGroundsFilhos/Soldado.class.ts"
import { Acolito } from "../../api/backGroundsFilhos/Acolito.class.ts"
import { ArtesaoGuilda } from "../../api/backGroundsFilhos/ArtesaoGuilda.class.ts"
import { Artista } from "../../api/backGroundsFilhos/Artista.class.ts"
import { Cavaleiro } from "../../api/backGroundsFilhos/Cavaleiro.class.ts"
import { Charlatao } from "../../api/backGroundsFilhos/Charlatao.class.ts"
import { Criminal } from "../../api/backGroundsFilhos/Criminal.class.ts"
import { Eremita } from "../../api/backGroundsFilhos/Eremita.class.ts"
import { Heroi } from "../../api/backGroundsFilhos/Heroi.class.ts"
import { Marinheiro } from "../../api/backGroundsFilhos/Marinheiro.class.ts"
import { Nobre } from "../../api/backGroundsFilhos/Nobre.class.ts"
import { Ourico } from "../../api/backGroundsFilhos/Ourico.class.ts"
import { OutLander } from "../../api/backGroundsFilhos/OutLander.class.ts"
import { Pirata } from "../../api/backGroundsFilhos/Pirata.class.ts"
import { Sabio } from "../../api/backGroundsFilhos/Sabio.class.ts"
import { Idiomas } from "../../bibliotecas/idiomas/idiomasData.ts";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

export default function CriacaoFicha() {
  const [modalRacaAberto, setModalRacaAberto] = useState(false);
  const [modalClasseAberto, setModalClasseAberto] = useState(false);
  const [modalBackGroundsAberto, setModalBackGroundsAberto] = useState(false);
  const [modalIdiomasAberto, setModalIdiomasAberto] = useState(false);
  const [subGrupoAberto, setSubGrupoAberto] = useState(false);
  const [subRacas, setSubRacas] = useState<Raca[]>([]);
  const [atributosSelecionados, setAtributosSelecionados] = useState<string[] | null>([])
  const [idiomasSelecionado, setIdiomasSelecionado] = useState<Idiomas[] | null>(null)
  const [idiomaIndice, setIdiomaIndice] = useState<number>(0)

  const { ficha, forceUpdate } = useFicha();

  // Lista de raças disponíveis (filhas diretas de Raca)
  const racas: Raca[] = [
    new Anao([new AnaoColina(), new AnaoMontanha()]),
    new Draconato(),
    new Halfling([new HalflingLeve(), new HalflingRobusto()]),
    new Humano(),
    new HumanoVariante("", ""),
    new Elfo([new ElfoAlto(), new ElfoFloresta(), new ElfoNegro()]),
    new Gnomo([new GnomoFloresta(), new GnomoRocha()]),
    new MeioElfo("", ""),
    new MeioOrc(),
    new Tiefling()
  ];

  const classes: Classes[] = [
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
  ];

  const backGrounds: BackGround[] = [
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
    new Ourico(),
    new OutLander(),
    new Sabio(),
    new Pirata()
  ];

  const abrirSubGrupo = () => {
    if (ficha?.racaPrincipal?.subOpcoes && ficha?.racaPrincipal?.subOpcoes.length > 0) {
      setSubRacas(ficha?.racaPrincipal?.subOpcoes);
      setSubGrupoAberto(true);
    }
  };

  return (
    <div className="criacao-ficha">
      <h2>Escolha seu Personagem</h2>

      {/* Botão de Seleção de Raça */}
      <button className="botao-selecao" onClick={() => setModalRacaAberto(true)}>
        <img src={iconRaca} className="button-icon" alt="Raça" />
        <div className="botao-texto">
          <span>Raça</span>
          <strong>{ficha?.racaPrincipal ? ficha?.racaPrincipal?.nome : "Selecionar Raça"}</strong>
        </div>
      </button>

      {ficha?.racaPrincipal?.subOpcoes && ficha?.racaPrincipal?.subOpcoes.length > 0 && (
        <button className="botao-selecao-subopcao" onClick={abrirSubGrupo}>
          <img src={iconRaca} className="button-icon" alt="Sub-raça" />
          <div className="botao-texto">
            <span>Sub-raça</span>
            <strong>{ficha.subRaca ? ficha.subRaca.nome : "Selecionar Sub-raça"}</strong>
          </div>
        </button>
      )}

      <button className="botao-selecao" onClick={() => setModalClasseAberto(true)}>
        <img src={iconClass} className="button-icon" alt="Classe" />
        <div className="botao-texto">
          <span>Selecionar Classe</span>
          <strong>{ficha?.classePrincipal ? ficha.classePrincipal.nome : "Selecionar Classe"}</strong>
        </div>
      </button>

      <button className="botao-selecao" onClick={() => setModalBackGroundsAberto(true)}>
        <img src={iconBackGround} className="button-icon" alt="BackGround" />
        <div className="botao-texto">
          <span>Selecionar Background</span>
          <strong>{ficha?.backGround ? ficha.backGround.nome : "Selecionar BackGround"}</strong>
        </div>
      </button>

      {Array.from({ length: ficha?.backGround?.idiomas || 0 }).map((_, index) => (
        <button
          key={index}
          className="botao-selecao-subopcao"
          onClick={() => {
            setModalIdiomasAberto(true);
            setIdiomaIndice(index);
          }}
        >
          <img src={iconBackGround} className="button-icon" alt="Idioma" />
          <div className="botao-texto">
            <span>Idioma {index + 1}</span>
            <strong>{idiomasSelecionado?.[index]?.nome ?? `Selecionar Idioma ${index + 1}`}</strong>
          </div>
        </button>
      ))}

      {modalRacaAberto && (
        <>
          <div className="popup-overlay" onClick={() => setModalRacaAberto(false)}></div>
          <div className="popup">
            <ModalSelecao
              titulo="Escolha sua Raça"
              opcoes={racas}
              onClose={() => setModalRacaAberto(false)}
              onSelect={(raca) => {
                ficha?.setRacaPrincipal(raca);
                ficha?.setTamanho(raca?.tamanho ? raca?.tamanho : null);
                ficha?.setSpeed(raca?.velocidade ? raca.velocidade : null);
                ficha?.setIdiomasRaca(raca?.idiomas ? raca.idiomas : null);
                ficha?.setSubRaca(null);
                ficha?.setAtributosPersonagem(null);
                ficha?.setIniciativa(null);
                if (idiomasSelecionado) {
                  const novosIdiomasSelecionados = idiomasSelecionado.filter(
                    (idioma) => !raca?.idiomas?.includes(idioma.nome)
                  );

                  setIdiomasSelecionado(novosIdiomasSelecionados);
                }
                forceUpdate();
                setModalRacaAberto(false);
              }}
              onAtributeSelect={(atributoEscolhido) => {
                setAtributosSelecionados(atributoEscolhido);
              }}
              racaInicial={ficha?.racaPrincipal ? ficha.racaPrincipal : null}
              atributosIniciais={atributosSelecionados}
            />
          </div>
        </>
      )}

      {/* Popup de seleção de sub-raça */}
      {subGrupoAberto && (
        <>
          <div className="popup-overlay" onClick={() => setSubGrupoAberto(false)}></div>
          <div className="popup">
            <ModalSelecao
              titulo="Escolha sua Sub-Raça"
              opcoes={subRacas}
              onClose={() => setSubGrupoAberto(false)}
              onSelect={(subRaca) => {
                ficha?.setSubRaca(subRaca);
                setSubGrupoAberto(false);
                forceUpdate();
              }}
              racaInicial={ficha?.subRaca ? ficha.subRaca : null}
              onAtributeSelect={(atributoEscolhido) => {
                setAtributosSelecionados(atributoEscolhido);
              }}
              atributosIniciais={atributosSelecionados}
            />
          </div>
        </>
      )}

      {modalClasseAberto && (
        <>
          <div className="popup-overlay" onClick={() => setModalClasseAberto(false)}></div>
          <div className="popup">
            <ModalSelecaoClasse
              titulo="Escolha sua Classe"
              opcoes={classes}
              onClose={() => setModalClasseAberto(false)}
              onSelect={(classes) => {
                ficha?.setClassePrincipal(classes);
                setModalClasseAberto(false);
                forceUpdate();
              }}
              classeInicial={ficha?.classePrincipal ? ficha.classePrincipal : null}
            />
          </div>
        </>
      )}

      {modalBackGroundsAberto && (
        <>
          <div className="popup-overlay" onClick={() => setModalBackGroundsAberto(false)}></div>
          <div className="popup">
            <ModalSelecaoBackGround
              titulo="Escolha seu BackGround"
              opcoes={backGrounds}
              onClose={() => setModalBackGroundsAberto(false)}
              onSelect={(backGrounds) => {
                ficha?.setBackGround(backGrounds)
                if (idiomasSelecionado && idiomasSelecionado[1]) {
                  ficha?.removerIdioma(idiomasSelecionado[1].nome);
                }
                if (idiomasSelecionado && idiomasSelecionado[0]) {
                  ficha?.removerIdioma(idiomasSelecionado[0].nome);
                }
                setModalBackGroundsAberto(false)
                setIdiomasSelecionado(null)
                forceUpdate();
              }}
              backGroundInicial={ficha?.backGround ? ficha.backGround : null}
            />
          </div>
        </>
      )}

      {modalIdiomasAberto && (
        <>
          <div className="popup-overlay" onClick={() => setModalIdiomasAberto(false)}></div>
          <div className="popup">
            <ModalSelecaoIdioma
              titulo="Escolha seu idioma"
              onClose={() => setModalIdiomasAberto(false)}
              onSelect={(idioma) => {
                if (!idioma) return;
                if (idiomasSelecionado && idiomasSelecionado[idiomaIndice]) {
                  ficha?.removerIdioma(idiomasSelecionado[idiomaIndice].nome);
                }
                ficha?.setIdiomas(idioma.nome);
                const array = idiomasSelecionado ? idiomasSelecionado : [];
                array[idiomaIndice] = idioma
                setIdiomasSelecionado(array)
                setModalIdiomasAberto(false)
              }}
              idiomaInicial={idiomasSelecionado ? idiomasSelecionado[idiomaIndice] : null}
            />
          </div>
        </>
      )}

      <div className="niveis-container">
        <div className="nivel">
          {ficha?.racaPrincipal &&
            ficha?.classePrincipal &&
            (ficha.racaPrincipal.subOpcoes && ficha.racaPrincipal.subOpcoes.length > 0 ? ficha.subRaca : true) ? (
            <LevelOneSetup raca={ficha.subRaca ? ficha.subRaca : ficha.racaPrincipal} classe={ficha.classePrincipal} />
          ) : "Nivel 1"}
        </div>
      </div>

      <div className="niveis-container">
        {[...Array(20)].map((_, i) => (
          <div key={i + 1} className="nivel">
            <span>Nível {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}