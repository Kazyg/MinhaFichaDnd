import CriacaoFicha from "./components/CriacaoFicha.tsx";
import InformacoesPersonagem from "./components/InformacoesPersonagem.js";
import PericiasEOutros from "./components/PericiasEOutros.js";
import InventarioMagiasDetalhes from "./components/InventarioMagiasDetalhes.js";
import "./css/criarFicha.css";

export default function CriarFicha() {
  return (
    <div className="criar-ficha">
      <CriacaoFicha />
      <InformacoesPersonagem />
      <PericiasEOutros />
      <InventarioMagiasDetalhes />
    </div>
  );
}
