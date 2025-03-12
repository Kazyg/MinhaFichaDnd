import React, { useState } from "react";
import "../css/InventarioMagiasDetalhes.css";

export default function InventarioMagiasDetalhes() {
  const [abaAtiva, setAbaAtiva] = useState("armas"); // Aba inicial

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

      {/* Conteúdo da aba selecionada */}
      <div className="conteudo-abas">
        {abaAtiva === "armas" && <div>📜 Lista de Armas aqui...</div>}
        {abaAtiva === "armaduras" && <div>🛡️ Lista de Armaduras aqui...</div>}
        {abaAtiva === "itens" && <div>🎒 Lista de Itens aqui...</div>}
        {abaAtiva === "magias" && <div>✨ Lista de Magias aqui...</div>}
        {abaAtiva === "detalhes" && <div>📖 Detalhes do Personagem aqui...</div>}
      </div>
    </div>
  );
}
