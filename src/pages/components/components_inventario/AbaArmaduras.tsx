import React from "react";
import noProficienciaIcon from "../../../imagens/security_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import proficienciaIcon from "../../../imagens/security_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import excluirIcon from "../../../imagens/delete_icon.png"
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import "../../css/ArmaInventario.css"

export default function AbaArmaduras({ setModalEquipamentoAberto }) {
  const { ficha, refreshKey, forceUpdate } = useFicha();
  const proficienciaArmaduraLeve = verificarProficiencias("armadura leve", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraMedia = verificarProficiencias("armadura media", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraPesada = verificarProficiencias("armadura pesada", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaEscudos = verificarProficiencias("escudos", "", coletarProeficiencias(ficha?.efeitos));

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

  return (
    <div key={refreshKey} className="inventario-armas-container">
      <h3>Inventario de Armas</h3>
      <div className="proficiencias-personagem-container">
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraLeve ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraLeve ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Leve</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraMedia ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraMedia ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Media</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraPesada ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraPesada ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Pesada</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaEscudos ? proficienciaIcon : noProficienciaIcon} title={proficienciaEscudos ? "proficiente" : "não proficiente"}></img>
          <span>Escudos</span>
        </div>
      </div>
      <button className="adicionar-armas" onClick={() => setModalEquipamentoAberto(true)}>Adicionar Novo Equipamento</button>
      <ul className="lista-armas">
        {ficha?.ArmadurasMochila?.map((equipamento, index) => (
          <li key={index} className="item-arma">
            <div className="imagem-icon-arma">
              <img className="icon-proficiencia-arma" alt="proficiencia"
                src={(verificarProficiencias(equipamento.nome, equipamento.categoria, coletarProeficiencias(ficha.efeitos)) ||
                  verificarProficiencias("todas as armaduras", "", coletarProeficiencias(ficha.efeitos))) ? proficienciaIcon : noProficienciaIcon}
                title={(verificarProficiencias(equipamento.nome, equipamento.categoria, coletarProeficiencias(ficha.efeitos)) ||
                  verificarProficiencias("todas as armaduras", "", coletarProeficiencias(ficha.efeitos))) ? "proficiente" : "não proficiente"}></img>
            </div>
            <div className="titulo-arma">
              <h3>{equipamento.nome}</h3>
            </div>
            <div className="arma">
              <div className="arma1">
                <p><strong>Categoria:</strong> {equipamento.categoria}</p>
                <p><strong>Classe de Armadura (CA):</strong> {equipamento.ac}</p>
                <p><strong>Força Necessária:</strong> {equipamento.forca}</p>
              </div>
              <div className="arma2">
                <p><strong>Furtividade:</strong> {equipamento.furtividade}</p>
                <p><strong>Custo:</strong> {equipamento.custo} moedas de ouro</p>
                <p><strong>Peso:</strong> {equipamento.peso} kg</p>
              </div>
            </div>
            <div className="botao-excluir-container">
              <button
                className="botao-excluir"
                onClick={() => {
                  ficha.excluirArmaduraMochila(equipamento.id)
                  forceUpdate();
                }}
              ><img alt="excluir" className="icon-excluir" src={excluirIcon}></img>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}