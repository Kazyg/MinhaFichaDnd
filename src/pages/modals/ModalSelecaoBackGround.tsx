import React, { useState } from "react";
import { BackGround } from "../../api/classesPrincipais/BackGrounds.class.ts";

interface ModalSelecaoProps {
    opcoes: BackGround[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: BackGround | null) => void;
    backGroundInicial: BackGround | null;
}

const ModalSelecaoBackGround: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, backGroundInicial}) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<BackGround | null>(backGroundInicial || null);

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
                            <p><strong>Proeficiencias em habilidades:</strong> {selecionado.proeficienciasHabilidades.join(", ")}</p>
                            <p><strong>Idiomas:</strong> {selecionado.idiomas}</p>
                            <p><strong>Proeficiencias em ferramentas:</strong> {selecionado.proeficienciaFerramentas.join(", ")}</p>
                            <p><strong>Caracteristicas:</strong> {selecionado.caracteristicas.join(", ")}</p>

                            <button className="escolher-button" onClick={() => { onSelect(selecionado); onClose() }}>Escolher {selecionado.nome}</button>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoBackGround;
