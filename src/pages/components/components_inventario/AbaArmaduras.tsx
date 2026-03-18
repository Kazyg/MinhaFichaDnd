import React from "react";
import noProficienciaIcon from "../../../imagens/security_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import proficienciaIcon from "../../../imagens/security_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import "../../css/ArmaInventario.css"
import { Armaduras_equip } from "../../../api/equipamentos/Armaduras.ts";
import { toast } from "react-toastify";
import { calcularBonusCAItens, calcularValorAtributoFinal } from "../../../api/fichaPersonagem/fichaEfeitosUtils.ts";

interface AbaArmadurasProps {
  setModalEquipamentoAberto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AbaArmaduras({ setModalEquipamentoAberto }: AbaArmadurasProps) {
  const { ficha, refreshKey, forceUpdate } = useFicha();
  const proficienciaArmaduraLeve = verificarProficiencias("armadura leve", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraMedia = verificarProficiencias("armadura media", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaArmaduraPesada = verificarProficiencias("armadura pesada", "Todas as armaduras", coletarProeficiencias(ficha?.efeitos));
  const proficienciaEscudos = verificarProficiencias("escudos", "", coletarProeficiencias(ficha?.efeitos));

  const descricoesCategoria: Record<string, string> = {
    "armadura leve": "Permite somar todo o modificador de Destreza à CA.",
    "armadura media": "Permite somar no máximo +2 de Destreza à CA.",
    "armadura pesada": "Não adiciona Destreza à CA base da armadura.",
    escudos: "Concede bônus adicional de CA quando equipado com proficiência.",
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

  function verificarProficiencias(armadura1: string, armadura2: string, proficienciasPersonagem: Set<string>) {
    return proficienciasPersonagem.has(normalizarString(armadura1)) || proficienciasPersonagem.has(normalizarString(armadura2));
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

  function calcularCaExibida(equipamento: Armaduras_equip) {
    const categoria = normalizarString(equipamento.categoria);
    const bonusItens = calcularBonusCAItens(ficha);
    const dexMod = calcularModificador(calcularValorAtributoFinal(ficha, "destreza"));

    if (categoria === "armadura leve") {
      return {
        base: equipamento.ac,
        total: equipamento.ac + dexMod + bonusItens,
        detalhe: `Base ${equipamento.ac} + DES ${dexMod >= 0 ? `+${dexMod}` : dexMod}${bonusItens ? ` + itens ${bonusItens >= 0 ? `+${bonusItens}` : bonusItens}` : ""}`,
      };
    }

    if (categoria === "armadura media") {
      const bonusDexLimitado = Math.min(dexMod, 2);
      return {
        base: equipamento.ac,
        total: equipamento.ac + bonusDexLimitado + bonusItens,
        detalhe: `Base ${equipamento.ac} + DES ${bonusDexLimitado >= 0 ? `+${bonusDexLimitado}` : bonusDexLimitado} (máx. +2)${bonusItens ? ` + itens ${bonusItens >= 0 ? `+${bonusItens}` : bonusItens}` : ""}`,
      };
    }

    return {
      base: equipamento.ac,
      total: equipamento.ac + bonusItens,
      detalhe: `Base ${equipamento.ac}${bonusItens ? ` + itens ${bonusItens >= 0 ? `+${bonusItens}` : bonusItens}` : ""}`,
    };
  }

  function obterBadgeCategoria(categoria: string) {
    const chave = normalizarString(categoria);
    if (chave.includes("leve")) return { label: "Leve", descricao: descricoesCategoria["armadura leve"] };
    if (chave.includes("media")) return { label: "Média", descricao: descricoesCategoria["armadura media"] };
    if (chave.includes("pesada")) return { label: "Pesada", descricao: descricoesCategoria["armadura pesada"] };
    return { label: "Escudo", descricao: descricoesCategoria.escudos };
  }

  function obterBadgeFurtividade(valor: string) {
    if (normalizarString(valor).includes("desvantagem")) {
      return { label: "Desvantagem em Furtividade", descricao: "Impõe desvantagem em testes de Furtividade." };
    }
    return { label: "Sem penalidade de Furtividade", descricao: "Não impõe penalidade de Furtividade." };
  }

  function equiparDesequiparArmadura(equipamento: Armaduras_equip) {
    const isEscudo = normalizarString(equipamento.categoria) === "escudos" || normalizarString(equipamento.nome) === "escudo";
    if (isEscudo) {
      if (ficha?.escudoEquipado?.id === equipamento.id) {
        ficha.setDesequiparEscudo()
        ficha.setMaosOcupadas(-1);
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
          ficha?.setEscudoEquipado(equipamento);
          ficha?.setMaosOcupadas(1);
        }
      }
    } else {
      if (ficha?.ArmaduraEquipada?.id === equipamento.id) {
        ficha.setDesequiparArmadura()
      } else {
        ficha?.setArmaduraEquipada(equipamento);
      }
    }
  }

  return (
    <div key={refreshKey} className="inventario-armas-container">
      <h3 className="inventario-titulo">Inventário de Armaduras</h3>
      <div className="proficiencias-personagem-container">
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraLeve ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraLeve ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Leve</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraMedia ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraMedia ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Média</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaArmaduraPesada ? proficienciaIcon : noProficienciaIcon} title={proficienciaArmaduraPesada ? "proficiente" : "não proficiente"}></img>
          <span>Armadura Pesada</span>
        </div>
        <div className="proficiencias-personagem">
          <img className="icon-proficiencia" alt="proficiencia" src={proficienciaEscudos ? proficienciaIcon : noProficienciaIcon} title={proficienciaEscudos ? "proficiente" : "não proficiente"}></img>
          <span>Escudos</span>
        </div>
      </div>

      <button className="adicionar-armas" onClick={() => setModalEquipamentoAberto(true)}>Adicionar Novo Equipamento</button>
      <ul className="lista-armas">
        {ficha?.ArmadurasMochila?.map((equipamento) => {
          const proficiente =
            verificarProficiencias(equipamento.nome, equipamento.categoria, coletarProeficiencias(ficha?.efeitos)) ||
            verificarProficiencias("todas as armaduras", "", coletarProeficiencias(ficha?.efeitos));
          const equipada = ficha?.ArmaduraEquipada?.id === equipamento.id || ficha?.escudoEquipado?.id === equipamento.id;
          const badgeCategoria = obterBadgeCategoria(equipamento.categoria);
          const badgeFurtividade = obterBadgeFurtividade(equipamento.furtividade);
          const caResumo = calcularCaExibida(equipamento);
          const isEscudo = normalizarString(equipamento.categoria) === "escudos";

          return (
            <li key={equipamento.id} className="item-arma">
              <div className="detalhes-equipamento">
                <div className="cabecalho-equipamento">
                  <div className="cabecalho-bloco-equipamento">
                    <div className="titulo-status-equipamento">
                      <div className="titulo-com-meta">
                        <h4>{equipamento.nome}</h4>
                        <span className="info-badge" title={badgeCategoria.descricao}>{badgeCategoria.label}</span>
                        <span className="info-badge" title={badgeFurtividade.descricao}>{badgeFurtividade.label}</span>
                        <img className="icon-proficiencia" alt="proficiencia" src={proficiente ? proficienciaIcon : noProficienciaIcon} title={proficiente ? "proficiente" : "não proficiente"}></img>
                        {equipada && <span className="status-item-equipado">Equipada</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="arma arma-resumo">
                  <div className="linha-conteudo-equipamento">
                    <div className="valor-secundario" title={equipamento.forca > 0 ? `Requer Força ${equipamento.forca}` : "Sem requisito mínimo de Força"}>
                      <span className="destaque-label">Força</span>
                      <strong>{equipamento.forca > 0 ? equipamento.forca : "-"}</strong>
                    </div>
                    <div className="destaque-equipamento" title={caResumo.detalhe}>
                      <span className="destaque-label">CA</span>
                      <strong>{caResumo.total}</strong>
                      <span>{isEscudo ? `Bônus base ${equipamento.ac}` : `Base ${equipamento.ac}`}</span>
                    </div>
                  </div>
                  <div className="propriedades-grid">
                    <div className="linha-base-equipamento">
                      <span className="dado-base" aria-hidden="true">🛡</span>
                      <span className="texto-secundario" title={caResumo.detalhe}>{caResumo.detalhe}</span>
                    </div>
                    {!isEscudo && (
                      <span className="texto-secundario">{equipamento.categoria}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="acoes-item acoes-equipamento">
                <button
                  className="botao-equipar-item"
                  onClick={() => {
                    equiparDesequiparArmadura(equipamento);
                    forceUpdate();
                  }}
                >
                  {equipada ? "Desequipar" : "Equipar"}
                </button>
                <button
                  className="botao-excluir-item"
                  onClick={() => {
                    ficha.excluirArmaduraMochila(equipamento.id)
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