import { IDuration } from '@/http/api/global';

import { IDeviceScope } from '@/http/api/types/operation';
import { IDirections } from '@/http/api/common/direction/interface';

export type IAbTestEditStr = 'name' | 'startTime' | 'endTime' | 'platform' | 'minAppVersion' | 'maxAppVersion'

// 列表请求参数
export interface IAbTestListReq {
    page_size: number;
    page: number;
    status?: string;
    filter_time?: string;
    key_word?: string;
}

/**
 * pixiu.AbtestConfig
 */
export interface IAbTestList {
    /**
     * 实验分组数量
     */
    abtest_group_count?: number;
    /**
     * 实验分组
     */
    abtest_groups?: IAbTestGroup[];
    app_version?: IAbTestAppVersion;
    app_version_txt?: string;
    duration?: IDuration;
    abtest_id?: number;
    kpi?: IAbTestConfigKpi;
    /**
     * json-append: omitempty // json-replace: 实验名称
     */
    name?: string;
    /**
     * 操作系统
     */
    platform?: number;
    /**
     * 实验组状态
     */
    status?: number;
    status_txt?: string;
    validity_txt?: string;
}

/**
 * pixiu.AbtestConfig
 */
export interface IAbTestUpdate {
    /**
     * 实验分组数量
     */
    abtest_group_count?: number;
    /**
     * 实验分组
     */
    abtest_groups?: IAbTestGroup[];
    app_version?: IAbTestAppVersion;
    app_version_txt?: string;
    duration: IDuration;
    abtest_id?: number;
    kpi?: IAbTestConfigKpi;
    /**
     * json-append: omitempty // json-replace: 实验名称
     */
    name?: string;
    /**
     * 操作系统
     */
    platform?: number;
    /**
     * 实验组状态
     */
    status?: number;
    status_txt?: string;
    validity_txt?: string;
}

/**
 * pixiu.AbtestGroup
 */
export interface IAbTestGroup {
    /**
     * 所属abtest
     */
    abtest_id?: number;
    ad_unit_txt?: string;
    /**
     * 平均arpu值
     */
    avg_arpu?: string;
    bucket_count?: number;
    bucket_txt?: string;
    /**
     * 分桶
     */
    buckets?: number[];
    /**
     * 点击
     */
    click?: number;
    /**
     * 点击率
     */
    click_ratio?: string;
    /**
     * 广告位配置
     */
    data?: IAbTestGroupConfig[];
    /**
     * 实验范围
     */
    device_scope?: IDeviceScope[];
    /**
     * 实验组范围
     */
    device_scope_txt?: string;
    /**
     * 实验定向
     */
    direction_id?: number;
    direction_txt?: string;
    direction_content?: IDirections
    flow_txt?: string;
    id?: number;
    /**
     * 收入
     */
    income?: number;
    /**
     * 实验名称
     */
    name?: string;
    /**
     * 实验分组名称
     */
    name_txt?: string;
    /**
     * 其他策略（非广告位策略）
     */
    other_policy_id?: number[];
    other_policy_txt?: string;
    policy_txt?: string;
    /**
     * 曝光
     */
    show?: number;
    /**
     * 服务端配置
     */
    special_kv?: { [key: string]: string };
    special_kv_txt?: string;
    /**
     * 实验类别
     */
    type?: number;
}

/**
 * pixiu.AbtestGroup_Config，广告位
 */
export interface IAbTestGroupConfig {
    ad_units?: IConfigAdUnitInfo[];
    /**
     * 标签定向id
     */
    direction_id?: number;
    direction_tag_txt?: string;
    /**
     * 流量配置id
     */
    flow_group_id?: string;
    /**
     * 广告位策略id
     */
    policy_id?: number;
    policy_txt?: string;
}

/**
 * pixiu.Config_AdUnitInfo
 */
export interface IConfigAdUnitInfo {
    id?: number;
    name?: string;
}

/**
 * pixiu.AppVersion
 */
interface IAbTestAppVersion {
    max?: number;
    min?: number;
}

/**
 * pixiu.AbtestConfig_Kpi
 */
interface IAbTestConfigKpi {
    /**
     * 显著水平
     */
    elfa?: string;
    /**
     * 预期提升绝对值
     */
    raise?: string;
    /**
     * 核心指标
     */
    type?: number;
}

/**
 * pixiu.AbtestsHeader
 */
export interface IAbTestHeader {
    abtest_id?: string;
    app_version_txt?: string;
    group_count?: string;
    name?: string;
    platform?: string;
    status?: string;
    status_txt?: string;
    validity_txt?: string;
    sub_header?: any
}


export interface IAbTestSelect {
    status_list?: ISelectOption;
    group_type_list?: ISelectOption;
    kpi_type_list?: ISelectOption;
    media_list?: ISelectOption;
    platform_list?: ISelectOption;
}


