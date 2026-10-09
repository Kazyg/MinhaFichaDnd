import TalentoOrigem from './components/TalentoOrigem';
import { erroTalento, selecionarTalentoInicial, talentosDisponiveis } from '../api/fichaPersonagem/talentosConteudo';
import { podeTerSubclasse } from '../api/fichaPersonagem/subclasseElegibilidade';
import React, { useState } from "react";
import iconClasse from "../imagens/icon_class.png"
import iconRaca from "../imagens/icon_ancestry.png"
import { Classes } from "../api/classesPrincipais/Classes.class"
import { Raca } from "../api/classesPrincipais/Raca.class"
import "../pages/css/LevelOneSetup.css"
import CaracteristicasClasse from "./components/CaracteristicasClasseProps";
import CaracteristicasPatrono from "./components/CaracteristicasPatronoProps";
import TalentoDescricao from "./components/TalendoDescricao";
import ModalSelecaoPatrono from "../pages/modals/ModalSelecaoPatrono";
import ModalSelecaoTalento from "../pages/modals/ModalSelecaoTalento";
import { Patronos } from "../api/classesEspeciais/Patronos.class";
import { Corruptor } from "../api/classesEspeciais/Corruptor.class";
import { Arquifada } from "../api/classesEspeciais/Arquifada.class";
import { Celestial } from "../api/classesEspeciais/OCelestial";
import { LaminaMaldita } from "../api/classesEspeciais/LaminaMaldita";
import { GrandeAntigo } from "../api/classesEspeciais/GrandeAntigo.class";
import { useFicha } from "../api/fichaPersonagem/FichaContext"
import { erroDistribuicao } from "../api/rulesets/progressao";
import { SubClasses } from "../api/classesPrincipais/SubClasses";
import ModalSelecaoSubClasse from "../pages/modals/ModalSelecaoSubClasse";
import { Draconato, dracoes } from "../api/classesFilhos/Draconato.class";
import { getRulesetConfig } from "../api/rulesets/regras";

interface LevelOneSetupProps {
  raca: Raca;
  classe: Classes;
}

const LevelOneSetup: React.FC<LevelOneSetupProps> = ({ raca, classe }) => {
  const { ficha, forceUpdate } = useFicha();
  const [modalPatronoAberto, setModalPatronoAberto] = useState(false);
  const patronoSelecionado = ficha?.patrono;
  const [modalHumanoVarianteAberto, setModalHumanoVarianteAberto] = useState(false);
  const [subGrupoAberto, setSubGrupoAberto] = useState(false);
  const [subClasses, setSubClasses] = useState<SubClasses[] | null>([]);
  const fixas = [...(ficha?.backGround?.proeficienciasHabilidades ?? []), ...(ficha?.racaPrincipal?.pericia ?? [])];
  const proeficienciasEscolhidas = (ficha?.pericias ?? []).filter(p => classe.habilidades.includes(p) && !fixas.includes(p));
  const [tracosExpandidos, setTracosExpandidos] = useState<Record<string, boolean>>({});
  const [mostrarPopupAtributos, setMostrarPopupAtributos] = useState(false);
  const [erroConclusao, setErroConclusao] = useState('');
  const [modalTalentoOrigemHumanoAberto, setModalTalentoOrigemHumanoAberto] = useState(false);
  const padrao = {
    metodo: null as string | null,
    atributos: Object.fromEntries(['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map(k => [k, (ficha?.atributosPersonagem as any)?.[k]?.valor ?? 8])),
    valores: [] as number[], pontos: 27, modo: "todos" as "todos" | "dois", maior: "", menor: "",
  };
  const distribuicao = ficha?.distribuicaoAtributos ?? padrao;
  function campo<K extends keyof typeof padrao>(key: K): [typeof padrao[K], React.Dispatch<React.SetStateAction<typeof padrao[K]>>] {
    return [distribuicao[key], value => {
      if (!ficha) return;
      const atual = ficha.distribuicaoAtributos ?? padrao;
      ficha.distribuicaoAtributos = { ...atual, [key]: typeof value === 'function' ? (value as (prev: typeof padrao[K]) => typeof padrao[K])(atual[key]) : value };
      forceUpdate();
    }];
  }
  const [valoresDisponiveis, setValoresDisponiveis] = campo('valores');
  const [pontosDisponiveis, setPontosDisponiveis] = campo('pontos');
  const [modoBonusOrigem, setModoBonusOrigem] = campo('modo');
  const [atributoOrigemBonusMaior, setAtributoOrigemBonusMaior] = campo('maior');
  const [atributoOrigemBonusMenor, setAtributoOrigemBonusMenor] = campo('menor');
  const [atributoMetodo, setAtributoMetodo] = campo('metodo');
  const [atributos, setAtributos] = campo('atributos');
  const listaDracoes = dracoes;
  const rulesetData = getRulesetConfig(ficha?.versaoRegras);
  const origemComAtributos = ficha?.backGround as { atributos?: { atributo: string[]; bonus: number[] } } | null | undefined;
  const atributosOrigem = origemComAtributos?.atributos?.atributo ?? [];
  const bonusOrigemValido = !rulesetData.regras.backgroundConcedeAtributos ||
    !rulesetData.regras.backgroundPermiteEscolhaBonusAtributo ||
    modoBonusOrigem === "todos" ||
    (!!atributoOrigemBonusMaior && !!atributoOrigemBonusMenor && atributoOrigemBonusMaior !== atributoOrigemBonusMenor);

  const tituloTalentoHumano = rulesetData.version === "DND_2024" ? "TalentoOrigemHumano" : "TalentoEscolhidoHumanoVariante";
  const efeitosTalentoHumano = ficha?.efeitos?.filter(e => e.tituloEfeito === tituloTalentoHumano) ?? [];
  const talentos = ficha ? talentosDisponiveis(ficha, 1, rulesetData.version === 'DND_2024' ? 'Origin' : undefined, efeitosTalentoHumano) : [];
  const humanoComTalento = raca.nome === "Humano Variante" || (rulesetData.version === "DND_2024" && raca.nome === "Humano");

  const patronos: Patronos[] = [
    new Corruptor(),
    new Arquifada(),
    new GrandeAntigo(),
    new LaminaMaldita(),
    new Celestial()
  ]

  const chavesAtributos = Object.keys(atributos);

  const toggleTraco = (nome: string) => {
    setTracosExpandidos((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  const toggleProeficiencia = (habilidade: string) => {
    const prev = proeficienciasEscolhidas;
    if (!ficha) return;
    if (prev.includes(habilidade)) ficha.pericias = (ficha.pericias ?? []).filter(p => p !== habilidade);
    else if (prev.length < classe.habilidade) ficha.pericias = [...new Set([...(ficha.pericias ?? []), habilidade])];
    forceUpdate();
  };

  const gerarArrayPadrao = () => [15, 14, 13, 12, 10, 8];
  const rolarDados = () => {
    const rolar4d6 = () => {
      const dados = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      return dados.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0);
    };
    return Array.from({ length: 6 }, rolar4d6);
  };

  // Iniciar a distribuição de atributos
  const iniciarDistribuicao = () => {
    setMostrarPopupAtributos(true);
  };

  // Fechar o popup e resetar os valores
  const fecharPopup = () => {
    setMostrarPopupAtributos(false);
  };

  // Resetar atributos ao mudar o método
  const selecionarMetodo = (metodo: string) => {
    if (atributoMetodo !== metodo) {
      setAtributoMetodo(metodo);
      setPontosDisponiveis(27);
      let valores: number[] = [];
      switch (metodo) {
        case "Array Padrão":
          valores = gerarArrayPadrao();
          break;
        case "Rolagem de Dados":
          valores = rolarDados();
          break;
        default:
          valores = [];
      }
      setValoresDisponiveis(valores);
      if (ficha?.distribuicaoAtributos) ficha.distribuicaoAtributos.gerados = valores.slice();
      if (metodo === "Point Buy") {
        setAtributos({
          forca: 8,
          destreza: 8,
          constituicao: 8,
          inteligencia: 8,
          sabedoria: 8,
          carisma: 8,
        });
      } else {
        setAtributos({
          forca: 0,
          destreza: 0,
          constituicao: 0,
          inteligencia: 0,
          sabedoria: 0,
          carisma: 0,
        });
      }
    }
  };

  // Aumentar ou diminuir atributo (Point Buy)
  const ajustarAtributo = (atributo: keyof typeof atributos, operacao: "incrementar" | "decrementar") => {
    const valorAtual = atributos[atributo];
    let novoValor = valorAtual;

    if (operacao === "incrementar" && valorAtual < 15 && pontosDisponiveis > 0 && valorAtual >= 8) {
      if (novoValor + 1 >= 14 && pontosDisponiveis >= 2) {
        novoValor = valorAtual + 1;
        setPontosDisponiveis((prev) => prev - 2);
      } else if (novoValor + 1 <= 13) {
        novoValor = valorAtual + 1;
        setPontosDisponiveis((prev) => prev - 1);
      }
    } else if (operacao === "decrementar" && valorAtual > 8) {
      novoValor = valorAtual - 1;
      if (valorAtual >= 14) {
        setPontosDisponiveis((prev) => prev + 2);
      } else {
        setPontosDisponiveis((prev) => prev + 1);
      }
    }

    setAtributos((prev) => ({ ...prev, [atributo]: novoValor }));
  };

  const atualizarAtributo = (atributo: keyof typeof atributos, novoValor: number) => {
    setAtributos((prev) => ({
      ...prev, // Mantém os outros atributos
      [atributo]: novoValor, // Atualiza apenas o atributo específico
    }));
  };

  const atualizarValoresDisponiveis = (valor: number, valorAntigo: number | null) => {
    let array = valoresDisponiveis
    const index = array.indexOf(valor);

    if (index !== -1) {
      const novoArray = array.map((v, i) => (i === index ? valorAntigo : v)).filter((v): v is number => v !== null && v !== 0);
      setValoresDisponiveis(novoArray)
    } else {
      const novoArray = [...array, valorAntigo].filter((v): v is number => v !== null && v !== 0);
      setValoresDisponiveis(novoArray)
    }
  }

  const abrirSubGrupo = () => {
    if (classe?.subClasse) {
      if (classe.subClasse.length > 0) {
        setSubClasses(classe.subClasse);
        setSubGrupoAberto(true);
      }
    }
  };

  const textoSubclasse = () => {
    switch (classe.nome.toLowerCase()) {
      case "patrulheiro":
        return "Conclave de Patrulheiro";
      case "bárbaro":
      case "barbaro":
        return "seu Caminho Primitivo";
      case "bardo":
        return "seu Colégio de Bardo";
      case "bruxo":
        return "sua Dádiva do Pacto"
      case "druida":
        return "seu Círculo Druídico";
      case "feiticeiro":
        return "sua Origem de Feitiçaria";
      case "guerreiro":
        return "seu Arquétipo Marcial";
      case "ladino":
        return "seu Arquétipo de Ladino";
      case "mago":
        return "sua Tradição Arcana";
      case "monge":
        return "sua Tradição Monástica";
      case "paladino":
        return "seu Juramento Sagrado";
      case "clerigo":
        return "seu Domínio Divino"
      default:
        return "Classe não encontrada ou sem subclasse definida.";
    }
  }

  function validaSubClasse(classe?: string, nivel?: number) {
    return !!classe && !!nivel && podeTerSubclasse(classe, nivel, rulesetData.version);
  }

  const renderPopupAtributos = () => {
    if (!mostrarPopupAtributos) return null;

    return (
      <div className="monta-atributos-container-distribuicao">
        <div className="monta-atributos-distribuicao">
          <div className="atributos-popup-grid">
            <div className="atributos-popup-coluna">
              <h3 className="tituloh3">Distribuição de Atributos</h3>
              {atributoMetodo === "Array Padrão" && (
                <div className="atributos-container-distribuicao">
                  {chavesAtributos.map((atributo) => (
                    <div key={atributo} className="atributo-item-distribuicao">
                      <label>{atributo.toUpperCase()}</label>
                      <select name={String(atributos[atributo])} value={atributos[atributo as keyof typeof atributos] || 0} onChange={(e) => {
                        if (atributos[atributo] === 0) atualizarValoresDisponiveis(parseInt(e.target.value), null);
                        else atualizarValoresDisponiveis(parseInt(e.target.value), atributos[atributo]);
                        atualizarAtributo(atributo as keyof typeof atributos, parseInt(e.target.value, 10));
                      }}>
                        <option value={atributos[atributo]} disabled hidden>{atributos[atributo]}</option>
                        <option value="0">--</option>
                        {valoresDisponiveis.map((valor, index) => <option key={index} value={valor}>{valor}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              {atributoMetodo === "Point Buy" && (
                <div className="atributos-container-distribuicao">
                  {chavesAtributos.map((atributo) => (
                    <div key={atributo} className="atributo-item-distribuicao">
                      <label>{atributo.toUpperCase()}</label>
                      <div className="point-buy-controls">
                        <button onClick={() => ajustarAtributo(atributo as keyof typeof atributos, "decrementar")}>-</button>
                        <span>{atributos[atributo as keyof typeof atributos]}</span>
                        <button onClick={() => ajustarAtributo(atributo as keyof typeof atributos, "incrementar")}>+</button>
                      </div>
                    </div>
                  ))}
                  <p>Pontos disponíveis: {pontosDisponiveis}</p>
                </div>
              )}
              {atributoMetodo === "Rolagem de Dados" && (
                <div className="atributos-container-distribuicao">
                  <p>Valores rolados: {valoresDisponiveis.join(", ")}</p>
                  {chavesAtributos.map((atributo) => (
                    <div key={atributo} className="atributo-item-distribuicao">
                      <label>{atributo.toUpperCase()}</label>
                      <select name={String(atributos[atributo])} value={atributos[atributo as keyof typeof atributos] || 0} onChange={(e) => {
                        if (atributos[atributo] === 0) atualizarValoresDisponiveis(parseInt(e.target.value), null);
                        else atualizarValoresDisponiveis(parseInt(e.target.value), atributos[atributo]);
                        atualizarAtributo(atributo as keyof typeof atributos, parseInt(e.target.value, 10));
                      }}>
                        <option value={atributos[atributo]} disabled hidden>{atributos[atributo]}</option>
                        <option value='0'>--</option>
                        {valoresDisponiveis.map((valor, index) => <option key={index} value={valor}>{valor}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {rulesetData.regras.backgroundConcedeAtributos && rulesetData.regras.backgroundPermiteEscolhaBonusAtributo && atributosOrigem.length > 0 && (
              <div className="atributos-container-distribuicao atributos-popup-coluna">
                <h4>Bônus de atributos da {rulesetData.regras.labelBackgroundOuOrigem}</h4>
                <label><input type="radio" checked={modoBonusOrigem === "todos"} onChange={() => setModoBonusOrigem("todos")} />+1 em cada atributo sugerido</label>
                <label><input type="radio" checked={modoBonusOrigem === "dois"} onChange={() => setModoBonusOrigem("dois")} />+2 em um atributo e +1 em outro</label>
                {modoBonusOrigem === "dois" && (
                  <>
                    <select value={atributoOrigemBonusMaior} onChange={(e) => setAtributoOrigemBonusMaior(e.target.value)}>
                      <option value="">Atributo +2</option>
                      {atributosOrigem.map((atributo) => <option key={atributo} value={atributo} disabled={atributo === atributoOrigemBonusMenor}>{atributo}</option>)}
                    </select>
                    <select value={atributoOrigemBonusMenor} onChange={(e) => setAtributoOrigemBonusMenor(e.target.value)}>
                      <option value="">Atributo +1</option>
                      {atributosOrigem.map((atributo) => <option key={atributo} value={atributo} disabled={atributo === atributoOrigemBonusMaior}>{atributo}</option>)}
                    </select>
                  </>
                )}
              </div>
            )}
            </div>
          {ficha && erroDistribuicao(ficha) && <p role="status">{erroDistribuicao(ficha)}</p>}
          {erroConclusao && <p role="alert">{erroConclusao}</p>}
          <button disabled={!bonusOrigemValido || !ficha || !!erroDistribuicao(ficha)} onClick={() => {
            if (ficha?.concluirAtributos()) { fecharPopup(); forceUpdate(); }
            else setErroConclusao('Revise os bônus da origem e os aumentos posteriores antes de concluir.');
          }}>Concluir</button>
        </div>
      </div>
    );
  };

  const [nivelExpandido, setNivelExpandido] = useState(true);
  const [secoesExpandidas, setSecoesExpandidas] = useState({
    atributos: true,
    tracos: true,
    proeficiencias: true,
    caracteristicas: true,
  });

  const toggleNivel = () => setNivelExpandido(!nivelExpandido);
  const toggleSecao = (secao: keyof typeof secoesExpandidas) => {
    setSecoesExpandidas((prev) => ({
      ...prev,
      [secao]: !prev[secao],
    }));
  };

  return (
    <>
      <div className="level-container">
        <button className="secao-toggle" onClick={toggleNivel}>
          <h2 className="tituloh2">Nível 1{nivelExpandido ? "▲" : "▼"}</h2>
        </button>
        {nivelExpandido && (
          <>
            {/* Escolha da distribuição de atributos */}
            <div>
              <button className="secao-toggle" onClick={() => toggleSecao("atributos")}>
                <h3 className="tituloh3">Método de distribuição de atributos {secoesExpandidas.atributos ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.atributos && (
                <div>
                  {[
                    "Array Padrão",
                    "Point Buy",
                    "Rolagem de Dados",
                  ].map((metodo) => (
                    <button
                      key={metodo}
                      onClick={() => selecionarMetodo(metodo)}
                      className="botao-distribuir"
                    >
                      {metodo} {atributoMetodo === metodo && "✔"}
                    </button>
                  ))}
                  {atributoMetodo && (
                    <button className="botao-distribuir" onClick={() => { iniciarDistribuicao() }}>
                      Distribuir Atributos
                    </button>
                  )}
                </div>
              )}
            </div>
            {renderPopupAtributos()}
            {/* Traços raciais */}
            <div>
              <button className="secao-toggle" onClick={() => toggleSecao("tracos")}>
                <h3 className="tituloh3">Traços de {rulesetData.regras.labelRacaOuEspecie}{secoesExpandidas.tracos ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.tracos && (
                <div>
                  <TalentoOrigem />
                  {humanoComTalento &&
                    <>
                      <button className="botao-selecao-talento" onClick={() => rulesetData.version === "DND_2024" ? setModalTalentoOrigemHumanoAberto(true) : setModalHumanoVarianteAberto(true)}>
                        <img src={iconRaca} className="button-icon" alt="HumanoFeat" />
                        <div className="botao-texto">
                          <span>{rulesetData.version === "DND_2024" ? "Selecionar Talento de Origem" : "Selecionar Talento"}</span>
                          <strong>{ficha?.efeitos?.find(e => e.tituloEfeito === tituloTalentoHumano) ? ficha?.efeitos?.find(e => e.tituloEfeito === tituloTalentoHumano)?.talento : rulesetData.version === "DND_2024" ? "Selecionar Talento de Origem" : "Selecionar Talento"}</strong>
                        </div>
                      </button>
                      {(modalHumanoVarianteAberto || modalTalentoOrigemHumanoAberto) && (
                        <>
                          <div className="popup-overlay" onClick={() => {
                            setModalHumanoVarianteAberto(false);
                            setModalTalentoOrigemHumanoAberto(false);
                          }}></div>
                          <div className="popup">
                            <ModalSelecaoTalento
                              titulo={rulesetData.version === "DND_2024" ? "Escolha um Talento de Origem" : "Escolha um Talento"}
                              opcoes={talentos}
                              onClose={() => {
                                setModalHumanoVarianteAberto(false);
                                setModalTalentoOrigemHumanoAberto(false);
                              }}
                              onSelect={(talento, escolhas) => {
                                if (!ficha || selecionarTalentoInicial(ficha, tituloTalentoHumano, talento.nome, escolhas)) return false;
                                forceUpdate(); return true;
                              }}
                              validar={(t, escolhas) => ficha ? erroTalento(ficha, 1, t, escolhas, rulesetData.version === 'DND_2024' ? 'Origin' : undefined, efeitosTalentoHumano) : 'Ficha indisponível'}
                              escolhasIniciais={efeitosTalentoHumano[0]?.escolhasTalento}
                              talentoInicial={talentos.find(t => t.nome === ficha?.efeitos?.find(e => e.tituloEfeito === tituloTalentoHumano)?.talento) ?? null}
                            />
                          </div>
                        </>
                      )}
                      {!!ficha?.efeitos?.find(e => e.tituloEfeito === tituloTalentoHumano) && <TalentoDescricao efeito={efeitosTalentoHumano[0]} talento={ficha?.efeitos?.find(e => e.tituloEfeito === tituloTalentoHumano)?.talento ?? ""} />}
                    </>
                  }
                  {raca.tracos?.map((traco) => (
                    <div key={traco.traco} className="skills-container">
                      <button onClick={() => toggleTraco(traco.traco)}>
                        {traco.traco} {tracosExpandidos[traco.traco] ? "▲" : "▼"}
                      </button>
                      {tracosExpandidos[traco.traco] && <p className="descricao texto-formatado">{traco.descricao}</p>}
                    </div>
                  ))}
                  {raca instanceof Draconato && (
                    <>
                      <div className="skills-container">
                        <button onClick={() => toggleTraco(raca.ancestralidade)}>
                          Dragao {raca.ancestralidade} {tracosExpandidos[raca.ancestralidade] ? "▲" : "▼"}
                        </button>
                        {tracosExpandidos[raca.ancestralidade] && (
                          <>
                            {listaDracoes.map((dragao) => {
                              if (dragao.nome === raca.ancestralidade) {
                                return (
                                  <div key={dragao.nome}>
                                    <p className="descricao">Tipo de Dano: {dragao.tipoDano}</p>
                                    <p className="descricao">Area do Dano: {dragao.armaSopro}</p>
                                    <p className="descricao">Teste: {dragao.teste}</p>
                                  </div>
                                );
                              }
                              return null; // Retorna null se a condição não for atendida
                            })}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Escolha de Proficiências */}
            <div>
              <button className="secao-toggle" onClick={() => toggleSecao("proeficiencias")}>
                <h3 className="tituloh3">Escolha de Proficiências ({classe.habilidade} opções){secoesExpandidas.proeficiencias ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.proeficiencias && (
                <div className="checkbox-level-container">
                  {classe.habilidades.map((habilidade) => (
                    <div key={habilidade} className="checkbox-container">
                      <input
                        type="checkbox"
                        disabled={ficha?.backGround?.proeficienciasHabilidades?.includes(habilidade) || ficha?.racaPrincipal?.pericia?.includes(habilidade)}
                        id={habilidade}
                        checked={
                          ficha?.pericias?.includes(habilidade) ||
                          proeficienciasEscolhidas.includes(habilidade)
                        }
                        onChange={() => {
                          toggleProeficiencia(habilidade);
                        }}
                      />
                      <label htmlFor={habilidade}>{habilidade}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Características do nível 1 */}
            <div>
              <button className="secao-toggle" onClick={() => toggleSecao("caracteristicas")}>
                <h3 className="tituloh3">Características de Classe Nível 1{secoesExpandidas.caracteristicas ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.caracteristicas && (
                <div>
                  {rulesetData.version === "DND_2014" && classe.nome === "Bruxo" &&
                    <>
                      <button className="botao-selecao-talento" onClick={() => setModalPatronoAberto(true)}>
                        <img src={iconClasse} className="button-icon" alt="Patrono" />
                        <div className="botao-texto">
                          <span>Selecionar Patrono</span>
                          <strong>{patronoSelecionado ? patronoSelecionado.nome : "Selecionar Patrono"}</strong>
                        </div>
                      </button>
                      {modalPatronoAberto && (
                        <>
                          <div className="popup-overlay" onClick={() => setModalPatronoAberto(false)}></div>
                          <div className="popup">
                            <ModalSelecaoPatrono
                              titulo="Escolha sua Classe"
                              opcoes={patronos}
                              onClose={() => setModalPatronoAberto(false)}
                              onSelect={(patrono) => {
                                ficha?.setPatrono(patrono);
                                setModalPatronoAberto(false);
                                forceUpdate();
                              }}
                              patronoInicial={ficha?.patrono}
                            />
                          </div>
                        </>
                      )}
                      {patronoSelecionado && (
                        <>
                          <CaracteristicasPatrono patrono={patronoSelecionado} nivel={1} />
                        </>
                      )}
                    </>
                  }
                  {validaSubClasse(classe.nome, 1) && (
                    <>
                      <button className="botao-distribuir" onClick={() => abrirSubGrupo()}>
                        <img src={iconClasse} className="button-icon" alt="Classe" />
                        <div className="botao-texto">
                          <span>Selecionar {textoSubclasse()}</span>
                          <strong>{ficha?.subClasse?.find(s => s.classe.nome === classe.nome)?.subclasse.nome || "Selecionar " + textoSubclasse()}</strong>
                        </div>
                      </button>
                    </>
                  )}
                  <CaracteristicasClasse classe={classe} nivel={1} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {subGrupoAberto && (
        <>
          <div className="popup-overlay" onClick={() => setSubGrupoAberto(false)}></div>
          <div className="popup">
            <ModalSelecaoSubClasse
              titulo={"Escolha " + textoSubclasse()}
              opcoes={subClasses}
              onClose={() => setSubGrupoAberto(false)}
              onSelect={(subClasse) => {
                if (classe && subClasse) {
                  ficha?.setSubClasse(classe, subClasse);
                }
                setSubGrupoAberto(false);
                forceUpdate();
              }}
              subClasseInicial={ficha?.subClasse?.find(s => s.classe.nome === classe.nome)?.subclasse ?? null}
            />
          </div>
        </>
      )}
    </>
  );
};

export default LevelOneSetup;
