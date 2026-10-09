import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CriarFicha from "./pages/criarFicha";
import { FichaProvider } from "./api/fichaPersonagem/FichaContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <FichaProvider>
      <ToastContainer />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/criar-ficha" element={<CriarFicha />} />
        </Routes>
      </Router>
    </FichaProvider>
  );
}

export default App;
