import React, { useState, useRef } from "react";
import { Raca } from "../../api/classesPrincipais/Raca.class";
import { MeioElfo } from "../../api/classesFilhos/MeioElfo.class.ts";
import { HumanoVariante } from "../../api/classesFilhos/HumanoVariante.class.ts";
import { Draconato } from "../../api/classesFilhos/Draconato.class.ts";
import { MeioOrc } from "../../api/classesFilhos/MeioOrc.class.ts";

interface ModalSelecaoProps {
    opcoes: Raca[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Raca | null) => void;
    onAtributeSelect: (atributosSelect: string[] | null) => void;
    onFerramentaSelect: (ferramentaSelect: string | null) => void;
    racaInicial: Raca | null;
    atributosIniciais: string[] | null;
}

const ModalSelecao: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, racaInicial, onAtributeSelect, atributosIniciais, onFerramentaSelect }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Raca | null>(racaInicial || null);
    const [atributosSelecionados, setAtributosSelecionados] = useState<string[]>(atributosIniciais || []);
    const [ferramentaSelecionada, setFerramentaSelecionada] = useState<string | null>(null);
    const [ancestralidadeSelecionada, setAncestralidadeSelecionada] = useState<string>("");
    const [periciaHumano, setPericiaHumano] = useState("");
    const [periciaMeioElfo1, setPericiaMeioElfo1] = useState("");
    const [periciaMeioElfo2, setPericiaMeioElfo2] = useState("");

    const atributos = ["força", "destreza", "constituição", "inteligência", "sabedoria", "carisma"];
    const ferramentas = ["ferramentas de ferreiro", "suprimentos de cervejeiro", "ferramentas de pedreiro"];
    const ancestralidade = ["Branco", "Bronze", "Cobre", "Latão", "Negro", "Ouro", "Prata", "Verde", "Vermelho"]
    const pericias = [
        "Atletismo",
        "Acrobacia",
        "Furtividade",
        "Prestidigitação",
        "Arcanismo",
        "História",
        "Investigação",
        "Natureza",
        "Religião",
        "Adestrar Animais",
        "Intuição",
        "Medicina",
        "Percepção",
        "Sobrevivência",
        "Atuação",
        "Enganação",
        "Intimidação",
        "Persuasão",
    ];

    const handleAtributoChange = (atributo: string) => {
        setAtributosSelecionados((prevAtributos) => {
            let novosAtributos;

            if (prevAtributos.includes(atributo)) {
                novosAtributos = prevAtributos.filter(a => a !== atributo);
            } else if (prevAtributos.length < 2) {
                novosAtributos = [...prevAtributos, atributo];
            } else {
                novosAtributos = [...prevAtributos.slice(1), atributo];
            }

            return novosAtributos;
        });
    };

    const selecionadoRef = useRef(selecionado);

    const atribuirAtributos = (escolhidos: string[], raca: Raca, ancestralidade: string) => {
        let novoSelecionado;

        if (raca.nome === "Humano Variante") {
            novoSelecionado = new HumanoVariante(escolhidos[0], escolhidos[1], periciaHumano);
        } else if (raca.nome === "Meio-Elfo") {
            novoSelecionado = new MeioElfo(escolhidos[0], escolhidos[1], periciaMeioElfo1, periciaMeioElfo2);
        } else if (raca.nome === "Draconato") {
            novoSelecionado = new Draconato(ancestralidade);
        } else if(raca.nome === "Meio-Orc"){
            novoSelecionado = new MeioOrc("Intimidação")
        }else {
            novoSelecionado = selecionado;
        }

        setSelecionado(novoSelecionado); // Atualiza o estado
        selecionadoRef.current = novoSelecionado; // Atualiza a referência
    };

    const opcoesFiltradas = opcoes.filter((opcao) =>
        opcao.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    function verificarCondicoes(
        selecionado: { nome: string },
        atributosSelecionados: string[],
        ferramentaSelecionada: any,
        ancestralidadeSelecionada: any
    ): boolean {
        return (
            ((selecionado.nome === "Humano Variante" || selecionado.nome === "Meio-Elfo") && atributosSelecionados.length !== 2) ||
            (selecionado.nome === "Meio-Elfo" && atributosSelecionados.includes("carisma")) ||
            (selecionado.nome === "Anão" && ferramentaSelecionada === null) ||
            (selecionado.nome === "Draconato" && ancestralidadeSelecionada === null) ||
            (selecionado.nome === "Humano Variante" && periciaHumano === "") ||
            (selecionado.nome === "Meio-Elfo" && (periciaMeioElfo1 === "" || periciaMeioElfo2 === ""))
        );
    }

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
                                    <h3>Escolha sua perícia</h3>
                                    {selecionado.nome === "Humano Variante" && (
                                        <select
                                            value={periciaHumano}
                                            onChange={(e) => setPericiaHumano(e.target.value)}
                                        >
                                            <option value="">Selecione uma perícia</option>
                                            {pericias.map((pericia) => (
                                                <option key={pericia} value={pericia}>
                                                    {pericia}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {selecionado.nome === "Meio-Elfo" && (
                                        <div>
                                            <select
                                                value={periciaMeioElfo1}
                                                onChange={(e) => setPericiaMeioElfo1(e.target.value)}
                                            >
                                                <option value="">Selecione a primeira perícia</option>
                                                {pericias.map((pericia) => (
                                                    <option
                                                        key={pericia}
                                                        value={pericia}
                                                        disabled={pericia === periciaMeioElfo2}
                                                    >
                                                        {pericia}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={periciaMeioElfo2}
                                                onChange={(e) => setPericiaMeioElfo2(e.target.value)}
                                            >
                                                <option value="">Selecione a segunda perícia</option>
                                                {pericias.map((pericia) => (
                                                    <option
                                                        key={pericia}
                                                        value={pericia}
                                                        disabled={pericia === periciaMeioElfo1}
                                                    >
                                                        {pericia}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(selecionado.nome === "Humano Variante" || selecionado.nome === "Meio-Elfo") && (
                                <div className="selecao-atributos-container">
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
                            {selecionado.nome === "Anão" && (
                                <div className="selecao-atributos-container">
                                    <h3>Escolha uma ferramenta</h3>
                                    <div className="selecao-atributos">
                                        {ferramentas.map((ferramenta) => (
                                            <label key={ferramenta} className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    value={ferramenta}
                                                    checked={
                                                        ferramentaSelecionada === ferramenta
                                                    }
                                                    onChange={() => setFerramentaSelecionada(ferramenta)}
                                                />
                                                {ferramenta}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selecionado.nome === "Draconato" && (
                                <div className="selecao-atributos-container">
                                    <h3>Escolha uma Ancestralidade</h3>
                                    <div className="selecao-atributos-ancestral">
                                        {ancestralidade.map((ancestral) => (
                                            <label key={ancestral} className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    value={ancestral}
                                                    checked={
                                                        ancestralidadeSelecionada === ancestral
                                                    }
                                                    onChange={() => setAncestralidadeSelecionada(ancestral)}
                                                />
                                                Dragão {ancestral}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" onClick={() => {
                    onAtributeSelect(atributosSelecionados);
                    atribuirAtributos(atributosSelecionados, selecionado, ancestralidadeSelecionada);
                    onSelect(selecionadoRef.current);
                    onFerramentaSelect(ferramentaSelecionada);
                    onClose();
                }}
                    disabled={verificarCondicoes(selecionado, atributosSelecionados, ferramentaSelecionada, ancestralidadeSelecionada)}>Escolher {selecionado.nome}
                </button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </div>
    );
};

export default ModalSelecao;
