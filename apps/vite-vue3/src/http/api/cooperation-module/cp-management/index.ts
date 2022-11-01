import { defHttp } from '@/http/axios';
import { ICpInfo, ICpInfoMap, ICpListHeader, ICpListReq, ICpOptionKey, ICpSelect } from './interface';

enum Api {
    partnerSelect = '/partner/select', // 筛选项 1层
    partnerList = '/partner/list', // list 1层
    partnerDetail = '/partner/detail', // detail 1层
    partnerDelete = '/partner/batch-delete', // 删除 1层
    partnerStart = '/partner/batch-start', // 开启 1层
    partnerStop = '/partner/batch-stop', // 关闭 1层
    partnerCreate = '/partner/create', // create 2层
    partnerUpdate = '/partner/update', // update 更新 2层1
}

export function api_partner_select() {
    return defHttp.get<Result<ICpSelect>>({
        url: Api.partnerSelect
    });
}

export function api_partner_list(params: ICpListReq & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<ICpListHeader, ICpInfo>>>({
        url: Api.partnerList,
        params
    });
}

export function api_partner_detail(params: Record<'partner_id', number>) {
    return defHttp.get<Result<ICpInfoMap>>({
        url: Api.partnerDetail,
        params
    });
}

export function api_partner_delete(params: ICpOptionKey) {
    return defHttp.post<Result>({
        url: Api.partnerDelete,
        params
    });
}
export function api_partner_start(params: ICpOptionKey) {
    return defHttp.post<Result>({
        url: Api.partnerStart,
        params
    });
}
export function api_partner_stop(params: ICpOptionKey) {
    return defHttp.post<Result>({
        url: Api.partnerStop,
        params
    });
}
export function api_partner_create(params: ICpInfo) {
    return defHttp.post<Result>({
        url: Api.partnerCreate,
        params
    });
}
export function api_partner_update(params: ICpInfo) {
    return defHttp.post<Result>({
        url: Api.partnerUpdate,
        params
    });
}
