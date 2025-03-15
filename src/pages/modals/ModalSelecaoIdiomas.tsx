import React, { useState } from "react";
import { Idiomas, idiomas } from "../../bibliotecas/idiomas/idiomasData.ts";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

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

    const { ficha } = useFicha();

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
                        {idiomasFiltrados
                            .filter(idioma => !ficha?.idiomas || !ficha.idiomas.includes(idioma.nome))
                            .map((idioma) => (
                                <li key={idioma.nome} onClick={() => {
                                    const idiomaSelecionado = idiomas.find(x => x.nome === idioma.nome);
                                    setSelecionado(idiomaSelecionado || null);
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
                            <button className="escolher-button" onClick={() => { onSelect(selecionado); onClose(); }}>Escolher {selecionado.nome}</button>
                        </>
                    )}
                </div>
            </div>
            <div className="popup-footer">
                <button className="escolher-button" onClick={() => onClose()}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoIdioma;
