import React, { useState } from "react";
import DescricaoCaracteristica from "./DescricaoCaracteristica";
import { descricaoCaracteristica } from "../../bibliotecas/bibliotecaPrincipal";
import { useFicha } from '../../api/fichaPersonagem/FichaContext';

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
  const { ficha } = useFicha();

  const [caracteristicasExpandidas, setCaracteristicasExpandidas] = useState<{ [key: string]: boolean }>({});


  const toggleCaracteristica = (caracteristica: string) => {
    setCaracteristicasExpandidas((prev) => ({
      ...prev,
      [caracteristica]: !prev[caracteristica],
    }));
  };

  return (
    <div>
      {patrono.niveis.find((n) => n.nivel === nivel)?.caracteristicas.map((caracteristica) => {
        const descricao = descricaoCaracteristica(caracteristica, ficha?.versaoRegras);

        return (
          <div key={caracteristica} className="skills-container">
            <button
              onClick={() => toggleCaracteristica(caracteristica)}
              className="w-full text-left p-2 border rounded-lg focus:outline-none"
            >
              {caracteristica} {caracteristicasExpandidas[caracteristica] ? "▲" : "▼"}
            </button>
            {caracteristicasExpandidas[caracteristica] && (
              <DescricaoCaracteristica nome={caracteristica} descricao={descricao} versao={ficha?.versaoRegras} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CaracteristicasPatrono;
