export class AliClient {
    protected baseUrl: string;
    protected token: string;
    protected orgId: string;

    constructor(token: string) {
        this.baseUrl = 'https://openapi-rdc.aliyuncs.com/oapi/v1';
        this.token = token;
        this.orgId = '5f6426fcdb0493ecef9118ab';
        // this.repoUrl = source.data.repo
        // this.repoName = source?.data?.projectId;
        // this.mrLocalId = source?.data?.codeupMrLocalId;
    }
    protected get getHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-yunxiao-token': this.token,
        }
    }
    
}
