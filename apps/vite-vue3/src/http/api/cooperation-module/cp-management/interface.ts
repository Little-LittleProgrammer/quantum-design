export type ICpSelect = Partial<Record<'access_mode_list' | 'second_price_type_list' | 'settlement_mode_list' | 'partner_status_list' | 'cooperation_mode_list' | 'settlement_type_list' | 'party_list', ISelectOption[]>>

export interface ICpListReq {
    access_mode?: number; // 接入模式 1 API 2 SDK 3 S2S2C接入
    second_price_type?: number; // 二价结算类型 1 固定 2 比例
    settlement_mode?: number; // 结算模式 1 预付款 2 定期结算
    partner_status?: number; // 合作平台状态 1 合作中 2 暂停合作
    key_word?: string // 合作平台名称（模糊查询）/ID （精准查询）
}

export interface ICpListHeader {
    /**
     * 接入模式
     */
    access_mode_txt?: string;
    /**
      * 合作时间
      */
    created_at?: string;
    /**
      * 竞价折扣
      */
    discount?: string;
    /**
      * 合作方名称
      */
    name?: string;
    /**
      * 合作方ID
      */
    partner_id?: string;
    /**
      * 合作模式
      */
    partner_mode_txt?: string;
    /**
      * 二价结算系数
      */
    second_price_ratio?: string;
    /**
      * 二价计算方式
      */
    second_price_type_txt?: string;
    /**
      * 结算方式
      */
    settlement_type_txt?: string;
    /**
      * 合作状态
      */
    status_txt?: string;
}

export interface ICpInfoMap {
    partner_info: ICpInfo;
}

export interface ICpInfo extends ICpListReq {
    access_mode_txt?: string;
    advertiser?: string;
    cooperation_mode?: CooperationMode;
    created_at?: string;
    deleted_at?: string;
    discount?: number;
    material_url?: string;
    name?: string;
    partner_id?: number;
    party?: number;
    party_txt?: string;
    qps?: number;
    request_frequency?: number;
    request_url?: string;
    second_price_ratio?: number;
    second_price_type_txt?: string;
    second_price_value?: number;
    settlement_mode_txt?: string;
    source_from?: string;
    status?: number;
    status_txt?: string;
    timeout?: number;
    updated_at?: string;
    token?:string;
    secret?:string
}

export interface CooperationMode {
    adn?: Adn;
    pd_multi_step?: PdMultiStep;
    pd_step?: PdStep;
    pdb?: Pdb;
    rtb?: Rtb;
}

export interface Adn {
    is_choose?: number;
}

export interface PdMultiStep {
    is_choose?: number;
}

export interface PdStep {
    is_choose?: number;
}

export interface Pdb {
    is_choose?: number;
}

export interface Rtb {
    is_choose?: number;
    settlement_type?: number;
}

export type ICpOptionKey = Record<'partner_ids', number[] | number>
