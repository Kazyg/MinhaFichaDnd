import React, { useState } from "react";
import { Classes } from "../../api/classesPrincipais/Classes.class.ts";

interface ModalSelecaoProps {
    opcoes: Classes[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Classes | null) => void;
    classeInicial: Classes | null;
}

const ModalSelecaoClasse: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, classeInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Classes | null>(classeInicial || null);

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
                            <p><strong>Dados de vida:</strong> 1D{selecionado.dadosVida}</p>
                            <p><strong>Armaduras:</strong> {selecionado.armaduras.join(", ")}</p>
                            <p><strong>Armas:</strong> {selecionado.armas.join(", ")}</p>
                            <p><strong>Ferramentas:</strong> {selecionado.ferramentas.join(", ")}</p>
                            <p><strong>Testes de resistencias:</strong> {selecionado.testesResistencias.join(", ")}</p>
                            <p><strong>Proeficiencias:</strong> {selecionado.habilidades.join(", ")}</p>

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

export default ModalSelecaoClasse;
