import React, { useState } from "react";
import { Itens } from "../../bibliotecas/Itens.ts";
import { toast } from "react-toastify";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";
import iconFilter from "../../imagens/filter_alt_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png";
import iconNoFilter from "../../imagens/filter_alt_off_24dp_CCCCCC_FILL0_wght400_GRAD0_opsz24.png";
import "../css/ModalInventarioItens.css";

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
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [escolhido, setEscolhido] = useState<Itens | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroRaridade, setFiltroRaridade] = useState("");
  const [filtroSintonizavel, setFiltroSintonizavel] = useState("");

  const itensUnicos = [
        ...new Map(itens.map(magia => [magia.nome, magia])).values()
    ];

  const traduzirRaridade = (raridade: string) => {
    const mapaRaridade: Record<string, string> = {
      common: "Comum",
      uncommon: "Incomum",
      rare: "Raro",
      "very rare": "Muito raro",
      legendary: "Lendário",
      artifact: "Artefato",
      varies: "Variável",
      none: "Sem raridade",
      unknown: "Desconhecida",
      "unknown (magic)": "Desconhecida (mágica)",
      "unknown rarity": "Raridade desconhecida"
    };

    return mapaRaridade[raridade] ?? raridade;
  };

  const tiposFiltro = [...new Set(itensUnicos.map((item) => item.tipo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const raridadesFiltro = [...new Set(itensUnicos.map((item) => item.raridade).filter(Boolean))]
    .sort((a, b) => traduzirRaridade(a).localeCompare(traduzirRaridade(b), "pt-BR"));

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtroNormalizado = normalizar(filtro);
  const filtroDescricaoNormalizado = normalizar(filtroDescricao);

  const opcoesFiltradas = itensUnicos.filter((opcao) => {
    const nomeNormalizado = normalizar(opcao.nome);
    const nomeInglesNormalizado = normalizar(opcao.nomeIngles ?? "");

    return nomeNormalizado.includes(filtroNormalizado)
      || nomeInglesNormalizado.includes(filtroNormalizado);
  });

  const opcoesComFiltros = () => {
    let opcoes = opcoesFiltradas;

    if (filtroDescricaoNormalizado !== "") {
      opcoes = opcoes.filter((item) => normalizar(item.descricao ?? "").includes(filtroDescricaoNormalizado));
    }

    if (filtroTipo !== "") {
      opcoes = opcoes.filter((item) => item.tipo === filtroTipo);
    }

    if (filtroRaridade !== "") {
      opcoes = opcoes.filter((item) => item.raridade === filtroRaridade);
    }

    if (filtroSintonizavel !== "") {
      opcoes = opcoes.filter((item) => item.sintonizavel === (filtroSintonizavel === "sim"));
    }

    return opcoes;
  };

  const formatarCusto = (valor: number) => {
    if (valor >= 1) {
      const ouros = valor;
      return `${ouros} ouro${ouros === 1 ? '' : 's'}`;
    }
    if (valor >= 0.1) {
      const pratas = valor * 10;
      return `${pratas} prata${pratas === 1 ? '' : 's'}`;
    }
    const cobres = valor * 100;
    return `${cobres} cobre${cobres === 1 ? '' : 's'}`;
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
      {filtrosAbertos && (
        <div className="filtros-itens-modal">
          <h5>Filtro de Itens</h5>
          <div className="selects-filtros-itens">
            <input
              className="lista-itens-input filtro-descricao-input"
              type="text"
              placeholder="Buscar na descrição..."
              value={filtroDescricao}
              onChange={(e) => {
                setFiltroDescricao(e.target.value);
                setFiltrosSelecionados(true);
              }}
            />
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setFiltrosSelecionados(true);
              }}
            >
              <option value="">Selecione um Tipo..</option>
              {tiposFiltro.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <select
              value={filtroRaridade}
              onChange={(e) => {
                setFiltroRaridade(e.target.value);
                setFiltrosSelecionados(true);
              }}
            >
              <option value="">Selecione uma Raridade..</option>
              {raridadesFiltro.map((raridade) => (
                <option key={raridade} value={raridade}>
                  {traduzirRaridade(raridade)}
                </option>
              ))}
            </select>
            <select
              value={filtroSintonizavel}
              onChange={(e) => {
                setFiltroSintonizavel(e.target.value);
                setFiltrosSelecionados(true);
              }}
            >
              <option value="">Sintonização..</option>
              <option value="sim">Sintonizável</option>
              <option value="nao">Não Sintonizável</option>
            </select>
            <button onClick={() => {
              setFiltrosAbertos(false);
              setFiltrosSelecionados(false);
              setFiltroDescricao("");
              setFiltroTipo("");
              setFiltroRaridade("");
              setFiltroSintonizavel("");
            }}>
              <img src={iconNoFilter} className="imagem-nofiltro" alt="" />
            </button>
          </div>
        </div>
      )}
      <div className="popup-body-modal">
        <div className="lista-racas">
          <div className="filtros-itens-barra">
            <input
              className="lista-itens-input"
              type="text"
              placeholder="Filtrar itens..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button className="botao-filtro-itens" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
              <img src={iconFilter} className="imagem-filtro-itens" alt="" />
            </button>
          </div>
          <ul className="lista-itens-modal">
            {(filtrosSelecionados ? opcoesComFiltros() : opcoesFiltradas)
              .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
              .map((item) => (
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
              <p><strong>Preço:</strong> {formatarCusto(escolhido.preco)}</p>
              <p><strong>Peso:</strong> {escolhido.peso} kg</p>
              <p><strong>Raridade:</strong> {traduzirRaridade(escolhido.raridade)}</p>
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
