import React from "react";

interface Props { nome: string; descricao: string; versao?: string; }

const paragrafos = (texto: string) => texto.trim().split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);

export function resumirDescricao(descricao: string): string[] {
  const frases = paragrafos(descricao).flatMap(p => p.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú])/));
  const praticas = frases.filter(frase => !/^(?:Por exemplo[,,:]|Consulte o capítulo|A palavra em idioma comum|Esses sonhos na verdade)/i.test(frase));
  const conteudo = praticas.length ? praticas : frases;
  return conteudo.slice(0, 3);
}

export default function DescricaoCaracteristica({ nome, descricao, versao }: Props) {
  let resumo: string[] | undefined;
  if (nome === "Conjuração de Mago" && versao === "DND_2014") {
    resumo = [
      "Truques: escolha 3 da lista de mago no 1º nível; aprenda mais conforme a tabela da classe.",
      "Grimório: comece com 6 magias de mago de 1º círculo à escolha; truques não ficam no grimório.",
      "Preparação: escolha magias do grimório em quantidade igual a Inteligência (modificador) + nível de mago, mínimo 1, de círculos para os quais tenha espaços.",
      "Conjuração: gaste um espaço do círculo da magia ou superior. Conjurar não remove a preparação. Recupere todos os espaços após descanso longo.",
      "Troque a lista preparada após descanso longo, estudando o grimório por pelo menos 1 minuto por círculo de cada magia preparada.",
      "Inteligência: CD = 8 + proficiência + modificador; ataque de magia = proficiência + modificador.",
      "Rituais: magias com o descritor ritual no grimório dispensam preparação. Você pode usar um foco arcano."
    ];
  } else if (nome === "Visão no Escuro") {
    const inicio = descricao.search(/Você (?:pode enxergar|enxerga)/i);
    if (inicio > 0) resumo = [descricao.slice(inicio)];
  }
  const blocos = paragrafos(descricao);
  const longo = descricao.length > 420 || blocos.length > 3;
  if (!resumo && longo) resumo = resumirDescricao(descricao);
  const formatar = (texto: string) => texto.split(/(\*\*.*?\*\*)/g).map((parte, i) => parte.startsWith("**") ? <strong key={i}>{parte.slice(2, -2)}</strong> : parte);
  return <div className="descricao descricao-caracteristica">
    {resumo ? <><ul>{resumo.map(item => <li key={item}>{formatar(item)}</li>)}</ul><details><summary>Descrição completa{longo ? " e demais regras" : ""}</summary>{blocos.map((p, i) => <p key={i}>{formatar(p)}</p>)}</details></> : blocos.map((p, i) => <p key={i}>{formatar(p)}</p>)}
  </div>;
}
