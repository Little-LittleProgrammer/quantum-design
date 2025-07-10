import { isWindow } from './is';

/**
 * IndexedDB 操作结果接口
 * @interface IIndexedDBRes
 */
interface IIndexedDBRes {
    /** 状态码 */
    code: number;
    /** 返回的数据 */
    data?: any;
    /** 错误信息 */
    error?: ChangeEvent;
    /** 提示信息 */
    msg?: string;
}

/**
 * 错误码枚举
 * @enum ErrorCode
 */
enum ErrorCode {
    // 错误码
    success = 200, // 成功
    error = 401, // key不存在
    open = 91001, // 打开数据库失败的错误
    save = 91002, // 保存数据失败的错误
    get = 91003, // 获取数据失败的错误
    delete = 91004, // 删除数据失败的错误
    deleteAll = 91005, // 清空数据库失败的错误
}

/**
 * IndexedDB 封装类
 * 提供对 IndexedDB 的基本 CRUD 操作
 */
export class IndexedDB {
    /** 数据库版本号 */
    public dbversion: number;
    /** IndexedDB 实例 */
    public indexedDB: IDBFactory | null;
    /** 缓存的数据库连接，避免重复创建 */
    public cacheDB: any;

    /**
     * 构造函数
     * @param dbName 数据库名称
     * @param storeName 数据表名称
     * @param version 数据库版本，默认为 1
     */
    constructor(public dbName: string, public storeName: string, version = 1) {
        this.dbName = dbName; // 库名
        this.dbversion = version;
        this.storeName = storeName; // 表名
        this.indexedDB = isWindow(window) ? window.indexedDB : null;
        this.cacheDB = null; // 缓存数据库，避免重复open 与createStore
    }

    /**
     * 创建对象存储（表）
     * @private
     * @returns {IDBObjectStore} 对象存储实例
     */
    private _createStore(): IDBObjectStore {
        let _store;
        if (this.indexedDB) { // 如果支持
            const _txn = this.cacheDB.transaction(this.storeName, 'readwrite'); // IndexDB的读写权限
            _store = _txn.objectStore(this.storeName);
        }
        return _store;
    }

    /**
     * 打开数据库
     * @private
     * @param callback 回调函数，接收创建的存储或错误信息
     */
    private _open(callback: Fn) {
        if (this.indexedDB) {
            if (!this.cacheDB) {
                // 如果缓存中没有，则创建数据库或者打开数据库
                const _request = this.indexedDB.open(this.dbName, this.dbversion);

                // 打开数据库失败时的回调
                _request.onerror = (e) => {
                    callback({ code: ErrorCode.open, error: e });
                };

                // 打开数据库成功时的回调
                _request.onsuccess = (e) => {
                    if (!this.cacheDB) {
                        this.cacheDB = (e.target as any)?.result;
                    }
                    const _store = this._createStore();
                    callback(_store);
                };

                // 数据库版本升级时的回调
                _request.onupgradeneeded = (e) => {
                    this.cacheDB = (e.target as any)?.result;
                    // 创建对象存储，设置主键和自动递增
                    const _store = this.cacheDB.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    // 创建索引，用于按 key 查询
                    _store.createIndex('key', 'key', { unique: false });
                    callback(_store);
                };
            } else {
                // 如果缓存中已有数据库连接，直接创建存储
                const _store = this._createStore();
                callback(_store);
            }
        }
    }

    /**
     * 设置键值对
     * 如果 key 存在则更新，不存在则添加
     * @param key 键名
     * @param value 值
     * @returns {Promise<IIndexedDBRes>} 操作结果
     */
    set(key: string|number|symbol, value: any): Promise<IIndexedDBRes> | undefined {
        if (this.indexedDB) {
            return new Promise((resolve, reject) => {
                // 先检查 key 是否存在
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        const _request = result.index('key').openCursor();
                        let _keyExists = false;

                        _request.onsuccess = (e: any) => {
                            const _cursor = e.target.result;
                            if (_cursor) {
                                if (_cursor.value.key === key) {
                                    _keyExists = true;
                                    // key 存在，调用 update 方法更新
                                    this.update(key, { value })?.then((res) => {
                                        resolve(res);
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                    return; // 找到并更新后直接返回
                                }
                                _cursor.continue();
                            } else {
                                // 游标遍历完成
                                if (!_keyExists) {
                                    // key 不存在，添加新数据
                                    const _data = {
                                        key,
                                        value
                                    };
                                    const _addRequest = result.put(_data);
                                    _addRequest.onsuccess = () => {
                                        resolve({ code: ErrorCode.success, msg: '添加成功' });
                                    };
                                    _addRequest.onerror = (e: Error) => {
                                        reject({ code: ErrorCode.save, error: e, msg: '添加失败' });
                                    };
                                }
                            }
                        };

                        _request.onerror = (e: ChangeEvent) => {
                            reject({ code: ErrorCode.get, error: e, msg: '检查键是否存在失败' });
                        };
                    }
                });
            });
        }
    }

    /**
     * 获取数据
     * @param key 键名，可选。如果不传则返回所有数据
     * @returns {Promise<IIndexedDBRes>} 查询结果
     */
    get(key?: string|number|symbol): Promise<IIndexedDBRes> | undefined {
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
                                // 游标遍历完成，返回结果
                                resolve({
                                    code: ErrorCode.success,
                                    data: key ? _resList.filter((item) => item.key === key) : _resList,
                                    msg: '查询成功'
                                });
                            }
                        };

                        _request.onerror = (e: ChangeEvent) => {
                            reject({ code: ErrorCode.get, error: e, msg: '查询失败' });
                        };
                    }
                });
            }
        });
    }

    /**
     * 更新数据
     * 注意：只适用于唯一key情况，否则会全部更改
     * @param key 键名
     * @param value 新的值对象
     * @returns {Promise<IIndexedDBRes>} 更新结果
     */
    update(key: string|number|symbol, value: any): Promise<IIndexedDBRes> | undefined {
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
                                    // 合并原有数据和新数据
                                    const _request2 = _cursor.update({
                                        ..._current,
                                        ...value
                                    });
                                    _request2.onerror = (e: ChangeEvent) => {
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

    /**
     * 根据键名删除数据
     * @param key 键名
     * @param num 删除数量，可选。如果不传则删除所有匹配的数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    delete(key: string|number|symbol, num?: number): Promise<IIndexedDBRes> | undefined {
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

    /**
     * 删除所有数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    deleteAll() {
        return new Promise((resolve, reject) => {
            // 清空数据库
            if (this.indexedDB) {
                this._open((result) => {
                    if (result.error) {
                        reject(result);
                    } else {
                        // 清空对象存储中的所有数据
                        result.clear();
                        resolve({ code: ErrorCode.success, msg: '删除所有成功' });
                    }
                });
            }
        });
    }
}

