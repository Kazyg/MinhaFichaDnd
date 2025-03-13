import React, { useState } from "react";
import "../css/PericiasEOutros.css";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

export default function PericiasEOutros() {
  // Estado para armazenar quais perícias estão treinadas
  const [pericias, setPericias] = useState([
    { modificador: " 0 ", nome: "Acrobacia (DES)", treinado: false },
    { modificador: " 0 ", nome: "Arcanismo (INT)", treinado: false },
    { modificador: " 0 ", nome: "Atletismo (FOR)", treinado: false },
    { modificador: " 0 ", nome: "Enganação (CAR)", treinado: false },
    { modificador: " 0 ", nome: "Furtividade (DES)", treinado: false },
    { modificador: " 0 ", nome: "História (INT)", treinado: false },
    { modificador: " 0 ", nome: "Intuição (SAB)", treinado: false },
    { modificador: " 0 ", nome: "Intimidação (CAR)", treinado: false },
    { modificador: " 0 ", nome: "Investigação (INT)", treinado: false },
    { modificador: " 0 ", nome: "Medicina (SAB)", treinado: false },
    { modificador: " 0 ", nome: "Natureza (INT)", treinado: false },
    { modificador: " 0 ", nome: "Percepção (SAB)", treinado: false },
    { modificador: " 0 ", nome: "Persuasão (CAR)", treinado: false },
    { modificador: " 0 ", nome: "Prestidigitação (DES)", treinado: false },
    { modificador: " 0 ", nome: "Religião (INT)", treinado: false },
    { modificador: " 0 ", nome: "Sobrevivência (SAB)", treinado: false },
  ]);

  const { ficha, setFicha, refreshKey } = useFicha();

  // Função para alternar o status de treinado
  const toggleTreinado = (index) => {
    setPericias((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, treinado: !p.treinado } : p
      )
    );
  };

  return (
    <div key={refreshKey} className="pericias-container">
      {/* Quadro pequeno com informações básicas */}
      <div className="info-extra">
        <div className="info-coluna">
          <div className="info-item"><strong>Iniciativa:</strong> +0</div>
          <div className="info-item"><strong>Speed:</strong> {ficha.speed}ft</div>
          <div className="info-item"><strong>Percepção:</strong> +0</div>
        </div>
        <div className="info-coluna">
          <div className="info-item"><strong>Proficiência:</strong> +2</div>
          <div className="info-item"><strong>Tamanho:</strong>{ficha.tamanho}</div>
        </div>
      </div>

      {/* Quadro grande com perícias */}
      <div className="pericias-lista">
        <h4>Perícias</h4>
        <ul>
          {pericias.map((pericia, index) => (
            <li key={index} className="pericia-item">
                {pericia.modificador}
              <input
                type="checkbox"
                checked={pericia.treinado}
                onChange={() => toggleTreinado(index)}
              />
              {pericia.nome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
