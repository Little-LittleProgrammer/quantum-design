import { post, get } from '../../request';

// 角色-列表
export function api_manage_role_list(data) {
    return get('/manage/role/index', data);
}

// 角色-筛选项（人员管理页面专用）
export function api_manage_role_options(data) {
    return get('/manage/role/select-data', data);
}

// 角色-保存
export function api_manage_role_create(data) {
    return post('/manage/role/create', data);
}

// 角色-删除
export function api_manage_role_delete(data) {
    return post('/manage/role/delete', data);
}

// 角色-编辑
export function api_manage_role_update(data) {
    return post('/manage/role/update', data);
}

// 角色-数据
export function api_manage_role_data(data) {
    return post('/manage/role/data', data);
}
