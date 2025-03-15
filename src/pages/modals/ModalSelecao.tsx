import React, { useState } from "react";
import { Raca } from "../../api/classesPrincipais/Raca.class";

interface ModalSelecaoProps {
    opcoes: Raca[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Raca | null) => void;
    onAtributeSelect: (atributosSelect: string[] | null) => void;
    racaInicial: Raca | null;
    atributosIniciais: string[] | null;
}

const ModalSelecao: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, racaInicial, onAtributeSelect, atributosIniciais }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Raca | null>(racaInicial || null);
    const [atributosSelecionados, setAtributosSelecionados] = useState<string[]>(atributosIniciais || []);

    const atributos = ["força", "destreza", "constituição", "inteligência", "sabedoria", "carisma"];

    const handleAtributoChange = (atributo: string) => {
        if (atributosSelecionados.includes(atributo)) {
            setAtributosSelecionados(atributosSelecionados.filter(a => a !== atributo));
        } else if (atributosSelecionados.length < 2) {
            setAtributosSelecionados([...atributosSelecionados, atributo]);
        } else {
            setAtributosSelecionados([...atributosSelecionados.slice(1), atributo]);
        }
    };

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
                        placeholder="Filtrar raças..."
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
                            <p><strong>Tamanho:</strong> {selecionado.tamanho}</p>
                            <p><strong>Velocidade:</strong> {selecionado.velocidade} pés</p>
                            <p><strong>Idiomas:</strong> {selecionado.idiomas?.join(", ")}</p>
                            <p><strong>Atributos:</strong> {selecionado.atributos?.atributo.map((a, i) => `${a} +${selecionado.atributos?.bonus[i]}`).join(", ")}</p>
                            <p><strong>Traços:</strong> {selecionado.tracos?.map((t, index) => (
                                <span key={index}>
                                    <strong>{t.traco + ": "}</strong>{t.descricao}
                                    <br />
                                    <br />
                                </span>
                            ))}</p>
                            {(selecionado.nome === "Humano Variante" || selecionado.nome === "Meio-Elfo") && (
                                <div>
                                    <h3>Escolha 2 Atributos</h3>
                                    <div className="selecao-atributos">
                                        {atributos.map((atributo) => (
                                            <label key={atributo} className={`checkbox-container ${(selecionado.nome === "Meio-Elfo" && atributo === "carisma") ||
                                                (atributosSelecionados.length >= 2 &&
                                                    !atributosSelecionados.includes(atributo))
                                                ? "disabled-hover"
                                                : ""
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    value={atributo}
                                                    checked={
                                                        atributosSelecionados.includes(atributo) &&
                                                        !(selecionado.nome === "Meio-Elfo" && atributo === "carisma")
                                                    }
                                                    onChange={() => handleAtributoChange(atributo)}
                                                    disabled={
                                                        (selecionado.nome === "Meio-Elfo" && atributo === "carisma")
                                                    }
                                                />
                                                {atributo}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => { onAtributeSelect(atributosSelecionados); onSelect(selecionado); onClose() }} disabled={((selecionado.nome === "Humano Variante" || selecionado.nome === "Meio-Elfo") && atributosSelecionados.length !== 2) || (selecionado.nome === "Meio-Elfo" && atributosSelecionados.includes("carisma"))}>Escolher {selecionado.nome}</button>
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

export default ModalSelecao;
