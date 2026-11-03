import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CriarFicha from "./pages/criarFicha";
import { FichaProvider } from "./api/fichaPersonagem/FichaContext.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<<<<<<< Updated upstream
=======
const SalaJogador = lazy(() => import('./features/salaOnline/SalaJogador'));
const AreaMestre = lazy(() => import('./pages/AreaMestre'));

>>>>>>> Stashed changes
function App() {
  return (
    <FichaProvider>
      <ToastContainer />
      <Router>
        <Routes>
<<<<<<< Updated upstream
          <Route path="/" element={<Home />} />
=======
          <Route path="/" element={<SelecaoArea />} />
          <Route path="/sala" element={<Suspense fallback={<div role="status">Carregando sala…</div>}><SalaJogador /></Suspense>} />
          <Route path="/jogador" element={<Navigate to="/criar-ficha" replace state={{ abrirFichas: true }} />} />
          <Route path="/mestre" element={<Suspense fallback={<div role="status">Carregando Área do Mestre…</div>}><AreaMestre /></Suspense>} />
>>>>>>> Stashed changes
          <Route path="/criar-ficha" element={<CriarFicha />} />
        </Routes>
      </Router>
    </FichaProvider>
  );
}

export default App;
