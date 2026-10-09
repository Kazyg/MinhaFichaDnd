import AccessibleDialog from "../AccessibleDialog";
import React, { useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext";
import { selecionarEscolhasMagia } from '../../../api/fichaPersonagem/fichaConjuracao';
import { getTalentosConteudo, resolverMagiaSalva, rotuloConteudo } from '../../../api/rulesets/conteudo';
import { descreverTalentoSalvo } from '../../../api/fichaPersonagem/talentosConteudo';


type DetalheItem = {
  nome: string;
  id?: string;
  tipo: "talento" | "magia";
  descricao: string;
  subtitulo?: string;
  detalhes?: string[];
};

const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const adicionarItemUnico = (
  mapa: Map<string, DetalheItem>,
  item: DetalheItem | null
) => {
  if (!item?.nome?.trim()) return;
  const chave = `${item.tipo}-${item.id ?? normalizar(item.nome)}`;
  if (!mapa.has(chave)) {
    mapa.set(chave, item);
  }
};

export default function AbaDetalhes() {
  const { ficha } = useFicha();
  const [detalheSelecionado, setDetalheSelecionado] = useState<DetalheItem | null>(null);

  const talentosSelecionados = (() => {
    const itens = new Map<string, DetalheItem>();
    const Talentos = getTalentosConteudo(ficha?.versaoRegras ?? "DND_2014");

    ficha?.talentos?.forEach(nome => adicionarItemUnico(itens, {
      nome, tipo: 'talento', descricao: `Talento legado sem revisão identificada: ${nome}. Referência original preservada; revisão manual pendente.`,
    }));
    ficha?.efeitos?.forEach(efeito => {
      if (!efeito.talento) return;
      adicionarItemUnico(itens, { nome: efeito.talento, id: efeito.id, tipo: 'talento', descricao: descreverTalentoSalvo(efeito) });
    });

    ficha?.racaPrincipal?.tracos?.forEach((traco) => {
      adicionarItemUnico(itens, {
        nome: traco.traco,
        tipo: "talento",
        descricao: traco.descricao,
        subtitulo: ficha?.racaPrincipal?.nome ? `Raça: ${ficha.racaPrincipal.nome}` : undefined,
      });
    });

    ficha?.subRaca?.tracos?.forEach((traco) => {
      adicionarItemUnico(itens, {
        nome: traco.traco,
        tipo: "talento",
        descricao: traco.descricao,
        subtitulo: ficha?.subRaca?.nome ? `Sub-raça: ${ficha.subRaca.nome}` : undefined,
      });
    });

    if (ficha?.backGround?.caracteristicas) {
      adicionarItemUnico(itens, {
        nome: ficha.backGround.caracteristicas.nome,
        tipo: "talento",
        descricao: ficha.backGround.caracteristicas.descricao,
        subtitulo: ficha.backGround.nome ? `Background: ${ficha.backGround.nome}` : undefined,
      });
    }

    ficha?.classePrincipal?.niveis?.forEach((nivel) => {
      if (nivel.nivel > (ficha?.levelTotal || 0)) return;
      nivel.caracteristicas?.forEach((caracteristica) => {
        const talentoEncontrado = Talentos.find(
          (talento) => normalizar(talento.nome) === normalizar(caracteristica)
        );

        adicionarItemUnico(itens, {
          nome: caracteristica,
          tipo: "talento",
          descricao: talentoEncontrado?.descricao?.trim() || "Descrição não encontrada.",
          subtitulo: ficha?.classePrincipal?.nome
            ? `Classe: ${ficha.classePrincipal.nome} • Nível ${nivel.nivel}`
            : `Nível ${nivel.nivel}`,
        });
      });
    });

    ficha?.subClasse?.forEach((registro) => {
      adicionarItemUnico(itens, {
        nome: registro.subclasse.nome,
        tipo: "talento",
        descricao: registro.subclasse.descricao,
        subtitulo: registro.classe?.nome ? `Subclasse de ${registro.classe.nome}` : "Subclasse",
      });

      registro.subclasse.niveis?.forEach((nivel) => {
        if (nivel.nivel > (ficha?.levelTotal || 0)) return;
        adicionarItemUnico(itens, {
          nome: nivel.nome,
          tipo: "talento",
          descricao: nivel.descricao,
          subtitulo: `${registro.subclasse.nome} • Nível ${nivel.nivel}`,
        });
      });
    });

    ficha?.patrono?.habilidades?.forEach((habilidade) => {
      adicionarItemUnico(itens, {
        nome: habilidade.nome,
        tipo: "talento",
        descricao: habilidade.descricao,
        subtitulo: ficha?.patrono?.nome ? `Patrono: ${ficha.patrono.nome}` : "Patrono",
      });
    });

    return Array.from(itens.values())
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  })();

  const magiasSelecionadas = (() => {
    return selecionarEscolhasMagia(ficha)
      .map((escolha) => {
        const nome = escolha.nome;
        const magiaEncontrada = resolverMagiaSalva(escolha);

        const alcanceBase = magiaEncontrada?.alcance?.tipo
          ? `${magiaEncontrada.alcance.tipo}${
              magiaEncontrada.alcance.distancia && magiaEncontrada.alcance.distancia > 1
                ? ` ${magiaEncontrada.alcance.distancia} metros`
                : ""
            }`
          : undefined;

        const componentes = magiaEncontrada?.componentes?.componentes?.length
          ? `${magiaEncontrada.componentes.componentes.join(", ")}${
              magiaEncontrada.componentes.material
                ? ` (${magiaEncontrada.componentes.material})`
                : ""
            }`
          : undefined;

        return {
          nome, id: escolha.id,
          tipo: "magia" as const,
          descricao: magiaEncontrada ? `${!escolha.conteudo ? 'Registro legado catalogo-2014 preservado. ' : ''}${rotuloConteudo(magiaEncontrada)}\n${magiaEncontrada.descricao}` : `Revisão desconhecida, sem fallback. Snapshot preservado: ${escolha.snapshot?.descricao ?? 'indisponível'}`,
          subtitulo:
            magiaEncontrada?.nivel !== undefined && magiaEncontrada?.tipo
              ? `Nível ${magiaEncontrada.nivel} • ${magiaEncontrada.tipo}`
              : undefined,
          detalhes: [
            magiaEncontrada?.conjuracao ? `Conjuração: ${magiaEncontrada.conjuracao}` : "",
            alcanceBase ? `Alcance: ${alcanceBase}` : "",
            componentes ? `Componentes: ${componentes}` : "",
            magiaEncontrada?.duracao
              ? `Duração: ${magiaEncontrada.concentracao ? "concentração, " : ""}${magiaEncontrada.duracao}`
              : "",
          ].filter(Boolean),
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  })();

  return (
    <div className="detalhes-personagem-container">
      <div className="detalhes-secao">
        <div className="detalhes-secao-topo">
          <h3 className="detalhes-titulo">Talentos</h3>
          <span className="detalhes-contador">{talentosSelecionados.length}</span>
        </div>
        {talentosSelecionados.length > 0 ? (
          <div className="detalhes-lista">
            {talentosSelecionados.map((item) => (
              <button
                key={`talento-${item.id ?? item.nome}`}
                className="detalhes-linha"
                onClick={() => setDetalheSelecionado(item)}
              >
                <strong>{item.nome}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p className="detalhes-vazio">Nenhum talento selecionado.</p>
        )}
      </div>

      <div className="detalhes-secao">
        <div className="detalhes-secao-topo">
          <h3 className="detalhes-titulo">Magias</h3>
          <span className="detalhes-contador">{magiasSelecionadas.length}</span>
        </div>
        {magiasSelecionadas.length > 0 ? (
          <div className="detalhes-lista">
            {magiasSelecionadas.map((item) => (
              <button
                key={`magia-${item.id}`}
                className="detalhes-linha"
                onClick={() => setDetalheSelecionado(item)}
              >
                <strong>{item.nome}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p className="detalhes-vazio">Nenhuma magia aprendida.</p>
        )}
      </div>

      {detalheSelecionado && (
        <>
          <div className="popup-overlay" onClick={() => setDetalheSelecionado(null)}></div>
          <div className="popup popup-detalhes-item">
            <AccessibleDialog className="popup-content-modal" aria-label={detalheSelecionado.nome} onClose={() => setDetalheSelecionado(null)}>
              <h2>{detalheSelecionado.nome}</h2>
              {detalheSelecionado.subtitulo && (
                <p className="detalhes-popup-subtitulo">{detalheSelecionado.subtitulo}</p>
              )}
              {detalheSelecionado.detalhes?.length ? (
                <div className="detalhes-popup-meta">
                  {detalheSelecionado.detalhes.map((detalhe) => (
                    <p key={detalhe}>{detalhe}</p>
                  ))}
                </div>
              ) : null}
              <div className="detalhes-popup-descricao">
                {detalheSelecionado.descricao
                  .split("\n")
                  .map((linha) => linha.trim())
                  .filter(Boolean)
                  .map((linha, index) => (
                    <p key={`${detalheSelecionado.nome}-${index}`}>{linha}</p>
                  ))}
              </div>
              <div className="popup-footer">
                <button className="escolher-button" onClick={() => setDetalheSelecionado(null)}>
                  Fechar
                </button>
              </div>
            </AccessibleDialog>
          </div>
        </>
      )}
    </div>
  );
}
