import React, { useState } from "react";
import { Itens } from "../../bibliotecas/Itens.ts";
import { toast } from "react-toastify";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";

interface ModalEscolherItemProps {
  itens: Itens[];
  onClose: () => void;
  onAdicionarItem: (item: Itens) => void;
}

export default function ModalEscolherItem({
  itens,
  onClose,
  onAdicionarItem
}: ModalEscolherItemProps) {
  const { ficha } = useFicha();
  const [filtro, setFiltro] = useState("");
  const [escolhido, setEscolhido] = useState<Itens | null>(null);

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const opcoesFiltradas = [...itens]
    .sort((a, b) => normalizar(a.nome).localeCompare(normalizar(b.nome)))
    .filter((item) => normalizar(item.nome).includes(normalizar(filtro)));

  const formatarCusto = (valor: number) => {
    if (valor >= 1) return `${valor} ouro`;
    if (valor >= 0.1) return `${valor * 10} prata`;
    return `${valor * 100} cobre`;
  };

  const temDinheiroSuficiente = (custo: number) => {
    const totalGp = (ficha?.ouro ?? 0) + (ficha?.prata ?? 0) / 10 + (ficha?.cobre ?? 0) / 100;
    return totalGp >= custo;
  };

  const descontarCusto = (custo: number) => {
    let ouro = ficha?.ouro ?? 0;
    let prata = ficha?.prata ?? 0;
    let cobre = ficha?.cobre ?? 0;

    let totalCobre = Math.round(ouro * 100 + prata * 10 + cobre);
    const custoCobre = Math.round(custo * 100);

    if (totalCobre < custoCobre) {
      toast.error('Você não tem dinheiro suficiente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }

    totalCobre -= custoCobre;

    const novoOuro = Math.floor(totalCobre / 100);
    const novoPrata = Math.floor((totalCobre % 100) / 10);
    const novoCobre = totalCobre % 10;

    ficha?.adicionarOuro(novoOuro - ouro);
    ficha?.adicionarPrata(novoPrata - prata);
    ficha?.adicionarCobre(novoCobre - cobre);

    return true;
  };

  const comprarItem = () => {
    if (!escolhido) return;

    if (!temDinheiroSuficiente(escolhido.preco)) {
      toast.error("Você não tem dinheiro suficiente para comprar este item.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (descontarCusto(escolhido.preco)) {
      onAdicionarItem(escolhido);
      onClose();
    }
  };

  return (
    <div className="popup-content-modal">
      <h2>Selecione um Item</h2>
      <div className="popup-body-modal">
        <div className="lista-racas">
          <input
            type="text"
            placeholder="Filtrar itens..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <ul>
            {opcoesFiltradas.map((item) => (
              <li key={item.nome} onClick={() => setEscolhido(item)}>
                <strong>{item.nome}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="detalhes-raca">
          {escolhido && (
            <>
              <h3>{escolhido.nome}</h3>
              <p><strong>Tipo:</strong> {escolhido.tipo}</p>
              <p><strong>Preço:</strong> {escolhido.preco} moedas de ouro</p>
              <p><strong>Peso:</strong> {escolhido.peso} kg</p>
              <p><strong>Raridade:</strong> {escolhido.raridade}</p>
              <p><strong>Sintonizável:</strong> {escolhido.sintonizavel ? "Sim" : "Não"}</p>
              <p><strong>Descrição:</strong> {escolhido.descricao}</p>
            </>
          )}
        </div>
      </div>
      <div className="popup-footer-itens">
        {escolhido && (
          <>
            <button className="escolher-button" onClick={comprarItem}>
              Comprar {escolhido.nome}
            </button>
            <button className="escolher-button" onClick={() => {
              onAdicionarItem(escolhido);
              onClose();
            }}>
              Pegar {escolhido.nome}
            </button>
          </>
        )}
        <button className="escolher-button" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
