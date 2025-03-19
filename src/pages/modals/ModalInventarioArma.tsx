import React, { useState } from "react";
import styles from "../../pages/css/ModalInventarioArma.module.css"; // Estilos para o modal



interface Arma {
    nome: string;
    categoria: string;
    dano: { dano_1: string; dano_2: string };
    dano_tipo: string;
    dano_atributo: string[];
    custo: number;
    peso: number;
    propriedades: string;
    distancia: string;
  }
  
  interface ModalInventarioArmaProps {
    armas: Arma[];
    onClose: () => void;
    onSelecionarArma: (arma: Arma) => void;
  }
  
  export default function ModalInventarioArma({
    armas,
    onClose,
    onSelecionarArma,
  }: ModalInventarioArmaProps) {
    const [mostrarFiltros, setMostrarFiltros] = useState(true); // Estado para controlar a exibição dos filtros
    const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
    const [filtroDistancia, setFiltroDistancia] = useState<string | null>(null);
  
    // Função para filtrar as armas
    const armasFiltradas = armas.filter((arma) => {
      const correspondeCategoria = filtroCategoria ? arma.categoria.includes(filtroCategoria) : true;
      const correspondeDistancia = filtroDistancia ? arma.distancia === filtroDistancia : true;
      return correspondeCategoria && correspondeDistancia;
    });
  
    // Função para selecionar um filtro
    const selecionarFiltro = (categoria: string, distancia: string | null) => {
      setFiltroCategoria(categoria);
      setFiltroDistancia(distancia);
      setMostrarFiltros(false); // Esconde os botões de filtro e mostra a lista de armas
    };
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Selecione uma Arma</h2>
  
          {/* Mostra os botões de filtro ou a lista de armas */}
          {mostrarFiltros ? (
            <div className={styles.filtroBotoes}>
              <button onClick={() => selecionarFiltro("Armas Simples", "não")}>Simples Corpo a Corpo</button>
              <button onClick={() => selecionarFiltro("Armas Marciais", "não")}>Marcial Corpo a Corpo</button>
              <button onClick={() => selecionarFiltro("Armas Simples", "sim")}>Simples à Distância</button>
              <button onClick={() => selecionarFiltro("Armas Marciais", "sim")}>Marcial à Distância</button>
            </div>
          ) : (
            <>
              {/* Lista de armas filtradas */}
              <ul className={styles.listaArmas}>
                {armasFiltradas.map((arma) => (
                  <li key={arma.nome} onClick={() => onSelecionarArma(arma)}>
                    <strong>{arma.nome}</strong>
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