import CriacaoFicha from "./components/CriacaoFicha.tsx";
import InformacoesPersonagem from "./components/InformacoesPersonagem.js";
import PericiasEOutros from "./components/PericiasEOutros.js";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes.js";
import "./css/criarFicha.css";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";
import React, { useState } from "react";



export default function CriarFicha() {

  const { ficha, salvarFicha } = useFicha();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (!ficha) {
    return <div>Carregando ficha...</div>; // Ou redirecione para a página inicial
  }

  // Funções para as opções do menu
  const handleSalvarFicha = () => {
    salvarFicha(ficha);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleExportarPDF = () => {
    console.log('Exportar PDF');
    // Implemente a lógica para exportar PDF
  };

  const handleExportarJSON = () => {
    exportarFicha();
  };

  const exportarFicha = () => {
    // Converte a ficha para JSON
    const fichaJSON = JSON.stringify(ficha, null, 2); // O `null, 2` formata o JSON com indentação
  
    // Cria um blob com o conteúdo JSON
    const blob = new Blob([fichaJSON], { type: 'application/json' });
  
    // Cria um link para download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ficha_personagem.json'; // Nome do arquivo
    document.body.appendChild(link);
    link.click();
  
    // Limpa o link após o download
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportarXML = () => {
    console.log('Exportar XML');
    // Implemente a lógica para exportar XML
  };

  return (
    <div className="criar-ficha">
      <div className="menu-container">
        {/* Botão do menu de hambúrguer */}
        <button className="hamburger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {/* Menu de opções */}
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
