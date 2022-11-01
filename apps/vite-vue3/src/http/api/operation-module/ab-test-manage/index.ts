// ab-test
import { defHttp } from '@/http/axios';
import {
    IAbTestListReq,
    IAbTestList,
    IAbTestHeader,
    IAbTestSelect, IAbTestUpdate
} from '@/http/api/operation-module/ab-test-manage/interface';

enum Api {
    abTestList = '/abtest/list',
    abTestSelect = '/abtest/select/list',
    abTestCreate = '/abtest/create',
    abTestGet = '/abtest/get',
    abTestUpdate = '/abtest/update',
    abTestStart = '/abtest/start/update',
    abTestStop = '/abtest/stop/update',
    abTestDelete = '/abtest/delete',
}

interface id {
    abtest_id: number
}

type ids = id[];

// abtest-列表
export function api_ab_test_list(params: IAbTestListReq) {
    return defHttp.get<Result<IApiTableData<IAbTestHeader, IAbTestList>>>({
        url: Api.abTestList,
        params
    });
}

// abtest-筛选项
export function api_ab_test_select() {
    return defHttp.get<Result<IAbTestSelect>>({
        url: Api.abTestSelect
    });
}

// abtest-新建
export function api_ab_test_create(params: IAbTestUpdate) {
    return defHttp.post<Result<IAbTestUpdate>>({
        url: Api.abTestCreate,
        params
    });
}

// abtest-详情
export function api_ab_test_get(params: id) {
    return defHttp.get<Result<IAbTestUpdate>>({
        url: Api.abTestGet,
        params
    });
}

// abtest-更新
export function api_ab_test_update(params: IAbTestUpdate) {
    return defHttp.post<Result<IAbTestUpdate>>({
        url: Api.abTestUpdate,
        params
    });
}

// abtest-开启
export function api_ab_test_start(params: ids) {
    return defHttp.post<Result>({
        url: Api.abTestStart,
        params
    });
}

// abtest-停止
export function api_ab_test_stop(params: ids) {
    return defHttp.post<Result>({
        url: Api.abTestStop,
        params
    });
}

// abtest-停止
export function api_ab_test_delete(params: ids) {
    return defHttp.post<Result>({
        url: Api.abTestDelete,
        params
    });
}