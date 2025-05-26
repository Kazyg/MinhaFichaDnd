import React, { useState } from "react";
import { Patronos } from "../../api/classesEspeciais/Patronos.class.ts";

interface ModalSelecaoProps {
    opcoes: Patronos[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Patronos | null) => void;
    patronoInicial: Patronos | null | undefined;
}

const ModalSelecaoPatrono: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, patronoInicial }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Patronos | null>(patronoInicial || null);

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
                            <p><strong>Magias: </strong>{selecionado.magias.join(", ")}</p>
                            <br />
                            <p><strong>Habilidades: </strong> {selecionado.habilidades.map((t, index) => (
                                <span key={index}>
                                    <strong>{t.nome + ": "}</strong>{t.descricao}
                                    <br />
                                    <br />
                                </span>
                            ))}</p>
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

export default ModalSelecaoPatrono;
