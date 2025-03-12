import iconFixaCriarNova from "../imagens/icon-fixa-criar-nova.png";
import iconFixaSalva from "../imagens/icon-fixa-salva.png";
import { useNavigate } from "react-router-dom";
import "../pages/css/Home.css";

export default function Home() {
  
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Criador de Fichas de RPG</h1>
      <div className="button-container">
        <button className="icon-button">
          <img src={iconFixaSalva} alt="Carregar Ficha Salva" className="icon-image" />
          <span className="tooltip">Carregar Ficha Salva</span>
        </button>
        <button className="icon-button" onClick={() => navigate("/criar-ficha")}>
          <img src={iconFixaCriarNova} alt="Criar Nova Ficha" className="icon-image" />
          <span className="tooltip">Criar Nova Ficha</span>
        </button>
      </div>
    </div>
  );
}