/** Node primitives omitted by Jest 27's sandbox; only loaded by IndexedDB tests. */
import { Blob as NodeBlob } from 'buffer';
import { runInThisContext } from 'vm';

const cloneNativo: typeof structuredClone = runInThisContext('structuredClone');
// Rebuild plain DTO objects inside this realm, as browser structured clone does.
function cloneNoContexto<T>(valor: T): T {
  if (valor instanceof NodeBlob) return cloneNativo(valor);
  if (Array.isArray(valor)) return valor.map(item => cloneNoContexto(item)) as T;
  if (valor && typeof valor === 'object' && Object.getPrototypeOf(valor) === Object.prototype) {
    return Object.fromEntries(Object.entries(valor).map(([chave, item]) => [chave, cloneNoContexto(item)])) as T;
  }
  return cloneNativo(valor);
}
Object.defineProperty(globalThis, 'Blob', { configurable: true, value: NodeBlob });
Object.defineProperty(globalThis, 'DOMException', { configurable: true, value: runInThisContext('DOMException') });
Object.defineProperty(globalThis, 'structuredClone', { configurable: true, value: cloneNoContexto });
