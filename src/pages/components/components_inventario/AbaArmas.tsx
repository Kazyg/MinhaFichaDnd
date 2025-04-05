import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import noProficienciaIcon from "../../../imagens/swords_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import proficienciaIcon from "../../../imagens/swords_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import excluirIcon from "../../../imagens/delete_icon.png"
import iconEquiparArma1 from "../../../imagens/iconEquiparVerde.png"
import iconEquiparArma2 from "../../../imagens/iconEquiparCinza.png"
import iconDesequiparArma1 from "../../../imagens/iconDesequiparVermelho.png"
import iconDesequiparArma2 from "../../../imagens/iconDesequiparCinza.png"
import "../../css/ArmaInventario.css"
import { toast } from "react-toastify";
import { Armas } from "../../../api/equipamentos/Armas.ts";

export default function AbaArmas({ setModalAberto }) {
    const { ficha, refreshKey, forceUpdate } = useFicha();
    const proficienciaArmaSimples = verificarProficiencias("armas simples", coletarProeficiencias(ficha?.efeitos));
    const proficienciaArmaMarciais = verificarProficiencias("armas marciais", coletarProeficiencias(ficha?.efeitos));
    const proficienciaArmaExoticas = verificarProficiencias("armas exoticas", coletarProeficiencias(ficha?.efeitos));

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

    function verificarProficiencias(arma, proficienciasPersonagem) {

        return proficienciasPersonagem.has(normalizarString(arma));
    }

    function normalizarString(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function equiparDesequiparArmadura(equipamento: Armas) {
        if (!!ficha?.ArmaEquipada?.find(a => a.id === equipamento.id)) {
            ficha?.setDesequiparArma(equipamento.id);
            ficha?.setMaosOcupadas(-1);
        } else {
            if ((ficha?.maosOcupadas ?? 0) >= 2) {
                toast.error('Você não tem mão sobrando para equipar este item!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                ficha?.setEquiparArma(equipamento);
                ficha?.setMaosOcupadas(1);
            }
        }
    }

    return (
        <div key={refreshKey} className="inventario-armas-container">
            <h3>Inventario de Armas</h3>
            <div className="proficiencias-personagem-container">
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaSimples ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaSimples ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Simples</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaMarciais ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaMarciais ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Marciais</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaExoticas ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaExoticas ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Exoticas</span>
                </div>
            </div>
            <button className="adicionar-armas" onClick={() => setModalAberto(true)}>Adicionar Nova Arma</button>
            <ul className="lista-armas">
                {ficha?.ArmasMochila?.map((arma, index) => (
                    <li key={index} className="item-arma">
                        <div className="imagem-icon-arma">
                            <img alt="proficiencia" className="icon-proficiencia-arma"
                                src={(verificarProficiencias(arma.nome, coletarProeficiencias(ficha?.efeitos)) ||
                                    verificarProficiencias(arma.categoria, coletarProeficiencias(ficha?.efeitos))) ? proficienciaIcon : noProficienciaIcon}
                                title={(verificarProficiencias(arma.nome, coletarProeficiencias(ficha?.efeitos)) ||
                                    verificarProficiencias(arma.categoria, coletarProeficiencias(ficha?.efeitos))) ? "proficiente" : "não proficiente"}></img>
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
                                onClick={() => {
                                    ficha.excluirArmaMochila(arma.id);
                                    forceUpdate();
                                }}
                            ><img alt="excluir" className="icon-excluir" src={excluirIcon}></img>
                            </button>
                            <button
                                className="botao-equipar"
                                onClick={() => {
                                    equiparDesequiparArmadura(arma);
                                    forceUpdate();
                                }}
                            >
                                {!!ficha?.ArmaEquipada?.find(a => a.id === arma.id) ? (
                                    <>
                                        <img alt="excluir" className="equipar" src={iconDesequiparArma2}></img>
                                        <img alt="excluir" className="equipar-hover" src={iconDesequiparArma1}></img>
                                    </>
                                ) :(
                                    <>
                                        <img alt="excluir" className="equipar" src={iconEquiparArma2}></img>
                                        <img alt="excluir" className="equipar-hover" src={iconEquiparArma1}></img>
                                    </>
                                )}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}