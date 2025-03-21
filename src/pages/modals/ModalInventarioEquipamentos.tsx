import React, { useState } from "react";
import { Armaduras_equip } from "../../api/equipamentos/Armaduras";

interface ModalInventarioEquipamentosProps {
  equipamentos: Armaduras_equip[];
  onClose: () => void;
  onSelecionarEquipamento: (equipamento: Armaduras_equip) => void;
}

export default function ModalInventarioEquipamentos({
  equipamentos,
  onClose,
  onSelecionarEquipamento,
}: ModalInventarioEquipamentosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true); // Estado para controlar a exibição dos filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [escolhido, setEscolhido] = useState<Armaduras_equip | null>(null);
  const [filtro, setFiltro] = useState("");

  // Função para filtrar os equipamentos
  const equipamentosFiltrados = equipamentos.filter((equipamento) => {
    return filtroCategoria ? equipamento.categoria.includes(filtroCategoria) : true;
  });

  // Função para selecionar um filtro
  const selecionarFiltro = (categoria: string) => {
    setFiltroCategoria(categoria);
    setMostrarFiltros(false); // Esconde os botões de filtro e mostra a lista de equipamentos
  };

  const opcoesFiltradas = equipamentosFiltrados.filter((opcao) =>
    opcao.nome.toLowerCase().includes(filtro.toLowerCase())
  );


  return (
    <div className="popup-content-modal">
      <h2>Selecione um Equipamento</h2>

      {/* Mostra os botões de filtro ou a lista de equipamentos */}
      {mostrarFiltros ? (
        <div className="menu-abas">
          <button onClick={() => selecionarFiltro("Armadura Leve")}>Armaduras Leves</button>
          <button onClick={() => selecionarFiltro("Armadura Média")}>Armaduras Médias</button>
          <button onClick={() => selecionarFiltro("Armadura Pesada")}>Armaduras Pesadas</button>
          <button onClick={() => selecionarFiltro("Escudo")}>Escudos</button>
        </div>
      ) : (
        <>
          <div className="popup-body-modal">
            <div className="lista-racas">
            <input
                  type="text"
                  placeholder={`Filtrar ${filtroCategoria}...`}
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              <ul>
                {opcoesFiltradas.map((equipamento) => (
                  <li key={equipamento.nome} onClick={() => setEscolhido(equipamento)}>
                    <strong>{equipamento.nome}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="detalhes-raca">
              {escolhido && (
                <>
                  <h3>{escolhido.nome}</h3>
                  <p><strong>Categoria:</strong> {escolhido.categoria}</p>
                  <p><strong>Classe de Armadura (CA):</strong> {escolhido.ac}</p>
                  <p><strong>Força Necessária:</strong> {escolhido.forca}</p>
                  <p><strong>Furtividade:</strong> {escolhido.furtividade}</p>
                  <p><strong>Custo:</strong> {escolhido.custo} moedas de ouro</p>
                  <p><strong>Peso:</strong> {escolhido.peso} kg</p>
                </>
              )}
            </div>
          </div>
          <div className="popup-footer">
            {escolhido && (<button className="escolher-button" onClick={() => { onSelecionarEquipamento(escolhido); onClose() }}>Escolher {escolhido.nome}</button>)}
            <button className="escolher-button" onClick={() => setMostrarFiltros(true)}>Voltar aos Filtros</button>
          </div>
        </>
      )}
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}