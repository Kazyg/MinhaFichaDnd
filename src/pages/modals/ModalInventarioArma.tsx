import React, { useState } from "react";

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
  const [filtro, setFiltro] = useState("");
  const [armaSelecionada, setArma] = useState<Arma | null>(null)

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

  const opcoesFiltradas = armasFiltradas.filter((opcao) =>
    opcao.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="popup-content-modal">
      <h2>Selecione uma Arma</h2>

      {/* Mostra os botões de filtro ou a lista de armas */}
      {mostrarFiltros ? (
        <div className="menu-abas">
          <button onClick={() => selecionarFiltro("Armas Simples", "não")}>Simples Corpo a Corpo</button>
          <button onClick={() => selecionarFiltro("Armas Marciais", "não")}>Marcial Corpo a Corpo</button>
          <button onClick={() => selecionarFiltro("Armas Simples", "sim")}>Simples à Distância</button>
          <button onClick={() => selecionarFiltro("Armas Marciais", "sim")}>Marcial à Distância</button>
        </div>
      ) : (
        <>
          <div className="popup-body-modal">
            <div className="lista-racas">
              <ul>
                <input
                  type="text"
                  placeholder="Filtrar raças..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                {opcoesFiltradas.map((arma) => (
                  <>
                    <li key={arma.nome} onClick={() => setArma(arma)}>
                      <strong>{arma.nome}</strong>
                    </li>
                  </>
                ))}
              </ul >
            </div>
            <div className="detalhes-raca">
              {armaSelecionada && (
                <>
                  <h3>{armaSelecionada.nome}</h3>
                  <p><strong>Categoria:</strong> {armaSelecionada?.categoria}</p>
                  <p>
                    <strong>Dano:</strong> {armaSelecionada?.dano.dano_1}{" "}
                    {armaSelecionada?.dano.dano_2 && `/${armaSelecionada?.dano.dano_2}`} ({armaSelecionada?.dano_tipo})
                  </p>
                  <p><strong>Atributos de Dano:</strong> {armaSelecionada?.dano_atributo.join(", ")}</p>
                  <p><strong>Custo:</strong> {armaSelecionada?.custo} moedas de ouro</p>
                  <p><strong>Peso:</strong> {armaSelecionada?.peso} kg</p>
                  <p><strong>Propriedades:</strong> {armaSelecionada?.propriedades}</p>
                  <p><strong>Distância:</strong> {armaSelecionada?.distancia === "sim" ? "À distância" : "Corpo a corpo"}</p>
                </>
              )
              }
            </div>
          </div>
          {/* Botão para voltar aos filtros */}
          <div className="popup-footer">
            {armaSelecionada && (<button className="escolher-button" onClick={() => { onSelecionarArma(armaSelecionada); onClose() }}>Escolher {armaSelecionada.nome}</button>)}
            <button className="escolher-button" onClick={() => setMostrarFiltros(true)}>Voltar aos Filtros</button>
          </div>
        </>
      )
      }

      {/* Botão para fechar o modal */}
      <button onClick={onClose}>Fechar</button>
    </div >
  );
}