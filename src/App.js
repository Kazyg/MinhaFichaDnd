import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import SelecaoArea from "./pages/SelecaoArea";
import CriarFicha from "./pages/criarFicha";
import { FichaProvider } from "./api/fichaPersonagem/FichaContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AreaMestre = lazy(() => import('./pages/AreaMestre'));

function App() {
  return (
    <FichaProvider>
      <ToastContainer />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<SelecaoArea />} />
          <Route path="/jogador" element={<Navigate to="/criar-ficha" replace state={{ abrirFichas: true }} />} />
          <Route path="/mestre" element={<Suspense fallback={<div role="status">Carregando Área do Mestre…</div>}><AreaMestre /></Suspense>} />
          <Route path="/criar-ficha" element={<CriarFicha />} />
        </Routes>
      </Router>
    </FichaProvider>
  );
}

export default App;
