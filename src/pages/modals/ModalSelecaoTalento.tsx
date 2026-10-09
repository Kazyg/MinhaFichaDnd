import React, { useState } from "react";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx";
import {
  Talentos2024,
  EscolhasTalento,
  camposTalento,
  nomeExibicao,
  normalizarRegra,
} from "../../bibliotecas/Catalogo2024.ts";
import {
  talento2024,
  requisitosTalento,
  validarEscolhasTalento,
  proficiencia2024,
} from "../../api/fichaPersonagem/talentos2024Utils.ts";

interface ModalSelecaoProps {
  opcoes: { nome: string; descricao: string }[];
  titulo: string;
  onClose: () => void;
  onSelect: (opcao: {
    nome: string;
    descricao: string;
    escolhasTalento?: EscolhasTalento;
  }) => void;
  talentoInicial: { nome: string; descricao: string } | null;
  nivel?: number;
  tituloEfeito?: string;
}

export default function ModalSelecaoTalento({
  opcoes = [],
  titulo,
  onClose,
  onSelect,
  talentoInicial,
  nivel,
  tituloEfeito,
}: ModalSelecaoProps) {
  const { ficha } = useFicha();
  const [filtro, setFiltro] = useState("");
  const [edicao, setEdicao] = useState(
    talentoInicial && !talentoInicial.nome.startsWith("2024: ")
      ? "legado"
      : "2024",
  );
  const [categoria, setCategoria] = useState("");
  const [selecionado, setSelecionado] = useState(talentoInicial);
  const [escolhas, setEscolhas] = useState<EscolhasTalento>(
    ficha?.efeitos?.find((e) => e.tituloEfeito === tituloEfeito)
      ?.escolhasTalento || {},
  );
  const nivelEscolha = nivel ?? ficha?.levelTotal ?? 1;
  const t = talento2024(selecionado?.nome || "");
  const erros = t
    ? validarEscolhasTalento(t, escolhas, ficha, nivelEscolha, tituloEfeito)
    : [];
  const lista =
    edicao === "2024"
      ? Talentos2024
      : opcoes.filter((o) => !o.nome.startsWith("2024: "));
  const opcoesFiltradas = lista.filter(
    (o) =>
      normalizarRegra(nomeExibicao(o.nome)).includes(normalizarRegra(filtro)) &&
      (!categoria || talento2024(o.nome)?.categoria === categoria),
  );
  return (
    <div className="popup-content-modal">
      <h2>{titulo}</h2>
      <label>
        Edição{" "}
        <select
          aria-label="Edição dos talentos"
          value={edicao}
          onChange={(e) => {
            setEdicao(e.target.value);
            setSelecionado(null);
            setEscolhas({});
            setCategoria("");
          }}
        >
          <option value="2024">Livro do Jogador 2024</option>
          <option value="legado">Legado</option>
        </select>
      </label>
      {edicao === "2024" && (
        <label>
          Categoria{" "}
          <select
            aria-label="Categoria dos talentos"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {["Origem", "Geral", "Estilo de Luta", "Dádiva Épica"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      )}
      <div className="popup-body-modal">
        <div className="lista-racas">
          <input
            aria-label="Filtrar talentos"
            placeholder="Filtrar talentos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <ul>
            {opcoesFiltradas.map((o) => {
              const regra = talento2024(o.nome);
              const motivos = regra
                ? requisitosTalento(regra, ficha, nivelEscolha, tituloEfeito)
                : [];
              return (
                <li key={o.nome}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelecionado(o);
                      setEscolhas(
                        o.nome === talentoInicial?.nome
                          ? ficha?.efeitos?.find(
                              (e) => e.tituloEfeito === tituloEfeito,
                            )?.escolhasTalento || {}
                          : {},
                      );
                    }}
                  >
                    {nomeExibicao(o.nome)}
                    {motivos.length ? " (requisitos pendentes)" : ""}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="detalhes-raca">
          {selecionado && (
            <>
              <h3>{nomeExibicao(selecionado.nome)}</h3>
              {t && (
                <p>
                  {t.categoria}
                  {t.preRequisito ? ` • Pré-requisito: ${t.preRequisito}` : ""}
                  {t.repetivel ? " • Repetível" : ""}
                </p>
              )}
              <p>{selecionado.descricao}</p>
              {t &&
                camposTalento(t, escolhas, proficiencia2024(ficha)).map(
                  (campo) => (
                    <fieldset key={campo.chave}>
                      <legend>{campo.rotulo}</legend>
                      {Array.from({ length: campo.quantidade }, (_, i) => (
                        <label key={i}>
                          {campo.quantidade > 1 ? `${i + 1}. ` : ""}
                          <select
                            aria-label={`${campo.rotulo} ${i + 1}`}
                            value={escolhas[campo.chave]?.[i] || ""}
                            onChange={(e) =>
                              setEscolhas((prev) => {
                                const valores = [...(prev[campo.chave] || [])];
                                valores[i] = e.target.value;
                                return {
                                  ...prev,
                                  [campo.chave]: valores,
                                  ...(campo.chave === "lista"
                                    ? { truques: [], magias: [] }
                                    : {}),
                                };
                              })
                            }
                          >
                            <option value="">Selecione...</option>
                            {campo.opcoes.map((v) => (
                              <option key={v} value={v}>
                                {nomeExibicao(v)}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </fieldset>
                  ),
                )}
              {!!erros.length && (
                <ul aria-label="Pendências do talento">
                  {erros.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      <div className="popup-footer">
        {selecionado && (
          <button
            className="escolher-button"
            disabled={!!erros.length}
            onClick={() => {
              onSelect({
                ...selecionado,
                escolhasTalento: t ? escolhas : undefined,
              });
              onClose();
            }}
          >
            Escolher {nomeExibicao(selecionado.nome)}
          </button>
        )}
        <button className="escolher-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
