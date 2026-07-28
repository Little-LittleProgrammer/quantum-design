import { IDBKeyRange, indexedDB } from 'fake-indexeddb';

Object.defineProperties(window, {
    indexedDB: { configurable: true, value: indexedDB },
    IDBKeyRange: { configurable: true, value: IDBKeyRange },
});
