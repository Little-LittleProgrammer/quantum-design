import { defHttp } from '@/http/axios';
import type { menuData } from '@wuefront/types/vue/router';

enum Api {
    authList = '/permission/auth/list',
    authEdit = '/permission/auth/replace',
    authDelete = '/permission/auth/delete',
    authSort = '/permission/auth/sort'
}

interface IAuthData {
    list: menuData[]
}

export interface ISortAuth {
    first_auth_id_arr: number[]
    pid: number;
}

// 角色-列表
export function api_manage_auth_list() {
    return defHttp.get<Result<IAuthData>>({url: Api.authList});
}

// 菜单-添加
export function api_manage_auth_create(data: menuData) {
    return defHttp.post<Result<Record<'id', number>>>({url: Api.authEdit, data});
}

// 菜单-编辑
export function api_manage_auth_update(data: menuData) {
    return defHttp.post<Result<Record<'id', number>>>({url: Api.authEdit, data});
}

// 菜单-删除
export function api_manage_auth_delete(data: Record<'id', number>) {
    return defHttp.post<Result<Record<'id', number>>>({url: Api.authDelete, data});
}

// 菜单-移动、设置排序
export function api_manage_auth_sort(data: ISortAuth) {
    return defHttp.post<Result>({url: Api.authSort, data});
}
