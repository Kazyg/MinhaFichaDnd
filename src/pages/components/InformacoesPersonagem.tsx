import AccessibleDialog from "./AccessibleDialog";
import React, { useState } from "react";
import "../css/InformacoesPersonagem.css";
import iconCa from "../../imagens/icon_ac.png"
import iconMorte1 from "../../imagens/skull_24dp_000000_FILL0_wght400_GRAD0_opsz24.png"
import iconMorte2 from "../../imagens/skull_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import iconMorte3 from "../../imagens/skull_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import iconLife1 from "../../imagens/shield_with_heart_24dp_75FB4C_FILL0_wght400_GRAD0_opsz24.png"
import iconLife2 from "../../imagens/shield_with_heart_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png"
import { useFicha } from "../../api/fichaPersonagem/FichaContext"
import VidaComponente from "./components_InformacoesPersonagem/ModalVida";
import { calcularValorAtributoFinal, selecionarAtributo } from "../../api/fichaPersonagem/fichaEfeitosUtils";

import { selecionarCA, selecionarProficiencia } from "../../api/fichaPersonagem/fichaSeletores";

declare global {
  interface Window {
    nomeTimeout: number | undefined;
  }
}

export default function InformacoesPersonagem() {
  const [xp, setXp] = useState("");
  const [popupNivelAberto, setPopupNivelAberto] = useState(false);

  const { ficha, forceUpdate } = useFicha();
  const [tempNome, setTempNome] = useState(ficha?.nomePersonagem ?? "");

  const atributosIniciais = [
    { id: 1, nome: "FOR", valor: 10, nomeDesc: "Força" },
    { id: 2, nome: "DES", valor: 10, nomeDesc: "Destreza" },
    { id: 3, nome: "CON", valor: 10, nomeDesc: "Constituição" },
    { id: 4, nome: "INT", valor: 10, nomeDesc: "Inteligência" },
    { id: 5, nome: "SAB", valor: 10, nomeDesc: "Sabedoria" },
    { id: 6, nome: "CAR", valor: 10, nomeDesc: "Carisma" }
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempNome(e.target.value);
    ficha?.setNomePersonagem(e.target.value);
    forceUpdate();
  };

  const calcularProeficiencia = (idAtributo: number) => {
    let nomeTesteResistencia = atributosIniciais.find(a => a.id === idAtributo)?.nomeDesc;

    if (ficha?.classePrincipal?.testesResistencias?.includes(nomeTesteResistencia ?? "")) {
      return selecionarProficiencia(ficha);
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

  const ca = selecionarCA(ficha);

  const TestesDeMorte = () => {
    const sucessos = ficha?.recursos.morte?.sucessos ?? 0;
    const falhas = ficha?.recursos.morte?.falhas ?? 0;

    const toggleSucesso = (index: number) => {
      if (ficha) {
        ficha.recursos.morte ??= {};
        ficha.recursos.morte.sucessos = index < sucessos ? index : index + 1;
      }
      forceUpdate();
    };

    const toggleFalha = (index: number) => {
      if (ficha) {
        ficha.recursos.morte ??= {};
        ficha.recursos.morte.falhas = index < falhas ? index : index + 1;
      }
      forceUpdate();
    };

    return (
      <div className="teste-morte">
        <h3>Saves de Morte</h3>
        {!ficha?.recursos.morte && <p>Testes de morte não informados.</p>}
        {ficha?.recursos.morte && (ficha.recursos.morte.sucessos == null || ficha.recursos.morte.falhas == null) && <p>Registro de morte incompleto: marque sucessos e falhas separadamente.</p>}
        <div className="teste-morte-container">
          {[0, 1, 2].map((i) => (
            <button className="botao-espaco-magia" key={i} aria-label={`Sucesso de morte ${i + 1}`} aria-pressed={i < sucessos} onClick={() => toggleSucesso(i)}>
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
            <button className="botao-espaco-magia" key={i} aria-label={`Falha de morte ${i + 1}`} aria-pressed={i < falhas} onClick={() => toggleFalha(i)}>
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
    <div className="informacoes-personagem compact">
      <div className="container-principal">
        {/* Coluna 1: Nome, Nível, XP */}
        <div className="coluna-1">
          <div className="campo">
            <label htmlFor="nome-personagem">Nome</label>
            <input
              type="text"
              id="nome-personagem" placeholder="Nome do Personagem"
              value={tempNome}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label>Nível</label>
            <button className="botao-nivel" onClick={() => setPopupNivelAberto(true)}>Nível: {ficha?.levelTotal}</button>
          </div>

          <div className="campo">
            <label htmlFor="xp-personagem">XP</label>
            <input
              type="text"
              id="xp-personagem" placeholder="XP"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </div>
        </div>
        {/* Popup de Nível */}
        {popupNivelAberto && (
          <AccessibleDialog className="popup-info-personagem" aria-label="Escolha o Nível" onClose={() => setPopupNivelAberto(false)}>
            <h3>Escolha o Nível</h3>
            <div className="popup-content-info-personagem">
              {[...Array(20)].map((_, i) => (
                <button key={i + 1} onClick={() => { ficha?.setLevelTotal(i + 1); forceUpdate(); setPopupNivelAberto(false); }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPopupNivelAberto(false)}>Fechar</button>
            </div>
          </AccessibleDialog>
        )}

        {/* Coluna 2: Atributos */}
        <div className="coluna-2">
          <h4>Atributos</h4>
          <div className="atributos-container">
            {Object.entries(ficha?.atributosPersonagem || atributosIniciais).map(([atributo, dados]) => (
              <div key={atributo} className="atributo">
                <span className="atributo-nome">{dados.nome}</span>
                <span> / </span>
                <span className="atributo-valor" title={selecionarAtributo(ficha, dados.nome).explicacao}>{calcularAtributo(dados.nome)}</span>
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
            <span className="ca-text" aria-label="Classe de armadura">{ca.total}</span>
            <div className="ca">
              <span className="ca-detalhes">{ca.explicacao}</span>
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
