export class BaseClient {
    protected baseUrl: string;
    protected aliToken: string;
    protected aliOrgId: string;
    protected feishuAppId: string;
    protected feishuAppSecret: string;

    constructor(options: {
        feishuAppId?: string;
        aliToken?: string;
        feishuAppSecret?: string;
    }) {
        this.baseUrl = 'https://openapi-rdc.aliyuncs.com/oapi/v1';
        this.aliToken = options.aliToken || '';
        this.aliOrgId = '5f6426fcdb0493ecef9118ab';
        this.feishuAppId = options.feishuAppId || 'cli_a751437852b01013';
        this.feishuAppSecret = options.feishuAppSecret || '';
    }
    protected get getAliHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-yunxiao-token': this.aliToken,
        };
    }

    protected get getFeishuBaseParams() {
        return {
            appId: this.feishuAppId,
            appSecret: this.feishuAppSecret,
        };
    }
}
