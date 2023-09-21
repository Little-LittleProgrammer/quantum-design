import { js_is_window } from './is';

interface IIndexedDBRes {
    code: number;
    data?: any;
    error?: ChangeEvent;
    msg?: string
}
enum ErrorCode {
    // 错误码
    success= 200, // 成功
    error= 401, // key不存在
    open= 91001, // 打开数据库失败的错误
    save= 91002, // 保存数据失败的错误
    get= 91003, // 获取数据失败的错误
    delete= 91004, // 删除数据失败的错误
    deleteAll= 91005 // 清空数据库失败的错误
}

export default class IndexedDB {
    public dbversion: number;
    public indexedDB: IDBFactory | null;
    public cacheDB: any;
    constructor(public dbName: string, public storeName: string, version = 1) {
        this.dbName = dbName; // 库名
        this.dbversion = version;
        this.storeName = storeName; // 表名
        this.indexedDB = js_is_window(window) ? window.indexedDB : null;
        this.cacheDB = null; // 缓存数据库，避免重复open 与createStore
    }
    // 创建表 私有属性
    private _createStore(): IDBObjectStore {
        let _store;
        if (this.indexedDB) { // 如果支持
            const _txn = this.cacheDB.transaction(this.storeName, 'readwrite'); // IndexDB的读写权限
            _store = _txn.objectStore(this.storeName);
        }
        return _store;
    }
    // 打开数据库 私有属性
    private _open(callback: Fn) {
        if (this.indexedDB) {
            if (!this.cacheDB) {
                // 如果缓存中没有，则创建数据库或者打开数据库
                const _request = this.indexedDB.open(this.dbName, this.dbversion);
                _request.onerror = (e) => {
                    callback({ code: ErrorCode.open, error: e });
                };
                _request.onsuccess = (e) => {
                    if (!this.cacheDB) {
                        this.cacheDB = (e.target as any)?.result;
                    }
                    const _store = this._createStore();
                    callback(_store);
                };
                _request.onupgradeneeded = (e) => {
                    this.cacheDB = (e.target as any)?.result;
                    const _store = this.cacheDB.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    _store.createIndex('key', 'key', { unique: false });
                    callback(_store);
                };
            } else {
                const _store = this._createStore();
                callback(_store);
            }
        }
    }
    // 设置值
    set(key: string|number|symbol, value: any): Promise<IIndexedDBRes> | undefined {
        if (this.indexedDB) {
            return new Promise((resolve, reject) => {
                const _data = {
                    key, value
                };
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        const _request = result.put(_data);
                        _request.onsuccess = () => {
                            resolve({ code: ErrorCode.success, msg: '添加成功' });
                        };
                        _request.onerror = (e:Error) => {
                            reject({ code: ErrorCode.save, error: e, msg: '添加失败' });
                        };
                    }
                });
            });
        }
    }
    // 得到key
    get(key?: string|number|symbol):Promise<IIndexedDBRes> | undefined {
        return new Promise((resolve, reject) => {
            if (this.indexedDB) {
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        const _request = result.index('key').openCursor();
                        const _resList: any[] = [];
                        _request.onsuccess = (e: any) => {
                            const _cursor = e.target.result;
                            if (_cursor) {
                                const _current = _cursor.value;
                                _resList.push(_current);
                                _cursor.continue();
                            } else {
                                resolve({ code: ErrorCode.success, data: key ? _resList.filter((item) => item.key === key) : _resList, msg: '查询成功' });
                            }
                        };
                        _request.onerror = (e:ChangeEvent) => {
                            reject({ code: ErrorCode.get, error: e, msg: '查询失败' });
                        };
                    }
                });
            }
        });
    }
    // 只适用于唯一key情况， 否则会全部更改
    update(key: string|number|symbol, value: any):Promise<IIndexedDBRes> | undefined {
        return new Promise((resolve, reject) => {
            if (this.indexedDB) {
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        const _request = result.index('key').openCursor();
                        _request.onsuccess = (e: any) => {
                            const _cursor = e.target.result;
                            if (_cursor) {
                                if (_cursor.key === key) {
                                    const _current = _cursor.value;
                                    const _request2 = _cursor.update({
                                        ..._current,
                                        ...value
                                    });
                                    _request2.onerror = (e:ChangeEvent) => {
                                        reject({ code: ErrorCode.get, error: e, msg: '更新失败' });
                                    };
                                }
                                _cursor.continue();
                            } else {
                                resolve({ code: ErrorCode.success, msg: '更新成功' });
                            }
                        };
                        _request.onerror = (e: Error) => {
                            reject({ code: ErrorCode.get, error: e, msg: '更新失败' });
                        };
                    }
                });
            }
        });
    }
    // 根据key删除
    delete(key: string|number|symbol, num?:number):Promise<IIndexedDBRes> | undefined {
        return new Promise((resolve, reject) => {
            if (this.indexedDB) {
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        const _request = result.index('key').openCursor();
                        let _index = 0;
                        _request.onsuccess = (e: any) => {
                            const _cursor = e.target.result;
                            if (_cursor) {
                                if (_cursor.key === key) {
                                    if (num) {
                                        // 删除指定个数
                                        if (_index < num) {
                                            _cursor.delete();
                                        }
                                        _index++;
                                    } else {
                                        // 删除全部
                                        _cursor.delete();
                                    }
                                }
                                _cursor.continue();
                            } else {
                                resolve({ code: ErrorCode.success, msg: '删除成功' });
                            }
                        };
                        _request.onerror = function(e: ChangeEvent) {
                            resolve({ code: ErrorCode.delete, error: e });
                        };
                    }
                });
            }
        });
    }
    // 删除所有
    deleteAll() {
        return new Promise((resolve, reject) => {
            // 清空数据库
            if (this.indexedDB) {
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        result.clear();
                        resolve({ code: ErrorCode.success, msg: '删除所有成功' });
                    }
                });
            }
        });
    }
}

