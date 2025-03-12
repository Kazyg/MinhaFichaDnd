import React, { useState } from "react";
import { Idiomas, idiomas } from "../../api/idiomas/idiomasData.ts";

interface ModalSelecaoIdiomaProps {
    titulo: string;
    onClose: () => void;
    onSelect: (idioma: Idiomas | null) => void;
    idiomaInicial: Idiomas | null;
}

const ModalSelecaoIdioma: React.FC<ModalSelecaoIdiomaProps> = ({ titulo, onClose, onSelect, idiomaInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Idiomas | null>(idiomaInicial || null);

    const idiomasFiltrados = idiomas.filter((idioma) =>
        idioma.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    var i;

    return (
        <div className="popup-content-modal">
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        placeholder="Filtrar idiomas..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {idiomasFiltrados.map((idioma) => (
                            <li key={idioma.nome} onClick={() => {
                                const idiomaSelecionado = idiomas.find(x => x.nome === idioma.nome);
                                setSelecionado(idiomaSelecionado || null);
                                console.log(selecionado)
                            }}>
                                {idioma.nome}
                            </li>
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
                            <button onClick={() => { onSelect(selecionado); onClose(); }}>Escolher {selecionado.nome}</button>
                        </>
                    )}
                </div>
            </div>
            <div className="popup-footer">
                <button className="fechar" onClick={() => onClose()}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoIdioma;
