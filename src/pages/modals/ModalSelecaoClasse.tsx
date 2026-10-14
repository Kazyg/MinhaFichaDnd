import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import { Classes } from "../../api/classesPrincipais/Classes.class";
import { useFicha } from "../../api/fichaPersonagem/FichaContext";

interface ModalSelecaoProps {
    opcoes: Classes[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Classes | null) => boolean | void;
    validar?: (opcao: Classes) => string | null;
    classeInicial: Classes | null;
}

const ModalSelecaoClasse: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, classeInicial, validar }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Classes | null>(classeInicial || null);
    const { ficha } = useFicha();
    const erro = selecionado ? validar?.(selecionado) : null;

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes.filter((opcao) =>
        normalizar(opcao.nome).includes(filtro.toLowerCase())
    );

    const classePrincipal = opcoesFiltradas.find(opcao => opcao.nome === ficha?.classePrincipal?.nome);
    const opcoesOrdenadas = classePrincipal
        ? [classePrincipal, ...opcoesFiltradas.filter(opcao => opcao.nome !== classePrincipal.nome)]
        : opcoesFiltradas;

    return (
        <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label={titulo}>
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        aria-label="Filtrar classes..." placeholder="Filtrar classes..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesOrdenadas.map((opcao) => (
                            <li key={opcao.nome}><button type="button" className="selection-option" aria-pressed={selecionado?.nome === opcao.nome} onClick={() => {
                                setSelecionado(opcao);
                            }}>
                                {opcao.nome}
                            </button></li>
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
                            <p><strong>Proeficiencias: {selecionado.habilidade} Dentre: </strong>{selecionado.habilidades.join(", ")}</p>
                            {erro && <p id="erro-classe" role="status">{erro}</p>}
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" disabled={!!erro} aria-describedby={erro ? 'erro-classe' : undefined} onClick={() => { if (!erro && onSelect(selecionado) !== false) onClose(); }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoClasse;
