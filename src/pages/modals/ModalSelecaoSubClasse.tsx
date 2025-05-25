import React, { useState } from "react";
import { SubClasses } from "../../api/classesPrincipais/SubClasses.ts";

interface ModalSelecaoProps {
    opcoes: SubClasses[] | null;
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: SubClasses | null) => void;
    subClasseInicial: SubClasses | null;
}

const ModalSelecaoSubClasse: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, subClasseInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<SubClasses | null>(subClasseInicial || null);

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes?.filter((opcao) =>
        normalizar(opcao.nome).includes(filtro.toLowerCase())
    );

    return (
        <div className="popup-content-modal">
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        placeholder="Filtrar subClasses..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesFiltradas?.map((opcao) => (
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
                            <p><strong>Descrição:</strong> {selecionado.descricao}</p>
                            {selecionado.niveis.map((subClasse) => {
                                return (
                                    <>
                                        <p><strong>Nome:</strong> {subClasse.nome}</p>
                                        <p><strong>Nível:</strong> {subClasse.nivel}</p>
                                        <p><strong>Descrição:</strong> {subClasse.descricao}</p>
                                        <hr></hr>
                                    </>
                                );
                            })}
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

export default ModalSelecaoSubClasse;
