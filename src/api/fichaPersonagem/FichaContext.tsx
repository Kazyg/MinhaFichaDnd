import React, { createContext, useContext, useState, useEffect } from "react";
import { Ficha } from "./FichaPersonagem.ts";

type FichaContextType = {
  ficha: Ficha | null;
  setFicha: (ficha: Ficha | null) => void;
  refreshKey: number;
  forceUpdate: () => void;
};

const FichaContext = createContext<FichaContextType | null>(null);

export const FichaProvider = ({ children }) => {
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const forceUpdate = () => setRefreshKey((prev) => prev + 1);

  // Carrega a ficha do localStorage ao inicializar
  useEffect(() => {
    const fichaSalva = localStorage.getItem("ficha");
    if (fichaSalva) {
      const fichaObj = JSON.parse(fichaSalva);
      setFicha(new Ficha(fichaObj));
    }
  }, []);

  // Salva a ficha no localStorage sempre que ela for alterada
  useEffect(() => {
    if (ficha) {
      localStorage.setItem("ficha", JSON.stringify(ficha));
    }
  }, [ficha, refreshKey]);

  return (
    <FichaContext.Provider value={{ ficha, setFicha, refreshKey, forceUpdate }}>
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