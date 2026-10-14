import { createPortal } from "react-dom";
import ModalMagias from "./ModalMagias";
import "../css/TalentoEscolhas.css";
import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import type { TalentoConteudo } from '../../api/rulesets/types';
import { treinamentosTalento, EscolhasSelecaoTalento } from '../../api/fichaPersonagem/talentosConteudo';
import { camposTalento } from '../../bibliotecas/Catalogo2024';
import { talento2024, validarEscolhasTalento, proficiencia2024 } from '../../api/fichaPersonagem/talentos2024Utils';
import type { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';

interface ModalSelecaoProps {
    ficha?: Ficha | null;
    listaDefinida?: string;
    opcoes: TalentoConteudo[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: TalentoConteudo, escolhas: EscolhasSelecaoTalento) => boolean | void;
    talentoInicial: TalentoConteudo | null;
    escolhasIniciais?: EscolhasSelecaoTalento;
    validar?: (opcao: TalentoConteudo, escolhas: EscolhasSelecaoTalento) => string | null;
}

const ModalSelecaoTalento: React.FC<ModalSelecaoProps> = ({ ficha, listaDefinida, opcoes = [], titulo, onClose, onSelect, talentoInicial, escolhasIniciais = [], validar }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<TalentoConteudo | null>(talentoInicial || null);
    const [escolhas, setEscolhas] = useState<string[]>(Array.isArray(escolhasIniciais) ? escolhasIniciais : []);
    const [escolhas2024, setEscolhas2024] = useState<Record<string, string[]>>({ ...(Array.isArray(escolhasIniciais) ? {} : escolhasIniciais), ...(listaDefinida ? { lista: [listaDefinida] } : {}) });
    const [seletorMagia, setSeletorMagia] = useState<{ chave: string; indice: number; opcoes: string[]; rotulo: string } | null>(null);
    const regra = selecionado?.phb && talento2024(selecionado.nome);
    const campos = regra ? camposTalento(regra, escolhas2024, proficiencia2024(ficha)) : [];
    const escolhasConfirmadas = regra ? escolhas2024 : escolhas;
    const quantidade = selecionado?.escolha === 'treinamentos' ? 3 : selecionado?.escolha === 'atributo-agarrador' ? 1 : 0;
    const erro = !selecionado ? 'Escolha um talento.' : !opcoes.some(t => t.id === selecionado.id && t.revisao === selecionado.revisao) ? 'Opção indisponível.' :
        selecionado.edicao !== 'DND_2014' && !selecionado.suportado ? 'Este talento não está disponível para seleção.' : regra ? (validar ? validar(selecionado, escolhas2024) : validarEscolhasTalento(regra, escolhas2024, ficha, ficha?.levelTotal ?? 1)[0]) : escolhas.filter(Boolean).length !== quantidade ? 'Complete as escolhas adicionais.' : validar?.(selecionado, escolhas);

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes.filter((opcao) =>
        normalizar(opcao.nome).includes(normalizar(filtro))
    );

    return (
        <AccessibleDialog className="popup-content-modal modal-talentos" onClose={onClose} aria-label={titulo}>
            <h2>{titulo}</h2>
            <div className="popup-body-modal">
                <div className="lista-racas">
                    <input
                        type="text"
                        aria-label="Filtrar talentos..." placeholder="Filtrar talentos..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <ul>
                        {opcoesFiltradas.map((opcao) => (
                            <li key={opcao.nome}><button type="button" className="selection-option" aria-pressed={selecionado?.nome === opcao.nome} onClick={() => {
                                setSelecionado(opcao);
                                setEscolhas([]);
                                setEscolhas2024(listaDefinida ? { lista: [listaDefinida] } : {});
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
                            <p>{selecionado.descricao}</p>
                            {selecionado.requisito.tipo && <p>Requisito: {selecionado.requisito.requisito?.join(' ou ')} {selecionado.requisito.valor ?? ''}</p>}
                            <div className="talento-escolhas">
                            {campos.map(campo => <fieldset className="talento-escolha" key={campo.chave}><legend>{campo.rotulo}</legend>
                                {campo.chave === 'lista' && listaDefinida ? <p className="talento-campo-fixo">{listaDefinida} · Definida pela origem</p> :
                                Array.from({ length: campo.quantidade }, (_, i) => <label key={i}>{campo.rotulo} {i + 1}
                                    {regra?.nomeExibicao === 'Iniciado em Magia' && ['truques', 'magias'].includes(campo.chave) ?
                                    <button type="button" className="talento-configurar" aria-label={escolhas2024[campo.chave]?.[i]?.replace(/^2024: /, '') ?? (campo.chave === 'truques' ? `Escolher truque ${i + 1}` : 'Escolher magia de 1º círculo')} disabled={!escolhas2024.lista?.[0]} onClick={() => setSeletorMagia({ chave: campo.chave, indice: i,
                                        opcoes: campo.opcoes.filter(v => !(escolhas2024[campo.chave] ?? []).some((escolhida, indice) => indice !== i && escolhida === v)),
                                        rotulo: campo.chave === 'truques' ? `Escolher truque ${i + 1}` : 'Escolher magia de 1º círculo' })}>
                                        {escolhas2024[campo.chave]?.[i]?.replace(/^2024: /, '') ?? (campo.chave === 'truques' ? `Escolher truque ${i + 1}` : 'Escolher magia de 1º círculo')}
                                    </button> : <select value={escolhas2024[campo.chave]?.[i] ?? ''} onChange={e => {
                                        const valores = [...(escolhas2024[campo.chave] ?? [])]; valores[i] = e.target.value;
                                        setEscolhas2024(prev => campo.chave === 'lista' ? { ...prev, lista: valores, truques: [], magias: [] } : { ...prev, [campo.chave]: valores });
                                    }}><option value="">Selecione...</option>{campo.opcoes.map(v => <option key={v} value={v}>{v.replace(/^2024: /, '')}</option>)}</select>}
                                </label>)}
                            </fieldset>)}
                            </div>
                            {seletorMagia && createPortal(<div className="popup talento-magia-popup"><ModalMagias titulo={seletorMagia.rotulo} magiaSelect={null}
                                selecaoDirigida={{ edicao: selecionado.edicao, opcoes: seletorMagia.opcoes, descricao: `${escolhas2024.lista?.[0]} · ${seletorMagia.chave === 'truques' ? 'Truques' : '1º círculo'}` }}
                                onClose={() => setSeletorMagia(null)} onSelect={nome => {
                                    const ref = seletorMagia.opcoes.find(v => v.replace(/^2024: /, '') === nome);
                                    if (!ref) return false;
                                    const valores = [...(escolhas2024[seletorMagia.chave] ?? [])]; valores[seletorMagia.indice] = ref;
                                    setEscolhas2024(prev => ({ ...prev, [seletorMagia.chave]: valores })); return true;
                                }} /></div>, document.body)}
                            {Array.from({ length: quantidade }, (_, i) => <label key={i}>Escolha adicional {i + 1}
                                <select aria-invalid={!!erro} aria-describedby={erro ? "erro-talento" : undefined} value={escolhas[i] ?? ''} onChange={e => setEscolhas(Array.from({ length: quantidade }, (_, j) => j === i ? e.target.value : escolhas[j] ?? ''))}>
                                    <option value="">Selecione...</option>
                                    {(selecionado.escolha === 'atributo-agarrador' ? ['forca', 'destreza'] : treinamentosTalento).map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </label>)}
                            {erro && <p id="erro-talento" role="status">{erro}</p>}
                        </>
                    )}
                </div>
            </div>

            <div className="popup-footer">
                {selecionado && (<button className="escolher-button" aria-describedby={erro ? "erro-talento" : undefined} disabled={!!erro} onClick={() => { if (!erro && onSelect(selecionado, escolhasConfirmadas) !== false) onClose(); }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoTalento;
