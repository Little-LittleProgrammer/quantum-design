import { defHttp } from '@/http/axios';

enum Api {
    mediaManageCreate = '/common/media/create',
    mediaManageDetail = '/common/media/detail',
    mediaManageUpdate = '/common/media/update',
    mediaManageList = '/common/media/list',
    mediaManageSelect = '/common/media/select',
    mediaManageDelete = '/common/media/batch-delete',
    mediaManageStart = '/common/media/batch-start',
    mediaManageStop = '/common/media/batch-stop'
}

interface id {
    id?: number
}

type ids = id[];

/**
 * 媒体管理-列表请求参数
 */
export interface IMediaListRequest {
    industry_type: number;
    industry_sub_type: number;
    status: number;
    keywords: string;
    page: number;
    page_size: number;
}

/**
 * 媒体管理-列表接口返回
 */
export interface IMediaManageList {
    list?: IMediaList[];
}

/**
 * 媒体管理-列表项
 */
export interface IMediaList {
    ad_unit_count?: number;
    appid?: number;
    id?: number;
    industry_sub_type?: number;
    industry_sub_type_txt?: string;
    industry_type?: number;
    industry_type_txt?: string;
    name?: string;
    status?: number;
    status_txt?: string;
    updated_at?: string;
}

// 更新详情
export interface IMediaUpdate {
    android_download_url?: string;
    android_package?: string;
    appid?: string;
    industry_sub_type: number;
    industry_type: number;
    ios_bundle_id?: string;
    ios_download_url?: string;
    name: string;
    status?: number;
    id?: number;
}

export type IMediaDetail = IMediaUpdate & id

/**
 * 列表页筛选项
 */
export interface IMediaManageSelect {
    industry_list?: ISelectOption[];
    industry_sub_list?: ISelectOption[];
    status_list?: ISelectOption[];
}


/**
 * ***************************************************************************************************
 */

// 媒体管理-获取列表
export function api_media_manage_list(params: IMediaListRequest) {
    return defHttp.get<Result<IApiTableData<any, IMediaList>>>({
        url: Api.mediaManageList,
        params
    });
}

// 媒体管理-获取筛选项
export function api_media_manage_select() {
    return defHttp.get<Result<IMediaManageSelect>>({
        url: Api.mediaManageSelect
    });
}

// 媒体管理-媒体详情
export function api_media_manage_detail(params: id) {
    return defHttp.get<Result<Record<'media', IMediaDetail>>>({
        url: Api.mediaManageDetail,
        params
    });
}

// 媒体管理-新建媒体
export function api_media_manage_create(params: IMediaUpdate) {
    return defHttp.post<Result<IMediaManageList>>({
        url: Api.mediaManageCreate,
        params
    });
}

// 媒体管理-媒体编辑
export function api_media_manage_update(params: IMediaUpdate) {
    return defHttp.post<Result<IMediaManageList>>({
        url: Api.mediaManageUpdate,
        params
    });
}

// 媒体管理-媒体编辑
export function api_media_manage_delete(params: ids) {
    return defHttp.post<Result>({
        url: Api.mediaManageDelete,
        params
    });
}

// 媒体管理-媒体编辑
export function api_media_manage_start(params: ids) {
    return defHttp.post<Result>({
        url: Api.mediaManageStart,
        params
    });
}

// 媒体管理-媒体编辑
export function api_media_manage_stop(params: ids) {
    return defHttp.post<Result>({
        url: Api.mediaManageStop,
        params
    });
}