import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CriacaoFicha from "./components/CriacaoFicha.tsx";
import InformacoesPersonagem from "./components/InformacoesPersonagem.tsx";
import PericiasEOutros from "./components/PericiasEOutros.tsx";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes.tsx";
import "./css/criarFicha.css";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";
import { exportarFichaPdf, exportarMapaPdf } from "../utils/exportarFichaPdf.ts";

export default function CriarFicha() {
  const { ficha, salvarFicha } = useFicha();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [abaAtiva, setAbaAtiva] = useState("criacao");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redireciona para a Home se a ficha não estiver instanciada
  useEffect(() => {
    if (!ficha) {
      navigate("/");
    }
  }, [ficha, navigate]);

  if (!ficha) {
    return null; // Ou uma mensagem de carregamento
  }

  const handleSalvarFicha = () => {
    salvarFicha(ficha);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleExportarPDF = async () => {
    try {
      await exportarFichaPdf(ficha);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleExportarMapaPDF = async () => {
    try {
      await exportarMapaPdf();
    } catch (error) {
      console.error("Erro ao exportar mapa PDF:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleExportarJSON = () => {
    exportarFicha();
    setIsMenuOpen(false);
  };

  const exportarFicha = () => {
    const fichaJSON = JSON.stringify(ficha, null, 2);
    const blob = new Blob([fichaJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ficha_personagem.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportarXML = () => {
    console.log('Exportar XML');
    setIsMenuOpen(false);
  };

  return (
    <div className="criar-ficha">
      <div className="menu-container">
        <button className="hamburger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {isMenuOpen && (
          <div className="menu-options">
            <button onClick={handleSalvarFicha}>Salvar Ficha</button>
            <button onClick={handleExportarPDF}>Exportar PDF</button>
            <button onClick={handleExportarMapaPDF}>Mapear PDF</button>
            <button onClick={handleExportarJSON}>Exportar JSON</button>
            <button onClick={handleExportarXML}>Exportar XML</button>
          </div>
        )}

        {isMobile && (
          <div className="menu-abas-criarFicha">
          {[
            { nome: "Criar", id: "criacao" },
            { nome: "Informações", id: "informacoes" },
            { nome: "Perícias", id: "pericias" },
            { nome: "Inventário", id: "inventario" }
          ].map((aba) => (
            <button
              key={aba.id}
              className={`aba-botao ${abaAtiva === aba.id ? "ativa" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.nome}
            </button>
          ))}
        </div>
        )}
      </div>
      {/* Modo Desktop: exibe todos os componentes */}
      {!isMobile && (
        <div className="desktop-layout">
          <aside className="desktop-sidebar">
            <CriacaoFicha />
          </aside>
          <main className="desktop-main">
            <InformacoesPersonagem />
            <PericiasEOutros />
            <InventarioMagiasDetalhes />
          </main>
        </div>
      )}

      {/* Conteúdo das abas no Mobile */}
      {isMobile && (
        <div className="conteudo-abas">
          {abaAtiva === "criacao" && <CriacaoFicha />}
          {abaAtiva === "informacoes" && <InformacoesPersonagem />}
          {abaAtiva === "pericias" && <PericiasEOutros />}
          {abaAtiva === "inventario" && <InventarioMagiasDetalhes />}
        </div>
      )}
    </div>
  );
}