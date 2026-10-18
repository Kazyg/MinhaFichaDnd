import { Campanha, DadosCampanha } from './modelos';


export interface RepositorioCampanhas {
  listar(): Promise<Campanha[]>;
  obter(id: string): Promise<DadosCampanha | null>;

  salvar(dados: DadosCampanha): Promise<void>;

  criar(dados: DadosCampanha): Promise<void>;

  excluir(id: string): Promise<void>;
  excluirFicha(campanhaId: string, fichaId: string): Promise<void>;
  excluirAnexo(campanhaId: string, anexoId: string): Promise<void>;
  fechar(): void;
}

export type CodigoErroPersistencia = 'indisponivel' | 'cota-excedida' | 'bloqueado' | 'versao-incompativel' | 'dados-corrompidos' | 'transacao-falhou'
  | 'conflito' | 'nao-encontrado' | 'migracao-falhou' | 'backup-invalido' | 'backup-incompativel' | 'arquivo-grande';


export interface FalhaPersistencia extends Error {
  codigo: CodigoErroPersistencia;
}
