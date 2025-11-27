import { describe, it, expect, beforeEach } from 'vitest';
import { js_utils_get_table_header_columns, js_utils_get_custom_cell, js_utils_set_table_height } from '../src/antd-util';

describe('antd-util.ts', () => {
    describe('js_utils_get_custom_cell', () => {
        it('应该正确计算单列合并', () => {
            const headerObj = {
                name: '姓名',
                age: '年龄',
            };
            const list = [
                { name: '张三', age: 20 },
                { name: '张三', age: 21 },
                { name: '李四', age: 22 },
            ];
            const result = js_utils_get_custom_cell(headerObj, list);
            expect(result).toEqual({
                name: [2, 0, 1],
                age: [1, 1, 1],
            });
        });

        it('应该处理所有相同值的列', () => {
            const headerObj = {
                category: '分类',
            };
            const list = [{ category: 'A' }, { category: 'A' }, { category: 'A' }];
            const result = js_utils_get_custom_cell(headerObj, list);
            expect(result).toEqual({
                category: [3, 0, 0],
            });
        });

        it('应该处理所有不同值的列', () => {
            const headerObj = {
                id: 'ID',
            };
            const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const result = js_utils_get_custom_cell(headerObj, list);
            expect(result).toEqual({
                id: [1, 1, 1],
            });
        });

        it('应该处理空列表', () => {
            const headerObj = {
                name: '姓名',
            };
            const list: any[] = [];
            const result = js_utils_get_custom_cell(headerObj, list);
            expect(result).toBeNull();
        });

        it('应该正确处理多列合并', () => {
            const headerObj = {
                category: '分类',
                name: '姓名',
                score: '分数',
            };
            const list = [
                { category: 'A', name: '张三', score: 90 },
                { category: 'A', name: '李四', score: 85 },
                { category: 'B', name: '王五', score: 88 },
                { category: 'B', name: '赵六', score: 92 },
            ];
            const result = js_utils_get_custom_cell(headerObj, list);
            expect(result).toEqual({
                category: [2, 0, 2, 0],
                name: [1, 1, 1, 1],
                score: [1, 1, 1, 1],
            });
        });
    });

    describe('js_utils_get_table_header_columns', () => {
        it('应该生成基本的表格列配置', () => {
            const headerObj = {
                name: '姓名',
                age: '年龄',
            };
            const result = js_utils_get_table_header_columns(headerObj);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                title: '姓名',
                key: 'name',
                dataIndex: 'name',
                align: 'center',
            });
        });

        it('应该应用对齐配置', () => {
            const headerObj = {
                id: 'ID',
                name: '姓名',
            };
            const options = {
                alignData: {
                    id: 'left' as const,
                    name: 'right' as const,
                },
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].align).toBe('left');
            expect(result[1].align).toBe('right');
        });

        it('应该应用宽度配置', () => {
            const headerObj = {
                id: 'ID',
                name: '姓名',
            };
            const options = {
                widthData: {
                    all: 120,
                    id: 80,
                },
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].width).toBe(80);
            expect(result[1].width).toBe(120);
        });

        it('应该应用固定列配置', () => {
            const headerObj = {
                id: 'ID',
                action: '操作',
            };
            const options = {
                fixedData: {
                    id: 'left' as const,
                },
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].fixed).toBe('left');
            expect(result[1].fixed).toBe('right'); // action 默认 right
        });

        it('应该应用排序配置', () => {
            const headerObj = {
                id: 'ID',
                name: '姓名',
                age: '年龄',
            };
            const options = {
                sortData: ['id', 'age'],
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].sorter).toBe(true);
            expect(result[1].sorter).toBe(false);
            expect(result[2].sorter).toBe(true);
        });

        it('应该支持自定义排序函数', () => {
            const headerObj = {
                age: '年龄',
            };
            const customSorter = (a: any, b: any) => a.age - b.age;
            const options = {
                sortData: {
                    age: customSorter,
                },
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].sorter).toBe(customSorter);
        });

        it('应该处理嵌套的列配置', () => {
            const headerObj = {
                user: {
                    title: '用户信息',
                    children: {
                        name: '姓名',
                        age: '年龄',
                    },
                },
            };
            const result = js_utils_get_table_header_columns(headerObj);
            expect(result[0]).toHaveProperty('children');
            expect(result[0].children).toHaveLength(2);
        });

        it('应该应用 customCell 配置', () => {
            const headerObj = {
                name: '姓名',
            };
            const customCell = {
                name: () => ({ colSpan: 2 }),
            };
            const options = {
                customCell,
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].customCell).toBe(customCell.name);
        });

        it('应该自动计算合并行', () => {
            const headerObj = {
                category: '分类',
                name: '姓名',
            };
            const list = [
                { category: 'A', name: '张三' },
                { category: 'A', name: '李四' },
            ];
            const result = js_utils_get_table_header_columns(headerObj, {}, list);
            expect(result[0].customCell).toBeDefined();
            expect(typeof result[0].customCell).toBe('object');
        });

        it('应该处理 resizable 配置', () => {
            const headerObj = {
                name: '姓名',
                age: '年龄',
            };
            const options = {
                resizableData: {
                    name: true,
                    all: false,
                },
            };
            const result = js_utils_get_table_header_columns(headerObj, options);
            expect(result[0].resizable).toBe(true);
            expect(result[1].resizable).toBe(false);
        });
    });

    describe('js_utils_set_table_height', () => {
        beforeEach(() => {
            // 清理 DOM
            document.body.innerHTML = '';
        });

        it('应该计算表格高度', async () => {
            // 创建模拟的表格 DOM 结构
            const container = document.createElement('div');
            container.className = 'test-table';
            const tbody = document.createElement('div');
            tbody.className = 'ant-table-tbody';
            container.appendChild(tbody);
            document.body.appendChild(container);

            // 模拟 offsetTop
            Object.defineProperty(tbody, 'offsetTop', {
                get: () => 100,
                configurable: true,
            });

            // 模拟 body 高度
            Object.defineProperty(document.body, 'offsetHeight', {
                get: () => 800,
                configurable: true,
            });

            const height = await js_utils_set_table_height('test-table');
            // 800 - 100 - 0 - 28 = 672
            expect(height).toBe('672px');
        });

        it('应该考虑额外的减去高度', async () => {
            const container = document.createElement('div');
            container.className = 'test-table';
            const tbody = document.createElement('div');
            tbody.className = 'ant-table-tbody';
            container.appendChild(tbody);
            document.body.appendChild(container);

            Object.defineProperty(tbody, 'offsetTop', {
                get: () => 100,
                configurable: true,
            });

            Object.defineProperty(document.body, 'offsetHeight', {
                get: () => 800,
                configurable: true,
            });

            const height = await js_utils_set_table_height('test-table', 50);
            // 800 - 100 - 50 - 28 = 622
            expect(height).toBe('622px');
        });
    });
});
