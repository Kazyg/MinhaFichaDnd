import React, { useState } from "react";
import { Classes } from "../api/classesPrincipais/Classes.class.ts"
import { Raca } from "../api/classesPrincipais/Raca.class.ts"
import "../pages/css/LevelOneSetup.css"
import CaracteristicasClasse from "./components/CaracteristicasClasseProps.tsx";

interface LevelOneSetupProps {
  raca: Raca;
  classe: Classes;
}

const LevelOneSetup: React.FC<LevelOneSetupProps> = ({ raca, classe }) => {
  const [atributoMetodo, setAtributoMetodo] = useState<string | null>(null);
  const [atributos, setAtributos] = useState({
    forca: 8,
    destreza: 8,
    constituicao: 8,
    inteligencia: 8,
    sabedoria: 8,
    carisma: 8
  });
  const [proeficienciasEscolhidas, setProeficienciasEscolhidas] = useState<string[]>([]);
  const [tracosExpandidos, setTracosExpandidos] = useState<Record<string, boolean>>({});
  const [mostrarPopupAtributos, setMostrarPopupAtributos] = useState(false);

  const toggleTraco = (nome: string) => {
    setTracosExpandidos((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  const toggleProeficiencia = (habilidade: string) => {
    if (proeficienciasEscolhidas.includes(habilidade)) {
      setProeficienciasEscolhidas(proeficienciasEscolhidas.filter((h) => h !== habilidade));
    } else if (proeficienciasEscolhidas.length < classe.habilidade) {
      setProeficienciasEscolhidas([...proeficienciasEscolhidas, habilidade]);
    }
  };

  const [valoresDisponiveis, setValoresDisponiveis] = useState<number[]>([]); // Para Array Padrão e Rolagem de Dados
  const [pontosDisponiveis, setPontosDisponiveis] = useState(27); // Para Point Buy

  // Métodos de distribuição de atributos
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
      if(metodo === "Point Buy")
      {
        setAtributos({
          forca: 8,
          destreza: 8,
          constituicao: 8,
          inteligencia: 8,
          sabedoria: 8,
          carisma: 8,
        });
      }else {
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

    if (operacao === "incrementar" && valorAtual < 15 && pontosDisponiveis > 0) {
      novoValor = valorAtual + 1;
      if(novoValor >= 14)
      {
        setPontosDisponiveis((prev) => prev - 2);
      }else{
        setPontosDisponiveis((prev) => prev - 1);
      }
    } else if (operacao === "decrementar" && valorAtual > 8) {
      novoValor = valorAtual - 1;
      if(valorAtual >= 14)
        {
          setPontosDisponiveis((prev) => prev + 2);
        }else{
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
      // Se encontrou o valor antigo, substitui e remove caso seja null
      const novoArray = array.map((v, i) => (i === index ? valorAntigo : v)).filter(v => v !== null);
      setValoresDisponiveis(novoArray)
    } else {
      // Se não encontrou, adiciona o novo valor ao array
      const novoArray = [...array, valorAntigo].filter(v => v !== null);
      setValoresDisponiveis(novoArray)
    }
  }

  // Renderizar o popup de distribuição de atributos
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
          <button onClick={() => { fecharPopup(); console.log(atributos) }}>Fechar</button>
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
                    <button className="botao-distribuir" onClick={() => {iniciarDistribuicao()}}>
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
                  {raca.tracos?.map((traco) => (
                    <div key={traco.traco} className="skills-container">
                      <button onClick={() => toggleTraco(traco.traco)}>
                        {traco.traco} {tracosExpandidos[traco.traco] ? "▲" : "▼"}
                      </button>
                      {tracosExpandidos[traco.traco] && <p className="descricao">{traco.descricao}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            {/* Escolha de Proficiências */}
            <div>
              <button className="secao-toggle" onClick={() => toggleSecao("proeficiencias")}>
              <h3 className="tituloh3">Escolha de Proficiências ({classe.habilidade} opções){secoesExpandidas.proeficiencias ? "▲" : "▼"}</h3>
              </button>
              {secoesExpandidas.proeficiencias && (
                <div>
                  {classe.habilidades.map((habilidade) => (
                    <div key={habilidade} className="checkbox-container">
                      <input
                        type="checkbox"
                        id={habilidade}
                        checked={proeficienciasEscolhidas.includes(habilidade)}
                        onChange={() => toggleProeficiencia(habilidade)}
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
              {secoesExpandidas.caracteristicas && <CaracteristicasClasse classe={classe} />}
            </div>
          </>
        )}
      </div>
    );
};

export default LevelOneSetup;
