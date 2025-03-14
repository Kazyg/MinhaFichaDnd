import CriacaoFicha from "./components/CriacaoFicha.tsx";
import InformacoesPersonagem from "./components/InformacoesPersonagem.js";
import PericiasEOutros from "./components/PericiasEOutros.js";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes.js";
import "./css/criarFicha.css";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx";


export default function CriarFicha() {

  const { ficha } = useFicha();
  if (!ficha) {
    return <div>Carregando ficha...</div>; // Ou redirecione para a página inicial
  }

  return (
    <div className="criar-ficha">
      <CriacaoFicha />
      <InformacoesPersonagem />
      <PericiasEOutros />
      <InventarioMagiasDetalhes />
    </div>
  );
}
