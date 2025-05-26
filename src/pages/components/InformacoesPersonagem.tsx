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

  const calcularProeficiencia = (idAtributo) => {
    let nomeTesteResistencia = atributosIniciais.find(a => a.id === idAtributo)?.nomeDesc;

    if (ficha?.classePrincipal?.testesResistencias?.includes(nomeTesteResistencia ?? "")) {
      return ficha?.proeficiencia ?? 0;
    }
    return 0;
  }

  const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

  function calcularAtributo(dados: string) {
    const efeitosDestreza = ficha?.efeitos?.filter((e: any) => e.level <= (ficha?.levelTotal || 0) && e.atributo === "destreza");
    const efeitosConstituicao = ficha?.efeitos?.filter((e: any) => e.level <= (ficha.levelTotal || 0) && e.atributo === "constituição");
    const efeitosSabedoria = ficha?.efeitos?.filter((e: any) => e.level <= (ficha.levelTotal || 0) && e.atributo === "sabedoria");
    const efeitosInteligencia = ficha?.efeitos?.filter((e: any) => e.level <= (ficha.levelTotal || 0) && e.atributo === "inteligência");
    const efeitosForca = ficha?.efeitos?.filter((e: any) => e.level <= (ficha.levelTotal || 0) && e.atributo === "força");
    const efeitosCarisma = ficha?.efeitos?.filter((e: any) => e.level <= (ficha.levelTotal || 0) && e.atributo === "carisma");

    let destrezaAtual = ficha?.atributosPersonagem?.destreza.valor;
    let constituicaoAtual = ficha?.atributosPersonagem?.constituicao.valor;
    let sabedoriaAtual = ficha?.atributosPersonagem?.sabedoria.valor;
    let inteligenciaAtual = ficha?.atributosPersonagem?.inteligencia.valor;
    let forcaAtual = ficha?.atributosPersonagem?.forca.valor;
    let carismaAtual = ficha?.atributosPersonagem?.carisma.valor;

    if (dados === "DES") {
      if (efeitosDestreza) if (efeitosDestreza.length > 0) {
        const bonusDestreza = efeitosDestreza.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (destrezaAtual) destrezaAtual += bonusDestreza
      }
      return destrezaAtual;
    }
    if (dados === "CON") {
      if (efeitosConstituicao) if (efeitosConstituicao.length > 0) {
        const bonusConstituicao = efeitosConstituicao.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (constituicaoAtual) constituicaoAtual += bonusConstituicao;
      }
      return constituicaoAtual;
    }
    if (dados === "SAB") {
      if (efeitosSabedoria) if (efeitosSabedoria.length > 0) {
        const bonusSabedoria = efeitosSabedoria.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (sabedoriaAtual) sabedoriaAtual += bonusSabedoria;
      }
      return sabedoriaAtual;
    }
    if (dados === "INT") {
      if (efeitosInteligencia) if (efeitosInteligencia.length > 0) {
        const bonusInteligencia = efeitosInteligencia.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (inteligenciaAtual) inteligenciaAtual += bonusInteligencia;
      }
      return inteligenciaAtual;
    }
    if (dados === "FOR") {
      if (efeitosForca) if (efeitosForca.length > 0) {
        const bonudForca = efeitosForca.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (forcaAtual) forcaAtual += bonudForca;
      }
      return forcaAtual;
    }
    if (dados === "CAR") {
      if (efeitosCarisma) if (efeitosCarisma.length > 0) {
        const bonusCarisma = efeitosCarisma.reduce((acc: number, e: any) => acc + e.bonus, 0);
        if (carismaAtual) carismaAtual += bonusCarisma;
      }
      return carismaAtual;
    }
  }

  function explicacaoCA() {
    const efeitosCA = ficha?.efeitos?.filter((e: any) => e.level <= (ficha?.levelTotal || 0) && e.ca === "CA");
    let explicacao: string[] = [];

    // Base da CA
    let base = 10;

    if (!ficha?.ArmaduraEquipada) {
      explicacao.push("10 (base sem armadura)");

      const modDex = calcularModificador(calcularAtributo("DES"));
      explicacao.push(`${modDex >= 0 ? "+" : ""}${modDex} Destreza`);

      if (ficha?.multiclasses?.some(m => m.classe.nome === "barbaro")) {
        const modCon = calcularModificador(calcularAtributo("CON"));
        explicacao.push(`${modCon >= 0 ? "+" : ""}${modCon} Constituição (bárbaro)`);
      } else if (ficha?.multiclasses?.some(m => m.classe.nome === "Monge")) {
        const modSab = calcularModificador(calcularAtributo("SAB"));
        explicacao.push(`${modSab >= 0 ? "+" : ""}${modSab} Sabedoria (monge)`);
      }

    } else {
      const armadura = ficha.ArmaduraEquipada;
      const modDex = calcularModificador(calcularAtributo("DES"));

      if (armadura.categoria === "Armadura Leve") {
        if (proficienciaArmaduraLeve) {
          explicacao.push(`${armadura.ac} Armadura Leve`);
          explicacao.push(`${modDex >= 0 ? "+" : ""}${modDex} Destreza`);
        } else {
          explicacao.push("10 (sem proficiência com Armadura Leve)");
        }

      } else if (armadura.categoria === "Armadura Média") {
        if (proficienciaArmaduraMedia) {
          explicacao.push(`${armadura.ac} Armadura Média`);
          if (modDex > 2) {
            explicacao.push("+2 Destreza (limite da armadura)");
          } else {
            explicacao.push(`${modDex >= 0 ? "+" : ""}${modDex} Destreza`);
          }
        } else {
          explicacao.push("10 (sem proficiência com Armadura Média)");
        }

      } else if (armadura.categoria === "Armadura Pesada") {
        if (proficienciaArmaduraPesada) {
          explicacao.push(`${armadura.ac} Armadura Pesada`);
        } else {
          explicacao.push("10 (sem proficiência com Armadura Pesada)");
        }
      }
    }

    // Escudo
    if (ficha?.escudoEquipado && proficienciaEscudos) {
      explicacao.push(`+${ficha.escudoEquipado.ac} Escudo`);
    }

    // Efeitos adicionais
    if (efeitosCA) if (efeitosCA?.length > 0) {
      efeitosCA.forEach(e => {
        explicacao.push(`${e.bonus >= 0 ? "+" : ""}${e.bonus} ${"efeito diversos"}`);
      });
    }

    return explicacao.join(" + ");
  }

  function calcularCA() {
    const efeitosCA = ficha?.efeitos?.filter((e: any) => e.level <= (ficha?.levelTotal || 0) && e.ca === "CA");
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
    if (efeitosCA) {
      const bonusCA = efeitosCA.reduce((acc: number, e: any) => acc + e.bonus, 0);
      ca += bonusCA;
    }
    return ca;
  }

  function coletarProeficiencias(efeitos) {
    const proficienciasPersonagem = new Set();
    if (efeitos !== null) {
      efeitos.forEach(efeito => {
        if (efeito.proeficienciasBackGround) {
          efeito.proeficienciasBackGround.forEach(proficiencia => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proeficienciasClasse) {
          efeito.proeficienciasClasse.forEach(proficiencia => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proeficienciasRaca) {
          efeito.proeficienciasRaca.forEach(proficiencia => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
        if (efeito.proficienciasMulticlasse) {
          efeito.proficienciasMulticlasse.forEach(proficiencia => {
            proficienciasPersonagem.add(normalizarString(proficiencia));
          });
        }
      });
    }

    return proficienciasPersonagem;
  }

  function verificarProficiencias(armadura1, armadura2, proficienciasPersonagem) {
    return proficienciasPersonagem.has(normalizarString(armadura1)) || proficienciasPersonagem.has(normalizarString(armadura2));
  }

  function normalizarString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const TestesDeMorte = () => {
    const [sucessos, setSucessos] = useState(0);
    const [falhas, setFalhas] = useState(0);

    const toggleSucesso = (index) => {
      setSucessos((prev) => (index < prev ? index : index + 1));
    };

    const toggleFalha = (index) => {
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
                <span className="atributo-valor">{dados.valor}</span>
                <div className="atributo-divisoria" />
                <span className="atributo-mod">{calcularModificador(calcularAtributo(dados.nome)) >= 0 ? `+${calcularModificador(calcularAtributo(dados.nome))}` : calcularModificador(calcularAtributo(dados.nome))}</span>
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
                <span className="proficiencia-mod">{((calcularModificador(calcularAtributo(dados.nome)) >= 0 ? `+${calcularModificador(calcularAtributo(dados.nome))}` : calcularModificador(calcularAtributo(dados.nome)) + (calcularProeficiencia(dados.id))))}</span>
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
