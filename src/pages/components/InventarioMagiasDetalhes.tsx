import React, { useState } from "react";
import "../css/InventarioMagiasDetalhes.css";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";
import ModalInventarioArma from "../modals/ModalInventarioArma.tsx";
import ModalInventarioEquipamentos from "../modals/ModalInventarioEquipamentos.tsx";
import AbaArmas from "./components_inventario/AbaArmas.tsx";
import AbaArmaduras from "./components_inventario/AbaArmaduras.tsx";
import AbaItens from "./components_inventario/AbaItens.tsx";
import AbaMagias from "./components_inventario/AbaMagias.tsx";
import AbaDetalhes from "./components_inventario/AbaDetalhes.tsx";
import { armaduras_equip } from "../../api/equipamentos/Armaduras.ts";
import { armas } from "../../api/equipamentos/Armas.ts";

export default function InventarioMagiasDetalhes() {
  const [abaAtiva, setAbaAtiva] = useState("armas");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEquipamentoAberto, setModalEquipamentoAberto] = useState(false);
  const { ficha } = useFicha();

  return (
    <div className="inventario-container">
      {/* Menu Superior */}
      <div className="menu-abas">
        {["armas", "armaduras", "itens", "magias", "detalhes"].map((aba) => (
          <button
            key={aba}
            className={`aba-botao ${abaAtiva === aba ? "ativa" : ""}`}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
      </div>

      <div className="conteudo-abas">
        {/* Renderiza a aba ativa */}
        {abaAtiva === "armas" && <AbaArmas setModalAberto={setModalAberto} />}
        {abaAtiva === "armaduras" && <AbaArmaduras setModalEquipamentoAberto={setModalEquipamentoAberto} />}
        {abaAtiva === "itens" && <AbaItens />}
        {abaAtiva === "magias" && <AbaMagias />}
        {abaAtiva === "detalhes" && <AbaDetalhes />}
      </div>

      {modalAberto && (
        <>
          <div className="popup-overlay" onClick={() => setModalAberto(false)}></div>
          <div className="popup">
            <ModalInventarioArma
              armas={armas}
              onClose={() => setModalAberto(false)}
              onSelecionarArma={(armaEscolhida) => {
                ficha?.setArmaMochila(armaEscolhida)
              }}
            />
          </div>
        </>
      )
      }
      {modalEquipamentoAberto && (
          <>
            <div className="popup-overlay" onClick={() => setModalAberto(false)}></div>
            <div className="popup">
              <ModalInventarioEquipamentos
                equipamentos={armaduras_equip} // Passa o array de equipamentos
                onClose={() => setModalEquipamentoAberto(false)}
                onSelecionarEquipamento={(armaduraEscolhida) => {
                  ficha?.setArmaduraMochila(armaduraEscolhida)
                }}
              />
            </div>
          </>
        )
      }
    </div>
  );
}