import { defHttp } from '@/http/axios';

enum Api {
    creativeTemplateDetail = '/common/creative-template/detail',
    creativeTemplateList = '/common/creative-template/list',
    creativeTemplateCreate = '/common/creative-template/create',
    creativeTemplateUpdate = '/common/creative-template/update',
    creativeTemplateStop = '/common/creative-template/batch-stop', // 停用
    creativeTemplateStart = '/common/creative-template/batch-start', // 启用
    creativeTemplateDelete = '/common/creative-template/batch-delete', // 删除
    creativeTemplateSelect = '/common/creative-template/select'
}

/**
 * 模版 ID
 */
interface ICreativeTemplateId {
    creative_template_id?: number; // 创意模版ID
}

/**
 * 创意模版 ID 集合
 */
type ICreativeTemplateIds = ICreativeTemplateId[]

/**
 * 元素 （打包字段结构可复用）
 */
export interface ICreativeTemplateElements {
    max_creative_time?: number; // 创意时长限制
    max_words?: number; // 字数限制
    type: number; // 元素类型：1创意主图 、2封面图、3标题、4描述、5icon、6按钮文案、7创意时长
    height?: number; // 高
    max_img_size?: number; // 图片大小限制
    width?: number; // 宽
    size_type?: number // 尺寸类型 1 固定比例 2 固定尺寸
}

/**
 * 创意模版创建请求参数
 */
export interface ICreativeTemplateCreate {
    creative_type?: number; // 创意形式 0 全部 纯图、图文、视频、激励视频
    elements: ICreativeTemplateElements[]; // 元素配置 打包字段（数组）
    format?: number; // 广告位形式 0 全部 1 信息流、2 开屏、3 激励视频、4 Banner、5 前贴、6 插屏、7 浮层
    name?: number; // 模版名称
}

/**
 * 列表展示尺寸
 */
export interface ICreativeTemplateSizeTxt {
    size?: string;
    size_type?: string;
    type?: number;
    type_txt?: string;
}

/**
 * 创意模版列表详情 （可复用）
 */
export type ICreativeTemplateInfo = ICreativeTemplateCreate & {
    created_time?: string; // 创建时间
    creative_type_txt?: string; // 创意类型描述
    deleted_time?: string; // 删除时间
    format_txt?: string; // 广告位形式描述
    creative_template_id?: number; // ID
    status?: number; // 模版状态 1 启动 2 停用
    status_txt?: string; // 模版状态描述
    updated_time?: string; // 更新时间
    size_txt?: ICreativeTemplateSizeTxt
}

/**
 * 更新模版创建请求参数
 */
export type ICreativeTemplateUpdate = ICreativeTemplateCreate & ICreativeTemplateId;

/**
 * 筛选项
 */
export interface ICreativeTemplateSelect {
    creative_type_list?: ISelectOption[]; // 创意形式筛选
    format_list?: ISelectOption[]; // 广告位形式筛选
    elements_type_list?: ISelectOption[]; // 元素类型
    status_list?: ISelectOption[]; // 状态筛选
    size_type_list?: ISelectOption[]; // 固定比例/尺寸
}

/**
 * ***************************************************************************************************
 */

// 创意模版-获取模版详情
export function api_creative_template_detail(params: ICreativeTemplateId) {
    return defHttp.get<Result<Record<'creative_template_info', ICreativeTemplateInfo>>>({
        url: Api.creativeTemplateDetail,
        params
    });
}

// 创意模版-获取模版列表
export function api_creative_template_list(params: ICreativeTemplateId & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<any, ICreativeTemplateInfo>>>({
        url: Api.creativeTemplateList,
        params
    });
}

// 创意模版-获取筛选项
export function api_creative_template_select() {
    return defHttp.get<Result<ICreativeTemplateSelect>>({
        url: Api.creativeTemplateSelect
    });
}

// 创意模版-创建创意模版
export function api_creative_template_create(params: ICreativeTemplateCreate) {
    return defHttp.post<Result<ICreativeTemplateId>>({
        url: Api.creativeTemplateCreate,
        params
    });
}

// 创意模版-更新创意模版
export function api_creative_template_update(params: ICreativeTemplateUpdate) {
    return defHttp.post<Result<ICreativeTemplateId>>({
        url: Api.creativeTemplateUpdate,
        params
    });
}

// 创意模版-批量删除创意模版
export function api_creative_template_delete(params: ICreativeTemplateIds) {
    return defHttp.post<Result<ICreativeTemplateIds>>({
        url: Api.creativeTemplateDelete,
        params
    });
}

// 创意模版-批量启用
export function api_creative_template_start(params: ICreativeTemplateIds) {
    return defHttp.post<Result<ICreativeTemplateIds>>({
        url: Api.creativeTemplateStart,
        params
    });
}

// 创意模版-批量停用
export function api_creative_template_stop(params: ICreativeTemplateIds) {
    return defHttp.post<Result<ICreativeTemplateIds>>({
        url: Api.creativeTemplateStop,
        params
    });
}
