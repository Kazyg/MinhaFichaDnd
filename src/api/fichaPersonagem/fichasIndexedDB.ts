import { FichaStorage, hydrateFicha, parseCollection, serializeCollection, STORAGE_KEY } from './fichaStorage';

export const NOME_BANCO_FICHAS = 'minhafichadnd-personagens';
export const VERSAO_BANCO_FICHAS = 1;
export const MIGRACOES_FICHAS: Readonly<Record<number, (db: IDBDatabase) => void>> = {
  1(db) {
    db.createObjectStore('fichas', { keyPath: 'id' });
    db.createObjectStore('meta');
  },
};
const request = <T>(r: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});
const complete = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onabort = () => reject(tx.error ?? new Error('Transação cancelada.'));
  tx.onerror = () => reject(tx.error ?? new Error('Falha no armazenamento.'));
});


export class FichasIndexedDB {
  private opening?: Promise<IDBDatabase>;
  constructor(private factory?: IDBFactory, private name = NOME_BANCO_FICHAS) {}
  private open() {
    if (!this.opening) {
      this.opening = new Promise<IDBDatabase>((resolve, reject) => {
        const factory = this.factory ?? globalThis.indexedDB;
        if (!factory) { reject(new Error('IndexedDB indisponível.')); return; }
        const r = factory.open(this.name, VERSAO_BANCO_FICHAS);
        let blocked = false;
        r.onblocked = () => { blocked = true; reject(new Error('Feche outras abas para atualizar o armazenamento.')); };
        r.onupgradeneeded = event => {
          if (blocked) { r.transaction!.abort(); return; }
          try {
            for (let version = event.oldVersion + 1; version <= VERSAO_BANCO_FICHAS; version++) MIGRACOES_FICHAS[version](r.result);
          } catch { r.transaction!.abort(); }
        };
        r.onerror = () => reject(r.error);
        r.onsuccess = () => {
          if (blocked) { r.result.close(); return; }
          r.result.onversionchange = () => { r.result.close(); this.opening = undefined; };
          resolve(r.result);
        };
      });
      this.opening.catch(() => { this.opening = undefined; });
    }
    return this.opening;
  }
  async close() { (await this.open()).close(); this.opening = undefined; }
  async migrate(source: FichaStorage | (() => FichaStorage)) {
    const db = await this.open();

    const check = db.transaction('meta', 'readonly');
    const checked = complete(check);
    const [done] = await Promise.all([request(check.objectStore('meta').get('migracao-localStorage-v1')), checked]);
    if (done) return;
    const storage = typeof source === 'function' ? source() : source;
    const raw = storage.getItem(STORAGE_KEY);
    const issues: string[] = [];
    let values: any[] = [];
    let selectedId: string | null = null;
    if (raw !== null) {
      const value = JSON.parse(raw);
      if (Array.isArray(value)) { values = value; selectedId = storage.getItem('ficha'); }
      else if (value?.format === 'minhafichadnd' && value.version === 1 && value.kind === 'colecao' && Array.isArray(value.data)) {
        values = value.data; selectedId = value.selectedId ?? null;
      } else throw new Error('Coleção legada inválida. Os dados originais estão preservados.');
    }
    const valid = new Map<string, any>();
    values.forEach((v, index) => {
      try {
        const f = hydrateFicha(v);
        if (valid.has(f.id)) { issues.push(`Ficha ${index}: ID duplicado ${f.id}`); return; }
        valid.set(f.id, JSON.parse(serializeCollection([f], null)).data[0]);
      } catch (e) { issues.push(`Ficha ${index}: ${String(e)}`); }
    });
    const tx = db.transaction(['fichas', 'meta'], 'readwrite');
    const completed = complete(tx);
    const meta = tx.objectStore('meta');
    const marker = meta.get('migracao-localStorage-v1');
    marker.onsuccess = () => {
      if (marker.result) return;
      const store = tx.objectStore('fichas');
      for (const [id, data] of valid) {
        const found = store.get(id);
        found.onsuccess = () => {
          if (!found.result) {
            store.add(data);
            const verify = store.get(id);
            verify.onsuccess = () => { if (JSON.stringify(verify.result) !== JSON.stringify(data)) tx.abort(); };
          }
        };
      }
      const state = meta.get('estado');
      state.onsuccess = () => {
        meta.put({ revision: (state.result?.revision ?? 0) + 1, selectedId: state.result ? state.result.selectedId : valid.has(selectedId!) ? selectedId : null, ids: Array.from(new Set([...(state.result?.ids ?? []), ...Array.from(valid.keys())])) }, 'estado');
      };
      meta.put({ completedAt: new Date().toISOString(), issues, count: valid.size }, 'migracao-localStorage-v1');
    };
    await completed;
    if (issues.length) console.warn('Migração de fichas: registros inválidos preservados no localStorage.', issues);
  }
  async load() {
    const db = await this.open();
    const tx = db.transaction(['fichas', 'meta'], 'readonly');
    const completed = complete(tx);
    const [data, state] = await Promise.all([request(tx.objectStore('fichas').getAll()), request(tx.objectStore('meta').get('estado')), completed]);
    const positions = new Map<string, number>((state?.ids ?? []).map((id: string, index: number) => [id, index]));
    data.sort((a, b) => (positions.get(a.id) ?? data.length) - (positions.get(b.id) ?? data.length));
    return { fichas: data.map(hydrateFicha), selectedId: state?.selectedId ?? null, revision: state?.revision ?? 0 };
  }
  async get(id: string) {
    const db = await this.open();
    const tx = db.transaction('fichas', 'readonly');
    const completed = complete(tx);
    const [data] = await Promise.all([request(tx.objectStore('fichas').get(id)), completed]);
    return data ? hydrateFicha(data) : null;
  }

  async save(raw: string, revision: number, recovery = false) {
    parseCollection(raw);
    const { data, selectedId } = JSON.parse(raw);
    const db = await this.open();
    const tx = db.transaction(['fichas', 'meta'], 'readwrite');
    const completed = complete(tx);
    let conflict = false;
    const meta = tx.objectStore('meta');
    const state = meta.get('estado');
    state.onsuccess = () => {
      if ((state.result?.revision ?? 0) !== revision) { conflict = true; tx.abort(); return; }
      const store = tx.objectStore('fichas');
      store.clear();
      data.forEach((f: any) => store.put(f));
      meta.put({ revision: revision + 1, selectedId, ids: data.map((f: any) => f.id) }, 'estado');
      if (recovery) meta.put({ completedAt: new Date().toISOString(), recovery: true }, 'migracao-localStorage-v1');
    };
    try { await completed; } catch (e) {
      if (conflict) throw new Error('As fichas foram alteradas em outra aba. Exporte as alterações em memória e releia o armazenamento.');
      throw e;
    }
    return revision + 1;
  }
}
