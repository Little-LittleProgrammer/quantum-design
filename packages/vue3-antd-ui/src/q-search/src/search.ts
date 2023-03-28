import { deep_copy } from '@wuefront/utils';
import { menuData } from '../../utils/types';

export interface ICacheObj {
    path: string,
    title: string,
    id: string,
    pid: string
}

const _formaObjName: Record<string, ICacheObj> = {};
const _formaObjId: Record<string, ICacheObj> = {};

export function get_net_router(mainMenuData: menuData[]) {
    // 拍平router
    const flatten_name = (list: menuData[]) => {
        list.forEach((item) => {
            if (item.children) {
                const _cacheObj = {
                    id: item.id,
                    pid: item.pid,
                    path: item.path,
                    title: item.auth_name
                };
                // 防止重复
                if (_formaObjName[item.auth_name]) {
                    _formaObjName[`${item.auth_name}${Math.floor(Math.random() * 1000)}`] = _cacheObj;
                } else {
                    _formaObjName[item.auth_name] = _cacheObj;
                }
                _formaObjId[item.id] = _cacheObj;
                flatten_name(item.children);
            } else {
                const _cacheObj = {
                    id: item.id,
                    pid: item.pid,
                    path: item.path,
                    title: item.auth_name
                };
                // 防止重复而造成菜单消失
                if (_formaObjName[item.auth_name]) {
                    _formaObjName[`${item.auth_name}${Math.floor(Math.random() * 1000)}`] = _cacheObj;
                } else {
                    _formaObjName[item.auth_name] = _cacheObj;
                }
                _formaObjId[item.id] = _cacheObj;
            }
        });
    };
    flatten_name(mainMenuData);
}

// 找到某一个子路由的全部祖先
let _title = '';
function find_family(map: Record<string, ICacheObj>, pid:string, _nameStr = '') {
    if (pid != '0') {
        const _cacheObj:ICacheObj = map[pid];
        _nameStr = _cacheObj.title + '>' + _nameStr;
        find_family(map, _cacheObj.pid, _nameStr);
    } else {
        _title = _nameStr;
        return _nameStr;
    }
}

export function find_search_route(key:string) {
    let _arrKey:string[] = [];
    const _arrValue: ICacheObj[] = [];
    _arrKey = Object.keys(_formaObjName);

    _arrKey.forEach(item => {
        if (key.length > 0 && item.includes(key)) {
            _arrValue.push(_formaObjName[item]);
        }
    });
    const _arrResult:ICacheObj[] = deep_copy(_arrValue);
    _arrResult.forEach(item => {
        // item.title += f
        _title = '';
        find_family(_formaObjId, item.pid, item.title);
        item.title = _title;
    });

    return _arrResult;
}
