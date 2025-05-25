import React, { useState } from "react";
import { BackGround } from "../../api/classesPrincipais/BackGrounds.class.ts";

interface ModalSelecaoProps {
    opcoes: BackGround[];
    titulo: string;
    onClose: () => void;
    onInstrumentoSelect: (intrumento: string) => void
    onItemSelect: (item: string) => void
    onSelect: (opcao: BackGround | null) => void;
    backGroundInicial: BackGround | null;
}

const ModalSelecaoBackGround: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, backGroundInicial, onInstrumentoSelect, onItemSelect }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<BackGround | null>(backGroundInicial || null);
    const [instrumentoSelecionado, setInstrumentoSelecionado] = useState("");
    const [itemSelecionado, setItemSelecionado] = useState("");

    const instrumentosMusicais = [
        "Alaúde",
        "Bandolim",
        "Corneta",
        "Flauta",
        "Flauta de Pã",
        "Gaita de Fole",
        "Lira",
        "Tambor",
        "Tamborim",
        "Trombeta",
        "Violino"
    ];

    const itensCharlatao = [
        "dez garrafas tampadas preenchidas com líquidos coloridos",
        "conjunto de dados viciados",
        "baralho de cartas marcadas",
        "anel de sinete de um duque imaginário"
    ]
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
                            <p><strong>Proeficiencias em pericias:</strong> {selecionado.proeficienciasHabilidades.join(", ")}</p>
                            <p><strong>Idiomas:</strong> {selecionado.idiomas} {selecionado.nome === "Heroi Injustiçado" && (<> Idioma do povo que o traiu.</>)}</p>
                            <p><strong>Proeficiencias em ferramentas:</strong> {selecionado.proeficienciaFerramentas.join(", ")}</p>
                            <p><strong>Equipamentos:</strong> {selecionado.equipamentos.join(", ")}</p>
                            <p><strong>Caracteristicas: {selecionado.caracteristicas.nome}:</strong> {selecionado.caracteristicas.descricao}</p>

                            {selecionado.nome === "artista" && (
                                <select
                                    value={instrumentoSelecionado}
                                    onChange={(e) => setInstrumentoSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione um instrumento musical</option>
                                    {instrumentosMusicais.map((instrumento) => (
                                        <option key={instrumento} value={instrumento}>
                                            {instrumento}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {selecionado.nome === "Charlatao" && (
                                <select
                                    value={itemSelecionado}
                                    onChange={(e) => setItemSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione um item</option>
                                    {itensCharlatao.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button disabled={(selecionado.nome === "artista" && instrumentoSelecionado === "") ||
                    (selecionado.nome === "Charlatao" && itemSelecionado === "")}
                    className="escolher-button"
                    onClick={() => {
                        onSelect(selecionado);
                        onClose();
                        onInstrumentoSelect(instrumentoSelecionado);
                        onItemSelect(itemSelecionado)
                    }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecaoBackGround;
