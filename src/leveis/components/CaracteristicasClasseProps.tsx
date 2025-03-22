import React, { useState } from "react";
import { bibliotecaPrincipal } from "../../bibliotecas/bibliotecaPrincipal.ts";
import { EstilosLuta } from "../../bibliotecas/EstilosLuta.ts"
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"
import ModalSelecaoEstiloLuta from "../../pages/modals/ModalEstiloLuta.tsx"
import { Efeitos } from "../../api/classesPrincipais/Efeitos.ts";

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
  const { ficha, forceUpdate } = useFicha();

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

  function atribuirEfeito(estilo) {
    ficha?.excluirEfeitoPorTitulo(`estiloLuta${classe.nome}${nivel}`);
    if (estilo === "Defesa") {
      let efeito = new Efeitos();
      efeito.setCa("CA");
      efeito.setLevel(nivel);
      efeito.setBonus(1);
      efeito.setClasseNome(classe.nome);
      efeito.setTituloEfeito(`estiloLuta${classe.nome}${nivel}`);
      ficha?.setEfeitos(efeito);
    }
    if (estilo === "Arquearia") {
      let efeito = new Efeitos();
      efeito.setArma("distancia")
      efeito.setLevel(nivel);
      efeito.setBonus(2);
      efeito.setClasseNome(classe.nome);
      efeito.setTituloEfeito(`estiloLuta${classe.nome}${nivel}`);
      ficha?.setEfeitos(efeito);
    }
    if (estilo === "Duelismo") {
      let efeito = new Efeitos();
      efeito.setArma("uma mao")
      efeito.setLevel(nivel);
      efeito.setBonus(2);
      efeito.setClasseNome(classe.nome);
      efeito.setTituloEfeito(`estiloLuta${classe.nome}${nivel}`);
      ficha?.setEfeitos(efeito);
    }
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
                    <strong>{ficha?.estiloLuta?.find(e => e.classe === classe.nome)?.estilo || "Selecionar Estilo de luta"}</strong>
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
                      atribuirEfeito(estilo?.nome);
                      ficha?.excluirEstiloLuta(classe.nome);
                      if (estilo) ficha?.setEstiloLuta(estilo?.nome, classe.nome);
                      setModalSelecaoEstiloLutaAberto(false);
                      forceUpdate();
                    }}
                    EstiloInicial={EstilosLuta.find(e => e.nome === ficha?.estiloLuta?.find(e => e.classe === classe.nome)?.estilo) || null}
                  />
                </div>
              </>
            )}
          </>
        );
      })}
      {
        ficha?.subClasse?.find((s) => s.classe.nome === classe.nome) && (
          <>
            {ficha?.subClasse
              ?.find((s) => s.classe.nome === classe.nome)
              ?.subclasse.niveis.map((nivelSubClasse) => {
                if (nivelSubClasse.nivel === nivel) {
                  return (
                    <div key={nivelSubClasse.nivel} className="skills-container">
                      <button
                        onClick={() => {
                          toggleCaracteristica(nivelSubClasse.nome);
                        }}
                        className="w-full text-left p-2 border rounded-lg focus:outline-none"
                      >
                        {nivelSubClasse.nome.toLowerCase()} {caracteristicasExpandidas[nivelSubClasse.nome] ? "▲" : "▼"}
                      </button>
                      {caracteristicasExpandidas[nivelSubClasse.nome] && (
                        <p className="descricao p-2 border rounded-lg mt-2">
                          {nivelSubClasse.descricao}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
          </>
        )
      }
    </div>
  );
};

export default CaracteristicasClasse;