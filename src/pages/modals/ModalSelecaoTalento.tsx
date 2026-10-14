import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import type { TalentoConteudo } from '../../api/rulesets/types';
import { rotuloConteudo } from '../../api/rulesets/conteudo';
import { treinamentosTalento, EscolhasSelecaoTalento } from '../../api/fichaPersonagem/talentosConteudo';
import { camposTalento } from '../../bibliotecas/Catalogo2024';
import { talento2024, validarEscolhasTalento, proficiencia2024 } from '../../api/fichaPersonagem/talentos2024Utils';
import type { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';

interface ModalSelecaoProps {
    ficha?: Ficha | null;
    opcoes: TalentoConteudo[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: TalentoConteudo, escolhas: EscolhasSelecaoTalento) => boolean | void;
    talentoInicial: TalentoConteudo | null;
    escolhasIniciais?: EscolhasSelecaoTalento;
    validar?: (opcao: TalentoConteudo, escolhas: EscolhasSelecaoTalento) => string | null;
}

const ModalSelecaoTalento: React.FC<ModalSelecaoProps> = ({ ficha, opcoes = [], titulo, onClose, onSelect, talentoInicial, escolhasIniciais = [], validar }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<TalentoConteudo | null>(talentoInicial || null);
    const [escolhas, setEscolhas] = useState<string[]>(Array.isArray(escolhasIniciais) ? escolhasIniciais : []);
    const [escolhas2024, setEscolhas2024] = useState<Record<string, string[]>>(Array.isArray(escolhasIniciais) ? {} : escolhasIniciais);
    const regra = selecionado?.phb && talento2024(selecionado.nome);
    const campos = regra ? camposTalento(regra, escolhas2024, proficiencia2024(ficha)) : [];
    const escolhasConfirmadas = regra ? escolhas2024 : escolhas;
    const quantidade = selecionado?.escolha === 'treinamentos' ? 3 : selecionado?.escolha === 'atributo-agarrador' ? 1 : 0;
    const erro = !selecionado ? 'Escolha um talento.' : !opcoes.some(t => t.id === selecionado.id && t.revisao === selecionado.revisao) ? 'Opção indisponível.' :
        !selecionado.suportado ? 'Implementação pendente.' : regra ? (validar ? validar(selecionado, escolhas2024) : validarEscolhasTalento(regra, escolhas2024, ficha, ficha?.levelTotal ?? 1)[0]) : escolhas.filter(Boolean).length !== quantidade ? 'Complete as escolhas adicionais.' : validar?.(selecionado, escolhas);

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes.filter((opcao) =>
        normalizar(opcao.nome).includes(normalizar(filtro))
    );

    return (
        <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label={titulo}>
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
                                setEscolhas2024({});
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
                            <p>{rotuloConteudo(selecionado)} · {selecionado.categoria} · {selecionado.repetivel ? 'Repetível' : 'Não repetível'}</p>
                            <p>Requisito: {selecionado.requisito.requisito?.join(' ou ') ?? 'Nenhum'} {selecionado.requisito.valor ?? ''}</p>
                            {selecionado.fonte.url && <a href={selecionado.fonte.url} target="_blank" rel="noreferrer">{selecionado.fonte.titulo}</a>}
                            {campos.map(campo => <fieldset key={campo.chave}><legend>{campo.rotulo}</legend>
                                {Array.from({ length: campo.quantidade }, (_, i) => <label key={i}>{campo.rotulo} {i + 1}
                                    <select value={escolhas2024[campo.chave]?.[i] ?? ''} onChange={e => {
                                        const valores = [...(escolhas2024[campo.chave] ?? [])]; valores[i] = e.target.value;
                                        setEscolhas2024(prev => campo.chave === 'lista' ? { ...prev, lista: valores, truques: [], magias: [] } : { ...prev, [campo.chave]: valores });
                                    }}><option value="">Selecione...</option>{campo.opcoes.map(v => <option key={v} value={v}>{v.replace(/^2024: /, '')}</option>)}</select>
                                </label>)}
                            </fieldset>)}
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
