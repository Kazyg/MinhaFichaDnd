import '@testing-library/jest-dom';
import { IDBFactory } from 'fake-indexeddb';
import { runInThisContext } from 'vm';
const cloneNative = runInThisContext('structuredClone');

// JSDOM lacks structuredClone. Keep its Blob/File implementations intact.
const cloneForIndexedDB = value => {
  if (value instanceof Blob) return value.slice(0, value.size, value.type);
  if (Array.isArray(value)) return value.map(cloneForIndexedDB);
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneForIndexedDB(item)]));
  return cloneNative(value);
};
Object.defineProperty(window, 'structuredClone', { configurable: true, value: cloneForIndexedDB });
beforeEach(() => { window.indexedDB = new IDBFactory(); });
