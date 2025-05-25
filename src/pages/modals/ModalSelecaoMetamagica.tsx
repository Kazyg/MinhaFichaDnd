import React, { useState } from "react";
import { Metamagica } from "../../bibliotecas/Metamagica.ts";

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
        <div className="popup-content-modal">
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        placeholder="Filtrar Metamagicas..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesFiltradas.map((opcao) => (
                            <li key={opcao.nome} onClick={() => {
                                setSelecionado(opcao.nome);
                            }}>
                                {opcao.nome}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado}</h3>
                            <p><strong>Descrição: </strong>{Metamagica.find(m => m.nome === selecionado)?.descricao}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoMetamagica;
