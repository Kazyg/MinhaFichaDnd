import { erroTalento } from '../api/fichaPersonagem/talentosConteudo';
import { efeitosDoAvanco, talentosElegiveis } from '../api/fichaPersonagem/escolhasProgressao';
import AvancoAtributos from './components/AvancoAtributos';
import EscolhasMetamagia from './components/EscolhasMetamagia';
import { chaveClasse, nivelDaClasse, podeSelecionarClasse, recursosNoNivel } from '../api/rulesets/progressao';
import { podeTerSubclasse } from '../api/fichaPersonagem/subclasseElegibilidade';
import React, { useState } from "react";
import iconClass from "../imagens/icon_class.png"
import "../pages/css/CriacaoFicha.css";
import "../pages/css/ModalRacas.css";
import ModalSelecaoClasse from "../pages/modals/ModalSelecaoClasse";
import ModalSelecaoSubClasse from "../pages/modals/ModalSelecaoSubClasse";
import { useFicha } from "../api/fichaPersonagem/FichaContext";
import CaracteristicasClasse from "./components/CaracteristicasClasseProps";
import { SubClasses } from "../api/classesPrincipais/SubClasses";
import { CaminhoGuerreiroTotemico } from "../api/classesClassesNetos/CaminhoGuerreiroTotemico"
import { CirculoDaTerra } from "../api/classesClassesNetos/CirculoDaTerra";
import { Classes } from "../api/classesPrincipais/Classes.class";
import { Efeitos } from "../api/classesPrincipais/Efeitos";
import { Ranger } from "../api/classesClassesFilhos/Ranger.class"
import { Rogue } from "../api/classesClassesFilhos/Rogue.class"
import ModalSelecaoTalento from "../pages/modals/ModalSelecaoTalento";
import TalentoDescricao from "./components/TalendoDescricao";
import ModalSelecaoPatrono from "../pages/modals/ModalSelecaoPatrono";
import { Patronos } from "../api/classesEspeciais/Patronos.class";
import { Corruptor } from "../api/classesEspeciais/Corruptor.class";
import { Arquifada } from "../api/classesEspeciais/Arquifada.class";
import { Celestial } from "../api/classesEspeciais/OCelestial";
import { GrandeAntigo } from "../api/classesEspeciais/GrandeAntigo.class";
import { LaminaMaldita } from "../api/classesEspeciais/LaminaMaldita";
import CaracteristicasPatrono from "./components/CaracteristicasPatronoProps";
import { getRulesetVersion } from "../api/rulesets/regras";

interface NivelBlockProps {
    nivel: number;
    classesDisponiveis: Classes[];
    selecionarMulticlasse: (classeEscolhida: Classes, nivelAtual: number) => void;
}

const NivelBlock: React.FC<NivelBlockProps> = ({ nivel, classesDisponiveis, selecionarMulticlasse }) => {
    const [modalClasseAberto, setModalClasseAberto] = useState(false);
    const [modalPatronoAberto, setModalPatronoAberto] = useState(false);
    const { ficha, forceUpdate } = useFicha();
    const patronoSelecionado = ficha?.patrono;
    const versaoRegras = getRulesetVersion(ficha?.versaoRegras);
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
    const periciaBardo = ficha?.efeitos?.find(e => e.tituloEfeito === 'periciaBardoMulticlasse')?.pericia ?? '';
    const periciaPatrulheiro = ficha?.efeitos?.find(e => e.tituloEfeito === 'periciaPatrulheiroMulticlasse')?.pericia ?? '';
    const periciaLadino = ficha?.efeitos?.find(e => e.tituloEfeito === 'periciaLadinoMulticlasse')?.pericia ?? '';
    const instrumentoSelecionado = ficha?.efeitos?.find(e => e.tituloEfeito === 'instrumentoBardoMulticlasse')?.proeficienciasBackGround?.[0] ?? '';
    const ranger = new Ranger();
    const rogue = new Rogue();
    const patronos: Patronos[] = [
        new Corruptor(),
        new Arquifada(),
        new GrandeAntigo(),
        new LaminaMaldita(),
        new Celestial()
    ]
    const talentos = ficha ? talentosElegiveis(ficha, nivel) : [];
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
    const toggleSecao = (secao: keyof typeof secoesExpandidas) => {
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

    const classesPermitidas = classesDisponiveis.filter(c => ficha && podeSelecionarClasse(ficha, c, nivel));

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

    const calcularNivelClasse = (nivelAtual: number): number => ficha && classeNoNivel ? nivelDaClasse(ficha, classeNoNivel.classe, nivelAtual) : 0;

    const abrirSubGrupo = () => {
        if (classeNoNivel?.classe?.subClasse) {
            if (classeNoNivel?.classe.subClasse.length > 0) {
                setSubClasses(classeNoNivel?.classe.subClasse);
                setSubGrupoAberto(true);
            } else if (classeNoNivel.classe.nome === "bruxo") {

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
                return versaoRegras === 'DND_2024' ? 'seu Patrono' : 'sua Dádiva do Pacto';
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

  function validaSubClasse(classe?: string, nivel?: number) {
    return !!classe && !!nivel && podeTerSubclasse(classe, nivel, versaoRegras);
  }

    const classeBonus = nivel !== 1 && calcularNivelClasse(nivel) === 1 && ['Ladino', 'Patrulheiro', 'Bardo'].includes(classeNoNivel?.classe.nome ?? '');
    const criarEfeitoNivel = () => {
        const efeito = new Efeitos();
        efeito.origemTipo = 'nivel';
        efeito.origemId = `${classeNoNivel?.classe.nome}:${calcularNivelClasse(nivel)}`;
        efeito.classeNome = classeNoNivel?.classe.nome ?? '';
        efeito.nivelClasseOrigem = calcularNivelClasse(nivel);
        return efeito;
    };

    function validaClasseNoNivel(classe: Classes | undefined) {
        if (classe !== undefined) {
            return classesPermitidas.some(c => c.nome === classe?.nome);
        } else {
            return true;
        }
    }

    return (
        <>
            <div id="div-level-container"  className={`level-container ${validaClasseNoNivel(classeNoNivel?.classe) ? "" : "incorreto"}`}>
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
                        <AvancoAtributos key={`${classeNoNivel?.classe.nome}:${calcularNivelClasse(nivel)}`} nivel={nivel} />
                        {classeNoNivel && recursosNoNivel(classeNoNivel.classe, calcularNivelClasse(nivel), versaoRegras).length > 0 && <>
                            <button onClick={() => setModalTalentoAberto(true)}>Selecionar Talento</button>
                            <p>Catálogo parcial: apenas talentos com escolhas implementadas podem ser selecionados. Registros antigos são preservados; opções ausentes permanecem pendentes.</p>
                        </>}
                        {classeBonus && (
                            <>
                                {classeNoNivel?.classe.nome === "Bardo" && (
                                    <>
                                        <select
                                            value={periciaBardo}
                                            onChange={(e) => {
                                                ficha?.excluirEfeitoPorTitulo("periciaBardoMulticlasse");
                                                let efeito = criarEfeitoNivel();
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
                                                ficha?.excluirEfeitoPorTitulo("instrumentoBardoMulticlasse");
                                                let efeito = criarEfeitoNivel();
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
                                                ficha?.excluirEfeitoPorTitulo("periciaPatrulheiroMulticlasse");
                                                let efeito = criarEfeitoNivel();
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
                                                ficha?.excluirEfeitoPorTitulo("periciaLadinoMulticlasse");
                                                let efeito = criarEfeitoNivel();
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
                                        {chaveClasse(classeNoNivel.classe) === 'feiticeiro' && <EscolhasMetamagia nivelClasse={calcularNivelClasse(nivel)} />}
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
                                        {versaoRegras === "DND_2014" && chaveClasse(classeNoNivel.classe) === "bruxo" && calcularNivelClasse(nivel) === 1 && (
                                            <>
                                                <button className="botao-selecao-talento" onClick={() => setModalPatronoAberto(true)}>
                                                    <img src={iconClass} className="button-icon" alt="Patrono" />
                                                    <div className="botao-texto">
                                                        <span>Selecionar Patrono</span>
                                                        <strong>{patronoSelecionado ? patronoSelecionado.nome : "Selecionar Patrono"}</strong>
                                                    </div>
                                                </button>
                                                {modalPatronoAberto && (
                                                    <>
                                                        <div className="popup-overlay" onClick={() => setModalPatronoAberto(false)}></div>
                                                        <div className="popup">
                                                            <ModalSelecaoPatrono
                                                                titulo="Escolha sua Classe"
                                                                opcoes={patronos}
                                                                onClose={() => setModalPatronoAberto(false)}
                                                                onSelect={(patrono) => {
                                                                    ficha?.setPatrono(patrono);
                                                                    setModalPatronoAberto(false);
                                                                    forceUpdate();
                                                                }}
                                                                patronoInicial={ficha?.patrono}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {patronoSelecionado && (
                                                    <>
                                                        <CaracteristicasPatrono patrono={patronoSelecionado} nivel={1} />
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <CaracteristicasClasse classe={classeNoNivel?.classe} nivel={calcularNivelClasse(nivel)} />
                                        {!!ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`) && <TalentoDescricao efeito={ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)} talento={ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.talento ?? ""} />}
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
                            subClasseInicial={ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel?.classe.nome)?.subclasse ?? null}
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
                            onSelect={(talento, escolhas) => {
                                const sucesso = ficha?.selecionarTalentoAvanco(nivel, talento.nome, escolhas);
                                if (sucesso) forceUpdate();
                                return !!sucesso;
                            }}
                            validar={(t, escolhas) => ficha ? erroTalento(ficha, nivel, t, escolhas, undefined, efeitosDoAvanco(ficha, nivel)) : "Ficha indisponível"}
                            escolhasIniciais={ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.escolhasTalento}
                            talentoInicial={talentos.find(t => t.nome === ficha?.efeitos?.find(e => e.tituloEfeito === `TalentoEscolhido${nivel}`)?.talento) ?? null}
                        />
                    </div>
                </>
            )}

        </>
    );
};

export default NivelBlock;
