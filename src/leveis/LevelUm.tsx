import React, { useState, useEffect } from "react";
import iconClasse from "../imagens/icon_class.png"
import iconRaca from "../imagens/icon_ancestry.png"
import { Classes } from "../api/classesPrincipais/Classes.class.ts"
import { Raca } from "../api/classesPrincipais/Raca.class.ts"
import "../pages/css/LevelOneSetup.css"
import CaracteristicasClasse from "./components/CaracteristicasClasseProps.tsx";
import CaracteristicasPatrono from "./components/CaracteristicasPatronoProps.tsx";
import TalentoDescricao from "./components/TalendoDescricao.tsx";
import ModalSelecaoPatrono from "../pages/modals/ModalSelecaoPatrono.tsx";
import ModalSelecaoTalento from "../pages/modals/ModalSelecaoTalento.tsx";
import { Patronos } from "../api/classesEspeciais/Patronos.class.ts";
import { Corruptor } from "../api/classesEspeciais/Corruptor.class.ts";
import { Arquifada } from "../api/classesEspeciais/Arquifada.class.ts";
import { GrandeAntigo } from "../api/classesEspeciais/GrandeAntigo.class.ts";
import { Talentos } from "../bibliotecas/Talentos.ts";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx"
import { Atributos } from "../api/classesPrincipais/Atributos.class.ts";
import { SubClasses } from "../api/classesPrincipais/SubClasses.ts";
import ModalSelecaoSubClasse from "../pages/modals/ModalSelecaoSubClasse.tsx";
import { Draconato, dracoes } from "../api/classesFilhos/Draconato.class.ts";

interface LevelOneSetupProps {
  raca: Raca;
  classe: Classes;
}

const LevelOneSetup: React.FC<LevelOneSetupProps> = ({ raca, classe }) => {
  const [modalPatronoAberto, setModalPatronoAberto] = useState(false);
  const [patronoSelecionado, setPatronoSelecionado] = useState<Patronos | null>(null);
  const [modalHumanoVarianteAberto, setModalHumanoVarianteAberto] = useState(false);
  const [humanoVarianteFeatEscolhido, setHumanoVarianteFeatEscolhido] = useState<Talento | null>(null);
  const [subGrupoAberto, setSubGrupoAberto] = useState(false);
  const [subClasses, setSubClasses] = useState<SubClasses[] | null>([]);
  const { ficha, forceUpdate } = useFicha();
  const [proeficienciasEscolhidas, setProeficienciasEscolhidas] = useState<string[]>([]);
  const [tracosExpandidos, setTracosExpandidos] = useState<Record<string, boolean>>({});
  const [mostrarPopupAtributos, setMostrarPopupAtributos] = useState(false);
  const [valoresDisponiveis, setValoresDisponiveis] = useState<number[]>([]);
  const [pontosDisponiveis, setPontosDisponiveis] = useState(27);
  const listaDracoes = dracoes;

  useEffect(() => {
    const novasProeficiencias = [];
    setProeficienciasEscolhidas(novasProeficiencias);
  }, [ficha?.backGround]);

  type Talento = {
    nome: string;
    descricao: string;
  };

  const talentos: Talento[] = Talentos;

  const patronos: Patronos[] = [
    new Corruptor(),
    new Arquifada(),
    new GrandeAntigo()
  ]

  const [atributoMetodo, setAtributoMetodo] = useState<string | null>(null);
  const [atributos, setAtributos] = useState({
    forca: 8,
    destreza: 8,
    constituicao: 8,
    inteligencia: 8,
    sabedoria: 8,
    carisma: 8
  });

  const toggleTraco = (nome: string) => {
    setTracosExpandidos((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  const toggleProeficiencia = (habilidade: string) => {
    setProeficienciasEscolhidas((prev) => {
      let novaLista;

      if (prev.includes(habilidade)) {
        novaLista = prev.filter((h) => h !== habilidade);
      } else if (prev.length < classe.habilidade) {
        novaLista = [...prev, habilidade];
      } else {
        return prev;
      }
      ficha?.setPericias(novaLista);
      forceUpdate();
      return novaLista;
    });
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

  const aplicarAtributosDaRaca = (raca: { atributos?: { atributo: string[]; bonus: number[] } }) => {
    if (raca.atributos) {
      const { atributo, bonus } = raca.atributos;

      for (let i = 0; i < atributo.length; i++) {
        const atributoAtual = atributo[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const bonusAtual = bonus[i];

        ficha?.atributosPersonagem?.somarAtributo(atributoAtual, bonusAtual);
      }
    }
    console.log(ficha?.atributosPersonagem);
  }

  const atualizarValoresDisponiveis = (valor: number, valorAntigo: number | null) => {
    let array = valoresDisponiveis
    const index = array.indexOf(valor);

    if (index !== -1) {
      const novoArray = array.map((v, i) => (i === index ? valorAntigo : v)).filter(v => v !== null);
      setValoresDisponiveis(novoArray)
    } else {
      const novoArray = [...array, valorAntigo].filter(v => v !== null);
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

  function validaSubClasse(classe, nivel) {
    // Converte a classe para minúsculas para evitar problemas de case sensitivity
    classe = classe?.toLowerCase();

    // Verifica as condições
    const condicao1 = (classe === "feiticeiro" || classe === "clerigo") && nivel === 1;
    const condicao2 = (classe === "druida" || classe === "mago") && nivel === 2;
    const condicao3 = nivel === 3 && !["feiticeiro", "clérigo", "bruxo", "druida", "mago"].includes(classe);

    // Retorna true se qualquer uma das condições for verdadeira
    return condicao1 || condicao2 || condicao3;
  }

  const renderPopupAtributos = () => {
    if (!mostrarPopupAtributos) return null;

    return (
      <div className="monta-atributos-container-distribuicao">
        <div className="monta-atributos-distribuicao">
          <h3 className="tituloh3">Distribuição de Atributos</h3>
          {atributoMetodo === "Array Padrão" && (
            <div className="atributos-container-distribuicao">
              {Object.keys(atributos).map((atributo) => (
                <div key={atributo} className="atributo-item-distribuicao">
                  <label>{atributo.toUpperCase()}</label>
                  <select
                    name={atributos[atributo]}
                    value={atributos[atributo as keyof typeof atributos] || 0}
                    onChange={(e) => {
                      if (atributos[atributo] === 0) {
                        atualizarValoresDisponiveis(parseInt(e.target.value), null);
                      } else {
                        atualizarValoresDisponiveis(parseInt(e.target.value), atributos[atributo]);
                      }
                      atualizarAtributo(atributo as keyof typeof atributos, parseInt(e.target.value, 10));
                    }}
                  >
                    <option value={atributos[atributo]} disabled hidden>{atributos[atributo]}</option>
                    <option value="0">--</option>
                    {valoresDisponiveis.map((valor) => (
                      <option key={valor} value={valor}>
                        {valor}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          {atributoMetodo === "Point Buy" && (
            <div className="atributos-container-distribuicao">
              {Object.keys(atributos).map((atributo) => (
                <div key={atributo} className="atributo-item-distribuicao">
                  <label>{atributo.toUpperCase()}</label>
                  <div className="point-buy-controls">
                    <button onClick={() => ajustarAtributo(atributo as keyof typeof atributos, "decrementar")}>
                      -
                    </button>
                    <span>{atributos[atributo as keyof typeof atributos]}</span>
                    <button onClick={() => ajustarAtributo(atributo as keyof typeof atributos, "incrementar")}>
                      +
                    </button>
                  </div>
                </div>
              ))}
              <p>Pontos disponíveis: {pontosDisponiveis}</p>
            </div>
          )}
          {atributoMetodo === "Rolagem de Dados" && (
            <div className="atributos-container-distribuicao">
              <p>Valores rolados: {valoresDisponiveis.join(", ")}</p>
              {Object.keys(atributos).map((atributo) => (
                <div key={atributo} className="atributo-item-distribuicao">
                  <label>{atributo.toUpperCase()}</label>
                  <select
                    name={atributos[atributo]}
                    value={atributos[atributo as keyof typeof atributos] || 0}
                    onChange={(e) => {
                      if (atributos[atributo] === 0) {
                        atualizarValoresDisponiveis(parseInt(e.target.value), null);
                      } else {
                        atualizarValoresDisponiveis(parseInt(e.target.value), atributos[atributo]);
                      }
                      atualizarAtributo(atributo as keyof typeof atributos, parseInt(e.target.value, 10));
                    }}
                  >
                    <option value={atributos[atributo]} disabled hidden>{atributos[atributo]}</option>
                    <option value='0'>--</option>
                    {valoresDisponiveis.map((valor) => (
                      <option key={valor} value={valor}>
                        {valor}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => {
            fecharPopup();
            const atributosConcluidos = new Atributos(
              atributos.forca,
              atributos.destreza,
              atributos.constituicao,
              atributos.inteligencia,
              atributos.sabedoria,
              atributos.carisma
            );
            ficha?.setAtributosPersonagem(
              atributosConcluidos
            );
            console.log(ficha?.atributosPersonagem);
            aplicarAtributosDaRaca(raca);
            console.log(ficha?.atributosPersonagem);
            forceUpdate();
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
  const toggleSecao = (secao) => {
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
                <h3 className="tituloh3">Traços Raciais{secoesExpandidas.tracos ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.tracos && (
                <div>
                  {raca.nome === "Humano Variante" &&
                    <>
                      <button className="botao-selecao-talento" onClick={() => setModalHumanoVarianteAberto(true)}>
                        <img src={iconRaca} className="button-icon" alt="HumanoFeat" />
                        <div className="botao-texto">
                          <span>Selecionar Talento</span>
                          <strong>{humanoVarianteFeatEscolhido ? humanoVarianteFeatEscolhido.nome : "Selecionar Talento"}</strong>
                        </div>
                      </button>
                      {modalHumanoVarianteAberto && (
                        <>
                          <div className="popup-overlay" onClick={() => setModalHumanoVarianteAberto(false)}></div>
                          <div className="popup">
                            <ModalSelecaoTalento
                              titulo="Escolha um Talento"
                              opcoes={talentos}
                              onClose={() => setModalHumanoVarianteAberto(false)}
                              onSelect={(talento) => {
                                setHumanoVarianteFeatEscolhido(talento);
                                setModalHumanoVarianteAberto(false);
                              }}
                              talentoInicial={humanoVarianteFeatEscolhido}
                            />
                          </div>
                        </>
                      )}
                      {humanoVarianteFeatEscolhido && <TalentoDescricao talento={humanoVarianteFeatEscolhido?.nome} />}
                    </>
                  }
                  {raca.tracos?.map((traco) => (
                    <div key={traco.traco} className="skills-container">
                      <button onClick={() => toggleTraco(traco.traco)}>
                        {traco.traco} {tracosExpandidos[traco.traco] ? "▲" : "▼"}
                      </button>
                      {tracosExpandidos[traco.traco] && <p className="descricao">{traco.descricao}</p>}
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
                  {classe.nome === "Bruxo" &&
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
                                setPatronoSelecionado(patrono);
                                setModalPatronoAberto(false);
                              }}
                              patronoInicial={patronoSelecionado}
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
              subClasseInicial={ficha?.subClasse?.find(s => s.classe === classe)?.subclasse ?? null}
            />
          </div>
        </>
      )}
    </>
  );
};

export default LevelOneSetup;
