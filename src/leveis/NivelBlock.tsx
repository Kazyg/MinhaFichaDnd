import React, { useState } from "react";
import iconClass from "../imagens/icon_class.png"
import "../pages/css/CriacaoFicha.css";
import "../pages/css/ModalRacas.css";
import ModalSelecaoClasse from "../pages/modals/ModalSelecaoClasse.tsx";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";
import CaracteristicasClasse from "./components/CaracteristicasClasseProps.tsx";

const NivelBlock = ({ nivel, classesDisponiveis, selecionarMulticlasse }) => {
    const [modalClasseAberto, setModalClasseAberto] = useState(false);
    const { ficha, refreshKey, forceUpdate } = useFicha();
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

    const classeNoNivel = ficha?.multiclasses?.find(m => m.nivelEscolhido.includes(nivel));

    const getAtributo = (atributo) => atributo ? atributo.valor ?? 0 : 0;

    const classesPermitidas = classesDisponiveis.filter(c => {
        switch (c.nome) {
            case "Bárbaro": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13;
            case "Bardo": case "Bruxo": case "Feiticeiro": return getAtributo(ficha?.atributosPersonagem?.carisma) >= 13;
            case "Clérigo": case "Druida": return getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            case "Guerreiro": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13 || getAtributo(ficha?.atributosPersonagem?.destreza) >= 13;
            case "Ladino": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13;
            case "Mago": return getAtributo(ficha?.atributosPersonagem?.inteligencia) >= 13;
            case "Monge": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13 && getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            case "Paladino": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13 && getAtributo(ficha?.atributosPersonagem?.carisma) >= 13;
            case "Patrulheiro": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13 && getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            default: return false;
        }
    });

    const calcularNivelClasse = (nivelAtual: number): number => {
        let nivelClasse = 0;
        debugger;
        const niveisEscolhidos = ficha?.multiclasses?.find(m => m.classe.nome === classeNoNivel?.classe.nome)?.nivelEscolhido.sort((a, b) => a - b) ?? [];
        
        for (const nivel of niveisEscolhidos) {
            if (nivel <= nivelAtual) {
                nivelClasse++;
            } else {
                break;
            }
        }
    
        return nivelClasse;
    };

    return (
        <>
            <div key={refreshKey} className="level-container">
                <button className="secao-toggle" onClick={toggleNivel}>
                    <h2 className="tituloh2">Nível {nivel}{nivelExpandido ? "▲" : "▼"}</h2>
                </button>
                {nivelExpandido && (
                    <>
                        <button className="botao-distribuir" onClick={() => setModalClasseAberto(true)}>
                            <img src={iconClass} className="button-icon" alt="Classe" />
                            <div className="botao-texto">
                                <span>Selecionar Classe</span>
                                <strong>{classeNoNivel?.classe.nome || "Selecionar Classe"}</strong>
                            </div>
                        </button>
                        {classeNoNivel?.classe && (
                            <div>
                                <button className="secao-toggle" onClick={() => toggleSecao("caracteristicas")}>
                                    <h3 className="tituloh3">Características de Classe Nível {nivel}{secoesExpandidas.caracteristicas ? "▲" : "▼"}</h3>
                                </button>
                                {secoesExpandidas.caracteristicas && (
                                    <div>
                                        <CaracteristicasClasse classe={classeNoNivel?.classe} nivel={calcularNivelClasse(nivel)} />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {modalClasseAberto && (
                <>
                    <div className="popup-overlay" onClick={() => setModalClasseAberto(false)}></div>
                    <div className="popup">
                        <ModalSelecaoClasse
                            titulo="Escolha sua Classe"
                            opcoes={classesPermitidas}
                            onClose={() => setModalClasseAberto(false)}
                            onSelect={(classe) => {
                                if (classe) selecionarMulticlasse(classe, nivel);
                                setModalClasseAberto(false);
                                forceUpdate();
                            }}
                            classeInicial={classeNoNivel?.classe || null}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default NivelBlock;
