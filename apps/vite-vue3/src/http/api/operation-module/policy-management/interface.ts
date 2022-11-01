import { IDirections } from '../../common/direction/interface';
import { IDuration, IVersion } from '../../global';
import { IDeviceScope } from '../../types/operation';

// 筛选项
/**
 * I.PolicySelectReply
 */
export interface IPolicySelect {
    media_list?: ISelectOption[]
    ad_unit_list?: ISelectOption[];
    display_rule_list?: ISelectOption[];
    platform_list?: ISelectOption[];
    policy_category_list?: ISelectOption[];
    policy_type_list?: ISelectOption[];
    sort_field_list?: ISelectOption[];
    sort_type_list?: ISelectOption[];
    status_list?: ISelectOption[];
}

// 请求参数
export type IPolicyReqStr = 'status' | 'platform' | 'policy_category' | 'policy_type' | 'media'

export type IPolicyReq = Partial<Recordable<IPolicyReqStr | 'keywords'> & {
    ad_unit_ids: string[]
    duration?: IDuration
}>

// 样式
type IAdLayoutStyleStr = 'style_name' | 'layout' | 'animation' | 'bg_color' | 'btn_color' | 'stat_code' | 'display_percent'
export type IAdLayoutStyle = Recordable<IAdLayoutStyleStr>

// header头
export interface IPolicyResHeader {
    ad_unit_count?: string;
    condition?: string;
    device_scopes?: string;
    id?: string;
    name?: string;
    platform_txt?: string;
    policy_category_txt?: string;
    policy_type_txt?: string;
    priority?: string;
    status?: string;
    status_txt?: string;
    valid_date?: string;
    version?: string;
}

// list表格
export interface IPolicyResList extends IPolicyResHeader{
    ad_unit_ids?: number[];
    app_version?: IVersion;
    device_scope?: string;
    duration?: IDuration;
    platform?: number;
    platform_txt?: string;
    policy_category?: number;
    policy_type?: number;
}

/**
 * I.PolicyDetailReply，策略详情响应
 */
export interface IPolicyUniDetail {
    policy?: IPolicyDetailItem;
}

/**
 * I.PolicyDetailItem，策略详情元素
*/
export interface IPolicyDetailItem {
    ad_unit_ids?: number[];
    device_scope?:IDeviceScope[];
    device_scope_radio?: string;
    direction?: IDirections;
    direction_radio?: string;
    id?: number;
    media_id?: number;
    name?: string;
    platform?: number;
    app_version?: IVersion;
    policy_category?: number;
    policy_type?: number;
    priority?: number;
    policy_reader_bottom?: IPolicyReaderBottom;
    policy_reader_force_stay?: IPolicyReaderForceStay;
    policy_reader_in_chapter?: IPolicyReaderInChapter;
    policy_splash?: IPolicySplash;
    policy_voice_top?: IPolicyVoiceTop;
    duration?: IDuration;
    policy_coin?: IPolicyCoin;
    policy_no_ad?: IPolicyNoAd;
    policy_word_link?: IPolicyWordLink;
}

/**
 * I.PolicyReaderBottom，阅读器底部通栏
 */
export interface IPolicyReaderBottom {
    floor_price_filter?: IFloorPriceFilter;
    /**
     * 移动数据下播放视频的次数
     */
    mobile_network_video_frequency?: string;
    /**
     * 横版样式
     */
    style_horizontal?: IStyle[];
    /**
     * 竖版样式
     */
    style_vertical?: IStyle[];
}

/**
 * I.FloorPriceFilter，底价过滤功能
 */
export interface IFloorPriceFilter {
    /**
     * 底价
     */
    floor_price?: string;
    /**
     * 广告展示间隔（章）
     */
    interval_chapter?: string;
    /**
     * 广告展示间隔（页）
     */
    interval_page?: string;
    /**
     * 广告展示间隔（时长）
     */
    interval_time?: string;
}

/**
 * I.Style
 */
export interface IStyle {
    /**
     * 展示动效
     */
    animation?: string;
    /**
     * 背景颜色
     */
    bg_color?: string;
    /**
     * 按钮颜色
     */
    btn_color?: string;
    /**
     * 出现概率
     */
    display_percent?: string;
    /**
     * 布局
     */
    layout?: string;
    /**
     * 统计标识
     */
    stat_code?: string;
}

/**
 * I.PolicyReaderForceStay，强制停留
 */
export interface IPolicyReaderForceStay extends ICustomPolicyReply {
    /**
     * 首次广告展示时间点
     */
    display_first_time?: string;
    /**
     * 展示规则
     */
    display_rule_type?: string;
    floor_price_filter?: IFloorPriceFilter;
    /**
     * 用户广告展示次数上限
     */
    max_display?: string;
    /**
     * 移动数据下播放视频的次数
     */
    mobile_network_video_frequency?: string;
    /**
     * 横版样式
     */
    style_horizontal?: IStyle[];
    /**
     * 竖版样式
     */
    style_vertical?: IStyle[];
}

/**
 * I.ReaderForceStayConfig
 */
export interface IReaderForceStayConfig {
    displayable?: string;
    /**
     * 强制停留时间
     */
    force_stay_time?: string;
    /**
     * 广告展示间隔（章）
     */
    interval_chapter?: string;
    /**
     * 广告展示间隔（时长）
     */
    interval_time?: string;
}

/**
 * I.PolicyReaderInChapter，阅读器普通插页
 */
export interface IPolicyReaderInChapter {
    /**
     * 首次广告展示时间点
     */
    display_first_time?: string;
    /**
     * 展示规则
     */
    display_rule_type?: string;
    floor_price_filter?: IFloorPriceFilter;
    /**
     * 用户广告展示次数上限
     */
    max_display?: string;
    /**
     * 移动数据下播放视频的次数
     */
    mobile_network_video_frequency?: string;
    /**
     * 横版样式
     */
    style_horizontal?: IStyle[];
    /**
     * 竖版样式
     */
    style_vertical?: IStyle[];
}

/**
 * I.PolicySplash，开屏策略
 */
export interface IPolicySplash {
    /**
     * 广告点击样式
     */
    click_style?: string;
    floor_price_filter?: IFloorPriceFilter;
    /**
     * 摇一摇灵敏度-Android
     */
    shake_sense_android?: string;
    /**
     * 摇一摇灵敏度-iOS
     */
    shake_sense_ios?: string;
}

/**
 * I.PolicyVoiceTop，听书顶部策略
 */
export interface IPolicyVoiceTop {
    floor_price_filter?: IFloorPriceFilter;
    /**
     * 图文广告总曝光时间(秒)
     */
    total_display_seconds?: string;
    /**
     * 视频广告播放完成停留时间(秒)
     */
    video_complete_stay_second?: string;
}

// 文字链 -start
export interface IPolicyWordLink {
    chapter_end?: IPolicyWordLinkItem;
    chapter_front?: IPolicyWordLinkItem;
    in_chapter?: IPolicyWordLinkItem;
    page_turn?: IPolicyWordLinkItem;
}

export interface IPolicyWordLinkItem {
    coin_config?: IDisplayConfig;
    display_interval?: number;
    display_order?: number[];
    display_type?: number;
    margin_ad_percent?: number;
    margin_bottom_percent?: number;
    no_ad_config?: IDisplayConfig;
    vip_config?: IDisplayConfig;
}

export interface IDisplayConfig {
    display_percent?: number;
    DisplayMax?: number;
}
// 文字链 - end

// 金币 start
export interface IPolicyCoin {
    coin_configs?: IPolicyCoinItem[];
}

export interface IPolicyCoinItem {
    amount?: number;
    amount_limit_down?: number;
    amount_total?: number;
    amount_type?: number;
    coin_log_type?: number;
    scene?: number;
}

// 金币 end

// 免广告
export interface IPolicyNoAd {
    no_ad_minutes?: number;
}

export interface ICustomPolicyReply {
    custom_policy_reply: ICustomDirection
}

export interface ICustomDirection {
    tags: string[],
    list: ICustomDfsTableList[]
}

export interface ICustomDfsTableList{
    key: string;
    type: string;
    config: Record<string, any>;
    data: Record<string, any>;
    subset?: ICustomDfsTableList[];
}
