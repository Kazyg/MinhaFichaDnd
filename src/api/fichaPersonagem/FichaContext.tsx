import React, { createContext, useContext, useState } from "react";
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