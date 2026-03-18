import React, { createContext, useContext, useState, useEffect } from "react";
import { Ficha } from "./FichaPersonagem.ts";

const STORAGE_KEYS = {
  fichas: "fichas",
  fichaId: "ficha",
} as const;

const normalizeFicha = (value: unknown): Ficha => {
  if (value instanceof Ficha) return value;
  return new Ficha(value as Partial<Ficha>);
};

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

export const FichaProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const forceUpdate = () => setRefreshKey((prev: number) => prev + 1);

  // 🔹 Carrega as fichas do localStorage ao iniciar
  useEffect(() => {
    const fichasSalvas = localStorage.getItem(STORAGE_KEYS.fichas);
    try {
      const rawArray = fichasSalvas ? (JSON.parse(fichasSalvas) as unknown[]) : [];
      const fichasArray = Array.isArray(rawArray) ? rawArray.map(normalizeFicha) : [];
      setFichas(fichasArray);

      // Recupera a última ficha usada
      const fichaSalvaId = localStorage.getItem(STORAGE_KEYS.fichaId);
      if (fichaSalvaId) {
        const fichaRecuperada = fichasArray.find((f) => f.id === fichaSalvaId);
        if (fichaRecuperada) {
          setFicha(fichaRecuperada);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar fichas do localStorage:", error);
      setFichas([]);
      setFicha(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 🔹 Salva as fichas no localStorage sempre que `fichas` mudar
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.fichas, JSON.stringify(fichas));
  }, [fichas, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (ficha) {
      localStorage.setItem(STORAGE_KEYS.fichaId, ficha.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.fichaId);
    }
  }, [ficha, isHydrated]);

  // 🔹 Adiciona ou atualiza uma ficha na lista corretamente
  const salvarFicha = (novaFicha: Ficha) => {
    const fichaNormalizada = normalizeFicha(novaFicha);
    setFichas((prevFichas: Ficha[]) => {
      const index = prevFichas.findIndex((f: Ficha) => f.id === fichaNormalizada.id);
      let novasFichas;

      if (index !== -1) {
        // Atualiza ficha existente
        novasFichas = [...prevFichas];
        novasFichas[index] = fichaNormalizada;
      } else {
        // Adiciona nova ficha
        novasFichas = [...prevFichas, fichaNormalizada];
      }
      return novasFichas;
    });

    setFicha(fichaNormalizada);
    forceUpdate();
  };

  // 🔹 Deleta uma ficha pelo ID
  const deletarFicha = (id: string) => {
    setFichas((prevFichas: Ficha[]) => {
      const novasFichas = prevFichas.filter((f: Ficha) => f.id !== id);
      return novasFichas;
    });

    if (ficha?.id === id) {
      setFicha(null);
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
