import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CriacaoFicha from "./components/CriacaoFicha";
import InformacoesPersonagem from "./components/InformacoesPersonagem";
import PericiasEOutros from "./components/PericiasEOutros";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes";
import "./css/criarFicha.css";
import { useFicha } from "../api/fichaPersonagem/FichaContext";
import { exportFicha } from "../api/fichaPersonagem/fichaStorage";

export default function CriarFicha() {
  const [barraRecolhida, setBarraRecolhida] = useState(() => { try { return localStorage.getItem('progressao-recolhida') === 'true'; } catch { return false; } });
  const alternarBarra = () => setBarraRecolhida(atual => { try { localStorage.setItem('progressao-recolhida', String(!atual)); } catch {} return !atual; });
  const { ficha, salvarFicha, salvarPendentes } = useFicha();
  const salvarAoSair = useRef(salvarPendentes);
  salvarAoSair.current = salvarPendentes;
  useEffect(() => () => { salvarAoSair.current?.(); }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuButton = useRef(null);
  const [erroExportacao, setErroExportacao] = useState("");
  const fecharMenu = () => { setIsMenuOpen(false); menuButton.current?.focus(); };
  useEffect(() => { menuButton.current?.focus(); }, []);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [abaAtiva, setAbaAtiva] = useState("criacao");
  useEffect(() => {
    if (document.activeElement === document.body) menuButton.current?.focus();
  }, [isMobile]);

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
    if (salvarFicha(ficha)) fecharMenu();
  };

  const handleExportarPDF = async () => {
    try {
      setErroExportacao("");
      const { exportarFichaPdf } = await import("../utils/exportarFichaPdf");
      await exportarFichaPdf(ficha);
    } catch (error) {
      setErroExportacao("Não foi possível exportar o PDF. Tente novamente ou exporte JSON para guardar a ficha.");
    } finally {
      fecharMenu();
    }
  };


  const handleExportarJSON = () => {
    exportarFicha();
    fecharMenu();
  };

  const exportarFicha = () => {
    let fichaJSON;
    try { fichaJSON = exportFicha(ficha); }
    catch (error) { window.alert(error.message); return; }
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


  return (
    <div key={ficha.id} className="criar-ficha">
      <div className="menu-container" onKeyDown={e => { if (e.key === "Escape" && isMenuOpen) { e.preventDefault(); fecharMenu(); } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsMenuOpen(false); }}>
        <button ref={menuButton} data-page-focus aria-label="Menu da ficha" aria-expanded={isMenuOpen} aria-controls="acoes-ficha" className="hamburger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {erroExportacao && <p role="alert">{erroExportacao}</p>}
        {isMenuOpen && (
          <div id="acoes-ficha" className="menu-options">
            <button onClick={handleSalvarFicha}>Salvar Ficha</button>
            <button onClick={handleExportarPDF}>Exportar PDF</button>
            <button onClick={handleExportarJSON}>Exportar JSON</button>
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
              aria-pressed={abaAtiva === aba.id}
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
        <div className={`desktop-layout ${barraRecolhida ? "barra-recolhida" : ""}`}>
          <aside className="desktop-sidebar">
            <div className="rolagem-progressao">
              <header className="cabecalho-progressao">
                {!barraRecolhida && <h2>Escolha seu Personagem</h2>}
                <button className="alternar-progressao" aria-label={barraRecolhida ? 'Expandir progressão' : 'Recolher progressão'} aria-expanded={!barraRecolhida} aria-controls="conteudo-progressao" title={barraRecolhida ? 'Expandir progressão' : 'Recolher progressão'} onClick={alternarBarra}><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d={barraRecolhida ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'} /></svg></button>
              </header>
              {barraRecolhida && <nav className="atalhos-progressao" aria-label="Níveis">{Array.from({ length: 20 }, (_, i) => <button key={i} title={`Nível ${i + 1}`} aria-label={`Abrir nível ${i + 1}`} onClick={() => { alternarBarra(); requestAnimationFrame(() => document.getElementById(`progressao-nivel-${i + 1}`)?.scrollIntoView({ block: 'nearest' })); }}>{i + 1}</button>)}</nav>}
              <div id="conteudo-progressao" hidden={barraRecolhida}><CriacaoFicha exibirTitulo={false} /></div>
            </div>
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
