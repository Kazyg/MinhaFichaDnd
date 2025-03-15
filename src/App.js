import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CriarFicha from "./pages/criarFicha";
import { FichaProvider } from "./api/fichaPersonagem/FichaContext.tsx";

function App() {
  return (
    <FichaProvider>
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
