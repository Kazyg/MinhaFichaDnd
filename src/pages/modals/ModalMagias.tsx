import type { RulesetVersion } from '../../api/rulesets/types';
import AccessibleDialog from "../components/AccessibleDialog";
import "../css/TalentoEscolhas.css";
import React, { useLayoutEffect, useRef, useState } from "react";
import { getMagiasConteudo, resolverMagiaSalva } from '../../api/rulesets/conteudo';
import DescricaoMagia from '../components/DescricaoMagia';
import MagiaCard from '../components/components_inventario/MagiaCard';
import { modificadorAtributo } from '../../api/fichaPersonagem/fichaSeletores';
import { selecionarPoolsMagia } from '../../api/fichaPersonagem/fichaConjuracao';
import { apresentarMagia } from '../../api/rulesets/conteudo';
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
    selecaoDirigida?: { opcoes: string[]; descricao: string; edicao: RulesetVersion };
}

const ModalSelecaoMagias: React.FC<ModalSelecaoProps> = ({ titulo, onClose, onSelect, magiaSelect, escolhaSalva, selecaoDirigida }) => {
    const { ficha } = useFicha();
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
    const textoSelecaoRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const texto = textoSelecaoRef.current;
        if (!texto) return;
        const ajustarTexto = () => {

            let tamanho = 14;
            texto.style.fontSize = `${tamanho}px`;
            while (texto.scrollWidth > texto.clientWidth && tamanho > 12) {
                tamanho -= 0.5;
                texto.style.fontSize = `${tamanho}px`;
            }
        };
        ajustarTexto();
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(ajustarTexto) : undefined;
        observer?.observe(texto);
        window.addEventListener('resize', ajustarTexto);
        let ativo = true;
        document.fonts?.ready.then(() => { if (ativo) ajustarTexto(); });
        return () => {
            ativo = false;
            observer?.disconnect();
            window.removeEventListener('resize', ajustarTexto);
        };
    }, [selecionado, magiaSelect, selecaoDirigida]);

    const fontes = selecionarFontesConjuracao(ficha);
    const [fonte, setFonte] = useState(fontes[0]?.id ?? '');
    const [copia, setCopia] = useState(false);
    const aquisicao = copia ? 'copia' : 'progressao';
    const fonteAtual = fontes.find(f => f.id === (escolhaSalva?.fonte ?? fonte));
    const listaMagias = getMagiasConteudo(selecaoDirigida?.edicao ?? fonteAtual?.edicao ?? ficha?.versaoRegras ?? 'DND_2014').filter(m => m.selecionavel !== false && (selecaoDirigida || escolhaSalva || (fonteAtual && m.listas.includes(fonteAtual.lista) && m.nivel <= fonteAtual.circuloMaximo)) && (!selecaoDirigida || selecaoDirigida.opcoes.includes(m.nome) || selecaoDirigida.opcoes.includes(`2024: ${m.nome}`)));
    const listaParaFiltrar = Object.entries({ bardo: 'Bardo', bruxo: 'Bruxo', clerigo: 'Clerigo', druida: 'Druida', feiticeiro: 'Feiticeiro', mago: 'Mago', paladino: 'Paladino', patrulheiro: 'Patrulheiro' }).map(([chave, nome]) => ({ classe: `Magias de ${nome}`, magias: listaMagias.filter(m => m.listas.includes(chave)) }));
    const resolvida = escolhaSalva ? resolverMagiaSalva(escolhaSalva) : getMagiasConteudo(selecaoDirigida?.edicao ?? fonteAtual?.edicao ?? ficha?.versaoRegras ?? 'DND_2014').find(m => m.nome === selecionado);
    const magiaAtual = resolvida ? apresentarMagia(resolvida) : undefined;
    const fonteCompativel = fonteAtual?.edicao === magiaAtual?.edicao ? fonteAtual : undefined;
    const circulos = selecionarPoolsMagia(ficha).filter(p => fonteCompativel && p.fontes.includes(fonteCompativel.id)).flatMap(p => p.espacos.flatMap((n,i) => n > 0 ? [i + 1] : []));
    const erro = selecaoDirigida ? (listaMagias.some(m => m.nome === selecionado) ? null : 'Escolha uma magia permitida.') : selecionado ? validarEscolhaMagia(ficha, fonte, selecionado, aquisicao) : 'Escolha uma magia.';

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
        <AccessibleDialog className={`popup-content-modal modal-magias${selecaoDirigida ? " modal-magias-dirigida" : ""}`} onClose={onClose} aria-label={titulo}>
            <header className="modal-magias-header"><h2>{titulo}</h2>
            {selecaoDirigida && <p className="talento-campo-fixo">{selecaoDirigida.descricao} · Filtros definidos pelo talento</p>}</header>
            {!selecaoDirigida && filtrosAbertos && (
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
                        <button disabled={!!selecaoDirigida} aria-expanded={filtrosAbertos} aria-label="Filtros" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
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
                    {!selecionado && <p>Selecione uma magia para consultar seus detalhes.</p>}
                    {selecionado && (
                        <>
                            <h3>{selecionado}</h3>
                            {erro && !escolhaSalva && (!magiaSelect || selecaoDirigida) && <p id="erro-magia" className="magia-validacao" role="status" aria-live="polite">{erro}</p>}
                            {!selecaoDirigida && !magiaSelect && <div className="magia-aquisicao">
                                {fontes.length > 1 && <label>Aprender por <select value={fonte} onChange={e => { setFonte(e.target.value); setCopia(false); }}>
                                    {fontes.map(f => <option key={f.id} value={f.id}>{f.nome} ({f.edicao === 'DND_2024' ? '2024' : '2014'})</option>)}
                                </select></label>}
                                {fontes.find(f => f.id === fonte)?.categoria === 'livro' && <label>
                                    <input type="checkbox" checked={copia} onChange={e => setCopia(e.target.checked)} /> Cópia adicional no livro (tempo e custo conferidos com a mesa)
                                </label>}
                            </div>}

                            <MagiaCard key={`${selecionado}:${fonte}`} nome={selecionado} magia={magiaAtual} origem={`${fonteAtual?.nome ?? escolhaSalva?.classe ?? 'Magia'} · ${magiaAtual?.edicao.replace('DND_', '') ?? ficha?.versaoRegras.replace('DND_', '')}`}
                                ataque={fonteCompativel?.ataque} cd={fonteCompativel?.cd} modificador={fonteCompativel ? modificadorAtributo(ficha, fonteCompativel.atributo) : undefined} circulos={circulos} nivelPersonagem={ficha?.levelTotal ?? 1}>
                                <DescricaoMagia magia={magiaAtual} snapshot={escolhaSalva?.snapshot} />
                            </MagiaCard>
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (!magiaSelect || selecaoDirigida) && (<button className="escolher-button magia-confirmar" title={`Escolher ${selecionado}`} aria-label={`Escolher ${selecionado}`} aria-describedby={erro ? "erro-magia" : undefined} disabled={!!erro}
                    onClick={() => {
                        if (!erro && onSelect(selecionado, fonte, aquisicao) !== false) onClose();
                    }}><span ref={textoSelecaoRef} className="magia-selecao-texto">Escolher {selecionado}</span></button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoMagias;
