import React, { useState } from "react";
import { bibliotecaPrincipal } from "../../bibliotecas/bibliotecaPrincipal.ts";

interface CaracteristicasClasseProps {
    talento: string;
}

const TalentoDescricao: React.FC<CaracteristicasClasseProps> = ({ talento }) => {
    // Estado para controlar quais características estão expandidas
    const [caracteristicasExpandidas, setCaracteristicasExpandidas] = useState<{ [key: string]: boolean }>({});

    // Função para alternar a visibilidade da descrição
    const toggleCaracteristica = (caracteristica: string) => {
        setCaracteristicasExpandidas((prev) => ({
            ...prev,
            [caracteristica]: !prev[caracteristica],
        }));
    };
    const descricao =
          bibliotecaPrincipal.Talentos.find((item) => item.nome.toLowerCase() === talento.toLowerCase())?.descricao ||
          "Descrição não encontrada.";

    return (
        <div key={talento} className="skills-container">
            <button
                onClick={() => { toggleCaracteristica(talento) }}
                className="w-full text-left p-2 border rounded-lg focus:outline-none"
            >
                {talento.toLowerCase()} {caracteristicasExpandidas[talento] ? "▲" : "▼"}
            </button>
            {caracteristicasExpandidas[talento] && (
                <p className="descricao p-2 border rounded-lg mt-2">{descricao}</p>
            )}
        </div>
    );
};

export default TalentoDescricao;