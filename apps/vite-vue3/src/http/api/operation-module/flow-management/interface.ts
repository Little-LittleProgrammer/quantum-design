// 请求参数

import { IDuration, IVersion } from '../../global';
import { IDeviceScope } from '../../types/operation';

export type IFlowConfSelect =Partial< ISelectList<'ad_unit_format_list' | 'media_list' | 'ad_unit_list' | 'cooperation_mode_list' | 'open_type_list' | 'settlement_type_list' | 'second_price_type_list' | 'partner_list'>>
export type IFlowSelect =IFlowConfSelect

// flow/list 请求参数
export interface IFlowListReq {
    ad_unit_format?: string
    media_id?: string
    ad_unit_id?: string
}

// flow/list 相应表格头
export interface IFlowResHeader {
    ad_unit_id?:string;
    ad_unit_name?:string;
    flow_policy_num?:string;
    media_name?:string;
    updated_at?:string
}

// flow/list 相应表格体
export interface IFlowResList extends IFlowListReq {
    ad_unit_name?: string;
    deleted_at?: number;
    flow_policy_num?: number;
    media_name?: string;
    platform?: number;
    updated_at?: number;
}

// /flow_policy/list 请求数据
export interface IFlowPolicyReq {
    platform?:string;
    ad_unit_id?:string;
    app_version?:IVersion
    flow_name?:string;
    media_id?:string;
}

// /flow_policy/list 相应header头
export interface IFlowPolicyResHeader {
    flow_id?: string
    app_version?: IVersion
    flow_name?: string
    priority?: string
    percent?: string
    available_period?: string
    device_scope?: string
    status?: string
}

// /flow_policy/list 相应list表格
export interface IFlowPolicyResList extends IFlowPolicyResHeader, IFlowPolicyReq {
    media_name?: string
    deleted_at?: string
    media_id?: string
    app_version: IVersion
    duration?: IDuration
}
export interface IFlowConf {
    ad_format?: number;
    ad_unit_id?: number;
    appid?: string;
    created_at?: number;
    deleted_at?: number;
    factor?: number;
    floor_price?: number;
    flow_group_id?: string;
    id?: number;
    is_audit?: number;
    max_display?: number;
    max_request?: number;
    media_id?: number;
    partner_id?: number;
    price?: number;
    request_frequency?: number;
    request_order?: number;
    sort?: number;
    tagid?: string;
    updated_at?: number;
    status?:number
}
export interface IFlowUni {
    ad_unit_id?: number;
    device_scope?: IDeviceScope[];
    device_scope_radio?: string;
    direction?: IDuration[];
    direction_radio?: string;
    flow_group_id?: string;
    id?: number;
    flow_id?:number;
    app_version?: IVersion
    name?: string;
    percent?: number;
    platform?: number;
    priority?: number;
    duration?: IDuration
}
export interface IFlowGroupDetail {
    adv_list?: IFlowConf[];
    flow?: IFlowUni;
}
