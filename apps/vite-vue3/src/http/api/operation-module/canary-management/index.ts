import { defHttp } from '@/http/axios';
import { IBucketsDetail, ICanaryConfig, ICanaryGroupBatchUpdate, ICanaryGroupDetail, ICanaryListHeader, ICanaryListReq, ICanarySelect } from './interface';

enum Api {
    canarySelect = '/canary/select/list', // 筛选项 1层
    canaryList = '/canary/list', // 主页list
    canaryStatusStart = '/canary/start/update', // 1层
    canaryStatusStop= '/canary/stop/update', // 1层
    canaryUniDelete = '/canary/delete', // 1层
    canaryUniDetail = '/canary/detail', // 2层
    canaryUniCreate = '/canary/create', // 2层
    canaryUniUpdate = '/canary/update', // 2层
    canaryBucketsDetail = '/canary/buckets/detail',
    canaryGroupUpdate = '/canary/group/update', // 3层 切量组 - 单条编辑
    canaryGroupUpdateBatch = '/canary/group/batch-update', // 3层 切量组 - 批量编辑

}

export function api_canary_select() {
    return defHttp.get<Result<ICanarySelect>>({
        url: Api.canarySelect
    });
}

// 获取列表
export function api_canary_list(params: ICanaryListReq & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<ICanaryListHeader, ICanaryConfig>>>({
        url: Api.canaryList,
        params
    });
}

// 切量开启
export function api_canary_status_start(params: Record<'canary_ids', number[]>) {
    return defHttp.post<Result<IApiTableData<ICanaryListHeader, ICanaryConfig[]>>>({
        url: Api.canaryStatusStart,
        params
    });
}
// 切量关闭
export function api_canary_status_stop(params: Record<'canary_ids', number[]>) {
    return defHttp.post<Result>({
        url: Api.canaryStatusStop,
        params
    });
}

// 删除单行
export function api_canary_delete(params: Record<'canary_ids', number[]>) {
    return defHttp.post<Result>({
        url: Api.canaryUniDelete,
        params
    });
}

// 单条详情
export function api_canary_uni_detail(params: Record<'canary_id', number>) {
    return defHttp.get<Result<ICanaryGroupDetail>>({
        url: Api.canaryUniDetail,
        params
    });
}

// 创建单条
export function api_canary_uni_create(params: ICanaryConfig) {
    return defHttp.post<Result>({
        url: Api.canaryUniCreate,
        params
    });
}
// 更新单条
export function api_canary_uni_update(params: ICanaryConfig) {
    return defHttp.post<Result>({
        url: Api.canaryUniUpdate,
        params
    });
}

// 分桶详情
export function api_canary_buckets_detail() {
    return defHttp.get<Result<IBucketsDetail>>({
        url: Api.canaryBucketsDetail
    });
}

// 切量组 - 批量编辑
export function api_canary_group_batch_update(params:ICanaryGroupBatchUpdate) {
    return defHttp.post<Result>({
        url: Api.canaryGroupUpdateBatch,
        params
    });
}

