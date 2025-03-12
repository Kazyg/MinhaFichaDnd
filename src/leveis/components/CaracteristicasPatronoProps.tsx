import React, { useState } from "react";
import { bibliotecaPrincipal } from "../../bibliotecas/bibliotecaPrincipal.ts";

interface CaracteristicasPatronoProps {
  patrono: {
    niveis: {
      nivel: number;
      caracteristicas: string[];
    }[];
  };
  nivel: number;
}

const CaracteristicasPatrono: React.FC<CaracteristicasPatronoProps> = ({ patrono, nivel }) => {
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
      {patrono.niveis.find((n) => n.nivel === nivel)?.caracteristicas.map((caracteristica) => {
        // Busca a descrição da característica na biblioteca principal
        const descricao =
          bibliotecaPrincipal.caracteristicasDeClasse.find((item) => item.nome.toLowerCase() === caracteristica.toLowerCase())?.descricao ||
          "Descrição não encontrada.";

        return (
          <div key={caracteristica} className="skills-container">
            <button
              onClick={() => toggleCaracteristica(caracteristica)}
              className="w-full text-left p-2 border rounded-lg focus:outline-none"
            >
              {caracteristica.toLowerCase()} {caracteristicasExpandidas[caracteristica] ? "▲" : "▼"}
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

export default CaracteristicasPatrono;