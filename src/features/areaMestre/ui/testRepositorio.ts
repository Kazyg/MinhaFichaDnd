import { IDBFactory } from 'fake-indexeddb';
import { criarRepositorioCampanhas } from '../persistencia';

// Jest 27/jsdom does not expose structuredClone. Keep cloned DTOs in this
// realm, and preserve browser Blob identity/type instead of substituting Node Blob.
function clonar<T>(valor: T): T {
  if (valor instanceof Blob) return valor.slice(0, valor.size, valor.type) as T;
  if (Array.isArray(valor)) return valor.map(clonar) as T;
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([chave, item]) => [chave, clonar(item)])) as T;
  }
  return valor;
}

export function repositorioTeste() {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'structuredClone');
  const cryptoAnterior = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  let sequencia = 0;
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => `campanha-teste-${++sequencia}` } });
  Object.defineProperty(globalThis, 'structuredClone', { configurable: true, value: clonar });
  const repositorio = criarRepositorioCampanhas({ indexedDB: new IDBFactory() });
  return {
    repositorio,
    limpar() {
      repositorio.fechar();
      if (anterior) Object.defineProperty(globalThis, 'structuredClone', anterior);
      else Reflect.deleteProperty(globalThis, 'structuredClone');
      if (cryptoAnterior) Object.defineProperty(globalThis, 'crypto', cryptoAnterior);
      else Reflect.deleteProperty(globalThis, 'crypto');
    },
  };
}
