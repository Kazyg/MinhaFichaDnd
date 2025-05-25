import React, { useState } from "react";
import { Classes } from "../../api/classesPrincipais/Classes.class.ts";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";

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
    const { ficha } = useFicha();

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
                        {opcoesOrdenadas.map((opcao) => (
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
                            <p><strong>Proeficiencias: {selecionado.habilidade} Dentre: </strong>{selecionado.habilidades.join(", ")}</p>
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

export default ModalSelecaoClasse;
