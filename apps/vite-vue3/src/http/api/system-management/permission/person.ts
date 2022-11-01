import { defHttp } from '@/http/axios';
import type { menuData } from '#/router';
enum Api {
    userList = '/manage/user/index',
    userAuths= '/manage/user/auths',
    userCreate = '/manage/user/create',
    userDelete = '/manage/user/delete',
    userUpdate = '/manage/user/update'
}

interface IUserAuths {
    init_path: string,
    auth_list: menuData[]
}

export interface ITableList {
    email: string;
    id: string;
    latest_login_ip: string;
    latest_login_time: string;
    role_id_arr: string[];
    role_name_str: string;
    username: string
}

export interface ICreateData {
    role_id_str: string;
    username: string;
    email: string
}

export type IUpdateData = ICreateData & Recordable<'id'>

// 用户设置-用户权限
export function api_manage_user_auths() {
    return defHttp.get<Result<IUserAuths>>({url: Api.userAuths});
}

// 用户设置-列表
export function api_manage_user_list() {
    return defHttp.get<Result<Record<'table_list', ITableList[]>>>({
        url: Api.userList
    });
}

// 用户设置-保存添加
export function api_manage_user_create(data: ICreateData) {
    return defHttp.post<Result<Recordable<'id'>>>({
        url: Api.userCreate,
        data
    });
}

// 用户设置-删除
export function api_manage_user_delete(data: Recordable<'id'>) {
    return defHttp.post<Result<Recordable<'id'>>>({
        url: Api.userDelete,
        data
    });
}

// 用户设置-人员编辑
export function api_manage_user_update(data: IUpdateData) {
    return defHttp.post({
        url: Api.userUpdate,
        data
    });
}
