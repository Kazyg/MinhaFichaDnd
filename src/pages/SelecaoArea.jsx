import { Link } from 'react-router-dom';
import AreaIcon from './components/AreaIcon';
import './css/Areas.css';

export default function SelecaoArea() {
  return (
    <main className="area-selection">
      <div className="area-selection-content">
        <p className="areas-eyebrow">MinhaFichaDnd</p>
        <h1>Sua próxima aventura começa aqui</h1>
        <p className="areas-intro">Escolha sua área para começar.</p>
        <nav className="area-cards" aria-label="Selecionar área">
          <Link className="area-card" to="/mestre">
            <AreaIcon type="book" />
            <h2>Área do Mestre</h2>
            <p>Um espaço para o mestre organizar suas campanhas.</p>
            <span className="area-card-action">Entrar como mestre <span aria-hidden="true">→</span></span>
          </Link>
          <Link className="area-card" to="/criar-ficha" state={{ abrirFichas: true }}>
            <AreaIcon type="d20" />
            <h2>Área do Jogador</h2>
            <p>Crie, carregue e continue a jornada dos seus personagens.</p>
            <span className="area-card-action">Entrar como jogador <span aria-hidden="true">→</span></span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
