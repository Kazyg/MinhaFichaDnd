import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import type { TalentoConteudo } from '../../api/rulesets/types';
import { rotuloConteudo } from '../../api/rulesets/conteudo';
import { treinamentosTalento } from '../../api/fichaPersonagem/talentosConteudo';

interface ModalSelecaoProps {
    opcoes: TalentoConteudo[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: TalentoConteudo, escolhas: string[]) => boolean | void;
    talentoInicial: TalentoConteudo | null;
    escolhasIniciais?: string[];
    validar?: (opcao: TalentoConteudo, escolhas: string[]) => string | null;
}

const ModalSelecaoTalento: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, talentoInicial, escolhasIniciais = [], validar }) => {
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<TalentoConteudo | null>(talentoInicial || null);
    const [escolhas, setEscolhas] = useState<string[]>(escolhasIniciais);
    const quantidade = selecionado?.escolha === 'treinamentos' ? 3 : selecionado?.escolha === 'atributo-agarrador' ? 1 : 0;
    const erro = !selecionado ? 'Escolha um talento.' : !opcoes.some(t => t.id === selecionado.id && t.revisao === selecionado.revisao) ? 'Opção indisponível.' :
        !selecionado.suportado ? 'Implementação pendente.' : escolhas.filter(Boolean).length !== quantidade ? 'Complete as escolhas adicionais.' : validar?.(selecionado, escolhas);

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
                            <p><a href={`${process.env.PUBLIC_URL}/CONTEUDO-LICENCAS.txt`} target="_blank" rel="noreferrer">Atribuições e licenças do conteúdo</a></p>
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
                {selecionado && (<button className="escolher-button" aria-describedby={erro ? "erro-talento" : undefined} disabled={!!erro} onClick={() => { if (!erro && onSelect(selecionado, escolhas) !== false) onClose(); }}>Escolher {selecionado.nome}</button>)}
                <button className="escolher-button" onClick={() => { onClose() }}>Fechar</button>
            </div>
        </AccessibleDialog>
    );
};

export default ModalSelecaoTalento;
