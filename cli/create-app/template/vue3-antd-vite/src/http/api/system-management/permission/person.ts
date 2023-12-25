import { defHttp } from '@/http/axios';
import type { IMenuData } from '@q-front-npm/types/vue/router';
enum Api {
    userList = '/manage/user/index',
    userAuths= '/manage/user/auths',
    userCreate = '/manage/user/create',
    userEdit = '/manage/user/update',
    userDelete = '/manage/user/delete',
}

interface ICurrentUser {
    email: string;
    id: number;
    name: string
}

interface IUserAuths {
    /**
     * 初始路径
     */
    init_path?: string;
    auth_list: IMenuData[];
    current_user: ICurrentUser
    btn_list?: string[];
}

export interface ITableList {
    /**
     * 邮箱
     */
    email?: string;
    /**
     * id
     */
    id?: number;
    /**
     * 最近登录时间
     */
    latest_login_at?: number;
    /**
     * 最近登录ip
     */
    latest_login_ip?: string;
    /**
     * 角色id数组
     */
    role_id_arr?: number[];
    /**
     * 角色名数组
     */
    role_name_arr?: string[];
    /**
     * 用户名
     */
    username?: string;
}

export interface IPersonEditData {
    /**
     * 邮箱
     */
    email?: string;
    /**
     * id, 传入表示更新，不传入表示新增
     */
    id?: number;
    /**
     * 角色id数组
     */
    role_id_arr?: number[];
    /**
     * 用户名
     */
    username?: string;
}

// 用户设置-用户权限
export function api_manage_user_auths() {
    return defHttp.get<Result<IUserAuths>>({url: Api.userAuths, params: {path_type: 1}});
}

// 用户设置-列表
export function api_manage_user_list() {
    return defHttp.get<Result<Record<'table_list', ITableList[]>>>({
        url: Api.userList
    });
}

// 用户设置-保存添加
export function api_manage_user_add(data: IPersonEditData) {
    return defHttp.post<Result<Record<'id', number>>>({
        url: Api.userCreate,
        data
    });
}
export function api_manage_user_edit(data: IPersonEditData) {
    return defHttp.post<Result<Record<'id', number>>>({
        url: Api.userEdit,
        data
    });
}

// 用户设置-删除
export function api_manage_user_delete(data: Record<'id', number>) {
    return defHttp.post<Result<Record<'id', number>>>({
        url: Api.userDelete,
        data
    });
}

