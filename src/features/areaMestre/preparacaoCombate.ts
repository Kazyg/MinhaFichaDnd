import { ErroAreaMestre, validarId, validarPV } from './dominio';
import { DadosCampanha, InstanciaFicha } from './modelos';
import { validarDadosCampanha } from './validacao';

/** Cópias locais: nenhum item do rascunho é gravado antes da confirmação. */
export interface ParticipantePreparacao {
  id: string;
  instancia: InstanciaFicha;
  iniciativa: number;
}
export interface RascunhoPreparacaoCombate { participantes: ParticipantePreparacao[]; nome?: string }
export type RascunhoPreparacao = RascunhoPreparacaoCombate;

function exigir(condicao: unknown, mensagem: string): asserts condicao {
  if (!condicao) throw new ErroAreaMestre('dados-invalidos', mensagem);
}

/** A posição de inclusão desempata iniciativas iguais, inclusive após edição. */
export function ordenarParticipantesPreparacao(participantes: readonly ParticipantePreparacao[]): ParticipantePreparacao[] {
  return participantes.map((participante, indice) => ({ participante, indice }))
    .sort((a, b) => b.participante.iniciativa - a.participante.iniciativa || a.indice - b.indice)
    .map(item => item.participante);
}

/**
 * Monta uma única unidade transacional, sem alterar a campanha nem o rascunho.
 * O repositório existente deve salvar este agregado uma única vez, sob revisão.
 * Avulsos confirmados permanecem instâncias comuns da campanha; cancelar não
 * chama este serviço e descarta suas cópias. Preparados não reservam instâncias:
 * a exclusividade simultânea aplica-se aos encontros ativos.
 */
export function confirmarPreparacao(
  dados: DadosCampanha, rascunho: RascunhoPreparacaoCombate, combateId: string, confirmadoEm: string,
): DadosCampanha {
  validarDadosCampanha(dados);
  validarId(combateId);
  exigir(rascunho.nome === undefined || (typeof rascunho.nome === 'string' && rascunho.nome.trim().length <= 200), 'Informe um nome de até 200 caracteres.');
  exigir(!dados.combates.some(c => c.id === combateId), 'O identificador do encontro já existe.');
  exigir(Array.isArray(rascunho.participantes) && rascunho.participantes.length >= 2, 'Selecione pelo menos dois participantes.');
  const ids = new Set(dados.participantes.map(p => p.id));
  const instanciasSelecionadas = new Map<string, InstanciaFicha>();
  const encontrosAtivos = new Set(dados.combates.filter(c => c.estado === 'ativo').map(c => c.id));
  const instanciasAtivas = new Set(dados.participantes.filter(p => encontrosAtivos.has(p.combateId)).map(p => p.instanciaId));
  for (const participante of rascunho.participantes) {
    validarId(participante.id);
    exigir(!ids.has(participante.id), 'Há identificadores de participantes duplicados.');
    ids.add(participante.id);
    exigir(Number.isSafeInteger(participante.iniciativa), 'A iniciativa deve ser um número inteiro válido.');
    const instancia = participante.instancia;
    validarId(instancia.id);
    validarPV(instancia.pv);
    exigir(!instanciasSelecionadas.has(instancia.id), 'A mesma instância não pode entrar duas vezes no encontro.');
    exigir(!instanciasAtivas.has(instancia.id), 'Esta instância já participa de um combate ativo.');
    exigir(instancia.campanhaId === dados.campanha.id, 'O participante deve pertencer a esta campanha.');
    exigir(typeof instancia.nome === 'string' && instancia.nome.trim().length > 0, 'Informe o nome do participante.');
    const existente = dados.instancias.find(i => i.id === instancia.id);
    exigir(!existente || (existente.fichaOriginalId === instancia.fichaOriginalId && existente.categoria === instancia.categoria && existente.campanhaId === instancia.campanhaId), 'A referência da instância existente não pode ser alterada.');
    instanciasSelecionadas.set(instancia.id, { ...instancia, nome: instancia.nome.trim(), pv: { ...instancia.pv } });
  }
  const ordenados = ordenarParticipantesPreparacao(rascunho.participantes);
  const resultado: DadosCampanha = {
    ...dados,
    campanha: { ...dados.campanha, atualizadoEm: confirmadoEm },
    instancias: [...dados.instancias.map(i => instanciasSelecionadas.get(i.id) ?? i),
      ...Array.from(instanciasSelecionadas.values()).filter(i => !dados.instancias.some(atual => atual.id === i.id))],
    combates: [...dados.combates, { id: combateId, nome: rascunho.nome?.trim() || `Combate ${dados.combates.length + 1}`, campanhaId: dados.campanha.id, estado: 'preparado', rodada: 0,
      participanteAtivoId: null, iniciadoEm: confirmadoEm, encerradoEm: null }],
    participantes: [...dados.participantes, ...ordenados.map((p, ordem) => ({ id: p.id, combateId,
      instanciaId: p.instancia.id, iniciativa: p.iniciativa, ordem, pvInicio: { ...p.instancia.pv } }))],
  };
  validarDadosCampanha(resultado);
  return resultado;
}
