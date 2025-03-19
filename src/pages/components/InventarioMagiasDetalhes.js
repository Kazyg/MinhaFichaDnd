import React, { useState } from "react";
import "../css/InventarioMagiasDetalhes.css";

// Itens
import { armas } from "../../api/equipamentos/Armas.ts"; 
import { armaduras_equip } from "../../api/equipamentos/Armaduras.ts";

// Modals
import ModalInventarioArma from "../modals/ModalInventarioArma.tsx";
import ModalInventarioEquipamentos from "../modals/ModalInventarioEquipamentos.tsx";

export default function InventarioMagiasDetalhes() {
  const [abaAtiva, setAbaAtiva] = useState("armas"); // Aba inicial
  const [modalAberto, setModalAberto] = useState(false); // Estado do modal de armas
  const [modalEquipamentoAberto, setModalEquipamentoAberto] = useState(false); // Estado do modal de equipamentos
  const [armasSelecionadas, setArmasSelecionadas] = useState([]); // Lista de armas selecionadas
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState([]); // Lista de equipamentos selecionados

  // Função para abrir o modal de armas
  const abrirModal = () => {
    setModalAberto(true);
  };

  // Função para fechar o modal de armas
  const fecharModal = () => {
    setModalAberto(false);
  };

  // Função para abrir o modal de equipamentos
  const abrirModalEquipamento = () => {
    setModalEquipamentoAberto(true);
  };

  // Função para fechar o modal de equipamentos
  const fecharModalEquipamento = () => {
    setModalEquipamentoAberto(false);
  };

  // Função para adicionar uma arma à lista de armas selecionadas
  const selecionarArma = (arma) => {
    setArmasSelecionadas([...armasSelecionadas, arma]);
    fecharModal();
  };

  // Função para adicionar um equipamento à lista de equipamentos selecionados
  const selecionarEquipamento = (equipamento) => {
    setEquipamentosSelecionados([...equipamentosSelecionados, equipamento]);
    fecharModalEquipamento();
  };

  // Função para remover uma arma da lista de armas selecionadas
  const removerArma = (index) => {
    const novasArmas = armasSelecionadas.filter((_, i) => i !== index); // Remove a arma pelo índice
    setArmasSelecionadas(novasArmas); // Atualiza o estado
  };

  // Função para remover um equipamento da lista de equipamentos selecionados
  const removerEquipamento = (index) => {
    const novosEquipamentos = equipamentosSelecionados.filter((_, i) => i !== index);
    setEquipamentosSelecionados(novosEquipamentos);
  };

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
        {/* Aba Armas */}
        {abaAtiva === "armas" && (
          <div>
            <button onClick={abrirModal}>Adicionar Nova Arma</button>
            <ul>
              {armasSelecionadas.map((arma, index) => (
                <li key={index}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{arma.nome}</strong>
                    <button
                      onClick={() => removerArma(index)} // Função para remover a arma
                      style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "1.2em" }}
                    >
                      X
                    </button>
                  </div>
                  <div>
                    <p><strong>Categoria:</strong> {arma.categoria}</p>
                    <p>
                      <strong>Dano:</strong> {arma.dano.dano_1}{" "}
                      {arma.dano.dano_2 && `/${arma.dano.dano_2}`} ({arma.dano_tipo})
                    </p>
                    <p><strong>Atributos de Dano:</strong> {arma.dano_atributo.join(", ")}</p>
                    <p><strong>Custo:</strong> {arma.custo} moedas de ouro</p>
                    <p><strong>Peso:</strong> {arma.peso} kg</p>
                    <p><strong>Propriedades:</strong> {arma.propriedades}</p>
                    <p><strong>Distância:</strong> {arma.distancia === "sim" ? "À distância" : "Corpo a corpo"}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Aba Armaduras */}
        {abaAtiva === "armaduras" && (
          <div>
            <button onClick={abrirModalEquipamento}>Adicionar Novo Equipamento</button>
            <ul>
              {equipamentosSelecionados.map((equipamento, index) => (
                <li key={index}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{equipamento.nome}</strong>
                    <button
                      onClick={() => removerEquipamento(index)}
                      style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "1.2em" }}
                    >
                      X
                    </button>
                  </div>
                  <div>
                    <p><strong>Categoria:</strong> {equipamento.categoria}</p>
                    <p><strong>Classe de Armadura (CA):</strong> {equipamento.ac}</p>
                    <p><strong>Força Necessária:</strong> {equipamento.forca}</p>
                    <p><strong>Furtividade:</strong> {equipamento.furtividade}</p>
                    <p><strong>Custo:</strong> {equipamento.custo} moedas de ouro</p>
                    <p><strong>Peso:</strong> {equipamento.peso} kg</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {abaAtiva === "itens" && <div>🎒 Lista de Itens aqui...</div>}
        {abaAtiva === "magias" && <div>✨ Lista de Magias aqui...</div>}
        {abaAtiva === "detalhes" && <div>📖 Detalhes do Personagem aqui...</div>}
      </div>

      {/* Modal para selecionar armas */}
      {modalAberto && (
        <ModalInventarioArma
          armas={armas} // Passa o array de armas
          onClose={fecharModal}
          onSelecionarArma={selecionarArma}
        />
      )}

      {/* Modal para selecionar equipamentos */}
      {modalEquipamentoAberto && (
        <ModalInventarioEquipamentos
          equipamentos={armaduras_equip} // Passa o array de equipamentos
          onClose={fecharModalEquipamento}
          onSelecionarEquipamento={selecionarEquipamento}
        />
      )}
    </div>
  );
}