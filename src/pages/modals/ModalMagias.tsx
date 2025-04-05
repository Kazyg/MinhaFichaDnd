import React, { useState } from "react";
import { magiasBardo, magiasBruxo, magiasClerigo, magiasDruida, magiasFeiticeiro, magiasMago, magiasPaladino, magiasPatrulheiro, Magias } from "../../bibliotecas/Magia.ts"
import iconFilter from "../../imagens/filter_alt_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import iconNoFilter from "../../imagens/filter_alt_off_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";

interface ModalSelecaoProps {
    titulo: string;
    onClose: () => void;
    onSelect: (nomeMagia: string) => void;
    magiaSelect: string | null;
}

const ModalSelecaoMagias: React.FC<ModalSelecaoProps> = ({ titulo, onClose, onSelect, magiaSelect }) => {
    const listaMagias = [...new Set([...magiasBardo, ...magiasBruxo, ...magiasClerigo, ...magiasDruida, ...magiasFeiticeiro, ...magiasMago, ...magiasPaladino, ...magiasPatrulheiro])];
    const listaParaFiltrar = [
        { classe: "Magias de Bardo", magias: magiasBardo },
        { classe: "Magias de Bruxo", magias: magiasBruxo },
        { classe: "Magias de Clerigo", magias: magiasClerigo },
        { classe: "Magias de Druida", magias: magiasDruida },
        { classe: "Magias de Feiticeiro", magias: magiasFeiticeiro },
        { classe: "Magias de Mago", magias: magiasMago },
        { classe: "Magias de Paladino", magias: magiasPaladino },
        { classe: "Magias de Patrulheiro", magias: magiasPatrulheiro },
    ];
    const listaEscolasFiltros = [
        "abjuração",
        "adivinhação",
        "conjuração",
        "encantamento",
        "evocação",
        "ilusão",
        "necromancia",
        "transmutação"
    ];
    const listaNiveisFiltro = [0,1,2,3,4,5,6,7,8,9]
    const [filtro, setFiltro] = useState("");
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtrosSelecionado, setFiltrosSelecionado] = useState(false);
    const listaGrupoMagia = ["Magias de Bardo", "Magias de Bruxo", "Magias de Clerigo", "Magias de Druida", "Magias de Feiticeiro", "Magias de Mago", "Magias de Paladino", "Magias de Patrulheiro"];
    const [filtroClasse, setFiltroClasse] = useState("");
    const [filtroEscola, setFiltroEscola] = useState("");
    const [filtroNivel, setFiltroNivel] = useState<number | null>(null);
    const [selecionado, setSelecionado] = useState(magiaSelect);
    const magiasCompletas = Magias;
    const { refreshKey, forceUpdate } = useFicha();

    const magiasUnicas = [
        ...new Map(listaMagias.map(magia => [magia.nome, magia])).values()
      ];

    const opcoesFiltradas = magiasUnicas.filter((opcao) =>
        opcao.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    const opcoesFiltros = () => {
        let opcoesFiltros = opcoesFiltradas;
        if(filtroClasse !== ""){
            opcoesFiltros = listaParaFiltrar.find(l => l.classe === filtroClasse)?.magias || opcoesFiltradas;
        }
        if(filtroEscola !== ""){
            opcoesFiltros = opcoesFiltros.filter(o => o.tipo === filtroEscola);
        }
        if(filtroNivel !== null){
            opcoesFiltros = opcoesFiltros.filter(o => o.nivel === filtroNivel);
        }
        return opcoesFiltros;
    }

    return (
        <div key={refreshKey} className="popup-content-modal">
            <h2>{titulo}</h2>
            {filtrosAbertos && (
                <div className="filtros-magias">
                    <h5>Filtro de Magias</h5>
                    <div className="selects-filtros">
                        <select
                            value={filtroClasse}
                            onChange={(e) => {
                                setFiltroClasse(e.target.value);
                                setFiltrosSelecionado(true);
                                forceUpdate();
                            }}
                        >
                            <option value="">Selecione uma Classe..</option>
                            {listaGrupoMagia.map((classe) => (
                                <option
                                    key={classe}
                                    value={classe}
                                >
                                    {classe}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filtroEscola}
                            onChange={(e) => {
                                setFiltroEscola(e.target.value);
                                setFiltrosSelecionado(true);
                                forceUpdate();
                            }}
                        >
                            <option value="">Selecione uma Escola..</option>
                            {listaEscolasFiltros.map((escola) => (
                                <option
                                    key={escola}
                                    value={escola}
                                >
                                    {escola}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filtroNivel || "--"}
                            onChange={(e) => {
                                setFiltroNivel(parseInt(e.target.value));
                                setFiltrosSelecionado(true);
                                forceUpdate();
                            }}
                        >
                            <option value="">Selecione um nivel..</option>
                            {listaNiveisFiltro.map((nivel) => (
                                <option
                                    key={nivel}
                                    value={nivel}
                                >
                                    {nivel}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => {
                            setFiltrosAbertos(false); 
                            setFiltrosSelecionado(false);
                            setFiltroNivel(null);
                            setFiltroClasse("");
                            setFiltroEscola("");
                            }}>
                            <img src={iconNoFilter} className="imagem-nofiltro"/>
                        </button>
                    </div>
                </div>
            )}
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <div className="filtros">
                        <input
                            className="lista-racas-input"
                            type="text"
                            placeholder="Filtrar classes..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                        <button onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
                            <img src={iconFilter} className="imagem-filtro" />
                        </button>
                    </div>
                    <ul>
                        {filtrosSelecionado ? (
                            <>
                                {opcoesFiltros().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((opcao) => (
                                    <li key={opcao.nome} onClick={() => {
                                        setSelecionado(opcao.nome);
                                    }}>
                                        {opcao.nome}
                                    </li>
                                ))}
                            </>
                        ) : (
                            <>
                                {opcoesFiltradas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((opcao) => (
                                    <li key={opcao.nome} onClick={() => {
                                        setSelecionado(opcao.nome);
                                    }}>
                                        {opcao.nome}
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado}</h3>
                            <p><strong>Nivel: </strong>{listaMagias.find(l => l.nome === selecionado)?.nivel}º</p>
                            <p><strong>Escola: </strong>{listaMagias.find(l => l.nome === selecionado)?.tipo}</p>
                            <p><strong>Tempo de Conjuração: </strong>{magiasCompletas.find(m => m.nome === selecionado)?.conjuracao}</p>
                            <p><strong>Alcance: </strong>{magiasCompletas.find(m => m.nome === selecionado)?.alcance.tipo}
                            {(magiasCompletas.find(m => m.nome === selecionado)?.alcance.distancia || 0) > 1 && (<> {magiasCompletas.find(m => m.nome === selecionado)?.alcance.distancia + " metros"}</>)}</p>
                            <p><strong>Componentes: </strong>{magiasCompletas.find(m => m.nome === selecionado)?.componentes.componentes.map(comp => <>{comp} </>)} 
                            {magiasCompletas.find(m => m.nome === selecionado)?.componentes.material && (<>({magiasCompletas.find(m => m.nome === selecionado)?.componentes.material})</>)}</p>
                            <p><strong>Duração: </strong>{magiasCompletas.find(m => m.nome === selecionado)?.concentracao && (<>concentração, </>)}{magiasCompletas.find(m => m.nome === selecionado)?.duracao}</p>
                            <p><strong>Descricao: </strong>{magiasCompletas.find(m => m.nome === selecionado)?.descricao}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button"
                    onClick={() => {
                        onSelect(selecionado);
                        onClose()
                    }}>Escolher {selecionado}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div >
    );
};

export default ModalSelecaoMagias;
