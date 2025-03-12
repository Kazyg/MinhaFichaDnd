import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CriarFicha from "./pages/criarFicha";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar-ficha" element={<CriarFicha />} />
      </Routes>
    </Router>
  );
}

export default App;
