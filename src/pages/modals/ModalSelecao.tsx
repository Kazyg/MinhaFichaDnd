import AccessibleDialog from "../components/AccessibleDialog";
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import ModalSelecaoTalento from './ModalSelecaoTalento';
import { talentosDisponiveis, erroTalento, selecionarTalentoInicial, EscolhasSelecaoTalento, talentoDoEfeito } from '../../api/fichaPersonagem/talentosConteudo';
import { TalentoConteudo } from '../../api/rulesets/types';
import React, { useState } from "react";
import { Raca } from "../../api/classesPrincipais/Raca.class";
import { MeioElfo } from "../../api/classesFilhos/MeioElfo.class";
import { HumanoVariante } from "../../api/classesFilhos/HumanoVariante.class";
import { Draconato } from "../../api/classesFilhos/Draconato.class";
import { MeioOrc } from "../../api/classesFilhos/MeioOrc.class";

interface ModalSelecaoProps {
    opcoes: Raca[];
    titulo: string;
    onClose: () => void;
    onSelect: (opcao: Raca | null) => void;
    onAtributeSelect: (atributosSelect: string[] | null) => void;
    onFerramentaSelect: (ferramentaSelect: string | null) => void;
    racaInicial: Raca | null;
    atributosIniciais: string[] | null;
    usarRegrasEspeciais2014?: boolean;
    tipoSelecao?: 'raca' | 'subraca';
}

const ModalSelecao: React.FC<ModalSelecaoProps> = ({ opcoes = [], titulo, onClose, onSelect, racaInicial, onAtributeSelect, atributosIniciais, onFerramentaSelect, usarRegrasEspeciais2014 = true, tipoSelecao = 'raca' }) => {
    const { ficha } = useFicha();
    const antigos = ficha?.efeitos?.filter(e => e.tituloEfeito === 'TalentoEscolhidoHumanoVariante') ?? [];
    const [talento, setTalento] = useState<TalentoConteudo | null>(antigos[0] ? talentoDoEfeito(antigos[0]) ?? null : null);
    const [escolhasTalento, setEscolhasTalento] = useState<EscolhasSelecaoTalento>(antigos[0]?.escolhasTalento ?? []);
    const [modalTalento, setModalTalento] = useState(false);
    const ferramentaInicial = ficha?.efeitos?.find(e => e.tituloEfeito === (tipoSelecao === 'subraca' ? 'ferramentaSubRaca' : 'ferramentaClasse'))?.proeficienciasRaca?.[0] ?? null;
    const [filtro, setFiltro] = useState("");
    const [selecionado, setSelecionado] = useState<Raca | null>(racaInicial || null);
    const [atributosSelecionados, setAtributosSelecionados] = useState<string[]>(atributosIniciais || []);
    const [ferramentaSelecionada, setFerramentaSelecionada] = useState<string | null>(ferramentaInicial);
    const [ancestralidadeSelecionada, setAncestralidadeSelecionada] = useState<string>((racaInicial as Draconato)?.ancestralidade ?? "");
    const [periciaHumano, setPericiaHumano] = useState(racaInicial?.pericia?.[0] ?? "");
    const [periciaMeioElfo1, setPericiaMeioElfo1] = useState(racaInicial?.pericia?.[0] ?? "");
    const [periciaMeioElfo2, setPericiaMeioElfo2] = useState(racaInicial?.pericia?.[1] ?? "");

    const atributos = ["força", "destreza", "constituição", "inteligência", "sabedoria", "carisma"];
    const ferramentas = ["ferramentas de ferreiro", "suprimentos de cervejeiro", "ferramentas de pedreiro"];
    const ancestralidade = ["Azul", "Branco", "Bronze", "Cobre", "Latão", "Negro", "Ouro", "Prata", "Verde", "Vermelho"]
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
                novosAtributos = prevAtributos;
            }

            return novosAtributos;
        });
    };



    const atribuirAtributos = (escolhidos: string[], raca: Raca, ancestralidade: string) => {
        let novoSelecionado;

        if (!usarRegrasEspeciais2014) {
            novoSelecionado = selecionado;
        } else if (raca.nome === "Humano Variante") {
            novoSelecionado = new HumanoVariante(escolhidos[0], escolhidos[1], periciaHumano);
        } else if (raca.nome === "Meio-Elfo") {
            novoSelecionado = new MeioElfo(escolhidos[0], escolhidos[1], periciaMeioElfo1, periciaMeioElfo2);
        } else if (raca.nome === "Draconato") {
            novoSelecionado = new Draconato(ancestralidade);
        } else if (raca.nome === "Meio-Orc") {
            novoSelecionado = new MeioOrc("Intimidação")
        } else {
            novoSelecionado = selecionado;
        }

        return novoSelecionado;
    };

    const normalizar = (texto: string) =>
        texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const opcoesFiltradas = opcoes.filter((opcao) =>
        normalizar(opcao.nome).includes(filtro.toLowerCase())
    );

    const especial = usarRegrasEspeciais2014;
    const duplo = especial && ['Humano Variante', 'Meio-Elfo'].includes(selecionado?.nome ?? '');
    const humano = especial && selecionado?.nome === 'Humano Variante';
    const anao = especial && selecionado?.nome === 'Anão';
    const dragao = especial && selecionado?.nome === 'Draconato';
    const periciasSelecionadas = humano ? [periciaHumano].filter(Boolean) : [periciaMeioElfo1, periciaMeioElfo2].filter(Boolean);
    const pendencias: string[] = [];
    if (duplo && atributosSelecionados.length !== 2) pendencias.push('Escolha dois atributos distintos.');
    if (selecionado?.nome === 'Meio-Elfo' && especial && atributosSelecionados.includes('carisma')) pendencias.push('Escolha atributos diferentes de Carisma.');
    if (duplo && periciasSelecionadas.length !== (humano ? 1 : 2)) pendencias.push(`Escolha ${humano ? 'uma perícia' : 'duas perícias distintas'}.`);
    if (anao && !ferramentaSelecionada) pendencias.push('Escolha uma ferramenta.');
    if (dragao && !ancestralidadeSelecionada) pendencias.push('Escolha uma ancestralidade.');
    if (humano && !talento) pendencias.push('Escolha um talento.');
    if (humano && talento && ficha) {
        const erro = erroTalento(ficha, 1, talento, escolhasTalento, undefined, antigos);
        if (erro) pendencias.push(erro);
    }
    const radios = (rotulo: string, valores: string[], valor: string | null, alterar: (v: string) => void) => <fieldset><legend>{rotulo} — {valor ? 1 : 0}/1</legend><div className="racial-grid">{valores.map(v => <label className="racial-card" key={v}><input type="radio" name={rotulo} checked={valor === v} onChange={() => alterar(v)} />{v}</label>)}</div></fieldset>;
    return <AccessibleDialog className="popup-content-modal modal-racial" onClose={onClose} aria-label={titulo}>
        <h2>{titulo}</h2>
        <div className="popup-body-modal">
            <div className="lista-racas"><input aria-label="Filtrar raças..." placeholder="Filtrar raças..." value={filtro} onChange={e => setFiltro(e.target.value)} /><ul>{opcoesFiltradas.map(opcao => <li key={opcao.nome}><button className="selection-option" aria-pressed={selecionado?.nome === opcao.nome} onClick={() => {
                if (selecionado?.nome === opcao.nome) return;
                setSelecionado(opcao); setAtributosSelecionados([]); setFerramentaSelecionada(null); setAncestralidadeSelecionada(''); setPericiaHumano(''); setPericiaMeioElfo1(''); setPericiaMeioElfo2(''); setTalento(null); setEscolhasTalento([]);
            }}>{opcao.nome}</button></li>)}</ul></div>
            <div className="detalhes-raca">{selecionado && <>
                {(duplo || anao || dragao) && <section className="personalizacao-racial" aria-label="Personalização Racial"><h3>Personalização Racial</h3>
                    {duplo && <>
                        <fieldset><legend>Atributos — {atributosSelecionados.length}/2</legend><div className="racial-grid">{atributos.map(a => <button key={a} aria-pressed={atributosSelecionados.includes(a)} disabled={(selecionado.nome === 'Meio-Elfo' && a === 'carisma') || (atributosSelecionados.length === 2 && !atributosSelecionados.includes(a))} onClick={() => handleAtributoChange(a)}>{a}{atributosSelecionados.includes(a) ? ' +1' : ''}</button>)}</div></fieldset>
                        <fieldset><legend>Perícias — {periciasSelecionadas.length}/{humano ? 1 : 2}</legend><div className="racial-grid">{pericias.map(p => <button key={p} aria-pressed={periciasSelecionadas.includes(p)} disabled={!periciasSelecionadas.includes(p) && periciasSelecionadas.length === (humano ? 1 : 2)} onClick={() => {
                            const novas = periciasSelecionadas.includes(p) ? periciasSelecionadas.filter(v => v !== p) : [...periciasSelecionadas, p];
                            if (humano) setPericiaHumano(novas[0] ?? ''); else { setPericiaMeioElfo1(novas[0] ?? ''); setPericiaMeioElfo2(novas[1] ?? ''); }
                        }}>{p}</button>)}</div></fieldset>
                    </>}
                    {anao && radios('Escolha uma ferramenta', ferramentas, ferramentaSelecionada, setFerramentaSelecionada)}
                    {dragao && radios('Escolha uma ancestralidade', ancestralidade, ancestralidadeSelecionada, setAncestralidadeSelecionada)}
                    {humano && <fieldset><legend>Talento — {talento ? 1 : 0}/1</legend><button onClick={() => setModalTalento(true)}>{talento?.nome ?? 'Selecionar Talento'}</button></fieldset>}
                    <div role="status">{pendencias.length ? pendencias.join(' ') : 'Todas as escolhas foram concluídas.'}</div>
                </section>}
                <section aria-label="Características Raciais"><h3>Características Raciais</h3><h4>{selecionado.nome}</h4>
                    <details open><summary>Informações gerais</summary><p>Tamanho: {selecionado.tamanho}</p><p>Deslocamento: {selecionado.velocidade} pés</p><p>Idiomas: {selecionado.idiomas?.join(', ')}</p><p>Bônus: {selecionado.atributos?.atributo.map((a, i) => `${a} +${selecionado.atributos?.bonus[i]}`).join(', ')}</p></details>
                    {selecionado.tracos?.map((t, i) => <details key={i}><summary>{t.traco}</summary><p>{t.descricao}</p></details>)}
                </section>
            </>}</div>
        </div>
        <div className="popup-footer"><button className="escolher-button" disabled={!selecionado || !!pendencias.length} onClick={() => {
            if (!selecionado || pendencias.length) return;
            const nova = atribuirAtributos(atributosSelecionados, selecionado, ancestralidadeSelecionada);
            if (tipoSelecao === 'raca' || duplo) onAtributeSelect(atributosSelecionados);
            onSelect(nova);
            onFerramentaSelect(ferramentaSelecionada);
            if (humano && ficha && talento) selecionarTalentoInicial(ficha, 'TalentoEscolhidoHumanoVariante', talento.nome, escolhasTalento);
            onClose();
        }}>Escolher {selecionado?.nome}</button><button className="escolher-button" onClick={onClose}>Fechar</button></div>
        {modalTalento && ficha && <div className="popup racial-talento"><ModalSelecaoTalento ficha={ficha} titulo="Escolha seu talento" opcoes={talentosDisponiveis(ficha, 1, undefined, antigos)} talentoInicial={talento} escolhasIniciais={escolhasTalento} validar={(t, e) => erroTalento(ficha, 1, t, e, undefined, antigos)} onClose={() => setModalTalento(false)} onSelect={(t, e) => { setTalento(t); setEscolhasTalento(e); }} /></div>}
    </AccessibleDialog>;
};
export default ModalSelecao;
