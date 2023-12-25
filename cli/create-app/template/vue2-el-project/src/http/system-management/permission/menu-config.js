import { post, get } from '@/http/request';

// 菜单-列表
export function api_manage_auth_list(data) {
    return get('/manage/auth/index', data);
}

// 菜单-数据（添加、编辑角色专用）
export function api_manage_auth_data(data) {
    return get('/manage/auth/data', data);
}

// 菜单-添加
export function api_manage_auth_create(data) {
    return post('/manage/auth/create', data);
}
// 菜单-删除
export function api_manage_auth_delete(data) {
    return post('/manage/auth/delete', data);
}
// 菜单-编辑
export function api_manage_auth_update(data) {
    return post('/manage/auth/update', data);
}
// 菜单-移动、设置排序
export function api_manage_auth_sort(data) {
    return post('/manage/auth/sort', data);
}
