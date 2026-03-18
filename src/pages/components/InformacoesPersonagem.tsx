import React, { useState, useRef } from "react";
import "../css/InformacoesPersonagem.css";
import iconCa from "../../imagens/icon_ac.png"
import iconMorte1 from "../../imagens/skull_24dp_000000_FILL0_wght400_GRAD0_opsz24.png"
import iconMorte2 from "../../imagens/skull_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import iconMorte3 from "../../imagens/skull_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import iconLife1 from "../../imagens/shield_with_heart_24dp_75FB4C_FILL0_wght400_GRAD0_opsz24.png"
import iconLife2 from "../../imagens/shield_with_heart_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"
import VidaComponente from "./components_InformacoesPersonagem/ModalVida.tsx";
import { calcularBonusCAItens, calcularValorAtributoFinal, listarEfeitosAtivos } from "../../api/fichaPersonagem/fichaEfeitosUtils.ts";

declare global {
  interface Window {
    nomeTimeout: number | undefined;
  }
}

export default function InformacoesPersonagem() {
  const [xp, setXp] = useState("");
  const [popupNivelAberto, setPopupNivelAberto] = useState(false);

  const { ficha, refreshKey, forceUpdate } = useFicha();
  const [tempNome, setTempNome] = useState(ficha?.nomePersonagem ?? "");

  const atributosIniciais = [
    { id: 1, nome: "FOR", valor: 10, nomeDesc: "Força" },
    { id: 2, nome: "DES", valor: 10, nomeDesc: "Destreza" },
    { id: 3, nome: "CON", valor: 10, nomeDesc: "Constituição" },
    { id: 4, nome: "INT", valor: 10, nomeDesc: "Inteligência" },
    { id: 5, nome: "SAB", valor: 10, nomeDesc: "Sabedoria" },
    { id: 6, nome: "CAR", valor: 10, nomeDesc: "Carisma" }
  ];
  const proficienciaArmaduraLeve = verificarProficiencias("armadura leve", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraMedia = verificarProficiencias("armadura media", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraPesada = verificarProficiencias("armadura pesada", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaEscudos = verificarProficiencias("escudos", "", coletarProeficiencias(ficha?.efeitos));

  const nomeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempNome(e.target.value);
    if (nomeTimeoutRef.current !== undefined) {
      clearTimeout(nomeTimeoutRef.current);
    }
    nomeTimeoutRef.current = setTimeout(() => {
      ficha?.setNomePersonagem(e.target.value);
      forceUpdate();
    }, 1500);
  };

  const calcularProeficiencia = (idAtributo: number) => {
    let nomeTesteResistencia = atributosIniciais.find(a => a.id === idAtributo)?.nomeDesc;

    if (ficha?.classePrincipal?.testesResistencias?.includes(nomeTesteResistencia ?? "")) {
      return ficha?.proeficiencia ?? 0;
    }
    return 0;
  }

  const calcularModificador = (valor: number) => {
    const num = Number(valor);
    if (isNaN(num)) return 0;
    return Math.floor((num - 10) / 2);
  }

  function calcularAtributo(dados: string) {
    if (dados === "DES") return calcularValorAtributoFinal(ficha, "destreza");
    if (dados === "CON") return calcularValorAtributoFinal(ficha, "constituicao");
    if (dados === "SAB") return calcularValorAtributoFinal(ficha, "sabedoria");
    if (dados === "INT") return calcularValorAtributoFinal(ficha, "inteligencia");
    if (dados === "FOR") return calcularValorAtributoFinal(ficha, "forca");
    if (dados === "CAR") return calcularValorAtributoFinal(ficha, "carisma");
    return 10;
  }

  function explicacaoCA() {
    const efeitosCA = listarEfeitosAtivos(ficha).filter((e: any) => e.ca === "CA");
    let explicacao: string[] = [];

    const getModStr = (atributo: string, descricao: string = "") => {
      const mod = calcularModificador(calcularAtributo(atributo));
      const valor = isNaN(mod) ? 0 : mod;
      return `${valor >= 0 ? "+" : ""}${valor}${descricao ? " " + descricao : ""}`;
    };

    const formatValor = (valor: any, descricao: string = "") => {
      const num = Number(valor);
      if (isNaN(num)) return `+0${descricao ? " " + descricao : ""}`;
      return `${num >= 0 ? "+" : ""}${num}${descricao ? " " + descricao : ""}`;
    };

    if (!ficha?.ArmaduraEquipada) {
      explicacao.push("10 (base sem armadura)");
      explicacao.push(getModStr("DES", "Destreza"));

      if (ficha?.multiclasses?.some(m => m.classe.nome === "barbaro")) {
        explicacao.push(getModStr("CON", "Constituição (bárbaro)"));
      } else if (ficha?.multiclasses?.some(m => m.classe.nome === "Monge")) {
        explicacao.push(getModStr("SAB", "Sabedoria (monge)"));
      }

    } else {
      const armadura = ficha.ArmaduraEquipada;
      const modDex = calcularModificador(calcularAtributo("DES"));
      const modDexValid = isNaN(modDex) ? 0 : modDex;

      if (armadura.categoria === "Armadura Leve") {
        if (proficienciaArmaduraLeve) {
          explicacao.push(formatValor(armadura.ac, "Armadura Leve"));
          explicacao.push(`${modDexValid >= 0 ? "+" : ""}${modDexValid} Destreza`);
        } else {
          explicacao.push("10 (sem proficiência com Armadura Leve)");
        }

      } else if (armadura.categoria === "Armadura Média") {
        if (proficienciaArmaduraMedia) {
          explicacao.push(formatValor(armadura.ac, "Armadura Média"));
          if (modDexValid > 2) {
            explicacao.push("+2 Destreza (limite da armadura)");
          } else {
            explicacao.push(`${modDexValid >= 0 ? "+" : ""}${modDexValid} Destreza`);
          }
        } else {
          explicacao.push("10 (sem proficiência com Armadura Média)");
        }

      } else if (armadura.categoria === "Armadura Pesada") {
        if (proficienciaArmaduraPesada) {
          explicacao.push(formatValor(armadura.ac, "Armadura Pesada"));
        } else {
          explicacao.push("10 (sem proficiência com Armadura Pesada)");
        }
      }
    }

    // Escudo
    if (ficha?.escudoEquipado && proficienciaEscudos) {
      explicacao.push(formatValor(ficha.escudoEquipado.ac, "Escudo"));
    }

    // Efeitos adicionais
    if (efeitosCA && efeitosCA.length > 0) {
      efeitosCA.forEach(e => {
        explicacao.push(formatValor(e.bonus, "efeito diversos"));
      });
    }

    return explicacao.join(", ");
  }


  function calcularCA() {
    let ca = 10;
    if (!ficha?.ArmaduraEquipada) {
      ca += calcularModificador(calcularAtributo("DES"));
      if (!!ficha?.multiclasses?.find(m => m.classe.nome === "barbaro")) {
        ca += calcularModificador(calcularAtributo("CON"));
      } else if (!!ficha?.multiclasses?.find(m => m.classe.nome === "Monge")) {
        ca += calcularModificador(calcularAtributo("SAB"));
      }
    } else {
      if (ficha.ArmaduraEquipada.categoria === "Armadura Média") {
        if (proficienciaArmaduraMedia) {
          ca = ficha.ArmaduraEquipada.ac
          let bonusDestreza = calcularAtributo("DES")
          if (calcularModificador(bonusDestreza) > 2) {
            ca += 2;
          } else {
            ca += calcularModificador(bonusDestreza);
          }
        } else {
          ca = 10;
        }
      }
      if (ficha.ArmaduraEquipada.categoria === "Armadura Leve") {
        if (proficienciaArmaduraLeve) {
          ca = ficha.ArmaduraEquipada.ac
          ca += calcularModificador(calcularAtributo("DES"));
        } else {
          ca = 10;
        }
      }
      if (ficha.ArmaduraEquipada.categoria === "Armadura Pesada") {
        if (proficienciaArmaduraPesada) {
          ca = ficha.ArmaduraEquipada.ac;
        } else {
          ca = 10;
        }
      }
    }
    if (ficha?.escudoEquipado && proficienciaEscudos) {
      ca += ficha.escudoEquipado.ac;
    }
    ca += calcularBonusCAItens(ficha);
    return ca;
  }

  function coletarProeficiencias(efeitos: any) {
    const proficienciasPersonagem = new Set<string>();
    if (efeitos !== null) {
      efeitos.forEach((efeito: any) => {
        if (efeito.proeficienciasBackGround) {
          efeito.proeficienciasBackGround.forEach((proficiencia: string) => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proeficienciasClasse) {
          efeito.proeficienciasClasse.forEach((proficiencia: string) => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proeficienciasRaca) {
          efeito.proeficienciasRaca.forEach((proficiencia: string) => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proficienciasMulticlasse) {
          efeito.proficienciasMulticlasse.forEach((proficiencia: string) => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
      });
    }

    return proficienciasPersonagem;
  }

  function verificarProficiencias(armadura1: string, armadura2: string, proficienciasPersonagem: Set<string>) {
    return proficienciasPersonagem.has(normalizarString(armadura1)) || proficienciasPersonagem.has(normalizarString(armadura2));
  }

  function normalizarString(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const TestesDeMorte = () => {
    const [sucessos, setSucessos] = useState(0);
    const [falhas, setFalhas] = useState(0);

    const toggleSucesso = (index: number) => {
      setSucessos((prev) => (index < prev ? index : index + 1));
    };

    const toggleFalha = (index: number) => {
      setFalhas((prev) => (index < prev ? index : index + 1));
    };

    return (
      <div className="teste-morte">
        <h3>Saves de Morte</h3>
        <div className="teste-morte-container">
          {[0, 1, 2].map((i) => (
            <button className="botao-espaco-magia" key={i} onClick={() => toggleSucesso(i)}>
              <img
                src={i < sucessos ? iconLife1 : iconLife2}
                className="espaco-magia-icon"
                alt="Sucesso"
              />
            </button>
          ))}
        </div>
        <div className="teste-vida-container">
          {[0, 1, 2].map((i) => (
            <button className="botao-espaco-magia" key={i} onClick={() => toggleFalha(i)}>
              <img
                src={
                  i < falhas
                    ? falhas >= 3
                      ? iconMorte3
                      : iconMorte1
                    : iconMorte2
                }
                className="espaco-magia-icon"
                alt="Falha"
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div key={refreshKey} className="informacoes-personagem compact">
      <div className="container-principal">
        {/* Coluna 1: Nome, Nível, XP */}
        <div className="coluna-1">
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome do Personagem"
              value={tempNome}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Nível</label>
            <button className="botao-nivel" onClick={() => setPopupNivelAberto(true)}>Nível: {ficha?.levelTotal}</button>
          </div>

          <div className="campo">
            <label>XP</label>
            <input
              type="text"
              placeholder="XP"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </div>
        </div>
        {/* Popup de Nível */}
        {popupNivelAberto && (
          <div className="popup-info-personagem">
            <h3>Escolha o Nível</h3>
            <div className="popup-content-info-personagem">
              {[...Array(20)].map((_, i) => (
                <button key={i + 1} onClick={() => { ficha?.setLevelTotal(i + 1); setPopupNivelAberto(false); }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPopupNivelAberto(false)}>X</button>
            </div>
          </div>
        )}

        {/* Coluna 2: Atributos */}
        <div className="coluna-2">
          <h4>Atributos</h4>
          <div className="atributos-container">
            {Object.entries(ficha?.atributosPersonagem || atributosIniciais).map(([atributo, dados]) => (
              <div key={atributo} className="atributo">
                <span className="atributo-nome">{dados.nome}</span>
                <span> / </span>
                <span className="atributo-valor">{calcularAtributo(dados.nome)}</span>
                <div className="atributo-divisoria" />
                {(() => {
                  const mod = calcularModificador(calcularAtributo(dados.nome));
                  return (
                    <span className="atributo-mod">
                      {isNaN(mod) ? "0" : mod >= 0 ? `+${mod}` : mod}
                    </span>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 3: Proficiências */}
        <div className="coluna-3">
          <h4>Proficiências</h4>
          <div className="proficiencias-container">
            {Object.entries(ficha?.atributosPersonagem || atributosIniciais).map(([atributo, dados]) => (
              <div key={atributo} className="proficiencia">
                <span className="proficiencia-nome" title={dados.tipo}>{dados.nome}</span>
                <span> / </span>
                <div className="proficiencia-divisoria" />
                {(() => {
                  const atributo = calcularAtributo(dados.nome);
                  const mod = calcularModificador(atributo);
                  const prof = calcularProeficiencia(dados.id);

                  if (isNaN(mod) || isNaN(prof)) return <span className="proficiencia-mod">0</span>;

                  const total = mod + prof;

                  return (
                    <span className="proficiencia-mod">
                      {total >= 0 ? `+${total}` : total}
                    </span>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 4: CA e Vida */}
        <div className="coluna-4">
          <div className="ca-container">
            <img src={iconCa} alt="CA" className="icon-ca"></img>
            <span className="ca-text">{calcularCA() || 10}</span>
            <div className="ca">
              <span className="ca-detalhes">{explicacaoCA()}</span>
            </div>
          </div>

          <div>
            <VidaComponente />
          </div>
        </div>
        <div className="coluna-5">
          {TestesDeMorte()}
        </div>
      </div>
    </div>
  );
}
