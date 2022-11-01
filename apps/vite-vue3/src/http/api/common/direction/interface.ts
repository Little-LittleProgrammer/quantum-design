import { IDuration } from '../../global';

export interface IDirectionSelect {
    active_day?: ISelectOption[];
    ad_play_days?: ISelectOption[];
    avg_ad_play_cnt?: ISelectOption[];
    avg_ad_play_coin?: ISelectOption[];
    avg_bottom_ecpm?: ISelectOption[];
    avg_coin?: ISelectOption[];
    avg_ecpm?: ISelectOption[];
    avg_inchapter_ecpm?: ISelectOption[];
    avg_prerolls_ecpm?: ISelectOption[];
    bottom_ecpm?: ISelectOption[];
    bottom_sensitive?: ISelectOption[];
    click?: ISelectOption[];
    click_inchapter?: ISelectOption[];
    click_reader?: ISelectOption[];
    duration?: ISelectOption[];
    ecpm?: ISelectOption[];
    inchapter_ecpm?: ISelectOption[];
    inchapter_sensitive?: ISelectOption[];
    last_3_days_duration?: ISelectOption[];
    last_day_duration?: ISelectOption[];
    no_prerolls_day?: ISelectOption[];
    prerolls_ecpm?: ISelectOption[];
    prerolls_sensitive?: ISelectOption[];
    t_mode?: ISelectOption[];
    user_category?: ISelectOption[];
}

/**
 * pixiu.DirectionListReply，定向列表响应
 */
export interface IDirectionList {
    list?: IDirections[];
}

/**
 * pixiu.Directions，定向结构
 */
export interface IDirections {
    data?: IDirectionData[];
    id?: number;
    name?: string;
    sort?: number;
}

/**
 * pixiu.DirectionData，定向详情
 */
export interface IDirectionData {
    direction_detail?: IDirectionDetail;
    sub_category?: ISubCategory;
    sub_category_other?: string[];
    top_category?: string;
}

/**
 * pixiu.DirectionDetail，定向配置内容
 */
export interface IDirectionDetail {
    active_day?: string[];
    ad_play_days?: string[];
    avg_ad_play_cnt?: string[];
    avg_ad_play_coin?: string[];
    avg_bottom_ecpm?: string[];
    avg_coin?: string[];
    avg_ecpm?: string[];
    avg_inchapter_ecpm?: string[];
    avg_prerolls_ecpm?: string[];
    book_category?: string;
    book_id?: string;
    book_tag?: string;
    bottom_ecpm?: string[];
    bottom_sensitive?: string[];
    click?: string[];
    click_inchapter?: string[];
    click_reader?: string[];
    day_reading_minute?: IMinuteScope;
    duration?: string[];
    ecpm?: string[];
    inchapter_ecpm?: string[];
    inchapter_sensitive?: string[];
    last_3_days_duration?: string[];
    last_day_duration?: string[];
    location?: string[];
    no_prerolls_day?: string[];
    partner?: string;
    prerolls_ecpm?: string[];
    prerolls_sensitive?: string[];
    reading_ecpm?: ITypeScopeVal;
    reading_speed?: ITypeScopeVal;
    single_reading_minute?: IMinuteScope;
    t_mode?: string[];
    time_scope?: IDuration;
    user_category?: string[];
}

/**
 * pixiu.MinuteScope，ReadingMinute  阅读时长
 */
export interface IMinuteScope {
    max_val?: string;
    min_val?: string;
}

/**
 * pixiu.TypeScopeVal，ReadingSpeed 阅读速度
 */
export interface ITypeScopeVal {
    max_val?: string;
    min_val?: string;
    type?: number;
}

/**
 * pixiu.SubCategory，一级分类字段名（与前端一致，仅供前端使用）
 */
export interface ISubCategory {
    /**
     * 书架定向
     */
    book_direction?: string[];
    /**
     * 合作渠道定向
     */
    partner_direction?: string[];
    /**
     * 阅读行为定向
     */
    reading_direction?: string[];
    /**
     * 时间地域定向
     */
    time_location_direction?: string[];
    /**
     * 用户标签定向
     */
    user_tag_direction?: string[];
}
