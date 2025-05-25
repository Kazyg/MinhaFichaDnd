import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import { Itens } from "../../../bibliotecas/Itens.ts";

export default function AbaItens({ setModalItemAberto }) {
  const { ficha, refreshKey, forceUpdate } = useFicha();

  const alterarMoeda = (tipo, quantidade) => {
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

  const botoesMoeda = (tipo, valor) => (
    <div className="linha-moeda">
      <span>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}: {valor}</span>
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
      <h3>Inventário de Itens</h3>

      <div className="controle-moedas">
        {botoesMoeda("ouro", ficha?.ouro)}
        {botoesMoeda("prata", ficha?.prata)}
        {botoesMoeda("cobre", ficha?.cobre)}
      </div>

      <button className="adicionar-item" onClick={() => setModalItemAberto(true)}>
        Adicionar Novo Item
      </button>

      <ul className="lista-itens">
        {ficha?.itensMochila?.map((item, index) => (
          <li key={item.id} className="item-lista">
            <div className="detalhes-item">
              <h4>{item.nome}</h4>
            </div>
            <button
              className="botao-excluir-item"
              onClick={() => {
                ficha.excluirItem(item.id);
                forceUpdate();
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
