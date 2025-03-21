import React, { useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import noProficienciaIcon from "../../../imagens/swords_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import proficienciaIcon from "../../../imagens/swords_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import excluirIcon from "../../../imagens/delete_icon.png"
import "../../css/ArmaInventario.css"

export default function AbaArmas({ setModalAberto }) {
    const { ficha } = useFicha();
    const proficienciasPersonagem = new Set([
        ...ficha?.efeitos?.proeficienciasBackGround ?? [],
        ...ficha?.efeitos?.proeficienciasClasse ?? [],
        ...ficha?.efeitos?.proeficienciasRaca ?? []].map(normalizarString))
    const proficienciaArmaSimples = verificarProficiencias("armas simples");
    const proficienciaArmaMarciais = verificarProficiencias("armas marciais");
    const proficienciaArmaExoticas = verificarProficiencias("armas exoticas");

    function verificarProficiencias(arma) {

        return proficienciasPersonagem.has(normalizarString(arma));
    }

    function normalizarString(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }
    return (
        <div className="inventario-armas-container">
            <h3>Inventario de Armas</h3>
            <div className="proficiencias-personagem-container">
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" src={proficienciaArmaSimples ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaSimples ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Simples</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" src={proficienciaArmaMarciais ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaMarciais ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Marciais</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" src={proficienciaArmaExoticas ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaExoticas ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Exoticas</span>
                </div>
            </div>
            <button className="adicionar-armas" onClick={() => setModalAberto(true)}>Adicionar Nova Arma</button>
            <ul className="lista-armas">
                {ficha?.ArmasMochila?.map((arma, index) => (
                    <li key={index} className="item-arma">
                        <div className="imagem-icon-arma">
                            <img className="icon-proficiencia-arma" src={(verificarProficiencias(arma.nome) || verificarProficiencias(arma.categoria)) ? proficienciaIcon : noProficienciaIcon} title={(verificarProficiencias(arma.nome) || verificarProficiencias(arma.categoria)) ? "proficiente" : "não proficiente"}></img>
                        </div>
                        <div className="titulo-arma">
                            <h3>{arma.nome}</h3>
                        </div>
                        <div className="arma">
                            <div className="arma1">
                                <p><strong>Categoria:</strong> {arma.categoria}</p>
                                <p>
                                    <strong>Dano:</strong> {arma.dano.dano_1}{" "}
                                    {arma.dano.dano_2 && `/${arma.dano.dano_2}`} ({arma.dano_tipo})
                                </p>
                                <p><strong>Atributos de Dano:</strong> {arma.dano_atributo.join(", ")}</p>
                            </div>
                            <div className="arma2">
                                <p><strong>Custo:</strong> {arma.custo} moedas de ouro</p>
                                <p><strong>Peso:</strong> {arma.peso} kg</p>
                                <p><strong>Propriedades:</strong> {arma.propriedades}</p>
                                <p><strong>Distância:</strong> {arma.distancia === "sim" ? "À distância" : "Corpo a corpo"}</p>
                            </div>
                        </div>
                        <div className="botao-excluir-container">
                            <button
                                className="botao-excluir"
                                onClick={() => ficha.excluirArmaMochila(arma.id)}
                            ><img className="icon-excluir" src={excluirIcon}></img>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}