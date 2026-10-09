import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext";
import { Itens } from "../../../bibliotecas/Itens";
import { toast } from "react-toastify";
import { calcularLimiteSintonizacao } from "../../../api/fichaPersonagem/fichaEfeitosUtils";

interface AbaItensProps {
  setModalItemAberto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AbaItens({ setModalItemAberto }: AbaItensProps) {
  const { ficha, forceUpdate } = useFicha();

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
    <div  className="inventario-itens-container">
      <h3 className="inventario-titulo">Inventário de Itens</h3>
      <p className="resumo-sintonizacao">
        Sintonizados: {ficha?.getItensSintonizadosEquipados().length ?? 0}/{calcularLimiteSintonizacao(ficha)}
      </p>

      <p>Sintonizar registra o vínculo após cumprir os requisitos e o descanso; desequipar mantém esse vínculo.</p>
      <p><a href={ficha?.versaoRegras === 'DND_2024'
        ? 'https://www.dndbeyond.com/sources/dnd/br-2024/equipment#Attunement'
        : 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/magic-items#Attunement'}>
        Regras de sintonização ({ficha?.versaoRegras === 'DND_2024' ? '2024' : '2014'})</a></p>
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
              {item.sintonizavel && <button onClick={() => {
                if (!ficha.setSintonizarItem(item.id, !ficha.itensSintonizados?.includes(item.id))) toast.error('Limite de sintonização atingido.');
                forceUpdate();
              }}>{ficha.itensSintonizados?.includes(item.id) ? 'Encerrar sintonização' : 'Sintonizar'}</button>}

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
