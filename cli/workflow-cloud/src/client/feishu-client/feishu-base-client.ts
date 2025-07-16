import type { IFeishuConfig } from '../../enums/default-options';
import { HttpInvalidTokenList } from '../../enums/http';
import { BaseClient } from '../base-client';
import {Client, withTenantToken, withUserAccessToken} from '@larksuiteoapi/node-sdk';
export class FeishuClient extends BaseClient {
    protected client?: Client;
    protected tenantToken?: string; // 租户
    protected appToken?: string; // 知识库 id
    protected userToken?: string; // 用户 token
    constructor(config: IFeishuConfig) {
        if (!config.appId || !config.appSecret) {
            throw new Error('飞书应用 appId 和 appSecret 未配置');
        }
        super({
            feishuAppId: config.appId,
            feishuAppSecret: config.appSecret,
        });
        this.client = this.getClient();
        if (config.appUserToken) {
            this.userToken = config.appUserToken;
        }
    }

    // 获取飞书 client
    private getClient() {
        const client = new Client(this.getFeishuBaseParams);
        return client;
    }

    // 获取飞书 tenantToken
    async getTenantToken() {
        const res = await this.client?.auth.v3.appAccessToken.internal({
            data: {
                app_id: this.feishuAppId,
                app_secret: this.feishuAppSecret,
            },
        });
        if (!res || res.code !== 0) {
            throw new Error('获取飞书 accessToken 失败');
        }
        this.tenantToken = (res as any).tenant_access_token;
    }

    /**
     * 获取飞书 token, 优先使用 userToken
     * @returns
     */
    async getTokenLark() {
        if (!this.userToken) {
            return this.getTenantTokenLark();
        }
        return withUserAccessToken(this.userToken as string) as any;
    }

    // 获取飞书 tenantToken
    async getTenantTokenLark(): Promise<any> {
        if (!this.tenantToken) {
            await this.getTenantToken();
        }
        return withTenantToken(this.tenantToken as string);
    }

    // 接口失败
    async nativeTryCatch<T >(callback: () => Promise<T>) {
        try {
            const res = await callback();
            if (HttpInvalidTokenList.includes(res.code)) {
                await this.getTenantToken();
                await callback();
            }
            if (!res || res.code !== 0) {
                throw new Error(`飞书接口失败, 原因: ${res.msg}`);
            }
            return res;
        } catch (error) {
            throw new Error('飞书接口调用失败', { cause: error, });
        }
    }
}
