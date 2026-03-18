import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import { Itens } from "../../../bibliotecas/Itens.ts";
import { toast } from "react-toastify";
import { calcularLimiteSintonizacao } from "../../../api/fichaPersonagem/fichaEfeitosUtils.ts";

interface AbaItensProps {
  setModalItemAberto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AbaItens({ setModalItemAberto }: AbaItensProps) {
  const { ficha, refreshKey, forceUpdate } = useFicha();

  const alterarMoeda = (tipo: string, quantidade: number) => {
    switch (tipo) {
      case "ouro":
        ficha?.adicionarOuro(quantidade);
        break;
      case "prata":
        ficha?.adicionarPrata(quantidade);
        break;
      case "cobre":
        ficha?.adicionarCobre(quantidade);
        break;
      default:
        break;
    }
    forceUpdate();
  };

  const itemEquipado = (item: Itens) => ficha?.itensEquipados?.some((equipado) => equipado.id === item.id) ?? false;

  const alternarEquipamentoItem = (item: Itens) => {
    if (!ficha) return;

    if (itemEquipado(item)) {
      ficha.setDesequiparItem(item.id);
      forceUpdate();
      return;
    }

    if (item.sintonizavel) {
      const limiteSintonizacao = calcularLimiteSintonizacao(ficha);
      const quantidadeSintonizados = ficha.getItensSintonizadosEquipados().length;
      if (quantidadeSintonizados >= limiteSintonizacao) {
        toast.error(`Você já atingiu o limite de ${limiteSintonizacao} itens sintonizados.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }

    ficha.setEquiparItem(item);
    forceUpdate();
  };

  const botoesMoeda = (tipo: string, valor: number | undefined) => (
    <div className="linha-moeda">
      <span>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}: {valor ?? 0}</span>
      <div className="botoes-moeda">
        <button onClick={() => alterarMoeda(tipo, -100)}>-100</button>
        <button onClick={() => alterarMoeda(tipo, -10)}>-10</button>
        <button onClick={() => alterarMoeda(tipo, -1)}>-1</button>
        <button onClick={() => alterarMoeda(tipo, 1)}>+1</button>
        <button onClick={() => alterarMoeda(tipo, 10)}>+10</button>
        <button onClick={() => alterarMoeda(tipo, 100)}>+100</button>
      </div>
    </div>
  );

  return (
    <div key={refreshKey} className="inventario-itens-container">
      <h3 className="inventario-titulo">Inventário de Itens</h3>
      <p className="resumo-sintonizacao">
        Sintonizados: {ficha?.getItensSintonizadosEquipados().length ?? 0}/{calcularLimiteSintonizacao(ficha)}
      </p>

      <div className="controle-moedas">
        {botoesMoeda("ouro", ficha?.ouro)}
        {botoesMoeda("prata", ficha?.prata)}
        {botoesMoeda("cobre", ficha?.cobre)}
      </div>

      <button className="adicionar-item" onClick={() => setModalItemAberto(true)}>
        Adicionar Novo Item
      </button>

      <ul className="lista-itens">
        {ficha?.itensMochila?.map((item) => (
          <li key={item.id} className="item-lista">
            <div className="detalhes-item">
              <h4>{item.nome}</h4>
              <div className="meta-item-linha">
                {itemEquipado(item) && <span className="status-item-equipado">Equipado</span>}
                {item.sintonizavel && <span className="status-item-sintonizavel">Sintonizável</span>}
              </div>
            </div>
            <div className="acoes-item">
              <button
                className="botao-equipar-item"
                onClick={() => alternarEquipamentoItem(item)}
              >
                {itemEquipado(item) ? "Desequipar" : "Equipar"}
              </button>
              <button
                className="botao-excluir-item"
                onClick={() => {
                  ficha.excluirItem(item.id);
                  forceUpdate();
                }}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
