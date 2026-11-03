import { RepositorioCampanhas } from './contratos';
import { Campanha, Combate, DadosCampanha, ParticipanteCombate } from './modelos';
import { migrarExecucaoLegada, migrarOrigemSnapshot } from './execucaoCombate';
import { ErroPersistencia, normalizarErroPersistencia } from './erros';
import { validarDadosCampanha } from './validacao';
import { normalizarRoteirosCampanha } from './roteiros';

export const VERSAO_BANCO_MESTRE = 4;
export const NOME_BANCO_MESTRE = 'minhafichadnd-area-mestre';
const COLECOES = ['anexos', 'fichas', 'instancias', 'combates', 'participantes'] as const;
const STORES = ['campanhas', ...COLECOES, 'arquivos', 'layouts'];
type Registro = { id: string; campanhaId: string; [chave: string]: unknown };
export type MigracaoBanco = (banco: IDBDatabase, transacao: IDBTransaction) => void;


export const MIGRACOES_MESTRE: Readonly<Record<number, MigracaoBanco>> = {
  4(_banco, transacao) {
    const pedido = transacao.objectStore('combates').openCursor();
    pedido.onsuccess = () => {
      const cursor = pedido.result;
      if (!cursor) return;
      const combate = cursor.value as Combate;
      const migrado = migrarOrigemSnapshot(combate);
      if (migrado !== combate) cursor.update(migrado);
      cursor.continue();
    };
  },
  1(banco) {
    banco.createObjectStore('campanhas', { keyPath: 'id' });
    for (const nome of COLECOES) {
      const store = banco.createObjectStore(nome, { keyPath: 'id' });
      store.createIndex('campanhaId', 'campanhaId');
      if (nome === 'fichas') {
        store.createIndex('anexoId', 'anexoId');
        store.createIndex('imagemAnexoId', 'imagemAnexoId');
      }
      if (nome === 'instancias') store.createIndex('fichaOriginalId', 'fichaOriginalId');
      if (nome === 'participantes') {
        store.createIndex('combateId', 'combateId');
        store.createIndex('instanciaId', 'instanciaId');
      }
    }
    banco.createObjectStore('arquivos', { keyPath: 'id' }).createIndex('campanhaId', 'campanhaId');
    banco.createObjectStore('layouts', { keyPath: 'campanhaId' });
  },
  2(_banco, transacao) {
    const pedido = transacao.objectStore('campanhas').openCursor();
    pedido.onsuccess = () => {
      const cursor = pedido.result;
      if (!cursor) return;
      const campanha = cursor.value as Campanha;
      const normalizada = normalizarRoteirosCampanha(campanha);
      if (normalizada !== campanha) cursor.update(normalizada);
      cursor.continue();
    };
  },
  3(_banco, transacao) {
    const participantes = transacao.objectStore('participantes').getAll();
    participantes.onsuccess = () => {
      const pedido = transacao.objectStore('combates').openCursor();
      pedido.onsuccess = () => {
        const cursor = pedido.result;
        if (!cursor) return;
        const combate = cursor.value as Combate;
        const migrado = migrarExecucaoLegada(combate, participantes.result as ParticipanteCombate[]);
        if (migrado !== combate) cursor.update(migrado);
        cursor.continue();
      };
    };
  },
};

export interface OpcoesRepositorioIndexedDB {
  indexedDB?: IDBFactory;
  nomeBanco?: string;
  versao?: number;
  migracoes?: Readonly<Record<number, MigracaoBanco>>;
}

function requisicao<T>(pedido: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}


export class RepositorioCampanhasIndexedDB implements RepositorioCampanhas {
  private abertura?: Promise<IDBDatabase>;
  private banco?: IDBDatabase;

  private arquivosConhecidos = new WeakMap<Blob, string>();
  private geracaoConexao = 0;

  constructor(private readonly opcoes: OpcoesRepositorioIndexedDB = {}) {}

  private abrir(): Promise<IDBDatabase> {
    if (this.abertura) return this.abertura;
    const geracao = this.geracaoConexao;
    this.abertura = new Promise((resolve, reject) => {
      let encerrado = false;
      let atualizando = false;
      let falhaMigracao: unknown;
      const falhar = (erro: unknown) => { encerrado = true; reject(normalizarErroPersistencia(erro)); };
      try {
        const fabrica = this.opcoes.indexedDB ?? globalThis.indexedDB;
        if (!fabrica) throw new ErroPersistencia('indisponivel', 'IndexedDB indisponível neste ambiente.');
        const versao = this.opcoes.versao ?? VERSAO_BANCO_MESTRE;
        const migracoes = this.opcoes.migracoes ?? MIGRACOES_MESTRE;
        const pedido = fabrica.open(this.opcoes.nomeBanco ?? NOME_BANCO_MESTRE, versao);
        pedido.onblocked = () => falhar(new ErroPersistencia('bloqueado', 'Feche outras abas que estejam usando o banco para atualizar.'));
        pedido.onupgradeneeded = evento => {
          if (encerrado || geracao !== this.geracaoConexao) {
            pedido.transaction!.abort();
            return;
          }
          atualizando = true;
          try {
            for (let numero = evento.oldVersion + 1; numero <= versao; numero++) {
              if (!migracoes[numero]) throw new Error(`Migração ${numero} não disponível.`);
              migracoes[numero](pedido.result, pedido.transaction!);
            }
          } catch (erro) {
            falhaMigracao = new ErroPersistencia('migracao-falhou', 'Não foi possível atualizar o banco. Os dados anteriores foram preservados.');
            pedido.transaction!.abort();
          }
        };
        pedido.onerror = () => falhar(falhaMigracao ?? (atualizando
          ? new ErroPersistencia('migracao-falhou', 'A migração foi interrompida. A versão anterior foi preservada.') : pedido.error));
        pedido.onsuccess = () => {
          if (encerrado || geracao !== this.geracaoConexao) {
            pedido.result.close();
            falhar(new ErroPersistencia('indisponivel', 'A conexão foi encerrada durante a abertura.'));
            return;
          }
          this.banco = pedido.result;
          this.banco.onversionchange = () => this.fechar();
          resolve(this.banco);
        };
      } catch (erro) { falhar(erro); }
    });
    const aberturaAtual = this.abertura;
    aberturaAtual.catch(() => { if (this.abertura === aberturaAtual) this.abertura = undefined; });
    return this.abertura;
  }

  fechar(): void {
    this.geracaoConexao++;
    this.banco?.close();
    this.banco = undefined;
    this.abertura = undefined;
    this.arquivosConhecidos = new WeakMap();
  }

  private async executar<T>(modo: IDBTransactionMode, acao: (tx: IDBTransaction) => Promise<T>): Promise<T> {
    try {
      const banco = await this.abrir();
      return await new Promise<T>((resolve, reject) => {
        const tx = banco.transaction(STORES, modo);
        let resultado: T;
        let erroAcao: unknown;
        tx.oncomplete = () => resolve(resultado);
        tx.onabort = () => reject(erroAcao ?? tx.error ?? new ErroPersistencia('transacao-falhou', 'Transação interrompida.'));
        tx.onerror = () => {   };
        acao(tx).then(valor => { resultado = valor; }, erro => {
          erroAcao = erro;
          try { tx.abort(); } catch { reject(erro); }
        });
      });
    } catch (erro) { throw normalizarErroPersistencia(erro); }
  }

  async listar(): Promise<Campanha[]> {
    return this.executar('readonly', tx => requisicao<Campanha[]>(tx.objectStore('campanhas').getAll()));
  }

  async obter(id: string): Promise<DadosCampanha | null> {
    const dados = await this.executar('readonly', async tx => {
      const campanha = await requisicao<Campanha | undefined>(tx.objectStore('campanhas').get(id));
      if (!campanha) return null;
      const [anexos, fichas, instancias, combates, participantes, arquivos, layout] = await Promise.all([
        ...COLECOES.map(nome => requisicao(tx.objectStore(nome).index('campanhaId').getAll(id))),
        requisicao(tx.objectStore('arquivos').index('campanhaId').getAll(id)),
        requisicao(tx.objectStore('layouts').get(id)),
      ]);
      const blobs = new Map<string, Blob>(arquivos.map((a: { id: string; arquivo: Blob }) => [a.id, a.arquivo]));
      const resultado = {
        campanha, anexos: anexos.map((a: Registro) => ({ ...a, arquivo: blobs.get(a.id) })), fichas, instancias, combates,
        participantes: participantes.map((p: Registro) => { const { campanhaId: _, ...participante } = p; return participante; }), layout,
      };
      validarDadosCampanha(resultado);
      return resultado;
    });
    dados?.anexos.forEach(anexo => this.arquivosConhecidos.set(anexo.arquivo, JSON.stringify([anexo.id, dados.campanha.id, dados.campanha.revisao])));
    return dados;
  }

  criar(dados: DadosCampanha): Promise<void> { return this.gravar(dados, true); }
  salvar(dados: DadosCampanha): Promise<void> { return this.gravar(dados, false); }

  private async gravar(dados: DadosCampanha, criar: boolean): Promise<void> {
    try { validarDadosCampanha(dados); } catch (erro) { throw normalizarErroPersistencia(erro); }

    const arquivos = dados.anexos.map(anexo => anexo.arquivo);
    dados = JSON.parse(JSON.stringify({ ...dados, anexos: dados.anexos.map(({ arquivo, ...anexo }) => anexo) })) as DadosCampanha;
    dados.anexos.forEach((anexo, indice) => { anexo.arquivo = arquivos[indice]; });
    const id = dados.campanha.id;
    let revisaoSalva = 0;
    await this.executar('readwrite', async tx => {
      const atual = await requisicao<Campanha | undefined>(tx.objectStore('campanhas').get(id));
      if (criar && atual) throw new ErroPersistencia('conflito', 'Já existe uma campanha com este identificador.');
      if (!criar && !atual) throw new ErroPersistencia('nao-encontrado', 'A campanha não existe ou foi removida.');
      if (atual && (dados.campanha.revisao === undefined || dados.campanha.revisao !== atual.revisao)) {
        throw new ErroPersistencia('conflito', 'A campanha foi alterada em outra operação. Recarregue antes de salvar.');
      }
      if (atual?.revisao === Number.MAX_SAFE_INTEGER) throw new ErroPersistencia('conflito', 'Limite de revisões da campanha alcançado.');
      for (const nome of COLECOES) {
        const store = tx.objectStore(nome);
        const registros: Registro[] = nome === 'participantes'
          ? dados.participantes.map(p => ({ ...p, campanhaId: id }))
          : dados[nome] as unknown as Registro[];
        const ids = new Set(registros.map(registro => registro.id));
        const antigos = await requisicao<Registro[]>(store.index('campanhaId').getAll(id));
        for (const antigo of antigos) if (!ids.has(antigo.id)) {
          store.delete(antigo.id);
          if (nome === 'anexos') tx.objectStore('arquivos').delete(antigo.id);
        }
        for (const registro of registros) {
          const existente = await requisicao<Registro | undefined>(store.get(registro.id));
          if (existente && existente.campanhaId !== id) throw new ErroPersistencia('conflito', `Identificador de ${nome} pertence a outra campanha.`);
          if (nome === 'anexos') {
            const { arquivo, ...metadados } = registro;
            store.put(metadados);
            if (!existente || this.arquivosConhecidos.get(arquivo as Blob) !== JSON.stringify([registro.id, id, atual?.revisao])) {
              tx.objectStore('arquivos').put({ id: registro.id, campanhaId: id, arquivo });
            }
          } else store.put(registro);
        }
      }
      tx.objectStore('layouts').put(dados.layout);
      revisaoSalva = (atual?.revisao ?? 0) + 1;
      tx.objectStore('campanhas').put({ ...dados.campanha, revisao: revisaoSalva });
    });

    dados.anexos.forEach(anexo => this.arquivosConhecidos.set(anexo.arquivo, JSON.stringify([anexo.id, id, revisaoSalva])));
  }

  async excluir(id: string): Promise<void> {
    await this.executar('readwrite', async tx => {
      if (!await requisicao(tx.objectStore('campanhas').get(id))) throw new ErroPersistencia('nao-encontrado', 'A campanha não existe ou foi removida.');
      for (const nome of [...COLECOES, 'arquivos']) {
        const store = tx.objectStore(nome);
        const chaves = await requisicao(store.index('campanhaId').getAllKeys(id));
        chaves.forEach(chave => store.delete(chave));
      }
      tx.objectStore('layouts').delete(id);
      tx.objectStore('campanhas').delete(id);
    });
    this.arquivosConhecidos = new WeakMap();
  }

  async excluirFicha(campanhaId: string, fichaId: string): Promise<void> {
    const dados = await this.obter(campanhaId);
    if (!dados || !dados.fichas.some(f => f.id === fichaId)) throw new ErroPersistencia('nao-encontrado', 'Ficha não encontrada.');
    if (dados.instancias.some(i => i.fichaOriginalId === fichaId)) throw new ErroPersistencia('conflito', 'A ficha possui instâncias dependentes.');
    dados.fichas = dados.fichas.filter(f => f.id !== fichaId);
    await this.salvar(dados);
  }

  async excluirAnexo(campanhaId: string, anexoId: string): Promise<void> {
    const dados = await this.obter(campanhaId);
    if (!dados || !dados.anexos.some(a => a.id === anexoId)) throw new ErroPersistencia('nao-encontrado', 'Anexo não encontrado.');
    if (dados.fichas.some(f => f.anexoId === anexoId || f.imagemAnexoId === anexoId)) throw new ErroPersistencia('conflito', 'O anexo está sendo usado por uma ficha.');
    dados.anexos = dados.anexos.filter(a => a.id !== anexoId);
    await this.salvar(dados);
  }
}

export function criarRepositorioCampanhas(opcoes?: OpcoesRepositorioIndexedDB): RepositorioCampanhasIndexedDB {
  return new RepositorioCampanhasIndexedDB(opcoes);
}
