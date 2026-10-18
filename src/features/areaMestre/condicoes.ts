import { ErroAreaMestre } from './dominio';
import { Combate, CondicaoCombate, DadosCampanha } from './modelos';
import { validarDadosCampanha } from './validacao';

export interface DadosCondicao {
  tipo: string; nomePersonalizado?: string; nivel?: number;
  duracao: 'turnos' | 'manual'; restantes: number | null;
  momento: 'inicio' | 'final'; observacao?: string;
}
export type AcaoCondicao = { tipo: 'adicionar' | 'editar'; id: string; dados: DadosCondicao } | { tipo: 'excluir'; id: string };

/** A edição preserva a ocorrência ignorada: altera restantes, sem reiniciar o turno. */
export function alterarCondicao(dados: DadosCampanha, combateId: string, participanteId: string, acao: AcaoCondicao, agora: string): DadosCampanha {
  validarDadosCampanha(dados);
  if (!['adicionar', 'editar', 'excluir'].includes(acao.tipo)) throw new ErroAreaMestre('dados-invalidos', 'Ação de condição inválida.');
  const combate = dados.combates.find(c => c.id === combateId);
  if (!combate || combate.estado !== 'ativo' || !dados.participantes.some(p => p.id === participanteId && p.combateId === combateId)) {
    throw new ErroAreaMestre('dados-invalidos', 'Participante indisponível neste combate ativo.');
  }
  const condicoes = combate.condicoes ?? [];
  const anterior = condicoes.find(c => c.id === acao.id && c.participanteId === participanteId);
  if (acao.tipo === 'adicionar' ? dados.combates.some(c => (c.condicoes ?? []).some(e => e.id === acao.id)) : !anterior) {
    throw new ErroAreaMestre('dados-invalidos', 'Condição inexistente ou identificador duplicado.');
  }
  let novas: CondicaoCombate[];
  if (acao.tipo === 'excluir') novas = condicoes.filter(c => c.id !== acao.id);
  else {
    const entrada = acao.dados;
    const efeito: CondicaoCombate = { ...entrada, id: acao.id, campanhaId: dados.campanha.id, combateId, participanteId,
      ignorarOcorrencia: anterior ? anterior.ignorarOcorrencia : combate.participanteAtivoId === participanteId ? combate.execucao?.ocorrenciaTurno ?? 0 : null };
    novas = acao.tipo === 'adicionar' ? [...condicoes, efeito] : condicoes.map(c => c.id === acao.id ? efeito : c);
  }
  const resultado = { ...dados, campanha: { ...dados.campanha, atualizadoEm: agora },
    combates: dados.combates.map(c => c.id === combateId ? { ...c, condicoes: novas } : c) };
  validarDadosCampanha(resultado);
  return resultado;
}

/** Chamado somente por avanço real, antes de publicar o próximo turno. */
export function processarCondicoesTurno(combate: Combate, encerrandoId: string, iniciandoId: string, ocorrencia: number): CondicaoCombate[] | undefined {
  return combate.condicoes?.flatMap(c => {
    if (c.duracao === 'manual') return [c];
    const evento = c.momento === 'final' ? ocorrencia : ocorrencia + 1;
    const alvo = c.momento === 'final' ? encerrandoId : iniciandoId;
    if (c.participanteId !== alvo || c.ignorarOcorrencia === evento) return [c];
    return c.restantes === 1 ? [] : [{ ...c, restantes: c.restantes! - 1 }];
  });
}
