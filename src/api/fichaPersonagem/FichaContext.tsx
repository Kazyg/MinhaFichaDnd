import React, { createContext, useContext, useState, useEffect } from "react";
import { Ficha } from "./FichaPersonagem.ts";

type FichaContextType = {
  fichas: Ficha[];
  ficha: Ficha | null;
  setFicha: (ficha: Ficha | null) => void;
  salvarFicha: (novaFicha: Ficha) => void;
  deletarFicha: (id: string) => void;
  refreshKey: number;
  forceUpdate: () => void;
};

const FichaContext = createContext<FichaContextType | null>(null);

export const FichaProvider = ({ children }) => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const forceUpdate = () => setRefreshKey((prev) => prev + 1);

  // 🔹 Carrega as fichas do localStorage ao iniciar
  useEffect(() => {
    const fichasSalvas = localStorage.getItem("fichas");
    if (fichasSalvas) {
      try {
        const fichasArray = JSON.parse(fichasSalvas) || [];
        setFichas(fichasArray);

        // Recupera a última ficha usada
        const fichaSalva = localStorage.getItem("ficha");
        if (fichaSalva) {
          const fichaRecuperada = fichasArray.find((f) => f.id === fichaSalva);
          if (fichaRecuperada) {
            setFicha(fichaRecuperada);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar fichas do localStorage:", error);
      }
    }
  }, []);

  // 🔹 Salva as fichas no localStorage sempre que `fichas` mudar
  useEffect(() => {
    if (fichas.length > 0) {
      localStorage.setItem("fichas", JSON.stringify(fichas));
    }
  }, [fichas]);

  useEffect(() => {
    if (ficha) {
      localStorage.setItem("ficha", ficha.id);
    }
  }, [ficha]);

  // 🔹 Adiciona ou atualiza uma ficha na lista corretamente
  const salvarFicha = (novaFicha: Ficha) => {
    setFichas((prevFichas) => {
      const index = prevFichas.findIndex((f) => f.id === novaFicha.id);
      let novasFichas;

      if (index !== -1) {
        // Atualiza ficha existente
        novasFichas = [...prevFichas];
        novasFichas[index] = novaFicha;
      } else {
        // Adiciona nova ficha
        novasFichas = [...prevFichas, novaFicha];
      }

      // 🔥 Salva no localStorage
      localStorage.setItem("fichas", JSON.stringify(novasFichas));
      return novasFichas;
    });

    setFicha(novaFicha);
    forceUpdate();
  };

  // 🔹 Deleta uma ficha pelo ID
  const deletarFicha = (id: string) => {
    setFichas((prevFichas) => {
      const novasFichas = prevFichas.filter((f) => f.id !== id);

      // 🔥 Salva imediatamente no localStorage
      localStorage.setItem("fichas", JSON.stringify(novasFichas));
      return novasFichas;
    });

    if (ficha?.id === id) {
      setFicha(null);
      localStorage.removeItem("ficha");
    }

    forceUpdate();
  };

  return (
    <FichaContext.Provider value={{ fichas, ficha, setFicha, salvarFicha, deletarFicha, refreshKey, forceUpdate }}>
      {children}
    </FichaContext.Provider>
  );
};

export const useFicha = () => {
  const context = useContext(FichaContext);
  if (!context) {
    throw new Error("useFicha deve ser usado dentro de um FichaProvider");
  }
  return context;
};
