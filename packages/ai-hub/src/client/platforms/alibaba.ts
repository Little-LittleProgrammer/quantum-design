import { ApiPath, Alibaba, ALIBABA_BASE_URL } from '../../enums/constant';
import { isNodeEnv } from '../../utils/client';
import { LLMApi, type ChatOptions, type LLMModel, type SpeechOptions } from '../api';

export class AlibabaClient extends LLMApi {
    path(path: string) {
        let baseUrl = '';

        if (baseUrl.length === 0) {
            const isApp = !isNodeEnv();
            baseUrl = isApp ? ALIBABA_BASE_URL : ApiPath.Alibaba;
        }

        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, baseUrl.length - 1);
        }
        if (!baseUrl.startsWith('http') && !baseUrl.startsWith(ApiPath.Alibaba)) {
            baseUrl = 'https://' + baseUrl;
        }

        console.log('[Proxy Endpoint] ', baseUrl, path);

        return [baseUrl, path].join('/');
    }

    extractMessage(res: any) {
        return res?.output?.choices?.at(0)?.message?.content ?? '';
    }

    speech(_options: SpeechOptions): Promise<ArrayBuffer> {
        throw new Error('Method not implemented.');
    }

    async chat(options: ChatOptions) {

    }

    async usage() {
        return {
            used: 0,
            total: 0,
        };
    }

    async models(): Promise<LLMModel[]> {
        return [];
    }
}
