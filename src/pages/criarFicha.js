import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CriacaoFicha from "./components/CriacaoFicha.tsx";
import InformacoesPersonagem from "./components/InformacoesPersonagem.js";
import PericiasEOutros from "./components/PericiasEOutros.js";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes.js";
import "./css/criarFicha.css";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";

export default function CriarFicha() {
  const { ficha, salvarFicha } = useFicha();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleExportarPDF = () => {
    console.log('Exportar PDF');
  };

  const handleExportarJSON = () => {
    exportarFicha();
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
            <button onClick={handleExportarJSON}>Exportar JSON</button>
            <button onClick={handleExportarXML}>Exportar XML</button>
          </div>
        )}
      </div>
      <CriacaoFicha />
      <InformacoesPersonagem />
      <PericiasEOutros />
      <InventarioMagiasDetalhes />
    </div>
  );
}