import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IndexedDB } from '../src/indexed-db';

describe('indexed-db.ts', () => {
    let db: IndexedDB;
    const testDbName = 'test-db';
    const testStoreName = 'test-store';

    beforeEach(() => {
        // 创建新的数据库实例
        db = new IndexedDB(testDbName, testStoreName, 1);
    });

    afterEach(async () => {
        // 清理：删除测试数据库
        try {
            db.close();
            await IndexedDB.deleteDatabase(testDbName);
        } catch (error) {
            // 忽略清理错误
        }
    });

    describe('基本操作', () => {
        it('应该能够创建 IndexedDB 实例', () => {
            expect(db).toBeInstanceOf(IndexedDB);
            expect(db.dbName).toBe(testDbName);
            expect(db.storeName).toBe(testStoreName);
            expect(db.dbversion).toBe(1);
        });

        it('应该检查 IndexedDB 是否受支持', () => {
            expect(db.support()).toBe(true);
        });

        it('应该能够设置和获取数据', async () => {
            const key = 'test-key';
            const value = { name: 'test', age: 25 };

            const setResult = await db.set(key, value);
            expect(setResult.code).toBe(200);

            const getResult = await db.get(key);
            expect(getResult.code).toBe(200);
            expect(getResult.data).toBeDefined();
            expect(getResult.data![0].value).toEqual(value);
        });

        it('应该能够更新已存在的数据', async () => {
            const key = 'test-key';
            const value1 = { name: 'test1' };
            const value2 = { name: 'test2' };

            await db.set(key, value1);
            const result1 = await db.get(key);
            expect(result1.data![0].value).toEqual(value1);

            await db.set(key, value2);
            const result2 = await db.get(key);
            expect(result2.data![0].value).toEqual(value2);
        });

        it('应该能够删除数据', async () => {
            const key = 'test-key';
            const value = { name: 'test' };

            await db.set(key, value);
            const getResult1 = await db.get(key);
            expect(getResult1.data).toHaveLength(1);

            const deleteResult = await db.delete(key);
            expect(deleteResult.code).toBe(200);

            const getResult2 = await db.get(key);
            expect(getResult2.data).toHaveLength(0);
        });

        it('应该能够获取所有数据', async () => {
            await db.set('key1', { value: 1 });
            await db.set('key2', { value: 2 });
            await db.set('key3', { value: 3 });

            const result = await db.getAll();
            expect(result.code).toBe(200);
            expect(result.data).toBeDefined();
            expect(result.data!.length).toBeGreaterThanOrEqual(3);
        });

        it('应该能够清空所有数据', async () => {
            await db.set('key1', { value: 1 });
            await db.set('key2', { value: 2 });

            const deleteResult = await db.deleteAll();
            expect(deleteResult.code).toBe(200);

            const getAllResult = await db.getAll();
            expect(getAllResult.data).toHaveLength(0);
        });

        it('应该能够统计数据数量', async () => {
            await db.set('key1', { value: 1 });
            await db.set('key2', { value: 2 });
            await db.set('key1', { value: 3 }); // 重复 key

            const countAll = await db.count();
            expect(countAll.code).toBe(200);
            expect(countAll.data).toBeGreaterThanOrEqual(2);

            const countKey1 = await db.count('key1');
            expect(countKey1.code).toBe(200);
            expect(countKey1.data).toBe(1);
        });

        it('应该能够检查 key 是否存在', async () => {
            const key = 'test-key';
            const value = { name: 'test' };

            const exists1 = await db.has(key);
            expect(exists1).toBe(false);

            await db.set(key, value);

            const exists2 = await db.has(key);
            expect(exists2).toBe(true);
        });

        it('应该能够获取所有 keys', async () => {
            await db.set('key1', { value: 1 });
            await db.set('key2', { value: 2 });
            await db.set('key3', { value: 3 });

            const result = await db.keys();
            expect(result.code).toBe(200);
            expect(result.data).toBeDefined();
            expect(result.data!.length).toBeGreaterThanOrEqual(3);
            expect(result.data).toContain('key1');
            expect(result.data).toContain('key2');
            expect(result.data).toContain('key3');
        });
    });

    describe('update 操作', () => {
        it('应该能够更新数据', async () => {
            const key = 'test-key';
            const initialValue = { name: 'John', age: 30 };

            await db.set(key, initialValue);

            const updateResult = await db.update(key, { value: { name: 'Jane', age: 25 } });
            expect(updateResult.code).toBe(200);

            const getResult = await db.get(key);
            expect(getResult.data![0].value).toEqual({ name: 'Jane', age: 25 });
        });

        it('更新不存在的 key 应该失败', async () => {
            try {
                await db.update('non-existent-key', { value: { test: 1 } });
                expect.fail('应该抛出错误');
            } catch (error: any) {
                expect(error.code).toBe(401);
            }
        });
    });

    describe('批量删除操作', () => {
        it('应该能够限制删除数量', async () => {
            const key = 'duplicate-key';
            await db.set(key, { value: 1 });

            // 由于 set 会更新而不是添加重复项，我们需要直接测试 delete 的 limit 参数
            const deleteResult = await db.delete(key, 1);
            expect(deleteResult.code).toBe(200);
            expect(deleteResult.data?.deletedCount).toBe(1);
        });

        it('删除不存在的 key 应该失败', async () => {
            try {
                await db.delete('non-existent-key');
                expect.fail('应该抛出错误');
            } catch (error: any) {
                expect(error.code).toBe(401);
            }
        });
    });

    describe('数据时间戳', () => {
        it('应该自动添加创建时间和更新时间', async () => {
            const key = 'test-key';
            const value = { name: 'test' };

            const beforeTime = Date.now();
            await db.set(key, value);
            const afterTime = Date.now();

            const result = await db.get(key);
            const item = result.data![0];

            expect(item.createdAt).toBeDefined();
            expect(item.updatedAt).toBeDefined();
            expect(item.createdAt!).toBeGreaterThanOrEqual(beforeTime);
            expect(item.createdAt!).toBeLessThanOrEqual(afterTime);
            expect(item.updatedAt!).toBeGreaterThanOrEqual(beforeTime);
            expect(item.updatedAt!).toBeLessThanOrEqual(afterTime);
        });

        it('更新时应该更新 updatedAt 时间', async () => {
            const key = 'test-key';
            await db.set(key, { name: 'test' });

            const result1 = await db.get(key);
            const createdAt = result1.data![0].createdAt;

            // 等待一小段时间
            await new Promise((resolve) => setTimeout(resolve, 10));

            await db.set(key, { name: 'updated' });

            const result2 = await db.get(key);
            const item = result2.data![0];

            expect(item.createdAt).toBe(createdAt);
            expect(item.updatedAt).toBeGreaterThan(createdAt!);
        });
    });

    describe('静态方法', () => {
        it('应该能够清除数据库缓存', () => {
            IndexedDB.clearCache(testDbName);
            // 测试不会抛出错误
            expect(true).toBe(true);
        });

        it('应该能够清除所有缓存', () => {
            IndexedDB.clearAllCache();
            // 测试不会抛出错误
            expect(true).toBe(true);
        });

        it('应该能够删除数据库', async () => {
            const tempDbName = 'temp-test-db';
            const tempDb = new IndexedDB(tempDbName, 'temp-store', 1);
            await tempDb.set('test', { value: 1 });
            tempDb.close();

            await IndexedDB.deleteDatabase(tempDbName);

            // 验证数据库已被删除
            const newDb = new IndexedDB(tempDbName, 'temp-store', 1);
            const result = await newDb.getAll();
            expect(result.data).toHaveLength(0);

            newDb.close();
            await IndexedDB.deleteDatabase(tempDbName);
        });
    });

    describe('多表支持', () => {
        it('应该支持在同一数据库中创建多个表', async () => {
            const store1 = new IndexedDB(testDbName, 'store1', 1);
            const store2 = new IndexedDB(testDbName, 'store2', 1);

            await store1.set('key1', { value: 'store1-data' });
            await store2.set('key2', { value: 'store2-data' });

            const result1 = await store1.get('key1');
            const result2 = await store2.get('key2');

            expect(result1.data![0].value).toEqual({ value: 'store1-data' });
            expect(result2.data![0].value).toEqual({ value: 'store2-data' });

            // 验证数据隔离
            const crossResult1 = await store1.get('key2');
            const crossResult2 = await store2.get('key1');

            expect(crossResult1.data).toHaveLength(0);
            expect(crossResult2.data).toHaveLength(0);

            store1.close();
            store2.close();
        });
    });

    describe('错误处理', () => {
        it('删除不存在的数据应该返回错误', async () => {
            try {
                await db.delete('non-existent-key');
                expect.fail('应该抛出错误');
            } catch (error: any) {
                expect(error.code).toBe(401);
                expect(error.msg).toContain('不存在');
            }
        });
    });

    describe('数据类型支持', () => {
        it('应该支持存储各种数据类型', async () => {
            await db.set('string', 'hello');
            await db.set('number', 42);
            await db.set('boolean', true);
            await db.set('array', [1, 2, 3]);
            await db.set('object', { nested: { value: 'test' } });
            await db.set('null', null);

            const stringResult = await db.get('string');
            const numberResult = await db.get('number');
            const booleanResult = await db.get('boolean');
            const arrayResult = await db.get('array');
            const objectResult = await db.get('object');
            const nullResult = await db.get('null');

            expect(stringResult.data![0].value).toBe('hello');
            expect(numberResult.data![0].value).toBe(42);
            expect(booleanResult.data![0].value).toBe(true);
            expect(arrayResult.data![0].value).toEqual([1, 2, 3]);
            expect(objectResult.data![0].value).toEqual({ nested: { value: 'test' } });
            expect(nullResult.data![0].value).toBe(null);
        });

        it('应该支持 Symbol 作为 key', async () => {
            const symbolKey = Symbol('test');
            const value = { data: 'test' };

            await db.set(symbolKey, value);
            const result = await db.get(symbolKey);

            expect(result.data![0].value).toEqual(value);
        });
    });
});

