import React, { useState } from "react";
import styles from "../../pages/css/ModalInventarioArma.module.css"; // Estilos para o modal

interface Equipamento {
  nome: string;
  categoria: string;
  ac: number;
  forca: number;
  furtividade: string;
  custo: number;
  peso: number;
}

interface ModalInventarioEquipamentosProps {
  equipamentos: Equipamento[];
  onClose: () => void;
  onSelecionarEquipamento: (equipamento: Equipamento) => void;
}

export default function ModalInventarioEquipamentos({
  equipamentos,
  onClose,
  onSelecionarEquipamento,
}: ModalInventarioEquipamentosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true); // Estado para controlar a exibição dos filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);

  // Função para filtrar os equipamentos
  const equipamentosFiltrados = equipamentos.filter((equipamento) => {
    return filtroCategoria ? equipamento.categoria.includes(filtroCategoria) : true;
  });

  // Função para selecionar um filtro
  const selecionarFiltro = (categoria: string) => {
    setFiltroCategoria(categoria);
    setMostrarFiltros(false); // Esconde os botões de filtro e mostra a lista de equipamentos
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Selecione um Equipamento</h2>

        {/* Mostra os botões de filtro ou a lista de equipamentos */}
        {mostrarFiltros ? (
          <div className={styles.filtroBotoes}>
            <button onClick={() => selecionarFiltro("Armadura Leve")}>Armaduras Leves</button>
            <button onClick={() => selecionarFiltro("Armadura Média")}>Armaduras Médias</button>
            <button onClick={() => selecionarFiltro("Armadura Pesada")}>Armaduras Pesadas</button>
            <button onClick={() => selecionarFiltro("Escudo")}>Escudos</button>
          </div>
        ) : (
          <>
            {/* Lista de equipamentos filtrados */}
            <ul className={styles.listaEquipamentos}>
              {equipamentosFiltrados.map((equipamento) => (
                <li key={equipamento.nome} onClick={() => onSelecionarEquipamento(equipamento)}>
                  <strong>{equipamento.nome}</strong>
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

            {/* Botão para voltar aos filtros */}
            <button onClick={() => setMostrarFiltros(true)}>Voltar aos Filtros</button>
          </>
        )}

        {/* Botão para fechar o modal */}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}