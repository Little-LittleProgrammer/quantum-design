import { RouteRecordRaw } from 'vue-router';
import { IBreadcrumb } from '@/utils/types';

export function flatten(list:RouteRecordRaw[]) {
    const formatObj: Record<string, IBreadcrumb> = {};
    function dfs(list:RouteRecordRaw[]) {
        list.forEach((item) => {
            if (item.children) {
                let _cacheObj: IBreadcrumb = {
                    id: '',
                    name: '',
                    path: '',
                    pid: '',
                    title: ''
                };
                if (item.meta) {
                    _cacheObj = {
                        id: item.meta.id,
                        pid: item.meta.pid,
                        path: item.path,
                        title: item.meta.title,
                        name: item.name as string
                    };
                    formatObj[item.meta.id] = _cacheObj;
                }
                dfs(item.children);
            } else {
                if (item.meta) {
                    const _cacheObj: IBreadcrumb = {
                        id: item.meta.id,
                        pid: item.meta.pid,
                        path: item.path,
                        title: item.meta.title,
                        name: item.name as string
                    };
                    formatObj[item.meta.id] = _cacheObj;
                }
            }
        });
    }
    dfs(list);
    return formatObj;
}
