import { post, get } from '@/http/request';

// 用户设置-列表
export function api_manage_user_list(data) {
    return get('/manage/user/index', data);
}

// 用户设置-用户权限
export function api_manage_user_auths(data) {
    return get('/manage/user/auths', data);
}

// 用户设置-保存添加
export function api_manage_user_create(data) {
    return post('/manage/user/create', data);
}

// 用户设置-删除
export function api_manage_user_delete(data) {
    return post('/manage/user/delete', data);
}

// 用户设置-人员编辑
export function api_manage_user_update(data) {
    return post('/manage/user/update', data);
}


