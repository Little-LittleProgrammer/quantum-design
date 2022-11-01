import { defHttp } from '@/http/axios';
import { Dayjs } from 'dayjs';

enum Api {
    adSpaceList = '/common/ad-unit/list',
    adSpaceDetail = '/common/ad-unit/detail',
    adSpaceSelect = '/common/ad-unit/select',
    adSpaceCreate = '/common/ad-unit/create',
    adSpaceUpdate = '/common/ad-unit/update',
    adSpaceStart = '/common/ad-unit/batch-start',
    adSpaceStop = '/common/ad-unit/batch-stop',
    adSpaceDelete = '/common/ad-unit/batch-delete',
}

interface id {
    id?: number
}

type ids = id[]

/**
 * 列表请求参数
 */
export interface IAdSpaceListRequest {
    media_id: number, // 媒体名称
    status: number, // 状态
    scene: number, // 广告位场景
    format: number[], // 广告位形式
    keywords: string
}

/**
 * 列表
 */
export interface IAdSpaceList {
    format?: number;
    format_txt?: number;
    id?: number;
    media_id?: number;
    media_name?: string;
    name?: string;
    scene?: number;
    scene_txt?: string;
    status?: number;
    status_txt?: string;
    updated_at?: string;
}

/**
 * 广告位列表表头
 */
export interface IAdSpaceListHeader {
    format_txt?: string;
    id?: string;
    media_name?: string;
    name?: string;
    scene_txt?: string;
    status_txt?: string;
    updated_at?: string;
}

/**
 * 广告位详情
 */
export interface IAdSpaceDetail {
    access_mode?: number;
    created_at?: string;
    description?: string;
    flow_switch?: number;
    format?: number[];
    id?: number;
    material_cache_count?: number;
    material_cache_expire?: number;
    media_id: number;
    name: string;
    open_type?: number[];
    creative?: IAdSpaceCreativeTemplate[]
    publish_case: IAdSpacePublishCase[];
    resource_level?: number;
    resource_type?: number;
    scene?: number;
    status?: number;
    updated_at?: string;
}

interface IAdSpaceCreativeTemplate {
    creative_template_format_name?: string;
    creative_template_id?: number;
    creative_template_name?: string;
    /**
     * todo 固定比例...
     */
    material_url?: string;
}

/**
 * 刊例价格
 */
export interface IAdSpacePublishCase {
    description?: string;
    price?: number;
    type?: number;
    start_time: Dayjs;
    end_time: Dayjs;
}

export interface IAdSpaceSelect {
    access_mode_list?: ISelectOption[];
    format_list?: ISelectOption[];
    media_list?: ISelectOption[];
    open_type_list?: ISelectOption[];
    publish_case_type_list?: ISelectOption[];
    resource_type_list?: ISelectOption[];
    scene_list?: ISelectOption[];
    status_list?: ISelectOption[];
}

/**
 * ***************************************************************************************************
 */

// 广告位管理-广告位列表
export function api_ad_space_list(params: IAdSpaceListRequest & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<IAdSpaceListHeader, IAdSpaceList>>>({
        url: Api.adSpaceList,
        params
    });
}

// 广告位管理-广告位详情
export function api_ad_space_detail(params: id) {
    return defHttp.get<Result<Record<'ad_unit', IAdSpaceDetail>>>({
        url: Api.adSpaceDetail,
        params
    });
}

// 广告位管理-筛选项
export function api_ad_space_select() {
    return defHttp.get<Result<IAdSpaceSelect>>({
        url: Api.adSpaceSelect
    });
}

// 广告位管理-创建广告位
export function api_ad_space_create(params: Record<'ad_unit', IAdSpaceDetail>) {
    return defHttp.post<Result>({
        url: Api.adSpaceCreate,
        params
    });
}

// 广告位管理-更新广告位
export function api_ad_space_update(params: Record<'ad_unit', IAdSpaceDetail>) {
    return defHttp.post<Result>({
        url: Api.adSpaceUpdate,
        params
    });
}

// 广告位管理-启用广告位
export function api_ad_space_start(params: ids) {
    return defHttp.post<Result>({
        url: Api.adSpaceStart,
        params
    });
}

// 广告位管理-停用广告位
export function api_ad_space_stop(params: ids) {
    return defHttp.post<Result>({
        url: Api.adSpaceStop,
        params
    });
}

// 广告位管理-删除广告位
export function api_ad_space_delete(params: ids) {
    return defHttp.post<Result>({
        url: Api.adSpaceDelete,
        params
    });
}
