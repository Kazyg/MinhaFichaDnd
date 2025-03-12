import React, { useState } from "react";
import { bibliotecaPrincipal } from "../../bibliotecas/bibliotecaPrincipal.ts";

interface CaracteristicasClasseProps {
  classe: {
    niveis: {
      nivel: number;
      caracteristicas: string[];
    }[];
  };
}

const CaracteristicasClasse: React.FC<CaracteristicasClasseProps> = ({ classe }) => {
  // Estado para controlar quais características estão expandidas
  const [caracteristicasExpandidas, setCaracteristicasExpandidas] = useState<{ [key: string]: boolean }>({});

  // Função para alternar a visibilidade da descrição
  const toggleCaracteristica = (caracteristica: string) => {
    setCaracteristicasExpandidas((prev) => ({
      ...prev,
      [caracteristica]: !prev[caracteristica],
    }));
  };

  return (
    <div>
      <h3 className="tituloh3">Características de Classe Nível 1</h3>
      {classe.niveis.find((n) => n.nivel === 1)?.caracteristicas.map((caracteristica) => {
        // Busca a descrição da característica na biblioteca principal
        const descricao =
          bibliotecaPrincipal.caracteristicasDeClasse.find((item) => item.nome === caracteristica)?.descricao ||
          "Descrição não encontrada.";

        return (
          <div key={caracteristica} className="skills-container">
            <button
              onClick={() => toggleCaracteristica(caracteristica)}
              className="w-full text-left p-2 border rounded-lg focus:outline-none"
            >
              {caracteristica} {caracteristicasExpandidas[caracteristica] ? "▲" : "▼"}
            </button>
            {caracteristicasExpandidas[caracteristica] && (
              <p className="descricao p-2 border rounded-lg mt-2">{descricao}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CaracteristicasClasse;