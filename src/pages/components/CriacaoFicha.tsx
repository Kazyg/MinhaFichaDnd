import { buscarTalentoConteudo } from '../../api/rulesets/conteudo';
import { erroTalento, registrarTalento } from '../../api/fichaPersonagem/talentosConteudo';
import { idiomasEscolhidos } from '../../api/fichaPersonagem/fichaRestauracao';
import { arquivarEscolha } from '../../api/fichaPersonagem/escolhasProgressao';
import React, { useState } from "react";
import iconRaca from "../../imagens/icon_ancestry.png"
import iconClass from "../../imagens/icon_class.png"
import iconBackGround from "../../imagens/icon_background.png"
import "../css/CriacaoFicha.css";
import "../css/ModalRacas.css";
import ModalSelecao from "../modals/ModalSelecao";
import ModalSelecaoClasse from "../modals/ModalSelecaoClasse";
import ModalSelecaoBackGround from "../modals/ModalSelecaoBackGround";
import ModalSelecaoIdioma from "../modals/ModalSelecaoIdiomas";
import LevelOneSetup from "../../leveis/LevelUm";
import NivelBlock from "../../leveis/NivelBlock";
import { Raca } from "../../api/classesPrincipais/Raca.class";
import { Classes } from "../../api/classesPrincipais/Classes.class";
import { BackGround } from "../../api/classesPrincipais/BackGrounds.class"
import { Idiomas, idiomas } from "../../bibliotecas/idiomas/idiomasData";
import { useFicha } from "../../api/fichaPersonagem/FichaContext"
import { Efeitos } from "../../api/classesPrincipais/Efeitos";
import { getRulesetData } from "../../api/rulesets/getRulesetData";


export default function CriacaoFicha() {
  const [modalRacaAberto, setModalRacaAberto] = useState(false);
  const [modalClasseAberto, setModalClasseAberto] = useState(false);
  const [modalBackGroundsAberto, setModalBackGroundsAberto] = useState(false);
  const [modalIdiomasAberto, setModalIdiomasAberto] = useState(false);
  const [subGrupoAberto, setSubGrupoAberto] = useState(false);
  const [subRacas, setSubRacas] = useState<Raca[]>([]);


  const [idiomaIndice, setIdiomaIndice] = useState<number>(0)

  const { ficha, forceUpdate } = useFicha();

  const atributosSelecionados = ficha?.atributosSelecionados ?? [];
  const setAtributosSelecionados = (value: string[] | null) => { if (ficha) ficha.atributosSelecionados = value ?? []; };
  const idiomasSelecionado = (ficha ? idiomasEscolhidos(ficha) : []).map(nome => idiomas.find(i => i.nome === nome) ?? { nome } as Idiomas);
  const setIdiomasSelecionado = (value: Idiomas[] | null) => { if (ficha) ficha.idiomasLivres = value?.filter(Boolean).map(i => i.nome) ?? []; };
  const rulesetData = getRulesetData(ficha?.versaoRegras);
  const racas: Raca[] = rulesetData.racasOuEspecies;
  const classes: Classes[] = rulesetData.classes;
  const backGrounds: BackGround[] = rulesetData.backgroundsOuOrigens;
  const quantidadeSelecoesIdioma = rulesetData.regras.quantidadeIdiomasLivres || ficha?.backGround?.idiomas || 0;
  const idiomasObrigatoriosSelecionados = quantidadeSelecoesIdioma === 0 || (idiomasSelecionado?.filter(Boolean).length ?? 0) >= quantidadeSelecoesIdioma;

  const abrirSubGrupo = () => {
    if (ficha?.racaPrincipal?.subOpcoes && ficha?.racaPrincipal?.subOpcoes.length > 0) {
      setSubRacas(ficha?.racaPrincipal?.subOpcoes);
      setSubGrupoAberto(true);
    }
  };

  function selecionarMulticlasse(classeEscolhida: Classes, nivelAtual: number): boolean {
    const sucesso = ficha?.selecionarClasseNoNivel(classeEscolhida, nivelAtual) ?? false;
    forceUpdate();
    return sucesso;
  }

  return (
    <div className="criacao-ficha">
      <h2>Escolha seu Personagem</h2>

      <button className="botao-selecao" onClick={() => setModalRacaAberto(true)}>
        <img src={iconRaca} className="button-icon" alt={rulesetData.regras.labelRacaOuEspecie} />
        <div className="botao-texto">
          <span>{rulesetData.regras.labelRacaOuEspecie}</span>
          <strong>{ficha?.racaPrincipal ? ficha?.racaPrincipal?.nome : `Selecionar ${rulesetData.regras.labelRacaOuEspecie}`}</strong>
        </div>
      </button>

      {ficha?.racaPrincipal?.subOpcoes && ficha?.racaPrincipal?.subOpcoes.length > 0 && (
        <button className="botao-selecao-subopcao" onClick={abrirSubGrupo}>
          <img src={iconRaca} className="button-icon" alt={rulesetData.regras.labelSubRacaOuOpcao} />
          <div className="botao-texto">
            <span>{rulesetData.regras.labelSubRacaOuOpcao}</span>
            <strong>{ficha.subRaca ? ficha.subRaca.nome : `Selecionar ${rulesetData.regras.labelSubRacaOuOpcao}`}</strong>
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
        <img src={iconBackGround} className="button-icon" alt={rulesetData.regras.labelBackgroundOuOrigem} />
        <div className="botao-texto">
          <span>Selecionar {rulesetData.regras.labelBackgroundOuOrigem}</span>
          <strong>{ficha?.backGround ? ficha.backGround.nome : `Selecionar ${rulesetData.regras.labelBackgroundOuOrigem}`}</strong>
        </div>
      </button>

      {Array.from({ length: quantidadeSelecoesIdioma }).map((_, index) => (
        <button
          key={index}
          className="botao-selecao-subopcao"
          onClick={() => {
            setModalIdiomasAberto(true);
            setIdiomaIndice(index);
          }}
          disabled={rulesetData.version === "DND_2014" && ficha?.backGround?.nome === "Membro da Guilda dos Ladrões das Sombras"}
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
              titulo={`Escolha sua ${rulesetData.regras.labelRacaOuEspecie}`}
              opcoes={racas}
              onClose={() => setModalRacaAberto(false)}
              onSelect={(raca) => {
                ficha?.setRacaPrincipal(raca);
                ficha?.setTamanho(raca?.tamanho ? raca?.tamanho : null);
                const idiomasDaEspecie = rulesetData.regras.especieConcedeIdiomas ? raca?.idiomas ?? [] : rulesetData.regras.idiomasObrigatorios;
                const idiomasLivres = idiomasSelecionado?.filter(Boolean).map((idioma) => idioma.nome) ?? [];
                ficha?.setIdiomasRaca([...new Set([...idiomasDaEspecie, ...idiomasLivres])]);
                ficha?.setSubRaca(null);
                if (ficha && rulesetData.regras.especieConcedeAtributos) {
                  arquivarEscolha(ficha, 'atributos-antes-da-raca', ficha.atributosPersonagem);
                  ficha.setAtributosPersonagem(null);
                }
                ficha?.excluirEfeitoPorTitulo("racaPrincipal");
                if (rulesetData.regras.especieConcedeIdiomas && idiomasSelecionado) {
                  const novosIdiomasSelecionados = idiomasSelecionado.filter(
                    (idioma) => !raca?.idiomas?.includes(idioma.nome)
                  );

                  setIdiomasSelecionado(novosIdiomasSelecionados);
                }
                let efeito = new Efeitos();
                efeito.setProeficienciasRaca(raca?.proeficiencias ?? []);
                efeito.setLevel(1);
                efeito.setTituloEfeito("racaPrincipal");
                ficha?.setEfeitos(efeito);
                forceUpdate();
                setModalRacaAberto(false);
              }}
              onAtributeSelect={(atributoEscolhido) => {
                setAtributosSelecionados(atributoEscolhido);
              }}
              onFerramentaSelect={(ferramenta) => {
                ficha?.excluirEfeitoPorTitulo("ferramentaClasse");
                let efeito = new Efeitos();
                if (ferramenta) {
                  efeito.setProeficienciasRaca([ferramenta]);
                  efeito.setLevel(1);
                  efeito.setTituloEfeito("ferramentaClasse")
                  ficha?.setEfeitos(efeito);
                }
              }}
              racaInicial={ficha?.racaPrincipal ? ficha.racaPrincipal : null}
              atributosIniciais={atributosSelecionados}
              usarRegrasEspeciais2014={rulesetData.version === "DND_2014"}
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
              titulo={`Escolha sua ${rulesetData.regras.labelSubRacaOuOpcao}`}
              opcoes={subRacas}
              onClose={() => setSubGrupoAberto(false)}
              onSelect={(subRaca) => {
                ficha?.setSubRaca(subRaca);
                ficha?.excluirEfeitoPorTitulo("subRaca");
                setSubGrupoAberto(false);
                let efeito = new Efeitos();
                efeito.setProeficienciasRaca(subRaca?.proeficiencias ?? []);
                efeito.setLevel(1);
                efeito.setTituloEfeito("subRaca");
                ficha?.setEfeitos(efeito);
                forceUpdate();
              }}
              racaInicial={ficha?.subRaca ? ficha.subRaca : null}
              onAtributeSelect={(atributoEscolhido) => {
                setAtributosSelecionados(atributoEscolhido);
              }}
              onFerramentaSelect={(ferramenta) => {
                let efeito = new Efeitos();
                ficha?.excluirEfeitoPorTitulo("ferramentaSubRaca");
                if(ferramenta){
                  efeito.proeficienciasRaca.push(ferramenta);
                  efeito.setLevel(1);
                  efeito.setTituloEfeito("ferramentaSubRaca");
                  ficha?.setEfeitos(efeito);
                }
              }}
              atributosIniciais={atributosSelecionados}
              usarRegrasEspeciais2014={rulesetData.version === "DND_2014"}
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
                if (!classes || !ficha?.selecionarClasseNoNivel(classes, 1)) return;
                ficha?.setClassePrincipal(classes);
                ficha?.excluirEfeitoPorTitulo("classePrincipal")
                let efeito = new Efeitos();
                if (classes?.armaduras && classes.armas) efeito.setProeficienciasClasse([...classes?.armaduras, ...classes?.armas]);
                efeito.setLevel(1);
                efeito.setTituloEfeito("classePrincipal");
                ficha?.setEfeitos(efeito);
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
              titulo={`Escolha sua ${rulesetData.regras.labelBackgroundOuOrigem}`}
              opcoes={backGrounds}
              onClose={() => setModalBackGroundsAberto(false)}
              onSelect={(backGrounds) => {
                ficha?.setBackGround(backGrounds)
                ficha?.excluirEfeitoPorTitulo("background")
                if (rulesetData.regras.backgroundConcedeAtributos) {
                  if (ficha) arquivarEscolha(ficha, 'atributos-antes-da-origem', ficha.atributosPersonagem);
                  ficha?.setAtributosPersonagem(null);
                  ficha?.setIniciativa(null);
                }
                setModalBackGroundsAberto(false)
                if (rulesetData.version === "DND_2014") {
                  if (idiomasSelecionado && idiomasSelecionado[1]) {
                    ficha?.removerIdioma(idiomasSelecionado[1].nome);
                  }
                  if (idiomasSelecionado && idiomasSelecionado[0]) {
                    ficha?.removerIdioma(idiomasSelecionado[0].nome);
                  }
                  if (backGrounds?.nome === "Membro da Guilda dos Ladrões das Sombras") {
                    let idioma = idiomas.find(i => i.nome === "Gíria de Ladrões");
                    if (idioma) {
                      setIdiomasSelecionado([idioma]);
                      ficha?.setIdiomas(idioma.nome);
                    }
                  } else {
                    setIdiomasSelecionado(null)
                  }
                }
                let efeito = new Efeitos();
                backGrounds?.proeficienciaFerramentas && efeito.setProeficienciasBackGround(backGrounds?.proeficienciaFerramentas);
                efeito.setLevel(1);
                efeito.setTituloEfeito("background");
                ficha?.setEfeitos(efeito);
                if (rulesetData.regras.backgroundConcedeTalentoOrigem) {
                  const origem2024 = backGrounds as BackGround & { talentoOrigem?: string };
                  const antigos = ficha?.efeitos?.filter(e => e.tituloEfeito === 'TalentoOrigem') ?? [];
                  if (ficha && antigos.length) ficha.escolhasAnteriores = [...(ficha.escolhasAnteriores ?? []), { tipo: 'talento-origem', valor: JSON.parse(JSON.stringify(antigos)) }];
                  ficha?.excluirEfeitoPorTitulo("TalentoOrigem");
                  if (origem2024?.talentoOrigem) {
                    let efeitoTalento = new Efeitos();
                    efeitoTalento.setTalento(origem2024.talentoOrigem);
                    const conteudo = buscarTalentoConteudo('DND_2024', origem2024.talentoOrigem);
                    // Escolhas obrigatórias são concluídas no nível 1; nunca inventadas.
                    if (ficha && conteudo?.suportado && !conteudo.escolha && !erroTalento(ficha, 1, conteudo, [], 'Origin')) registrarTalento(efeitoTalento, conteudo, []);
                    efeitoTalento.setLevel(1);
                    efeitoTalento.setTituloEfeito("TalentoOrigem");
                    ficha?.setEfeitos(efeitoTalento);
                  }
                }
                forceUpdate();
              }}
              onInstrumentoSelect={(instrumento) => {
                if (instrumento) ficha?.backGround?.equipamentos.push(instrumento);
              }}
              onItemSelect={(item) => {
                if (item) ficha?.backGround?.equipamentos.push(item);
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
                const anterior = idiomasSelecionado[idiomaIndice]?.nome;
                if (anterior) ficha?.removerIdioma(anterior);
                ficha?.setIdiomas(idioma.nome);
                const array = idiomasSelecionado ? [...idiomasSelecionado] : [];
                array[idiomaIndice] = idioma
                setIdiomasSelecionado(array)
                setModalIdiomasAberto(false)
              }}
              idiomaInicial={idiomasSelecionado ? idiomasSelecionado[idiomaIndice] : null}
              idiomasPermitidos={rulesetData.regras.idiomasDisponiveis.length > 0 ? rulesetData.regras.idiomasDisponiveis : undefined}
            />
          </div>
        </>
      )}

      <div className="todos-niveis-container">
        <div className="niveis-container">
          <div className="nivel">
            {ficha?.racaPrincipal &&
              ficha?.classePrincipal &&
              ficha?.backGround &&
              idiomasObrigatoriosSelecionados &&
              (ficha.racaPrincipal.subOpcoes && ficha.racaPrincipal.subOpcoes.length > 0 ? ficha.subRaca : true) ? (
              <LevelOneSetup key={`${ficha.id}-${ficha.classePrincipal.nome}-${ficha.backGround.nome}`} raca={ficha.subRaca ? ficha.subRaca : ficha.racaPrincipal} classe={ficha.classePrincipal} />
            ) : "Nivel 1"}
          </div>
        </div>


        {[...Array(19)].map((_, i) => (
          <div key={i + 2} className="niveis-container">
            <div className="nivel">
              {ficha?.racaPrincipal &&
                ficha?.classePrincipal &&
                ficha?.backGround &&
                idiomasObrigatoriosSelecionados &&
                (ficha.racaPrincipal.subOpcoes && ficha.racaPrincipal.subOpcoes.length > 0 ? ficha.subRaca : true) ? (
                <NivelBlock
                  key={i + 2}
                  nivel={i + 2}
                  classesDisponiveis={classes}
                  selecionarMulticlasse={selecionarMulticlasse}
                />
              ) : "Nivel " + (i + 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
