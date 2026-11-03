import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import { Idiomas, idiomas } from "../../bibliotecas/idiomas/idiomasData";
import { useFicha } from "../../api/fichaPersonagem/FichaContext"

interface ModalSelecaoIdiomaProps {
    titulo: string;
    onClose: () => void;
    onSelect: (idioma: Idiomas | null) => void;
    idiomaInicial: Idiomas | null;
    idiomasPermitidos?: string[];
}

const ModalSelecaoIdioma: React.FC<ModalSelecaoIdiomaProps> = ({ titulo, onClose, onSelect, idiomaInicial, idiomasPermitidos }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Idiomas | null>(idiomaInicial || null);

    const idiomasFiltrados = idiomas.filter((idioma) =>
        idioma.nome.toLowerCase().includes(filtro.toLowerCase()) &&
        (!idiomasPermitidos || idiomasPermitidos.includes(idioma.nome))
    );

    const { ficha } = useFicha();

    return (
        <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label={titulo}>
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        aria-label="Filtrar idiomas..." placeholder="Filtrar idiomas..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {idiomasFiltrados
                            .filter(idioma => idioma.nome === idiomaInicial?.nome || !ficha?.idiomas || !ficha.idiomas.includes(idioma.nome))
                            .map((idioma) => (
                                <li key={idioma.nome}><button type="button" className="selection-option" aria-pressed={selecionado?.nome === idioma.nome} onClick={() => {
                                    const idiomaSelecionado = idiomas.find(x => x.nome === idioma.nome);
                                    setSelecionado(idiomaSelecionado || null);
                                }}>
                                    {idioma.nome}
                                </button></li>
                            ))}
                    </ul>
                </div>

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado.nome}</h3>
                            <p><strong>Falantes Tipicos:</strong> {selecionado.falantes_tipicos}</p>
                            <p><strong>Alfabetos:</strong> {selecionado.alfabeto}</p>
                            <p><strong>Informações:</strong> {selecionado.informacoes}</p>                           
                        </>
                    )}
                </div>
            </div>
            <div className="popup-footer">
            {selecionado && (<button className="escolher-button" onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => onClose()}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoIdioma;
