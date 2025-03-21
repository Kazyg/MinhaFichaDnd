import React, { useState } from "react";

interface ModalSelecaoProps {
    opcoes: { classe: string[], nome: string, descricao: string }[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: { classe: string[], nome: string, descricao: string } | null) => void;
    EstiloInicial: { classe: string[], nome: string, descricao: string } | null;
}

const ModalSelecaoEstiloLuta: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, EstiloInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<{ classe: string[], nome: string, descricao: string } | null>(EstiloInicial || null);

    const opcoesFiltradas = opcoes.filter((opcao) =>
        opcao.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="popup-content-modal">
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        placeholder="Filtrar classes..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesFiltradas.map((opcao) => (
                            <li key={opcao.nome} onClick={() => {
                                setSelecionado(opcao);
                            }}>
                                {opcao.nome}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado.nome}</h3>
                            <p><strong>Descricao:</strong>{selecionado.descricao}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoEstiloLuta;
