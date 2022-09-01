import type { menuData } from '#/router';
import { defHttp } from '@/http/axios';
import { Recordable } from '@qmfront/shared/types/global';
import { Result } from '@qmfront/shared/types/http';

enum Api {
    authList = '/manage/auth/index',
    authData = '/manage/auth/data',
    authCreate = '/manage/auth/create',
    authDelete = '/manage/auth/delete',
    authUpdate = '/manage/auth/update',
    authSort = '/manage/auth/sort'
}

export interface IAuthList {
    auth_name:string;
    id: string;
    path_type:string;
    pid: string;
    children:IAuthList[];
}

interface IAuthData {
    auth_list: IAuthList[]
}

export interface ICreateAuth {
    auth_name:string;
    path: string;
    pid: string;
    path_type: string;
    icon: string
}

export interface IUpdateAuth extends ICreateAuth {
    id: string
}

export interface ISortAuth {
    first_auth_id_str: string
    pid: string;
}

// 角色-列表
export function api_manage_auth_list() {
    return defHttp.get<Result<Record<'table_list', menuData[]>>>({url: Api.authList});
}

// 菜单-数据（添加、编辑角色专用）
export function api_manage_auth_data() {
    return defHttp.get<Result<IAuthData>>({
        url: Api.authData
    });
}

// 菜单-添加
export function api_manage_auth_create(data: ICreateAuth) {
    return defHttp.post<Result<Recordable<'id'>>>({url: Api.authCreate, data});
}

// 菜单-编辑
export function api_manage_auth_update(data: IUpdateAuth) {
    return defHttp.post<Result<Recordable<'id'>>>({url: Api.authUpdate, data});
}

// 菜单-删除
export function api_manage_auth_delete(data: Recordable<'id'>) {
    return defHttp.post<Result<Recordable<'id'>>>({url: Api.authDelete, data});
}

// 菜单-移动、设置排序
export function api_manage_auth_sort(data: ISortAuth) {
    return defHttp.post<Result>({url: Api.authSort, data});
}
