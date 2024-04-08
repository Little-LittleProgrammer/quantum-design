import { defHttp } from '@/http/axios';

enum Api {
    roleList = '/manage/role/index',
    roleOptions= '/manage/role/select-data',
    roleCreate= '/manage/role/create',
    roleEdit = '/manage/role/update',
    roleDelete = '/manage/role/delete',
    roleData = '/manage/role/data'
}

export interface IRoleAuths {
    id?: number;
    remark?: string;
    init_auth_name?: string;
    role_name?: string;
    created_at?: number;
    updated_at?: number
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
    return defHttp.get<Result<Record<'table_list', IRoleAuths[]>>>({url: Api.roleList});
}

// 角色-筛选项（人员管理页面专用）
export function api_manage_role_options() {
    return defHttp.get<Result<ISelectList<'table_list'>>>({url: Api.roleOptions});
}

// 角色-创建
export function api_manage_role_create(params: IRoleCreate) {
    return defHttp.post<Result>({
        url: Api.roleCreate,
        params
    });
}
// 角色-编辑
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
