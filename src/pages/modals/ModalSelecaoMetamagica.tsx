import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import { Metamagica } from "../../bibliotecas/Metamagica";

interface ModalSelecaoProps {
    opcoes: typeof Metamagica;
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: string | null) => void;
}

const ModalSelecaoMetamagica: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState("");

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes.filter((opcao) =>
        normalizar(opcao.nome).includes(filtro.toLowerCase())
    );

    return (
        <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label={titulo}>
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        aria-label="Filtrar Metamagicas..." placeholder="Filtrar Metamagicas..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesFiltradas.map((opcao) => (
                            <li key={opcao.nome}><button type="button" className="selection-option" aria-pressed={selecionado === opcao.nome} onClick={() => {
                                setSelecionado(opcao.nome);
                            }}>
                                {opcao.nome}
                            </button></li>
                        ))}
                    </ul>
                </div>

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado}</h3>
                            <p><strong>Descrição: </strong>{opcoes.find(m => m.nome === selecionado)?.descricao}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoMetamagica;
