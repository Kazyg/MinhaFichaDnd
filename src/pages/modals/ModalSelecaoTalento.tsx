import React, { useState } from "react";

interface ModalSelecaoProps {
    opcoes: {nome: string, descricao: string}[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: {nome: string, descricao: string}) => void;
    talentoInicial: {nome: string, descricao: string} | null;
}

const ModalSelecaoTalento: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, talentoInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<{nome: string, descricao: string} | null>(talentoInicial || null);

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
                        placeholder="Filtrar talentos..."
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
                            <p>{selecionado.descricao}</p>

                            <button onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado.nome}</button>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                <button className="fechar" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoTalento;
