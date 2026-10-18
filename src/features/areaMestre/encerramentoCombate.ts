import { ErroAreaMestre } from './dominio';
import { Combate, DadosCampanha } from './modelos';
import { validarDadosCampanha } from './validacao';

export const nomeCombate = (dados: DadosCampanha, combate: Combate): string => combate.nome || `Combate ${dados.combates.findIndex(c => c.id === combate.id) + 1}`;

/** Snapshots reconstruídos da preparação não representam a ativação real. */
export const podeRestaurarPV = (combate: Combate): boolean => combate.execucao?.origemSnapshot === 'ativacao';

/** Operação pura: salvar o agregado sob revisão é responsabilidade do repositório. */
export function encerrarCombate(dados: DadosCampanha, combateId: string, decisao: 'manter' | 'restaurar', agora: string): DadosCampanha {
  validarDadosCampanha(dados);
  const combate = dados.combates.find(c => c.id === combateId);
  if (!combate || combate.estado !== 'ativo') throw new ErroAreaMestre('dados-invalidos', 'Este combate não está em andamento. Atualize a campanha.');
  if (decisao !== 'manter' && decisao !== 'restaurar') throw new ErroAreaMestre('dados-invalidos', 'Escolha o tratamento dos PV.');
  if (decisao === 'restaurar' && !podeRestaurarPV(combate)) throw new ErroAreaMestre('dados-invalidos', 'Snapshot de ativação indisponível. Encerre mantendo os PV atuais.');
  const snapshots = new Map(combate.execucao?.pvAtivacao.map(s => [s.participanteId, s]));
  const participantes = dados.participantes.filter(p => p.combateId === combateId).sort((a, b) => a.ordem - b.ordem).map(p => {
    const instancia = dados.instancias.find(i => i.id === p.instanciaId)!;
    return { participanteId: p.id, instanciaId: instancia.id, fichaOriginalId: instancia.fichaOriginalId,
      nome: instancia.nome, categoria: instancia.categoria, iniciativa: p.iniciativa, ordem: p.ordem,
      pvInicial: podeRestaurarPV(combate) ? { ...snapshots.get(p.id)!.pv } : null, pvFinal: { ...instancia.pv } };
  });
  const restaurados = new Map(participantes.map(p => [p.instanciaId, p.pvInicial]));
  const encerrado: Combate = { ...combate, nome: nomeCombate(dados, combate), estado: 'encerrado', participanteAtivoId: null, encerradoEm: agora,
    historico: { ...(combate.condicoes === undefined ? {} : { condicoes: combate.condicoes.map(c => ({ ...c })) }), versao: 1, decisaoPV: decisao, iniciadoEm: combate.execucao?.ativadoEm ?? combate.iniciadoEm, participantes } };
  const resultado: DadosCampanha = { ...dados, campanha: { ...dados.campanha, atualizadoEm: agora },
    combates: dados.combates.map(c => c.id === combateId ? encerrado : c),
    instancias: decisao === 'manter' ? dados.instancias : dados.instancias.map(i => restaurados.get(i.id) ? { ...i, pv: { ...restaurados.get(i.id)! } } : i) };
  validarDadosCampanha(resultado);
  return resultado;
}
