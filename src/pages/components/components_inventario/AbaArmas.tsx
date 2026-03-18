import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import noProficienciaIcon from "../../../imagens/swords_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import proficienciaIcon from "../../../imagens/swords_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import "../../css/ArmaInventario.css"
import { toast } from "react-toastify";
import { Armas } from "../../../api/equipamentos/Armas.ts";
import { calcularValorAtributoFinal, listarEfeitosAtivos } from "../../../api/fichaPersonagem/fichaEfeitosUtils.ts";

interface AbaArmasProps {
    setModalAberto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AbaArmas({ setModalAberto }: AbaArmasProps) {
    const { ficha, refreshKey, forceUpdate } = useFicha();
    const proficienciaArmaSimples = verificarProficiencias("armas simples", coletarProeficiencias(ficha?.efeitos));
    const proficienciaArmaMarciais = verificarProficiencias("armas marciais", coletarProeficiencias(ficha?.efeitos));
    const proficienciaArmaExoticas = verificarProficiencias("armas exoticas", coletarProeficiencias(ficha?.efeitos));
    const bonusDanoItens = listarEfeitosAtivos(ficha)
        .filter((efeito) => efeito.tipoEfeito === "dano_arma" || efeito.arma === "dano_arma")
        .reduce((acc, efeito) => acc + (efeito.bonus ?? 0), 0);

    const descricoesPropriedades: Record<string, string> = {
        acuidade: "Você pode usar Força ou Destreza nas jogadas de ataque e dano, usando o maior modificador.",
        leve: "Ideal para combate com duas armas e mais fácil de manejar.",
        arremesso: "Pode ser usada em combate à distância dentro do alcance indicado.",
        versatil: "Pode ser usada com uma ou duas mãos; o valor entre parênteses é o dano com duas mãos.",
        pesada: "Criatura Pequena tem desvantagem ao atacar com esta arma.",
        "duas maos": "Exige as duas mãos para atacar com a arma.",
        alcance: "Permite atacar alvos mais distantes no corpo a corpo.",
        municao: "Consome munição para ser usada e informa alcance normal e longo.",
        recarga: "Limita a quantidade de ataques por turno sem gastar ação para recarregar.",
        especial: "Possui uma regra especial que depende da descrição completa do item.",
    };

    function coletarProeficiencias(efeitos: any[] | null | undefined) {
        const proficienciasPersonagem = new Set<string>();
        if (efeitos) {
            efeitos.forEach(efeito => {
                if (efeito.proeficienciasBackGround) {
                    efeito.proeficienciasBackGround.forEach((proficiencia: string) => {
                        proficienciasPersonagem.add(normalizarString(proficiencia));
                    });
                }
                if (efeito.proeficienciasClasse) {
                    efeito.proeficienciasClasse.forEach((proficiencia: string) => {
                        proficienciasPersonagem.add(normalizarString(proficiencia));
                    });
                }
                if (efeito.proeficienciasRaca) {
                    efeito.proeficienciasRaca.forEach((proficiencia: string) => {
                        proficienciasPersonagem.add(normalizarString(proficiencia));
                    });
                }
                if (efeito.proficienciasMulticlasse) {
                    efeito.proficienciasMulticlasse.forEach((proficiencia: string) => {
                        proficienciasPersonagem.add(normalizarString(proficiencia));
                    });
                }
            });
        }

        return proficienciasPersonagem;
    }

    function verificarProficiencias(arma: string, proficienciasPersonagem: Set<string>) {

        return proficienciasPersonagem.has(normalizarString(arma));
    }

    function normalizarString(str: string) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function calcularModificador(valor: number) {
        const num = Number(valor);
        if (Number.isNaN(num)) return 0;
        return Math.floor((num - 10) / 2);
    }

    function obterMelhorAtributo(arma: Armas) {
        const atributos = arma.dano_atributo.map((atributo) => {
            const atributoNormalizado = normalizarString(atributo);
            const valor = calcularValorAtributoFinal(ficha, atributoNormalizado);
            return {
                nome: atributo,
                modificador: calcularModificador(valor),
            };
        });

        return atributos.sort((a, b) => b.modificador - a.modificador)[0] ?? { nome: "Força", modificador: 0 };
    }

    function formatarBonus(valor: number) {
        if (!valor) return "";
        return valor > 0 ? ` +${valor}` : ` ${valor}`;
    }

    function obterResumoDano(arma: Armas) {
        const atributo = obterMelhorAtributo(arma);
        const danoBase = arma.dano.dano_1 || "0";
        const bonusAtributo = atributo.modificador;
        const totalBonus = bonusAtributo + bonusDanoItens;
        const dadoMatch = danoBase.match(/d(\d+)/i);
        const dadoIcone = dadoMatch ? `/icon_d${dadoMatch[1]}.png` : "/icon_d4.png";

        return {
            formula: `${danoBase}${formatarBonus(totalBonus)}`,
            atributo: atributo.nome,
            detalhe: `${danoBase}${formatarBonus(bonusAtributo)}${bonusDanoItens ? formatarBonus(bonusDanoItens) : ""}`,
            tipo: arma.dano_tipo,
            base: danoBase,
            dadoIcone,
        };
    }

    function obterBadgesPropriedades(propriedades: string) {
        return propriedades
            .split(",")
            .map((propriedade) => propriedade.trim())
            .filter(Boolean)
            .map((propriedade) => {
                const nomeBase = propriedade.split("(")[0].trim();
                const chave = normalizarString(nomeBase);
                return {
                    label: nomeBase,
                    texto: propriedade,
                    descricao: descricoesPropriedades[chave] ?? propriedade,
                };
            });
    }

    function obterBadgeCategoria(categoria: string) {
        const chave = normalizarString(categoria);
        if (chave.includes("marcia")) {
            return { label: "Marcial", descricao: "Arma marcial" };
        }
        if (chave.includes("simples")) {
            return { label: "Simples", descricao: "Arma simples" };
        }
        return { label: categoria, descricao: categoria };
    }

    function obterBadgeAlcance(arma: Armas) {
        return arma.distancia === "sim"
            ? { label: "Ranged", descricao: "Ataque à distância" }
            : { label: "Melee", descricao: "Corpo a corpo" };
    }

    function equiparDesequiparArmadura(equipamento: Armas) {
        if (!!ficha?.ArmaEquipada?.find(a => a.id === equipamento.id)) {
            ficha?.setDesequiparArma(equipamento.id);
            ficha?.setMaosOcupadas(-1);
        } else {
            if ((ficha?.maosOcupadas ?? 0) >= 2) {
                toast.error('Você não tem mão sobrando para equipar este item!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                ficha?.setEquiparArma(equipamento);
                ficha?.setMaosOcupadas(1);
            }
        }
    }

    return (
        <div key={refreshKey} className="inventario-armas-container">
            <h3 className="inventario-titulo">Inventário de Armas</h3>
            <div className="proficiencias-personagem-container">
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaSimples ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaSimples ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Simples</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaMarciais ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaMarciais ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Marciais</span>
                </div>
                <div className="proficiencias-personagem">
                    <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaExoticas ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaExoticas ? "proficiente" : "não proficiente"}></img>
                    <span>Armas Exoticas</span>
                </div>
            </div>

            <button className="adicionar-armas" onClick={() => setModalAberto(true)}>Adicionar Nova Arma</button>
            <ul className="lista-armas">
                {ficha?.ArmasMochila?.map((arma) => {
                    const proficiente =
                        verificarProficiencias(arma.nome, coletarProeficiencias(ficha?.efeitos)) ||
                        verificarProficiencias(arma.categoria, coletarProeficiencias(ficha?.efeitos));
                    const equipada = !!ficha?.ArmaEquipada?.find(a => a.id === arma.id);
                    const danoResumo = obterResumoDano(arma);
                    const badgeCategoria = obterBadgeCategoria(arma.categoria);
                    const badgeAlcance = obterBadgeAlcance(arma);
                    const propriedades = obterBadgesPropriedades(arma.propriedades);

                    return (
                        <li key={arma.id} className="item-arma">
                            <div className="detalhes-equipamento">
                                <div className="cabecalho-equipamento">
                                    <div className="cabecalho-bloco-equipamento">
                                        <div className="titulo-status-equipamento">
                                            <div className="titulo-com-meta">
                                                <h4>{arma.nome}</h4>
                                                <span className="info-badge" title={badgeCategoria.descricao}>{badgeCategoria.label}</span>
                                                <span className="info-badge" title={badgeAlcance.descricao}>{badgeAlcance.label}</span>
                                                <img className="icon-proficiencia" alt="proficiencia" src={proficiente ? proficienciaIcon : noProficienciaIcon} title={proficiente ? "proficiente" : "não proficiente"}></img>
                                                {equipada && <span className="status-item-equipado">Equipada</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="arma arma-resumo">
                                    <div className="linha-conteudo-equipamento">
                                        <div className="linha-base-equipamento">
                                            <img className="dado-base" src={danoResumo.dadoIcone} alt="Dado de dano" />
                                            <div className="bloco-base-texto">
                                                <span className="destaque-label">Base</span>
                                                <strong>{`${danoResumo.base}${arma.dano.dano_2 ? ` / ${arma.dano.dano_2}` : ""}`}</strong>
                                            </div>
                                            {bonusDanoItens !== 0 && (
                                                <span className="texto-secundario" title="Bônus acumulado de dano por itens e efeitos ativos">
                                                    {`Bônus extra ${formatarBonus(bonusDanoItens).trim()}`}
                                                </span>
                                            )}
                                        </div>
                                        <div className="destaque-equipamento" title={`${danoResumo.detalhe} ${danoResumo.tipo}`}>
                                            <span className="destaque-label">Dano</span>
                                            <strong>{danoResumo.formula}</strong>
                                            <span>{`(${danoResumo.atributo}) ${danoResumo.tipo}`}</span>
                                        </div>
                                    </div>
                                    <div className="propriedades-grid">
                                        {propriedades.length > 0 ? propriedades.map((propriedade) => (
                                            <span key={`${arma.id}-${propriedade.texto}`} className="info-badge info-badge-propriedade" title={`${propriedade.texto}: ${propriedade.descricao}`}>
                                                {propriedade.label}

                                            </span>
                                        )) : (
                                            <span className="texto-secundario">Sem propriedades relevantes</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="acoes-item acoes-equipamento">
                                <button
                                    className="botao-equipar-item"
                                    onClick={() => {
                                        equiparDesequiparArmadura(arma);
                                        forceUpdate();
                                    }}
                                >
                                    {equipada ? "Desequipar" : "Equipar"}
                                </button>
                                <button
                                    className="botao-excluir-item"
                                    onClick={() => {
                                        ficha.excluirArmaMochila(arma.id);
                                        forceUpdate();
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}