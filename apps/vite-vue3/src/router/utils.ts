import { RouteRecordRaw } from 'vue-router';
import { cloneDeep } from 'lodash-es';

/**
 * 将多级路由转换为 2 级路由
 * @param routeList 自定义routerList
 * @returns 返回格式化的routerList
 * @description 为了保证 不管router格式如何, 都能使keepalive生效
 */
export function flat_multi_level_routes(routeList:RouteRecordRaw[]) {
    const _routeList = cloneDeep(routeList);
    for (let i = 0; i < _routeList.length; i++) {
        const _route = _routeList[i];
        if (!is_multi_route(_route)) {
            continue;
        }
        // 格式化
        flatten_route(_route);
    }
    return _routeList;
}

// 超过二级的路由等级提升至二级
function flatten_route(routeData: RouteRecordRaw) {
    const _children = cloneDeep(routeData.children || []);
    add_to_children(routeData, _children, '');
    // 删除第二级的children属性
    routeData.children = routeData.children?.map(item => {
        item.children && Reflect.deleteProperty(item, 'children');
        return {
            ...item
        };
    });
}

// 将所有子路由添加到二级路由
function add_to_children(routeData: RouteRecordRaw, children:RouteRecordRaw[], parentPath: string) {
    for (let i = 0; i < children.length; i++) {
        const _child = children[i];
        routeData.children = routeData.children || [];
        const _flag = routeData.children.some((item) => item.name === _child.name);
        if (!_flag) {
            _child.path = parentPath + '/' + _child.path;
            routeData.children?.push(_child);
        }
        if (_child.children?.length) {
            add_to_children(routeData, _child.children, _child.path);
        }
    }
}

// 判断级别是否超过2级
function is_multi_route(routeData: RouteRecordRaw):boolean {
    if (!routeData || !Reflect.has(routeData, 'children') || !routeData.children?.length) {
        return false;
    }
    const _children = routeData.children;

    let _flag = false;
    for (let i = 0; i < _children.length; i++) {
        if (_children[i].children?.length) {
            _flag = true;
            break;
        }
    }
    return _flag;
}

/**
 * @description: 安慰方法
 */
export const get_parent_layout = (_name?: string) => {
    return () =>
        new Promise((resolve) => {
            resolve({
                name: _name || 'ParentLayout'
            });
        });
};

export interface ICacheObj {
    path: string,
    title: string,
    id: string,
    pid: string
}
