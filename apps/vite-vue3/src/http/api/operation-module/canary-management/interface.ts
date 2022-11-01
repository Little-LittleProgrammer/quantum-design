import { IDuration, IVersion } from '../../global';
import { IDeviceScope } from '../../types/operation';

export type ICanarySelect = Partial<ISelectList<'media_list' |'status_list' | 'platform_list' | 'app_ver_list' | 'ad_uint_list'>>

export type ICanaryListReqStr = 'status' | 'platform' | 'key_word' | 'ad_uint_id' | 'app_version'

export type ICanaryListReq = Partial<Recordable<ICanaryListReqStr>> & {
    duration?: IDuration
}

export type ICanaryListHeaderStr = ICanaryListReqStr

export type ICanaryListHeader = Recordable<ICanaryListHeaderStr>

export interface ICanaryConfig {
    /**
     * 广告位id数组
     */
    ad_unit_ids?: number[];
    /**
     * 切量分组数量(聚合使用)
     */
    canary_group_count?: number;
    /**
     * 切量分组
     */
    canary_groups?: ICanaryGroup[];
    /**
     * 设备范围
     */
    device_scopes?: IDeviceScope[];
    canary_id?: number;
    app_version?: IVersion
    /**
     * 切量名称
     */
    name?: string;
    /**
     * 操作系统
     */
    platform?: number;
    duration?: IDuration
    /**
     * 切量组状态
     */
    status?: number;
}

export interface ICanaryGroup {
    /**
     * 分桶比例
     */
    bucket_ratio?: number;
    /**
     * 分桶
     */
    buckets?: number[];
    /**
     * 所属canary
     */
    canary_id?: number;
    /**
     * 所属canary_group
     */
    canary_group_id?: number;
    /**
     * 切量配置
     */
    subset?: ICanaryGroupConfig[];
    id?: number;
    /**
     * 切量名称
     */
    name?: string;
    /**
     * 其他策略（非广告位策略）
     */
    other_policy_id?: number[];
    /**
     * 服务端配置
     */
    special_kv?: { [key: string]: string }[];
}

export interface ICanaryGroupConfig {
    /**
     * ad unit id
     */
    ad_uint_id?: number;
    /**
     * 标签定向id
     */
    direction_id?: number;
    /**
     * 流量配置id
     */
    flow_group_id?: string;
    /**
     * 广告位策略id
     */
    policy_id?: number;
}

/**
 * 桶详细
 */
export interface IBucketsDetail {
    /**
     * 未使用分桶
     */
    unused_buckets?: number[];
    /**
     * 已使用分桶
     */
    used_buckets?: number[];
}

// 切量组 header
export interface ICanaryGroupListHeader {
    'canary_group_id'?: string,
    'direction_txt'?: string,
    'name'?: string,
    'bucket_ratio_txt'?: string,
    'special_kv_txt'?: string,
    'other_policy_txt'?: string,
    'sub_header'?: ICanaryGroupListSubHeader
}

export interface ICanaryGroupListSubHeader {
    'direction_tag_txt'?: string,
    'policy_txt'?: string,
    'flow_txt'?: string
}

export interface ICanaryGroupDetail {
    header:ICanaryGroupListHeader;
    info:ICanaryConfig
}

export interface ICanaryGroupBatchUpdate {
    info: ICanaryConfig,
    canary_ids: number[]
}
