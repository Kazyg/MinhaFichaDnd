import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import { getMagiasConteudo, resolverMagiaSalva } from '../../api/rulesets/conteudo';
import ConteudoMagia from '../components/ConteudoMagia';
import iconFilter from "../../imagens/filter_alt_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import iconNoFilter from "../../imagens/filter_alt_off_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png"
import { useFicha } from "../../api/fichaPersonagem/FichaContext";
import { EscolhaMagia, selecionarFontesConjuracao, validarEscolhaMagia } from '../../api/fichaPersonagem/fichaConjuracao';

interface ModalSelecaoProps {
    titulo: string;
    onClose: () => void;
    onSelect: (nomeMagia: string, fonte?: string, aquisicao?: EscolhaMagia['aquisicao']) => boolean | void;
    magiaSelect: string | null;
    escolhaSalva?: EscolhaMagia;
}

const ModalSelecaoMagias: React.FC<ModalSelecaoProps> = ({ titulo, onClose, onSelect, magiaSelect, escolhaSalva }) => {
    const { ficha } = useFicha();
    const listaMagias = getMagiasConteudo(ficha?.versaoRegras ?? 'DND_2014');
    const listaParaFiltrar = Object.entries({ bardo: 'Bardo', bruxo: 'Bruxo', clerigo: 'Clerigo', druida: 'Druida', feiticeiro: 'Feiticeiro', mago: 'Mago', paladino: 'Paladino', patrulheiro: 'Patrulheiro' }).map(([chave, nome]) => ({ classe: `Magias de ${nome}`, magias: listaMagias.filter(m => m.listas.includes(chave)) }));
    const listaEscolasFiltros = [
        "abjuração",
        "adivinhação",
        "conjuração",
        "encantamento",
        "evocação",
        "ilusão",
        "necromancia",
        "transmutação"
    ];
    const listaNiveisFiltro = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [filtro, setFiltro] = useState("");
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtrosSelecionado, setFiltrosSelecionado] = useState(false);
    const listaGrupoMagia = ["Magias de Bardo", "Magias de Bruxo", "Magias de Clerigo", "Magias de Druida", "Magias de Feiticeiro", "Magias de Mago", "Magias de Paladino", "Magias de Patrulheiro"];
    const [filtroClasse, setFiltroClasse] = useState("");
    const [filtroEscola, setFiltroEscola] = useState("");
    const [filtroNivel, setFiltroNivel] = useState<number | null>(null);
    const [selecionado, setSelecionado] = useState(magiaSelect);

    const fontes = selecionarFontesConjuracao(ficha);
    const [fonte, setFonte] = useState(fontes[0]?.id ?? '');
    const [copia, setCopia] = useState(false);
    const aquisicao = copia ? 'copia' : 'progressao';
    const erro = selecionado ? validarEscolhaMagia(ficha, fonte, selecionado, aquisicao) : 'Escolha uma magia.';

    const magiasUnicas = [
        ...new Map(listaMagias.map(magia => [magia.nome, magia])).values()
    ];

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = magiasUnicas.filter((opcao) =>
        normalizar(opcao.nome).includes(normalizar(filtro))
    );

    const opcoesFiltros = () => {
        let opcoesFiltros = opcoesFiltradas;
        if (filtroClasse !== "") {
            const lista = listaParaFiltrar.find(l => l.classe === filtroClasse)?.magias ?? [];
            opcoesFiltros = opcoesFiltros.filter(m => lista.some(l => l.nome === m.nome));
        }
        if (filtroEscola !== "") {
            opcoesFiltros = opcoesFiltros.filter(o => o.tipo === filtroEscola);
        }
        if (filtroNivel !== null) {
            opcoesFiltros = opcoesFiltros.filter(o => o.nivel === filtroNivel);
        }
        return opcoesFiltros;
    }

    return (
        <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label={titulo}>
            <h2>{titulo}</h2>
            <p>Catálogo parcial da edição {ficha?.versaoRegras ?? "DND_2014"}. Conteúdo ausente permanece pendente.</p>
            {!magiaSelect && <>
                <label>Fonte de conjuração <select value={fonte} onChange={e => { setFonte(e.target.value); setCopia(false); }}>
                    {fontes.map(f => <option key={f.id} value={f.id}>{f.nome} ({f.edicao === 'DND_2024' ? '2024' : '2014'})</option>)}
                </select></label>
                {fontes.find(f => f.id === fonte)?.categoria === 'livro' && <label>
                    <input type="checkbox" checked={copia} onChange={e => setCopia(e.target.checked)} /> Cópia adicional no livro (tempo e custo conferidos com a mesa)
                </label>}
                {erro && selecionado && <p id="erro-magia" role="status">{erro}</p>}
            </>}
            {filtrosAbertos && (
                <div className="filtros-magias">
                    <h5>Filtro de Magias</h5>
                    <div className="selects-filtros">
                        <select aria-label="Filtrar por classe"
                            value={filtroClasse}
                            onChange={(e) => {
                                setFiltroClasse(e.target.value);
                                setFiltrosSelecionado(true);
                            }}
                        >
                            <option value="">Selecione uma Classe..</option>
                            {listaGrupoMagia.map((classe) => (
                                <option
                                    key={classe}
                                    value={classe}
                                >
                                    {classe}
                                </option>
                            ))}
                        </select>
                        <select aria-label="Filtrar por escola"
                            value={filtroEscola}
                            onChange={(e) => {
                                setFiltroEscola(e.target.value);
                                setFiltrosSelecionado(true);
                            }}
                        >
                            <option value="">Selecione uma Escola..</option>
                            {listaEscolasFiltros.map((escola) => (
                                <option
                                    key={escola}
                                    value={escola}
                                >
                                    {escola}
                                </option>
                            ))}
                        </select>
                        <select aria-label="Filtrar por nível"
                            value={filtroNivel ?? ""}
                            onChange={(e) => {
                                setFiltroNivel(e.target.value === '' ? null : Number(e.target.value));
                                setFiltrosSelecionado(true);
                            }}
                        >
                            <option value="">Selecione um nivel..</option>
                            {listaNiveisFiltro.map((nivel) => (
                                <option
                                    key={nivel}
                                    value={nivel}
                                >
                                    {nivel}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => {
                            setFiltrosAbertos(false);
                            setFiltrosSelecionado(false);
                            setFiltroNivel(null);
                            setFiltroClasse("");
                            setFiltroEscola("");
                        }}>
                            <img src={iconNoFilter} className="imagem-nofiltro" alt="Limpar filtros" />
                        </button>
                    </div>
                </div>
            )}
            <div className="popup-body-modal">
                {!escolhaSalva && <div className="lista-racas">
                    <div className="filtros">
                        <input
                            className="lista-racas-input"
                            type="text"
                            aria-label="Filtrar magias..." placeholder="Filtrar magias..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                        <button aria-expanded={filtrosAbertos} aria-label="Filtros" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
                            <img src={iconFilter} className="imagem-filtro" alt="Abrir filtros" />
                        </button>
                    </div>
                    <ul>
                        {filtrosSelecionado ? (
                            <>
                                {[...opcoesFiltros()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((opcao) => (
                                    <li key={opcao.nome}><button type="button" className="selection-option" aria-pressed={selecionado === opcao.nome} onClick={() => {
                                        setSelecionado(opcao.nome);
                                    }}>
                                        {opcao.nome}
                                    </button></li>
                                ))}
                            </>
                        ) : (
                            <>
                                {[...opcoesFiltradas].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((opcao) => (
                                    <li key={opcao.nome}><button type="button" className="selection-option" aria-pressed={selecionado === opcao.nome} onClick={() => {
                                        setSelecionado(opcao.nome);
                                    }}>
                                        {opcao.nome}
                                    </button></li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>}

                <div className="detalhes-raca">
                    {selecionado && (
                        <>
                            <h3>{selecionado}</h3>
                            <ConteudoMagia magia={escolhaSalva ? resolverMagiaSalva(escolhaSalva) : listaMagias.find(m => m.nome === selecionado)} snapshot={escolhaSalva?.snapshot}
                                aviso={escolhaSalva && !escolhaSalva.conteudo ? 'Registro legado catalogo-2014; texto antigo preservado, sem conversão automática.' : undefined} />
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && !magiaSelect && (<button className="escolher-button" aria-describedby={erro ? "erro-magia" : undefined} disabled={!!erro}
                    onClick={() => {
                        if (onSelect(selecionado, fonte, aquisicao) !== false) onClose();
                    }}>Escolher {selecionado}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoMagias;
