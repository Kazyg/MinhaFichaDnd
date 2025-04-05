import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CriarFicha from "./pages/criarFicha";
import { FichaProvider } from "./api/fichaPersonagem/FichaContext.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <FichaProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/criar-ficha" element={<CriarFicha />} />
        </Routes>
      </Router>
    </FichaProvider>
  );
}

export default App;
