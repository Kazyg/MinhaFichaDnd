import React, { useState } from "react";
import { bibliotecaPrincipal } from "../../bibliotecas/bibliotecaPrincipal.ts";
import { EstilosLuta } from "../../bibliotecas/EstilosLuta.ts"
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"
import ModalSelecaoEstiloLuta from "../../pages/modals/ModalEstiloLuta.tsx"

interface CaracteristicasClasseProps {
  classe: {
    nome: string;
    niveis: {
      nivel: number;
      caracteristicas: string[];
    }[];
  };
  nivel: number;
}

const CaracteristicasClasse: React.FC<CaracteristicasClasseProps> = ({ classe, nivel }) => {
  const [caracteristicasExpandidas, setCaracteristicasExpandidas] = useState<{ [key: string]: boolean }>({});
  const [modalSelecaoEstiloLutaAberto, setModalSelecaoEstiloLutaAberto] = useState(false);
  const estilosDeLuta = EstilosLuta;
  const {ficha, refreshKey, forceUpdate} = useFicha();

  const toggleCaracteristica = (caracteristica: string) => {
    setCaracteristicasExpandidas((prev) => ({
      ...prev,
      [caracteristica]: !prev[caracteristica],
    }));
  };

  function filtrarEstilosDeLutaPorClasse(classe, estilosDeLuta) {
    const opcoesFiltradas = estilosDeLuta.filter(estilo =>
      estilo.classe.includes(classe)
    );

    return opcoesFiltradas;
  }

  return (
    <div>
      {classe.niveis.find((n) => n.nivel === nivel)?.caracteristicas.map((caracteristica) => {
        // Busca a descrição da característica na biblioteca principal
        const descricao =
          bibliotecaPrincipal.caracteristicasDeClasse.find((item) => item.nome.toLowerCase() === caracteristica.toLowerCase())?.descricao ||
          "Descrição não encontrada.";

        return (
          <>
            {caracteristica.toLowerCase().includes("estilo de luta") && (
              <>
                <button className="botao-distribuir" onClick={() => setModalSelecaoEstiloLutaAberto(true)}>
                  <div className="botao-texto">
                    <span>Selecionar Estilo de luta</span>
                    <strong>{ficha?.estiloLuta || "Selecionar Estilo de luta"}</strong>
                  </div>
                </button>
              </>
            )}
            <div key={caracteristica} className="skills-container">
              <button
                onClick={() => { toggleCaracteristica(caracteristica) }}
                className="w-full text-left p-2 border rounded-lg focus:outline-none"
              >
                {caracteristica.toLowerCase()} {caracteristicasExpandidas[caracteristica] ? "▲" : "▼"}
              </button>
              {caracteristicasExpandidas[caracteristica] && (
                <p className="descricao p-2 border rounded-lg mt-2">{descricao}</p>
              )}
            </div>
            {modalSelecaoEstiloLutaAberto && (
              <>
              <div className="popup-overlay" onClick={() => setModalSelecaoEstiloLutaAberto(false)}></div>
              <div className="popup">
                  <ModalSelecaoEstiloLuta
                      titulo="Escolha seu Estilo de luta"
                      opcoes={filtrarEstilosDeLutaPorClasse(classe.nome, estilosDeLuta)}
                      onClose={() => setModalSelecaoEstiloLutaAberto(false)}
                      onSelect={(estilo) => {
                          if(estilo)ficha?.setEstiloLuta(estilo?.nome);
                          setModalSelecaoEstiloLutaAberto(false);
                          forceUpdate();
                      }}
                      EstiloInicial={EstilosLuta.find(e => e.nome === ficha?.estiloLuta) || null}
                  />
              </div>
          </>
            )}
          </>
        );
      })}
    </div>
  );
};

export default CaracteristicasClasse;