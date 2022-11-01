import { defHttp } from '@/http/axios';
import { IPolicyReq, IPolicyResHeader, IPolicyResList, IPolicySelect, IPolicyUniDetail } from './interface';

enum Api {
    policySelect = '/policy/select',
    policyList = '/policy/list',
    policyStart = '/policy/batch-start',
    policyStop = '/policy/batch-stop',
    policyDelete = '/policy/batch-delete',
    policyUinDetail = '/policy/detail',
    policyUinCreate = '/policy/detail',
    policyUinUpdate = '/policy/detail',
}

// 广告策略-select
export function api_policy_select() {
    return defHttp.get<Result<IPolicySelect>>({
        url: Api.policySelect
    });
}

// 广告策略-列表
export function api_policy_list(params: IPolicyReq & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<IPolicyResHeader, IPolicyResList>>>({
        url: Api.policyList,
        params
    });
}
// 广告策略-开启
export function api_policy_status_start(params: Record<'ids', number[]>) {
    return defHttp.post<Result>({
        url: Api.policyStart,
        params
    });
}
// 广告策略-关闭
export function api_policy_status_stop(params: Record<'ids', number[]>) {
    return defHttp.post<Result>({
        url: Api.policyStop,
        params
    });
}
// 广告策略-删除
export function api_policy_status_del(params: Record<'ids', number[]>) {
    return defHttp.post<Result>({
        url: Api.policyDelete,
        params
    });
}

// 广告策略-获取单个详情
export function api_policy_get_uni_detail(params: Record<'id', number>) {
    return defHttp.get<Result<IPolicyUniDetail>>({
        url: Api.policyUinDetail,
        params
    });
}

// 广告策略-新建
export function api_policy_get_uni_create(params: IPolicyUniDetail) {
    return defHttp.get<Result>({
        url: Api.policyUinCreate,
        params
    });
}

// 广告策略-更新
export function api_policy_get_uni_update(params: IPolicyUniDetail) {
    return defHttp.get<Result>({
        url: Api.policyUinUpdate,
        params
    });
}
