import React, { useState } from "react";
import iconClass from "../imagens/icon_class.png"
import iconRaca from "../imagens/icon_ancestry.png"
import "../pages/css/CriacaoFicha.css";
import "../pages/css/ModalRacas.css";
import ModalSelecaoClasse from "../pages/modals/ModalSelecaoClasse.tsx";
import ModalSelecaoSubClasse from "../pages/modals/ModalSelecaoSubClasse.tsx";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";
import CaracteristicasClasse from "./components/CaracteristicasClasseProps.tsx";
import { SubClasses } from "../api/classesPrincipais/SubClasses.ts";
import { CaminhoGuerreiroTotemico } from "../api/classesClassesNetos/CaminhoGuerreiroTotemico.ts"
import { CirculoDaTerra } from "../api/classesClassesNetos/CirculoDaTerra.ts";
import { Classes } from "../api/classesPrincipais/Classes.class.ts";
import { Efeitos } from "../api/classesPrincipais/Efeitos.ts";
import { Ranger } from "../api/classesClassesFilhos/Ranger.class.ts"
import { Rogue } from "../api/classesClassesFilhos/Rogue.class.ts"
import { Talentos } from "../bibliotecas/Talentos.ts";
import ModalSelecaoTalento from "../pages/modals/ModalSelecaoTalento.tsx";
import TalentoDescricao from "./components/TalendoDescricao.tsx";

const NivelBlock = ({ nivel, classesDisponiveis, selecionarMulticlasse }) => {
    const [modalClasseAberto, setModalClasseAberto] = useState(false);
    const { ficha, refreshKey, forceUpdate } = useFicha();
    const [nivelExpandido, setNivelExpandido] = useState(true);
    const [secoesExpandidas, setSecoesExpandidas] = useState({
        atributos: true,
        tracos: true,
        proeficiencias: true,
        caracteristicas: true,
    });
    const [subGrupoAberto, setSubGrupoAberto] = useState(false);
    const [modalTalentoAberta, setModalTalentoAberto] = useState(false);
    const [subClasses, setSubClasses] = useState<SubClasses[] | null>([]);
    const caminhoGuerreiroTotemico = new CaminhoGuerreiroTotemico();
    const circuloDaTerra = new CirculoDaTerra();
    const [descricaoExpandida, setDescricaoExpandida] = useState<boolean>(false);
    const [classeBonus, setClasseBonus] = useState(false);
    const [periciaBardo, setPericiaBardo] = useState("");
    const [periciaPatrulheiro, setPericiaPatrulheiro] = useState("");
    const [periciaLadino, setPericiaLadino] = useState("");
    const [instrumentoSelecionado, setInstrumentoSelecionado] = useState("");
    const [selecionado, setSelecionado] = useState("");
    const ranger = new Ranger();
    const rogue = new Rogue();
    type Talento = {
        nome: string;
        requisito: {tipo: string | null, requisito: string[] | null, valor: number | null}
        bonus: {tipo: string | null, condicao: string | null, bonus: string[] | null; valor: number | null}[]
        descricao: string;
    };
    const talentos: Talento[] = Talentos;
    const atributos = ["força", "destreza", "constituição", "inteligência", "sabedoria", "carisma"];
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

    const toggleNivel = () => setNivelExpandido(!nivelExpandido);
    const toggleSecao = (secao) => {
        setSecoesExpandidas((prev) => ({
            ...prev,
            [secao]: !prev[secao],
        }));
    };

    const handleSelecionarOpcao = (opcao: string) => {
        ficha?.substituirOuAdicionarAnimal(opcao, calcularNivelClasse(nivel));
        forceUpdate();
    };

    const classeNoNivel = ficha?.multiclasses?.find(m => m.nivelEscolhido.includes(nivel));

    const getAtributo = (atributo) => atributo ? atributo.valor ?? 0 : 0;

    const classesPermitidas = classesDisponiveis.filter(c => {
        if (c.nome === ficha?.classePrincipal?.nome) return true;
        switch (c.nome) {
            case "Bárbaro": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13;
            case "Bardo": case "Bruxo": case "Feiticeiro": return getAtributo(ficha?.atributosPersonagem?.carisma) >= 13;
            case "Clérigo": case "Druida": return getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            case "Guerreiro": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13 || getAtributo(ficha?.atributosPersonagem?.destreza) >= 13;
            case "Ladino": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13;
            case "Mago": return getAtributo(ficha?.atributosPersonagem?.inteligencia) >= 13;
            case "Monge": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13 && getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            case "Paladino": return getAtributo(ficha?.atributosPersonagem?.forca) >= 13 && getAtributo(ficha?.atributosPersonagem?.carisma) >= 13;
            case "Patrulheiro": return getAtributo(ficha?.atributosPersonagem?.destreza) >= 13 && getAtributo(ficha?.atributosPersonagem?.sabedoria) >= 13;
            default: return false;
        }
    });

    const opcoesAmbientes = [
        "Ártico",
        "Costa",
        "Deserto",
        "Floresta",
        "Montanha",
        "Pântano",
        "Planície",
        "Subterrâneo",
    ];

    const calcularNivelClasse = (nivelAtual: number): number => {
        let nivelClasse = 0;
        const niveisEscolhidos = ficha?.multiclasses?.find(m => m.classe.nome === classeNoNivel?.classe.nome)?.nivelEscolhido.sort((a, b) => a - b) ?? [];

        for (const nivel of niveisEscolhidos) {
            if (nivel <= nivelAtual) {
                nivelClasse++;
            } else {
                break;
            }
        }

        return nivelClasse;
    };

    const abrirSubGrupo = () => {
        if (classeNoNivel?.classe?.subClasse) {
            if (classeNoNivel?.classe.subClasse.length > 0) {
                setSubClasses(classeNoNivel?.classe.subClasse);
                setSubGrupoAberto(true);
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        ficha?.setTerrenoSelecionado(event.target.value);
        forceUpdate();
    };

    const textoSubclasse = () => {
        switch (classeNoNivel?.classe.nome.toLowerCase()) {
            case "patrulheiro":
                return "Conclave de Patrulheiro";
            case "bárbaro":
            case "barbaro":
                return "seu Caminho Primitivo";
            case "bardo":
                return "seu Colégio de Bardo";
            case "bruxo":
                return "sua Dádiva do Pacto"
            case "druida":
                return "seu Círculo Druídico";
            case "feiticeiro":
                return "sua Origem de Feitiçaria";
            case "guerreiro":
                return "seu Arquétipo Marcial";
            case "ladino":
                return "seu Arquétipo de Ladino";
            case "mago":
                return "sua Tradição Arcana";
            case "monge":
                return "sua Tradição Monástica";
            case "paladino":
                return "seu Juramento Sagrado";
            default:
                return "Classe não encontrada ou sem subclasse definida.";
        }
    }

    function validaSubClasse(classe, nivel) {
        // Converte a classe para minúsculas para evitar problemas de case sensitivity
        classe = classe?.toLowerCase();

        // Verifica as condições
        const condicao1 = (classe === "feiticeiro" || classe === "clérigo" || classe === "bruxo") && nivel === 1;
        const condicao2 = (classe === "druida" || classe === "mago") && nivel === 2;
        const condicao3 = nivel === 3 && !["feiticeiro", "clérigo", "bruxo", "druida", "mago"].includes(classe);

        // Retorna true se qualquer uma das condições for verdadeira
        return condicao1 || condicao2 || condicao3;
    }

    function verificarBonusClasse(classe: Classes) {
        if (ficha?.multiclasses?.find(m => m.classe.nome === classe.nome)?.nivelClasse === 1 &&
            (classe.nome === "Ladino" || classe.nome === "Patrulheiro" || classe.nome === "Bardo")) {
            setClasseBonus(true);
        }
    }

    function validaClasseNoNivel(classe: Classes | undefined) {
        if (classe !== undefined) {
            return classesPermitidas.some(c => c.nome === classe?.nome);
        } else {
            return true;
        }
    }

    function validaIncrementoAtributo(classe: Classes | undefined) {
        let classeIncremento = classe?.niveis.find(c => c.caracteristicas.includes("Incremento no Valor de Habilidade"))
        if (classe === undefined) return false;
        else if (classeIncremento?.nivel === calcularNivelClasse(nivel)) {
            return true
        } else {
            return false
        }
    }

    return (
        <>
            <div id="div-level-container" key={refreshKey} className={`level-container ${validaClasseNoNivel(classeNoNivel?.classe) ? "" : "incorreto"}`}>
                <button className="secao-toggle" onClick={toggleNivel}>
                    <h2 className="tituloh2">Nível {nivel}{nivelExpandido ? "▲" : "▼"}</h2>
                </button>
                {nivelExpandido && (
                    <>
                        <button title={validaClasseNoNivel(classeNoNivel?.classe) ? "" : "ESTA CLASSE NÃO É PERMITIDA PARA OS SEUS STATUS ATUAIS"} className="botao-distribuir" onClick={() => setModalClasseAberto(true)}>
                            <img src={iconClass} className="button-icon" alt="Classe" />
                            <div className="botao-texto">
                                <span>Selecionar Classe</span>
                                <strong>{classeNoNivel?.classe.nome || "Selecionar Classe"}</strong>
                            </div>
                        </button>
                        {validaSubClasse(classeNoNivel?.classe.nome, calcularNivelClasse(nivel)) && (
                            <>
                                <button className="botao-distribuir" onClick={() => abrirSubGrupo()}>
                                    <img src={iconClass} className="button-icon" alt="Classe" />
                                    <div className="botao-texto">
                                        <span>Selecionar {textoSubclasse()}</span>
                                        <strong>{ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel?.classe.nome)?.subclasse.nome || "Selecionar " + textoSubclasse()}</strong>
                                    </div>
                                </button>
                            </>
                        )}
                        {validaIncrementoAtributo(classeNoNivel?.classe) && (
                            <>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!ficha?.efeitos?.find(e => e.tituloEfeito === `selecionadoAtributo${nivel}`)}
                                        onChange={() => {
                                            setSelecionado(selecionado === "Atributo" ? "" : "Atributo");
                                            ficha?.excluirEfeitoPorTitulo(`TalentoEscolhido${nivel}`);
                                            ficha?.excluirEfeitoPorTitulo(`selecionadoTalento${nivel}`)
                                            let efeito = new Efeitos();
                                            efeito.setTituloEfeito(`selecionadoAtributo${nivel}`);
                                            efeito.setLevel(nivel);
                                            ficha?.setEfeitos(efeito);
                                        }}
                                    />
                                    Atributo
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!ficha?.efeitos?.find(e => e.tituloEfeito === `selecionadoTalento${nivel}`)}
                                        onChange={() => {
                                            setSelecionado(selecionado === "Talento" ? "" : "Talento");
                                            ficha?.excluirEfeitoPorTitulo(`selecionadoAtributo${nivel}`)
                                            let efeito = new Efeitos();
                                            efeito.setTituloEfeito(`selecionadoTalento${nivel}`);
                                            efeito.setLevel(nivel);
                                            ficha?.setEfeitos(efeito);
                                            ficha?.excluirEfeitoPorTitulo(`atributo1Classe${classeNoNivel?.classe.nome}${nivel}`);
                                            ficha?.excluirEfeitoPorTitulo(`atributo2Classe${classeNoNivel?.classe.nome}${nivel}`);
                                        }}
                                    />
                                    Talento
                                </label>
                                {!!ficha?.efeitos?.find(e => e.tituloEfeito === `selecionadoAtributo${nivel}`) && (
                                    <>
                                        <select
                                            value={ficha.efeitos.find(e => e.tituloEfeito === `atributo1Classe${classeNoNivel?.classe.nome}${nivel}`)?.atributo}
                                            onChange={(e) => {
                                                ficha?.excluirEfeitoPorTitulo(`atributo1Classe${classeNoNivel?.classe.nome}${nivel}`);
                                                let efeito = new Efeitos();
                                                efeito.setAtributo(e.target.value);
                                                efeito.setBonus(1);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito(`atributo1Classe${classeNoNivel?.classe.nome}${nivel}`);
                                                efeito.setClasseNome(classeNoNivel?.classe.nome ?? "");
                                                ficha?.setEfeitos(efeito);
                                                forceUpdate();
                                            }}
                                        >
                                            <option value="">Selecione um atributo</option>
                                            {atributos.map((atributo) => (
                                                <option key={atributo} value={atributo}>
                                                    {atributo}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={ficha.efeitos.find(e => e.tituloEfeito === `atributo2Classe${classeNoNivel?.classe.nome}${nivel}`)?.atributo}
                                            onChange={(e) => {
                                                ficha?.excluirEfeitoPorTitulo(`atributo2Classe${classeNoNivel?.classe.nome}${nivel}`);
                                                let efeito = new Efeitos();
                                                efeito.setAtributo(e.target.value);
                                                efeito.setBonus(1);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito(`atributo2Classe${classeNoNivel?.classe.nome}${nivel}`);
                                                efeito.setClasseNome(classeNoNivel?.classe.nome ?? "");
                                                ficha?.setEfeitos(efeito);
                                                forceUpdate();
                                            }}
                                        >
                                            <option value="">Selecione um atributo</option>
                                            {atributos.map((atributo) => (
                                                <option key={atributo} value={atributo}>
                                                    {atributo}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                {!!ficha?.efeitos?.find(e => e.tituloEfeito === `selecionadoTalento${nivel}`) && (
                                    <>
                                        <button className="botao-selecao-talento" onClick={() => setModalTalentoAberto(true)}>
                                            <img src={iconRaca} className="button-icon" alt="HumanoFeat" />
                                            <div className="botao-texto">
                                                <span>Selecionar Talento</span>
                                                <strong>{ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`) ? ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.talento : "Selecionar Talento"}</strong>
                                            </div>
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        {classeBonus && (
                            <>
                                {classeNoNivel?.classe.nome === "Bardo" && (
                                    <>
                                        <select
                                            value={periciaBardo}
                                            onChange={(e) => {
                                                setPericiaBardo(e.target.value);
                                                ficha?.excluirEfeitoPorTitulo("periciaBardoMulticlasse");
                                                let efeito = new Efeitos();
                                                efeito.setPericia(e.target.value);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito("periciaBardoMulticlasse");
                                                efeito.setClasseNome("Bardo");
                                                ficha?.setEfeitos(efeito);
                                            }}
                                        >
                                            <option value="">Selecione uma perícia</option>
                                            {pericias.map((pericia) => (
                                                <option key={pericia} value={pericia}>
                                                    {pericia}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={instrumentoSelecionado}
                                            onChange={(e) => {
                                                setInstrumentoSelecionado(e.target.value)
                                                ficha?.excluirEfeitoPorTitulo("instrumentoBardoMulticlasse");
                                                let efeito = new Efeitos();
                                                efeito.setProeficienciasBackGround([e.target.value]);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito("instrumentoBardoMulticlasse");
                                                efeito.setClasseNome("Bardo");
                                                ficha?.setEfeitos(efeito);
                                            }}
                                        >
                                            <option value="">Selecione um instrumento musical</option>
                                            {instrumentosMusicais.map((instrumento) => (
                                                <option key={instrumento} value={instrumento}>
                                                    {instrumento}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                {classeNoNivel?.classe.nome === "Patrulheiro" && (
                                    <>
                                        <select
                                            value={periciaPatrulheiro}
                                            onChange={(e) => {
                                                setPericiaPatrulheiro(e.target.value);
                                                ficha?.excluirEfeitoPorTitulo("periciaPatrulheiroMulticlasse");
                                                let efeito = new Efeitos();
                                                efeito.setPericia(e.target.value);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito("periciaPatrulheiroMulticlasse");
                                                efeito.setClasseNome("Patrulheiro");
                                                ficha?.setEfeitos(efeito);
                                            }}
                                        >
                                            <option value="">Selecione uma perícia</option>
                                            {ranger.habilidades.map((pericia) => (
                                                <option key={pericia} value={pericia}>
                                                    {pericia}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                                {classeNoNivel?.classe.nome === "Ladino" && (
                                    <>
                                        <select
                                            value={periciaLadino}
                                            onChange={(e) => {
                                                setPericiaLadino(e.target.value);
                                                ficha?.excluirEfeitoPorTitulo("periciaLadinoMulticlasse");
                                                let efeito = new Efeitos();
                                                efeito.setPericia(e.target.value);
                                                efeito.setLevel(nivel);
                                                efeito.setTituloEfeito("periciaLadinoMulticlasse");
                                                efeito.setClasseNome("Ladino");
                                                ficha?.setEfeitos(efeito);
                                            }}
                                        >
                                            <option value="">Selecione uma perícia</option>
                                            {rogue.habilidades.map((pericia) => (
                                                <option key={pericia} value={pericia}>
                                                    {pericia}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </>
                        )}
                        {classeNoNivel?.classe && (
                            <div>
                                <button className="secao-toggle" onClick={() => toggleSecao("caracteristicas")}>
                                    <h3 className="tituloh3">Características de Classe Nível {nivel}{secoesExpandidas.caracteristicas ? "▲" : "▼"}</h3>
                                </button>
                                {secoesExpandidas.caracteristicas && (
                                    <div>
                                        {ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel.classe.nome)?.subclasse.nome === "Caminho do Guerreiro Totêmico" && (calcularNivelClasse(nivel) === 3 || calcularNivelClasse(nivel) === 6 || calcularNivelClasse(nivel) === 14) && (
                                            <>
                                                {caminhoGuerreiroTotemico.niveis.find((n) => n.nivel === calcularNivelClasse(nivel) && n.opcoes !== null)?.opcoes?.map((opcao) => (
                                                    <div key={opcao.nome} className="skills-container">
                                                        <label className="flex items-center p-2 border rounded-lg">
                                                            <input
                                                                key={refreshKey}
                                                                type="checkbox"
                                                                checked={ficha?.animalSelecionado?.find((a) => a.nivel === calcularNivelClasse(nivel))?.animal === opcao.nome}
                                                                onChange={() => handleSelecionarOpcao(opcao.nome)}
                                                                className="mr-2"
                                                            />
                                                            {opcao.nome.toLowerCase()}
                                                        </label>
                                                        {ficha?.animalSelecionado?.find((a) => a.nivel === calcularNivelClasse(nivel))?.animal === opcao.nome && (
                                                            <>
                                                                <button
                                                                    onClick={() => { setDescricaoExpandida(!descricaoExpandida) }}
                                                                    className="w-full text-left p-2 border rounded-lg focus:outline-none"
                                                                >
                                                                    {opcao.nome.toLowerCase()} {descricaoExpandida ? "▲" : "▼"}
                                                                </button>
                                                                {descricaoExpandida && (
                                                                    <p className="descricao p-2 border rounded-lg mt-2">{opcao.descricao}</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                ))
                                                }
                                            </>
                                        )}
                                        {ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel.classe.nome)?.subclasse.nome === "Círculo da Terra" &&
                                            calcularNivelClasse(nivel) === 3 && (
                                                <>
                                                    <div className="combobox-container">
                                                        <label htmlFor="ambiente" className="block mb-2 font-medium">
                                                            Selecione um ambiente:
                                                        </label>
                                                        <select
                                                            id="ambiente"
                                                            value={ficha?.terrenoSelecionado ?? ""}
                                                            onChange={handleChange}
                                                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Selecione...</option>
                                                            {opcoesAmbientes.map((ambiente) => (
                                                                <option key={ambiente} value={ambiente}>
                                                                    {ambiente}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                        {ficha?.terrenoSelecionado &&
                                            [3, 5, 7, 9].includes(calcularNivelClasse(nivel)) && classeNoNivel.classe.nome === "Druida" && (
                                                <>
                                                    <p className="mt-4 p-2 bg-gray-100 border rounded-lg">
                                                        Magias do Terreno: <strong>{ficha?.terrenoSelecionado}</strong>
                                                    </p>
                                                    {circuloDaTerra.niveis
                                                        .find((n) => n.nivel === calcularNivelClasse(nivel) && n.magias.length > 0)
                                                        ?.magias.find((m) => m.terreno === ficha?.terrenoSelecionado)
                                                        ?.magias.map((magia, index) => (
                                                            <p key={index} className="descricao p-2 border rounded-lg mt-2" title="Consulte a lista de magias para mais informações">
                                                                {magia}
                                                            </p>
                                                        ))
                                                    }
                                                </>
                                            )
                                        }
                                        <CaracteristicasClasse classe={classeNoNivel?.classe} nivel={calcularNivelClasse(nivel)} />
                                        {!!ficha?.efeitos?.find(e => e.tituloEfeito === `selecionadoTalento${nivel}`) && <TalentoDescricao talento={ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.talento ?? ""} />}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {modalClasseAberto && (
                <>
                    <div className="popup-overlay" onClick={() => setModalClasseAberto(false)}></div>
                    <div className="popup">
                        <ModalSelecaoClasse
                            titulo="Escolha sua Classe"
                            opcoes={classesPermitidas}
                            onClose={() => setModalClasseAberto(false)}
                            onSelect={(classe) => {
                                classe && selecionarMulticlasse(classe, nivel);
                                setModalClasseAberto(false);
                                forceUpdate();
                                classe && verificarBonusClasse(classe);
                            }}
                            classeInicial={classeNoNivel?.classe || null}
                        />
                    </div>
                </>
            )}
            {subGrupoAberto && (
                <>
                    <div className="popup-overlay" onClick={() => setSubGrupoAberto(false)}></div>
                    <div className="popup">
                        <ModalSelecaoSubClasse
                            titulo={"Escolha " + textoSubclasse()}
                            opcoes={subClasses}
                            onClose={() => setSubGrupoAberto(false)}
                            onSelect={(subClasse) => {
                                if (classeNoNivel?.classe && subClasse) {
                                    ficha?.setSubClasse(classeNoNivel?.classe, subClasse);
                                }
                                setSubGrupoAberto(false);
                                forceUpdate();
                            }}
                            subClasseInicial={ficha?.subClasse?.find(s => s.classe === classeNoNivel?.classe)?.subclasse ?? null}
                        />
                    </div>
                </>
            )}
            {modalTalentoAberta && (
                <>
                    <div className="popup-overlay" onClick={() => setModalTalentoAberto(false)}></div>
                    <div className="popup">
                        <ModalSelecaoTalento
                            titulo="Escolha um Talento"
                            opcoes={talentos}
                            onClose={() => setModalTalentoAberto(false)}
                            onSelect={(talento) => {
                                ficha?.excluirEfeitoPorTitulo(`TalentoEscolhido${nivel}`);
                                let efeito = new Efeitos();
                                efeito.setTalento(talento.nome);
                                efeito.setLevel(nivel);
                                efeito.setTituloEfeito(`TalentoEscolhido${nivel}`);
                                ficha?.setEfeitos(efeito);
                                forceUpdate();
                            }}
                            talentoInicial={talentos.find(t => t.nome === ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.talento) ?? null}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default NivelBlock;
