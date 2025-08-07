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
    storeNotFound = 91006, // 对象存储不存在
}

/**
 * 数据库连接缓存
 */
interface DBCache {
    db: IDBDatabase;
    version: number;
    stores: Set<string>;
}

/**
 * IndexedDB 封装类
 * 提供对 IndexedDB 的基本 CRUD 操作
 * 支持一个数据库多个表，以及版本更新功能
 */
export class IndexedDB {
    /** 数据库版本号 */
    public dbversion: number;
    /** IndexedDB 实例 */
    public indexedDB: IDBFactory | null;
    /** 缓存的数据库连接，避免重复创建 */
    private static dbCacheMap = new Map<string, DBCache>();
    /** 当前使用的数据库名称 */
    public readonly dbName: string;
    /** 当前使用的表名称 */
    public readonly storeName: string;
    /** 预定义的表列表 */
    private static storeSchemas = new Map<string, Set<string>>();

    /**
     * 构造函数
     * @param dbName 数据库名称
     * @param storeName 数据表名称
     * @param version 数据库版本，默认为 1
     */
    constructor(dbName: string, storeName: string, version = 1) {
        this.dbName = dbName;
        this.dbversion = version;
        this.storeName = storeName;
        this.indexedDB = isWindow(window) ? window.indexedDB : null;

        // 注册表到预定义列表
        if (!IndexedDB.storeSchemas.has(dbName)) {
            IndexedDB.storeSchemas.set(dbName, new Set());
        }
        IndexedDB.storeSchemas.get(dbName)!.add(storeName);
    }

    /**
     * 获取对象存储（表）
     * @private
     * @returns {IDBObjectStore | null} 对象存储实例
     */
    private _getStore(): IDBObjectStore | null {
        const cache = IndexedDB.dbCacheMap.get(this.dbName);
        if (!cache || !this.indexedDB) {
            return null;
        }

        try {
            // 检查表是否存在
            if (!cache.db.objectStoreNames.contains(this.storeName)) {
                console.error(`对象存储 "${this.storeName}" 在数据库 "${this.dbName}" 中不存在`);
                return null;
            }

            const transaction = cache.db.transaction(this.storeName, 'readwrite');
            return transaction.objectStore(this.storeName);
        } catch (error) {
            console.error('获取对象存储失败:', error);
            return null;
        }
    }

    /**
     * 检查并升级数据库版本
     * @private
     */
    private _checkAndUpgradeVersion(): number {
        const cache = IndexedDB.dbCacheMap.get(this.dbName);
        const requiredStores = IndexedDB.storeSchemas.get(this.dbName) || new Set();

        if (!cache) {
            return this.dbversion;
        }

        // 检查是否有新的表需要创建
        let needsUpgrade = false;
        for (const storeName of requiredStores) {
            if (!cache.db.objectStoreNames.contains(storeName)) {
                needsUpgrade = true;
                break;
            }
        }

        if (needsUpgrade) {
            // 需要升级版本
            return cache.version + 1;
        }

        return cache.version;
    }

    /**
     * 打开数据库
     * @private
     * @param callback 回调函数，接收创建的存储或错误信息
     */
    private _open(callback: Fn) {
        if (!this.indexedDB) {
            callback({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
            return;
        }

        const cache = IndexedDB.dbCacheMap.get(this.dbName);

        if (cache) {
            // 检查表是否存在
            if (cache.db.objectStoreNames.contains(this.storeName)) {
                const store = this._getStore();
                if (store) {
                    callback(store);
                    return;
                } else {
                    callback({ code: ErrorCode.storeNotFound, error: new Error(`对象存储 "${this.storeName}" 不存在`), msg: `对象存储 "${this.storeName}" 不存在` });
                    return;
                }
            } else {
                // 表不存在，需要升级数据库
                cache.db.close(); // 关闭当前连接
                IndexedDB.dbCacheMap.delete(this.dbName); // 清除缓存
            }
        }

        // 检查并确定需要的版本号
        const targetVersion = this._checkAndUpgradeVersion();
        const request = this.indexedDB.open(this.dbName, targetVersion);

        // 打开数据库失败时的回调
        request.onerror = (e) => {
            callback({ code: ErrorCode.open, error: e, msg: '打开数据库失败' });
        };

        // 打开数据库成功时的回调
        request.onsuccess = (e) => {
            const db = (e.target as any)?.result as IDBDatabase;
            if (!db) {
                callback({ code: ErrorCode.open, error: new Error('数据库连接失败'), msg: '数据库连接失败' });
                return;
            }

            // 更新缓存
            const stores = new Set<string>();
            for (let i = 0; i < db.objectStoreNames.length; i++) {
                stores.add(db.objectStoreNames[i]);
            }

            IndexedDB.dbCacheMap.set(this.dbName, {
                db,
                version: targetVersion,
                stores
            });

            // 获取对象存储
            const store = this._getStore();
            if (store) {
                callback(store);
            } else {
                callback({ code: ErrorCode.storeNotFound, error: new Error(`对象存储 "${this.storeName}" 不存在`), msg: `对象存储 "${this.storeName}" 不存在` });
            }
        };

        // 数据库版本升级时的回调
        request.onupgradeneeded = (e) => {
            const db = (e.target as any)?.result as IDBDatabase;
            if (!db) {
                callback({ code: ErrorCode.open, error: new Error('数据库升级失败'), msg: '数据库升级失败' });
                return;
            }

            // 获取当前数据库需要的所有表
            const requiredStores = IndexedDB.storeSchemas.get(this.dbName) || new Set();

            // 创建所有需要但不存在的表
            for (const storeName of requiredStores) {
                if (!db.objectStoreNames.contains(storeName)) {
                    try {
                        console.log(`创建对象存储: ${storeName}`);
                        const store = db.createObjectStore(storeName, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        // 创建索引，用于按 key 查询
                        store.createIndex('key', 'key', { unique: false });
                    } catch (error) {
                        console.error(`创建对象存储 ${storeName} 失败:`, error);
                    }
                }
            }

            // 由于在 onupgradeneeded 中，事务是自动的，我们直接获取当前存储
            try {
                const store = request.transaction?.objectStore(this.storeName);
                if (store) {
                    callback(store);
                } else {
                    callback({ code: ErrorCode.storeNotFound, error: new Error(`无法获取对象存储 "${this.storeName}"`), msg: `无法获取对象存储 "${this.storeName}"` });
                }
            } catch (error) {
                callback({ code: ErrorCode.storeNotFound, error, msg: `获取对象存储失败: ${error}` });
            }
        };
    }

    /**
     * 设置键值对
     * 如果 key 存在则更新，不存在则添加
     * @param key 键名
     * @param value 值
     * @returns {Promise<IIndexedDBRes>} 操作结果
     */
    set(key: string|number|symbol, value: any): Promise<IIndexedDBRes> | undefined {
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            // 先检查 key 是否存在
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
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
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
        });
    }

    /**
     * 获取数据
     * @param key 键名，可选。如果不传则返回所有数据
     * @returns {Promise<IIndexedDBRes>} 查询结果
     */
    get(key?: string|number|symbol): Promise<IIndexedDBRes> | undefined {
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
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
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
        });
    }

    /**
     * 获取所有数据
     * @returns {Promise<IIndexedDBRes>} 查询结果
     */
    getAll(): Promise<IIndexedDBRes> | undefined {
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
                    const _request = result.index('key').openCursor();
                    const _resList: any[] = [];

                    _request.onsuccess = (e: any) => {
                        const _cursor = e.target.result;
                        if (_cursor) {
                            _resList.push(_cursor.value);
                            _cursor.continue();
                        } else {
                            resolve({ code: ErrorCode.success, data: _resList, msg: '查询成功' });
                        }
                    };

                    _request.onerror = (e: ChangeEvent) => {
                        reject({ code: ErrorCode.get, error: e, msg: '查询失败' });
                    };
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
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
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
                    const _request = result.index('key').openCursor();

                    _request.onsuccess = (e: any) => {
                        const _cursor = e.target.result;
                        if (_cursor) {
                            if (_cursor.value.key === key) {
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
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
        });
    }

    /**
     * 根据键名删除数据
     * @param key 键名
     * @param num 删除数量，可选。如果不传则删除所有匹配的数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    delete(key: string|number|symbol, num?: number): Promise<IIndexedDBRes> | undefined {
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
                    const _request = result.index('key').openCursor();
                    let _index = 0;

                    _request.onsuccess = (e: any) => {
                        const _cursor = e.target.result;
                        if (_cursor) {
                            if (_cursor.value.key === key) {
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
                        reject({ code: ErrorCode.delete, error: e, msg: '删除失败' });
                    };
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
        });
    }

    /**
     * 删除所有数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    deleteAll(): Promise<IIndexedDBRes> {
        if (!this.indexedDB) {
            return Promise.reject({ code: ErrorCode.open, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
        }

        return new Promise((resolve, reject) => {
            this._open((result) => {
                if (result.error || result.code) {
                    reject(result);
                    return;
                }

                try {
                    // 清空对象存储中的所有数据
                    const clearRequest = result.clear();
                    clearRequest.onsuccess = () => {
                        resolve({ code: ErrorCode.success, msg: '删除所有成功' });
                    };
                    clearRequest.onerror = (e: ChangeEvent) => {
                        reject({ code: ErrorCode.deleteAll, error: e, msg: '删除所有失败' });
                    };
                } catch (error) {
                    reject({ code: ErrorCode.storeNotFound, error, msg: '无法访问对象存储' });
                }
            });
        });
    }

    /**
     * 检查 IndexedDB 是否受支持
     * @returns {boolean} 是否支持
     */
    support(): boolean {
        return this.indexedDB !== null;
    }

    /**
     * 静态方法：清除指定数据库的缓存
     * @param dbName 数据库名称
     */
    static clearCache(dbName: string): void {
        const cache = IndexedDB.dbCacheMap.get(dbName);
        if (cache) {
            cache.db.close();
            IndexedDB.dbCacheMap.delete(dbName);
        }
    }

    /**
     * 静态方法：清除所有数据库缓存
     */
    static clearAllCache(): void {
        IndexedDB.dbCacheMap.forEach((cache) => {
            cache.db.close();
        });
        IndexedDB.dbCacheMap.clear();
        IndexedDB.storeSchemas.clear();
    }
}

