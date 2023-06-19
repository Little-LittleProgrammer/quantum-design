import { defHttp } from '@/http/axios';

enum Api {
    roleList = '/permission/role/list',
    roleOptions= '/permission/role/select',
    roleEdit = '/permission/role/replace',
    roleDelete = '/permission/role/delete',
    roleData = '/permission/role/get'
}

export interface IRoleAuths {
    id?: number;
    remark?: string;
    role_name?: string;
}

export interface IRoleCreate {
    auth_id_arr?: number[];
    id?: number;
    init_auth_id?: number;
    remark?: string;
    role_name?: string;
    show_auth_id_arr?: number[];
}

export interface IRoleData {
    auth_id_arr?: number[];
    id?: number;
    init_auth_id?: number;
    remark?: string;
    role_name?: string;
    show_auth_id_arr?: number[];
}

// 角色-列表
export function api_manage_role_list() {
    return defHttp.get<Result<Record<'list', IRoleAuths[]>>>({url: Api.roleList});
}

// 角色-筛选项（人员管理页面专用）
export function api_manage_role_options() {
    return defHttp.get<Result<ISelectList<'role_list'>>>({url: Api.roleOptions});
}

// 角色-保存
export function api_manage_role_edit(params: IRoleCreate) {
    return defHttp.post<Result>({
        url: Api.roleEdit,
        params
    });
}

// 角色-删除
export function api_manage_role_delete(params: Record<'id', number>) {
    return defHttp.post<Result>({
        url: Api.roleDelete,
        params
    });
}

// 角色-数据
export function api_manage_role_data(params:Recordable<'id'>) {
    return defHttp.get<Result<IRoleData>>({
        url: Api.roleData,
        params
    });
}
