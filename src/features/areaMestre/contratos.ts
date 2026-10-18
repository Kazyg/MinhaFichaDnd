import { Campanha, DadosCampanha } from './modelos';

/** Serviços independentes da interface da Área do Mestre. */
export interface RepositorioCampanhas {
  listar(): Promise<Campanha[]>;
  obter(id: string): Promise<DadosCampanha | null>;
  /** Validar referências/IDs e salvar todos os registros em uma única transação. */
  salvar(dados: DadosCampanha): Promise<void>;
  /** Criação exclusiva; nunca substitui uma campanha existente. */
  criar(dados: DadosCampanha): Promise<void>;
  /** Remover também registros e anexos pertencentes à campanha, atomicamente. */
  excluir(id: string): Promise<void>;
  excluirFicha(campanhaId: string, fichaId: string): Promise<void>;
  excluirAnexo(campanhaId: string, anexoId: string): Promise<void>;
  fechar(): void;
}

export type CodigoErroPersistencia = 'indisponivel' | 'cota-excedida' | 'bloqueado' | 'versao-incompativel' | 'dados-corrompidos' | 'transacao-falhou'
  | 'conflito' | 'nao-encontrado' | 'migracao-falhou' | 'backup-invalido' | 'backup-incompativel' | 'arquivo-grande';

/** Erros reconhecíveis pela futura UI, sem depender de mensagens do navegador. */
export interface FalhaPersistencia extends Error {
  codigo: CodigoErroPersistencia;
}
