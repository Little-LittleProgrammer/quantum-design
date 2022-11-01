/**
 * pixiu.CanaryDeviceScope，切量范围
 */
export interface IDeviceScope {
    /**
     * abtest实验组分桶
     */
    abtest_buckets?: string[];
    /**
     * 系统小版本，具体版本70010
     */
    app_ver?: string[];
    /**
     * 厂商黑名单
     */
    brand_black?: string[];
    /**
     * 厂商白名单
     */
    brand_white?: string[];
    /**
     * 切量组分桶
     */
    canary_buckets?: string[];
    /**
     * 渠道黑名单
     */
    channel_black?: string[];
    /**
     * 渠道白名单
     */
    channel_white?: string[];
    /**
     * 设备号,device_id
     */
    device?: string[];
    /**
     * 设备等级，高中低,H高，M中，L低
     */
    device_level?: string[];
    /**
     * 机型
     */
    model?: string[];
    /**
     * 系统版本，Android7,8,9
     */
    os_ver?: string[];
    /**
     * source_uid
     */
    source_uids?: string[];
}

