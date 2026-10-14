import React from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext";
import { Itens } from "../../../bibliotecas/Itens";
import { toast } from "react-toastify";
import { calcularLimiteSintonizacao } from "../../../api/fichaPersonagem/fichaEfeitosUtils";
import { equipamentoDoItem, itemEstaEquipado } from '../../../api/fichaPersonagem/fichaEquipamentosMagicos';
import PropriedadesMagicas from './PropriedadesMagicas';

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

  const itemEquipado = (item: Itens) => itemEstaEquipado(ficha, item);

  const alternarEquipamentoItem = (item: Itens) => {
    if (!ficha) return;

    if (itemEquipado(item)) {
      ficha.setDesequiparItem(item.id);
      forceUpdate();
      return;
    }

    if (!ficha.setEquiparItem(item)) toast.error('Não há mãos livres suficientes ou equipamento vinculado disponível.');
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
                {item.vinculoEquipamento && ficha && <span className="info-badge magia-equipamento-badge">Vinculado a {equipamentoDoItem(ficha, item)?.nome}</span>}
                {item.equipamentoMagico?.edicao && <span className="info-badge">Regras {item.equipamentoMagico.edicao.replace('DND_', '')}</span>}
              </div>
              {item.equipamentoMagico?.modo === 'melhoria' && !item.vinculoEquipamento && <p className="magia-equipamento-nota">Associe este item na aba {item.equipamentoMagico.tipo === 'arma' ? 'Armas' : 'Armaduras'}.</p>}
              {item.equipamentoMagico?.modo === 'especifico' && !item.vinculoEquipamento && item.equipamentoMagico.basesCompativeis && <label className="vinculacao-magica">
                Equipamento base
                <select aria-label={`Equipamento base para ${item.nome}`} value="" onChange={event => { ficha.selecionarBaseEquipamentoMagico(item.id, event.target.value); forceUpdate(); }}>
                  <option value="">Escolher tipo compatível</option>
                  {item.equipamentoMagico.basesCompativeis.map(nome => <option key={nome} value={nome}>{nome}</option>)}
                </select>
              </label>}
              <PropriedadesMagicas item={item} />
            </div>
            <div className="acoes-item">
              {item.sintonizavel && <button className="botao-sintonizar-item" aria-pressed={ficha.itensSintonizados?.includes(item.id) ?? false} onClick={() => {
                if (!ficha.setSintonizarItem(item.id, !ficha.itensSintonizados?.includes(item.id))) toast.error('Limite de sintonização atingido.');
                forceUpdate();
              }}>{ficha.itensSintonizados?.includes(item.id) ? 'Dessintonizar' : 'Sintonizar'}</button>}

              <button
                className="botao-equipar-item"
                disabled={!!item.equipamentoMagico && !item.vinculoEquipamento}
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
