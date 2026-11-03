import AccessibleDialog from "../components/AccessibleDialog";
import React, { useState } from "react";
import { Armas } from "../../api/equipamentos/Armas";

interface ModalInventarioArmaProps {
  armas: Armas[];
  onClose: () => void;
  onSelecionarArma: (arma: Armas) => void;
}

export default function ModalInventarioArma({
  armas,
  onClose,
  onSelecionarArma,
}: ModalInventarioArmaProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroDistancia, setFiltroDistancia] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [armaSelecionada, setArma] = useState<Armas | null>(null)


  const armasFiltradas = armas.filter((arma) => {
    const correspondeCategoria = filtroCategoria ? arma.categoria.includes(filtroCategoria) : true;
    const correspondeDistancia = filtroDistancia ? arma.distancia === filtroDistancia : true;
    return correspondeCategoria && correspondeDistancia;
  });


  const selecionarFiltro = (categoria: string, distancia: string | null) => {
    setFiltroCategoria(categoria);
    setFiltroDistancia(distancia);
    setMostrarFiltros(false);
  };

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const opcoesFiltradas = armasFiltradas.filter((opcao) =>
    normalizar(opcao.nome).includes(filtro.toLowerCase())
  );

  return (
    <AccessibleDialog className="popup-content-modal" onClose={onClose} aria-label="Selecione uma Arma">
      <h2>Selecione uma Arma</h2>

      { }
      {mostrarFiltros ? (
        <div className="menu-abas">
          <button className="escolher-button" onClick={() => selecionarFiltro("Armas Simples", "não")}>Simples Corpo a Corpo</button>
          <button className="escolher-button" onClick={() => selecionarFiltro("Armas Marciais", "não")}>Marcial Corpo a Corpo</button>
          <button className="escolher-button" onClick={() => selecionarFiltro("Armas Simples", "sim")}>Simples à Distância</button>
          <button className="escolher-button" onClick={() => selecionarFiltro("Armas Marciais", "sim")}>Marcial à Distância</button>
        </div>
      ) : (
        <>
          <div className="popup-body-modal">
            <div className="lista-racas">
              <input
                type="text"
                aria-label={`Filtrar ${filtroCategoria}...`} placeholder={`Filtrar ${filtroCategoria}...`}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <ul>
                {opcoesFiltradas.map((arma) => (
                  <>
                    <li key={arma.nome}><button type="button" className="selection-option" aria-pressed={armaSelecionada?.nome === arma.nome} onClick={() => setArma(arma)}>
                      <strong>{arma.nome}</strong>
                    </button></li>
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
          { }
          <div className="popup-footer">
            {armaSelecionada && (<button className="escolher-button" onClick={() => { onSelecionarArma(armaSelecionada); onClose() }}>Escolher {armaSelecionada.nome}</button>)}
            <button className="escolher-button" onClick={() => setMostrarFiltros(true)}>Voltar aos Filtros</button>
          </div>
        </>
      )
      }

      { }
      <button className="escolher-button" onClick={onClose}>Fechar</button>
    </AccessibleDialog>
  );
}
