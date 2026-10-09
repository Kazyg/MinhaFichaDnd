import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Ficha } from './FichaPersonagem';
import { BACKUP_KEY, FichaStorage, hydrateFicha, parseCollection, parseImport, persist, serializeCollection, STORAGE_KEY } from './fichaStorage';

type Status = 'carregando' | 'sujo' | 'salvando' | 'salvo' | 'erro';
type Collision = 'copia' | 'substituir';
type FichaContextType = {
  fichas: Ficha[]; ficha: Ficha | null;
  setFicha: (ficha: Ficha | null) => void;
  salvarFicha: (ficha: Ficha) => boolean;
  deletarFicha: (id: string) => boolean;
  importarFicha: (text: string, collision?: Collision) => Ficha | null;
  refreshKey: number; forceUpdate: () => void;
  status: Status; erro: string | null; recuperacao: boolean;
  tentarSalvar: () => boolean; reler: () => void;
};
const FichaContext = createContext<FichaContextType | null>(null);

function sameData(a: any, b: any, depth = 0): boolean {
  if (Object.is(a, b)) return true;
  if (depth > 60 || !a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(k => Object.prototype.hasOwnProperty.call(b, k) && sameData(a[k], b[k], depth + 1));
}

// Observe existing imperative setters, direct assignments and nested array/object edits.
function observe<T extends object>(root: T, changed: () => void): T {
  const cache = new WeakMap<object, any>();
  const wrap = (value: any): any => {
    if (!value || typeof value !== 'object') return value;
    if (cache.has(value)) return cache.get(value);
    const proxy = new Proxy(value, {
      get(target, key, receiver) { return wrap(Reflect.get(target, key, receiver)); },
      set(target, key, next) {
        const previous = Reflect.get(target, key);
        const ok = Reflect.set(target, key, next);
        if (ok && !sameData(previous, next)) changed();
        return ok;
      },
      deleteProperty(target, key) {
        const had = Reflect.has(target, key);
        const ok = Reflect.deleteProperty(target, key);
        if (ok && had) changed();
        return ok;
      },
    });
    cache.set(value, proxy);
    cache.set(proxy, proxy);
    return proxy;
  };
  return wrap(root);
}

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export const FichaProvider = ({ children, storage }: React.PropsWithChildren<{ storage?: FichaStorage }>) => {
  const models = useRef<Ficha[]>([]);
  const selected = useRef<Ficha | null>(null);
  const original = useRef<string | null>(null);
  const blocked = useRef(true);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const actions = useRef<{ flush: () => boolean; load: () => void; changed: () => void }>({ flush: () => false, load: () => {}, changed: () => {} });
  const [refreshKey, refresh] = useState(0);
  const [status, setStatus] = useState<Status>('carregando');
  const [erro, setErro] = useState<string | null>(null);
  const [recoveryText, setRecoveryText] = useState('');
  const [recuperacao, setRecuperacao] = useState(false);
  const getStorage = () => storage ?? window.localStorage;
  const update = () => refresh(n => n + 1);
  const cancel = () => { if (timer.current !== null) clearTimeout(timer.current); timer.current = null; };
  const error = (e: unknown) => {
    setStatus('erro');
    setErro(e instanceof Error ? e.message : 'Falha ao acessar o armazenamento.');
    return false;
  };
  const wrapFicha = (value: Ficha) => {
    const observed = observe(value, () => {
      if (models.current.includes(observed)) actions.current.changed();
    });
    return observed;
  };
  const flush = () => {
    cancel();
    if (blocked.current) return error(new Error('Resolva a recuperação antes de salvar. Os dados originais estão preservados.'));
    setStatus('salvando');
    try {
      const next = serializeCollection(models.current, selected.current?.id ?? null);
      persist(getStorage(), original.current, next);
      original.current = next;
      dirty.current = false;
      setErro(null);
      setStatus('salvo');
      return true;
    } catch (e) { return error(e); }
  };
  const changed = () => {
    if (blocked.current || !mounted.current) return;
    dirty.current = true;
    cancel();
    // Some existing components update derived properties during render.
    // Defer React notifications until that render has completed.
    Promise.resolve().then(() => {
      if (mounted.current && dirty.current) { setStatus('sujo'); update(); }
    });
    timer.current = setTimeout(() => actions.current.flush(), 300);
  };
  const load = () => {
    cancel();
    blocked.current = true;
    original.current = null;
    try {
      const store = getStorage();
      const raw = store.getItem(STORAGE_KEY);
      original.current = raw;
      const loaded = parseCollection(raw);
      // The old separate pointer is only a hint; stale IDs never create a new ficha.
      const selectedId = loaded.selectedId ?? (raw?.trimStart().startsWith('[') ? store.getItem('ficha') : null);
      models.current = loaded.fichas.map(wrapFicha);
      selected.current = models.current.find(f => f.id === selectedId) ?? null;
      blocked.current = false;
      dirty.current = false;
      setRecuperacao(false);
      setErro(null);
      setStatus('salvo');
      update();
    } catch (e) {
      setRecuperacao(true);
      error(e);
    }
  };
  actions.current = { flush, load, changed };
  useEffect(() => {
    mounted.current = true;
    actions.current.load();
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty.current && !actions.current.flush()) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', unload);
    return () => {
      if (dirty.current) actions.current.flush();
      mounted.current = false;
      if (timer.current !== null) clearTimeout(timer.current);
      window.removeEventListener('beforeunload', unload);
    };
  }, [storage]);

  const commit = (next: Ficha[], active: Ficha | null) => {
    if (blocked.current) return error(new Error('Resolva a recuperação antes de alterar a coleção.'));
    cancel();
    setStatus('salvando');
    try {
      const raw = serializeCollection(next, active?.id ?? null);
      persist(getStorage(), original.current, raw);
      original.current = raw;
      models.current = next;
      selected.current = active;
      dirty.current = false;
      setStatus('salvo');
      setErro(null);
      update();
      return true;
    } catch (e) { return error(e); }
  };
  const salvarFicha = (value: Ficha) => {
    try {
      const normalized = models.current.includes(value) ? value : wrapFicha(hydrateFicha(value));
      const next = models.current.filter(f => f.id !== normalized.id).concat(normalized);
      return commit(next, normalized);
    } catch (e) { return error(e); }
  };
  const importarFicha = (text: string, collision?: Collision) => {
    try {
      const value = parseImport(text);
      if (models.current.some(f => f.id === value.id)) {
        if (!collision) throw new Error('ID já existente. Escolha importar como cópia ou substituir explicitamente.');
        if (collision === 'copia') {
          do { value.id = value.gerarIdUnico(); } while (models.current.some(f => f.id === value.id));
        } else if (collision !== 'substituir') throw new Error('Escolha de colisão inválida.');
      }
      return salvarFicha(value) ? selected.current : null;
    } catch (e) { error(e); return null; }
  };
  const restore = (text: string) => {
    try {
      const loaded = parseCollection(text);
      const raw = serializeCollection(loaded.fichas, loaded.selectedId);
      persist(getStorage(), original.current, raw, true);
      load();
    } catch (e) { error(e); }
  };
  const reler = () => {
    if (!dirty.current || window.confirm('Descartar alterações ainda não salvas e reler o armazenamento?')) load();
  };
  const value: FichaContextType = {
    fichas: models.current, ficha: selected.current, salvarFicha, importarFicha,
    setFicha: f => {
      if (blocked.current) return;
      if (f && !models.current.includes(f)) { salvarFicha(f); return; }
      selected.current = f; update(); changed();
    },
    deletarFicha: id => commit(models.current.filter(f => f.id !== id), selected.current?.id === id ? null : selected.current),
    refreshKey, forceUpdate: () => { update(); changed(); }, status, erro, recuperacao,
    tentarSalvar: flush, reler,
  };
  return <FichaContext.Provider value={value}>
    <aside aria-label="Salvamento das fichas" hidden={status === 'salvo'} style={{ padding: '8px 16px', background: '#17212b', color: '#fff' }}>
      <span role="status" aria-live="polite">{({ carregando: 'Carregando fichas…', sujo: 'Alterações não salvas', salvando: 'Salvando…', salvo: '', erro: 'Erro: alterações não salvas' })[status]}</span>
      {erro && <div role="alert">{erro}</div>}
      {status === 'erro' && !recuperacao && <button onClick={flush}>Tentar salvar novamente</button>}
      {status === 'erro' && <button onClick={reler}>Reler armazenamento</button>}
      {status === 'erro' && <button onClick={() => {
        try { download(serializeCollection(models.current, selected.current?.id ?? null), 'fichas-em-memoria.json'); }
        catch (e) { error(e); }
      }}>Exportar alterações em memória</button>}
      {recuperacao && <div>
        <p>Gravações bloqueadas. Nenhuma coleção vazia será salva. Baixe o conteúdo original antes de recuperar.</p>
        {original.current !== null && <button onClick={() => download(original.current!, 'fichas-original.txt')}>Baixar conteúdo original</button>}
        <button onClick={() => {
          try {
            const backup = getStorage().getItem(BACKUP_KEY);
            if (backup === null) throw new Error('Não há cópia de segurança disponível.');
            restore(backup);
          } catch (e) { error(e); }
        }}>Restaurar última cópia de segurança</button>
        <label>Coleção JSON corrigida<textarea value={recoveryText} onChange={e => setRecoveryText(e.target.value)} /></label>
        <button disabled={!recoveryText.trim()} onClick={() => restore(recoveryText)}>Validar e recuperar coleção</button>
      </div>}
    </aside>
    {!recuperacao && status !== 'carregando' && children}
  </FichaContext.Provider>;
};

export const useFicha = () => {
  const context = useContext(FichaContext);
  if (!context) throw new Error('useFicha deve ser usado dentro de um FichaProvider');
  return context;
};
