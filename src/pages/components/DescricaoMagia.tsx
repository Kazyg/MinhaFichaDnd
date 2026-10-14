import React from 'react';
import type { MagiaConteudo } from '../../api/rulesets/types';

export function descricaoMagia(magia?: MagiaConteudo, snapshot?: MagiaConteudo) {
  const descricao = magia?.resumoVerificado ?? (magia ?? snapshot)?.descricao;
  return descricao && !/Descrição legada indisponível|índice verificado|Consulte a descrição no SRD/.test(descricao)
    ? descricao : 'Os detalhes desta magia ainda não estão disponíveis. Consulte sua descrição no livro da edição correspondente.';
}

export const propriedadeMagiaDisponivel = (texto?: string) => !!texto?.trim() && !/Consultar fonte/i.test(texto);

export default function DescricaoMagia({ magia, snapshot }: { magia?: MagiaConteudo; snapshot?: MagiaConteudo }) {
  return <p>{descricaoMagia(magia, snapshot)}</p>;
}
