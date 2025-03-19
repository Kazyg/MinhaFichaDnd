import React, { useState } from "react";
import iconClass from "../imagens/icon_class.png"
import "../pages/css/CriacaoFicha.css";
import "../pages/css/ModalRacas.css";
import ModalSelecaoClasse from "../pages/modals/ModalSelecaoClasse.tsx";
import ModalSelecaoSubClasse from "../pages/modals/ModalSelecaoSubClasse.tsx";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";
import CaracteristicasClasse from "./components/CaracteristicasClasseProps.tsx";
import { SubClasses } from "../api/classesPrincipais/SubClasses.ts";

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
    const [subGrupoAberto, setSubGrupoAberto] = useState(false);
    const [subClasses, setSubClasses] = useState<SubClasses[] | null>([]);

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
        if (c.nome === ficha?.classePrincipal?.nome) return true;
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

    const abrirSubGrupo = () => {
        if (classeNoNivel?.classe?.subClasse) {
            if (classeNoNivel?.classe.subClasse.length > 0) {
                setSubClasses(classeNoNivel?.classe.subClasse);
                setSubGrupoAberto(true);
            }
        }
    };

    const textoSubclasse = () => {
        switch (classeNoNivel?.classe.nome.toLowerCase()) {
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
            default:
                return "Classe não encontrada ou sem subclasse definida.";
        }
    }

    function validaSubClasse(classe, nivel) {
        // Converte a classe para minúsculas para evitar problemas de case sensitivity
        classe = classe?.toLowerCase();

        // Verifica as condições
        const condicao1 = (classe === "feiticeiro" || classe === "clérigo" || classe === "bruxo") && nivel === 1;
        const condicao2 = (classe === "druida" || classe === "mago") && nivel === 2;
        const condicao3 = nivel === 3 && !["feiticeiro", "clérigo", "bruxo", "druida", "mago"].includes(classe);

        // Retorna true se qualquer uma das condições for verdadeira
        return condicao1 || condicao2 || condicao3;
    }


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
                        {validaSubClasse(classeNoNivel?.classe.nome, calcularNivelClasse(nivel)) && (
                            <>
                                <button className="botao-distribuir" onClick={() => abrirSubGrupo()}>
                                    <img src={iconClass} className="button-icon" alt="Classe" />
                                    <div className="botao-texto">
                                        <span>Selecionar {textoSubclasse()}</span>
                                        <strong>{ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel?.classe.nome)?.subclasse.nome || "Selecionar " + textoSubclasse()}</strong>
                                    </div>
                                </button>
                            </>
                        )}
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
            {subGrupoAberto && (
                <>
                    <div className="popup-overlay" onClick={() => setSubGrupoAberto(false)}></div>
                    <div className="popup">
                        <ModalSelecaoSubClasse
                            titulo={"Escolha " + textoSubclasse()}
                            opcoes={subClasses}
                            onClose={() => setSubGrupoAberto(false)}
                            onSelect={(subClasse) => {
                                if (classeNoNivel?.classe && subClasse) {
                                    ficha?.setSubClasse(classeNoNivel?.classe, subClasse);
                                }
                                setSubGrupoAberto(false);
                                forceUpdate();
                            }}
                            subClasseInicial={ficha?.subClasse?.find(s => s.classe === classeNoNivel?.classe)?.subclasse ?? null}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default NivelBlock;
