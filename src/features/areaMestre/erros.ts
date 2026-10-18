import { CodigoErroPersistencia, FalhaPersistencia } from './contratos';

export class ErroPersistencia extends Error implements FalhaPersistencia {
  constructor(public readonly codigo: CodigoErroPersistencia, mensagem: string) {
    super(mensagem);
    this.name = 'ErroPersistencia';
  }
}

/** Não depende de instanceof DOMException (pode vir de outra aba/realm). */
export function normalizarErroPersistencia(erro: unknown): ErroPersistencia {
  if (erro instanceof ErroPersistencia) return erro;
  const nome = typeof erro === 'object' && erro !== null && 'name' in erro ? String((erro as { name: unknown }).name) : '';
  switch (nome) {
    case 'QuotaExceededError': return new ErroPersistencia('cota-excedida', 'Cota do navegador esgotada. A operação não foi salva.');
    case 'SecurityError': case 'NotAllowedError': return new ErroPersistencia('bloqueado', 'O navegador bloqueou o armazenamento local.');
    case 'VersionError': return new ErroPersistencia('versao-incompativel', 'O banco foi criado por uma versão mais recente da aplicação.');
    case 'ConstraintError': return new ErroPersistencia('conflito', 'Identificador já utilizado. Recarregue os dados antes de tentar novamente.');
    case 'DataCloneError': case 'DataError': return new ErroPersistencia('dados-corrompidos', 'Os dados não podem ser armazenados neste formato.');
    case 'InvalidStateError': return new ErroPersistencia('indisponivel', 'A conexão com o armazenamento não está disponível.');
    default: return new ErroPersistencia('transacao-falhou', 'A operação foi interrompida; nenhuma alteração desta transação foi confirmada.');
  }
}
