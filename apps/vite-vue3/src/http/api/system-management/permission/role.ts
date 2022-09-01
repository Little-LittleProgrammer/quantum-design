import { defHttp } from '@/http/axios';
import { Recordable } from '@qmfront/shared/types/global';
import { Result } from '@qmfront/shared/types/http';

enum Api {
    roleList = '/manage/role/index',
    roleOptions= '/manage/role/select-data',
    roleCreate = '/manage/role/create',
    roleDelete = '/manage/role/delete',
    roleUpdate = '/manage/role/update',
    roleData = '/manage/role/data'
}

export interface IRoleAuths {
    id:string;
    init_auth_id: string;
    init_auth_name: string;
    remark: string;
    role_name: string
}

export interface IRoleCreate {
    role_name:string;
    init_auth_id: string | string[];
    remark: string;
    show_auth_id_str?: string;
    auth_id_str?: string
}

export interface IRoleData {
    id?: string;
    role_name:string;
    init_auth_id: string | string[] ;
    remark: string;
    show_auth_id_arr?: Array<string>;
    auth_id_arr?: Array<string>;
    show_auth_id_str?: string;
    auth_id_str?: string
}

// 角色-列表
export function api_manage_role_list() {
    return defHttp.get<Result<Record<'table_list', IRoleAuths[]>>>({url: Api.roleList});
}

// 角色-筛选项（人员管理页面专用）
export function api_manage_role_options() {
    return defHttp.get<Result<ISelectList<'role_data'>>>({url: Api.roleOptions});
}

// 角色-保存
export function api_manage_role_create(params: IRoleCreate) {
    return defHttp.post<Result>({
        url: Api.roleCreate,
        params
    });
}

// 角色-删除
export function api_manage_role_delete(params: Recordable<'id'>) {
    return defHttp.post<Result>({
        url: Api.roleDelete,
        params
    });
}

// 角色-编辑
export function api_manage_role_update(params: IRoleCreate) {
    return defHttp.post<Result>({
        url: Api.roleUpdate,
        params
    });
}

// 角色-数据
export function api_manage_role_data(params:Recordable<'id'>) {
    return defHttp.post<Result<IRoleData>>({
        url: Api.roleData,
        params
    });
}
