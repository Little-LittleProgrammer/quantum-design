import { isWindow } from './is';

/**
 * IndexedDB 操作结果接口
 * @interface IIndexedDBRes
 */
interface IIndexedDBRes<T = any> {
    /** 状态码 */
    code: number;
    /** 返回的数据 */
    data?: T;
    /** 错误信息 */
    error?: Error | Event | DOMException;
    /** 提示信息 */
    msg?: string;
}

/**
 * 存储的数据项接口
 */
interface IStoredItem<T = any> {
    /** 自增 ID */
    id?: number;
    /** 用户定义的键 */
    key: string | number | symbol;
    /** 存储的值 */
    value: T;
    /** 创建时间 */
    createdAt?: number;
    /** 更新时间 */
    updatedAt?: number;
}

/**
 * 错误码枚举
 * @enum ErrorCode
 */
enum ErrorCode {
    // 成功
    success = 200,
    // 错误码
    error = 401, // key不存在
    open = 91001, // 打开数据库失败
    save = 91002, // 保存数据失败
    get = 91003, // 获取数据失败
    delete = 91004, // 删除数据失败
    deleteAll = 91005, // 清空数据库失败
    storeNotFound = 91006, // 对象存储不存在
    notSupported = 91007, // IndexedDB 不受支持
    transactionError = 91008, // 事务错误
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
 * 操作队列项
 */
interface QueueItem {
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
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
    /** 操作队列，用于串行化操作避免并发冲突 */
    private operationQueue: QueueItem[] = [];
    /** 是否正在处理队列 */
    private isProcessingQueue = false;

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
        const schema = IndexedDB.storeSchemas.get(dbName);
        if (schema) {
            schema.add(storeName);
        }
    }

    /**
     * 将操作加入队列
     * @private
     */
    private enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.operationQueue.push({ operation, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * 处理操作队列
     * @private
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessingQueue || this.operationQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.operationQueue.length > 0) {
            const item = this.operationQueue.shift();
            if (!item) break;

            try {
                const result = await item.operation();
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * 获取对象存储（表）
     * @private
     * @param mode 事务模式，默认为 'readwrite'
     * @returns {Promise<IDBObjectStore>} 对象存储实例
     */
    private async _getStore(mode: IDBTransactionMode = 'readwrite'): Promise<IDBObjectStore> {
        const cache = IndexedDB.dbCacheMap.get(this.dbName);

        if (!cache) {
            throw new Error(`数据库 "${this.dbName}" 未打开`);
        }

        if (!this.indexedDB) {
            throw new Error('IndexedDB 不受支持');
        }

        // 检查表是否存在
        if (!cache.db.objectStoreNames.contains(this.storeName)) {
            throw new Error(`对象存储 "${this.storeName}" 在数据库 "${this.dbName}" 中不存在`);
        }

        const transaction = cache.db.transaction(this.storeName, mode);
        return transaction.objectStore(this.storeName);
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
     * @returns {Promise<IDBDatabase>} 数据库实例
     */
    private _open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (!this.indexedDB) {
                reject({
                    code: ErrorCode.notSupported,
                    error: new Error('IndexedDB 不受支持'),
                    msg: 'IndexedDB 不受支持',
                });
                return;
            }

            const cache = IndexedDB.dbCacheMap.get(this.dbName);

            // 如果缓存存在且表也存在，直接返回
            if (cache && cache.db.objectStoreNames.contains(this.storeName)) {
                resolve(cache.db);
                return;
            }

            // 如果缓存存在但表不存在，需要升级数据库
            if (cache) {
                cache.db.close();
                IndexedDB.dbCacheMap.delete(this.dbName);
            }

            // 检查并确定需要的版本号
            const targetVersion = this._checkAndUpgradeVersion();
            const request = this.indexedDB.open(this.dbName, targetVersion);

            // 打开数据库失败
            request.onerror = () => {
                reject({
                    code: ErrorCode.open,
                    error: request.error,
                    msg: '打开数据库失败',
                });
            };

            // 打开数据库成功
            request.onsuccess = () => {
                const db = request.result;
                if (!db) {
                    reject({
                        code: ErrorCode.open,
                        error: new Error('数据库连接失败'),
                        msg: '数据库连接失败',
                    });
                    return;
                }

                // 更新缓存
                const stores = new Set<string>();
                for (let i = 0; i < db.objectStoreNames.length; i++) {
                    const storeName = db.objectStoreNames[i];
                    if (storeName) {
                        stores.add(storeName);
                    }
                }

                IndexedDB.dbCacheMap.set(this.dbName, {
                    db,
                    version: targetVersion,
                    stores,
                });

                // 验证表是否存在
                if (!db.objectStoreNames.contains(this.storeName)) {
                    reject({
                        code: ErrorCode.storeNotFound,
                        error: new Error(`对象存储 "${this.storeName}" 不存在`),
                        msg: `对象存储 "${this.storeName}" 不存在`,
                    });
                    return;
                }

                resolve(db);
            };

            // 数据库版本升级
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db) {
                    reject({
                        code: ErrorCode.open,
                        error: new Error('数据库升级失败'),
                        msg: '数据库升级失败',
                    });
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
                                autoIncrement: true,
                            });
                            // 创建索引，用于按 key 查询
                            store.createIndex('key', 'key', { unique: false });
                            // 创建时间索引
                            store.createIndex('createdAt', 'createdAt', { unique: false });
                            store.createIndex('updatedAt', 'updatedAt', { unique: false });
                        } catch (error) {
                            console.error(`创建对象存储 ${storeName} 失败:`, error);
                        }
                    }
                }
            };
        });
    }

    /**
     * 执行数据库操作的通用方法
     * @private
     */
    private async _executeOperation<T>(operation: (store: IDBObjectStore) => Promise<T>, mode: IDBTransactionMode = 'readwrite'): Promise<T> {
        await this._open();
        const store = await this._getStore(mode);
        return operation(store);
    }

    /**
     * 设置键值对
     * 如果 key 存在则更新，不存在则添加
     * @param key 键名
     * @param value 值
     * @returns {Promise<IIndexedDBRes>} 操作结果
     */
    set<T = any>(key: string | number | symbol, value: T): Promise<IIndexedDBRes> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                return new Promise((resolve, reject) => {
                    // 使用索引查询是否存在
                    const index = store.index('key');
                    const getRequest = index.get(IDBKeyRange.only(key as any));

                    getRequest.onsuccess = () => {
                        const existingItem = getRequest.result as IStoredItem<T> | undefined;
                        const now = Date.now();

                        if (existingItem) {
                            // 更新现有数据
                            const updatedItem: IStoredItem<T> = {
                                ...existingItem,
                                value,
                                updatedAt: now,
                            };

                            const updateRequest = store.put(updatedItem);

                            updateRequest.onsuccess = () => {
                                resolve({
                                    code: ErrorCode.success,
                                    data: updatedItem,
                                    msg: '更新成功',
                                });
                            };

                            updateRequest.onerror = () => {
                                reject({
                                    code: ErrorCode.save,
                                    error: updateRequest.error,
                                    msg: '更新失败',
                                });
                            };
                        } else {
                            // 添加新数据
                            const newItem: IStoredItem<T> = {
                                key,
                                value,
                                createdAt: now,
                                updatedAt: now,
                            };

                            const addRequest = store.add(newItem);

                            addRequest.onsuccess = () => {
                                resolve({
                                    code: ErrorCode.success,
                                    data: { ...newItem, id: addRequest.result as number },
                                    msg: '添加成功',
                                });
                            };

                            addRequest.onerror = () => {
                                reject({
                                    code: ErrorCode.save,
                                    error: addRequest.error,
                                    msg: '添加失败',
                                });
                            };
                        }
                    };

                    getRequest.onerror = () => {
                        reject({
                            code: ErrorCode.get,
                            error: getRequest.error,
                            msg: '检查键是否存在失败',
                        });
                    };
                });
            });
        });
    }

    /**
     * 获取数据
     * @param key 键名，可选。如果不传则返回所有数据
     * @returns {Promise<IIndexedDBRes<IStoredItem[]>>} 查询结果
     */
    get<T = any>(key?: string | number | symbol): Promise<IIndexedDBRes<IStoredItem<T>[]>> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes<IStoredItem<T>[]>>(async (store) => {
                return new Promise((resolve, reject) => {
                    if (key !== undefined) {
                        // 使用索引直接查询单个 key
                        const index = store.index('key');
                        const getRequest = index.getAll(IDBKeyRange.only(key as any));

                        getRequest.onsuccess = () => {
                            const results = getRequest.result as IStoredItem<T>[];
                            resolve({
                                code: ErrorCode.success,
                                data: results,
                                msg: '查询成功',
                            });
                        };

                        getRequest.onerror = () => {
                            reject({
                                code: ErrorCode.get,
                                error: getRequest.error,
                                msg: '查询失败',
                            });
                        };
                    } else {
                        // 获取所有数据
                        const getAllRequest = store.getAll();

                        getAllRequest.onsuccess = () => {
                            const results = getAllRequest.result as IStoredItem<T>[];
                            resolve({
                                code: ErrorCode.success,
                                data: results,
                                msg: '查询成功',
                            });
                        };

                        getAllRequest.onerror = () => {
                            reject({
                                code: ErrorCode.get,
                                error: getAllRequest.error,
                                msg: '查询失败',
                            });
                        };
                    }
                });
            }, 'readonly');
        });
    }

    /**
     * 获取所有数据
     * @returns {Promise<IIndexedDBRes<IStoredItem[]>>} 查询结果
     */
    getAll<T = any>(): Promise<IIndexedDBRes<IStoredItem<T>[]>> {
        return this.get<T>();
    }

    /**
     * 更新数据
     * @param key 键名
     * @param updates 要更新的字段
     * @returns {Promise<IIndexedDBRes>} 更新结果
     */
    update<T = any>(key: string | number | symbol, updates: Partial<Omit<IStoredItem<T>, 'id' | 'key' | 'createdAt'>>): Promise<IIndexedDBRes> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                return new Promise((resolve, reject) => {
                    const index = store.index('key');
                    const getRequest = index.get(IDBKeyRange.only(key as any));

                    getRequest.onsuccess = () => {
                        const existingItem = getRequest.result as IStoredItem<T> | undefined;

                        if (!existingItem) {
                            reject({
                                code: ErrorCode.error,
                                error: new Error(`键 "${String(key)}" 不存在`),
                                msg: `键 "${String(key)}" 不存在`,
                            });
                            return;
                        }

                        // 合并更新
                        const updatedItem: IStoredItem<T> = {
                            ...existingItem,
                            ...updates,
                            updatedAt: Date.now(),
                        };

                        const updateRequest = store.put(updatedItem);

                        updateRequest.onsuccess = () => {
                            resolve({
                                code: ErrorCode.success,
                                data: updatedItem,
                                msg: '更新成功',
                            });
                        };

                        updateRequest.onerror = () => {
                            reject({
                                code: ErrorCode.save,
                                error: updateRequest.error,
                                msg: '更新失败',
                            });
                        };
                    };

                    getRequest.onerror = () => {
                        reject({
                            code: ErrorCode.get,
                            error: getRequest.error,
                            msg: '查询数据失败',
                        });
                    };
                });
            });
        });
    }

    /**
     * 根据键名删除数据
     * @param key 键名
     * @param limit 删除数量限制，可选。如果不传则删除所有匹配的数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    delete(key: string | number | symbol, limit?: number): Promise<IIndexedDBRes> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                return new Promise((resolve, reject) => {
                    const index = store.index('key');
                    const cursorRequest = index.openCursor(IDBKeyRange.only(key as any));
                    let deletedCount = 0;

                    cursorRequest.onsuccess = (event) => {
                        const cursor = (event.target as IDBRequest).result;

                        if (cursor) {
                            if (limit === undefined || deletedCount < limit) {
                                cursor.delete();
                                deletedCount++;
                            }

                            if (limit === undefined || deletedCount < limit) {
                                cursor.continue();
                            } else {
                                resolve({
                                    code: ErrorCode.success,
                                    data: { deletedCount },
                                    msg: `成功删除 ${deletedCount} 条数据`,
                                });
                            }
                        } else {
                            // 游标遍历完成
                            if (deletedCount === 0) {
                                reject({
                                    code: ErrorCode.error,
                                    error: new Error(`键 "${String(key)}" 不存在`),
                                    msg: `键 "${String(key)}" 不存在`,
                                });
                            } else {
                                resolve({
                                    code: ErrorCode.success,
                                    data: { deletedCount },
                                    msg: `成功删除 ${deletedCount} 条数据`,
                                });
                            }
                        }
                    };

                    cursorRequest.onerror = () => {
                        reject({
                            code: ErrorCode.delete,
                            error: cursorRequest.error,
                            msg: '删除失败',
                        });
                    };
                });
            });
        });
    }

    /**
     * 删除所有数据
     * @returns {Promise<IIndexedDBRes>} 删除结果
     */
    deleteAll(): Promise<IIndexedDBRes> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                return new Promise((resolve, reject) => {
                    const clearRequest = store.clear();

                    clearRequest.onsuccess = () => {
                        resolve({
                            code: ErrorCode.success,
                            msg: '删除所有数据成功',
                        });
                    };

                    clearRequest.onerror = () => {
                        reject({
                            code: ErrorCode.deleteAll,
                            error: clearRequest.error,
                            msg: '删除所有数据失败',
                        });
                    };
                });
            });
        });
    }

    /**
     * 获取数据总数
     * @param key 可选，指定 key 则统计该 key 的数量
     * @returns {Promise<IIndexedDBRes<number>>} 数量结果
     */
    count(key?: string | number | symbol): Promise<IIndexedDBRes<number>> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes<number>>(async (store) => {
                return new Promise((resolve, reject) => {
                    let countRequest: IDBRequest;

                    if (key !== undefined) {
                        const index = store.index('key');
                        countRequest = index.count(IDBKeyRange.only(key as any));
                    } else {
                        countRequest = store.count();
                    }

                    countRequest.onsuccess = () => {
                        resolve({
                            code: ErrorCode.success,
                            data: countRequest.result,
                            msg: '统计成功',
                        });
                    };

                    countRequest.onerror = () => {
                        reject({
                            code: ErrorCode.get,
                            error: countRequest.error,
                            msg: '统计失败',
                        });
                    };
                });
            }, 'readonly');
        });
    }

    /**
     * 检查指定的 key 是否存在
     * @param key 键名
     * @returns {Promise<boolean>} 是否存在
     */
    async has(key: string | number | symbol): Promise<boolean> {
        try {
            const result = await this.get(key);
            return result.data !== undefined && result.data.length > 0;
        } catch {
            return false;
        }
    }

    /**
     * 获取所有的 keys
     * @returns {Promise<IIndexedDBRes<Array<string | number | symbol>>>} keys 列表
     */
    keys(): Promise<IIndexedDBRes<Array<string | number | symbol>>> {
        if (!this.indexedDB) {
            return Promise.reject({
                code: ErrorCode.notSupported,
                error: new Error('IndexedDB 不受支持'),
                msg: 'IndexedDB 不受支持',
            });
        }

        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes<Array<string | number | symbol>>>(async (store) => {
                return new Promise((resolve, reject) => {
                    const getAllRequest = store.getAll();

                    getAllRequest.onsuccess = () => {
                        const items = getAllRequest.result as IStoredItem[];
                        const keys = items.map((item) => item.key);
                        resolve({
                            code: ErrorCode.success,
                            data: keys,
                            msg: '获取 keys 成功',
                        });
                    };

                    getAllRequest.onerror = () => {
                        reject({
                            code: ErrorCode.get,
                            error: getAllRequest.error,
                            msg: '获取 keys 失败',
                        });
                    };
                });
            }, 'readonly');
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
     * 关闭数据库连接
     */
    close(): void {
        const cache = IndexedDB.dbCacheMap.get(this.dbName);
        if (cache) {
            cache.db.close();
            IndexedDB.dbCacheMap.delete(this.dbName);
        }
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

    /**
     * 静态方法：删除整个数据库
     * @param dbName 数据库名称
     * @returns {Promise<void>}
     */
    static deleteDatabase(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                reject(new Error('IndexedDB 不受支持'));
                return;
            }

            // 先关闭并清除缓存
            IndexedDB.clearCache(dbName);

            const deleteRequest = window.indexedDB.deleteDatabase(dbName);

            deleteRequest.onsuccess = () => {
                IndexedDB.storeSchemas.delete(dbName);
                resolve();
            };

            deleteRequest.onerror = () => {
                reject(deleteRequest.error);
            };

            deleteRequest.onblocked = () => {
                console.warn(`删除数据库 "${dbName}" 被阻止，可能有其他连接未关闭`);
            };
        });
    }
}
