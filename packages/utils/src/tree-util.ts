interface TreeHelperConfig {
    id: string;
    children: string;
    pid: string;
}

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
    id: 'id',
    children: 'children',
    pid: 'pid'
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * 通过匹配方法找到
 * @param tree 目标对象
 * @param func 匹配方法
 * @param config 配置，配置映射关系
 * @returns T[]
 */
export function js_utils_find_node_all<T = any>(
    tree: T[],
    func: Fn,
    config: Partial<TreeHelperConfig> = {}
): T[] {
    config = getConfig(config);
    const { children } = config;
    const _list = [...tree];
    const _result: T[] = [];
    while (_list.length) {
        const _curNode = _list.shift()!;
        func(_curNode) && _result.push(_curNode);
        (_curNode as any)[children!] && _list.push(...(_curNode as any)[children!]);
    }
    return _result;
}
