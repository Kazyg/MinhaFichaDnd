import { useCallback, useEffect, useRef, useState } from 'react';
import { RepositorioCampanhas } from './contratos';
import { normalizarErroPersistencia, ErroPersistencia } from './erros';
import { criarRepositorioCampanhas } from './persistencia';
import { Campanha, DadosCampanha } from './modelos';
import { ErroAreaMestre } from './dominio';
import { confirmarPreparacao, RascunhoPreparacaoCombate } from './preparacaoCombate';
import { AcaoExecucaoCombate, executarAcaoCombate } from './execucaoCombate';
import { encerrarCombate as montarEncerramento } from './encerramentoCombate';
import { AcaoCondicao, alterarCondicao as montarCondicao } from './condicoes';
import { completarLayout, criarLayoutPadrao } from './ui/layoutWorkspace';

export const ATRASO_SALVAMENTO = 600;
type Rascunho = { dados: DadosCampanha; conflito: boolean; tarefa: Promise<boolean> };

const chavePadrao = {};
const rascunhos = new WeakMap<object, Rascunho>();
function notificarAbas(canal: BroadcastChannel | null, campanhaId: string) {

  try { canal?.postMessage({ campanhaId }); } catch {   }
}

function novoId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (!globalThis.crypto?.getRandomValues) throw new ErroPersistencia('indisponivel', 'O navegador não disponibiliza identificadores seguros.');
  return `campanha-${Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('')}`;
}


export function useCampanhas(repositorio?: RepositorioCampanhas) {
  const [repo] = useState(() => repositorio ?? criarRepositorioCampanhas());
  const [chaveRascunho] = useState<object>(() => repositorio ?? chavePadrao);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [dados, setDados] = useState<DadosCampanha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [conflito, setConflito] = useState(false);
  const local = useRef<DadosCampanha | null>(null);
  const sujo = useRef(false);
  const conflitante = useRef(false);
  const edicao = useRef(0);
  const operacao = useRef(0);
  const montado = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const gravacao = useRef<Promise<boolean> | null>(null);
  const confirmacaoCombate = useRef<Promise<boolean> | null>(null);
  const canalAbas = useRef<BroadcastChannel | null>(null);

  const publicar = useCallback((valor: DadosCampanha | null) => {
    local.current = valor;
    if (montado.current) setDados(valor);
  }, []);
  const marcarSujo = useCallback((valor: boolean) => {
    sujo.current = valor;
    if (montado.current) setPendente(valor);
  }, []);
  const limparTimer = useCallback(() => { if (timer.current !== undefined) clearTimeout(timer.current); timer.current = undefined; }, []);
  const informarErro = useCallback((causa: unknown) => {
    const falha = normalizarErroPersistencia(causa);
    conflitante.current = falha.codigo === 'conflito';
    if (montado.current) {
      setConflito(conflitante.current);
      setErro(conflitante.current ? 'Esta campanha mudou em outra aba. Suas edições locais continuam aqui; recarregue a versão salva para continuar.' : falha.message);
    }
  }, []);

  const salvarAgora = useCallback((): Promise<boolean> => {
    limparTimer();
    if (gravacao.current) return gravacao.current;
    if (!sujo.current) return Promise.resolve(true);
    if (conflitante.current) return Promise.resolve(false);
    if (montado.current) { setSalvando(true); setErro(null); }
    const promessa = (async () => {
      try {
        while (sujo.current && local.current) {
          const snapshot = local.current;
          const versaoLocal = edicao.current;
          await repo.salvar(snapshot);
          notificarAbas(canalAbas.current, snapshot.campanha.id);
          const salvo = await repo.obter(snapshot.campanha.id);
          if (!salvo) throw new ErroPersistencia('nao-encontrado', 'A campanha foi removida. Suas edições locais foram mantidas.');
          if (edicao.current === versaoLocal) {
            publicar({ ...salvo, layout: completarLayout(salvo.layout) });
            marcarSujo(false);
          } else if (local.current?.campanha.id === salvo.campanha.id) {
            publicar({ ...local.current, campanha: { ...local.current.campanha, revisao: salvo.campanha.revisao } });
          }
          if (montado.current) setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c));
        }
        return true;
      } catch (causa) { informarErro(causa); return false; }
      finally {
        gravacao.current = null;
        if (montado.current) setSalvando(false);
      }
    })();
    gravacao.current = promessa;
    return promessa;
  }, [informarErro, limparTimer, marcarSujo, publicar, repo]);

  const atualizar = useCallback((alterar: (anterior: DadosCampanha) => DadosCampanha) => {
    if (confirmacaoCombate.current) throw new ErroAreaMestre('dados-invalidos', 'Aguarde a operação do combate terminar antes de editar.');
    if (!local.current) return;
    const anterior = local.current;
    const proximo = alterar(anterior);
    if (proximo.campanha.id !== anterior.campanha.id) throw new Error('A edição não pode trocar a campanha.');
    publicar({ ...proximo, campanha: { ...proximo.campanha, revisao: anterior.campanha.revisao, atualizadoEm: new Date().toISOString() } });
    edicao.current++;
    marcarSujo(true);
    limparTimer();
    if (!conflitante.current) timer.current = setTimeout(() => { void salvarAgora(); }, ATRASO_SALVAMENTO);
  }, [limparTimer, marcarSujo, publicar, salvarAgora]);


  const confirmarCombate = useCallback((rascunho: RascunhoPreparacaoCombate, combateId: string): Promise<boolean> => {
    if (confirmacaoCombate.current) return confirmacaoCombate.current;
    const tarefa = (async () => {
      if (montado.current) setCarregando(true);
      try {
        if (!await salvarAgora() || conflitante.current || !local.current) return false;
        const proximo = confirmarPreparacao(local.current, rascunho, combateId, new Date().toISOString());
        await repo.salvar(proximo);
        notificarAbas(canalAbas.current, proximo.campanha.id);


        try {
          const salvo = await repo.obter(proximo.campanha.id);
          if (!salvo) throw new Error('Campanha não encontrada após confirmação.');
          publicar({ ...salvo, layout: completarLayout(salvo.layout) });
          marcarSujo(false);
          if (montado.current) {
            setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c));
            setErro(null);
          }
        } catch {
          publicar(proximo); marcarSujo(false); conflitante.current = true;
          if (montado.current) {
            setConflito(true);
            setErro('O encontro foi salvo, mas não foi possível reler a campanha. Recarregue a versão salva antes de continuar editando; não confirme a preparação novamente.');
          }
        }
        return true;
      } catch (causa) {
        informarErro(causa instanceof ErroAreaMestre ? new ErroPersistencia('dados-corrompidos', causa.message) : causa);
        return false;
      } finally {
        confirmacaoCombate.current = null;
        if (montado.current) setCarregando(false);
      }
    })();
    confirmacaoCombate.current = tarefa;
    return tarefa;
  }, [informarErro, marcarSujo, publicar, repo, salvarAgora]);


  const executarCombate = useCallback((combateId: string, acao: AcaoExecucaoCombate): Promise<boolean> => {
    if (confirmacaoCombate.current) return Promise.resolve(false);
    const tarefa = (async () => {
      if (montado.current) setCarregando(true);
      try {
        if (!await salvarAgora() || conflitante.current || !local.current) return false;
        const proximo = executarAcaoCombate(local.current, combateId, acao, new Date().toISOString());
        await repo.salvar(proximo);
        notificarAbas(canalAbas.current, proximo.campanha.id);
        try {
          const salvo = await repo.obter(proximo.campanha.id);
          if (!salvo) throw new Error('Campanha não encontrada após execução.');
          publicar({ ...salvo, layout: completarLayout(salvo.layout) });
          marcarSujo(false);
          if (montado.current) {
            setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c));
            setErro(null);
          }
        } catch {
          publicar(proximo); marcarSujo(false); conflitante.current = true;
          if (montado.current) {
            setConflito(true);
            setErro('A ação do combate foi salva, mas não foi possível reler a campanha. Recarregue a versão salva antes de continuar; não repita a ação.');
          }
        }
        return true;
      } catch (causa) {
        informarErro(causa instanceof ErroAreaMestre ? new ErroPersistencia('dados-corrompidos', causa.message) : causa);
        return false;
      } finally {
        confirmacaoCombate.current = null;
        if (montado.current) setCarregando(false);
      }
    })();
    confirmacaoCombate.current = tarefa;
    return tarefa;
  }, [informarErro, marcarSujo, publicar, repo, salvarAgora]);


  const encerrarCombate = useCallback((combateId: string, decisao: 'manter' | 'restaurar', revisaoEsperada: number): Promise<boolean> => {
    if (confirmacaoCombate.current) return Promise.resolve(false);
    const tarefa = (async () => {
      if (montado.current) setCarregando(true);
      try {
        if (!await salvarAgora() || conflitante.current || !local.current) return false;
        if (local.current.campanha.revisao !== revisaoEsperada) throw new ErroPersistencia('conflito', 'O estado da campanha mudou desde a abertura da confirmação. Atualize os dados antes de encerrar.');
        const atual = await repo.obter(local.current.campanha.id);
        if (!atual) throw new ErroPersistencia('nao-encontrado', 'A campanha não está disponível.');
        if (atual.campanha.revisao !== revisaoEsperada) throw new ErroPersistencia('conflito', 'Outra aba alterou a campanha. Recarregue antes de encerrar.');
        const proximo = montarEncerramento(atual, combateId, decisao, new Date().toISOString());
        await repo.salvar(proximo);
        notificarAbas(canalAbas.current, proximo.campanha.id);
        try {
          const salvo = await repo.obter(proximo.campanha.id);
          if (!salvo) throw new Error('Campanha indisponível após encerramento.');
          publicar({ ...salvo, layout: completarLayout(salvo.layout) }); marcarSujo(false);
          if (montado.current) { setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c)); setErro(null); }
        } catch {
          publicar(proximo); marcarSujo(false); conflitante.current = true;
          if (montado.current) { setConflito(true); setErro('O combate foi encerrado, mas não foi possível reler a campanha. Recarregue a versão salva antes de continuar; não repita o encerramento.'); }
        }
        return true;
      } catch (causa) {
        informarErro(causa instanceof ErroAreaMestre ? new ErroPersistencia('dados-corrompidos', causa.message) : causa);
        return false;
      } finally { confirmacaoCombate.current = null; if (montado.current) setCarregando(false); }
    })();
    confirmacaoCombate.current = tarefa;
    return tarefa;
  }, [informarErro, marcarSujo, publicar, repo, salvarAgora]);


  const alterarCondicao = useCallback((combateId: string, participanteId: string, acao: AcaoCondicao, revisaoEsperada: number): Promise<boolean> => {
    if (confirmacaoCombate.current) return Promise.resolve(false);
    const tarefa = (async () => {
      if (montado.current) setCarregando(true);
      try {
        if (!await salvarAgora() || conflitante.current || !local.current) return false;
        if ((local.current.campanha.revisao ?? 0) !== revisaoEsperada) throw new ErroPersistencia('conflito', 'A campanha mudou desde a abertura das condições. Recarregue antes de salvar.');
        const atual = await repo.obter(local.current.campanha.id);
        if (!atual) throw new ErroPersistencia('nao-encontrado', 'A campanha não está disponível.');
        if ((atual.campanha.revisao ?? 0) !== revisaoEsperada) throw new ErroPersistencia('conflito', 'Outra aba alterou a campanha. Recarregue antes de salvar as condições.');
        const proximo = montarCondicao(atual, combateId, participanteId, acao, new Date().toISOString());
        await repo.salvar(proximo);
        notificarAbas(canalAbas.current, proximo.campanha.id);
        try {
          const salvo = await repo.obter(proximo.campanha.id);
          if (!salvo) throw new Error('Campanha indisponível após salvar condição.');
          publicar({ ...salvo, layout: completarLayout(salvo.layout) }); marcarSujo(false);
          if (montado.current) { setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c)); setErro(null); }
        } catch {
          publicar(proximo); marcarSujo(false); conflitante.current = true;
          if (montado.current) { setConflito(true); setErro('A condição foi salva, mas não foi possível reler a campanha. Recarregue a versão salva antes de continuar; não repita a ação.'); }
        }
        return true;
      } catch (causa) {
        informarErro(causa instanceof ErroAreaMestre ? new ErroPersistencia('dados-corrompidos', causa.message) : causa);
        return false;
      } finally { confirmacaoCombate.current = null; if (montado.current) setCarregando(false); }
    })();
    confirmacaoCombate.current = tarefa;
    return tarefa;
  }, [informarErro, marcarSujo, publicar, repo, salvarAgora]);

  const conversoesPdf = useRef(new Map<string, Promise<boolean>>());
  const garantirPdfFicha = useCallback((fichaId: string): Promise<boolean> => {
    const existente = conversoesPdf.current.get(fichaId);
    if (existente) return existente;
    if (confirmacaoCombate.current) return Promise.resolve(false);
    const tarefa = (async () => {
      if (montado.current) setCarregando(true);
      try {
        if (!await salvarAgora() || conflitante.current || !local.current) return false;
        const anterior = local.current;
        if (anterior.fichas.find(f => f.id === fichaId)?.pdfAnexoId) return true;
        const { converterFichaJson } = await import('./pdfFichaJson');
        const proximo = await converterFichaJson(anterior, fichaId);
        await repo.salvar(proximo);
        notificarAbas(canalAbas.current, proximo.campanha.id);
        try {
          const salvo = await repo.obter(proximo.campanha.id);
          if (!salvo) throw new Error('Campanha indisponível após gerar PDF.');
          publicar({ ...salvo, layout: completarLayout(salvo.layout) }); marcarSujo(false);
          if (montado.current) { setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c)); setErro(null); }
        } catch {
          publicar(proximo); marcarSujo(false); conflitante.current = true;
          if (montado.current) { setConflito(true); setErro('O PDF foi salvo, mas não foi possível reler a campanha. Recarregue antes de continuar.'); }
        }
        return true;
      } catch (causa) { informarErro(causa); return false; }
      finally {
        conversoesPdf.current.delete(fichaId); confirmacaoCombate.current = null;
        if (montado.current) setCarregando(false);
      }
    })();
    conversoesPdf.current.set(fichaId, tarefa); confirmacaoCombate.current = tarefa;
    return tarefa;
  }, [informarErro, marcarSujo, publicar, repo, salvarAgora]);

  const listar = useCallback(async () => {
    try {
      const lista = await repo.listar();
      if (montado.current) {
        setCampanhas(lista);
        if (!sujo.current) setErro(null);
      }
    } catch (causa) { informarErro(causa); }
  }, [informarErro, repo]);

  const abrir = useCallback(async (id: string, pedido?: number) => {
    const valor = await repo.obter(id);
    if (pedido !== undefined && pedido !== operacao.current) return false;
    if (!valor) throw new ErroPersistencia('nao-encontrado', 'Esta campanha não existe mais. Atualize a lista.');
    publicar({ ...valor, layout: completarLayout(valor.layout) });
    marcarSujo(false);
    conflitante.current = false;
    if (montado.current) { setConflito(false); setErro(null); }
    return true;
  }, [marcarSujo, publicar, repo]);

  const selecionar = useCallback(async (id: string) => {
    if (confirmacaoCombate.current) return false;
    const pedido = ++operacao.current;
    if (montado.current) setCarregando(true);
    try {
      if (!await salvarAgora() || pedido !== operacao.current) return false;
      return await abrir(id, pedido);
    } catch (causa) { informarErro(causa); return false; }
    finally { if (montado.current && pedido === operacao.current) setCarregando(false); }
  }, [abrir, informarErro, salvarAgora]);

  const criar = useCallback(async (nome: string) => {
    if (confirmacaoCombate.current) return false;
    if (!nome.trim()) { setErro('Informe o nome da campanha.'); return false; }
    const pedido = ++operacao.current;
    if (montado.current) setCarregando(true);
    try {
      if (!await salvarAgora() || pedido !== operacao.current) return false;
      const id = novoId();
      const agora = new Date().toISOString();
      await repo.criar({
        campanha: { id, schemaVersion: 1, nome: nome.trim(), roteiro: '', criadoEm: agora, atualizadoEm: agora },
        layout: criarLayoutPadrao(id), anexos: [], fichas: [], instancias: [], combates: [], participantes: [],
      });
      if (!await abrir(id, pedido)) return false;
      await listar();
      return true;
    } catch (causa) { informarErro(causa); return false; }
    finally { if (montado.current && pedido === operacao.current) setCarregando(false); }
  }, [abrir, informarErro, listar, repo, salvarAgora]);

  const restaurar = useCallback(async (arquivo: Blob) => {
    if (confirmacaoCombate.current) return false;
    const pedido = ++operacao.current;
    if (montado.current) setCarregando(true);
    try {
      if (!await salvarAgora() || pedido !== operacao.current) return false;
      const { restaurarBackup } = await import('./backup');
      const copia = await restaurarBackup(arquivo, repo);

      if (!await abrir(copia.campanha.id, pedido)) return false;
      await listar();
      return true;
    } catch (causa) { informarErro(causa); return false; }
    finally { if (montado.current && pedido === operacao.current) setCarregando(false); }
  }, [abrir, informarErro, listar, repo, salvarAgora]);


  const recarregar = useCallback(async () => {
    if (confirmacaoCombate.current) return false;
    if (!local.current) { await listar(); return true; }
    limparTimer();
    if (gravacao.current) await gravacao.current;
    if (montado.current) setCarregando(true);
    try { await abrir(local.current.campanha.id); await listar(); return true; }
    catch (causa) { informarErro(causa); return false; }
    finally { if (montado.current) setCarregando(false); }
  }, [abrir, informarErro, limparTimer, listar]);

  useEffect(() => {
    montado.current = true;
    let cancelado = false;
    const iniciar = async () => {
      const anterior = rascunhos.get(chaveRascunho);
      if (anterior) await anterior.tarefa;
      if (cancelado) return;
      const recuperado = rascunhos.get(chaveRascunho);
      if (recuperado) {
        publicar(recuperado.dados);
        marcarSujo(true);
        conflitante.current = recuperado.conflito;
        setConflito(recuperado.conflito);
        setErro('Edições não salvas da navegação anterior foram recuperadas. Tente salvar novamente ou recarregue a versão salva.');
        rascunhos.delete(chaveRascunho);
      }
      const lista = await repo.listar();
      if (!cancelado) { setCampanhas(lista); if (!recuperado) setErro(null); }
    };
    iniciar().catch(causa => { if (!cancelado) informarErro(causa); })
      .finally(() => { if (!cancelado) setCarregando(false); });
    return () => {
      cancelado = true;
      montado.current = false;
      limparTimer();

      const tarefa = Promise.all([salvarAgora(), confirmacaoCombate.current ?? Promise.resolve(true)]).then(resultados => resultados.every(Boolean));
      if (sujo.current && local.current) {
        const rascunho = { dados: local.current, conflito: conflitante.current, tarefa };
        rascunhos.set(chaveRascunho, rascunho);
        void tarefa.then(salvo => {
          if (rascunhos.get(chaveRascunho) !== rascunho) return;
          if (salvo) rascunhos.delete(chaveRascunho);
          else { rascunho.dados = local.current ?? rascunho.dados; rascunho.conflito = conflitante.current; }
        });
      }
      void tarefa.finally(() => { if (!montado.current && !repositorio) repo.fechar(); });
    };
  }, [chaveRascunho, informarErro, limparTimer, marcarSujo, publicar, repo, repositorio, salvarAgora]);

  useEffect(() => {
    const avisar = (evento: BeforeUnloadEvent) => {
      if (!sujo.current && !confirmacaoCombate.current) return;
      evento.preventDefault(); evento.returnValue = '';
    };
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, []);

  useEffect(() => {
    let encerrado = false;
    let precisaReler = false;
    let lendo = false;
    const reler = async () => {
      if (!precisaReler || lendo || !local.current || sujo.current || conflitante.current || gravacao.current || confirmacaoCombate.current) return;


      if (document.querySelector('[aria-modal="true"], input:focus, select:focus, textarea:focus')) return;
      const anterior = local.current;
      const versaoEdicao = edicao.current;
      const versaoOperacao = operacao.current;
      lendo = true;
      precisaReler = false;
      try {
        const salvo = await repo.obter(anterior.campanha.id);
        if (!encerrado && salvo && local.current?.campanha.id === anterior.campanha.id && (salvo.campanha.revisao ?? 0) > (local.current.campanha.revisao ?? 0)) {
          if (local.current === anterior && edicao.current === versaoEdicao && operacao.current === versaoOperacao && !sujo.current && !conflitante.current && !gravacao.current && !confirmacaoCombate.current &&
            !document.querySelector('[aria-modal="true"], input:focus, select:focus, textarea:focus')) {
            publicar({ ...salvo, layout: completarLayout(salvo.layout) });
            setCampanhas(lista => lista.map(c => c.id === salvo.campanha.id ? salvo.campanha : c));
          } else precisaReler = true;
        }
      } catch {   }
      finally { lendo = false; }
    };
    const sinalizar = () => { precisaReler = true; void reler(); };
    const visibilidade = () => { if (document.visibilityState === 'visible') sinalizar(); };
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const canal = new BroadcastChannel('minhafichadnd-campanhas');
        canalAbas.current = canal;
        canal.onmessage = evento => { if (evento.data?.campanhaId === local.current?.campanha.id) sinalizar(); };
      }
    } catch {   }
    const tentativa = setInterval(() => { void reler(); }, 1000);
    window.addEventListener('focus', sinalizar);
    document.addEventListener('visibilitychange', visibilidade);
    return () => {
      encerrado = true; clearInterval(tentativa);
      window.removeEventListener('focus', sinalizar);
      document.removeEventListener('visibilitychange', visibilidade);
      canalAbas.current?.close(); canalAbas.current = null;
    };
  }, [publicar, repo]);

  return { campanhas, dados, carregando, salvando, pendente, erro, conflito, criar, selecionar, restaurar, confirmarCombate, executarCombate, encerrarCombate, alterarCondicao, garantirPdfFicha, atualizar, salvarAgora, recarregar, listar };
}
export type RetornoUseCampanhas = ReturnType<typeof useCampanhas>;
