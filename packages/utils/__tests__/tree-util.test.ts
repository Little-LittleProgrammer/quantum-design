import { describe, it, expect } from 'vitest';
import { js_utils_find_node_all } from '../src/tree-util';

describe('tree-util.ts', () => {
    describe('js_utils_find_node_all', () => {
        it('应该找到满足条件的所有节点', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Node 1',
                    value: 10,
                    children: [
                        { id: 2, name: 'Node 2', value: 20 },
                        { id: 3, name: 'Node 3', value: 30 },
                    ],
                },
                {
                    id: 4,
                    name: 'Node 4',
                    value: 40,
                    children: [{ id: 5, name: 'Node 5', value: 50 }],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.value >= 30);
            expect(result).toHaveLength(3);
            // 广度优先：按照遍历顺序返回
            expect(result.map((n: any) => n.id)).toContain(3);
            expect(result.map((n: any) => n.id)).toContain(4);
            expect(result.map((n: any) => n.id)).toContain(5);
        });

        it('应该找到所有指定名称的节点', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Target',
                    children: [
                        { id: 2, name: 'Other' },
                        { id: 3, name: 'Target' },
                    ],
                },
                {
                    id: 4,
                    name: 'Target',
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.name === 'Target');
            expect(result).toHaveLength(3);
            // 检查包含所有目标节点
            expect(result.map((n: any) => n.id)).toContain(1);
            expect(result.map((n: any) => n.id)).toContain(3);
            expect(result.map((n: any) => n.id)).toContain(4);
        });

        it('应该处理空树', () => {
            const result = js_utils_find_node_all([], (node: any) => node.id === 1);
            expect(result).toHaveLength(0);
        });

        it('应该处理没有匹配节点的情况', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Node 1',
                    children: [{ id: 2, name: 'Node 2' }],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.id === 999);
            expect(result).toHaveLength(0);
        });

        it('应该处理扁平树（没有子节点）', () => {
            const tree = [
                { id: 1, name: 'Node 1' },
                { id: 2, name: 'Node 2' },
                { id: 3, name: 'Node 3' },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.id > 1);
            expect(result).toHaveLength(2);
            expect(result.map((n: any) => n.id)).toEqual([2, 3]);
        });

        it('应该处理深层嵌套的树', () => {
            const tree = [
                {
                    id: 1,
                    level: 1,
                    children: [
                        {
                            id: 2,
                            level: 2,
                            children: [
                                {
                                    id: 3,
                                    level: 3,
                                    children: [{ id: 4, level: 4 }],
                                },
                            ],
                        },
                    ],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.level >= 2);
            expect(result).toHaveLength(3);
            expect(result.map((n: any) => n.id)).toEqual([2, 3, 4]);
        });

        it('应该支持自定义配置', () => {
            const tree = [
                {
                    key: 1,
                    name: 'Node 1',
                    items: [
                        { key: 2, name: 'Node 2' },
                        { key: 3, name: 'Node 3' },
                    ],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.key > 1, {
                id: 'key',
                children: 'items',
            });
            expect(result).toHaveLength(2);
            expect(result.map((n: any) => n.key)).toEqual([2, 3]);
        });

        it('应该支持不同的 children 字段名', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Parent',
                    subItems: [
                        { id: 2, name: 'Child 1' },
                        { id: 3, name: 'Child 2' },
                    ],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.name.includes('Child'), { children: 'subItems' });
            expect(result).toHaveLength(2);
        });

        it('应该按广度优先顺序查找', () => {
            const tree = [
                {
                    id: 1,
                    level: 1,
                    children: [
                        {
                            id: 2,
                            level: 2,
                            children: [{ id: 3, level: 3 }],
                        },
                    ],
                },
                {
                    id: 4,
                    level: 1,
                    children: [{ id: 5, level: 2 }],
                },
            ];

            const result = js_utils_find_node_all(tree, () => true);
            // 广度优先：1, 4, 2, 5, 3
            expect(result.map((n: any) => n.id)).toEqual([1, 4, 2, 5, 3]);
        });

        it('应该处理包含 null/undefined children 的节点', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Node 1',
                    children: null as any,
                },
                {
                    id: 2,
                    name: 'Node 2',
                    children: undefined,
                },
                {
                    id: 3,
                    name: 'Node 3',
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.id > 0);
            expect(result).toHaveLength(3);
        });

        it('应该处理复杂的过滤条件', () => {
            const tree = [
                {
                    id: 1,
                    type: 'folder',
                    name: 'Documents',
                    children: [
                        { id: 2, type: 'file', name: 'doc1.txt', size: 100 },
                        { id: 3, type: 'file', name: 'doc2.pdf', size: 200 },
                        {
                            id: 4,
                            type: 'folder',
                            name: 'Subfolder',
                            children: [{ id: 5, type: 'file', name: 'doc3.txt', size: 150 }],
                        },
                    ],
                },
            ];

            // 查找所有大小大于 100 的文件
            const result = js_utils_find_node_all(tree, (node: any) => node.type === 'file' && node.size > 100);
            expect(result).toHaveLength(2);
            expect(result.map((n: any) => n.id)).toEqual([3, 5]);
        });

        it('应该处理空的 children 数组', () => {
            const tree = [
                {
                    id: 1,
                    name: 'Node 1',
                    children: [],
                },
                {
                    id: 2,
                    name: 'Node 2',
                    children: [{ id: 3, name: 'Node 3', children: [] }],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.id > 0);
            expect(result).toHaveLength(3);
        });

        it('应该能够通过多个条件查找', () => {
            const tree = [
                {
                    id: 1,
                    status: 'active',
                    priority: 'high',
                    children: [
                        { id: 2, status: 'active', priority: 'low' },
                        { id: 3, status: 'inactive', priority: 'high' },
                    ],
                },
                {
                    id: 4,
                    status: 'active',
                    priority: 'high',
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.status === 'active' && node.priority === 'high');
            expect(result).toHaveLength(2);
            expect(result.map((n: any) => n.id)).toEqual([1, 4]);
        });

        it('应该保持原始节点的引用', () => {
            const child = { id: 2, name: 'Child' };
            const tree = [
                {
                    id: 1,
                    name: 'Parent',
                    children: [child],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.id === 2);
            expect(result[0]).toBe(child);
        });

        it('应该正确处理多个根节点', () => {
            const tree = [
                { id: 1, name: 'Root 1', children: [{ id: 2, name: 'Child 1' }] },
                { id: 3, name: 'Root 2', children: [{ id: 4, name: 'Child 2' }] },
                { id: 5, name: 'Root 3', children: [{ id: 6, name: 'Child 3' }] },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.name.includes('Root'));
            expect(result).toHaveLength(3);
            expect(result.map((n: any) => n.id)).toEqual([1, 3, 5]);
        });

        it('应该能够通过回调函数访问节点的所有属性', () => {
            const tree = [
                {
                    id: 1,
                    data: { value: 100, label: 'Test' },
                    children: [{ id: 2, data: { value: 200, label: 'Test' } }],
                },
            ];

            const result = js_utils_find_node_all(tree, (node: any) => node.data?.label === 'Test');
            expect(result).toHaveLength(2);
        });
    });
});
