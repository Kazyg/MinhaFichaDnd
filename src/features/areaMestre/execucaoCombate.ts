import { processarCondicoesTurno } from './condicoes';
import { ErroAreaMestre, validarId } from './dominio';
import { Combate, DadosCampanha, InstanciaFicha, ParticipanteCombate } from './modelos';
import { validarDadosCampanha } from './validacao';

export interface EntradaCombatente { id: string; instancia: InstanciaFicha; iniciativa?: number }
export type AcaoExecucaoCombate = 'iniciar' | 'avancar' | { ordem: string[] } | { adicionar: EntradaCombatente };
const exigir = (condicao: unknown, mensagem: string) => {
  if (!condicao) throw new ErroAreaMestre('dados-invalidos', mensagem);
};


export function migrarOrigemSnapshot(combate: Combate): Combate {
  if (!combate.execucao || combate.execucao.origemSnapshot) return combate;
  return { ...combate, execucao: { ...combate.execucao,
    origemSnapshot: combate.execucao.ativadoEm !== combate.iniciadoEm ? 'ativacao' : 'legado' } };
}


export function migrarExecucaoLegada(combate: Combate, participantes: ParticipanteCombate[]): Combate {
  if (combate.estado !== 'ativo' || combate.execucao) return combate;
  const ordem = participantes.filter(p => p.combateId === combate.id).sort((a, b) => a.ordem - b.ordem);
  const indice = ordem.findIndex(p => p.id === combate.participanteAtivoId);
  return { ...combate, execucao: { versao: 1, origemSnapshot: 'legado', ativadoEm: combate.iniciadoEm,
    visitados: ordem.slice(0, indice + 1).map(p => p.id),
    pvAtivacao: ordem.map(p => ({ participanteId: p.id, instanciaId: p.instanciaId, pv: { ...p.pvInicio } })) } };
}


export function executarAcaoCombate(dados: DadosCampanha, combateId: string, acao: AcaoExecucaoCombate, agora: string): DadosCampanha {
  validarDadosCampanha(dados);
  const original = dados.combates.find(c => c.id === combateId);
  exigir(original, 'Encontro não encontrado.');
  if (!original) throw new Error('Encontro não encontrado.');
  let combate = migrarExecucaoLegada(original, dados.participantes);
  let participantes = dados.participantes;
  let instancias = dados.instancias;
  const ordem = participantes.filter(p => p.combateId === combateId).sort((a, b) => a.ordem - b.ordem);
  if (acao === 'iniciar') {
    exigir(combate.estado === 'preparado', 'Somente um encontro preparado pode ser iniciado.');
    const outrosAtivos = new Set(dados.combates.filter(c => c.estado === 'ativo' && c.id !== combateId).map(c => c.id));
    const ocupadas = new Set(participantes.filter(p => outrosAtivos.has(p.combateId)).map(p => p.instanciaId));
    const indisponivel = ordem.find(p => ocupadas.has(p.instanciaId));
    if (indisponivel) {
      const instancia = dados.instancias.find(i => i.id === indisponivel.instanciaId)!;
      const outro = dados.combates.find(c => outrosAtivos.has(c.id) && participantes.some(p => p.combateId === c.id && p.instanciaId === indisponivel.instanciaId))!;
      throw new ErroAreaMestre('dados-invalidos', `${instancia.nome} já participa de outro combate ativo: ${outro.nome || `Combate ${dados.combates.indexOf(outro) + 1}`}.`);
    }
    combate = { ...combate, estado: 'ativo', rodada: 1, participanteAtivoId: ordem[0].id,
      execucao: { versao: 1, ocorrenciaTurno: 0, origemSnapshot: 'ativacao', ativadoEm: agora, visitados: [ordem[0].id], pvAtivacao: ordem.map(p => ({
        participanteId: p.id, instanciaId: p.instanciaId, pv: { ...dados.instancias.find(i => i.id === p.instanciaId)!.pv },
      })) } };
  } else {
    exigir(combate.estado === 'ativo' && combate.execucao, 'Este encontro não está em andamento.');
    const execucao = combate.execucao!;
    if (acao === 'avancar') {
      const visitados = new Set(execucao.visitados);
      const indice = ordem.findIndex(p => p.id === combate.participanteAtivoId);
      const proximos = [...ordem.slice(indice + 1), ...ordem.slice(0, indice + 1)];
      const proximo = proximos.find(p => !visitados.has(p.id));
      exigir(proximo || combate.rodada < Number.MAX_SAFE_INTEGER, 'Limite de rodadas alcançado.');
      const ocorrencia = execucao.ocorrenciaTurno ?? 0;
      exigir(ocorrencia < Number.MAX_SAFE_INTEGER, 'Limite de turnos alcançado.');
      const condicoes = processarCondicoesTurno(combate, combate.participanteAtivoId!, (proximo ?? ordem[0]).id, ocorrencia);
      combate = { ...combate, ...(condicoes ? { condicoes } : {}), rodada: combate.rodada + (proximo ? 0 : 1), participanteAtivoId: (proximo ?? ordem[0]).id,
        execucao: { ...execucao, ocorrenciaTurno: ocorrencia + 1, visitados: proximo ? [...execucao.visitados, proximo.id] : [ordem[0].id] } };
    } else if ('adicionar' in acao) {
      const entrada = acao.adicionar;
      validarId(entrada.id);
      exigir(!participantes.some(p => p.id === entrada.id), 'O identificador do participante já existe.');
      const existente = instancias.find(i => i.id === entrada.instancia.id);
      const instancia = existente ?? entrada.instancia;
      exigir(instancia.campanhaId === dados.campanha.id, 'O combatente deve pertencer a esta campanha.');
      exigir(existente || (instancia.fichaOriginalId === null && instancia.categoria === 'monstro'), 'Novos combatentes devem ser minions.');
      const ativos = new Set(dados.combates.filter(c => c.estado === 'ativo').map(c => c.id));
      exigir(!participantes.some(p => p.instanciaId === instancia.id && ativos.has(p.combateId)), 'Este combatente já participa de um combate ativo.');
      exigir(entrada.iniciativa === undefined || Number.isSafeInteger(entrada.iniciativa), 'A iniciativa deve ser um número inteiro válido.');
      const atual = ordem.findIndex(p => p.id === combate.participanteAtivoId);
      const novo: ParticipanteCombate = { id: entrada.id, instanciaId: instancia.id, combateId,
        iniciativa: entrada.iniciativa ?? ordem[atual].iniciativa, ordem: 0, pvInicio: { ...instancia.pv } };
      // Preserve manual ordering and insert after ties when initiative is supplied.
      const primeiroMenor = ordem.findIndex(p => p.iniciativa < novo.iniciativa);
      const indice = entrada.iniciativa === undefined ? atual + 1 : primeiroMenor < 0 ? ordem.length : primeiroMenor;
      const novaOrdem = [...ordem.slice(0, indice), novo, ...ordem.slice(indice)];
      participantes = [...participantes.filter(p => p.combateId !== combateId), ...novaOrdem.map((p, ordem) => ({ ...p, ordem }))];
      if (!existente) instancias = [...instancias, { ...instancia, pv: { ...instancia.pv } }];
      combate = { ...combate, execucao: { ...execucao, pvAtivacao: [...execucao.pvAtivacao,
        { participanteId: novo.id, instanciaId: instancia.id, pv: { ...instancia.pv } }] } };
    } else {
      exigir(Array.isArray(acao.ordem) && acao.ordem.length === ordem.length && new Set(acao.ordem).size === ordem.length &&
        acao.ordem.every(id => ordem.some(p => p.id === id)), 'A nova ordem deve conter cada participante exatamente uma vez.');
      const indices = new Map(acao.ordem.map((id, indice) => [id, indice]));
      participantes = participantes.map(p => p.combateId === combateId ? { ...p, ordem: indices.get(p.id)! } : p);
    }
  }
  const resultado = { ...dados, campanha: { ...dados.campanha, atualizadoEm: agora }, participantes, instancias,
    combates: dados.combates.map(c => c.id === combateId ? combate : c) };
  validarDadosCampanha(resultado);
  return resultado;
}
